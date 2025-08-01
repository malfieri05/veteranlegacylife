// Veteran Life Insurance Quote Calculations
// Using exact rates provided by user

export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// IUL rate table data - EXACT VALUES FROM USER (ages 40-60)
const iulData = {
  male: {
    "40": { "50000": 35.75, "100000": 66.12, "150000": 96.49, "200000": 126.87, "250000": 157.25 },
    "41": { "50000": 37.9, "100000": 70.42, "150000": 102.94, "200000": 135.46, "250000": 167.99 },
    "42": { "50000": 40.05, "100000": 74.72, "150000": 109.39, "200000": 144.05, "250000": 178.73 },
    "43": { "50000": 42.2, "100000": 78.02, "150000": 115.84, "200000": 152.64, "250000": 189.48 },
    "44": { "50000": 44.8, "100000": 84.23, "150000": 123.64, "200000": 163.06, "250000": 202.48 },
    "45": { "50000": 47.53, "100000": 89.7, "150000": 131.82, "200000": 173.97, "250000": 216.17 },
    "46": { "50000": 50.27, "100000": 95.17, "150000": 140.06, "200000": 184.96, "250000": 229.86 },
    "47": { "50000": 53.6, "100000": 101.83, "150000": 149.86, "200000": 197.9, "250000": 245.97 },
    "48": { "50000": 56.94, "100000": 108.49, "150000": 160.06, "200000": 211.61, "250000": 263.17 },
    "49": { "50000": 60.44, "100000": 115.48, "150000": 170.54, "200000": 225.75, "250000": 280.65 },
    "50": { "50000": 63.94, "100000": 122.47, "150000": 181.03, "200000": 239.58, "250000": 298.13 },
    "51": { "50000": 67.95, "100000": 130.51, "150000": 193.07, "200000": 255.65, "250000": 318.21 },
    "52": { "50000": 71.96, "100000": 138.55, "150000": 205.12, "200000": 271.71, "250000": 338.29 },
    "53": { "50000": 76.43, "100000": 147.5, "150000": 218.05, "200000": 289.11, "250000": 360.17 },
    "54": { "50000": 80.9, "100000": 156.45, "150000": 231.98, "200000": 307.52, "250000": 383.04 },
    "55": { "50000": 86.16, "100000": 167.44, "150000": 248.22, "200000": 329, "250000": 410.78 },
    "56": { "50000": 91.41, "100000": 177.44, "150000": 263.46, "200000": 349.49, "250000": 435.53 },
    "57": { "50000": 97.54, "100000": 189.68, "150000": 281.82, "200000": 373.98, "250000": 466.14 },
    "58": { "50000": 103.66, "100000": 201.92, "150000": 300.19, "200000": 398.47, "250000": 496.74 },
    "59": { "50000": 110.2, "100000": 214.53, "150000": 318.87, "200000": 423.7, "250000": 528.52 },
    "60": { "50000": 116.75, "100000": 228.15, "150000": 339.54, "200000": 450.92, "250000": 562.31 }
  },
  female: {
    "40": { "50000": 28.52, "100000": 51.66, "150000": 74.78, "200000": 97.91, "250000": 121.05 },
    "41": { "50000": 30, "100000": 54.62, "150000": 79.22, "200000": 103.83, "250000": 128.46 },
    "42": { "50000": 31.47, "100000": 57.57, "150000": 83.67, "200000": 109.76, "250000": 135.86 },
    "43": { "50000": 33.12, "100000": 60.87, "150000": 88.63, "200000": 116.37, "250000": 144.13 },
    "44": { "50000": 34.78, "100000": 64.18, "150000": 93.58, "200000": 122.99, "250000": 152.4 },
    "45": { "50000": 36.73, "100000": 68.08, "150000": 99.92, "200000": 131.28, "250000": 162.83 },
    "46": { "50000": 38.68, "100000": 71.98, "150000": 105.27, "200000": 138.57, "250000": 171.87 },
    "47": { "50000": 40.8, "100000": 75.98, "150000": 111.76, "200000": 147.38, "250000": 183.02 },
    "48": { "50000": 43.33, "100000": 81.29, "150000": 119.25, "200000": 157.2, "250000": 195.17 },
    "49": { "50000": 44.76, "100000": 84.16, "150000": 123.55, "200000": 162.94, "250000": 212.33 },
    "50": { "50000": 46.76, "100000": 88.16, "150000": 129.55, "200000": 170.94, "250000": 212.33 },
    "51": { "50000": 49.55, "100000": 93.77, "150000": 137.89, "200000": 182.06, "250000": 226.42 },
    "52": { "50000": 52.33, "100000": 99.27, "150000": 146.23, "200000": 193.17, "250000": 240.12 },
    "53": { "50000": 55.46, "100000": 105.55, "150000": 155.64, "200000": 205.73, "250000": 255.82 },
    "54": { "50000": 58.6, "100000": 111.83, "150000": 165.06, "200000": 218.29, "250000": 271.52 },
    "55": { "50000": 86.16, "100000": 167.44, "150000": 248.22, "200000": 329, "250000": 410.78 },
    "56": { "50000": 91.41, "100000": 177.44, "150000": 263.46, "200000": 349.49, "250000": 435.53 },
    "57": { "50000": 97.54, "100000": 189.68, "150000": 281.82, "200000": 373.98, "250000": 466.14 },
    "58": { "50000": 103.66, "100000": 201.92, "150000": 300.19, "200000": 398.47, "250000": 496.74 },
    "59": { "50000": 110.2, "100000": 214.53, "150000": 318.87, "200000": 423.7, "250000": 528.52 },
    "60": { "50000": 116.75, "100000": 228.15, "150000": 339.54, "200000": 450.92, "250000": 562.31 }
  }
};

