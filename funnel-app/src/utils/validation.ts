// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Phone validation
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
  return phoneRegex.test(cleanPhone)
}

// SSN validation
export const isValidSSN = (ssn: string): boolean => {
  const ssnRegex = /^\d{3}-?\d{2}-?\d{4}$/
  return ssnRegex.test(ssn)
}

// ZIP code validation
export const isValidZipCode = (zipCode: string): boolean => {
  const zipRegex = /^\d{5}(-\d{4})?$/
  return zipRegex.test(zipCode)
}

// Routing number validation
export const isValidRoutingNumber = (routingNumber: string): boolean => {
  const routingRegex = /^\d{9}$/
  return routingRegex.test(routingNumber)
}

// Account number validation
export const isValidAccountNumber = (accountNumber: string): boolean => {
  const accountRegex = /^\d{4,17}$/
  return accountRegex.test(accountNumber)
}

// Required field validation
export const isRequired = (value: string): boolean => {
  return value.trim().length > 0
}

// Name validation
export const isValidName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s\-']{2,50}$/
  return nameRegex.test(name.trim())
}

// Height validation (in inches)
export const isValidHeight = (height: string): boolean => {
  const heightNum = parseInt(height)
  return heightNum >= 48 && heightNum <= 84 // 4' to 7'
}

// Weight validation (in pounds)
export const isValidWeight = (weight: string): boolean => {
  const weightNum = parseInt(weight)
  return weightNum >= 80 && weightNum <= 400
}

// Date validation
export const isValidDate = (date: string): boolean => {
  const dateObj = new Date(date)
  return dateObj instanceof Date && !isNaN(dateObj.getTime())
}

// Age validation (must be 18+)
export const isValidAge = (birthDate: string): boolean => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age >= 18
}

// Form validation functions
export const validateContactInfo = (contactInfo: {
  firstName: string
  lastName: string
  email: string
  phone: string
  transactionalConsent?: boolean
  marketingConsent?: boolean
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {}
  
  if (!isRequired(contactInfo.firstName)) {
    errors.firstName = 'First name is required'
  } else if (!isValidName(contactInfo.firstName)) {
    errors.firstName = 'Please enter a valid first name'
  }
  
  if (!isRequired(contactInfo.lastName)) {
    errors.lastName = 'Last name is required'
  } else if (!isValidName(contactInfo.lastName)) {
    errors.lastName = 'Please enter a valid last name'
  }
  
  if (!isRequired(contactInfo.email)) {
    errors.email = 'Email is required'
  } else if (!isValidEmail(contactInfo.email)) {
    errors.email = 'Please enter a valid email address'
  }
  
  if (!isRequired(contactInfo.phone)) {
    errors.phone = 'Phone number is required'
  } else if (!isValidPhone(contactInfo.phone)) {
    errors.phone = 'Please enter a valid phone number'
  }
  
  if (!contactInfo.transactionalConsent) {
    errors.transactionalConsent = 'Transactional consent is required'
  }
  
  if (!contactInfo.marketingConsent) {
    errors.marketingConsent = 'Marketing consent is required'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const validateApplicationData = (applicationData: {
  address: { street: string; city: string; state: string; zipCode: string }
  beneficiary: { name: string; relationship: string }
  vaInfo: { vaNumber: string; serviceConnected: string }
  ssn: string
  banking: { accountNumber: string; routingNumber: string; bankName: string }
  policyDate: string
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {}
  
  // Address validation
  if (!isRequired(applicationData.address.street)) {
    errors.street = 'Street address is required'
  }
  
  if (!isRequired(applicationData.address.city)) {
    errors.city = 'City is required'
  }
  
  if (!isRequired(applicationData.address.state)) {
    errors.state = 'State is required'
  }
  
  if (!isRequired(applicationData.address.zipCode)) {
    errors.zipCode = 'ZIP code is required'
  } else if (!isValidZipCode(applicationData.address.zipCode)) {
    errors.zipCode = 'Please enter a valid ZIP code'
  }
  
  // Beneficiary validation
  if (!isRequired(applicationData.beneficiary.name)) {
    errors.beneficiaryName = 'Beneficiary name is required'
  } else if (!isValidName(applicationData.beneficiary.name)) {
    errors.beneficiaryName = 'Please enter a valid beneficiary name'
  }
  
  if (!isRequired(applicationData.beneficiary.relationship)) {
    errors.beneficiaryRelationship = 'Beneficiary relationship is required'
  }
  
  // SSN validation
  if (!isRequired(applicationData.ssn)) {
    errors.ssn = 'SSN is required'
  } else if (!isValidSSN(applicationData.ssn)) {
    errors.ssn = 'Please enter a valid SSN'
  }
  
  // Banking validation
  if (!isRequired(applicationData.banking.accountNumber)) {
    errors.accountNumber = 'Account number is required'
  } else if (!isValidAccountNumber(applicationData.banking.accountNumber)) {
    errors.accountNumber = 'Please enter a valid account number'
  }
  
  if (!isRequired(applicationData.banking.routingNumber)) {
    errors.routingNumber = 'Routing number is required'
  } else if (!isValidRoutingNumber(applicationData.banking.routingNumber)) {
    errors.routingNumber = 'Please enter a valid routing number'
  }
  
  if (!isRequired(applicationData.banking.bankName)) {
    errors.bankName = 'Bank name is required'
  }
  
  // Policy date validation
  if (!isRequired(applicationData.policyDate)) {
    errors.policyDate = 'Policy date is required'
  } else if (!isValidDate(applicationData.policyDate)) {
    errors.policyDate = 'Please enter a valid date'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
} 