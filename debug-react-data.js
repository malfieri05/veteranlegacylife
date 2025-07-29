async function debugReactData() {
  const fetch = (await import('node-fetch')).default;
  
  // Simulate the exact data structure that the React app sends
  // Based on the real user data you provided
  const reactData = {
    sessionId: 'debug_react_data_' + Date.now(),
    formType: 'Application',
    contactInfo: {
      firstName: 'Lindsey',
      lastName: 'Stevens',
      email: 'lindsey@letsclink.com',
      phone: '5618189087',
      dateOfBirth: '',
      transactionalConsent: true,
      marketingConsent: true
    },
    preQualification: {
      state: 'CO',
      militaryStatus: '',
      branchOfService: 'Air Force',
      maritalStatus: 'Married',
      coverageAmount: '$100,000'
    },
    medicalAnswers: {
      tobaccoUse: 'No',
      medicalConditions: 'COPD, Alzheimers',
      height: '5\'1"',
      weight: '113',
      hospitalCare: 'No',
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
      policyDate: '2024-07-29',
      coverage: '$100,000',
      premium: '$45.00',
      age: '30',
      gender: 'Male',
      type: 'IUL'
    },
    trackingData: {
      currentStep: '18',
      stepName: 'Application Complete'
    }
  };

  try {
    console.log('🔍 Debugging React data structure...');
    console.log('🔍 Full payload being sent:', JSON.stringify(reactData, null, 2));
    console.log('🔍 Quote data specifically:', reactData.quoteData);
    console.log('🔍 Application data:', reactData.applicationData);
    
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
    console.log('✅ Debug test completed successfully');
    console.log('📊 Response:', result);
    console.log('📊 Check your Google Sheet for session ID:', reactData.sessionId);
    console.log('🔍 Look for these values in columns 36-41:');
    console.log('   Policy Date: 2024-07-29');
    console.log('   Quote Coverage: $100,000');
    console.log('   Quote Premium: $45.00');
    console.log('   Quote Age: 30');
    console.log('   Quote Gender: Male');
    console.log('   Quote Type: IUL');
    
  } catch (error) {
    console.error('❌ Debug test failed:', error);
  }
}

debugReactData(); 