// Final Expense rate table data - EXACT VALUES FROM USER (Select 1 only, ages 60-80)
const finalExpenseData = {
  male: {
    "60": { "5000": 23.46, "10000": 43.12, "15000": 62.78, "20000": 82.44 },
    "61": { "5000": 24.68, "10000": 45.56, "15000": 66.44, "20000": 87.32 },
    "62": { "5000": 25.9, "10000": 48, "15000": 70.11, "20000": 92.21 },
    "63": { "5000": 26.92, "10000": 50.05, "15000": 73.17, "20000": 96.29 },
    "64": { "5000": 27.94, "10000": 52.09, "15000": 76.23, "20000": 100.38 },
    "65": { "5000": 28.98, "10000": 54.15, "15000": 79.33, "20000": 104.5 },
    "66": { "5000": 30.44, "10000": 57.08, "15000": 83.72, "20000": 110.36 },
    "67": { "5000": 31.9, "10000": 60, "15000": 88.1, "20000": 116.2 },
    "68": { "5000": 33.39, "10000": 62.98, "15000": 92.57, "20000": 122.16 },
    "69": { "5000": 35.38, "10000": 66.96, "15000": 98.54, "20000": 130.12 },
    "70": { "5000": 37.37, "10000": 70.94, "15000": 104.5, "20000": 138.07 },
    "71": { "5000": 39.64, "10000": 75.47, "15000": 111.3, "20000": 147.13 },
    "72": { "5000": 41.9, "10000": 80, "15000": 118.1, "20000": 156.2 },
    "73": { "5000": 44.75, "10000": 85.7, "15000": 126.65, "20000": 167.6 },
    "74": { "5000": 47.6, "10000": 91.4, "15000": 135.2, "20000": 179 },
    "75": { "5000": 50.45, "10000": 97.1, "15000": 143.75, "20000": 190.4 },
    "76": { "5000": 54.18, "10000": 104.55, "15000": 154.93, "20000": 205.3 },
    "77": { "5000": 57.9, "10000": 112, "15000": 166.09, "20000": 220.19 },
    "78": { "5000": 61.86, "10000": 119.59, "15000": 177.32, "20000": 235.05 },
    "79": { "5000": 65.83, "10000": 127.18, "15000": 188.54, "20000": 249.9 },
    "80": { "5000": 69.79, "10000": 135.78, "15000": 201.78, "20000": 267.77 }
  },
  female: {
    "60": { "5000": 19.32, "10000": 34.84, "15000": 50.35, "20000": 65.87 },
    "61": { "5000": 20.11, "10000": 36.42, "15000": 52.73, "20000": 69.05 },
    "62": { "5000": 20.9, "10000": 38, "15000": 55.1, "20000": 72.2 },
    "63": { "5000": 21.5, "10000": 39.21, "15000": 56.91, "20000": 74.61 },
    "64": { "5000": 22.11, "10000": 40.41, "15000": 58.72, "20000": 77.03 },
    "65": { "5000": 22.71, "10000": 41.63, "15000": 60.54, "20000": 79.46 },
    "66": { "5000": 23.71, "10000": 43.61, "15000": 63.52, "20000": 83.43 },
    "67": { "5000": 24.7, "10000": 45.6, "15000": 66.5, "20000": 87.4 },
    "68": { "5000": 25.95, "10000": 48.11, "15000": 70.26, "20000": 92.42 },
    "69": { "5000": 27.21, "10000": 50.62, "15000": 74.02, "20000": 97.43 },
    "70": { "5000": 28.47, "10000": 53.13, "15000": 77.8, "20000": 102.47 },
    "71": { "5000": 29.8, "10000": 55.79, "15000": 81.79, "20000": 113.11 },
    "72": { "5000": 31.13, "10000": 58.45, "15000": 85.78, "20000": 113.11 },
    "73": { "5000": 33.45, "10000": 63.1, "15000": 92.75, "20000": 122.4 },
    "74": { "5000": 35.77, "10000": 67.74, "15000": 99.72, "20000": 131.69 },
    "75": { "5000": 38.1, "10000": 72.4, "15000": 106.7, "20000": 141 },
    "76": { "5000": 40.87, "10000": 77.95, "15000": 115.02, "20000": 152.1 },
    "77": { "5000": 43.65, "10000": 83.5, "15000": 123.34, "20000": 163.19 },
    "78": { "5000": 46.13, "10000": 88.46, "15000": 130.8, "20000": 173.13 },
    "79": { "5000": 48.62, "10000": 93.43, "15000": 138.25, "20000": 183.07 },
    "80": { "5000": 51.11, "10000": 98.42, "15000": 145.73, "20000": 193.04 }
  }
};

