import { useState, useEffect } from 'react'
import {
  ClipboardList, Pencil, Trash2, Eye, EyeOff, Loader2,
  X, Check, PlusCircle, ChevronDown, ChevronUp, GripVertical,
} from 'lucide-react'
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
import type { Assignment, AssignmentQuestion, QuestionType } from '@/types/roles'
import { LESSON_META } from '@/lessons'

// ─── Empty templates ──────────────────────────────────────────────────────────

function emptyQuestion(): AssignmentQuestion {
  return {
    id: crypto.randomUUID(),
    text: '',
    type: 'multiple_choice',
    options: ['', '', '', ''],
    correctAnswer: '0',
    points: 1,
  }
}

const EMPTY_FORM = {
  title: '',
  description: '',
  lessonSlug: '',
  dueDate: undefined as number | undefined,
  published: false,
  type: 'internal' as 'internal' | 'classroom',
  questions: [] as AssignmentQuestion[],
}

// ─── Question Editor ──────────────────────────────────────────────────────────

function QuestionEditor({
  q,
  index,
  onChange,
  onDelete,
}: {
  q: AssignmentQuestion
  index: number
  onChange: (updated: AssignmentQuestion) => void
  onDelete: () => void
}) {
  const [open, setOpen] = useState(true)

  function setType(type: QuestionType) {
    const next: AssignmentQuestion = { ...q, type }
    if (type === 'multiple_choice') {
      next.options = ['', '', '', '']
      next.correctAnswer = '0'
    } else if (type === 'true_false') {
      next.options = undefined
      next.correctAnswer = 'true'
    } else {
      next.options = undefined
      next.correctAnswer = ''
    }
    onChange(next)
  }

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60">
        <GripVertical size={14} className="text-slate-300 cursor-grab" />
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex-1">
          Question {index + 1}
        </span>
        <span className="text-xs text-slate-400">{q.points} pt{q.points !== 1 ? 's' : ''}</span>
        <button
          onClick={() => setOpen((o) => !o)}
          className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        >
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <button
          onClick={onDelete}
          className="p-1 rounded text-red-400 hover:text-red-600"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {open && (
        <div className="p-4 space-y-3">
          {/* Question text */}
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              Question text *
            </label>
            <textarea
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              value={q.text}
              onChange={(e) => onChange({ ...q, text: e.target.value })}
              placeholder="Enter the question…"
            />
          </div>

          {/* Type + points row */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Type
              </label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={q.type}
                onChange={(e) => setType(e.target.value as QuestionType)}
              >
                <option value="multiple_choice">Multiple Choice</option>
                <option value="true_false">True / False</option>
                <option value="short_answer">Short Answer</option>
              </select>
            </div>
            <div className="w-24">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Points
              </label>
              <input
                type="number"
                min={1}
                max={100}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={q.points}
                onChange={(e) => onChange({ ...q, points: Number(e.target.value) })}
              />
            </div>
          </div>

          {/* Multiple choice options */}
          {q.type === 'multiple_choice' && (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                Options (select correct answer)
              </label>
              {(q.options ?? []).map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${q.id}`}
                    checked={q.correctAnswer === String(i)}
                    onChange={() => onChange({ ...q, correctAnswer: String(i) })}
                    className="text-primary focus:ring-primary/30 shrink-0"
                  />
                  <input
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    value={opt}
                    onChange={(e) => {
                      const opts = [...(q.options ?? [])]
                      opts[i] = e.target.value
                      onChange({ ...q, options: opts })
                    }}
                    placeholder={`Option ${i + 1}`}
                  />
                  {(q.options?.length ?? 0) > 2 && (
                    <button
                      onClick={() => {
                        const opts = (q.options ?? []).filter((_, idx) => idx !== i)
                        const correct =
                          Number(q.correctAnswer) >= opts.length
                            ? String(opts.length - 1)
                            : q.correctAnswer
                        onChange({ ...q, options: opts, correctAnswer: correct })
                      }}
                      className="p-1 text-slate-400 hover:text-red-400"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              ))}
              {(q.options?.length ?? 0) < 6 && (
                <button
                  onClick={() =>
                    onChange({ ...q, options: [...(q.options ?? []), ''] })
                  }
                  className="text-xs text-primary dark:text-primary-dark hover:underline flex items-center gap-1"
                >
                  <PlusCircle size={12} /> Add option
                </button>
              )}
            </div>
          )}

          {/* True / False */}
          {q.type === 'true_false' && (
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                Correct answer
              </label>
              <div className="flex gap-4">
                {(['true', 'false'] as const).map((v) => (
                  <label key={v} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`tf-${q.id}`}
                      checked={q.correctAnswer === v}
                      onChange={() => onChange({ ...q, correctAnswer: v })}
                      className="text-primary focus:ring-primary/30"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">{v}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Short answer */}
          {q.type === 'short_answer' && (
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Expected answer (case-insensitive match)
              </label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={q.correctAnswer}
                onChange={(e) => onChange({ ...q, correctAnswer: e.target.value })}
                placeholder="Expected answer text"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main Tab ─────────────────────────────────────────────────────────────────

export function AssignmentsTab() {
  const { user } = useAuthStore()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<typeof EMPTY_FORM | null>(null)
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
    setForm({ ...EMPTY_FORM, questions: [] })
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
      questions: a.questions ? [...a.questions] : [],
    })
  }

  function closeForm() {
    setForm(null)
    setEditId(null)
    setError('')
  }

  function addQuestion() {
    setForm((f) => f && { ...f, questions: [...f.questions, emptyQuestion()] })
  }

  function updateQuestion(id: string, updated: AssignmentQuestion) {
    setForm((f) =>
      f && { ...f, questions: f.questions.map((q) => (q.id === id ? updated : q)) }
    )
  }

  function removeQuestion(id: string) {
    setForm((f) => f && { ...f, questions: f.questions.filter((q) => q.id !== id) })
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
      const maxScore = form.questions.reduce((s, q) => s + q.points, 0)
      const payload: Omit<Assignment, 'id' | 'createdAt'> = {
        title: form.title,
        description: form.description,
        lessonSlug: form.lessonSlug || undefined,
        dueDate: form.dueDate,
        published: form.published,
        type: form.type,
        teacherId: user.uid,
        teacherName: user.displayName ?? '',
        questions: form.questions,
        maxScore,
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

      {/* ── Form ─────────────────────────────────────────────────────────── */}
      {form !== null && (
        <Card className="border-2 border-primary/30 dark:border-primary-dark/30 space-y-5">
          <h3 className="font-heading font-semibold text-slate-900 dark:text-white">
            {editId ? 'Edit Assignment' : 'New Assignment'}
          </h3>

          {/* Basic fields */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Title *
              </label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.title}
                onChange={(e) => setForm((f) => f && { ...f, title: e.target.value })}
                placeholder="Chapter 1 Test"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Instructions / Description
              </label>
              <textarea
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                value={form.description}
                onChange={(e) => setForm((f) => f && { ...f, description: e.target.value })}
                placeholder="Instructions for students…"
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
          </div>

          {/* Questions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                Questions
                {form.questions.length > 0 && (
                  <span className="ml-2 text-xs text-slate-400">
                    {form.questions.length} · {form.questions.reduce((s, q) => s + q.points, 0)} pts total
                  </span>
                )}
              </h4>
              <button
                onClick={addQuestion}
                className="flex items-center gap-1.5 text-xs text-primary dark:text-primary-dark hover:underline"
              >
                <PlusCircle size={13} /> Add question
              </button>
            </div>

            {form.questions.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                No questions yet — click <strong>Add question</strong> above.
              </p>
            ) : (
              <div className="space-y-3">
                {form.questions.map((q, i) => (
                  <QuestionEditor
                    key={q.id}
                    q={q}
                    index={i}
                    onChange={(updated) => updateQuestion(q.id, updated)}
                    onDelete={() => removeQuestion(q.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Publish checkbox */}
          <div className="flex items-center gap-2">
            <input
              id="assign-pub"
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm((f) => f && { ...f, published: e.target.checked })}
              className="rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary/30"
            />
            <label htmlFor="assign-pub" className="text-sm text-slate-700 dark:text-slate-300">
              Publish immediately (visible to students)
            </label>
          </div>

          <div className="flex items-center gap-2">
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
                  {a.type === 'classroom' && <Badge variant="warning">Google Classroom</Badge>}
                  {(a.questions?.length ?? 0) > 0 && (
                    <Badge variant="default">{a.questions!.length} questions · {a.maxScore} pts</Badge>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {a.lessonSlug
                    ? `Lesson: ${LESSON_META[a.lessonSlug]?.title ?? a.lessonSlug}`
                    : 'No lesson'}
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
