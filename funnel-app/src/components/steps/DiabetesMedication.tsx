import React, { useEffect } from 'react'
import { useFunnelStore } from '../../store/funnelStore'

export const DiabetesMedication: React.FC = () => {
  const { formData, updateFormData, goToNextStep } = useFunnelStore()

  // Auto-continue when a selection is made
  useEffect(() => {
    if (formData.medicalAnswers?.diabetesMedication) {
      const timer = setTimeout(() => {
        goToNextStep()
      }, 500) // Small delay for better UX
      return () => clearTimeout(timer)
    }
  }, [formData.medicalAnswers?.diabetesMedication, goToNextStep])

  const handleDiabetesChange = (value: string) => {
    updateFormData({
      medicalAnswers: {
        ...formData.medicalAnswers,
        diabetesMedication: value
      }
    })
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
            <span>Yes, I take pills</span>
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