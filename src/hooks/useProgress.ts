import { useCallback } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useProgressStore } from '@/store/useProgressStore'
import {
  saveTopicProgress,
  saveQuizAttempt,
} from '@/services/progress.service'

/**
 * Abstraction over progress store.
 * Components should use this hook — never call Firestore directly.
 */
export function useProgress(slug?: string) {
  const { user } = useAuthStore()
  const store = useProgressStore()

  const progress = slug ? store.progress[slug] : undefined

  const markVisited = useCallback(
    (topicSlug: string) => {
      store.markVisited(topicSlug)
      if (user) {
        saveTopicProgress(user.uid, topicSlug, {
          lastVisited: Date.now(),
        }).catch(console.error)
      }
    },
    [user, store]
  )

  const submitQuiz = useCallback(
    async (
      topicSlug: string,
      score: number,
      totalQuestions: number,
      answers: Record<string, string>
    ) => {
      store.updateQuizScore(topicSlug, score)
      if (score === 100) {
        store.markCompleted(topicSlug)
      }

      if (user) {
        await Promise.all([
          saveTopicProgress(user.uid, topicSlug, {
            quizScore: Math.max(store.progress[topicSlug]?.quizScore ?? 0, score),
            quizAttempts: (store.progress[topicSlug]?.quizAttempts ?? 0) + 1,
            completed: score === 100,
          }),
          saveQuizAttempt(user.uid, {
            topicSlug,
            score,
            totalQuestions,
            answers,
          }),
        ]).catch(console.error)
      }
    },
    [user, store]
  )

  const toggleBookmark = useCallback(
    (topicSlug: string, sectionId: string) => {
      store.toggleBookmark(topicSlug, sectionId)
      if (user) {
        const updated = store.progress[topicSlug]?.bookmarks ?? []
        saveTopicProgress(user.uid, topicSlug, {
          bookmarks: updated.includes(sectionId)
            ? updated.filter((b) => b !== sectionId)
            : [...updated, sectionId],
        }).catch(console.error)
      }
    },
    [user, store]
  )

  return {
    progress,
    allProgress: store.progress,
    streak: store.streak,
    completedCount: store.getCompletedCount(),
    bestScore: slug ? store.getBestScore(slug) : 0,
    markVisited,
    submitQuiz,
    toggleBookmark,
    markCompleted: store.markCompleted,
  }
}
