const API_URL = 'https://script.google.com/macros/s/AKfycbxtz4XtMAIvczwLcaoD13O319HYwgsON5ylxMVkO_aA9eqFiQj9ZS1D4OtCUNoiQhvk/exec';

async function verifyDeployment() {
  const fetch = (await import('node-fetch')).default;
  
  console.log('🔍 Verifying Google Apps Script deployment...');
  
  // Test with minimal data to see what error we get
  const testData = {
    sessionId: 'verify_' + Date.now(),
    formType: 'Partial'
  };

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(testData)) {
    params.append(key, value);
  }

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
    
    if (responseText.includes('Cannot read properties of undefined')) {
      console.log('❌ Still using old code - needs redeployment');
      console.log('💡 Make sure you copied ALL the code from funnel-app/google_scripts/Main.gs');
    } else if (responseText.includes('No data received')) {
      console.log('✅ Using updated code but no data received');
    } else {
      console.log('✅ Deployment looks good!');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

verifyDeployment(); 