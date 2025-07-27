import React, { useState } from 'react'
import { useFunnelStore } from '../../store/funnelStore'
import { FormField } from '../shared/FormField'
import { validateContactInfo } from '../../utils/validation'

export const ContactInfo: React.FC = () => {
  const { formData, updateFormData } = useFunnelStore()
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const handleContactInfoChange = (field: keyof typeof formData.contactInfo, value: string) => {
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
      
      <FormField
        label="Date of Birth"
        name="dateOfBirth"
        type="date"
        value={formData.contactInfo.dateOfBirth}
        onChange={(value) => handleContactInfoChange('dateOfBirth', value)}
        error={errors.dateOfBirth}
        placeholder="MM/DD/YYYY"
        required
      />
      
      <div className="security-note">
        <i className="fas fa-shield-alt"></i>
        <span>Your information is secure and will only be used to provide you with insurance quotes.</span>
      </div>
    </div>
  )
} 