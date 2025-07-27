import React, { useEffect } from 'react'
import { useFunnelStore } from '../../store/funnelStore'

export const MaritalStatus: React.FC = () => {
  const { formData, updateFormData, goToNextStep, autoAdvanceEnabled, setAutoAdvanceEnabled } = useFunnelStore()

  // Auto-continue when a selection is made (only if auto-advance is enabled)
  useEffect(() => {
    if (formData.maritalStatus && autoAdvanceEnabled) {
      const timer = setTimeout(() => {
        goToNextStep()
      }, 500) // Small delay for better UX
      return () => clearTimeout(timer)
    }
  }, [formData.maritalStatus, autoAdvanceEnabled, goToNextStep])

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
                onChange={(e) => {
                  updateFormData({ maritalStatus: e.target.value })
                  // Re-enable auto-advance when user makes a selection
                  setAutoAdvanceEnabled(true)
                }}
              />
              <span>{status}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
} 