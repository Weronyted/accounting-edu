import { useEffect } from 'react'
import { onAuthChange } from '@/services/auth.service'
import { getAllProgress } from '@/services/progress.service'
import { useAuthStore } from '@/store/useAuthStore'
import { useProgressStore } from '@/store/useProgressStore'

export function useAuth() {
  const { user, loading, setUser } = useAuthStore()
  const { mergeFromFirestore } = useProgressStore()

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
      }
    })

    return unsubscribe
  }, [setUser, mergeFromFirestore])

  return { user, loading }
}
