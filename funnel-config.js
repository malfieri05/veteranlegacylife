/**
 * Global Configuration for Veteran Life Insurance Funnel
 * This file provides a single source of truth for all configuration
 */

// Global configuration object
window.VeteranFunnelConfig = {
  // Google Apps Script Deployment URL
  GOOGLE_APPS_SCRIPT: {
    URL: 'https://script.google.com/macros/s/AKfycbwnU-KpI1d0yuFeB1dIqBbpwlvpkakdXu1rN8IiRKFalHwiESYF7gs14w58Dkk_ObHWwg/exec'
  },
  
  // Google Sheet Configuration
  GOOGLE_SHEET: {
    SHEET_ID: '1-X3qkXd6xh2Y9dG6AmIP_ljd2o0UUZfYUcR1RoreMXM',
    SHEET_NAME: 'Veteran Legacy Life Funnel Data'
  },
  
  // Email Configuration
  EMAIL: {
    ADMIN: 'lindsey08092@gmail.com',
    FROM: 'lindsey08092@gmail.com',
    TO: 'lindsey08092@gmail.com',
    REPLY_TO: 'lindsey08092@gmail.com'
  },
  
  // Company Information
  COMPANY: {
    NAME: 'Veteran Legacy Life',
    PHONE: '(800) VET-INSURANCE',
    PHONE_DIALABLE: '180083847467',
    WEBSITE: 'https://veteranlegacylife.com'
  }
};

// Helper functions for backward compatibility
window.getVeteranFunnelConfig = () => window.VeteranFunnelConfig;
window.getVeteranFunnelApiUrl = () => window.VeteranFunnelConfig.GOOGLE_APPS_SCRIPT.URL;
window.getVeteranFunnelSheetId = () => window.VeteranFunnelConfig.GOOGLE_SHEET.SHEET_ID; 