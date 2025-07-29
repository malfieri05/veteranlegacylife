const API_URL = 'https://script.google.com/macros/s/AKfycbyFqNQ287iDflUlQSzykwqcCRQvHmCYyzW_MoSzXx75xSVEAyeTy0MPVJ8xEC8TVSLa/exec';

async function testSimpleSubmission() {
  const fetch = (await import('node-fetch')).default;
  console.log('🧪 Testing simple URL-encoded submission...');
  
  // Simple test data
  const testData = {
    sessionId: 'test_' + Date.now(),
    formType: 'Partial',
    contactInfo: JSON.stringify({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com'
    }),
    quoteData: JSON.stringify({
      policyDate: '2024-01-15',
      coverage: '$100,000',
      premium: '$45.00',
      age: '30',
      gender: 'Male',
      type: 'IUL'
    })
  };

  // Convert to URL-encoded format
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(testData)) {
    params.append(key, value);
  }

  console.log('📤 Sending data:', params.toString());

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    });

    const responseText = await response.text();
    console.log('📡 Response status:', response.status);
    console.log('📡 Response text:', responseText);
    
    let result;
    if (responseText.startsWith('{')) {
      result = JSON.parse(responseText);
    } else {
      result = { success: true, message: responseText };
    }
    
    console.log('✅ Test result:', result);
    return result.success;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Run the test
testSimpleSubmission().then(success => {
  if (success) {
    console.log('🎉 Simple submission works!');
  } else {
    console.log('💥 Simple submission failed.');
  }
}); 