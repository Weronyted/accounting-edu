import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AuthModal } from '@/components/auth/AuthModal'
import { GlobalSearch } from '@/components/ui/GlobalSearch'
import { Landing } from '@/pages/Landing'
import { Dashboard } from '@/pages/Dashboard'
import { LessonPage } from '@/pages/LessonPage'
import { Glossary } from '@/pages/Glossary'
import { Profile } from '@/pages/Profile'
import { NotFound } from '@/pages/NotFound'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { useKeyboard } from '@/hooks/useKeyboard'
import { useLanguageStore } from '@/store/useLanguageStore'

function AppRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lessons/:slug" element={<ProtectedRoute><LessonPage /></ProtectedRoute>} />
        <Route path="/glossary" element={<ProtectedRoute><Glossary /></ProtectedRoute>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

function LanguageTransitionOverlay() {
  const { language } = useLanguageStore()
  const [flash, setFlash] = useState(false)
  const [prev, setPrev] = useState(language)

  useEffect(() => {
    if (language !== prev) {
      setFlash(true)
      setPrev(language)
      const t = setTimeout(() => setFlash(false), 400)
      return () => clearTimeout(t)
    }
  }, [language])

  return (
    <AnimatePresence>
      {flash && (
        <motion.div
          key="lang-flash"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] bg-white dark:bg-slate-900 pointer-events-none"
        />
      )}
    </AnimatePresence>
  )
}

export default function App() {
  const [authOpen, setAuthOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  // Initialise auth listener (must be inside Router context)
  useAuth()
  useKeyboard({ onSearchOpen: () => setSearchOpen(true) })

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 font-body text-slate-900 dark:text-slate-100">
      <Navbar onSearchOpen={() => setSearchOpen(true)} onSignInOpen={() => setAuthOpen(true)} />

      <main className="flex-1">
        <AppRoutes />
      </main>

      <Footer />

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      <LanguageTransitionOverlay />
    </div>
  )
}
