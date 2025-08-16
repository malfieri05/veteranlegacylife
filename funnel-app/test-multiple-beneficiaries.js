// Test script for multiple beneficiaries processing
// This simulates how the Google Apps Script processes multiple beneficiaries

// Test data with multiple beneficiaries
const testData = {
  sessionId: 'TEST_MULTIPLE_BENEFICIARIES_' + Date.now(),
  formType: 'Application',
  contactInfo: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '555-123-4567',
    dateOfBirth: '1990-01-01',
    transactionalConsent: true,
    marketingConsent: true
  },
  preQualification: {
    state: 'CA',
    militaryStatus: 'Veteran',
    branchOfService: 'Army',
    maritalStatus: 'Married',
    coverageAmount: '$100,000'
  },
  medicalAnswers: {
    tobaccoUse: 'No',
    medicalConditions: 'None',
    height: "5'10\"",
    weight: '180',
    hospitalCare: 'No',
    diabetesMedication: 'No',
    age: '30'
  },
  applicationData: {
    streetAddress: '123 Test Street',
    city: 'Test City',
    state: 'CA',
    zipCode: '90210',
    // Test multiple beneficiaries
    beneficiaryName: 'Jane Doe, Bob Smith, Mary Johnson',
    beneficiaryRelationship: 'Spouse, Child, Sister',
    beneficiaries: [
      { name: 'Jane Doe', relationship: 'Spouse', percentage: 50 },
      { name: 'Bob Smith', relationship: 'Child', percentage: 30 },
      { name: 'Mary Johnson', relationship: 'Sister', percentage: 20 }
    ],
    vaNumber: '123456789',
    serviceConnected: 'No',
    ssn: '123-45-6789',
    driversLicense: 'CA1234567',
    bankName: 'Test Bank',
    routingNumber: '123456789',
    accountNumber: '987654321'
  },
  quoteData: {
    policyDate: '2024-01-15',
    coverage: '$100,000',
    premium: '$45.00',
    age: '30',
    gender: 'Male',
    type: 'Term Life'
  },
  trackingData: {
    currentStep: '18',
    stepName: 'Application Complete'
  }
};

// Simulate the Google Script beneficiary processing logic
function processBeneficiaryData(data, sessionId) {
  let beneficiaryName = data.applicationData?.beneficiaryName || '';
  let beneficiaryRelationship = data.applicationData?.beneficiaryRelationship || '';
  
  // If we have a beneficiaries array, concatenate all beneficiaries
  if (data.applicationData?.beneficiaries && data.applicationData.beneficiaries.length > 0) {
    const names = data.applicationData.beneficiaries
      .filter(b => b.name && b.name.trim() !== '')
      .map(b => b.name.trim());
    
    const relationships = data.applicationData.beneficiaries
      .filter(b => b.relationship && b.relationship.trim() !== '')
      .map(b => b.relationship.trim());
    
    // Use concatenated values if we have them, otherwise fall back to direct fields
    if (names.length > 0) {
      beneficiaryName = names.join(', ');
    }
    if (relationships.length > 0) {
      beneficiaryRelationship = relationships.join(', ');
    }
  }
  
  console.log(`[${sessionId}] Beneficiary processing - Names: "${beneficiaryName}", Relationships: "${beneficiaryRelationship}"`);
  
  return { beneficiaryName, beneficiaryRelationship };
}

// Test cases
console.log('=== Testing Multiple Beneficiaries Processing ===\n');

// Test Case 1: Multiple beneficiaries in array
console.log('Test Case 1: Multiple beneficiaries in array');
const result1 = processBeneficiaryData(testData, 'TEST_1');
console.log('Result:', result1);
console.log('Expected: beneficiaryName = "Jane Doe, Bob Smith, Mary Johnson"');
console.log('Expected: beneficiaryRelationship = "Spouse, Child, Sister"\n');

// Test Case 2: Single beneficiary
const testData2 = {
  ...testData,
  applicationData: {
    ...testData.applicationData,
    beneficiaryName: 'Jane Doe',
    beneficiaryRelationship: 'Spouse',
    beneficiaries: [
      { name: 'Jane Doe', relationship: 'Spouse', percentage: 100 }
    ]
  }
};
console.log('Test Case 2: Single beneficiary');
const result2 = processBeneficiaryData(testData2, 'TEST_2');
console.log('Result:', result2);
console.log('Expected: beneficiaryName = "Jane Doe"');
console.log('Expected: beneficiaryRelationship = "Spouse"\n');

// Test Case 3: Empty beneficiaries array
const testData3 = {
  ...testData,
  applicationData: {
    ...testData.applicationData,
    beneficiaryName: 'Jane Doe',
    beneficiaryRelationship: 'Spouse',
    beneficiaries: []
  }
};
console.log('Test Case 3: Empty beneficiaries array');
const result3 = processBeneficiaryData(testData3, 'TEST_3');
console.log('Result:', result3);
console.log('Expected: beneficiaryName = "Jane Doe"');
console.log('Expected: beneficiaryRelationship = "Spouse"\n');

// Test Case 4: No beneficiaries array
const testData4 = {
  ...testData,
  applicationData: {
    ...testData.applicationData,
    beneficiaryName: 'Jane Doe',
    beneficiaryRelationship: 'Spouse'
    // No beneficiaries array
  }
};
console.log('Test Case 4: No beneficiaries array');
const result4 = processBeneficiaryData(testData4, 'TEST_4');
console.log('Result:', result4);
console.log('Expected: beneficiaryName = "Jane Doe"');
console.log('Expected: beneficiaryRelationship = "Spouse"\n');

// Test Case 5: Mixed valid and invalid beneficiaries
const testData5 = {
  ...testData,
  applicationData: {
    ...testData.applicationData,
    beneficiaries: [
      { name: 'Jane Doe', relationship: 'Spouse', percentage: 50 },
      { name: '', relationship: 'Child', percentage: 30 }, // Empty name
      { name: 'Mary Johnson', relationship: '', percentage: 20 }, // Empty relationship
      { name: 'Bob Smith', relationship: 'Child', percentage: 20 }
    ]
  }
};
console.log('Test Case 5: Mixed valid and invalid beneficiaries');
const result5 = processBeneficiaryData(testData5, 'TEST_5');
console.log('Result:', result5);
console.log('Expected: beneficiaryName = "Jane Doe, Mary Johnson, Bob Smith"');
console.log('Expected: beneficiaryRelationship = "Spouse, Child, Child"\n');

console.log('=== Test completed ===');
console.log('If all test cases show the expected concatenated results, the beneficiary processing is working correctly!');
