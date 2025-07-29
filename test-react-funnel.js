async function testReactFunnel() {
  const fetch = (await import('node-fetch')).default;
  
  // Simulate the exact data structure that the React app sends
  const reactFunnelData = {
    sessionId: 'test_react_funnel_' + Date.now(),
    formType: 'Application',
    contactInfo: {
      firstName: 'React',
      lastName: 'Test',
      email: 'react.test@example.com',
      phone: '555-REACT-TEST',
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
      streetAddress: '123 React Street',
      city: 'React City',
      state: 'CA',
      zipCode: '90210',
      beneficiaryName: 'React Beneficiary',
      beneficiaryRelationship: 'Spouse',
      vaNumber: '123456789',
      serviceConnected: 'No',
      ssn: '123-45-6789',
      driversLicense: 'CA1234567',
      bankName: 'React Bank',
      routingNumber: '123456789',
      accountNumber: '987654321'
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
    console.log('🧪 Testing React funnel data flow...');
    console.log('🧪 Quote data being sent:', reactFunnelData.quoteData);
    
    const response = await fetch('https://script.google.com/macros/s/AKfycbwwx8DFd4EihzRrWAGWKKBVNityjCSaQoJGAmbAzRRIFFRgSDDPZdyATZl-GTZApA6I/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reactFunnelData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ React funnel test completed successfully');
    console.log('📊 Response:', result);
    console.log('📊 Check your Google Sheet for session ID:', reactFunnelData.sessionId);
    console.log('🔍 Look for these quote values in columns 36-41:');
    console.log('   Policy Date: 2024-07-29');
    console.log('   Quote Coverage: $100,000');
    console.log('   Quote Premium: $45.00');
    console.log('   Quote Age: 30');
    console.log('   Quote Gender: Male');
    console.log('   Quote Type: IUL');
    
  } catch (error) {
    console.error('❌ React funnel test failed:', error);
  }
}

testReactFunnel(); 