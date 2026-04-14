import { useState, useEffect } from 'react'
import { BookPlus, Pencil, Trash2, Eye, EyeOff, Loader2, X, Check } from 'lucide-react'
import {
  listDynamicLessons,
  createDynamicLesson,
  updateDynamicLesson,
  deleteDynamicLesson,
} from '@/services/admin.service'
import { useAuthStore } from '@/store/useAuthStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import type { DynamicLesson } from '@/types/roles'

const EMPTY: Omit<DynamicLesson, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'createdByName'> =
  {
    title: '',
    slug: '',
    description: '',
    content: '',
    published: false,
  }

export function LessonsTab() {
  const { user } = useAuthStore()
  const [lessons, setLessons] = useState<DynamicLesson[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<typeof EMPTY | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    listDynamicLessons()
      .then(setLessons)
      .catch(() => setError('Failed to load lessons'))
      .finally(() => setLoading(false))
  }, [])

  function openCreate() {
    setEditId(null)
    setForm({ ...EMPTY })
  }

  function openEdit(lesson: DynamicLesson) {
    setEditId(lesson.id)
    setForm({
      title: lesson.title,
      slug: lesson.slug,
      description: lesson.description,
      content: lesson.content,
      published: lesson.published,
    })
  }

  function closeForm() {
    setForm(null)
    setEditId(null)
    setError('')
  }

  async function handleSave() {
    if (!form || !user) return
    if (!form.title.trim() || !form.slug.trim()) {
      setError('Title and slug are required')
      return
    }
    setSaving(true)
    setError('')
    try {
      if (editId) {
        await updateDynamicLesson(editId, form)
        setLessons((prev) =>
          prev.map((l) =>
            l.id === editId ? { ...l, ...form, updatedAt: Date.now() } : l
          )
        )
      } else {
        const id = await createDynamicLesson(form, user.uid, user.displayName ?? '')
        setLessons((prev) => [
          {
            id,
            ...form,
            createdBy: user.uid,
            createdByName: user.displayName ?? '',
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          ...prev,
        ])
      }
      closeForm()
    } catch {
      setError('Failed to save lesson')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this lesson permanently?')) return
    try {
      await deleteDynamicLesson(id)
      setLessons((prev) => prev.filter((l) => l.id !== id))
    } catch {
      setError('Failed to delete lesson')
    }
  }

  async function togglePublished(lesson: DynamicLesson) {
    try {
      await updateDynamicLesson(lesson.id, { published: !lesson.published })
      setLessons((prev) =>
        prev.map((l) => (l.id === lesson.id ? { ...l, published: !l.published } : l))
      )
    } catch {
      setError('Failed to update lesson')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <BookPlus size={20} />
          Lessons
        </h2>
        <Button size="sm" onClick={openCreate}>
          + New Lesson
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
            {editId ? 'Edit Lesson' : 'New Lesson'}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Title *
              </label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.title}
                onChange={(e) => setForm((f) => f && { ...f, title: e.target.value })}
                placeholder="Introduction to Accounting"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Slug * (URL path)
              </label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => f && { ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })
                }
                placeholder="intro-to-accounting"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Description
              </label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.description}
                onChange={(e) => setForm((f) => f && { ...f, description: e.target.value })}
                placeholder="A short description shown on the dashboard"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Content (Markdown)
              </label>
              <textarea
                rows={10}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
                value={form.content}
                onChange={(e) => setForm((f) => f && { ...f, content: e.target.value })}
                placeholder="## Introduction&#10;&#10;Write your lesson content in Markdown..."
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="pub-check"
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm((f) => f && { ...f, published: e.target.checked })}
                className="rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary/30"
              />
              <label htmlFor="pub-check" className="text-sm text-slate-700 dark:text-slate-300">
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
      ) : lessons.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">
            No dynamic lessons yet. Click <strong>+ New Lesson</strong> to create one.
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {lessons.map((l) => (
            <Card key={l.id} className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
                    {l.title}
                  </p>
                  <Badge variant={l.published ? 'success' : 'default'}>
                    {l.published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">/{l.slug}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => togglePublished(l)}
                  title={l.published ? 'Unpublish' : 'Publish'}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                >
                  {l.published ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <button
                  onClick={() => openEdit(l)}
                  title="Edit"
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(l.id)}
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
