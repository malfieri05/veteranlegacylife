import React from 'react'
import { useFunnelStore } from '../../store/funnelStore'

export const ApplicationStep2: React.FC = () => {
  const { formData, updateFormData, submitPartial } = useFunnelStore()

  const handleSSNChange = (value: string) => {
    // Format SSN as XXX-XX-XXXX
    const cleaned = value.replace(/\D/g, '')
    let formatted = cleaned
    if (cleaned.length >= 3) {
      formatted = cleaned.slice(0, 3) + '-' + cleaned.slice(3)
    }
    if (cleaned.length >= 5) {
      formatted = formatted.slice(0, 6) + '-' + cleaned.slice(5)
    }
    if (cleaned.length > 9) {
      formatted = formatted.slice(0, 9)
    }
    
    updateFormData({
      ssn: formatted
    })
    // Trigger partial save after each field change
    setTimeout(() => {
      submitPartial(17, 'Application Step 2')
    }, 500) // Small delay to avoid too many requests
  }

  const handleBankingChange = (field: string, value: string) => {
    updateFormData({
      [field]: value
    })
    // Trigger partial save after each field change
    setTimeout(() => {
      submitPartial(17, 'Application Step 2')
    }, 500) // Small delay to avoid too many requests
  }

  const handlePolicyDateChange = (value: string) => {
    updateFormData({
      policyDate: value
    })
    // Trigger partial save after each field change
    setTimeout(() => {
      submitPartial(17, 'Application Step 2')
    }, 500) // Small delay to avoid too many requests
  }

  return (
    <div>
      <h2>Application Step 2</h2>
      <p>Please provide your SSN, banking, and policy date information.</p>
      
      <div className="form-field">
        <h3>Social Security Number</h3>
        <div>
          <label htmlFor="ssn">SSN *</label>
          <input
            type="text"
            id="ssn"
            name="ssn"
            value={formData.ssn || ''}
            onChange={(e) => handleSSNChange(e.target.value)}
            placeholder="XXX-XX-XXXX"
            maxLength={11}
            required
          />
        </div>
      </div>

      <div className="form-field">
        <h3>Banking Information</h3>
        <div className="form-grid">
          <div>
            <label htmlFor="bankName">Bank Name *</label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              value={formData.bankName || ''}
              onChange={(e) => handleBankingChange('bankName', e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="routingNumber">Routing Number *</label>
            <input
              type="text"
              id="routingNumber"
              name="routingNumber"
              value={formData.routingNumber || ''}
              onChange={(e) => handleBankingChange('routingNumber', e.target.value)}
              placeholder="9 digits"
              maxLength={9}
              required
            />
          </div>
          <div>
            <label htmlFor="accountNumber">Account Number *</label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber || ''}
              onChange={(e) => handleBankingChange('accountNumber', e.target.value)}
              placeholder="Account number"
              required
            />
          </div>
        </div>
      </div>

      <div className="form-field">
        <h3>Policy Information</h3>
        <div>
          <label htmlFor="policyDate">Desired Policy Start Date *</label>
          <input
            type="date"
            id="policyDate"
            name="policyDate"
            value={formData.policyDate || ''}
            onChange={(e) => handlePolicyDateChange(e.target.value)}
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
          <strong>Security Note:</strong> Your SSN and banking information are encrypted and secure. This information is required for policy processing.
        </p>
      </div>

      <div style={{ 
        background: '#f0f9ff', 
        padding: '1rem',
        borderRadius: '8px',
        marginTop: '1rem',
        border: '1px solid #0ea5e9'
      }}>
        <p style={{ 
          color: '#0c4a6e', 
          fontSize: '0.9rem',
          margin: '0'
        }}>
          <strong>Next:</strong> After submitting, you'll receive a confirmation and a licensed agent will contact you within 24 hours to finalize your policy.
        </p>
      </div>
    </div>
  )
} 