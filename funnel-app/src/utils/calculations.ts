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

// IUL rate table data
const iulData = {
  male: {
    "18-25": {
      "100000-250000": 85,
      "251000-500000": 165,
      "501000-1000000": 325,
      "1001000-2000000": 650,
      "2001000-5000000": 1625
    },
    "26-30": {
      "100000-250000": 95,
      "251000-500000": 185,
      "501000-1000000": 365,
      "1001000-2000000": 730,
      "2001000-5000000": 1825
    },
    "31-35": {
      "100000-250000": 110,
      "251000-500000": 215,
      "501000-1000000": 425,
      "1001000-2000000": 850,
      "2001000-5000000": 2125
    },
    "36-40": {
      "100000-250000": 130,
      "251000-500000": 255,
      "501000-1000000": 505,
      "1001000-2000000": 1010,
      "2001000-5000000": 2525
    },
    "41-45": {
      "100000-250000": 155,
      "251000-500000": 305,
      "501000-1000000": 605,
      "1001000-2000000": 1210,
      "2001000-5000000": 3025
    },
    "46-50": {
      "100000-250000": 185,
      "251000-500000": 365,
      "501000-1000000": 725,
      "1001000-2000000": 1450,
      "2001000-5000000": 3625
    },
    "51-55": {
      "100000-250000": 225,
      "251000-500000": 445,
      "501000-1000000": 885,
      "1001000-2000000": 1770,
      "2001000-5000000": 4425
    },
    "56-60": {
      "100000-250000": 275,
      "251000-500000": 545,
      "501000-1000000": 1085,
      "1001000-2000000": 2170,
      "2001000-5000000": 5425
    }
  },
  female: {
    "18-25": {
      "100000-250000": 75,
      "251000-500000": 145,
      "501000-1000000": 285,
      "1001000-2000000": 570,
      "2001000-5000000": 1425
    },
    "26-30": {
      "100000-250000": 85,
      "251000-500000": 165,
      "501000-1000000": 325,
      "1001000-2000000": 650,
      "2001000-5000000": 1625
    },
    "31-35": {
      "100000-250000": 95,
      "251000-500000": 185,
      "501000-1000000": 365,
      "1001000-2000000": 730,
      "2001000-5000000": 1825
    },
    "36-40": {
      "100000-250000": 110,
      "251000-500000": 215,
      "501000-1000000": 425,
      "1001000-2000000": 850,
      "2001000-5000000": 2125
    },
    "41-45": {
      "100000-250000": 130,
      "251000-500000": 255,
      "501000-1000000": 505,
      "1001000-2000000": 1010,
      "2001000-5000000": 2525
    },
    "46-50": {
      "100000-250000": 155,
      "251000-500000": 305,
      "501000-1000000": 605,
      "1001000-2000000": 1210,
      "2001000-5000000": 3025
    },
    "51-55": {
      "100000-250000": 185,
      "251000-500000": 365,
      "501000-1000000": 725,
      "1001000-2000000": 1450,
      "2001000-5000000": 3625
    },
    "56-60": {
      "100000-250000": 225,
      "251000-500000": 445,
      "501000-1000000": 885,
      "1001000-2000000": 1770,
      "2001000-5000000": 4425
    }
  }
}

// IUL Quote calculation based on age, coverage amount, and gender using actual rate tables
export const calculateIULQuote = (coverageAmount: number, age: number, gender: string = 'male'): number => {
  try {
    // Get the appropriate gender table
    const genderTable = iulData[gender as keyof typeof iulData];
    if (!genderTable) {
      console.error('Invalid gender:', gender);
      return 0;
    }
    
    // Find the appropriate age bracket
    let ageBracket = null;
    const ageBrackets = Object.keys(genderTable);
    
    for (const bracket of ageBrackets) {
      const [minAge, maxAge] = bracket.split('-').map(Number);
      if (age >= minAge && age <= maxAge) {
        ageBracket = bracket;
        break;
      }
    }
    
    if (!ageBracket) {
      console.error('Age out of range:', age);
      return 0;
    }
    
    // Get the coverage ranges for this age bracket
    const coverageRanges = genderTable[ageBracket as keyof typeof genderTable];
    if (!coverageRanges) {
      console.error('No coverage ranges found for age bracket:', ageBracket);
      return 0;
    }
    
    // Find the appropriate coverage range
    let selectedPremium = 0;
    
    for (const [range, premium] of Object.entries(coverageRanges)) {
      const [minCoverage, maxCoverage] = range.split('-').map(Number);
      if (coverageAmount >= minCoverage && coverageAmount <= maxCoverage) {
        selectedPremium = premium;
        break;
      }
    }
    
    if (selectedPremium === 0) {
      console.error('Coverage amount out of range:', coverageAmount);
      return 0;
    }
    
    console.log(`IUL Quote calculated - Age: ${age} (${ageBracket}), Gender: ${gender}, Coverage: ${coverageAmount}, Premium: ${selectedPremium}`);
    return selectedPremium;
    
  } catch (error) {
    console.error('Error calculating IUL quote:', error);
    return 0;
  }
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