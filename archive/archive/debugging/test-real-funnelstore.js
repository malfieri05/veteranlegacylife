// Test with EXACT data structure that FunnelStore.ts sends
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxxIKg0H2YSi4OI1ZMfmY9zwNbcwr8G1m2GlBB_SlvmTZckcPX_vRH8nfnAa5SqK3xs/exec';

async function testRealFunnelStore() {
  console.log('=== TESTING REAL FUNNELSTORE DATA STRUCTURE ===');
  
  try {
    // Simulate EXACT data that FunnelStore.ts sends
    const realData = {
      sessionId: 'REAL_FUNNELSTORE_' + Date.now(),
      formType: 'Application',
      
      // Contact Info - EXACTLY like FunnelStore.ts
      contactInfo: {
        firstName: 'Real',
        lastName: 'User',
        email: 'real.user@example.com',
        phone: '555-REAL-USER',
        dateOfBirth: '1985-06-15',
        transactionalConsent: true,
        marketingConsent: true
      },
      
      // Pre-qualification - EXACTLY like FunnelStore.ts
      preQualification: {
        state: 'TX',
        militaryStatus: 'Veteran',
        branchOfService: 'Navy',
        maritalStatus: 'Married',
        coverageAmount: '$250,000'
      },
      
      // Medical Answers - EXACTLY like FunnelStore.ts
      medicalAnswers: {
        tobaccoUse: 'No',
        medicalConditions: 'None',
        height: "6'0\"",
        weight: '200',
        hospitalCare: 'No',
        diabetesMedication: 'No'
      },
      
      // Application Data - EXACTLY like FunnelStore.ts
      applicationData: {
        streetAddress: '456 Real Street',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001',
        beneficiaryName: 'Real Beneficiary',
        beneficiaryRelationship: 'Spouse',
        vaNumber: '987654321',
        serviceConnected: 'No',
        ssn: '987-65-4321',
        driversLicense: 'TX9876543',
        bankName: 'Real Bank',
        routingNumber: '987654321',
        accountNumber: '123456789'
      },
      
      // Quote Data - EXACTLY like FunnelStore.ts
      quoteData: {
        policyDate: '2024-02-01',
        coverage: '$250,000',
        premium: '$125.75',
        age: '38',
        gender: 'Male',
        type: 'Term Life'
      },
      
      // Tracking Data - EXACTLY like FunnelStore.ts
      trackingData: {
        currentStep: '18',
        stepName: 'Application Complete'
      },
      
      // Real browser data - EXACTLY like actual requests
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      referrer: 'https://veteranlegacylife.com',
      utmSource: 'google',
      utmMedium: 'cpc',
      utmCampaign: 'veteran-life-insurance'
    };
    
    console.log('📊 REAL FUNNELSTORE DATA BEING SENT:');
    console.log(JSON.stringify(realData, null, 2));
    
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(realData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Response:', result);
    
    console.log('\n📋 INSTRUCTIONS:');
    console.log('1. Open the Google Sheet');
    console.log('2. Look for Session ID:', realData.sessionId);
    console.log('3. Check ALL columns for proper alignment');
    console.log('4. Verify quote data columns 36-41 are correct');
    console.log('5. Check UTM data in columns 47-49');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testRealFunnelStore(); 