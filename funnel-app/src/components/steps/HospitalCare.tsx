import React, { useEffect } from 'react'
import { useFunnelStore } from '../../store/funnelStore'

export const HospitalCare: React.FC = () => {
  const { formData, updateFormData, goToNextStep, autoAdvanceEnabled, setAutoAdvanceEnabled } = useFunnelStore()

  // Auto-continue when a selection is made (only if auto-advance is enabled)
  useEffect(() => {
    if (formData.medicalAnswers?.hospitalCare && autoAdvanceEnabled) {
      const timer = setTimeout(() => {
        goToNextStep()
      }, 500) // Small delay for better UX
      return () => clearTimeout(timer)
    }
  }, [formData.medicalAnswers?.hospitalCare, autoAdvanceEnabled, goToNextStep])

    const handleHospitalChange = (value: string) => {
    updateFormData({ 
      medicalAnswers: { 
        ...formData.medicalAnswers, 
        hospitalCare: value 
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
        <label>Are you currently in a hospital, nursing home, or receiving hospice care?</label>
        <div className="radio-options">
          <label>
            <input
              type="radio"
              name="hospitalCare"
              value="Yes"
              checked={formData.medicalAnswers?.hospitalCare === 'Yes'}
              onChange={(e) => handleHospitalChange(e.target.value)}
            />
            <span>Yes</span>
          </label>
          <label>
            <input
              type="radio"
              name="hospitalCare"
              value="No"
              checked={formData.medicalAnswers?.hospitalCare === 'No'}
              onChange={(e) => handleHospitalChange(e.target.value)}
            />
            <span>No</span>
          </label>
        </div>
      </div>
    </div>
  )
} 