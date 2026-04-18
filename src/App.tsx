import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AuthModal } from '@/components/auth/AuthModal'
import { GlobalSearch } from '@/components/ui/GlobalSearch'
import { Landing } from '@/pages/Landing'
import { Dashboard } from '@/pages/Dashboard'
import { LessonPage } from '@/pages/LessonPage'
import { LessonsListPage } from '@/pages/LessonsListPage'
import { AssignmentsListPage } from '@/pages/AssignmentsListPage'
import { ClassPage } from '@/pages/ClassPage'
import { JoinClass } from '@/pages/JoinClass'
import { Glossary } from '@/pages/Glossary'
import { Profile } from '@/pages/Profile'
import { AdminPanel } from '@/pages/AdminPanel'
import { TakeAssignment } from '@/pages/TakeAssignment'
import { NotFound } from '@/pages/NotFound'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Toaster } from '@/components/ui/Toaster'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { SupportButton } from '@/components/ui/SupportButton'
import { useAuth } from '@/hooks/useAuth'
import { useKeyboard } from '@/hooks/useKeyboard'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/lessons" element={<LessonsListPage />} />
      <Route path="/lessons/:slug" element={<ProtectedRoute><LessonPage /></ProtectedRoute>} />
      <Route path="/assignments" element={<AssignmentsListPage />} />
      <Route path="/assignments/:id" element={<ProtectedRoute><TakeAssignment /></ProtectedRoute>} />
      <Route path="/class/:classId" element={<ProtectedRoute><ClassPage /></ProtectedRoute>} />
      <Route path="/join/:code" element={<JoinClass />} />
      <Route path="/glossary" element={<ProtectedRoute><Glossary /></ProtectedRoute>} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default function App() {
  const [authOpen, setAuthOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useAuth()
  useKeyboard({ onSearchOpen: () => setSearchOpen(true) })

  // Allow any page (e.g. JoinClass) to trigger the auth modal
  useEffect(() => {
    const handler = () => setAuthOpen(true)
    window.addEventListener('open-auth-modal', handler)
    return () => window.removeEventListener('open-auth-modal', handler)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 font-body text-slate-900 dark:text-slate-100">
      <Navbar onSearchOpen={() => setSearchOpen(true)} onSignInOpen={() => setAuthOpen(true)} />

      <main className="flex-1">
        <AppRoutes />
      </main>

      <Footer />

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      <Toaster />
      <ConfirmDialog />
      <SupportButton />
    </div>
  )
}
