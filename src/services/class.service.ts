import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore'
import { db } from './firebase'
import type { ClassGroup, ClassMember } from '@/types/roles'

function generateInviteCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

// ─── Class CRUD ───────────────────────────────────────────────────────────────

export async function createClassGroup(
  name: string,
  teacherId: string,
  teacherName: string
): Promise<ClassGroup> {
  const inviteCode = generateInviteCode()
  const data = {
    name,
    teacherId,
    teacherName,
    inviteCode,
    createdAt: Date.now(),
  }
  const ref = await addDoc(collection(db, 'classGroups'), data)
  return { id: ref.id, ...data }
}

export async function getClassGroup(id: string): Promise<ClassGroup | null> {
  const snap = await getDoc(doc(db, 'classGroups', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...(snap.data() as Omit<ClassGroup, 'id'>) }
}

export async function getClassGroupByCode(code: string): Promise<ClassGroup | null> {
  const snap = await getDocs(
    query(collection(db, 'classGroups'), where('inviteCode', '==', code.toUpperCase()))
  )
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...(d.data() as Omit<ClassGroup, 'id'>) }
}

export async function listTeacherClasses(teacherId: string): Promise<ClassGroup[]> {
  const snap = await getDocs(
    query(collection(db, 'classGroups'), where('teacherId', '==', teacherId))
  )
  const results = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ClassGroup, 'id'>) }))
  return results.sort((a, b) => b.createdAt - a.createdAt)
}

export async function deleteClassGroup(classId: string): Promise<void> {
  await deleteDoc(doc(db, 'classGroups', classId))
}

// ─── Members ──────────────────────────────────────────────────────────────────

export async function joinClassGroup(
  classId: string,
  uid: string,
  displayName: string,
  email: string
): Promise<void> {
  // Add to classGroups/{classId}/members/{uid}
  await setDoc(doc(db, 'classGroups', classId, 'members', uid), {
    uid,
    displayName,
    email,
    joinedAt: Date.now(),
  })
  // Store classId for quick lookup
  await setDoc(doc(db, 'userClasses', uid), { classId, joinedAt: Date.now() })
}

export async function getClassMembers(classId: string): Promise<ClassMember[]> {
  const snap = await getDocs(collection(db, 'classGroups', classId, 'members'))
  return snap.docs.map((d) => d.data() as ClassMember)
}

export async function removeClassMember(classId: string, uid: string): Promise<void> {
  await deleteDoc(doc(db, 'classGroups', classId, 'members', uid))
  await deleteDoc(doc(db, 'userClasses', uid))
}

export async function getUserClassId(uid: string): Promise<string | null> {
  const snap = await getDoc(doc(db, 'userClasses', uid))
  if (!snap.exists()) return null
  return (snap.data() as { classId: string }).classId
}

export async function isClassMember(classId: string, uid: string): Promise<boolean> {
  const snap = await getDoc(doc(db, 'classGroups', classId, 'members', uid))
  return snap.exists()
}
