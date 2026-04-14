import { useState, useEffect } from 'react'
import { UserCog, Loader2, ChevronDown } from 'lucide-react'
import { listAllUsers, setUserRole } from '@/services/role.service'
import { useAuthStore } from '@/store/useAuthStore'
import { useRoleStore } from '@/store/useRoleStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import type { UserRole } from '@/types/roles'

const ROLE_LABELS: Record<UserRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  teacher: 'Teacher',
  student: 'Student',
}

const ROLE_VARIANT: Record<UserRole, 'default' | 'success' | 'warning' | 'danger'> = {
  owner: 'danger',
  admin: 'warning',
  teacher: 'success',
  student: 'default',
}

type UserEntry = { uid: string; role: UserRole; displayName: string; email: string }

export function UsersTab() {
  const { user } = useAuthStore()
  const { isOwner, isAdmin, role: myRole } = useRoleStore()
  const [users, setUsers] = useState<UserEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    listAllUsers()
      .then(setUsers)
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false))
  }, [])

  async function handleRoleChange(targetUid: string, newRole: UserRole) {
    if (!user) return
    setSaving(targetUid)
    try {
      await setUserRole(targetUid, newRole, user.uid)
      setUsers((prev) =>
        prev.map((u) => (u.uid === targetUid ? { ...u, role: newRole } : u))
      )
    } catch {
      setError('Failed to update role')
    } finally {
      setSaving(null)
    }
  }

  const assignableRoles = (targetRole: UserRole): UserRole[] => {
    if (isOwner()) return ['student', 'teacher', 'admin']
    if (isAdmin()) return ['student', 'teacher']
    return []
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <UserCog size={20} />
          User Management
        </h2>
        <span className="text-sm text-slate-500">{users.length} users</span>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <th className="text-left px-4 py-3 font-medium text-slate-600 dark:text-slate-400">
                  User
                </th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 dark:text-slate-400">
                  Email
                </th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 dark:text-slate-400">
                  Role
                </th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 dark:text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {users.map((u) => {
                const isSelf = u.uid === user?.uid
                const isTargetOwner = u.role === 'owner'
                const canEdit = !isSelf && !isTargetOwner && assignableRoles(u.role).length > 0

                return (
                  <tr key={u.uid} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800 dark:text-slate-200">
                        {u.displayName || '—'}
                        {isSelf && (
                          <span className="ml-1.5 text-xs text-slate-400">(you)</span>
                        )}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{u.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={ROLE_VARIANT[u.role]}>{ROLE_LABELS[u.role]}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {canEdit ? (
                        saving === u.uid ? (
                          <Loader2 size={16} className="animate-spin text-slate-400" />
                        ) : (
                          <div className="relative inline-block">
                            <select
                              value={u.role}
                              onChange={(e) =>
                                handleRoleChange(u.uid, e.target.value as UserRole)
                              }
                              className="appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 pr-8 text-sm text-slate-700 dark:text-slate-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30"
                            >
                              {assignableRoles(u.role).map((r) => (
                                <option key={r} value={r}>
                                  {ROLE_LABELS[r]}
                                </option>
                              ))}
                            </select>
                            <ChevronDown
                              size={14}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                            />
                          </div>
                        )
                      ) : (
                        <span className="text-xs text-slate-400">
                          {isSelf ? 'Your account' : isTargetOwner ? 'Owner' : '—'}
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
