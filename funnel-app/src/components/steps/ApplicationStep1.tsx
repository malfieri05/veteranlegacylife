import React from 'react'
import { useFunnelStore } from '../../store/funnelStore'

export const ApplicationStep1: React.FC = () => {
  const { formData, updateFormData, submitPartial } = useFunnelStore()
  
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

  const handleBeneficiaryChange = (field: string, value: string) => {
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

  const handleDriversLicenseChange = (value: string) => {
    updateFormData({
      applicationData: {
        ...formData.applicationData,
        driversLicense: value
      }
    })
    // Trigger partial save after each field change
    setTimeout(() => {
      submitPartial(16, 'Application Step 1')
    }, 500) // Small delay to avoid too many requests
  }

  return (
    <div>
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
        <div className="form-grid">
          <div>
            <label htmlFor="beneficiaryName">Beneficiary Name *</label>
            <input
              type="text"
              id="beneficiaryName"
              name="beneficiaryName"
              value={formData.applicationData?.beneficiaryName || ''}
              onChange={(e) => handleBeneficiaryChange('beneficiaryName', e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="beneficiaryRelationship">Relationship *</label>
            <select
              id="beneficiaryRelationship"
              name="beneficiaryRelationship"
              value={formData.applicationData?.beneficiaryRelationship || ''}
              onChange={(e) => handleBeneficiaryChange('beneficiaryRelationship', e.target.value)}
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
        </div>
      </div>

      <div className="form-field">
        <h3>VA Information</h3>
        <div className="form-grid">
          <div>
            <label htmlFor="vaNumber">VA Number</label>
            <input
              type="text"
              id="vaNumber"
              name="vaNumber"
              value={formData.applicationData?.vaNumber || ''}
              onChange={(e) => handleVAInfoChange('vaNumber', e.target.value)}
              placeholder="Enter your VA number if applicable"
            />
          </div>
          <div>
            <label htmlFor="serviceConnected">Service Connected Disability</label>
            <select
              id="serviceConnected"
              name="serviceConnected"
              value={formData.applicationData?.serviceConnected || ''}
              onChange={(e) => handleVAInfoChange('serviceConnected', e.target.value)}
            >
              <option value="">Select Option</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-field">
        <h3>Drivers License Information</h3>
        <div>
          <label htmlFor="driversLicense">Drivers License Number *</label>
          <input
            type="text"
            id="driversLicense"
            name="driversLicense"
            value={formData.applicationData?.driversLicense || ''}
            onChange={(e) => handleDriversLicenseChange(e.target.value)}
            placeholder="Enter your drivers license number"
            required
          />
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
          <strong>Note:</strong> All fields marked with * are required. VA information is optional but may help with your application.
        </p>
      </div>
    </div>
  )
} 