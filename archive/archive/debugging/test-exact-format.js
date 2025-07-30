// Test to run testNewEntriesAndEmails and see exact format
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxxIKg0H2YSi4OI1ZMfmY9zwNbcwr8G1m2GlBB_SlvmTZckcPX_vRH8nfnAa5SqK3xs/exec';

async function testExactFormat() {
  console.log('=== TESTING EXACT FORMAT FROM testNewEntriesAndEmails ===');
  
  try {
    // Call the testNewEntriesAndEmails function
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'testNewEntriesAndEmails'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Test result:', result);
    
    console.log('\n📋 INSTRUCTIONS:');
    console.log('1. Open the Google Sheet');
    console.log('2. Look for the 3 test entries created by testNewEntriesAndEmails');
    console.log('3. Check that all 51 columns align perfectly with headers');
    console.log('4. Verify quote data columns 36-41 are populated');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testExactFormat(); 