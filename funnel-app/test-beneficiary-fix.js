// Test script to verify beneficiary data fix
// This simulates the data structure sent from the frontend

const testBeneficiaryData = {
  sessionId: 'TEST_BENEFICIARY_' + Date.now(),
  formType: 'Partial',
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
    // Test both direct fields and beneficiaries array
    beneficiaryName: 'Jane Doe',
    beneficiaryRelationship: 'Spouse',
    beneficiaries: [
      { name: 'Jane Doe', relationship: 'Spouse', percentage: 100 }
    ],
    vaNumber: '123456789',
    serviceConnected: 'No',
    vaClinicName: 'Test VA Clinic',
    primaryDoctor: 'Dr. Smith',
    ssn: '123-45-6789',
    driversLicense: 'CA1234567',
    licenseState: 'CA',
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
    currentStep: '16',
    stepName: 'Application Step 1'
  }
};

// Test case 1: Direct fields populated
console.log('=== Test Case 1: Direct fields populated ===');
console.log('beneficiaryName:', testBeneficiaryData.applicationData.beneficiaryName);
console.log('beneficiaryRelationship:', testBeneficiaryData.applicationData.beneficiaryRelationship);
console.log('beneficiaries array:', testBeneficiaryData.applicationData.beneficiaries);

// Test case 2: Direct fields empty, beneficiaries array populated
const testBeneficiaryData2 = {
  ...testBeneficiaryData,
  sessionId: 'TEST_BENEFICIARY_2_' + Date.now(),
  applicationData: {
    ...testBeneficiaryData.applicationData,
    beneficiaryName: '',
    beneficiaryRelationship: '',
    beneficiaries: [
      { name: 'Bob Smith', relationship: 'Child', percentage: 100 }
    ]
  }
};

console.log('\n=== Test Case 2: Direct fields empty, beneficiaries array populated ===');
console.log('beneficiaryName:', testBeneficiaryData2.applicationData.beneficiaryName);
console.log('beneficiaryRelationship:', testBeneficiaryData2.applicationData.beneficiaryRelationship);
console.log('beneficiaries array:', testBeneficiaryData2.applicationData.beneficiaries);

// Test case 3: Both empty
const testBeneficiaryData3 = {
  ...testBeneficiaryData,
  sessionId: 'TEST_BENEFICIARY_3_' + Date.now(),
  applicationData: {
    ...testBeneficiaryData.applicationData,
    beneficiaryName: '',
    beneficiaryRelationship: '',
    beneficiaries: []
  }
};

console.log('\n=== Test Case 3: Both empty ===');
console.log('beneficiaryName:', testBeneficiaryData3.applicationData.beneficiaryName);
console.log('beneficiaryRelationship:', testBeneficiaryData3.applicationData.beneficiaryRelationship);
console.log('beneficiaries array:', testBeneficiaryData3.applicationData.beneficiaries);

// Simulate the Google Script logic
function simulateGoogleScriptLogic(data) {
  let beneficiaryName = data.applicationData?.beneficiaryName || '';
  let beneficiaryRelationship = data.applicationData?.beneficiaryRelationship || '';
  
  console.log(`Initial beneficiary values - name: "${beneficiaryName}", relationship: "${beneficiaryRelationship}"`);
  
  // If direct fields are empty, try to get from beneficiaries array
  if (!beneficiaryName && data.applicationData?.beneficiaries && data.applicationData.beneficiaries.length > 0) {
    beneficiaryName = data.applicationData.beneficiaries[0].name || '';
    console.log(`Got beneficiary name from array: "${beneficiaryName}"`);
  }
  if (!beneficiaryRelationship && data.applicationData?.beneficiaries && data.applicationData.beneficiaries.length > 0) {
    beneficiaryRelationship = data.applicationData.beneficiaries[0].relationship || '';
    console.log(`Got beneficiary relationship from array: "${beneficiaryRelationship}"`);
  }
  
  console.log(`Final beneficiary values - name: "${beneficiaryName}", relationship: "${beneficiaryRelationship}"`);
  
  return { beneficiaryName, beneficiaryRelationship };
}

console.log('\n=== Testing Google Script Logic ===');
console.log('\nTest Case 1:');
simulateGoogleScriptLogic(testBeneficiaryData);

console.log('\nTest Case 2:');
simulateGoogleScriptLogic(testBeneficiaryData2);

console.log('\nTest Case 3:');
simulateGoogleScriptLogic(testBeneficiaryData3);

console.log('\n=== Test completed ===');
console.log('If you see the correct beneficiary names and relationships in the "Final beneficiary values", the fix is working correctly!');
