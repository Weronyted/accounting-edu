import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'

export interface TopicProgress {
  completed: boolean
  quizScore: number
  quizAttempts: number
  lastVisited: number // epoch ms
  timeSpentSeconds: number
  bookmarks: string[]
}

export interface QuizAttempt {
  topicSlug: string
  score: number
  totalQuestions: number
  answers: Record<string, string>
  submittedAt: number
}

/** Write or merge topic progress for a user */
export async function saveTopicProgress(
  uid: string,
  topicSlug: string,
  data: Partial<TopicProgress>
): Promise<void> {
  const ref = doc(db, 'users', uid, 'progress', topicSlug)
  await setDoc(ref, { ...data, lastVisited: serverTimestamp() }, { merge: true })
}

/** Read all topic progress for a user */
export async function getAllProgress(uid: string): Promise<Record<string, TopicProgress>> {
  const col = collection(db, 'users', uid, 'progress')
  const snap = await getDocs(col)
  const result: Record<string, TopicProgress> = {}
  snap.forEach((d) => {
    const data = d.data()
    result[d.id] = {
      ...data,
      lastVisited: data.lastVisited instanceof Timestamp
        ? data.lastVisited.toMillis()
        : Date.now(),
    } as TopicProgress
  })
  return result
}

/** Read single topic progress */
export async function getTopicProgress(
  uid: string,
  topicSlug: string
): Promise<TopicProgress | null> {
  const ref = doc(db, 'users', uid, 'progress', topicSlug)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  const data = snap.data()
  return {
    ...data,
    lastVisited: data.lastVisited instanceof Timestamp
      ? data.lastVisited.toMillis()
      : Date.now(),
  } as TopicProgress
}

/** Save a quiz attempt */
export async function saveQuizAttempt(
  uid: string,
  attempt: Omit<QuizAttempt, 'submittedAt'>
): Promise<void> {
  const col = collection(db, 'users', uid, 'quizHistory')
  const ref = doc(col)
  await setDoc(ref, { ...attempt, submittedAt: serverTimestamp() })
}

/** Get all quiz history for a user */
export async function getQuizHistory(uid: string): Promise<QuizAttempt[]> {
  const col = collection(db, 'users', uid, 'quizHistory')
  const snap = await getDocs(col)
  return snap.docs.map((d) => {
    const data = d.data()
    return {
      ...data,
      submittedAt: data.submittedAt instanceof Timestamp
        ? data.submittedAt.toMillis()
        : Date.now(),
    } as QuizAttempt
  })
}
