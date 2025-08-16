import React from 'react'
import { useFunnelStore } from '../../store/funnelStore'

export const ApplicationStep1: React.FC = () => {
  const { formData, updateFormData, submitPartial } = useFunnelStore()
  

  
  // Initialize beneficiaries array if it doesn't exist
  const beneficiaries = formData.applicationData?.beneficiaries || [
    { name: '', relationship: '', percentage: 100 }
  ]
  
  const handleAddressChange = (field: string, value: string) => {
    updateFormData({
      applicationData: {
        ...formData.applicationData,
        [field]: value
      }
    })
    
    // Trigger partial save after each field change
    setTimeout(() => {
      submitPartial(16, 'Application Step 1')
    }, 500) // Small delay to avoid too many requests
  }

  const handleBeneficiaryChange = (index: number, field: string, value: string) => {
    console.log(`🎯 handleBeneficiaryChange - Index: ${index}, Field: ${field}, Value: ${value}`)
    
    // For the first beneficiary, also update the direct fields (like VA Number does)
    if (index === 0) {
      if (field === 'name') {
        updateFormData({
          applicationData: {
            ...formData.applicationData,
            beneficiaryName: value
          }
        })
      } else if (field === 'relationship') {
        updateFormData({
          applicationData: {
            ...formData.applicationData,
            beneficiaryRelationship: value
          }
        })
      }
    }
    
    // Also update the beneficiaries array for consistency
    const updatedBeneficiaries = [...beneficiaries]
    updatedBeneficiaries[index] = { ...updatedBeneficiaries[index], [field]: value }
    
    console.log(`🎯 Updated beneficiaries:`, updatedBeneficiaries)
    
    // Recalculate percentages if there are multiple beneficiaries
    if (updatedBeneficiaries.length > 1) {
      const equalPercentage = Math.floor(100 / updatedBeneficiaries.length)
      updatedBeneficiaries.forEach((beneficiary, i) => {
        beneficiary.percentage = i === updatedBeneficiaries.length - 1 
          ? 100 - (equalPercentage * (updatedBeneficiaries.length - 1))
          : equalPercentage
      })
    }
    
    updateFormData({
      applicationData: {
        ...formData.applicationData,
        beneficiaries: updatedBeneficiaries
      }
    })
    
    console.log(`🎯 Form data updated with beneficiaries:`, updatedBeneficiaries)
    
    // Trigger partial save after each field change
    setTimeout(() => {
      submitPartial(16, 'Application Step 1')
    }, 500)
  }

  const addBeneficiary = () => {
    const updatedBeneficiaries = [...beneficiaries, { name: '', relationship: '', percentage: 0 }]
    
    // Recalculate percentages
    const equalPercentage = Math.floor(100 / updatedBeneficiaries.length)
    updatedBeneficiaries.forEach((beneficiary, i) => {
      beneficiary.percentage = i === updatedBeneficiaries.length - 1 
        ? 100 - (equalPercentage * (updatedBeneficiaries.length - 1))
        : equalPercentage
    })
    
    updateFormData({
      applicationData: {
        ...formData.applicationData,
        beneficiaries: updatedBeneficiaries
      }
    })
  }

  const removeBeneficiary = (index: number) => {
    if (beneficiaries.length <= 1) return // Don't remove the last beneficiary
    
    const updatedBeneficiaries = beneficiaries.filter((_, i) => i !== index)
    
    // Recalculate percentages
    const equalPercentage = Math.floor(100 / updatedBeneficiaries.length)
    updatedBeneficiaries.forEach((beneficiary, i) => {
      beneficiary.percentage = i === updatedBeneficiaries.length - 1 
        ? 100 - (equalPercentage * (updatedBeneficiaries.length - 1))
        : equalPercentage
    })
    
    updateFormData({
      applicationData: {
        ...formData.applicationData,
        beneficiaries: updatedBeneficiaries
      }
    })
  }

  const handlePercentageChange = (index: number, value: string) => {
    const percentage = parseInt(value) || 0
    const updatedBeneficiaries = [...beneficiaries]
    updatedBeneficiaries[index].percentage = percentage
    
    updateFormData({
      applicationData: {
        ...formData.applicationData,
        beneficiaries: updatedBeneficiaries
      }
    })
  }

  const handleVAInfoChange = (field: string, value: string) => {
    updateFormData({
      applicationData: {
        ...formData.applicationData,
        [field]: value
      }
    })
    // Trigger partial save after each field change
    setTimeout(() => {
      submitPartial(16, 'Application Step 1')
    }, 500) // Small delay to avoid too many requests
  }

  const handleDriversLicenseChange = (field: string, value: string) => {
    updateFormData({
      applicationData: {
        ...formData.applicationData,
        [field]: value
      }
    })
    // Trigger partial save after each field change
    setTimeout(() => {
      submitPartial(16, 'Application Step 1')
    }, 500) // Small delay to avoid too many requests
  }

  return (
    <div className="application-step1-container">
      <style>
        {`
          @media (max-width: 768px) {
            .application-step1-container h2 {
              font-size: 1.75rem !important;
            }
            .application-step1-container h3 {
              font-size: 1.25rem !important;
            }
            .application-step1-container .form-grid {
              grid-template-columns: 1fr !important;
              gap: 0.75rem !important;
            }
            .application-step1-container .beneficiary-card {
              padding: 0.75rem !important;
            }
            .application-step1-container .add-beneficiary-btn {
              padding: 0.75rem 1rem !important;
              font-size: 0.875rem !important;
            }
          }
          @media (max-width: 480px) {
            .application-step1-container h2 {
              font-size: 1.5rem !important;
            }
            .application-step1-container h3 {
              font-size: 1.125rem !important;
            }
            .application-step1-container .beneficiary-card {
              padding: 0.5rem !important;
            }
            .application-step1-container .add-beneficiary-btn {
              padding: 0.875rem 0.75rem !important;
              font-size: 0.8rem !important;
            }
          }
        `}
      </style>
      <h2>Application Step 1</h2>
      <p>Please provide your address, beneficiary, and VA information.</p>
      

      
      <div className="form-field">
        <h3>Address Information</h3>
        <div className="form-grid">
          <div>
            <label htmlFor="streetAddress">Street Address *</label>
            <input
              type="text"
              id="streetAddress"
              name="streetAddress"
              value={formData.applicationData?.streetAddress || ''}
              onChange={(e) => handleAddressChange('streetAddress', e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="city">City *</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.applicationData?.city || ''}
              onChange={(e) => handleAddressChange('city', e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="state">State *</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.applicationData?.state || ''}
              onChange={(e) => handleAddressChange('state', e.target.value)}
              placeholder="Enter your state"
              required
            />
          </div>
          <div>
            <label htmlFor="zipCode">ZIP Code *</label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.applicationData?.zipCode || ''}
              onChange={(e) => handleAddressChange('zipCode', e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      <div className="form-field">
        <h3>Beneficiary Information</h3>
        
        {beneficiaries.map((beneficiary, index) => (
          <div key={index} className="beneficiary-card" style={{ 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            padding: '1rem', 
            marginBottom: '1rem',
            background: '#f9fafb'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ margin: '0', color: '#374151' }}>Beneficiary {index + 1}</h4>
              {beneficiaries.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeBeneficiary(index)}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              )}
            </div>
            
            <div className="form-grid">
              <div>
                <label htmlFor={`beneficiaryName-${index}`}>Beneficiary Name *</label>
                <input
                  type="text"
                  id={`beneficiaryName-${index}`}
                  name={`beneficiaryName-${index}`}
                  value={beneficiary.name}
                  onChange={(e) => handleBeneficiaryChange(index, 'name', e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor={`beneficiaryRelationship-${index}`}>Relationship *</label>
                <select
                  id={`beneficiaryRelationship-${index}`}
                  name={`beneficiaryRelationship-${index}`}
                  value={beneficiary.relationship}
                  onChange={(e) => handleBeneficiaryChange(index, 'relationship', e.target.value)}
                  required
                >
                  <option value="">Select Relationship</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {beneficiaries.length > 1 && (
                <div>
                  <label htmlFor={`beneficiaryPercentage-${index}`}>Percentage *</label>
                  <input
                    type="number"
                    id={`beneficiaryPercentage-${index}`}
                    name={`beneficiaryPercentage-${index}`}
                    value={beneficiary.percentage}
                    onChange={(e) => handlePercentageChange(index, e.target.value)}
                    min="0"
                    max="100"
                    required
                    style={{ width: '100%' }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        
        <button
          type="button"
          className="add-beneficiary-btn"
          onClick={addBeneficiary}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            cursor: 'pointer',
            marginTop: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span style={{ fontSize: '1rem' }}>+</span>
          Add Beneficiary
        </button>
        
        {beneficiaries.length > 1 && (
          <div style={{ 
            marginTop: '1rem', 
            padding: '0.75rem', 
            background: '#fef3c7', 
            borderRadius: '6px',
            border: '1px solid #f59e0b'
          }}>
            <p style={{ 
              margin: '0', 
              fontSize: '0.875rem', 
              color: '#92400e',
              fontWeight: '500'
            }}>
              <strong>Total Allocation:</strong> {beneficiaries.reduce((sum, b) => sum + b.percentage, 0)}%
              {beneficiaries.reduce((sum, b) => sum + b.percentage, 0) !== 100 && (
                <span style={{ color: '#dc2626', marginLeft: '0.5rem' }}>
                  (Must equal 100%)
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      <div className="form-field">
        <h3>VA Information</h3>
        <div className="form-grid">
          <div>
            <label htmlFor="vaNumber">VA Number *</label>
            <input
              type="text"
              id="vaNumber"
              name="vaNumber"
              value={formData.applicationData?.vaNumber || ''}
              onChange={(e) => handleVAInfoChange('vaNumber', e.target.value)}
              placeholder="Enter your VA number"
              required
            />
          </div>
          <div>
            <label htmlFor="serviceConnected">Service Connected *</label>
            <select
              id="serviceConnected"
              name="serviceConnected"
              value={formData.applicationData?.serviceConnected || ''}
              onChange={(e) => handleVAInfoChange('serviceConnected', e.target.value)}
              required
            >
              <option value="">Select Status</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div>
            <label htmlFor="vaClinicName">VA Clinic Name</label>
            <input
              type="text"
              id="vaClinicName"
              name="vaClinicName"
              value={formData.applicationData?.vaClinicName || ''}
              onChange={(e) => handleVAInfoChange('vaClinicName', e.target.value)}
              placeholder="Enter your VA clinic name if applicable"
            />
          </div>
          <div>
            <label htmlFor="primaryDoctor">Primary Doctor</label>
            <input
              type="text"
              id="primaryDoctor"
              name="primaryDoctor"
              value={formData.applicationData?.primaryDoctor || ''}
              onChange={(e) => handleVAInfoChange('primaryDoctor', e.target.value)}
              placeholder="Enter your primary doctor's name"
            />
          </div>
        </div>
      </div>

      <div className="form-field">
        <h3>Drivers License Information</h3>
        <div className="form-grid">
          <div style={{ flex: '2' }}>
            <label htmlFor="driversLicense">Drivers License Number *</label>
            <input
              type="text"
              id="driversLicense"
              name="driversLicense"
              value={formData.applicationData?.driversLicense || ''}
              onChange={(e) => handleDriversLicenseChange('driversLicense', e.target.value)}
              placeholder="Enter your drivers license number"
              required
            />
          </div>
          <div style={{ flex: '1' }}>
            <label htmlFor="licenseState">License State *</label>
            <select
              id="licenseState"
              name="licenseState"
              value={formData.applicationData?.licenseState || ''}
              onChange={(e) => handleDriversLicenseChange('licenseState', e.target.value)}
              required
            >
              <option value="">Select State</option>
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
              <option value="DC">District of Columbia</option>
            </select>
          </div>
        </div>
      </div>



      <div style={{ 
        background: '#fef3c7', 
        padding: '1rem',
        borderRadius: '8px',
        marginTop: '1rem',
        border: '1px solid #f59e0b'
      }}>
        <p style={{ 
          color: '#92400e', 
          fontSize: '0.9rem',
          margin: '0'
        }}>
          <strong>Note:</strong> All fields marked with * are required.
        </p>
      </div>
    </div>
  )
} 