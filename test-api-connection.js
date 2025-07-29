async function testApiConnection() {
  const fetch = (await import('node-fetch')).default;
  
  const simpleData = {
    sessionId: 'test_api_' + Date.now(),
    formType: 'Application',
    contactInfo: {
      firstName: 'API',
      lastName: 'Test',
      email: 'api.test@example.com',
      phone: '555-API-TEST',
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
      height: '5\'10"',
      weight: '180',
      hospitalCare: 'No',
      diabetesMedication: 'No'
    },
    applicationData: {
      streetAddress: '123 API Street',
      city: 'API City',
      state: 'CA',
      zipCode: '90210',
      beneficiaryName: 'API Beneficiary',
      beneficiaryRelationship: 'Spouse',
      vaNumber: '123456789',
      serviceConnected: 'No',
      ssn: '123-45-6789',
      driversLicense: 'CA1234567',
      bankName: 'API Bank',
      routingNumber: '123456789',
      accountNumber: '987654321'
    },
    quoteData: {
      policyDate: 'API_TEST_DATE',
      coverage: 'API_TEST_COVERAGE',
      premium: 'API_TEST_PREMIUM',
      age: 'API_TEST_AGE',
      gender: 'API_TEST_GENDER',
      type: 'API_TEST_TYPE'
    },
    trackingData: {
      currentStep: '18',
      stepName: 'Application Complete'
    }
  };

  try {
    console.log('🔍 Testing API connection...');
    console.log('🔍 Session ID:', simpleData.sessionId);
    
    const response = await fetch('https://script.google.com/macros/s/AKfycbzazjteF5Fe23WPW3iOYkR6y4RadAV_63pP84tNBiufkSLxaG3e7pv9Kd6LSMfL7mzI/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(simpleData)
    });

    console.log('🔍 Response status:', response.status);
    console.log('🔍 Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ API connection successful');
    console.log('📊 Response:', result);
    console.log('📊 Check your Google Sheet for session ID:', simpleData.sessionId);
    
  } catch (error) {
    console.error('❌ API connection failed:', error);
  }
}

testApiConnection(); 