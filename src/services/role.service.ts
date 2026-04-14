import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import type { UserRole, UserRoleRecord } from '@/types/roles'

const OWNER_UID = import.meta.env.VITE_OWNER_UID as string | undefined

export function isOwnerUid(uid: string): boolean {
  return !!OWNER_UID && uid === OWNER_UID
}

/** Get the role for a user. Falls back to 'student' if no record exists. */
export async function getUserRole(uid: string): Promise<UserRole> {
  if (isOwnerUid(uid)) return 'owner'

  const snap = await getDoc(doc(db, 'userRoles', uid))
  if (!snap.exists()) return 'student'
  return (snap.data() as UserRoleRecord).role
}

/**
 * Create or update the userRoles record for a user.
 * Called on every sign-in to keep displayName/email up-to-date.
 * Only updates `role` if the existing role is NOT already set (preserves admin/teacher).
 */
export async function ensureUserRole(
  uid: string,
  displayName: string,
  email: string
): Promise<UserRole> {
  if (isOwnerUid(uid)) return 'owner'

  const ref = doc(db, 'userRoles', uid)
  const snap = await getDoc(ref)

  if (!snap.exists()) {
    await setDoc(ref, {
      role: 'student',
      displayName,
      email,
    })
    return 'student'
  }

  // Update display info but keep existing role
  await updateDoc(ref, { displayName, email })
  return (snap.data() as UserRoleRecord).role
}

/**
 * Assign a role to a user. Caller must be owner or admin.
 * Owner can set any role; admins can only set teacher or student.
 */
export async function setUserRole(
  targetUid: string,
  role: UserRole,
  assignerUid: string
): Promise<void> {
  const ref = doc(db, 'userRoles', targetUid)
  await updateDoc(ref, {
    role,
    assignedBy: assignerUid,
    assignedAt: serverTimestamp(),
  })
}

/** List all users with their roles (admin-only). */
export async function listAllUsers(): Promise<
  Array<{ uid: string; role: UserRole; displayName: string; email: string }>
> {
  const snap = await getDocs(collection(db, 'userRoles'))
  return snap.docs.map((d) => {
    const data = d.data() as UserRoleRecord
    return {
      uid: d.id,
      role: data.role,
      displayName: data.displayName ?? '',
      email: data.email ?? '',
    }
  })
}
