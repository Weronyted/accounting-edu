import { useState, useEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import {
  Users, ClipboardList, Trophy, Loader2, BookOpen,
  UserCircle2, Copy, Check,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { PageTransition } from '@/components/layout/PageTransition'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { getClassGroup, getClassMembers } from '@/services/class.service'
import { listAssignments } from '@/services/admin.service'
import { listSubmissions } from '@/services/submission.service'
import { useAuthStore } from '@/store/useAuthStore'
import { useRoleStore } from '@/store/useRoleStore'
import type { ClassGroup, ClassMember, Assignment, AssignmentSubmission } from '@/types/roles'

type Tab = 'members' | 'assignments' | 'grades'

function scoreColor(pct: number) {
  if (pct >= 80) return 'text-green-600 dark:text-green-400'
  if (pct >= 60) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-500 dark:text-red-400'
}

export function ClassPage() {
  const { classId } = useParams<{ classId: string }>()
  const { user } = useAuthStore()
  const { isTeacher } = useRoleStore()

  const [cls, setCls] = useState<ClassGroup | null>(null)
  const [members, setMembers] = useState<ClassMember[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [allSubmissions, setAllSubmissions] = useState<AssignmentSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('members')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!classId) return
    Promise.all([
      getClassGroup(classId),
      getClassMembers(classId),
      listAssignments(),
    ]).then(async ([group, mems, allAssign]) => {
      if (!group) { setLoading(false); return }
      setCls(group)
      setMembers(mems)

      const published = allAssign.filter((a) => a.published && a.type === 'internal')
      setAssignments(published)

      // Load all submissions for grading view
      const subs = await Promise.all(
        published.map((a) => listSubmissions(a.id))
      )
      setAllSubmissions(subs.flat())
    }).finally(() => setLoading(false))
  }, [classId])

  if (!user) return <Navigate to="/" replace />

  if (loading) {
    return (
      <PageTransition>
        <div className="flex justify-center py-32">
          <Loader2 size={28} className="animate-spin text-slate-400" />
        </div>
      </PageTransition>
    )
  }

  if (!cls) {
    return (
      <PageTransition>
        <div className="max-w-xl mx-auto px-4 py-20 text-center text-slate-500">
          Class not found.
        </div>
      </PageTransition>
    )
  }

  const inviteLink = `${window.location.origin}/join/${cls.inviteCode}`

  function copyLink() {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'members', label: 'Members', icon: Users },
    { id: 'assignments', label: 'Assignments', icon: ClipboardList },
    { id: 'grades', label: 'Grades', icon: Trophy },
  ]

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary-dark/10 flex items-center justify-center shrink-0">
              <Users size={20} className="text-primary dark:text-primary-dark" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-semibold text-slate-900 dark:text-white">
                {cls.name}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Teacher: {cls.teacherName} · {members.length} students
              </p>
            </div>
          </div>

          {/* Invite link — visible to teacher/admin */}
          {isTeacher() && (
            <button
              onClick={copyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0"
            >
              {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy invite link'}
            </button>
          )}
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6 w-fit">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === id
                  ? 'text-slate-900 dark:text-white'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab === id && (
                <motion.div
                  layoutId="class-tab-bg"
                  className="absolute inset-0 bg-white dark:bg-slate-700 rounded-lg shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                <Icon size={14} />
                {label}
              </span>
            </button>
          ))}
        </div>

        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
        >
          {/* ── Members ─────────────────────────────────────── */}
          {tab === 'members' && (
            <Card className="!p-0 overflow-hidden">
              {members.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <Users size={32} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No students yet. Share the invite link!</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {members.map((m) => (
                    <div key={m.uid} className="flex items-center gap-3 px-4 py-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary-dark/10 flex items-center justify-center shrink-0">
                        <UserCircle2 size={18} className="text-primary dark:text-primary-dark" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {m.displayName || '—'}
                        </p>
                        <p className="text-xs text-slate-400">{m.email}</p>
                      </div>
                      <span className="ml-auto text-xs text-slate-400">
                        Joined {new Date(m.joinedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* ── Assignments ──────────────────────────────────── */}
          {tab === 'assignments' && (
            <div className="space-y-3">
              {assignments.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <ClipboardList size={32} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No assignments published yet.</p>
                </div>
              ) : (
                assignments.map((a) => {
                  const mySub = allSubmissions.find(
                    (s) => s.assignmentId === a.id && s.userId === user.uid
                  )
                  return (
                    <Card key={a.id} className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <BookOpen size={14} className="text-primary dark:text-primary-dark shrink-0" />
                          <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
                            {a.title}
                          </p>
                        </div>
                        {a.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                            {a.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {mySub ? (
                          <Badge variant="success">{mySub.percentage}%</Badge>
                        ) : (
                          <Link to={`/assignments/${a.id}`}>
                            <Badge variant="default" className="cursor-pointer hover:opacity-80">
                              Take
                            </Badge>
                          </Link>
                        )}
                      </div>
                    </Card>
                  )
                })
              )}
            </div>
          )}

          {/* ── Grades (teacher view) ─────────────────────────── */}
          {tab === 'grades' && (
            <Card className="!p-0 overflow-hidden">
              {assignments.length === 0 || members.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <Trophy size={32} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No data yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                        <th className="text-left px-4 py-3 font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          Student
                        </th>
                        {assignments.map((a) => (
                          <th
                            key={a.id}
                            className="text-left px-4 py-3 font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap max-w-[120px]"
                          >
                            <span className="truncate block max-w-[120px]">{a.title}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {members.map((m) => (
                        <tr key={m.uid} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                            {m.displayName}
                          </td>
                          {assignments.map((a) => {
                            const sub = allSubmissions.find(
                              (s) => s.assignmentId === a.id && s.userId === m.uid
                            )
                            return (
                              <td key={a.id} className="px-4 py-3">
                                {sub ? (
                                  <span className={`font-medium ${scoreColor(sub.percentage)}`}>
                                    {sub.percentage}%
                                  </span>
                                ) : (
                                  <span className="text-slate-300 dark:text-slate-600">—</span>
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}
        </motion.div>
      </div>
    </PageTransition>
  )
}
