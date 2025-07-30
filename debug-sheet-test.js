// Debug script to test sheet configuration
// Run this in the browser console or as a Node.js script

// First, make sure the API module is loaded
if (typeof APIModule !== 'undefined') {
    console.log('🔧 Starting sheet configuration debug...');
    
    // Initialize the API module
    APIModule.init();
    
    // Run the debug function
    APIModule.debugSheetConfiguration().then(result => {
        console.log('🔧 Debug complete:', result);
    }).catch(error => {
        console.error('🔧 Debug failed:', error);
    });
} else {
    console.error('❌ APIModule not found. Make sure to run this after the API module is loaded.');
}

// Alternative: If running in Node.js, you can test the URL directly
if (typeof fetch !== 'undefined') {
    console.log('🔧 Testing URL directly...');
    
    const testUrl = 'https://script.google.com/macros/s/AKfycbwnU-KpI1d0yuFeB1dIqBbpwlvpkakdXu1rN8IiRKFalHwiESYF7gs14w58Dkk_ObHWwg/exec';
    
    fetch(testUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            sessionId: 'direct_test_' + Date.now(),
            formType: 'DirectTest',
            debugInfo: 'Testing direct URL access',
            timestamp: new Date().toISOString()
        }).toString()
    })
    .then(response => response.text())
    .then(text => {
        console.log('🔧 Direct test response:', text);
    })
    .catch(error => {
        console.error('🔧 Direct test failed:', error);
    });
} 