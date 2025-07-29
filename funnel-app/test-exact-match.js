// Test to match testNewEntriesAndEmails format exactly
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxxIKg0H2YSi4OI1ZMfmY9zwNbcwr8G1m2GlBB_SlvmTZckcPX_vRH8nfnAa5SqK3xs/exec';

async function testExactMatch() {
  console.log('=== TESTING EXACT MATCH WITH testNewEntriesAndEmails ===');
  
  try {
    // Test 1: NEW LEAD Entry - EXACTLY like testNewEntriesAndEmails
    console.log('Test 1: Creating NEW LEAD entry...');
    const leadSessionId = 'TEST_LEAD_EXACT_' + Date.now();
    const leadData = {
      sessionId: leadSessionId,
      formType: 'Lead',
      currentStep: 'ContactInfo',
      stepName: 'Contact Information',
      contactInfo: {
        firstName: 'John',
        lastName: 'TestLead',
        email: 'john.testlead@example.com',
        phone: '555-123-4567',
        dateOfBirth: '1985-03-15',
        transactionalConsent: true,
        marketingConsent: true
      },
      preQualification: {
        state: 'CA',
        militaryStatus: 'Veteran',
        branchOfService: 'Army',
        maritalStatus: 'Married',
        coverageAmount: '$250,000'
      },
      medicalAnswers: {
        tobaccoUse: 'No',
        medicalConditions: 'None',
        height: "5'10\"",
        weight: '180',
        hospitalCare: 'No',
        diabetesMedication: 'No'
      }
    };
    
    const leadResponse = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData)
    });

    if (!leadResponse.ok) {
      throw new Error(`HTTP error! status: ${leadResponse.status}`);
    }

    const leadResult = await leadResponse.json();
    console.log('✅ NEW LEAD test result:', leadResult);
    
    // Test 2: COMPLETE APPLICATION Entry - EXACTLY like testNewEntriesAndEmails
    console.log('Test 2: Creating COMPLETE APPLICATION entry...');
    const appSessionId = 'TEST_APP_EXACT_' + Date.now();
    const appData = {
      sessionId: appSessionId,
      formType: 'Application',
      currentStep: 'FinalSuccess',
      stepName: 'Application Complete',
      contactInfo: {
        firstName: 'Jane',
        lastName: 'TestApp',
        email: 'jane.testapp@example.com',
        phone: '555-987-6543',
        dateOfBirth: '1988-07-22',
        transactionalConsent: true,
        marketingConsent: true
      },
      preQualification: {
        state: 'TX',
        militaryStatus: 'Veteran',
        branchOfService: 'Navy',
        maritalStatus: 'Single',
        coverageAmount: '$500,000'
      },
      medicalAnswers: {
        tobaccoUse: 'No',
        medicalConditions: 'None',
        height: "5'6\"",
        weight: '140',
        hospitalCare: 'No',
        diabetesMedication: 'No'
      },
      applicationData: {
        streetAddress: '123 Test Street',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001',
        beneficiaryName: 'John TestApp',
        beneficiaryRelationship: 'Spouse',
        vaNumber: '123456789',
        serviceConnected: 'No',
        ssn: '123-45-6789',
        driversLicense: 'TX1234567',
        bankName: 'Test Bank',
        routingNumber: '123456789',
        accountNumber: '987654321'
      },
      quoteData: {
        policyDate: '2024-01-15',
        coverage: '$500,000',
        premium: '$75.50',
        age: '35',
        gender: 'Female',
        type: 'Term Life'
      }
    };
    
    const appResponse = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appData)
    });

    if (!appResponse.ok) {
      throw new Error(`HTTP error! status: ${appResponse.status}`);
    }

    const appResult = await appResponse.json();
    console.log('✅ COMPLETE APPLICATION test result:', appResult);
    
    console.log('\n📋 INSTRUCTIONS:');
    console.log('1. Open the Google Sheet');
    console.log('2. Look for Session IDs:', leadSessionId, 'and', appSessionId);
    console.log('3. Check that all 51 columns align perfectly with headers');
    console.log('4. Verify quote data columns 36-41 are populated');
    console.log('5. Compare with testNewEntriesAndEmails output');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testExactMatch(); 