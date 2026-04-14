import { useState, useEffect } from 'react'
import { ClipboardList, Pencil, Trash2, Eye, EyeOff, Loader2, X, Check } from 'lucide-react'
import {
  listAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from '@/services/admin.service'
import { useAuthStore } from '@/store/useAuthStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import type { Assignment } from '@/types/roles'
import { LESSON_META } from '@/lessons'

const EMPTY: Omit<Assignment, 'id' | 'createdAt' | 'teacherId' | 'teacherName'> = {
  title: '',
  description: '',
  lessonSlug: '',
  dueDate: undefined,
  published: false,
  type: 'internal',
}

export function AssignmentsTab() {
  const { user } = useAuthStore()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<typeof EMPTY | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    listAssignments()
      .then(setAssignments)
      .catch(() => setError('Failed to load assignments'))
      .finally(() => setLoading(false))
  }, [])

  function openCreate() {
    setEditId(null)
    setForm({ ...EMPTY })
  }

  function openEdit(a: Assignment) {
    setEditId(a.id)
    setForm({
      title: a.title,
      description: a.description,
      lessonSlug: a.lessonSlug ?? '',
      dueDate: a.dueDate,
      published: a.published,
      type: a.type,
    })
  }

  function closeForm() {
    setForm(null)
    setEditId(null)
    setError('')
  }

  async function handleSave() {
    if (!form || !user) return
    if (!form.title.trim()) {
      setError('Title is required')
      return
    }
    setSaving(true)
    setError('')
    try {
      const payload: Omit<Assignment, 'id' | 'createdAt'> = {
        ...form,
        lessonSlug: form.lessonSlug || undefined,
        teacherId: user.uid,
        teacherName: user.displayName ?? '',
      }

      if (editId) {
        await updateAssignment(editId, payload)
        setAssignments((prev) =>
          prev.map((a) => (a.id === editId ? { ...a, ...payload } : a))
        )
      } else {
        const id = await createAssignment(payload)
        setAssignments((prev) => [{ id, ...payload, createdAt: Date.now() }, ...prev])
      }
      closeForm()
    } catch {
      setError('Failed to save assignment')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this assignment permanently?')) return
    try {
      await deleteAssignment(id)
      setAssignments((prev) => prev.filter((a) => a.id !== id))
    } catch {
      setError('Failed to delete assignment')
    }
  }

  async function togglePublished(a: Assignment) {
    try {
      await updateAssignment(a.id, { published: !a.published })
      setAssignments((prev) =>
        prev.map((x) => (x.id === a.id ? { ...x, published: !x.published } : x))
      )
    } catch {
      setError('Failed to update assignment')
    }
  }

  const lessonOptions = Object.entries(LESSON_META)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <ClipboardList size={20} />
          Assignments
        </h2>
        <Button size="sm" onClick={openCreate}>
          + New Assignment
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      {/* Form */}
      {form !== null && (
        <Card className="border-2 border-primary/30 dark:border-primary-dark/30">
          <h3 className="font-heading font-semibold text-slate-900 dark:text-white mb-4">
            {editId ? 'Edit Assignment' : 'New Assignment'}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Title *
              </label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.title}
                onChange={(e) => setForm((f) => f && { ...f, title: e.target.value })}
                placeholder="Complete Chapter 1 Quiz"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
                value={form.description}
                onChange={(e) => setForm((f) => f && { ...f, description: e.target.value })}
                placeholder="Students should complete the quiz for lesson 1..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Link to Lesson (optional)
              </label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.lessonSlug}
                onChange={(e) => setForm((f) => f && { ...f, lessonSlug: e.target.value })}
              >
                <option value="">— None —</option>
                {lessonOptions.map(([slug, meta]) => (
                  <option key={slug} value={slug}>
                    {meta.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Due Date (optional)
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.dueDate ? new Date(form.dueDate).toISOString().substring(0, 10) : ''}
                onChange={(e) =>
                  setForm((f) =>
                    f && {
                      ...f,
                      dueDate: e.target.value ? new Date(e.target.value).getTime() : undefined,
                    }
                  )
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="assign-pub"
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm((f) => f && { ...f, published: e.target.checked })}
                className="rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary/30"
              />
              <label htmlFor="assign-pub" className="text-sm text-slate-700 dark:text-slate-300">
                Publish immediately
              </label>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Button size="sm" onClick={handleSave} loading={saving}>
              <Check size={14} /> Save
            </Button>
            <Button size="sm" variant="ghost" onClick={closeForm}>
              <X size={14} /> Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 size={24} className="animate-spin text-slate-400" />
        </div>
      ) : assignments.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">
            No assignments yet. Click <strong>+ New Assignment</strong> to create one.
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {assignments.map((a) => (
            <Card key={a.id} className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
                    {a.title}
                  </p>
                  <Badge variant={a.published ? 'success' : 'default'}>
                    {a.published ? 'Published' : 'Draft'}
                  </Badge>
                  {a.type === 'classroom' && (
                    <Badge variant="warning">Google Classroom</Badge>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {a.lessonSlug ? `Lesson: ${LESSON_META[a.lessonSlug]?.title ?? a.lessonSlug}` : 'No lesson'}
                  {a.dueDate ? ` · Due ${new Date(a.dueDate).toLocaleDateString()}` : ''}
                  {a.teacherName ? ` · By ${a.teacherName}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => togglePublished(a)}
                  title={a.published ? 'Unpublish' : 'Publish'}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                >
                  {a.published ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <button
                  onClick={() => openEdit(a)}
                  title="Edit"
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  title="Delete"
                  className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
