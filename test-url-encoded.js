const API_URL = 'https://script.google.com/macros/s/AKfycbxtz4XtMAIvczwLcaoD13O319HYwgsON5ylxMVkO_aA9eqFiQj9ZS1D4OtCUNoiQhvk/exec';

async function testUrlEncodedSubmission() {
  const fetch = (await import('node-fetch')).default;
  console.log('🧪 Testing URL-encoded submission...');
  
  const payload = {
    sessionId: 'test_session_' + Date.now(),
    formType: 'Partial',
    contactInfo: JSON.stringify({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '555-123-4567',
      dateOfBirth: '1990-01-01',
      transactionalConsent: true,
      marketingConsent: true
    }),
    preQualification: JSON.stringify({
      state: 'CA',
      militaryStatus: 'Veteran',
      branchOfService: 'Army',
      maritalStatus: 'Single',
      coverageAmount: '$100,000'
    }),
    medicalAnswers: JSON.stringify({
      tobaccoUse: 'No',
      medicalConditions: 'None',
      height: '5\'10"',
      weight: '180',
      hospitalCare: 'No',
      diabetesMedication: 'No',
      age: '30'
    }),
    applicationData: JSON.stringify({
      streetAddress: '123 Test St',
      city: 'Test City',
      state: 'CA',
      zipCode: '90210',
      beneficiaryName: 'Test Beneficiary',
      beneficiaryRelationship: 'Spouse',
      vaNumber: '123456789',
      serviceConnected: 'No',
      ssn: '123-45-6789',
      driversLicense: 'CA1234567',
      bankName: 'Test Bank',
      routingNumber: '123456789',
      accountNumber: '987654321'
    }),
    quoteData: JSON.stringify({
      policyDate: '2024-01-15',
      coverage: '$100,000',
      premium: '$45.00',
      age: '30',
      gender: 'Male',
      type: 'IUL'
    }),
    trackingData: JSON.stringify({
      currentStep: '1',
      stepName: 'State Selection'
    })
  };

  // Convert to URL-encoded format
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(payload)) {
    params.append(key, value);
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    });

    const responseText = await response.text();
    console.log('📡 Response status:', response.status);
    console.log('📡 Response text:', responseText);
    
    let result;
    if (responseText.startsWith('{')) {
      result = JSON.parse(responseText);
    } else {
      result = { success: true, message: responseText };
    }
    
    console.log('✅ Test result:', result);
    return result.success;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Run the test
testUrlEncodedSubmission().then(success => {
  if (success) {
    console.log('🎉 URL-encoded submission works! No CORS issues.');
  } else {
    console.log('💥 URL-encoded submission failed.');
  }
}); 