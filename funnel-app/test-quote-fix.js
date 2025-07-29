// Test quote data fix
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxxIKg0H2YSi4OI1ZMfmY9zwNbcwr8G1m2GlBB_SlvmTZckcPX_vRH8nfnAa5SqK3xs/exec';

const quoteTest = {
  sessionId: 'QUOTE_FIX_TEST_' + Date.now(),
  formType: 'Application',
  
  contactInfo: {
    firstName: 'Quote',
    lastName: 'Fix',
    email: 'quote.fix@example.com',
    phone: '555-QUOTE-FIX',
    dateOfBirth: '1990-01-01',
    transactionalConsent: true,
    marketingConsent: true
  },
  
  preQualification: {
    state: 'CA',
    militaryStatus: 'Veteran',
    branchOfService: 'Army',
    maritalStatus: 'Single',
    coverageAmount: '$100,000'
  },
  
  medicalAnswers: {
    tobaccoUse: 'No',
    medicalConditions: 'None',
    height: "5'10\"",
    weight: '180',
    hospitalCare: 'No',
    diabetesMedication: 'No'
  },
  
  applicationData: {
    streetAddress: '123 Quote Fix Street',
    city: 'Quote Fix City',
    state: 'CA',
    zipCode: '90210',
    beneficiaryName: 'Quote Fix Beneficiary',
    beneficiaryRelationship: 'Spouse',
    vaNumber: '123456789',
    serviceConnected: 'No',
    driversLicense: 'CA1234567',
    ssn: '123-45-6789',
    bankName: 'Quote Fix Bank',
    routingNumber: '123456789',
    accountNumber: '987654321'
  },
  
  // Quote data with distinctive values
  quoteData: {
    policyDate: 'QUOTE_FIX_POLICY_DATE',
    coverage: 'QUOTE_FIX_COVERAGE',
    premium: 'QUOTE_FIX_PREMIUM',
    age: 'QUOTE_FIX_AGE',
    gender: 'QUOTE_FIX_GENDER',
    type: 'QUOTE_FIX_TYPE'
  },
  
  trackingData: {
    currentStep: '18',
    stepName: 'Application Complete'
  }
};

async function testQuoteFix() {
  console.log('=== TESTING QUOTE DATA FIX ===');
  console.log('Session ID:', quoteTest.sessionId);
  
  console.log('\n📊 Quote Data Being Sent:');
  console.log('Policy Date:', quoteTest.quoteData.policyDate);
  console.log('Coverage:', quoteTest.quoteData.coverage);
  console.log('Premium:', quoteTest.quoteData.premium);
  console.log('Age:', quoteTest.quoteData.age);
  console.log('Gender:', quoteTest.quoteData.gender);
  console.log('Type:', quoteTest.quoteData.type);
  
  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quoteTest)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Success:', result.message);
    
    console.log('\n📋 INSTRUCTIONS:');
    console.log('1. Open the Google Sheet');
    console.log('2. Look for Session ID:', quoteTest.sessionId);
    console.log('3. Check columns 36-41 for QUOTE_FIX_ values');
    console.log('4. If you see the quote data, the fix worked!');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testQuoteFix(); 