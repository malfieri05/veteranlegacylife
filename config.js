// Centralized Configuration
const CONFIG = {
  GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzSYFrwwTMIITMCFPmTRaQEr2DazQjKamxPChDZeJjKh96XIdZ8O-w0x5YYmpJvlU9y/exec'
}

// Helper function to get the API URL
function getApiUrl() {
  return CONFIG.GOOGLE_APPS_SCRIPT_URL
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONFIG, getApiUrl }
} 