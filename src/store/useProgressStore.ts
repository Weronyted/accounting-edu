import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface TopicProgress {
  completed: boolean
  quizScore: number        // 0-100, best score
  quizAttempts: number
  lastVisited: number      // epoch ms
  timeSpentSeconds: number
  bookmarks: string[]      // section IDs
}

interface ProgressStore {
  progress: Record<string, TopicProgress>
  streak: number
  lastActiveDate: string   // ISO date string YYYY-MM-DD

  // Actions
  markVisited: (slug: string) => void
  updateQuizScore: (slug: string, score: number) => void
  markCompleted: (slug: string) => void
  toggleBookmark: (slug: string, sectionId: string) => void
  addTimeSpent: (slug: string, seconds: number) => void
  mergeFromFirestore: (data: Record<string, TopicProgress>) => void
  getTopicProgress: (slug: string) => TopicProgress | undefined
  getCompletedCount: () => number
  getBestScore: (slug: string) => number
}

const DEFAULT_PROGRESS: TopicProgress = {
  completed: false,
  quizScore: 0,
  quizAttempts: 0,
  lastVisited: 0,
  timeSpentSeconds: 0,
  bookmarks: [],
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      progress: {},
      streak: 0,
      lastActiveDate: '',

      markVisited: (slug) => {
        const today = new Date().toISOString().split('T')[0]
        const { lastActiveDate, streak, progress } = get()

        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
        const newStreak = lastActiveDate === yesterday
          ? streak + 1
          : lastActiveDate === today
          ? streak
          : 1

        set({
          lastActiveDate: today,
          streak: newStreak,
          progress: {
            ...progress,
            [slug]: {
              ...(progress[slug] ?? DEFAULT_PROGRESS),
              lastVisited: Date.now(),
            },
          },
        })
      },

      updateQuizScore: (slug, score) => {
        const { progress } = get()
        const existing = progress[slug] ?? DEFAULT_PROGRESS
        set({
          progress: {
            ...progress,
            [slug]: {
              ...existing,
              quizScore: Math.max(existing.quizScore, score),
              quizAttempts: existing.quizAttempts + 1,
            },
          },
        })
      },

      markCompleted: (slug) => {
        const { progress } = get()
        set({
          progress: {
            ...progress,
            [slug]: {
              ...(progress[slug] ?? DEFAULT_PROGRESS),
              completed: true,
            },
          },
        })
      },

      toggleBookmark: (slug, sectionId) => {
        const { progress } = get()
        const existing = progress[slug] ?? DEFAULT_PROGRESS
        const bookmarks = existing.bookmarks.includes(sectionId)
          ? existing.bookmarks.filter((b) => b !== sectionId)
          : [...existing.bookmarks, sectionId]
        set({
          progress: {
            ...progress,
            [slug]: { ...existing, bookmarks },
          },
        })
      },

      addTimeSpent: (slug, seconds) => {
        const { progress } = get()
        const existing = progress[slug] ?? DEFAULT_PROGRESS
        set({
          progress: {
            ...progress,
            [slug]: {
              ...existing,
              timeSpentSeconds: existing.timeSpentSeconds + seconds,
            },
          },
        })
      },

      mergeFromFirestore: (data) => {
        const { progress } = get()
        const merged: Record<string, TopicProgress> = { ...progress }
        for (const [slug, fp] of Object.entries(data)) {
          const local = progress[slug]
          if (!local) {
            merged[slug] = fp
          } else {
            // Firestore wins on score conflicts
            merged[slug] = {
              ...local,
              ...fp,
              quizScore: Math.max(local.quizScore, fp.quizScore),
              quizAttempts: Math.max(local.quizAttempts, fp.quizAttempts),
              bookmarks: Array.from(new Set([...local.bookmarks, ...fp.bookmarks])),
            }
          }
        }
        set({ progress: merged })
      },

      getTopicProgress: (slug) => get().progress[slug],

      getCompletedCount: () =>
        Object.values(get().progress).filter((p) => p.completed).length,

      getBestScore: (slug) => get().progress[slug]?.quizScore ?? 0,
    }),
    { name: 'progress' }
  )
)
