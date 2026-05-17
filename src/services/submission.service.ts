import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Assignment, AssignmentSubmission, TestCaseResult } from '@/types/roles'

/**
 * Auto-grade a student's answers against the assignment's questions.
 *
 * For code_task questions, pass pre-computed `codeResults` (from runCodeTask).
 * Score for code_task = (passed tests / total tests) × question.points.
 */
export function gradeSubmission(
  assignment: Assignment,
  answers: Record<string, string>,
  codeResults?: Record<string, TestCaseResult[]>
): { score: number; maxScore: number; percentage: number } {
  const questions = assignment.questions ?? []
  const maxScore = assignment.maxScore ?? questions.reduce((s, q) => s + q.points, 0)

  let score = 0
  for (const q of questions) {
    if (q.type === 'code_task') {
      const results = codeResults?.[q.id] ?? []
      const total   = q.testCases?.length ?? results.length
      if (total === 0) continue
      const passed  = results.filter((r) => r.passed).length
      score += (passed / total) * q.points
    } else {
      const answer = (answers[q.id] ?? '').trim().toLowerCase()
      let correct = false
      if (q.type === 'multiple_choice') {
        correct = answer === q.correctAnswer
      } else if (q.type === 'true_false') {
        correct = answer === q.correctAnswer.toLowerCase()
      } else if (q.type === 'short_answer') {
        correct = answer === q.correctAnswer.trim().toLowerCase()
      }
      if (correct) score += q.points
    }
  }

  // Round to avoid floating-point noise
  score = Math.round(score * 10) / 10
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
  return { score, maxScore, percentage }
}

/** Submit a student's answers. Returns the full submission record. */
export async function submitAssignment(
  assignmentId: string,
  userId: string,
  displayName: string,
  assignment: Assignment,
  answers: Record<string, string>,
  codeResults?: Record<string, TestCaseResult[]>
): Promise<AssignmentSubmission> {
  const { score, maxScore, percentage } = gradeSubmission(assignment, answers, codeResults)

  const submission: Omit<AssignmentSubmission, 'id'> = {
    userId,
    displayName,
    assignmentId,
    answers,
    score,
    maxScore,
    percentage,
    submittedAt: Date.now(),
    ...(codeResults && Object.keys(codeResults).length > 0 ? { codeResults } : {}),
  }

  const ref = await addDoc(
    collection(db, 'assignments', assignmentId, 'submissions'),
    { ...submission, submittedAt: serverTimestamp() }
  )

  return { id: ref.id, ...submission }
}

/** Get a student's own submission for an assignment (most recent). */
export async function getMySubmission(
  assignmentId: string,
  userId: string
): Promise<AssignmentSubmission | null> {
  const snap = await getDocs(
    query(
      collection(db, 'assignments', assignmentId, 'submissions'),
      where('userId', '==', userId)
    )
  )
  if (snap.empty) return null

  const d = snap.docs[0]
  return { id: d.id, ...(d.data() as Omit<AssignmentSubmission, 'id'>) }
}

/** Get a single assignment by ID. */
export async function getAssignment(id: string): Promise<Assignment | null> {
  const snap = await getDoc(doc(db, 'assignments', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...(snap.data() as Omit<Assignment, 'id'>) }
}

/** Teacher manually overrides a submission's grade. */
export async function updateSubmissionGrade(
  assignmentId: string,
  submissionId: string,
  manualScore: number,
  maxScore: number,
  gradedBy: string,
  manualNote?: string,
): Promise<void> {
  const manualPercentage = maxScore > 0 ? Math.round((manualScore / maxScore) * 100) : 0
  await updateDoc(doc(db, 'assignments', assignmentId, 'submissions', submissionId), {
    manualScore,
    manualNote: manualNote ?? '',
    gradedBy,
    score: manualScore,
    percentage: manualPercentage,
  })
}

/** Get all submissions for an assignment (teacher/admin only). */
export async function listSubmissions(assignmentId: string): Promise<AssignmentSubmission[]> {
  const snap = await getDocs(
    collection(db, 'assignments', assignmentId, 'submissions')
  )
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<AssignmentSubmission, 'id'>),
  }))
}

/** Get all submissions made by a student across all assignments. */
export async function getMySubmissions(userId: string): Promise<AssignmentSubmission[]> {
  const assignmentsSnap = await getDocs(collection(db, 'assignments'))
  const assignmentIds = assignmentsSnap.docs.map((d) => d.id)

  const perAssignment = await Promise.all(
    assignmentIds.map((assignmentId) =>
      getDocs(
        query(
          collection(db, 'assignments', assignmentId, 'submissions'),
          where('userId', '==', userId)
        )
      ).then((snap) =>
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<AssignmentSubmission, 'id'>),
        }))
      )
    )
  )

  const results = perAssignment.flat()
  return results.sort((a, b) => {
    const ta = typeof a.submittedAt === 'number' ? a.submittedAt : (a.submittedAt as any)?.toMillis?.() ?? 0
    const tb = typeof b.submittedAt === 'number' ? b.submittedAt : (b.submittedAt as any)?.toMillis?.() ?? 0
    return tb - ta
  })
}
