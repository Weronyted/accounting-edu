import { StateEffect, StateField } from '@codemirror/state'
import { Decoration, type DecorationSet, EditorView, GutterMarker, gutter } from '@codemirror/view'

/** Dispatch this effect to highlight (or clear) an error line in the editor. */
export const setErrorLine = StateEffect.define<number | null>()

class WarningMarker extends GutterMarker {
  toDOM(): HTMLElement {
    const el = document.createElement('span')
    el.textContent = '⚠'
    el.title = 'Error on this line'
    el.style.cssText = 'color:#ef4444;font-size:11px;line-height:1;cursor:default;'
    return el
  }
}

const errorLineState = StateField.define<number | null>({
  create: () => null,
  update(val, tr) {
    for (const e of tr.effects) {
      if (e.is(setErrorLine)) return e.value
    }
    return val
  },
})

const errorLineDecorations = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(_, tr) {
    const lineNo = tr.state.field(errorLineState)
    if (lineNo === null) return Decoration.none
    try {
      const line = tr.state.doc.line(Math.max(1, lineNo))
      return Decoration.set([Decoration.line({ class: 'cm-error-line' }).range(line.from)])
    } catch {
      return Decoration.none
    }
  },
  provide: (f) => EditorView.decorations.from(f),
})

const errorGutter = gutter({
  lineMarker(view, line) {
    const lineNo = view.state.field(errorLineState)
    if (lineNo === null) return null
    try {
      const l = view.state.doc.line(Math.max(1, lineNo))
      return l.from === line.from ? new WarningMarker() : null
    } catch {
      return null
    }
  },
  initialSpacer: () => new WarningMarker(),
})

export const errorLineExtension = [
  errorLineState,
  errorLineDecorations,
  errorGutter,
  EditorView.baseTheme({
    '.cm-error-line': {
      backgroundColor: 'rgba(239,68,68,0.13) !important',
      outline: '1px solid rgba(239,68,68,0.35)',
    },
  }),
]
