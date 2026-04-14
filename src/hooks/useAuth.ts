import { useEffect } from 'react'
import { onAuthChange } from '@/services/auth.service'
import { getAllProgress } from '@/services/progress.service'
import { ensureUserRole } from '@/services/role.service'
import { getClassGroupByCode, joinClassGroup, isClassMember } from '@/services/class.service'
import { useAuthStore } from '@/store/useAuthStore'
import { useProgressStore } from '@/store/useProgressStore'
import { useRoleStore } from '@/store/useRoleStore'

const PENDING_CLASS_KEY = 'pendingClassCode'

export function useAuth() {
  const { user, loading, setUser } = useAuthStore()
  const { mergeFromFirestore } = useProgressStore()
  const { setRole, setRoleLoading } = useRoleStore()

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        // Merge Firestore progress into local store
        try {
          const firestoreProgress = await getAllProgress(firebaseUser.uid)
          mergeFromFirestore(firestoreProgress)
        } catch (err) {
          console.error('Failed to load Firestore progress', err)
        }

        // Fetch / ensure role record
        try {
          const role = await ensureUserRole(
            firebaseUser.uid,
            firebaseUser.displayName ?? '',
            firebaseUser.email ?? ''
          )
          setRole(role)
        } catch (err) {
          console.error('Failed to load user role', err)
          setRole('student')
        }

        // Auto-join class if there's a pending invite code (e.g. from invite link before sign-in)
        const pendingCode = localStorage.getItem(PENDING_CLASS_KEY)
        if (pendingCode) {
          try {
            const cls = await getClassGroupByCode(pendingCode)
            if (cls) {
              const alreadyIn = await isClassMember(cls.id, firebaseUser.uid)
              if (!alreadyIn) {
                await joinClassGroup(
                  cls.id,
                  firebaseUser.uid,
                  firebaseUser.displayName ?? '',
                  firebaseUser.email ?? ''
                )
              }
            }
            localStorage.removeItem(PENDING_CLASS_KEY)
          } catch (err) {
            console.error('Failed to auto-join class', err)
          }
        }
      } else {
        setRole(null)
      }
    })

    return unsubscribe
  }, [setUser, mergeFromFirestore, setRole, setRoleLoading])

  return { user, loading }
}
