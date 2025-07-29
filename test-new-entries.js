async function testNewEntries() {
  const fetch = (await import('node-fetch')).default;
  
  const testData = {
    action: 'testNewEntriesAndEmails'
  };

  try {
    console.log('🧪 Running testNewEntriesAndEmails...');
    
    const response = await fetch('https://script.google.com/macros/s/AKfycbzazjteF5Fe23WPW3iOYkR6y4RadAV_63pP84tNBiufkSLxaG3e7pv9Kd6LSMfL7mzI/exec', {
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
    console.log('✅ Test completed successfully');
    console.log('📊 Response:', result);
    console.log('📊 Check your Google Sheet for the test entries');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testNewEntries(); 