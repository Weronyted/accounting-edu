import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Assignment, AssignmentSubmission } from '@/types/roles'

/**
 * Auto-grade a student's answers against the assignment's questions.
 * Returns { score, maxScore, percentage }.
 */
export function gradeSubmission(
  assignment: Assignment,
  answers: Record<string, string>
): { score: number; maxScore: number; percentage: number } {
  const questions = assignment.questions ?? []
  const maxScore = assignment.maxScore ?? questions.reduce((s, q) => s + q.points, 0)

  let score = 0
  for (const q of questions) {
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

  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
  return { score, maxScore, percentage }
}

/** Submit a student's answers. Returns the submission ID. */
export async function submitAssignment(
  assignmentId: string,
  userId: string,
  displayName: string,
  assignment: Assignment,
  answers: Record<string, string>
): Promise<AssignmentSubmission> {
  const { score, maxScore, percentage } = gradeSubmission(assignment, answers)

  const submission: Omit<AssignmentSubmission, 'id'> = {
    userId,
    displayName,
    assignmentId,
    answers,
    score,
    maxScore,
    percentage,
    submittedAt: Date.now(),
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

/** Get a single assignment by ID (for the TakeAssignment page). */
export async function getAssignment(id: string): Promise<Assignment | null> {
  const snap = await getDoc(doc(db, 'assignments', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...(snap.data() as Omit<Assignment, 'id'>) }
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
