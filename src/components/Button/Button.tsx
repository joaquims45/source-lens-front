import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  icon?: ReactNode
}

const VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-accent text-white hover:bg-accent-muted',
  secondary: 'bg-surface-raised text-text border border-border hover:border-text-dim',
  ghost: 'text-text-muted hover:text-text hover:bg-surface-raised',
}

export function Button({ variant = 'primary', icon, className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}
