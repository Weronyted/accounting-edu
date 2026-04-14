import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, Plus, Trash2, Loader2, Copy, Check, ExternalLink, UserMinus,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  createClassGroup,
  listTeacherClasses,
  deleteClassGroup,
  getClassMembers,
  removeClassMember,
} from '@/services/class.service'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from '@/store/useToastStore'
import { confirm } from '@/store/useConfirmStore'
import type { ClassGroup, ClassMember } from '@/types/roles'

export function ClassesTab() {
  const { user } = useAuthStore()
  const [classes, setClasses] = useState<ClassGroup[]>([])
  const [members, setMembers] = useState<Record<string, ClassMember[]>>({})
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    listTeacherClasses(user.uid)
      .then(async (cls) => {
        setClasses(cls)
        const mems: Record<string, ClassMember[]> = {}
        await Promise.all(
          cls.map(async (c) => {
            mems[c.id] = await getClassMembers(c.id)
          })
        )
        setMembers(mems)
      })
      .catch(() => toast.error('Failed to load classes.'))
      .finally(() => setLoading(false))
  }, [user])

  async function handleCreate() {
    if (!user || !newName.trim()) return
    setCreating(true)
    try {
      const cls = await createClassGroup(newName.trim(), user.uid, user.displayName ?? '')
      setClasses((prev) => [cls, ...prev])
      setMembers((prev) => ({ ...prev, [cls.id]: [] }))
      setNewName('')
      setShowForm(false)
      toast.success(`Class "${cls.name}" created.`)
    } catch {
      toast.error('Failed to create class.')
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(classId: string, className: string) {
    const ok = await confirm({
      title: 'Delete class',
      message: `"${className}" will be deleted. Students will lose access.`,
      confirmLabel: 'Delete',
      danger: true,
    })
    if (!ok) return
    await deleteClassGroup(classId)
    setClasses((prev) => prev.filter((c) => c.id !== classId))
    toast.success('Class deleted.')
  }

  async function handleRemoveMember(classId: string, uid: string, name: string) {
    const ok = await confirm({
      title: 'Remove student',
      message: `Remove ${name} from this class?`,
      confirmLabel: 'Remove',
      danger: true,
    })
    if (!ok) return
    await removeClassMember(classId, uid)
    setMembers((prev) => ({
      ...prev,
      [classId]: (prev[classId] ?? []).filter((m) => m.uid !== uid),
    }))
    toast.success(`${name} removed from class.`)
  }

  function copyLink(cls: ClassGroup) {
    const link = `${window.location.origin}/join/${cls.inviteCode}`
    navigator.clipboard.writeText(link)
    setCopiedId(cls.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 size={24} className="animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Users size={20} /> My Classes
        </h2>
        <Button size="sm" onClick={() => setShowForm((v) => !v)}>
          <Plus size={14} /> New Class
        </Button>
      </div>



      {showForm && (
        <Card className="space-y-3">
          <p className="font-medium text-sm text-slate-700 dark:text-slate-300">Create new class</p>
          <div className="flex gap-2">
            <input
              className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Class name (e.g. Accounting 2024 A)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              autoFocus
            />
            <Button size="sm" onClick={handleCreate} loading={creating} disabled={!newName.trim()}>
              Create
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {classes.length === 0 && !showForm ? (
        <Card className="text-center py-10">
          <Users size={32} className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No classes yet. Create one and share the invite link with students.
          </p>
        </Card>
      ) : (
        classes.map((cls) => {
          const mems = members[cls.id] ?? []
          return (
            <Card key={cls.id} className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-semibold text-slate-900 dark:text-white">
                      {cls.name}
                    </h3>
                    <Badge variant="default">{mems.length} students</Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Invite code: <span className="font-mono font-medium">{cls.inviteCode}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => copyLink(cls)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    {copiedId === cls.id
                      ? <><Check size={12} className="text-green-500" /> Copied</>
                      : <><Copy size={12} /> Copy link</>
                    }
                  </button>
                  <Link
                    to={`/class/${cls.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <ExternalLink size={12} /> Open
                  </Link>
                  <button
                    onClick={() => handleDelete(cls.id, cls.name)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {mems.length > 0 && (
                <div className="border-t border-slate-100 dark:border-slate-700 pt-3 space-y-1">
                  {mems.map((m) => (
                    <div
                      key={m.uid}
                      className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 group"
                    >
                      <div>
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {m.displayName || '—'}
                        </span>
                        <span className="text-xs text-slate-400 ml-2">{m.email}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveMember(cls.id, m.uid, m.displayName)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                        title="Remove student"
                      >
                        <UserMinus size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )
        })
      )}
    </div>
  )
}
