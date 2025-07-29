// Global Configuration File
// Update these values when deploying to production or changing environments

export const GLOBAL_CONFIG = {
  // Google Apps Script Deployment URL
  GOOGLE_APPS_SCRIPT: {
    URL: 'https://script.google.com/macros/s/AKfycbxxIKg0H2YSi4OI1ZMfmY9zwNbcwr8G1m2GlBB_SlvmTZckcPX_vRH8nfnAa5SqK3xs/exec'
  },
  
  // Email Configuration
  EMAIL: {
    // Admin email (where notifications are sent)
    ADMIN: 'lindsey08092@gmail.com',
    // From email (sender)
    FROM: 'lindsey08092@gmail.com',
    // To email (recipient) - change to actual user email when authorized
    TO: 'lindsey08092@gmail.com',
    // Reply-to email
    REPLY_TO: 'lindsey08092@gmail.com'
  },
  
  // Google Sheet Configuration
  GOOGLE_SHEET: {
    // Google Sheet ID (found in the URL of the sheet)
    SHEET_ID: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    // Sheet name (tab name)
    SHEET_NAME: 'Veteran Legacy Life Funnel Data'
  },
  
  // Company Information
  COMPANY: {
    NAME: 'Veteran Legacy Life',
    PHONE: '(800) VET-INSURANCE',
    PHONE_DIALABLE: '180083847467', // Actual number to dial (800-VET-INSURANCE)
    WEBSITE: 'https://veteranlegacylife.com'
  }
} as const;

// Helper function to get API URL
export const getApiUrl = () => GLOBAL_CONFIG.GOOGLE_APPS_SCRIPT.URL

// Helper function to get email configuration
export const getEmailConfig = () => GLOBAL_CONFIG.EMAIL

// Helper function to get Google Sheet configuration
export const getGoogleSheetConfig = () => GLOBAL_CONFIG.GOOGLE_SHEET

// Helper function to get company information
export const getCompanyConfig = () => GLOBAL_CONFIG.COMPANY 