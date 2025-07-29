// Test the new simplified structure
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxxIKg0H2YSi4OI1ZMfmY9zwNbcwr8G1m2GlBB_SlvmTZckcPX_vRH8nfnAa5SqK3xs/exec';

async function testNewStructure() {
  console.log('=== TESTING NEW SIMPLIFIED STRUCTURE ===');
  
  try {
    // Test data that matches the new FunnelStore structure exactly
    const testData = {
      sessionId: 'NEW_STRUCTURE_TEST_' + Date.now(),
      formType: 'Application',
      contactInfo: {
        firstName: 'New',
        lastName: 'Structure',
        email: 'new.structure@example.com',
        phone: '555-NEW-STRUCTURE',
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
        streetAddress: '123 New Structure Street',
        city: 'New Structure City',
        state: 'CA',
        zipCode: '90210',
        beneficiaryName: 'New Structure Beneficiary',
        beneficiaryRelationship: 'Spouse',
        vaNumber: '123456789',
        serviceConnected: 'No',
        ssn: '123-45-6789',
        driversLicense: 'CA1234567',
        bankName: 'New Structure Bank',
        routingNumber: '123456789',
        accountNumber: '987654321'
      },
      quoteData: {
        policyDate: 'NEW_STRUCTURE_POLICY_DATE',
        coverage: 'NEW_STRUCTURE_COVERAGE',
        premium: 'NEW_STRUCTURE_PREMIUM',
        age: 'NEW_STRUCTURE_AGE',
        gender: 'NEW_STRUCTURE_GENDER',
        type: 'NEW_STRUCTURE_TYPE'
      },
      trackingData: {
        currentStep: '18',
        stepName: 'Application Complete'
      }
    };
    
    console.log('📊 TEST DATA BEING SENT:');
    console.log('Policy Date:', testData.quoteData.policyDate);
    console.log('Coverage:', testData.quoteData.coverage);
    console.log('Premium:', testData.quoteData.premium);
    console.log('Age:', testData.quoteData.age);
    console.log('Gender:', testData.quoteData.gender);
    console.log('Type:', testData.quoteData.type);
    
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
    console.log('   - NEW_STRUCTURE_POLICY_DATE (should be in Policy Date column)');
    console.log('   - NEW_STRUCTURE_COVERAGE (should be in Quote Coverage column)');
    console.log('   - NEW_STRUCTURE_PREMIUM (should be in Quote Premium column)');
    console.log('   - NEW_STRUCTURE_AGE (should be in Quote Age column)');
    console.log('   - NEW_STRUCTURE_GENDER (should be in Quote Gender column)');
    console.log('   - NEW_STRUCTURE_TYPE (should be in Quote Type column)');
    console.log('4. Tell me which columns contain these values');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testNewStructure(); 