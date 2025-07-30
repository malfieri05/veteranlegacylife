// Test script to verify global configuration
console.log('🔧 Testing global configuration...');

// Check if global config is available
if (window.VeteranFunnelConfig) {
    console.log('✅ Global config found:', window.VeteranFunnelConfig);
    console.log('🔧 API URL:', window.VeteranFunnelConfig.GOOGLE_APPS_SCRIPT.URL);
    console.log('🔧 Sheet ID:', window.VeteranFunnelConfig.GOOGLE_SHEET.SHEET_ID);
    
    // Test the helper functions
    if (window.getVeteranFunnelApiUrl) {
        console.log('✅ Helper function getVeteranFunnelApiUrl():', window.getVeteranFunnelApiUrl());
    }
    
    if (window.getVeteranFunnelSheetId) {
        console.log('✅ Helper function getVeteranFunnelSheetId():', window.getVeteranFunnelSheetId());
    }
    
} else {
    console.error('❌ Global config not found!');
}

// Test if the static config is using the global config
if (typeof Config !== 'undefined') {
    console.log('🔧 Static config API URL:', Config.GOOGLE_APPS_SCRIPT_URL);
    console.log('🔧 URLs match:', Config.GOOGLE_APPS_SCRIPT_URL === window.VeteranFunnelConfig?.GOOGLE_APPS_SCRIPT?.URL);
} else {
    console.log('🔧 Static config not loaded yet');
} 