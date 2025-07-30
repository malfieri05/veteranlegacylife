// Use global fetch if available, otherwise require node-fetch
let fetch;
try {
    fetch = global.fetch;
} catch (e) {
    fetch = require('node-fetch');
}

async function debugSheetId() {
    console.log('🔧 === SHEET ID DEBUG ===');
    
    const testUrl = 'https://script.google.com/macros/s/AKfycbwnU-KpI1d0yuFeB1dIqBbpwlvpkakdXu1rN8IiRKFalHwiESYF7gs14w58Dkk_ObHWwg/exec';
    
    console.log('🔧 Target URL:', testUrl);
    console.log('🔧 Expected deployment ID: AKfycbwnU-KpI1d0yuFeB1dIqBbpwlvpkakdXu1rN8IiRKFalHwiESYF7gs14w58Dkk_ObHWwg');
    console.log('🔧 URL contains correct ID:', testUrl.includes('AKfycbwnU-KpI1d0yuFeB1dIqBbpwlvpkakdXu1rN8IiRKFalHwiESYF7gs14w58Dkk_ObHWwg'));
    
    const testData = {
        sessionId: 'sheet_debug_' + Date.now(),
        formType: 'Application',
        contactInfo: {
            firstName: 'Debug',
            lastName: 'Test',
            email: 'debug.test@example.com',
            phone: '(555) 123-4567',
            dateOfBirth: '1990-01-01'
        },
        preQualification: {
            state: 'CA',
            militaryStatus: 'Veteran',
            branchOfService: 'Army',
            maritalStatus: 'Single',
            coverageAmount: '$100,000'
        },
        debugInfo: 'Testing which sheet this writes to',
        timestamp: new Date().toISOString(),
        expectedSheetId: '1-X3qkXd6xh2Y9dG6AmIP_ljd2o0UUZfYUcR1RoreMXM'
    };
    
    console.log('🔧 Test data:', testData);
    
    try {
        console.log('🔧 Making request...');
        const response = await fetch(testUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(testData).toString()
        });
        
        console.log('🔧 Response status:', response.status);
        console.log('🔧 Response status text:', response.statusText);
        console.log('🔧 Response URL:', response.url);
        console.log('🔧 Response headers:', Object.fromEntries(response.headers.entries()));
        
        const responseText = await response.text();
        console.log('🔧 Raw response text:', responseText);
        console.log('🔧 Response length:', responseText.length);
        console.log('🔧 Response contains "success":', responseText.includes('success'));
        console.log('🔧 Response contains "error":', responseText.includes('error'));
        console.log('🔧 Response contains "sheet":', responseText.toLowerCase().includes('sheet'));
        
        try {
            const result = JSON.parse(responseText);
            console.log('🔧 Parsed JSON result:', result);
            console.log('🔧 Result keys:', Object.keys(result));
        } catch (parseError) {
            console.log('🔧 Response is not JSON:', responseText);
        }
        
        console.log('🔧 === END SHEET ID DEBUG ===');
        console.log('🔧 Check your Google Sheet for session ID:', testData.sessionId);
        
    } catch (error) {
        console.error('🔧 Test failed:', error);
    }
}

debugSheetId(); 