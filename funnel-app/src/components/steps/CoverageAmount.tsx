import React, { useEffect } from 'react'
import { useFunnelStore } from '../../store/funnelStore'

export const CoverageAmount: React.FC = () => {
  const { formData, updateFormData, goToNextStep, autoAdvanceEnabled, setAutoAdvanceEnabled } = useFunnelStore()

  // Auto-continue when a selection is made (only if auto-advance is enabled)
  useEffect(() => {
    if (formData.coverageAmount && autoAdvanceEnabled) {
      const timer = setTimeout(() => {
        goToNextStep()
      }, 500) // Small delay for better UX
      return () => clearTimeout(timer)
    }
  }, [formData.coverageAmount, autoAdvanceEnabled, goToNextStep])

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
                checked={formData.coverageAmount === amount}
                onChange={(e) => {
                  updateFormData({ coverageAmount: e.target.value })
                  // Re-enable auto-advance when user makes a selection
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