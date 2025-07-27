// Centralized Configuration
const CONFIG = {
  GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbw7Ax-Yj5daG3cRfHX73uaLBUc2fz6QA8EdkEKENnPqm8OFJhVImqUH-B8nyOyfJD-D/exec'
}

// Helper function to get the API URL
function getApiUrl() {
  return CONFIG.GOOGLE_APPS_SCRIPT_URL
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONFIG, getApiUrl }
} 