import React, { useEffect } from 'react'
import { useFunnelStore } from '../../store/funnelStore'
import { FormField } from '../shared/FormField'

export const HeightWeight: React.FC = () => {
  const { formData, updateFormData, goToNextStep, autoAdvanceEnabled, setAutoAdvanceEnabled } = useFunnelStore()

  // Auto-continue when both height and weight are filled (only if auto-advance is enabled)
  useEffect(() => {
    if (formData.medicalAnswers?.height && formData.medicalAnswers?.weight && autoAdvanceEnabled) {
      const timer = setTimeout(() => {
        goToNextStep()
      }, 500) // Small delay for better UX
      return () => clearTimeout(timer)
    }
  }, [formData.medicalAnswers?.height, formData.medicalAnswers?.weight, autoAdvanceEnabled, goToNextStep])

  const handleHeightChange = (value: string) => {
    updateFormData({ 
      medicalAnswers: { 
        ...formData.medicalAnswers, 
        height: value 
      } 
    })
    // Re-enable auto-advance when user makes a selection
    setAutoAdvanceEnabled(true)
  }

  const handleWeightChange = (value: string) => {
    updateFormData({ 
      medicalAnswers: { 
        ...formData.medicalAnswers, 
        weight: value 
      } 
    })
    // Re-enable auto-advance when user makes a selection
    setAutoAdvanceEnabled(true)
  }

  // Height options from script.js
  const heightOptions = [
    { value: "5'0\"", label: "5'0\"" },
    { value: "5'1\"", label: "5'1\"" },
    { value: "5'2\"", label: "5'2\"" },
    { value: "5'3\"", label: "5'3\"" },
    { value: "5'4\"", label: "5'4\"" },
    { value: "5'5\"", label: "5'5\"" },
    { value: "5'6\"", label: "5'6\"" },
    { value: "5'7\"", label: "5'7\"" },
    { value: "5'8\"", label: "5'8\"" },
    { value: "5'9\"", label: "5'9\"" },
    { value: "5'10\"", label: "5'10\"" },
    { value: "5'11\"", label: "5'11\"" },
    { value: "6'0\"", label: "6'0\"" },
    { value: "6'1\"", label: "6'1\"" },
    { value: "6'2\"", label: "6'2\"" },
    { value: "6'3\"", label: "6'3\"" },
    { value: "6'4\"", label: "6'4\"" },
    { value: "6'5\"", label: "6'5\"" },
    { value: "6'6\"", label: "6'6\"" }
  ]

  // Weight options from script.js (100-300 lbs)
  const weightOptions = Array.from({ length: 201 }, (_, i) => ({
    value: (i + 100).toString(),
    label: `${i + 100} lbs`
  }))

  return (
    <div>
      <h2>Medical Questions</h2>
      <p>Let's get some basic health information to find your best options.</p>
      
      <div className="space-y-6">
        <FormField
          label="Height (ft/in)"
          name="height"
          type="select"
          value={formData.medicalAnswers?.height || ''}
          onChange={handleHeightChange}
          options={heightOptions}
          required
          placeholder="Select your height"
        />
        
        <FormField
          label="Weight (lbs)"
          name="weight"
          type="select"
          value={formData.medicalAnswers?.weight || ''}
          onChange={handleWeightChange}
          options={weightOptions}
          required
          placeholder="Select your weight"
        />
      </div>
    </div>
  )
} 