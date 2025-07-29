async function testColumnMapping() {
  const fetch = (await import('node-fetch')).default;
  
  const testData = {
    sessionId: 'test_column_mapping_' + Date.now(),
    formType: 'Application',
    contactInfo: {
      firstName: 'Test',
      lastName: 'Mapping',
      email: 'test.mapping@example.com',
      phone: '555-TEST-MAP',
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
      streetAddress: '123 Test Street',
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
    },
    quoteData: {
      policyDate: 'COLUMN_36_TEST_DATE',
      coverage: 'COLUMN_37_TEST_COVERAGE',
      premium: 'COLUMN_38_TEST_PREMIUM',
      age: 'COLUMN_39_TEST_AGE',
      gender: 'COLUMN_40_TEST_GENDER',
      type: 'COLUMN_41_TEST_TYPE'
    },
    trackingData: {
      currentStep: '18',
      stepName: 'Application Complete'
    }
  };

  try {
    console.log('🧪 Testing column mapping with distinctive values...');
    console.log('🧪 Quote data being sent:', testData.quoteData);
    
    const response = await fetch('https://script.google.com/macros/s/AKfycbzazjteF5Fe23WPW3iOYkR6y4RadAV_63pP84tNBiufkSLxaG3e7pv9Kd6LSMfL7mzI/exec', {
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
    console.log('✅ Test completed successfully');
    console.log('📊 Check your Google Sheet for the test row with distinctive column values');
    console.log('🔍 Look for these values in columns 36-41:');
    console.log('   Column 36 (Policy Date): COLUMN_36_TEST_DATE');
    console.log('   Column 37 (Quote Coverage): COLUMN_37_TEST_COVERAGE');
    console.log('   Column 38 (Quote Premium): COLUMN_38_TEST_PREMIUM');
    console.log('   Column 39 (Quote Age): COLUMN_39_TEST_AGE');
    console.log('   Column 40 (Quote Gender): COLUMN_40_TEST_GENDER');
    console.log('   Column 41 (Quote Type): COLUMN_41_TEST_TYPE');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testColumnMapping(); 