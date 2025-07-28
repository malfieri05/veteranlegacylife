// Centralized Configuration
const CONFIG = {
  GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbyLAFWndHGK5dckYZdHlQXObVjiDjf6jbcxTQuFJia8tTXXmuF4ITmVbx98ij4HacJK/exec'
}

// Helper function to get the API URL
function getApiUrl() {
  return CONFIG.GOOGLE_APPS_SCRIPT_URL
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONFIG, getApiUrl }
} 