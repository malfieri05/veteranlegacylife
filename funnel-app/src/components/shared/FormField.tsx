import React from 'react'

interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'tel' | 'number' | 'date' | 'select'
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  className?: string
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  options = [],
  className = ''
}) => {
  const hasError = !!error
  
  return (
    <div className={`form-field ${className}`}>
      <label htmlFor={name}>
        {label}
        {required && <span style={{ color: 'var(--secondary-color)' }}> *</span>}
      </label>
      
      {type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={hasError ? 'error' : ''}
        >
          <option value="">{placeholder || 'Select an option'}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={hasError ? 'error' : ''}
        />
      )}
      
      {hasError && (
        <div className="error-message">{error}</div>
      )}
    </div>
  )
} 