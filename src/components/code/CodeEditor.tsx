import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import CodeMirror, { type ReactCodeMirrorRef } from '@uiw/react-codemirror'
import { html as langHtml } from '@codemirror/lang-html'
import { css as langCss } from '@codemirror/lang-css'
import { javascript as langJs } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import {
  Play,
  RotateCcw,
  Terminal,
  Eye,
  ChevronDown,
  ChevronUp,
  Loader2,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '../../store/useThemeStore'
import { buildSrcdoc } from '../../utils/codeRunner'
import { errorLineExtension, setErrorLine } from './errorLineExt'
import { ErrorHelper } from './ErrorHelper'
import type { ErrorInfo } from '../../utils/errorExplainer'

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = 'html' | 'css' | 'js'

interface ConsoleLine {
  id: number
  level: 'log' | 'warn' | 'info' | 'error'
  args: string[]
}

export interface CodeEditorProps {
  initialHtml?: string
  initialCss?: string
  initialJs?: string
  /** Which tabs are shown/enabled (default: all three) */
  enabledTabs?: TabId[]
  /** Auto-run code on change with debounce */
  autoRun?: boolean
  autoRunDebounce?: number
  /** Editor panel height (CSS value) */
  editorHeight?: string
  /** Optional title shown above the editor */
  title?: string
  /** Called whenever the code changes in any tab */
  onCodeChange?: (html: string, css: string, js: string) => void
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LOOP_TIMEOUT_MS = 10_000
let _lineId = 0
function nextId(): number { return ++_lineId }

const TAB_LABELS: Record<TabId, string> = { html: 'HTML', css: 'CSS', js: 'JS' }

const LEVEL_COLORS: Record<ConsoleLine['level'], string> = {
  log:   'text-gray-700 dark:text-gray-300',
  info:  'text-blue-600  dark:text-blue-400',
  warn:  'text-amber-600 dark:text-amber-400',
  error: 'text-red-600   dark:text-red-400',
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CodeEditor({
  initialHtml = '',
  initialCss  = '',
  initialJs   = '',
  enabledTabs = ['html', 'css', 'js'],
  autoRun     = false,
  autoRunDebounce = 1200,
  editorHeight = '340px',
  title,
  onCodeChange,
}: CodeEditorProps) {
  const { i18n } = useTranslation()
  const isDark = useThemeStore((s) => s.theme === 'dark')
  const isRu   = i18n.language?.startsWith('ru') || i18n.language?.startsWith('uz')

  // ── Editor state ────────────────────────────────────────────────────────────
  const [htmlCode, setHtmlCode] = useState(initialHtml)
  const [cssCode,  setCssCode]  = useState(initialCss)
  const [jsCode,   setJsCode]   = useState(initialJs)
  const [activeTab, setActiveTab] = useState<TabId>(enabledTabs[0] ?? 'html')

  // ── Preview / runtime state ─────────────────────────────────────────────────
  const [srcdoc,      setSrcdoc]      = useState('')
  const [isRunning,   setIsRunning]   = useState(false)
  const [error,       setError]       = useState<ErrorInfo | null>(null)
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLine[]>([])
  const [showConsole, setShowConsole] = useState(true)

  // Mobile preview tab: 'preview' | 'console'
  const [mobileView, setMobileView] = useState<'preview' | 'console'>('preview')

  // ── Refs ────────────────────────────────────────────────────────────────────
  const iframeRef     = useRef<HTMLIFrameElement>(null)
  const jsEditorRef   = useRef<ReactCodeMirrorRef>(null)
  const runIdRef      = useRef('')
  const loopTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const autoRunTimer  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const consoleEndRef = useRef<HTMLDivElement>(null)

  // ── Clear error line highlight ───────────────────────────────────────────────
  const clearErrorLine = useCallback(() => {
    jsEditorRef.current?.view?.dispatch({ effects: [setErrorLine.of(null)] })
  }, [])

  // ── Run ─────────────────────────────────────────────────────────────────────
  const run = useCallback(() => {
    const id = Math.random().toString(36).slice(2)
    runIdRef.current = id

    setIsRunning(true)
    setConsoleLogs([])
    setError(null)
    clearErrorLine()

    setSrcdoc(buildSrcdoc({ html: htmlCode, css: cssCode, js: jsCode, runId: id }))

    // Parent-side infinite-loop watchdog
    if (loopTimerRef.current) clearTimeout(loopTimerRef.current)
    loopTimerRef.current = setTimeout(() => {
      if (runIdRef.current !== id) return
      setIsRunning(false)
      setSrcdoc('')           // kill the iframe
      setError({
        type:      'InfiniteLoop',
        errorType: 'InfiniteLoop',
        message:   isRu
          ? 'Код работал слишком долго — возможно, бесконечный цикл'
          : 'Code ran too long — possible infinite loop',
      })
    }, LOOP_TIMEOUT_MS)
  }, [htmlCode, cssCode, jsCode, isRu, clearErrorLine])

  // ── Reset ───────────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    setHtmlCode(initialHtml)
    setCssCode(initialCss)
    setJsCode(initialJs)
    setSrcdoc('')
    setConsoleLogs([])
    setError(null)
    clearErrorLine()
    if (loopTimerRef.current) clearTimeout(loopTimerRef.current)
    setIsRunning(false)
  }, [initialHtml, initialCss, initialJs, clearErrorLine])

  // ── postMessage listener ─────────────────────────────────────────────────────
  useEffect(() => {
    function onMessage(ev: MessageEvent) {
      // Validate source window AND run token to reject stray messages
      if (ev.source !== iframeRef.current?.contentWindow) return
      const d = ev.data
      if (!d || typeof d !== 'object' || d.runId !== runIdRef.current) return

      if (d.type === 'console') {
        setConsoleLogs((prev) => [
          ...prev,
          { id: nextId(), level: d.level ?? 'log', args: d.args ?? [] },
        ])
      } else if (d.type === 'error') {
        const info: ErrorInfo = {
          type:       d.errorType ?? 'Error',
          errorType:  d.errorType,
          message:    d.message ?? '',
          rawMessage: d.rawMessage,
          lineno:     d.lineno,
          colno:      d.colno,
        }
        setError(info)
        // Highlight error line in the JS editor if we have a line number
        if (d.lineno && jsEditorRef.current?.view) {
          jsEditorRef.current.view.dispatch({ effects: [setErrorLine.of(d.lineno)] })
          // Switch to JS tab so the user sees the highlighted line
          if (enabledTabs.includes('js')) setActiveTab('js')
        }
      } else if (d.type === 'script-done') {
        if (loopTimerRef.current) clearTimeout(loopTimerRef.current)
        setIsRunning(false)
      }
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [enabledTabs])

  // ── Auto-scroll console ──────────────────────────────────────────────────────
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [consoleLogs])

  // ── Auto-run ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!autoRun) return
    if (autoRunTimer.current) clearTimeout(autoRunTimer.current)
    autoRunTimer.current = setTimeout(run, autoRunDebounce)
    return () => { if (autoRunTimer.current) clearTimeout(autoRunTimer.current) }
  }, [htmlCode, cssCode, jsCode, autoRun, autoRunDebounce, run])

  // ── Extensions per tab ───────────────────────────────────────────────────────
  const htmlExtensions = useMemo(() => [langHtml()], [])
  const cssExtensions  = useMemo(() => [langCss()],  [])
  const jsExtensions   = useMemo(() => [langJs(), ...errorLineExtension], [])

  // ── Labels ───────────────────────────────────────────────────────────────────
  const runLabel   = isRu ? 'Запустить' : 'Run'
  const resetLabel = isRu ? 'Сбросить'  : 'Reset'
  const consoleLabel = isRu ? 'Консоль' : 'Console'
  const previewLabel = isRu ? 'Превью'  : 'Preview'
  const emptyLabel   = isRu ? 'Нажми «Запустить», чтобы увидеть результат' : 'Press Run to see the output'

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">

      {/* Title bar */}
      {title && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
          {title}
        </div>
      )}

      {/* ── Toolbar ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 gap-2 flex-wrap">
        {/* Tab selector */}
        <div className="flex gap-1">
          {enabledTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={[
                'px-3 py-1 rounded text-xs font-mono font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500',
                activeTab === tab
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
              ].join(' ')}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={reset}
            title={resetLabel}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">{resetLabel}</span>
          </button>

          <button
            onClick={run}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-sm"
          >
            {isRunning
              ? <Loader2 size={13} className="animate-spin" />
              : <Play size={13} />
            }
            {runLabel}
          </button>
        </div>
      </div>

      {/* ── Split view ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row">

        {/* ── Editor panel ─────────────────────────────────────────────────── */}
        <div className="lg:w-1/2 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* HTML editor */}
          <div style={{ height: editorHeight, display: activeTab === 'html' ? 'block' : 'none', overflow: 'auto' }}>
            {enabledTabs.includes('html') && (
              <CodeMirror
                value={htmlCode}
                onChange={(val) => { setHtmlCode(val); onCodeChange?.(val, cssCode, jsCode) }}
                extensions={htmlExtensions}
                theme={isDark ? oneDark : undefined}
                height={editorHeight}
                style={{ fontSize: 13 }}
                basicSetup={{ lineNumbers: true, foldGutter: false, autocompletion: true }}
              />
            )}
          </div>

          {/* CSS editor */}
          <div style={{ height: editorHeight, display: activeTab === 'css' ? 'block' : 'none', overflow: 'auto' }}>
            {enabledTabs.includes('css') && (
              <CodeMirror
                value={cssCode}
                onChange={(val) => { setCssCode(val); onCodeChange?.(htmlCode, val, jsCode) }}
                extensions={cssExtensions}
                theme={isDark ? oneDark : undefined}
                height={editorHeight}
                style={{ fontSize: 13 }}
                basicSetup={{ lineNumbers: true, foldGutter: false, autocompletion: true }}
              />
            )}
          </div>

          {/* JS editor */}
          <div style={{ height: editorHeight, display: activeTab === 'js' ? 'block' : 'none', overflow: 'auto' }}>
            {enabledTabs.includes('js') && (
              <CodeMirror
                ref={jsEditorRef}
                value={jsCode}
                onChange={(val) => { setJsCode(val); clearErrorLine(); onCodeChange?.(htmlCode, cssCode, val) }}
                extensions={jsExtensions}
                theme={isDark ? oneDark : undefined}
                height={editorHeight}
                style={{ fontSize: 13 }}
                basicSetup={{ lineNumbers: true, foldGutter: false, autocompletion: true }}
              />
            )}
          </div>
        </div>

        {/* ── Preview panel ─────────────────────────────────────────────────── */}
        <div className="lg:w-1/2 flex flex-col min-h-0">

          {/* Mobile view toggle */}
          <div className="flex lg:hidden border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            {(['preview', 'console'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setMobileView(v)}
                className={[
                  'flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors',
                  mobileView === v
                    ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                    : 'text-gray-500 dark:text-gray-400',
                ].join(' ')}
              >
                {v === 'preview' ? <Eye size={13} /> : <Terminal size={13} />}
                {v === 'preview' ? previewLabel : consoleLabel}
              </button>
            ))}
          </div>

          {/* iframe preview */}
          <div
            style={{ height: editorHeight }}
            className={[
              'relative bg-white',
              mobileView !== 'preview' ? 'hidden lg:block' : '',
            ].join(' ')}
          >
            {!srcdoc && (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500 pointer-events-none select-none">
                {emptyLabel}
              </div>
            )}
            {srcdoc && (
              <iframe
                ref={iframeRef}
                title="Code preview"
                sandbox="allow-scripts"
                srcDoc={srcdoc}
                className="w-full h-full border-0 bg-white"
              />
            )}
          </div>

          {/* ── Console ─────────────────────────────────────────────────────── */}
          <div
            className={[
              'border-t border-gray-200 dark:border-gray-700 flex flex-col',
              mobileView !== 'console' ? 'hidden lg:flex' : 'flex',
            ].join(' ')}
          >
            {/* Console header */}
            <button
              onClick={() => setShowConsole((v) => !v)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 w-full text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xs font-medium text-gray-600 dark:text-gray-400"
            >
              <Terminal size={13} />
              {consoleLabel}
              {consoleLogs.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] font-mono">
                  {consoleLogs.length}
                </span>
              )}
              <span className="ml-auto">
                {showConsole ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
              </span>
            </button>

            {/* Console body */}
            {(showConsole || mobileView === 'console') && (
              <div
                className="overflow-y-auto font-mono text-xs bg-gray-950 dark:bg-gray-950"
                style={{ maxHeight: 140, minHeight: 56 }}
              >
                {consoleLogs.length === 0 ? (
                  <p className="px-3 py-2 text-gray-600 select-none italic">
                    {isRu ? '// Вывод консоли появится здесь' : '// Console output will appear here'}
                  </p>
                ) : (
                  consoleLogs.map((line) => (
                    <div
                      key={line.id}
                      className={['flex gap-2 px-3 py-0.5 border-b border-gray-800', LEVEL_COLORS[line.level]].join(' ')}
                    >
                      <span className="text-gray-600 select-none shrink-0">
                        {line.level === 'error' ? '✕' : line.level === 'warn' ? '⚠' : '>'}
                      </span>
                      <span className="break-all whitespace-pre-wrap">{line.args.join(' ')}</span>
                    </div>
                  ))
                )}
                <div ref={consoleEndRef} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Error helper ─────────────────────────────────────────────────────── */}
      {error && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-3">
          <ErrorHelper error={error} onDismiss={() => { setError(null); clearErrorLine() }} />
        </div>
      )}
    </div>
  )
}
