import React, { useEffect, useState, useRef } from 'react'
import { useFunnelStore } from '../../store/funnelStore'

export const HeightWeight: React.FC = () => {
  const { formData, updateFormData, goToNextStep, autoAdvanceEnabled, setAutoAdvanceEnabled } = useFunnelStore()
  
  // State for searchable dropdowns
  const [heightSearch, setHeightSearch] = useState('')
  const [weightSearch, setWeightSearch] = useState('')
  const [showHeightDropdown, setShowHeightDropdown] = useState(false)
  const [showWeightDropdown, setShowWeightDropdown] = useState(false)
  
  // Refs for dropdown containers
  const heightDropdownRef = useRef<HTMLDivElement>(null)
  const weightDropdownRef = useRef<HTMLDivElement>(null)

  // Auto-continue when both height and weight are filled (only if auto-advance is enabled)
  useEffect(() => {
    if (formData.medicalAnswers?.height && formData.medicalAnswers?.weight && autoAdvanceEnabled) {
      const timer = setTimeout(() => {
        goToNextStep()
      }, 500) // Small delay for better UX
      return () => clearTimeout(timer)
    }
  }, [formData.medicalAnswers?.height, formData.medicalAnswers?.weight, autoAdvanceEnabled, goToNextStep])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (heightDropdownRef.current && !heightDropdownRef.current.contains(event.target as Node)) {
        setShowHeightDropdown(false)
      }
      if (weightDropdownRef.current && !weightDropdownRef.current.contains(event.target as Node)) {
        setShowWeightDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleHeightChange = (value: string) => {
    updateFormData({ 
      medicalAnswers: { 
        ...formData.medicalAnswers, 
        height: value 
      } 
    })
    setHeightSearch('')
    setShowHeightDropdown(false)
    // Re-enable auto-advance when user makes a selection
    setAutoAdvanceEnabled(true)
  }

  const handleWeightChange = (value: string) => {
    updateFormData({ 
      medicalAnswers: { 
        ...formData.medicalAnswers, 
        weight: value 
      } 
    })
    setWeightSearch('')
    setShowWeightDropdown(false)
    // Re-enable auto-advance when user makes a selection
    setAutoAdvanceEnabled(true)
  }

  // Height options from script.js
  const heightOptions = [
    { value: "5'0\"", label: "5'0\"" },
    { value: "5'1\"", label: "5'1\"" },
    { value: "5'2\"", label: "5'2\"" },
    { value: "5'3\"", label: "5'3\"" },
    { value: "5'4\"", label: "5'4\"" },
    { value: "5'5\"", label: "5'5\"" },
    { value: "5'6\"", label: "5'6\"" },
    { value: "5'7\"", label: "5'7\"" },
    { value: "5'8\"", label: "5'8\"" },
    { value: "5'9\"", label: "5'9\"" },
    { value: "5'10\"", label: "5'10\"" },
    { value: "5'11\"", label: "5'11\"" },
    { value: "6'0\"", label: "6'0\"" },
    { value: "6'1\"", label: "6'1\"" },
    { value: "6'2\"", label: "6'2\"" },
    { value: "6'3\"", label: "6'3\"" },
    { value: "6'4\"", label: "6'4\"" },
    { value: "6'5\"", label: "6'5\"" },
    { value: "6'6\"", label: "6'6\"" }
  ]

  // Weight options from script.js (100-300 lbs)
  const weightOptions = Array.from({ length: 201 }, (_, i) => ({
    value: (i + 100).toString(),
    label: `${i + 100} lbs`
  }))

  // Filter options based on search
  const filteredHeightOptions = heightOptions.filter(option =>
    option.label.toLowerCase().includes(heightSearch.toLowerCase())
  )

  const filteredWeightOptions = weightOptions.filter(option =>
    option.label.toLowerCase().includes(weightSearch.toLowerCase())
  )

  const getCurrentHeightLabel = () => {
    const current = heightOptions.find(option => option.value === formData.medicalAnswers?.height)
    return current ? current.label : ''
  }

  const getCurrentWeightLabel = () => {
    const current = weightOptions.find(option => option.value === formData.medicalAnswers?.weight)
    return current ? current.label : ''
  }

  return (
    <div>
      <h2>Medical Questions</h2>
      <p>Let's get some basic health information to find your best options.</p>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        {/* Height Dropdown */}
        <div className="form-field" style={{ flex: '1' }}>
          <label htmlFor="height">
            Height (ft/in)
            <span style={{ color: 'var(--secondary-color)' }}> *</span>
          </label>
          
          <div ref={heightDropdownRef} style={{ position: 'relative' }}>
            <input
              type="text"
              value={showHeightDropdown ? heightSearch : getCurrentHeightLabel()}
              onChange={(e) => {
                setHeightSearch(e.target.value)
                setShowHeightDropdown(true)
              }}
              onFocus={() => {
                setShowHeightDropdown(true)
                setHeightSearch('')
              }}
              placeholder="Type to search height..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                backgroundColor: 'white'
              }}
            />
            
            {showHeightDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                maxHeight: '200px',
                overflowY: 'auto',
                zIndex: 1000
              }}>
                {filteredHeightOptions.length > 0 ? (
                  filteredHeightOptions.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => handleHeightChange(option.value)}
                                             style={{
                         padding: '0.75rem',
                         cursor: 'pointer',
                         borderBottom: '1px solid #f3f4f6'
                       }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f9fafb'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white'
                      }}
                    >
                      {option.label}
                    </div>
                  ))
                ) : (
                  <div style={{
                    padding: '0.75rem',
                    color: '#6b7280',
                    fontStyle: 'italic'
                  }}>
                    No matches found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Weight Dropdown */}
        <div className="form-field" style={{ flex: '1' }}>
          <label htmlFor="weight">
            Weight (lbs)
            <span style={{ color: 'var(--secondary-color)' }}> *</span>
          </label>
          
          <div ref={weightDropdownRef} style={{ position: 'relative' }}>
            <input
              type="text"
              value={showWeightDropdown ? weightSearch : getCurrentWeightLabel()}
              onChange={(e) => {
                setWeightSearch(e.target.value)
                setShowWeightDropdown(true)
              }}
              onFocus={() => {
                setShowWeightDropdown(true)
                setWeightSearch('')
              }}
              placeholder="Type to search weight..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                backgroundColor: 'white'
              }}
            />
            
            {showWeightDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                maxHeight: '200px',
                overflowY: 'auto',
                zIndex: 1000
              }}>
                {filteredWeightOptions.length > 0 ? (
                  filteredWeightOptions.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => handleWeightChange(option.value)}
                      style={{
                        padding: '0.75rem',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f3f4f6'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f9fafb'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white'
                      }}
                    >
                      {option.label}
                    </div>
                  ))
                ) : (
                  <div style={{
                    padding: '0.75rem',
                    color: '#6b7280',
                    fontStyle: 'italic'
                  }}>
                    No matches found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 