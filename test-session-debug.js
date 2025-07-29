const API_URL = 'https://script.google.com/macros/s/AKfycbwrKTAqdDQ1RvUsxY7FZ01oQrI0wIpAwo-FxMnUydR6yM0CgkKkRoQb64TB5JdRComq/exec';

async function testSessionDebug() {
  console.log('🧪 Testing Session ID Debug...');
  
  // Simulate the exact same session ID that was generated in the user's test
  const sessionId = 'session_1753812341413_cghxltbfb';
  console.log(`📝 Using session ID: ${sessionId}`);
  
  const testData = {
    sessionId: sessionId,
    formType: 'Partial',
    contactInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      transactionalConsent: false,
      marketingConsent: false
    },
    preQualification: {
      state: 'CO',
      militaryStatus: '',
      branchOfService: '',
      maritalStatus: '',
      coverageAmount: ''
    },
    medicalAnswers: {
      tobaccoUse: '',
      medicalConditions: '',
      height: '',
      weight: '',
      hospitalCare: '',
      diabetesMedication: '',
      age: ''
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
      policyDate: '',
      coverage: '',
      premium: '',
      age: '',
      gender: '',
      type: ''
    },
    trackingData: {
      currentStep: '1',
      stepName: 'State Selection'
    }
  };

  try {
    console.log('📤 Submitting with session ID:', sessionId);
    
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(testData)) {
      if (typeof value === 'object') {
        params.append(key, JSON.stringify(value));
      } else {
        params.append(key, String(value));
      }
    }
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseText = await response.text();
    console.log('✅ Response:', responseText);
    
    // Now try to update the same session ID
    console.log('📤 Updating same session ID...');
    testData.trackingData.stepName = 'Updated Test';
    
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

    if (!response2.ok) {
      throw new Error(`HTTP error! status: ${response2.status}`);
    }

    const responseText2 = await response2.text();
    console.log('✅ Update Response:', responseText2);
    
    console.log('🎉 Test completed! Check your Google Sheet for session ID:', sessionId);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testSessionDebug(); 