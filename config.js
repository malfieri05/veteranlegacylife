// Centralized Configuration
const CONFIG = {
  GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycby0-3Hd6SR7KJqxSOsjl-zGhTV1F_bvV-x2sERUqLLoLwZacexp-FFdYlyqEEZkImE/exec'
}

// Helper function to get the API URL
function getApiUrl() {
  return CONFIG.GOOGLE_APPS_SCRIPT_URL
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONFIG, getApiUrl }
} 