import React, { useState, useEffect } from 'react'
import { useFunnelStore } from '../../store/funnelStore'

export const Birthday: React.FC = () => {
  const { formData, updateFormData, goToNextStep, autoAdvanceEnabled, setAutoAdvanceEnabled } = useFunnelStore()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)
  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')
  const [year, setYear] = useState('')

  // Initialize from existing dateOfBirth if available
  useEffect(() => {
    if (formData.contactInfo?.dateOfBirth) {
      const parts = formData.contactInfo.dateOfBirth.split('/')
      if (parts.length === 3) {
        setMonth(parts[0])
        setDay(parts[1])
        setYear(parts[2])
      }
    }
  }, [formData.contactInfo?.dateOfBirth])

  // Update dateOfBirth when month, day, or year changes
  useEffect(() => {
    if (month && day && year) {
      const dateString = `${month}/${day}/${year}`
      updateFormData({
        contactInfo: {
          ...formData.contactInfo,
          dateOfBirth: dateString
        }
      })
    }
  }, [month, day, year])

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ]

  const getDaysInMonth = (month: string, year: string) => {
    if (!month || !year) return 31
    const monthNum = parseInt(month)
    const yearNum = parseInt(year)
    return new Date(yearNum, monthNum, 0).getDate()
  }

  const generateDays = () => {
    const daysInMonth = getDaysInMonth(month, year)
    const days = []
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i.toString().padStart(2, '0'))
    }
    return days
  }

  const generateYears = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = currentYear - 18; i >= currentYear - 100; i--) {
      years.push(i.toString())
    }
    return years
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!month || !day || !year) {
      newErrors.dateOfBirth = 'Please complete all date fields'
      // Only set errors if user has attempted to submit or auto-advance is triggered
      if (hasAttemptedSubmit) {
        setErrors(newErrors)
      }
      return false
    }

    const dateString = `${month}/${day}/${year}`
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/
    
    if (!dateRegex.test(dateString)) {
      newErrors.dateOfBirth = 'Please enter a valid date'
      // Only set errors if user has attempted to submit
      if (hasAttemptedSubmit) {
        setErrors(newErrors)
      }
      return false
    }

    // Validate age (must be 18 or older)
    const birthDate = new Date(dateString)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    if (age < 18) {
      newErrors.dateOfBirth = 'You must be at least 18 years old'
    } else if (age > 100) {
      newErrors.dateOfBirth = 'Please enter a valid date of birth'
    }

    // Only set errors if user has attempted to submit
    if (hasAttemptedSubmit) {
      setErrors(newErrors)
    }
    return Object.keys(newErrors).length === 0
  }

  // Auto-continue when all fields are filled and valid (only if auto-advance is enabled)
  useEffect(() => {
    if (autoAdvanceEnabled) {
      // Only validate and show errors if all fields have been touched
      const allFieldsTouched = month && day && year
      
      if (allFieldsTouched) {
        const validation = validateForm()
        if (validation) {
          goToNextStep() // Instant progression
        } else {
          // If form is invalid and auto-advance is enabled, user has attempted to submit
          setHasAttemptedSubmit(true)
          validateForm() // This will now show errors since hasAttemptedSubmit is true
        }
      }
    }
  }, [month, day, year, autoAdvanceEnabled, goToNextStep])

  // Only validate and show errors when user has attempted to submit
  useEffect(() => {
    if (hasAttemptedSubmit && (month || day || year)) {
      validateForm()
    }
  }, [month, day, year, hasAttemptedSubmit])

  return (
    <div>
      <h2>Date of Birth</h2>
      <p>Please provide your date of birth so we can calculate accurate insurance rates for you.</p>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.5rem', 
          fontSize: '1rem', 
          fontWeight: 'bold',
          color: '#374151'
        }}>
          Date of Birth *
        </label>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr 1fr', 
          gap: '0.75rem',
          alignItems: 'end'
        }}>
          {/* Month Dropdown */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.25rem', 
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              Month
            </label>
            <select
              value={month}
              onChange={(e) => {
                setMonth(e.target.value)
                setAutoAdvanceEnabled(true)
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                color: '#374151'
              }}
            >
              <option value="">Select Month</option>
              {months.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          {/* Day Dropdown */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.25rem', 
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              Day
            </label>
            <select
              value={day}
              onChange={(e) => {
                setDay(e.target.value)
                setAutoAdvanceEnabled(true)
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                color: '#374151'
              }}
            >
              <option value="">Day</option>
              {generateDays().map(d => (
                <option key={d} value={d}>{parseInt(d)}</option>
              ))}
            </select>
          </div>

          {/* Year Dropdown */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.25rem', 
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              Year
            </label>
            <select
              value={year}
              onChange={(e) => {
                setYear(e.target.value)
                setAutoAdvanceEnabled(true)
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                color: '#374151'
              }}
            >
              <option value="">Year</option>
              {generateYears().map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
        
        {errors.dateOfBirth && (
          <p style={{ 
            color: '#ef4444', 
            fontSize: '0.875rem', 
            marginTop: '0.5rem'
          }}>
            {errors.dateOfBirth}
          </p>
        )}
      </div>
      
      <div className="security-note">
        <i className="fas fa-shield-alt"></i>
        <span>Your information is secure and will only be used to provide you with insurance quotes.</span>
      </div>
    </div>
  )
} 