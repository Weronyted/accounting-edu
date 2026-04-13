import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Fuse from 'fuse.js'
import { Search, X, BookOpen, BookMarked } from 'lucide-react'
import { Modal } from './Modal'
import { LESSON_SLUGS, LESSON_META } from '@/lessons'

interface SearchItem {
  id: string
  title: string
  description: string
  href: string
  type: 'lesson' | 'glossary'
}

const SEARCH_ITEMS: SearchItem[] = [
  ...LESSON_SLUGS.map((slug) => ({
    id: slug,
    title: LESSON_META[slug].title,
    description: LESSON_META[slug].description,
    href: `/lessons/${slug}`,
    type: 'lesson' as const,
  })),
]

interface GlobalSearchProps {
  open: boolean
  onClose: () => void
}

export function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedIdx, setSelectedIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const fuse = useMemo(
    () => new Fuse(SEARCH_ITEMS, { keys: ['title', 'description'], threshold: 0.4 }),
    []
  )

  const results = useMemo(
    () => (query ? fuse.search(query).map((r) => r.item) : SEARCH_ITEMS.slice(0, 6)),
    [query, fuse]
  )

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIdx(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIdx((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIdx]) {
      navigate(results[selectedIdx].href)
      onClose()
    }
  }

  function handleSelect(item: SearchItem) {
    navigate(item.href)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} maxWidth="lg">
      <div className="p-4">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIdx(0) }}
            onKeyDown={handleKeyDown}
            placeholder={t('nav.searchPlaceholder')}
            className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="mt-2 max-h-80 overflow-y-auto">
          <AnimatePresence mode="wait">
            {results.length > 0 ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-0.5"
              >
                {results.map((item, i) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors ${
                      i === selectedIdx
                        ? 'bg-primary/10 dark:bg-primary-dark/20'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {item.type === 'lesson'
                      ? <BookOpen size={16} className="text-primary dark:text-primary-dark mt-0.5 flex-shrink-0" />
                      : <BookMarked size={16} className="text-secondary dark:text-secondary-dark mt-0.5 flex-shrink-0" />
                    }
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{item.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{item.description}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            ) : (
              <p className="text-center text-slate-500 py-8 text-sm">No results found for "{query}"</p>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center gap-4 text-xs text-slate-400">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>Esc close</span>
        </div>
      </div>
    </Modal>
  )
}
