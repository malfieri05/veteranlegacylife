// Debug data structure to compare with testNewEntriesAndEmails
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxxIKg0H2YSi4OI1ZMfmY9zwNbcwr8G1m2GlBB_SlvmTZckcPX_vRH8nfnAa5SqK3xs/exec';

async function debugDataStructure() {
  console.log('=== DEBUGGING DATA STRUCTURE ===');
  
  // Test data that matches testNewEntriesAndEmails EXACTLY
  const testData = {
    sessionId: 'DEBUG_STRUCTURE_' + Date.now(),
    formType: 'Application',
    currentStep: 'FinalSuccess',
    stepName: 'Application Complete',
    contactInfo: {
      firstName: 'Debug',
      lastName: 'Test',
      email: 'debug.test@example.com',
      phone: '555-DEBUG-TEST',
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
      streetAddress: '123 Debug Street',
      city: 'Debug City',
      state: 'CA',
      zipCode: '90210',
      beneficiaryName: 'Debug Beneficiary',
      beneficiaryRelationship: 'Spouse',
      vaNumber: '123456789',
      serviceConnected: 'No',
      ssn: '123-45-6789',
      driversLicense: 'CA1234567',
      bankName: 'Debug Bank',
      routingNumber: '123456789',
      accountNumber: '987654321'
    },
    quoteData: {
      policyDate: '2024-01-15',
      coverage: '$100,000',
      premium: '$50.00',
      age: '35',
      gender: 'Male',
      type: 'Term Life'
    }
  };
  
  console.log('📊 Data being sent:');
  console.log(JSON.stringify(testData, null, 2));
  
  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Response:', result);
    
    console.log('\n📋 INSTRUCTIONS:');
    console.log('1. Open the Google Sheet');
    console.log('2. Look for Session ID:', testData.sessionId);
    console.log('3. Check columns 36-41 for quote data');
    console.log('4. Verify the data matches what was sent');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

debugDataStructure(); 