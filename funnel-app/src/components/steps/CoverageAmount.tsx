import React, { useEffect } from 'react'
import { useFunnelStore } from '../../store/funnelStore'

export const CoverageAmount: React.FC = () => {
  const { formData, updateFormData, goToNextStep, autoAdvanceEnabled, setAutoAdvanceEnabled } = useFunnelStore()

  // Auto-continue when coverage amount is selected and auto-advance is enabled
  useEffect(() => {
    if (formData.preQualification?.coverageAmount && autoAdvanceEnabled) {
      const timer = setTimeout(() => {
        goToNextStep()
      }, 500) // Small delay for better UX
      return () => clearTimeout(timer)
    }
  }, [formData.preQualification?.coverageAmount, autoAdvanceEnabled, goToNextStep])

  return (
    <div>
      <h2>Coverage Amount</h2>
      <p>How much life insurance coverage would you like?</p>
      <div className="form-field">
        <div className="radio-options">
          {['$10,000', '$25,000', '$50,000', '$100,000', '$250,000', '$500,000', '$1,000,000'].map(amount => (
            <label key={amount} className="radio-option">
              <input
                type="radio"
                name="coverageAmount"
                value={amount}
                checked={formData.preQualification?.coverageAmount === amount}
                onChange={() => {
                  updateFormData({
                    preQualification: {
                      ...formData.preQualification,
                      coverageAmount: amount
                    }
                  })
                  setAutoAdvanceEnabled(true)
                }}
              />
              <span>{amount}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
} 