export const calculateIULQuote = (coverageAmount: number, age: number, gender: string = 'male'): number => {
  const genderTable = iulData[gender as keyof typeof iulData];
  if (!genderTable) {
    throw new Error(`Invalid gender: ${gender}`);
  }

  const ageKey = age.toString();
  const ageTable = genderTable[ageKey as keyof typeof genderTable];
  if (!ageTable) {
    throw new Error(`Age ${age} not found in IUL data`);
  }

  // Find the closest coverage amount
  const coverageAmounts = Object.keys(ageTable).map(Number).sort((a, b) => a - b);
  let closestAmount = coverageAmounts[0];
  
  for (const amount of coverageAmounts) {
    if (amount >= coverageAmount) {
      closestAmount = amount;
      break;
    }
  }
  
  const rate = ageTable[closestAmount.toString()];
  if (!rate) {
    throw new Error(`Coverage amount ${coverageAmount} not found for age ${age}`);
  }

  return rate;
};

export const calculateFinalExpenseQuote = (coverageAmount: number, age: number, gender: string = 'male'): number => {
  const genderTable = finalExpenseData[gender as keyof typeof finalExpenseData];
  if (!genderTable) {
    throw new Error(`Invalid gender: ${gender}`);
  }

  const ageKey = age.toString();
  const ageTable = genderTable[ageKey as keyof typeof genderTable];
  if (!ageTable) {
    throw new Error(`Age ${age} not found in Final Expense data`);
  }

  // Find the closest coverage amount
  const coverageAmounts = Object.keys(ageTable).map(Number).sort((a, b) => a - b);
  let closestAmount = coverageAmounts[0];
  
  for (const amount of coverageAmounts) {
    if (amount >= coverageAmount) {
      closestAmount = amount;
      break;
    }
  }
  
  const rate = ageTable[closestAmount.toString()];
  if (!rate) {
    throw new Error(`Coverage amount ${coverageAmount} not found for age ${age}`);
  }

  return rate;
};

export const calculateQuote = (coverageAmount: number, age: number, gender: string = 'male'): { premium: number, type: 'IUL' | 'Final Expense' } => {
  if (age >= 40 && age <= 60) {
    const premium = calculateIULQuote(coverageAmount, age, gender);
    return { premium, type: 'IUL' };
  } else if (age >= 60 && age <= 80) {
    const premium = calculateFinalExpenseQuote(coverageAmount, age, gender);
    return { premium, type: 'Final Expense' };
  } else {
    throw new Error(`Age ${age} is outside supported range (40-80)`);
  }
};

export const getInsuranceType = (age: number): 'IUL' | 'Final Expense' => {
  if (age >= 40 && age <= 60) {
    return 'IUL';
  } else if (age >= 60 && age <= 80) {
    return 'Final Expense';
  } else {
    throw new Error(`Age ${age} is outside supported range (40-80)`);
  }
};

export const getCoverageRange = (insuranceType: string, age?: number): { min: number, max: number } => {
  if (insuranceType === 'IUL') {
    return { min: 50000, max: 250000 };
  } else if (insuranceType === 'Final Expense') {
    return { min: 5000, max: 20000 };
  } else {
    return { min: 5000, max: 250000 };
  }
};

interface MedicalAnswers {
  tobaccoUse?: string;           // 'never', 'former', 'current'
  medicalConditions?: string;    // comma-separated string of conditions
  hospitalCare?: string;         // 'yes', 'no'
  diabetesMedication?: string;   // 'yes', 'no'
}

type HealthTier = 'Preferred Plus' | 'Preferred' | 'Standard' | 'Substandard';

export const calculateHealthTier = (medicalAnswers: MedicalAnswers): HealthTier => {
  // For now, return Standard as default
  // This can be enhanced with actual health tier logic
  return 'Standard';
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatCoverageAmount = (amount: string): string => {
  const num = parseInt(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(num);
}; 