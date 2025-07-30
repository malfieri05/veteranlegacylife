// Test to verify exact array indices for quote data columns
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxxIKg0H2YSi4OI1ZMfmY9zwNbcwr8G1m2GlBB_SlvmTZckcPX_vRH8nfnAa5SqK3xs/exec';

async function testArrayIndices() {
  console.log('=== TESTING ARRAY INDICES FOR QUOTE DATA ===');
  
  try {
    // Test with specific values for each quote column
    const testData = {
      sessionId: 'TEST_ARRAY_INDICES_' + Date.now(),
      formType: 'Application',
      currentStep: 'FinalSuccess',
      stepName: 'Application Complete',
      contactInfo: {
        firstName: 'Array',
        lastName: 'Test',
        email: 'array.test@example.com',
        phone: '555-ARRAY-TEST',
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
        streetAddress: '123 Array Street',
        city: 'Array City',
        state: 'CA',
        zipCode: '90210',
        beneficiaryName: 'Array Beneficiary',
        beneficiaryRelationship: 'Spouse',
        vaNumber: '123456789',
        serviceConnected: 'No',
        ssn: '123-45-6789',
        driversLicense: 'CA1234567',
        bankName: 'Array Bank',
        routingNumber: '123456789',
        accountNumber: '987654321'
      },
      quoteData: {
        policyDate: 'COLUMN_36_VALUE',
        coverage: 'COLUMN_37_VALUE',
        premium: 'COLUMN_38_VALUE',
        age: 'COLUMN_39_VALUE',
        gender: 'COLUMN_40_VALUE',
        type: 'COLUMN_41_VALUE'
      }
    };
    
    console.log('📊 TEST DATA BEING SENT:');
    console.log('Policy Date (should be column 36):', testData.quoteData.policyDate);
    console.log('Coverage (should be column 37):', testData.quoteData.coverage);
    console.log('Premium (should be column 38):', testData.quoteData.premium);
    console.log('Age (should be column 39):', testData.quoteData.age);
    console.log('Gender (should be column 40):', testData.quoteData.gender);
    console.log('Type (should be column 41):', testData.quoteData.type);
    
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
    console.log('3. Search for these values in ALL columns:');
    console.log('   - COLUMN_36_VALUE (should be in Policy Date column)');
    console.log('   - COLUMN_37_VALUE (should be in Quote Coverage column)');
    console.log('   - COLUMN_38_VALUE (should be in Quote Premium column)');
    console.log('   - COLUMN_39_VALUE (should be in Quote Age column)');
    console.log('   - COLUMN_40_VALUE (should be in Quote Gender column)');
    console.log('   - COLUMN_41_VALUE (should be in Quote Type column)');
    console.log('4. Tell me which columns contain these values');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testArrayIndices(); 