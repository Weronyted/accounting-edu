import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  serverTimestamp,
  query,
  orderBy,
  where,
} from 'firebase/firestore'
import { db } from './firebase'
import type { DynamicLesson, Assignment } from '@/types/roles'

// ─── Dynamic Lessons ──────────────────────────────────────────────────────────

export async function listDynamicLessons(): Promise<DynamicLesson[]> {
  const snap = await getDocs(
    query(collection(db, 'dynamicLessons'), orderBy('createdAt', 'desc'))
  )
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<DynamicLesson, 'id'>) }))
}

export async function getDynamicLessonBySlug(slug: string): Promise<DynamicLesson | null> {
  const snap = await getDocs(
    query(collection(db, 'dynamicLessons'), where('slug', '==', slug), where('published', '==', true))
  )
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...(d.data() as Omit<DynamicLesson, 'id'>) }
}

/** Strip undefined values — Firestore rejects them */
function clean<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as T
}

export async function createDynamicLesson(
  data: Omit<DynamicLesson, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'createdByName'>,
  authorUid: string,
  authorName: string
): Promise<string> {
  const ref = await addDoc(collection(db, 'dynamicLessons'), clean({
    ...data,
    createdBy: authorUid,
    createdByName: authorName,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }))
  return ref.id
}

export async function updateDynamicLesson(
  id: string,
  data: Partial<Omit<DynamicLesson, 'id' | 'createdAt' | 'createdBy' | 'createdByName'>>
): Promise<void> {
  await updateDoc(doc(db, 'dynamicLessons', id), clean({
    ...data,
    updatedAt: serverTimestamp(),
  } as Record<string, unknown>))
}

export async function deleteDynamicLesson(id: string): Promise<void> {
  await deleteDoc(doc(db, 'dynamicLessons', id))
}

// ─── Assignments ──────────────────────────────────────────────────────────────

export async function listAssignments(): Promise<Assignment[]> {
  const snap = await getDocs(
    query(collection(db, 'assignments'), orderBy('createdAt', 'desc'))
  )
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Assignment, 'id'>) }))
}

export async function createAssignment(
  data: Omit<Assignment, 'id' | 'createdAt'>
): Promise<string> {
  const ref = await addDoc(collection(db, 'assignments'), {
    ...data,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateAssignment(
  id: string,
  data: Partial<Omit<Assignment, 'id' | 'createdAt'>>
): Promise<void> {
  await updateDoc(doc(db, 'assignments', id), data)
}

export async function deleteAssignment(id: string): Promise<void> {
  await deleteDoc(doc(db, 'assignments', id))
}
