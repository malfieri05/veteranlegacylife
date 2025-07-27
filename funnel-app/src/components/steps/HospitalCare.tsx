import React from 'react'
import { useFunnelStore } from '../../store/funnelStore'

export const HospitalCare: React.FC = () => {
  const { formData, updateFormData } = useFunnelStore()

  const handleHospitalChange = (value: string) => {
    updateFormData({
      medicalAnswers: {
        ...formData.medicalAnswers,
        hospitalCare: value
      }
    })
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