// Debug sheet structure to see what's happening with columns
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxxIKg0H2YSi4OI1ZMfmY9zwNbcwr8G1m2GlBB_SlvmTZckcPX_vRH8nfnAa5SqK3xs/exec';

async function debugSheetStructure() {
  console.log('=== DEBUGGING SHEET STRUCTURE ===');
  
  try {
    // Test with minimal data to see what columns are actually being written
    const testData = {
      sessionId: 'DEBUG_SHEET_' + Date.now(),
      formType: 'Application',
      currentStep: 'FinalSuccess',
      stepName: 'Application Complete',
      contactInfo: {
        firstName: 'Debug',
        lastName: 'Sheet',
        email: 'debug.sheet@example.com',
        phone: '555-DEBUG-SHEET',
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
        diabetesMedication: 'No'
      },
      applicationData: {
        streetAddress: '123 Debug Street',
        city: 'Debug City',
        state: 'CA',
        zipCode: '90210',
        beneficiaryName: 'Debug Beneficiary',
        beneficiaryRelationship: 'Spouse',
        vaNumber: '123456789',
        serviceConnected: 'No',
        ssn: '123-45-6789',
        driversLicense: 'CA1234567',
        bankName: 'Debug Bank',
        routingNumber: '123456789',
        accountNumber: '987654321'
      },
      quoteData: {
        policyDate: 'DEBUG_POLICY_DATE',
        coverage: 'DEBUG_COVERAGE',
        premium: 'DEBUG_PREMIUM',
        age: 'DEBUG_AGE',
        gender: 'DEBUG_GENDER',
        type: 'DEBUG_TYPE'
      }
    };
    
    console.log('📊 DEBUG DATA BEING SENT:');
    console.log(JSON.stringify(testData, null, 2));
    
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
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
    console.log('✅ Response:', result);
    
    console.log('\n📋 INSTRUCTIONS:');
    console.log('1. Open the Google Sheet');
    console.log('2. Look for Session ID:', testData.sessionId);
    console.log('3. Check ALL columns to see where the DEBUG_ values appear');
    console.log('4. Look for DEBUG_POLICY_DATE, DEBUG_COVERAGE, DEBUG_PREMIUM, DEBUG_AGE, DEBUG_GENDER, DEBUG_TYPE');
    console.log('5. Tell me which columns contain these values');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

debugSheetStructure(); 