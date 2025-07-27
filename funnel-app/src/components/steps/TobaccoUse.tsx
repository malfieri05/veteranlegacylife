import React, { useEffect } from 'react'
import { useFunnelStore } from '../../store/funnelStore'

export const TobaccoUse: React.FC = () => {
  const { formData, updateFormData, goToNextStep } = useFunnelStore()

  // Auto-continue when a selection is made
  useEffect(() => {
    if (formData.medicalAnswers?.tobaccoUse) {
      const timer = setTimeout(() => {
        goToNextStep()
      }, 500) // Small delay for better UX
      return () => clearTimeout(timer)
    }
  }, [formData.medicalAnswers?.tobaccoUse, goToNextStep])

  const handleTobaccoChange = (value: string) => {
    updateFormData({
      medicalAnswers: {
        ...formData.medicalAnswers,
        tobaccoUse: value
      }
    })
  }

  return (
    <div>
      <h2>Medical Questions</h2>
      <p>Let's get some basic health information to find your best options.</p>
      
      <div className="form-field">
        <label>Have you used any form of tobacco or nicotine in the past 12 months?</label>
        <div className="radio-options">
          <label>
            <input
              type="radio"
              name="tobaccoUse"
              value="Yes"
              checked={formData.medicalAnswers?.tobaccoUse === 'Yes'}
              onChange={(e) => handleTobaccoChange(e.target.value)}
            />
            <span>Yes</span>
          </label>
          <label>
            <input
              type="radio"
              name="tobaccoUse"
              value="No"
              checked={formData.medicalAnswers?.tobaccoUse === 'No'}
              onChange={(e) => handleTobaccoChange(e.target.value)}
            />
            <span>No</span>
          </label>
        </div>
      </div>
    </div>
  )
} 