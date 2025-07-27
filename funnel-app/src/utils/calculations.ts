// Age calculation utility
export const calculateAge = (birthDate: string): number => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

// IUL Quote calculation based on age, coverage amount, and gender
export const calculateIULQuote = (coverageAmount: number, age: number, gender: string = 'male'): number => {
  // Base rates per $1000 of coverage (simplified calculation)
  const baseRates: { [key: number]: number } = {
    18: 0.85, 19: 0.87, 20: 0.89, 21: 0.91, 22: 0.93, 23: 0.95, 24: 0.97, 25: 0.99,
    26: 1.01, 27: 1.03, 28: 1.05, 29: 1.07, 30: 1.09, 31: 1.11, 32: 1.13, 33: 1.15,
    34: 1.17, 35: 1.19, 36: 1.21, 37: 1.23, 38: 1.25, 39: 1.27, 40: 1.29, 41: 1.31,
    42: 1.33, 43: 1.35, 44: 1.37, 45: 1.39, 46: 1.41, 47: 1.43, 48: 1.45, 49: 1.47,
    50: 1.49, 51: 1.51, 52: 1.53, 53: 1.55, 54: 1.57, 55: 1.59, 56: 1.61, 57: 1.63,
    58: 1.65, 59: 1.67, 60: 1.69, 61: 1.71, 62: 1.73, 63: 1.75, 64: 1.77, 65: 1.79,
    66: 1.81, 67: 1.83, 68: 1.85, 69: 1.87, 70: 1.89, 71: 1.91, 72: 1.93, 73: 1.95,
    74: 1.97, 75: 1.99, 76: 2.01, 77: 2.03, 78: 2.05, 79: 2.07, 80: 2.09
  }
  
  const rate = baseRates[age] || baseRates[80] // Default to highest rate if age not found
  const genderMultiplier = gender === 'female' ? 0.9 : 1.0 // Females get 10% discount
  const monthlyPremium = (coverageAmount / 1000) * rate * genderMultiplier
  
  return Math.round(monthlyPremium * 100) / 100 // Round to 2 decimal places
}

// Determine insurance type based on age
export const getInsuranceType = (age: number): 'IUL' | 'Final Expense' => {
  return age <= 75 ? 'IUL' : 'Final Expense'
}

// Calculate health tier based on medical answers
export const calculateHealthTier = (medicalAnswers: {
  tobaccoUse: string
  medicalConditions: string[]
  hospitalCare: string
  diabetesMedication: string
}): 'Preferred Plus' | 'Preferred' | 'Standard' | 'Substandard' => {
  let score = 0
  
  // Tobacco use
  if (medicalAnswers.tobaccoUse === 'No') score += 2
  else if (medicalAnswers.tobaccoUse === 'Former') score += 1
  
  // Medical conditions
  if (medicalAnswers.medicalConditions.length === 0) score += 2
  else if (medicalAnswers.medicalConditions.length <= 2) score += 1
  
  // Hospital care
  if (medicalAnswers.hospitalCare === 'No') score += 2
  else if (medicalAnswers.hospitalCare === 'Over 5 years ago') score += 1
  
  // Diabetes medication
  if (medicalAnswers.diabetesMedication === 'No') score += 2
  
  // Determine tier based on score
  if (score >= 7) return 'Preferred Plus'
  if (score >= 5) return 'Preferred'
  if (score >= 3) return 'Standard'
  return 'Substandard'
}

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount)
}

// Format coverage amount
export const formatCoverageAmount = (amount: string): string => {
  const numericAmount = parseInt(amount.replace(/[^0-9]/g, ''))
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numericAmount)
} 