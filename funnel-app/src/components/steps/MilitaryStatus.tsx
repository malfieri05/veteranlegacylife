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

  // Auto-continue when a selection is made (only if auto-advance is enabled)
  useEffect(() => {
    if (formData.militaryStatus && autoAdvanceEnabled) {
      const timer = setTimeout(() => {
        goToNextStep()
      }, 500) // Small delay for better UX
      return () => clearTimeout(timer)
    }
  }, [formData.militaryStatus, autoAdvanceEnabled, goToNextStep])
  
  const handleMilitaryStatusChange = (value: string) => {
    updateFormData({ militaryStatus: value })
    // Re-enable auto-advance when user makes a selection
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
                checked={formData.militaryStatus === option.value}
                onChange={(e) => handleMilitaryStatusChange(e.target.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
} 