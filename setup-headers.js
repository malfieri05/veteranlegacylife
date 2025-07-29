async function setupHeaders() {
  const fetch = (await import('node-fetch')).default;
  
  const setupData = {
    action: 'setupHeaders'
  };

  try {
    console.log('🔧 Setting up Google Sheet headers...');
    
    const response = await fetch('https://script.google.com/macros/s/AKfycbwwx8DFd4EihzRrWAGWKKBVNityjCSaQoJGAmbAzRRIFFRgSDDPZdyATZl-GTZApA6I/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(setupData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Headers setup completed successfully');
    console.log('📊 Response:', result);
    
  } catch (error) {
    console.error('❌ Headers setup failed:', error);
  }
}

setupHeaders(); 