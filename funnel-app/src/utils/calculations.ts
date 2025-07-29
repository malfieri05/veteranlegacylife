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

// IUL rate table data - ACTUAL RATES
const iulData = {
  male: {
    "18-25": {
      "25000-50000": 55,
      "51000-100000": 75,
      "100000-250000": 85,
      "251000-500000": 165,
      "501000-1000000": 325,
      "1001000-2000000": 650,
      "2001000-5000000": 1625
    },
    "26-30": {
      "25000-50000": 65,
      "51000-100000": 85,
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
      "25000-50000": 45,
      "51000-100000": 65,
      "100000-250000": 75,
      "251000-500000": 145,
      "501000-1000000": 285,
      "1001000-2000000": 570,
      "2001000-5000000": 1425
    },
    "26-30": {
      "25000-50000": 55,
      "51000-100000": 75,
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
    console.log(`🔍 calculateIULQuote called with: coverageAmount=${coverageAmount}, age=${age}, gender=${gender}`);
    
    // Get the appropriate gender table
    const genderTable = iulData[gender as keyof typeof iulData];
    if (!genderTable) {
      console.error('❌ Invalid gender:', gender);
      return 0;
    }
    
    console.log(`✅ Gender table found for: ${gender}`);
    
    // Find the appropriate age bracket
    let ageBracket = null;
    const ageBrackets = Object.keys(genderTable);
    console.log(`🔍 Available age brackets: ${ageBrackets.join(', ')}`);
    
    for (const bracket of ageBrackets) {
      const [minAge, maxAge] = bracket.split('-').map(Number);
      console.log(`🔍 Checking bracket ${bracket}: ${minAge}-${maxAge}, age=${age}`);
      if (age >= minAge && age <= maxAge) {
        ageBracket = bracket;
        console.log(`✅ Found matching age bracket: ${ageBracket}`);
        break;
      }
    }
    
    if (!ageBracket) {
      console.error('❌ Age out of range:', age);
      return 0;
    }
    
    // Get the coverage ranges for this age bracket
    const coverageRanges = genderTable[ageBracket as keyof typeof genderTable];
    if (!coverageRanges) {
      console.error('❌ No coverage ranges found for age bracket:', ageBracket);
      return 0;
    }
    
    console.log(`✅ Coverage ranges found for age bracket ${ageBracket}:`, Object.keys(coverageRanges));
    
    // Find the appropriate coverage range and calculate interpolated premium
    let selectedPremium = 0;
    let foundRange = false;
    
    // Sort coverage ranges by minimum coverage for proper interpolation
    const sortedRanges = Object.entries(coverageRanges).sort((a, b) => {
      const aMin = parseInt(a[0].split('-')[0]);
      const bMin = parseInt(b[0].split('-')[0]);
      return aMin - bMin;
    });
    
    for (let i = 0; i < sortedRanges.length; i++) {
      const [range, premium] = sortedRanges[i];
      const [minCoverage, maxCoverage] = range.split('-').map(Number);
      console.log(`🔍 Checking range ${range}: ${minCoverage}-${maxCoverage}, coverageAmount=${coverageAmount}`);
      
      if (coverageAmount >= minCoverage && coverageAmount <= maxCoverage) {
        // For boundary cases, use the premium for that bracket
        if (coverageAmount === minCoverage) {
          selectedPremium = premium;
          console.log(`✅ Exact match at min boundary - Coverage: ${coverageAmount}, Premium: ${selectedPremium}`);
        } else if (coverageAmount === maxCoverage) {
          // At max boundary, use the next bracket's premium if available, otherwise current premium
          if (i < sortedRanges.length - 1) {
            const [, nextPremium] = sortedRanges[i + 1];
            selectedPremium = nextPremium;
            console.log(`✅ At max boundary, using next bracket premium - Coverage: ${coverageAmount}, Premium: ${selectedPremium}`);
          } else {
            selectedPremium = premium;
            console.log(`✅ At max boundary, using current premium - Coverage: ${coverageAmount}, Premium: ${selectedPremium}`);
          }
        } else {
          // Interpolate between current bracket and next bracket
          let interpolatedPremium = premium;
          
          if (i < sortedRanges.length - 1) {
            const [, nextPremium] = sortedRanges[i + 1];
            
            // Calculate interpolation factor
            const rangeSize = maxCoverage - minCoverage;
            const positionInRange = coverageAmount - minCoverage;
            const interpolationFactor = positionInRange / rangeSize;
            
            // Interpolate between current and next premium
            const premiumDifference = nextPremium - premium;
            interpolatedPremium = Math.round(premium + (premiumDifference * interpolationFactor));
            
            console.log(`✅ Interpolated premium between brackets - Factor: ${interpolationFactor.toFixed(3)}, Premium: ${interpolatedPremium}`);
          } else {
            // If no next bracket, use simple interpolation within current bracket
            const rangeSize = maxCoverage - minCoverage;
            const positionInRange = coverageAmount - minCoverage;
            const interpolationFactor = positionInRange / rangeSize;
            interpolatedPremium = Math.round(premium * (1 + interpolationFactor * 0.1));
            
            console.log(`✅ Interpolated premium within bracket - Factor: ${interpolationFactor.toFixed(3)}, Premium: ${interpolatedPremium}`);
          }
          
          selectedPremium = interpolatedPremium;
        }
        
        foundRange = true;
        break;
      }
    }
    
    if (!foundRange) {
      console.error('❌ Coverage amount out of range:', coverageAmount);
      console.error('❌ Available ranges:', Object.keys(coverageRanges));
      return 0;
    }
    
    console.log(`💰 IUL Quote calculated - Age: ${age} (${ageBracket}), Gender: ${gender}, Coverage: ${coverageAmount}, Premium: ${selectedPremium}`);
    return selectedPremium;
    
  } catch (error) {
    console.error('❌ Error calculating IUL quote:', error);
    return 0;
  }
}

// Test function to verify interpolation logic
export const testIULInterpolation = () => {
  console.log('🧪 Testing IUL interpolation logic...');
  
  const testCases = [
    { age: 26, gender: 'male', coverage: 25000, expected: 55 },
    { age: 26, gender: 'male', coverage: 37500, expected: 65 }, // Should interpolate between 55 and 75
    { age: 26, gender: 'male', coverage: 50000, expected: 55 },
    { age: 26, gender: 'male', coverage: 75000, expected: 75 },
    { age: 26, gender: 'male', coverage: 100000, expected: 75 },
    { age: 26, gender: 'female', coverage: 25000, expected: 45 },
    { age: 26, gender: 'female', coverage: 37500, expected: 55 }, // Should interpolate between 45 and 65
    { age: 26, gender: 'female', coverage: 50000, expected: 45 },
    { age: 26, gender: 'female', coverage: 75000, expected: 65 },
    { age: 26, gender: 'female', coverage: 100000, expected: 65 }
  ];
  
  testCases.forEach((testCase, index) => {
    const result = calculateIULQuote(testCase.coverage, testCase.age, testCase.gender);
    const status = result === testCase.expected ? '✅' : '❌';
    console.log(`${status} Test ${index + 1}: Age ${testCase.age}, Gender ${testCase.gender}, Coverage ${testCase.coverage.toLocaleString()}`);
    console.log(`   Expected: $${testCase.expected}, Got: $${result}`);
  });
  
  console.log('🧪 Interpolation test completed');
};

// Final Expense rate table data (based on quote-utils.js)
const finalExpenseData: {
  male: { [age: number]: { [coverage: number]: number } }
  female: { [age: number]: { [coverage: number]: number } }
} = {
  male: {
    60: { 5000: 23.46, 10000: 43.12, 15000: 62.78, 20000: 82.44 },
    61: { 5000: 24.68, 10000: 45.56, 15000: 66.44, 20000: 87.32 },
    62: { 5000: 25.90, 10000: 48.00, 15000: 70.11, 20000: 92.21 },
    63: { 5000: 26.92, 10000: 50.05, 15000: 73.17, 20000: 96.29 },
    64: { 5000: 27.94, 10000: 52.09, 15000: 76.23, 20000: 100.38 },
    65: { 5000: 28.98, 10000: 54.15, 15000: 79.33, 20000: 104.50 },
    66: { 5000: 30.44, 10000: 57.08, 15000: 83.72, 20000: 110.36 },
    67: { 5000: 31.90, 10000: 60.00, 15000: 88.10, 20000: 116.20 },
    68: { 5000: 33.39, 10000: 62.98, 15000: 92.57, 20000: 122.16 },
    69: { 5000: 35.38, 10000: 66.96, 15000: 98.54, 20000: 130.12 },
    70: { 5000: 37.37, 10000: 70.94, 15000: 104.50, 20000: 138.07 },
    71: { 5000: 39.64, 10000: 75.47, 15000: 111.30, 20000: 147.13 },
    72: { 5000: 41.90, 10000: 80.00, 15000: 118.10, 20000: 156.20 },
    73: { 5000: 44.75, 10000: 85.70, 15000: 126.65, 20000: 167.60 },
    74: { 5000: 47.60, 10000: 91.40, 15000: 135.20, 20000: 179.00 },
    75: { 5000: 50.45, 10000: 97.10, 15000: 143.75, 20000: 190.40 },
    76: { 5000: 54.18, 10000: 104.55, 15000: 154.93, 20000: 205.30 },
    77: { 5000: 57.90, 10000: 112.00, 15000: 166.09, 20000: 220.19 },
    78: { 5000: 61.86, 10000: 119.59, 15000: 177.32, 20000: 235.05 },
    79: { 5000: 65.83, 10000: 127.18, 15000: 188.54, 20000: 249.90 },
    80: { 5000: 69.79, 10000: 135.78, 15000: 201.78, 20000: 267.77 }
  },
  female: {
    60: { 5000: 19.32, 10000: 34.84, 15000: 50.35, 20000: 65.87 },
    61: { 5000: 20.11, 10000: 36.42, 15000: 52.73, 20000: 69.05 },
    62: { 5000: 20.90, 10000: 38.00, 15000: 55.10, 20000: 72.20 },
    63: { 5000: 21.50, 10000: 39.21, 15000: 56.91, 20000: 74.61 },
    64: { 5000: 22.11, 10000: 40.41, 15000: 58.72, 20000: 77.03 },
    65: { 5000: 22.71, 10000: 41.63, 15000: 60.54, 20000: 79.46 },
    66: { 5000: 23.71, 10000: 43.61, 15000: 63.52, 20000: 83.43 },
    67: { 5000: 24.70, 10000: 45.60, 15000: 66.50, 20000: 87.40 },
    68: { 5000: 25.95, 10000: 48.11, 15000: 70.26, 20000: 92.42 },
    69: { 5000: 27.21, 10000: 50.62, 15000: 74.02, 20000: 97.43 },
    70: { 5000: 28.47, 10000: 53.13, 15000: 77.80, 20000: 102.47 },
    71: { 5000: 29.80, 10000: 55.79, 15000: 81.79, 20000: 113.11 },
    72: { 5000: 31.13, 10000: 58.45, 15000: 85.78, 20000: 113.11 },
    73: { 5000: 33.45, 10000: 63.10, 15000: 92.75, 20000: 122.40 },
    74: { 5000: 35.77, 10000: 67.74, 15000: 99.72, 20000: 131.69 },
    75: { 5000: 38.10, 10000: 72.40, 15000: 106.70, 20000: 141.00 },
    76: { 5000: 40.87, 10000: 77.95, 15000: 115.02, 20000: 152.10 },
    77: { 5000: 43.65, 10000: 83.50, 15000: 123.34, 20000: 163.19 },
    78: { 5000: 46.13, 10000: 88.46, 15000: 130.80, 20000: 173.13 },
    79: { 5000: 48.62, 10000: 93.43, 15000: 138.25, 20000: 183.07 },
    80: { 5000: 51.11, 10000: 98.42, 15000: 145.73, 20000: 193.04 }
  }
}

// Calculate Final Expense quote
export const calculateFinalExpenseQuote = (coverageAmount: number, age: number, gender: string = 'male'): number => {
  try {
    console.log(`🔍 calculateFinalExpenseQuote called with: coverageAmount=${coverageAmount}, age=${age}, gender=${gender}`);
    
    // Get the appropriate gender table
    const genderTable = finalExpenseData[gender as keyof typeof finalExpenseData];
    if (!genderTable) {
      console.error('❌ Invalid gender for Final Expense:', gender);
      return 0;
    }
    
    console.log(`✅ Gender table found for Final Expense: ${gender}`);
    
    // Find the appropriate age
    if (!genderTable[age]) {
      console.error('❌ Age out of range for Final Expense:', age);
      console.error('❌ Available ages:', Object.keys(genderTable).join(', '));
      return 0;
    }
    
    const ageRates = genderTable[age];
    console.log(`✅ Age rates found for age ${age}:`, ageRates);
    
    // Find the appropriate coverage amount
    const coverages = Object.keys(ageRates).map(Number).sort((a, b) => a - b);
    console.log(`🔍 Available coverages: ${coverages.join(', ')}`);
    
    // Check if coverage amount is exactly available
    if (ageRates[coverageAmount]) {
      const premium = ageRates[coverageAmount];
      console.log(`✅ Exact coverage match - Coverage: ${coverageAmount}, Premium: ${premium}`);
      return premium;
    }
    
    // Find the closest coverage range for interpolation
    let lowerCoverage = coverages[0];
    let upperCoverage = coverages[coverages.length - 1];
    
    for (let i = 0; i < coverages.length - 1; i++) {
      if (coverageAmount > coverages[i] && coverageAmount < coverages[i + 1]) {
        lowerCoverage = coverages[i];
        upperCoverage = coverages[i + 1];
        break;
      }
    }
    
    // If coverage is outside the range, use the closest boundary
    if (coverageAmount <= lowerCoverage) {
      const premium = ageRates[lowerCoverage];
      console.log(`✅ Using lower boundary - Coverage: ${lowerCoverage}, Premium: ${premium}`);
      return premium;
    }
    
    if (coverageAmount >= upperCoverage) {
      const premium = ageRates[upperCoverage];
      console.log(`✅ Using upper boundary - Coverage: ${upperCoverage}, Premium: ${premium}`);
      return premium;
    }
    
    // Interpolate between the two closest coverage amounts
    const lowerPremium = ageRates[lowerCoverage];
    const upperPremium = ageRates[upperCoverage];
    
    const interpolationFactor = (coverageAmount - lowerCoverage) / (upperCoverage - lowerCoverage);
    const interpolatedPremium = Math.round(lowerPremium + (interpolationFactor * (upperPremium - lowerPremium)));
    
    console.log(`✅ Interpolated Final Expense premium - Factor: ${interpolationFactor.toFixed(3)}, Premium: ${interpolatedPremium}`);
    return interpolatedPremium;
    
  } catch (error) {
    console.error('❌ Error calculating Final Expense quote:', error);
    return 0;
  }
}

// Calculate quote based on insurance type
export const calculateQuote = (coverageAmount: number, age: number, gender: string = 'male'): { premium: number, type: 'IUL' | 'Final Expense' } => {
  const insuranceType = getInsuranceType(age);
  
  if (insuranceType === 'IUL') {
    const premium = calculateIULQuote(coverageAmount, age, gender);
    return { premium, type: 'IUL' };
  } else {
    const premium = calculateFinalExpenseQuote(coverageAmount, age, gender);
    return { premium, type: 'Final Expense' };
  }
}

// Determine insurance type based on age
export const getInsuranceType = (age: number): 'IUL' | 'Final Expense' => {
  return age < 61 ? 'IUL' : 'Final Expense'
}

// Get coverage range based on insurance type and age
export const getCoverageRange = (insuranceType: string, age?: number): { min: number, max: number } => {
  if (insuranceType === 'Final Expense') {
    return { min: 5000, max: 20000 };
  } else {
    // IUL coverage ranges based on age
    if (age && age <= 30) {
      return { min: 25000, max: 250000 };
    } else if (age && age <= 45) {
      return { min: 50000, max: 500000 };
    } else {
      return { min: 100000, max: 1000000 };
    }
  }
}

// Calculate health tier based on medical answers
interface MedicalAnswers {
  tobaccoUse?: string;           // 'never', 'former', 'current'
  medicalConditions?: string;    // comma-separated string of conditions
  hospitalCare?: string;         // 'yes', 'no'
  diabetesMedication?: string;   // 'yes', 'no'
}

type HealthTier = 'Preferred Plus' | 'Preferred' | 'Standard' | 'Substandard';

export const calculateHealthTier = (medicalAnswers: MedicalAnswers): HealthTier => {
  // Build this using real underwriting criteria:
  
  // Start with best tier and downgrade based on risk factors
  let tier: HealthTier = 'Preferred Plus';
  
  // Tobacco use impact
  if (medicalAnswers.tobaccoUse === 'current') {
    tier = 'Substandard';
  } else if (medicalAnswers.tobaccoUse === 'former') {
    tier = tier === 'Preferred Plus' ? 'Preferred' : tier;
  }
  
  // Medical conditions impact
  const conditionsString = medicalAnswers.medicalConditions || '';
  const conditions = conditionsString ? conditionsString.split(',').map(c => c.trim()) : [];
  const majorConditions = ['heart-disease', 'cancer', 'stroke', 'kidney-disease'];
  const minorConditions = ['high-blood-pressure', 'diabetes', 'depression'];
  
  const hasMajorCondition = conditions.some(c => majorConditions.includes(c));
  const minorConditionCount = conditions.filter(c => minorConditions.includes(c)).length;
  
  if (hasMajorCondition) {
    tier = 'Substandard';
  } else if (minorConditionCount >= 2) {
    tier = tier === 'Preferred Plus' ? 'Standard' : tier;
  } else if (minorConditionCount === 1) {
    tier = tier === 'Preferred Plus' ? 'Preferred' : tier;
  }
  
  // Hospital care impact
  if (medicalAnswers.hospitalCare === 'yes') {
    tier = tier === 'Preferred Plus' ? 'Preferred' : 
          tier === 'Preferred' ? 'Standard' : tier;
  }
  
  // Diabetes medication impact
  if (medicalAnswers.diabetesMedication === 'yes') {
    tier = tier === 'Preferred Plus' ? 'Standard' : 
          tier === 'Preferred' ? 'Standard' : tier;
  }
  
  return tier;
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