import React, { useEffect } from 'react'
import { useFunnelStore } from '../../store/funnelStore'

const militaryOptions = [
  { value: 'Veteran', label: 'Veteran' },
  { value: 'Active Duty', label: 'Active Duty' },
  { value: 'Reserves', label: 'Reserves' },
  { value: 'National Guard', label: 'National Guard' },
  { value: 'Spouse', label: 'Spouse of Veteran/Service Member' },
  { value: 'Other', label: 'Other' }
]

export const MilitaryStatus: React.FC = () => {
  const { formData, updateFormData, goToNextStep, autoAdvanceEnabled, setAutoAdvanceEnabled } = useFunnelStore()

  // Auto-continue when military status is selected and auto-advance is enabled
  useEffect(() => {
    if (formData.preQualification?.militaryStatus && autoAdvanceEnabled) {
      const timer = setTimeout(() => {
        goToNextStep()
      }, 200) // Reduced delay for faster response
      return () => clearTimeout(timer)
    }
  }, [formData.preQualification?.militaryStatus, autoAdvanceEnabled, goToNextStep])
  
  const handleMilitaryStatusChange = (value: string) => {
    updateFormData({
      preQualification: {
        ...formData.preQualification,
        militaryStatus: value
      }
    })
    setAutoAdvanceEnabled(true)
  }
  
  return (
    <div>
      <h2>Military Status</h2>
      <p>Please select your military status.</p>
      
      <div className="form-field">
        <label>Military Status *</label>
        <div className="radio-options">
          {militaryOptions.map((option) => (
            <label key={option.value} className="radio-option">
              <input
                type="radio"
                name="militaryStatus"
                value={option.value}
                checked={formData.preQualification?.militaryStatus === option.value}
                onChange={() => handleMilitaryStatusChange(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
} 