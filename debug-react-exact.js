async function debugReactExact() {
  const fetch = (await import('node-fetch')).default;
  
  // Simulate the EXACT data that the React app sends when it's broken
  // Based on your real broken data
  const brokenReactData = {
    sessionId: 'debug_broken_react_' + Date.now(),
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
    // This is the key - let's try different quote data structures
    quoteData: {
      policyDate: '510000',  // This is what appeared in your broken data
      coverage: '372',       // This is what appeared in your broken data  
      premium: '26',         // This is what appeared in your broken data
      age: 'male',           // This is what appeared in your broken data
      gender: 'IUL',         // This is what appeared in your broken data
      type: 'Application'    // This is what appeared in your broken data
    },
    trackingData: {
      currentStep: '18',
      stepName: 'Application Complete'
    }
  };

  try {
    console.log('🔍 Debugging broken React data structure...');
    console.log('🔍 This simulates the EXACT broken data from your manual test');
    console.log('🔍 Quote data being sent:', brokenReactData.quoteData);
    
    const response = await fetch('https://script.google.com/macros/s/AKfycbwwx8DFd4EihzRrWAGWKKBVNityjCSaQoJGAmbAzRRIFFRgSDDPZdyATZl-GTZApA6I/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(brokenReactData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Broken data test completed');
    console.log('📊 Response:', result);
    console.log('📊 Check your Google Sheet for session ID:', brokenReactData.sessionId);
    console.log('🔍 This should show the SAME broken values in columns 36-41:');
    console.log('   Policy Date: 510000');
    console.log('   Quote Coverage: 372');
    console.log('   Quote Premium: 26');
    console.log('   Quote Age: male');
    console.log('   Quote Gender: IUL');
    console.log('   Quote Type: Application');
    
  } catch (error) {
    console.error('❌ Broken data test failed:', error);
  }
}

debugReactExact(); 