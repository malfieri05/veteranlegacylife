import React, { useEffect } from 'react'
import { useFunnelStore } from '../../store/funnelStore'

export const HeightWeight: React.FC = () => {
  const { formData, updateFormData, goToNextStep } = useFunnelStore()

  // Auto-continue when both height and weight are filled
  useEffect(() => {
    if (formData.medicalAnswers?.height && formData.medicalAnswers?.weight) {
      const timer = setTimeout(() => {
        goToNextStep()
      }, 500) // Small delay for better UX
      return () => clearTimeout(timer)
    }
  }, [formData.medicalAnswers?.height, formData.medicalAnswers?.weight, goToNextStep])

  const handleHeightChange = (value: string) => {
    updateFormData({
      medicalAnswers: {
        ...formData.medicalAnswers,
        height: value
      }
    })
  }

  const handleWeightChange = (value: string) => {
    updateFormData({
      medicalAnswers: {
        ...formData.medicalAnswers,
        weight: value
      }
    })
  }

  const heightOptions = [
    "4'0\"", "4'1\"", "4'2\"", "4'3\"", "4'4\"", "4'5\"", "4'6\"", "4'7\"", "4'8\"", "4'9\"", "4'10\"", "4'11\"",
    "5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"",
    "6'0\"", "6'1\"", "6'2\"", "6'3\"", "6'4\"", "6'5\"", "6'6\"", "6'7\"", "6'8\"", "6'9\"", "6'10\"", "6'11\"",
    "7'0\""
  ]

  const weightOptions = Array.from({ length: 200 }, (_, i) => (i + 100).toString())

  return (
    <div>
      <h2>Medical Questions</h2>
      <p>Let's get some basic health information to find your best options.</p>
      
      <div className="form-field">
        <label>Approximate height and weight?</label>
        
        <div className="form-grid">
          <div>
            <label htmlFor="height">Height (ft/in)</label>
            <input
              type="text"
              id="height"
              name="height"
              placeholder="Select height..."
              value={formData.medicalAnswers?.height || ''}
              onChange={(e) => handleHeightChange(e.target.value)}
              required
              autoComplete="off"
            />
            <div className="dropdown-list" id="height-dropdown">
              {heightOptions.map(height => (
                <div
                  key={height}
                  className="dropdown-item"
                  onClick={() => handleHeightChange(height)}
                >
                  {height}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="weight">Weight (lbs)</label>
            <input
              type="text"
              id="weight"
              name="weight"
              placeholder="Select weight..."
              value={formData.medicalAnswers?.weight || ''}
              onChange={(e) => handleWeightChange(e.target.value)}
              required
              autoComplete="off"
            />
            <div className="dropdown-list" id="weight-dropdown">
              {weightOptions.map(weight => (
                <div
                  key={weight}
                  className="dropdown-item"
                  onClick={() => handleWeightChange(weight)}
                >
                  {weight}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 