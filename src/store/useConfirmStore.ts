import { create } from 'zustand'

interface ConfirmOptions {
  title: string
  message: string
  confirmLabel?: string
  danger?: boolean
}

interface ConfirmStore {
  open: boolean
  options: ConfirmOptions | null
  resolve: ((value: boolean) => void) | null
  confirm: (options: ConfirmOptions) => Promise<boolean>
  answer: (value: boolean) => void
}

export const useConfirmStore = create<ConfirmStore>((set, get) => ({
  open: false,
  options: null,
  resolve: null,
  confirm: (options) => {
    return new Promise<boolean>((resolve) => {
      set({ open: true, options, resolve })
    })
  },
  answer: (value) => {
    get().resolve?.(value)
    set({ open: false, options: null, resolve: null })
  },
}))

// Helper for use outside components
export const confirm = (options: ConfirmOptions) =>
  useConfirmStore.getState().confirm(options)
