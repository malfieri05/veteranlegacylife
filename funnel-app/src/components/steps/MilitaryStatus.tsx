import React from 'react'
import { useFunnelStore } from '../../store/funnelStore'

const militaryOptions = [
  { value: 'Veteran', label: 'Veteran' },
  { value: 'Active Duty', label: 'Active Duty' },
  { value: 'Reserves', label: 'Reserves' },
  { value: 'National Guard', label: 'National Guard' },
  { value: 'Spouse', label: 'Spouse of Veteran/Service Member' },
  { value: 'Other', label: 'Other' }
]

const branchOptions = [
  { value: 'Army', label: 'Army' },
  { value: 'Navy', label: 'Navy' },
  { value: 'Air Force', label: 'Air Force' },
  { value: 'Marines', label: 'Marines' },
  { value: 'Coast Guard', label: 'Coast Guard' },
  { value: 'Space Force', label: 'Space Force' },
  { value: 'Other', label: 'Other' }
]

export const MilitaryStatus: React.FC = () => {
  const { formData, updateFormData } = useFunnelStore()
  
  const handleMilitaryStatusChange = (value: string) => {
    updateFormData({ militaryStatus: value })
  }
  
  const handleBranchChange = (value: string) => {
    updateFormData({ branchOfService: value })
  }
  
  return (
    <div>
      <h2>Military Service Information</h2>
      <p>Please tell us about your military service to help us provide the best options for you.</p>
      
      <div className="form-field">
        <label>Military Status *</label>
        <div className="radio-options">
          {militaryOptions.map((option) => (
            <label key={option.value}>
              <input
                type="radio"
                name="militaryStatus"
                value={option.value}
                checked={formData.militaryStatus === option.value}
                onChange={(e) => handleMilitaryStatusChange(e.target.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      {formData.militaryStatus && formData.militaryStatus !== 'Other' && (
        <div className="form-field">
          <label>Branch of Service *</label>
          <div className="radio-options">
            {branchOptions.map((option) => (
              <label key={option.value}>
                <input
                  type="radio"
                  name="branchOfService"
                  value={option.value}
                  checked={formData.branchOfService === option.value}
                  onChange={(e) => handleBranchChange(e.target.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 