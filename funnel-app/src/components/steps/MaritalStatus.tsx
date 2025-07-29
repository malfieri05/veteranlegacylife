import React, { useEffect } from 'react'
import { useFunnelStore } from '../../store/funnelStore'

export const MaritalStatus: React.FC = () => {
  const { formData, updateFormData, goToNextStep, autoAdvanceEnabled, setAutoAdvanceEnabled } = useFunnelStore()

  // Auto-continue when marital status is selected and auto-advance is enabled
  useEffect(() => {
    if (formData.preQualification?.maritalStatus && autoAdvanceEnabled) {
      const timer = setTimeout(() => {
        goToNextStep()
      }, 500) // Small delay for better UX
      return () => clearTimeout(timer)
    }
  }, [formData.preQualification?.maritalStatus, autoAdvanceEnabled, goToNextStep])

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
                checked={formData.preQualification?.maritalStatus === status}
                onChange={() => {
                  updateFormData({
                    preQualification: {
                      ...formData.preQualification,
                      maritalStatus: status
                    }
                  })
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