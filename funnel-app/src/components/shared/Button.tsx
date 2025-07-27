import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  loading?: boolean
  className?: string
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  className = ''
}) => {
  const baseClasses = 'cta-button'
  const variantClasses = variant === 'secondary' ? 'secondary' : ''
  const disabledClasses = disabled ? 'disabled' : ''
  const loadingClasses = loading ? 'is-loading' : ''
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses} ${disabledClasses} ${loadingClasses} ${className}`}
    >
      {loading && (
        <div className="spinner">
          <div className="loading-spinner"></div>
        </div>
      )}
      <span>{children}</span>
    </button>
  )
} 