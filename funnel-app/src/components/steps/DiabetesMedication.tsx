import React, { useEffect, useRef } from 'react'
import { useFunnelStore } from '../../store/funnelStore'

export const DiabetesMedication: React.FC = () => {
  const { formData, updateFormData, goToNextStep, autoAdvanceEnabled, setAutoAdvanceEnabled } = useFunnelStore()
  const goToNextStepRef = useRef(goToNextStep)
  const hasAdvancedRef = useRef(false)

  // Update the ref when goToNextStep changes
  useEffect(() => {
    goToNextStepRef.current = goToNextStep
  }, [goToNextStep])

  // Auto-continue when a selection is made (only if auto-advance is enabled)
  useEffect(() => {
    if (formData.medicalAnswers?.diabetesMedication && autoAdvanceEnabled && !hasAdvancedRef.current) {
      hasAdvancedRef.current = true
      const timer = setTimeout(() => {
        // Only advance if we're still on step 12
        if (useFunnelStore.getState().currentStep === 12) {
          goToNextStepRef.current()
        }
      }, 200) // Reduced delay for faster response
      return () => clearTimeout(timer)
    }
  }, [formData.medicalAnswers?.diabetesMedication, autoAdvanceEnabled]) // Removed goToNextStep from dependencies

    const handleDiabetesChange = (value: string) => {
    updateFormData({ 
      medicalAnswers: { 
        ...formData.medicalAnswers, 
        diabetesMedication: value 
      } 
    })
    // Re-enable auto-advance when user makes a selection
    setAutoAdvanceEnabled(true)
  }

  return (
    <div>
      <h2>Medical Questions</h2>
      <p>Let's get some basic health information to find your best options.</p>
      
      <div className="form-field">
        <label>Do you take medication for diabetes?</label>
        <div className="radio-options">
          <label>
            <input
              type="radio"
              name="diabetesMedication"
              value="No"
              checked={formData.medicalAnswers?.diabetesMedication === 'No'}
              onChange={(e) => handleDiabetesChange(e.target.value)}
            />
            <span>No</span>
          </label>
          <label>
            <input
              type="radio"
              name="diabetesMedication"
              value="Pills"
              checked={formData.medicalAnswers?.diabetesMedication === 'Pills'}
              onChange={(e) => handleDiabetesChange(e.target.value)}
            />
            <span>Yes</span>
          </label>
          <label>
            <input
              type="radio"
              name="diabetesMedication"
              value="Insulin"
              checked={formData.medicalAnswers?.diabetesMedication === 'Insulin'}
              onChange={(e) => handleDiabetesChange(e.target.value)}
            />
            <span>Yes, I take insulin</span>
          </label>
        </div>
      </div>
    </div>
  )
} 