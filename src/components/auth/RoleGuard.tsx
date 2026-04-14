import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ShieldOff } from 'lucide-react'
import { useRoleStore } from '@/store/useRoleStore'
import { useAuthStore } from '@/store/useAuthStore'
import type { UserRole } from '@/types/roles'

interface RoleGuardProps {
  /** Minimum role required. Hierarchy: student < teacher < admin < owner */
  require: UserRole | UserRole[]
  children: ReactNode
}

const RANK: Record<UserRole, number> = {
  student: 0,
  teacher: 1,
  admin: 2,
  owner: 3,
}

export function RoleGuard({ require, children }: RoleGuardProps) {
  const { user, loading: authLoading } = useAuthStore()
  const { role, roleLoading } = useRoleStore()

  if (authLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-500">Loading…</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 px-4 text-center">
        <ShieldOff size={40} className="text-slate-300" />
        <p className="text-slate-600 dark:text-slate-400">Sign in to access this page.</p>
      </div>
    )
  }

  const allowed = Array.isArray(require) ? require : [require]
  const userRank = RANK[role ?? 'student']
  const hasAccess = allowed.some((r) => userRank >= RANK[r])

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 px-4 text-center">
        <ShieldOff size={40} className="text-red-400" />
        <h2 className="font-heading text-xl font-semibold text-slate-900 dark:text-white">
          Access Denied
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm">
          You don't have permission to view this page. Contact the site owner if you believe this is
          a mistake.
        </p>
        <Link to="/" className="text-primary dark:text-primary-dark text-sm hover:underline">
          Go back home
        </Link>
      </div>
    )
  }

  return <>{children}</>
}
