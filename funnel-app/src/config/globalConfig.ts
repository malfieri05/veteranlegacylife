// Global Configuration File
// Update these values when deploying to production or changing environments

// Type declaration for global config
declare global {
  interface Window {
    VeteranFunnelConfig?: {
      GOOGLE_APPS_SCRIPT: {
        URL: string;
      };
      GOOGLE_SHEET: {
        SHEET_ID: string;
        SHEET_NAME: string;
      };
      EMAIL: {
        ADMIN: string;
        FROM: string;
        TO: string;
        REPLY_TO: string;
      };
      COMPANY: {
        NAME: string;
        PHONE: string;
        PHONE_DIALABLE: string;
        WEBSITE: string;
      };
    };
  }
}

export const GLOBAL_CONFIG = {
  // Google Apps Script Deployment URL - Use global config if available
  GOOGLE_APPS_SCRIPT: {
    URL: (typeof window !== 'undefined' && window.VeteranFunnelConfig?.GOOGLE_APPS_SCRIPT?.URL) || 
         'https://script.google.com/macros/s/AKfycbxhXl4p_iBSAY_XjkbNlQbC7KOcfS0UPlcYNnNYOqZzc-Fbk7Y_PUJAktPea4HyEMMM6Q/exec'
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
    SHEET_ID: '1-X3qkXd6xh2Y9dG6AmIP_ljd2o0UUZfYUcR1RoreMXM',
    // Sheet name (tab name)
    SHEET_NAME: 'Veteran Legacy Life Funnel Data'
  },
  
  // Company Information
  COMPANY: {
    NAME: 'Veteran Legacy Life',
    PHONE: '503-764-5097',
    PHONE_DIALABLE: '5037645097', // Actual number to dial
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