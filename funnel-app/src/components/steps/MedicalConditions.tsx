import React from 'react'
import { useFunnelStore } from '../../store/funnelStore'

export const MedicalConditions: React.FC = () => {
  const { formData, updateFormData } = useFunnelStore()

  const handleConditionChange = (value: string, checked: boolean) => {
    const currentConditions = formData.medicalAnswers?.medicalConditions || []
    let newConditions: string[]

    if (checked) {
      // If "None" is selected, clear all other selections
      if (value === 'None') {
        newConditions = ['None']
      } else {
        // Remove "None" if it was previously selected and add the new condition
        newConditions = currentConditions.filter(c => c !== 'None').concat([value])
      }
    } else {
      // Remove the condition
      newConditions = currentConditions.filter(c => c !== value)
    }

    updateFormData({
      medicalAnswers: {
        ...formData.medicalAnswers,
        medicalConditions: newConditions
      }
    })
  }

  const conditions = [
    { value: 'Cancer', label: 'Cancer (within the last 2 years)' },
    { value: 'HeartAttack', label: 'Heart attack or stroke (within the last 2 years)' },
    { value: 'COPD', label: 'COPD, emphysema, or currently using oxygen' },
    { value: 'Alzheimers', label: "Alzheimer's or dementia" },
    { value: 'KidneyFailure', label: 'Kidney failure or on dialysis' },
    { value: 'None', label: 'None of the above' }
  ]

  return (
    <div>
      <h2>Medical Questions</h2>
      <p>Let's get some basic health information to find your best options.</p>
      
      <div className="form-field">
        <label>
          Have you ever been diagnosed with or treated for any of the following? 
          <span style={{ fontWeight: 400 }}> (Check all that apply)</span>
        </label>
        <div className="checkbox-options">
          {conditions.map(condition => (
            <label key={condition.value}>
              <input
                type="checkbox"
                name="medicalConditions"
                value={condition.value}
                checked={formData.medicalAnswers?.medicalConditions?.includes(condition.value) || false}
                onChange={(e) => handleConditionChange(condition.value, e.target.checked)}
              />
              <span>{condition.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
} 