import React, { useState, useEffect } from 'react'
import { useFunnelStore } from '../../store/funnelStore'
import { FormField } from '../shared/FormField'
import { validateContactInfo } from '../../utils/validation'

export const ContactInfo: React.FC = () => {
  const { formData, updateFormData, goToNextStep, autoAdvanceEnabled, setAutoAdvanceEnabled } = useFunnelStore()
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const handleContactInfoChange = (field: keyof typeof formData.contactInfo, value: string | boolean) => {
    updateFormData({
      contactInfo: {
        ...formData.contactInfo,
        [field]: value
      }
    })
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    
    // Re-enable auto-advance when user makes a change
    setAutoAdvanceEnabled(true)
  }
  
  const validateForm = () => {
    const validation = validateContactInfo(formData.contactInfo)
    setErrors(validation.errors)
    return validation.isValid
  }
  
  // Validate form when component mounts and when form data changes
  React.useEffect(() => {
    if (formData.contactInfo.firstName || formData.contactInfo.lastName || formData.contactInfo.email || formData.contactInfo.phone) {
      validateForm()
    }
  }, [formData.contactInfo])
  
  // Auto-advance when all required fields are filled and form is valid
  useEffect(() => {
    if (autoAdvanceEnabled && validateForm()) {
      const timer = setTimeout(() => {
        goToNextStep()
      }, 500) // Small delay for better UX
      return () => clearTimeout(timer)
    }
  }, [formData.contactInfo, autoAdvanceEnabled, goToNextStep])
  
  return (
    <div>
      <h2>Contact Information</h2>
      <p>Please provide your contact information so we can get in touch with you about your quote.</p>
      
      <div className="form-grid">
        <FormField
          label="First Name"
          name="firstName"
          type="text"
          value={formData.contactInfo.firstName}
          onChange={(value) => handleContactInfoChange('firstName', value)}
          error={errors.firstName}
          placeholder="Enter your first name"
          required
        />
        
        <FormField
          label="Last Name"
          name="lastName"
          type="text"
          value={formData.contactInfo.lastName}
          onChange={(value) => handleContactInfoChange('lastName', value)}
          error={errors.lastName}
          placeholder="Enter your last name"
          required
        />
      </div>
      
      <FormField
        label="Email Address"
        name="email"
        type="email"
        value={formData.contactInfo.email}
        onChange={(value) => handleContactInfoChange('email', value)}
        error={errors.email}
        placeholder="Enter your email address"
        required
      />
      
      <FormField
        label="Phone Number"
        name="phone"
        type="tel"
        value={formData.contactInfo.phone}
        onChange={(value) => handleContactInfoChange('phone', value)}
        error={errors.phone}
        placeholder="Enter your phone number"
        required
      />
      

      
      {/* Required Consent Checkboxes */}
      <div style={{ marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#374151' }}>Required Consents</h3>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.contactInfo.transactionalConsent || false}
              onChange={(e) => handleContactInfoChange('transactionalConsent', e.target.checked)}
              style={{ marginTop: '0.125rem' }}
              required
            />
            <div style={{ fontSize: '0.875rem', lineHeight: '1.4' }}>
              <div style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                By checking this box, I consent to receive transactional messages related to my account, orders, or services I have requested. These messages may include appointment reminders, order confirmations, and account notifications among others. Message frequency may vary. Message & Data rates may apply. Reply HELP for help or STOP to opt-out.
              </div>
            </div>
          </label>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.contactInfo.marketingConsent || false}
              onChange={(e) => handleContactInfoChange('marketingConsent', e.target.checked)}
              style={{ marginTop: '0.125rem' }}
              required
            />
            <div style={{ fontSize: '0.875rem', lineHeight: '1.4' }}>
              <div style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                By checking this box, I consent to receive marketing and promotional messages, including special offers, discounts, new product updates among others. Message frequency may vary. Message & Data rates may apply. Reply HELP for help or STOP to opt-out.
              </div>
            </div>
          </label>
        </div>
      </div>
      
      <div className="security-note">
        <i className="fas fa-shield-alt"></i>
        <span>Your information is secure and will only be used to provide you with insurance quotes.</span>
      </div>
    </div>
  )
} 