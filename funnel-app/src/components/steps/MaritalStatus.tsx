import React, { useEffect } from 'react'
import { useFunnelStore } from '../../store/funnelStore'

export const MaritalStatus: React.FC = () => {
  const { formData, updateFormData, goToNextStep } = useFunnelStore()

  // Auto-continue when a selection is made
  useEffect(() => {
    if (formData.maritalStatus) {
      const timer = setTimeout(() => {
        goToNextStep()
      }, 500) // Small delay for better UX
      return () => clearTimeout(timer)
    }
  }, [formData.maritalStatus, goToNextStep])

  return (
    <div>
      <h2>Marital Status</h2>
      <p>Please select your marital status.</p>
      <div className="form-field">
        <div className="radio-options">
          {['Single', 'Married', 'Divorced', 'Widowed'].map(status => (
            <label key={status} className="radio-option">
              <input
                type="radio"
                name="maritalStatus"
                value={status}
                checked={formData.maritalStatus === status}
                onChange={(e) => updateFormData({ maritalStatus: e.target.value })}
              />
              <span>{status}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
} 