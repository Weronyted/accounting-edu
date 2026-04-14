import { useState } from 'react'
import { ShieldCheck, Users, BookOpen, ClipboardList } from 'lucide-react'
import { motion } from 'framer-motion'
import { PageTransition } from '@/components/layout/PageTransition'
import { RoleGuard } from '@/components/auth/RoleGuard'
import { UsersTab } from './admin/UsersTab'
import { LessonsTab } from './admin/LessonsTab'
import { AssignmentsTab } from './admin/AssignmentsTab'
import { useRoleStore } from '@/store/useRoleStore'

type Tab = 'users' | 'lessons' | 'assignments'

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'users', label: 'Users', icon: Users },
  { id: 'lessons', label: 'Lessons', icon: BookOpen },
  { id: 'assignments', label: 'Assignments', icon: ClipboardList },
]

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('users')
  const { role } = useRoleStore()

  return (
    <RoleGuard require="admin">
      <PageTransition>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary-dark/10 flex items-center justify-center">
              <ShieldCheck size={22} className="text-primary dark:text-primary-dark" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-semibold text-slate-900 dark:text-white">
                Admin Panel
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                Logged in as <span className="font-medium">{role}</span>
              </p>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6 w-fit">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === id
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {activeTab === id && (
                  <motion.div
                    layoutId="admin-tab-bg"
                    className="absolute inset-0 bg-white dark:bg-slate-700 rounded-lg shadow-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  <Icon size={15} />
                  {label}
                </span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'users' && <UsersTab />}
            {activeTab === 'lessons' && <LessonsTab />}
            {activeTab === 'assignments' && <AssignmentsTab />}
          </motion.div>
        </div>
      </PageTransition>
    </RoleGuard>
  )
}
