import { useEffect, useState } from 'react'

export function LessonProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function handleScroll() {
      const el = document.documentElement
      const scrollTop = el.scrollTop || document.body.scrollTop
      const scrollHeight = el.scrollHeight - el.clientHeight
      if (scrollHeight <= 0) return
      setProgress(Math.min(100, Math.round((scrollTop / scrollHeight) * 100)))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-slate-200 dark:bg-slate-800">
      <div
        className="h-full bg-primary dark:bg-primary-dark transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
