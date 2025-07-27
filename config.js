// Centralized Configuration
const CONFIG = {
  GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxbhebRgMWuxUBJ056yoS5MTO4a0X3w_cyN7_m5AArx-ZHiLyHR3BcDrzxiEb_S0jeU/exec'
}

// Helper function to get the API URL
function getApiUrl() {
  return CONFIG.GOOGLE_APPS_SCRIPT_URL
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONFIG, getApiUrl }
} 