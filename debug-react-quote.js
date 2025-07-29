async function debugReactQuote() {
  const fetch = (await import('node-fetch')).default;
  
  // Simulate the exact data structure that the React app sends
  const reactData = {
    sessionId: 'debug_react_quote_' + Date.now(),
    formType: 'Application',
    contactInfo: {
      firstName: 'Lindsey',
      lastName: 'Stevens',
      email: 'lindsey.stevens98@outlook.com',
      phone: '5618189087',
      dateOfBirth: '',
      transactionalConsent: true,
      marketingConsent: true
    },
    preQualification: {
      state: 'AR',
      militaryStatus: 'Reserves',
      branchOfService: 'Navy',
      maritalStatus: 'Married',
      coverageAmount: '$100,000'
    },
    medicalAnswers: {
      tobaccoUse: 'No',
      medicalConditions: 'HeartAttack, COPD',
      height: '5\'1"',
      weight: '101',
      hospitalCare: 'Yes',
      diabetesMedication: 'Pills'
    },
    applicationData: {
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      beneficiaryName: '',
      beneficiaryRelationship: '',
      vaNumber: '',
      serviceConnected: '',
      ssn: '',
      driversLicense: '',
      bankName: '',
      routingNumber: '',
      accountNumber: ''
    },
    quoteData: {
      policyDate: 'REACT_TEST_DATE',
      coverage: 'REACT_TEST_COVERAGE',
      premium: 'REACT_TEST_PREMIUM',
      age: 'REACT_TEST_AGE',
      gender: 'REACT_TEST_GENDER',
      type: 'REACT_TEST_TYPE'
    },
    trackingData: {
      currentStep: '18',
      stepName: 'Application Complete'
    }
  };

  try {
    console.log('🔍 Debugging React quote data structure...');
    console.log('🔍 Full payload being sent:', JSON.stringify(reactData, null, 2));
    console.log('🔍 Quote data specifically:', reactData.quoteData);
    
    const response = await fetch('https://script.google.com/macros/s/AKfycbwwx8DFd4EihzRrWAGWKKBVNityjCSaQoJGAmbAzRRIFFRgSDDPZdyATZl-GTZApA6I/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reactData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ React quote test completed successfully');
    console.log('📊 Check your Google Sheet for the debug row');
    console.log('🔍 Look for REACT_TEST_* values in columns 36-41');
    
  } catch (error) {
    console.error('❌ React quote test failed:', error);
  }
}

debugReactQuote(); 