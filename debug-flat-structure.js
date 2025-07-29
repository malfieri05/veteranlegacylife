async function debugFlatStructure() {
  const fetch = (await import('node-fetch')).default;
  
  // Test if the React app is sending a FLAT structure instead of nested
  // This would explain why quote data is getting overwritten
  const flatData = {
    sessionId: 'debug_flat_' + Date.now(),
    formType: 'Application',
    // Flat structure - this might be what the React app is actually sending
    firstName: 'Lindsey',
    lastName: 'Stevens',
    email: 'lindsey@letsclink.com',
    phone: '5618189087',
    dateOfBirth: '',
    transactionalConsent: true,
    marketingConsent: true,
    state: 'CO',
    militaryStatus: '',
    branchOfService: 'Air Force',
    maritalStatus: 'Married',
    coverageAmount: '$100,000',
    tobaccoUse: 'No',
    medicalConditions: 'COPD, Alzheimers',
    height: '5\'1"',
    weight: '113',
    hospitalCare: 'No',
    diabetesMedication: 'Pills',
    streetAddress: '',
    city: '',
    applicationState: '',
    zipCode: '',
    beneficiaryName: '',
    beneficiaryRelationship: '',
    vaNumber: '',
    serviceConnected: '',
    ssn: '',
    driversLicense: '',
    bankName: '',
    routingNumber: '',
    accountNumber: '',
    // These might be getting mixed up with quote data
    policyDate: '510000',  // This might be coverageAmount
    coverage: '372',       // This might be weight
    premium: '26',         // This might be age
    age: 'male',           // This might be gender
    gender: 'IUL',         // This might be type
    type: 'Application',   // This might be formType
    currentStep: '18',
    stepName: 'Application Complete'
  };

  try {
    console.log('🔍 Testing FLAT data structure...');
    console.log('🔍 This simulates if React app sends flat data instead of nested');
    console.log('🔍 Key fields that might be overwriting quote data:');
    console.log('   coverageAmount: $100,000');
    console.log('   weight: 113');
    console.log('   age: (from medicalAnswers)');
    console.log('   gender: (from somewhere)');
    console.log('   type: (from somewhere)');
    console.log('   formType: Application');
    
    const response = await fetch('https://script.google.com/macros/s/AKfycbwwx8DFd4EihzRrWAGWKKBVNityjCSaQoJGAmbAzRRIFFRgSDDPZdyATZl-GTZApA6I/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(flatData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Flat structure test completed');
    console.log('📊 Response:', result);
    console.log('📊 Check your Google Sheet for session ID:', flatData.sessionId);
    console.log('🔍 This should show the SAME broken values if React sends flat data:');
    console.log('   Policy Date: 510000');
    console.log('   Quote Coverage: 372');
    console.log('   Quote Premium: 26');
    console.log('   Quote Age: male');
    console.log('   Quote Gender: IUL');
    console.log('   Quote Type: Application');
    
  } catch (error) {
    console.error('❌ Flat structure test failed:', error);
  }
}

debugFlatStructure(); 