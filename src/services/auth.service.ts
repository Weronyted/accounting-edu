import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  type User,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase'
import { ensureUserRole } from './role.service'

const googleProvider = new GoogleAuthProvider()

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider)
  await ensureUserProfile(result.user)
  return result.user
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email, password)
  await ensureUserProfile(result.user)
  return result.user
}

export async function signUpWithEmail(email: string, password: string, displayName: string): Promise<User> {
  const result = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(result.user, { displayName })
  await ensureUserProfile(result.user)
  return result.user
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth)
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email)
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback)
}

async function ensureUserProfile(user: User): Promise<void> {
  const profileRef = doc(db, 'users', user.uid, 'meta', 'profile')
  const snap = await getDoc(profileRef)

  if (!snap.exists()) {
    await setDoc(profileRef, {
      displayName: user.displayName ?? '',
      email: user.email ?? '',
      photoURL: user.photoURL ?? '',
      createdAt: serverTimestamp(),
      language: localStorage.getItem('language') ?? 'en',
      theme: localStorage.getItem('theme') ?? 'light',
    })
  }

  // Ensure the user has a role record (idempotent)
  await ensureUserRole(user.uid, user.displayName ?? '', user.email ?? '')
}
