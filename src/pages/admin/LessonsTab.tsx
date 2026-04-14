import { useState, useEffect } from 'react'
import {
  BookPlus, Pencil, Trash2, Eye, EyeOff, Loader2, X, Check,
  PlusCircle, Image as ImageIcon, HelpCircle, AlignLeft,
} from 'lucide-react'
import { RichEditor } from '@/components/ui/RichEditor'
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
import type { DynamicLesson, LessonQuizQuestion } from '@/types/roles'

// ─── Empty templates ──────────────────────────────────────────────────────────

function emptyQuizQuestion(): LessonQuizQuestion {
  return {
    id: crypto.randomUUID(),
    text: '',
    options: ['', '', '', ''],
    correctIndex: 0,
  }
}

type FormState = {
  title: string
  slug: string
  description: string
  coverImageUrl: string
  content: string
  quiz: LessonQuizQuestion[]
  published: boolean
}

const EMPTY_FORM: FormState = {
  title: '',
  slug: '',
  description: '',
  coverImageUrl: '',
  content: '',
  quiz: [],
  published: false,
}

// ─── Quiz Question Editor ─────────────────────────────────────────────────────

function QuizQuestionEditor({
  q,
  index,
  onChange,
  onDelete,
}: {
  q: LessonQuizQuestion
  index: number
  onChange: (updated: LessonQuizQuestion) => void
  onDelete: () => void
}) {
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Quiz Question {index + 1}
        </span>
        <button onClick={onDelete} className="p-1 text-red-400 hover:text-red-600">
          <Trash2 size={13} />
        </button>
      </div>

      <textarea
        rows={2}
        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
        value={q.text}
        onChange={(e) => onChange({ ...q, text: e.target.value })}
        placeholder="Question text…"
      />

      <div className="space-y-2">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Options — select the correct one
        </p>
        {q.options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="radio"
              name={`quiz-correct-${q.id}`}
              checked={q.correctIndex === i}
              onChange={() => onChange({ ...q, correctIndex: i })}
              className="text-primary focus:ring-primary/30 shrink-0"
            />
            <input
              className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={opt}
              onChange={(e) => {
                const opts = [...q.options] as [string, string, string, string]
                opts[i] = e.target.value
                onChange({ ...q, options: opts })
              }}
              placeholder={`Option ${i + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Tab ─────────────────────────────────────────────────────────────────

export function LessonsTab() {
  const { user } = useAuthStore()
  const [lessons, setLessons] = useState<DynamicLesson[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<FormState | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [activeSection, setActiveSection] = useState<'content' | 'media' | 'quiz'>('content')

  useEffect(() => {
    listDynamicLessons()
      .then(setLessons)
      .catch(() => setError('Failed to load lessons'))
      .finally(() => setLoading(false))
  }, [])

  function openCreate() {
    setEditId(null)
    setForm({ ...EMPTY_FORM, quiz: [] })
    setActiveSection('content')
  }

  function openEdit(lesson: DynamicLesson) {
    setEditId(lesson.id)
    setForm({
      title: lesson.title,
      slug: lesson.slug,
      description: lesson.description,
      coverImageUrl: lesson.coverImageUrl ?? '',
      content: lesson.content,
      quiz: lesson.quiz ? [...lesson.quiz] : [],
      published: lesson.published,
    })
    setActiveSection('content')
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
      const data = {
        title: form.title,
        slug: form.slug,
        description: form.description,
        coverImageUrl: form.coverImageUrl || undefined,
        content: form.content,
        quiz: form.quiz.length > 0 ? form.quiz : undefined,
        published: form.published,
      }

      if (editId) {
        await updateDynamicLesson(editId, data)
        setLessons((prev) =>
          prev.map((l) =>
            l.id === editId ? { ...l, ...data, updatedAt: Date.now() } : l
          )
        )
      } else {
        const id = await createDynamicLesson(data, user.uid, user.displayName ?? '')
        setLessons((prev) => [
          {
            id,
            ...data,
            coverImageUrl: data.coverImageUrl,
            quiz: data.quiz,
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

  const sectionTabs = [
    { id: 'content' as const, label: 'Content', icon: AlignLeft },
    { id: 'media' as const, label: 'Images & Cover', icon: ImageIcon },
    { id: 'quiz' as const, label: `Quiz (${form?.quiz.length ?? 0})`, icon: HelpCircle },
  ]

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

      {/* ── Form ─────────────────────────────────────────────────────────── */}
      {form !== null && (
        <Card className="border-2 border-primary/30 dark:border-primary-dark/30 space-y-4">
          <h3 className="font-heading font-semibold text-slate-900 dark:text-white">
            {editId ? 'Edit Lesson' : 'New Lesson'}
          </h3>

          {/* Title + slug */}
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
                Short Description
              </label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.description}
                onChange={(e) => setForm((f) => f && { ...f, description: e.target.value })}
                placeholder="Shown on the dashboard card"
              />
            </div>
          </div>

          {/* Section tabs */}
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
            {sectionTabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeSection === id
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>

          {/* ── Content tab ──────────────────────────────────────────────── */}
          {activeSection === 'content' && (
            <RichEditor
              content={form.content}
              onChange={(html) => setForm((f) => f && { ...f, content: html })}
              lessonId={editId ?? undefined}
              placeholder="Start writing your lesson… Use the toolbar to add headings, images, tables and more."
            />
          )}

          {/* ── Media tab ────────────────────────────────────────────────── */}
          {activeSection === 'media' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Cover Image URL (shown at top of lesson)
                </label>
                <input
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={form.coverImageUrl}
                  onChange={(e) => setForm((f) => f && { ...f, coverImageUrl: e.target.value })}
                  placeholder="https://example.com/cover.jpg"
                />
                {form.coverImageUrl && (
                  <img
                    src={form.coverImageUrl}
                    alt="Cover preview"
                    className="mt-2 rounded-lg h-32 w-full object-cover border border-slate-200 dark:border-slate-700"
                    onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                  />
                )}
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Inline images
                </p>
                <p className="text-xs text-slate-400">
                  Use the <strong>image button</strong> in the Content editor toolbar to upload images directly from your computer — no external links needed. You can also drag &amp; drop images into the editor.
                </p>
              </div>
            </div>
          )}

          {/* ── Quiz tab ─────────────────────────────────────────────────── */}
          {activeSection === 'quiz' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Quiz shown at the end of the lesson
                </p>
                <button
                  onClick={() =>
                    setForm((f) => f && { ...f, quiz: [...f.quiz, emptyQuizQuestion()] })
                  }
                  className="flex items-center gap-1.5 text-xs text-primary dark:text-primary-dark hover:underline"
                >
                  <PlusCircle size={12} /> Add question
                </button>
              </div>

              {form.quiz.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                  No quiz questions yet. Click <strong>Add question</strong> above.
                </p>
              ) : (
                form.quiz.map((q, i) => (
                  <QuizQuestionEditor
                    key={q.id}
                    q={q}
                    index={i}
                    onChange={(updated) =>
                      setForm((f) =>
                        f && { ...f, quiz: f.quiz.map((x) => (x.id === q.id ? updated : x)) }
                      )
                    }
                    onDelete={() =>
                      setForm((f) => f && { ...f, quiz: f.quiz.filter((x) => x.id !== q.id) })
                    }
                  />
                ))
              )}
            </div>
          )}

          {/* Publish + actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
            <input
              id="pub-check"
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm((f) => f && { ...f, published: e.target.checked })}
              className="rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary/30"
            />
            <label htmlFor="pub-check" className="text-sm text-slate-700 dark:text-slate-300 flex-1">
              Publish (visible to students)
            </label>
            <Button size="sm" onClick={handleSave} loading={saving}>
              <Check size={14} /> Save
            </Button>
            <Button size="sm" variant="ghost" onClick={closeForm}>
              <X size={14} /> Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* ── List ─────────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 size={24} className="animate-spin text-slate-400" />
        </div>
      ) : lessons.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">
            No lessons yet. Click <strong>+ New Lesson</strong> to create one.
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
                  {l.quiz && l.quiz.length > 0 && (
                    <Badge variant="default">{l.quiz.length} quiz questions</Badge>
                  )}
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
