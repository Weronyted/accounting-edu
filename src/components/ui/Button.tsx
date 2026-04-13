import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  loading?: boolean
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', children, loading, className, disabled, asChild, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      primary: 'bg-primary dark:bg-primary-dark text-white hover:opacity-90',
      secondary: 'bg-secondary dark:bg-secondary-dark text-white hover:opacity-90',
      outline: 'border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800',
      ghost: 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
      danger: 'bg-danger text-white hover:opacity-90',
    }

    const sizes = {
      sm: 'text-sm px-3 py-1.5 min-h-[36px]',
      md: 'text-sm px-4 py-2 min-h-[44px]',
      lg: 'text-base px-6 py-3 min-h-[52px]',
    }

    const classes = cn(base, variants[variant], sizes[size], className)

    // asChild: render the child element with merged classes
    if (asChild) {
      const child = children as React.ReactElement<{ className?: string }>
      if (!child) return null
      return (
        <child.type
          {...child.props}
          className={cn(classes, child.props.className)}
        />
      )
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
