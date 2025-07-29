const API_URL = 'https://script.google.com/macros/s/AKfycbwrKTAqdDQ1RvUsxY7FZ01oQrI0wIpAwo-FxMnUydR6yM0CgkKkRoQb64TB5JdRComq/exec';

async function testSessionIdFix() {
  console.log('🧪 Testing Session ID Fix...');
  
  const sessionId = 'test_session_' + Date.now();
  console.log(`📝 Using session ID: ${sessionId}`);
  
  // Test data
  const testData = {
    sessionId: sessionId,
    formType: 'Partial',
    contactInfo: {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '555-123-4567',
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
      diabetesMedication: 'No',
      age: '30'
    },
    applicationData: {
      streetAddress: '123 Test Street',
      city: 'Test City',
      state: 'CA',
      zipCode: '90210',
      beneficiaryName: 'Jane Doe',
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
      policyDate: '2024-01-15',
      coverage: '$100,000',
      premium: '$45.00',
      age: '30',
      gender: 'Male',
      type: 'Term Life'
    },
    trackingData: {
      currentStep: '1',
      stepName: 'Test Step'
    }
  };
  
  try {
    // First submission - should create new row
    console.log('📤 First submission (should create new row)...');
    const params1 = new URLSearchParams();
    for (const [key, value] of Object.entries(testData)) {
      if (typeof value === 'object') {
        params1.append(key, JSON.stringify(value));
      } else {
        params1.append(key, String(value));
      }
    }
    
    const response1 = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params1.toString()
    });
    
    const result1 = await response1.text();
    console.log('✅ First submission result:', result1);
    
    // Second submission - should update existing row
    console.log('📤 Second submission (should update existing row)...');
    testData.trackingData.stepName = 'Updated Test Step';
    
    const params2 = new URLSearchParams();
    for (const [key, value] of Object.entries(testData)) {
      if (typeof value === 'object') {
        params2.append(key, JSON.stringify(value));
      } else {
        params2.append(key, String(value));
      }
    }
    
    const response2 = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params2.toString()
    });
    
    const result2 = await response2.text();
    console.log('✅ Second submission result:', result2);
    
    console.log('🎉 Test completed! Check your Google Sheet - you should see only ONE row with this session ID.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testSessionIdFix(); 