/**
 * Google Apps Script for React Funnel Data Capture
 * Captures all questions from both pre-qualification and application phases
 */

// =============== CONFIGURATION SECTION ===============
// Update these values when deploying to production or changing environments

const CONFIG = {
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
};

// Column reference map for unified sheet structure
const SHEET_COLUMNS = {
  // Core (1-4)
  TIMESTAMP: 1,
  SESSION_ID: 2,
  STATUS: 3,
  LAST_ACTIVITY: 4,
  
  // Contact (5-10)
  FIRST_NAME: 5,
  LAST_NAME: 6,
  EMAIL: 7,
  PHONE: 8,
  DOB: 9,
  TRANSACTIONAL_CONSENT: 10,
  MARKETING_CONSENT: 11,
  
  // Pre-qualification (12-16)
  STATE: 12,
  MILITARY_STATUS: 13,
  BRANCH: 14,
  MARITAL_STATUS: 15,
  COVERAGE_AMOUNT: 16,
  
  // Medical (17-22)
  TOBACCO_USE: 17,
  MEDICAL_CONDITIONS: 18,
  HEIGHT: 19,
  WEIGHT: 20,
  HOSPITAL_CARE: 21,
  DIABETES_MEDICATION: 22,
  
  // Application (23-34)
  STREET_ADDRESS: 23,
  CITY: 24,
  APPLICATION_STATE: 25,
  ZIP_CODE: 26,
  BENEFICIARY_NAME: 27,
  BENEFICIARY_RELATIONSHIP: 28,
  VA_NUMBER: 29,
  SERVICE_CONNECTED: 30,
  SSN: 31,
  BANK_NAME: 32,
  ROUTING_NUMBER: 33,
  ACCOUNT_NUMBER: 34,
  
  // Quote (35-40)
  POLICY_DATE: 35,
  QUOTE_COVERAGE: 36,
  QUOTE_PREMIUM: 37,
  QUOTE_AGE: 38,
  QUOTE_GENDER: 39,
  QUOTE_TYPE: 40,
  
  // Tracking (41-48)
  CURRENT_STEP: 41,
  STEP_NAME: 42,
  FORM_TYPE: 43,
  USER_AGENT: 44,
  REFERRER: 45,
  UTM_SOURCE: 46,
  UTM_MEDIUM: 47,
  UTM_CAMPAIGN: 48,
  
  // Email Status (49-50)
  PARTIAL_EMAIL_SENT: 49,
  COMPLETED_EMAIL_SENT: 50
};

function doPost(e) {
  const timestamp = new Date();
  
  // Get session ID from request or generate one if not provided
  let sessionId = '';
  
  try {
    Logger.log(`[${sessionId}] =============== START REQUEST ===============`);
    Logger.log(`[${sessionId}] Timestamp: ${timestamp}`);
    
    // Validate spreadsheet access first
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) {
      throw new Error('No active spreadsheet found. Please ensure the script is bound to a Google Sheet.');
    }
    
    // Validate and parse incoming data
    let data = {};
    
    if (!e) {
      throw new Error('Event object is undefined');
    }
    
    Logger.log(`[${sessionId}] Event object received, keys: ${Object.keys(e)}`);
    
    if (e.postData && e.postData.contents) {
      Logger.log(`[${sessionId}] Parsing data from postData.contents`);
      Logger.log(`[${sessionId}] Content type: ${e.postData.type}`);
      Logger.log(`[${sessionId}] Content length: ${e.postData.contents.length}`);
      
      if (e.postData.type === 'application/json') {
        data = JSON.parse(e.postData.contents);
      } else {
        // Handle URL-encoded data manually (URLSearchParams not available in GAS)
        const formData = e.postData.contents;
        const params = formData.split('&');
        for (let i = 0; i < params.length; i++) {
          const pair = params[i].split('=');
          if (pair.length === 2) {
            const key = decodeURIComponent(pair[0]);
            const value = decodeURIComponent(pair[1]);
            data[key] = value;
          }
        }
      }
    } else if (e.parameter && Object.keys(e.parameter).length > 0) {
      Logger.log(`[${sessionId}] Using parameter data`);
      data = e.parameter;
    } else {
      Logger.log(`[${sessionId}] Full event object: ${JSON.stringify(e)}`);
      throw new Error('No valid data found in request');
    }
    
    Logger.log(`[${sessionId}] Parsed data keys: ${Object.keys(data)}`);
    
    // Get session ID from request data or generate one
    sessionId = data.sessionId || Utilities.getUuid();
    Logger.log(`[${sessionId}] Using session ID: ${sessionId}`);
    
    const formType = data.formType;
    if (!formType) {
      throw new Error('Missing formType in request data');
    }
    
    Logger.log(`[${sessionId}] Processing ${formType} submission`);
    
    let response = {};
    
    if (formType === 'Lead') {
      response = handleLeadSubmission(data, sessionId);
    } else if (formType === 'Application') {
      response = handleApplicationSubmission(data, sessionId);
    } else if (formType === 'Partial') {
      response = handlePartialSubmission(data, sessionId);
    } else if (formType === 'LeadPartial') {
      response = handleLeadPartialSubmission(data, sessionId);
    } else if (formType === 'Abandonment') {
      response = handleAbandonmentDetection(sessionId);
    } else {
      throw new Error('Invalid form type: ' + formType);
    }
    
    Logger.log(`[${sessionId}] Success response: ${JSON.stringify(response)}`);
    Logger.log(`[${sessionId}] =============== END REQUEST ===============`);
    
    // Return success response (same as old script - no CORS headers needed)
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log(`[${sessionId}] =============== ERROR ===============`);
    Logger.log(`[${sessionId}] Error: ${error.toString()}`);
    Logger.log(`[${sessionId}] Stack trace: ${error.stack}`);
    
    if (e) {
      Logger.log(`[${sessionId}] Event object for debugging: ${JSON.stringify(e)}`);
    }
    
    // Return error response (same as old script - no CORS headers needed)
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
        sessionId: sessionId,
        timestamp: timestamp.toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const sessionId = Utilities.getUuid();
  const timestamp = new Date();
  
  Logger.log(`[${sessionId}] Incoming GET request at ${timestamp}`);
  
  // Return a simple response for GET requests (like when someone visits the URL directly)
  return ContentService
    .createTextOutput(JSON.stringify({
      success: false,
      error: 'This endpoint only accepts POST requests',
      message: 'Please use this endpoint with POST method and JSON data',
      sessionId: sessionId,
      timestamp: timestamp.toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doOptions(e) {
  const sessionId = Utilities.getUuid();
  const timestamp = new Date();
  
  Logger.log(`[${sessionId}] Incoming OPTIONS request at ${timestamp}`);
  
  // Handle OPTIONS requests (same as old script - simple response)
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

function handleLeadSubmission(data, sessionId) {
  Logger.log(`[${sessionId}] Starting lead submission`);
  
  // Check if we have access to a spreadsheet
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    Logger.log(`[${sessionId}] ERROR: No active spreadsheet found`);
    throw new Error('No active spreadsheet found. Please ensure the script is bound to a Google Sheet.');
  }
  
  let sheet = spreadsheet.getActiveSheet();
  
  // Parse formData if it's a JSON string
  let parsedFormData = {};
  if (data.formData) {
    try {
      parsedFormData = JSON.parse(data.formData);
    } catch (e) {
      Logger.log(`[${sessionId}] Error parsing formData: ${e.toString()}`);
      parsedFormData = {};
    }
  }
  
  // Use unified row data builder
  const rowData = buildUnifiedRowData(data, sessionId);
  
  // Check if session already exists in the sheet
  let existingRowIndex = -1;
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  // Session ID is in column B (index 1)
  Logger.log(`[${sessionId}] Searching for existing session ID: ${sessionId}`);
  for (let i = 1; i < values.length; i++) {
    const existingSessionId = values[i][1];
    Logger.log(`[${sessionId}] Row ${i + 1} has session ID: ${existingSessionId}`);
    // Compare session IDs, handling both string and null/undefined cases
    if (existingSessionId && sessionId && existingSessionId.toString() === sessionId.toString()) {
      existingRowIndex = i + 1; // +1 because sheet rows are 1-indexed
      Logger.log(`[${sessionId}] Found existing session at row ${existingRowIndex}`);
      break;
    }
  }
  
  if (existingRowIndex === -1) {
    Logger.log(`[${sessionId}] No existing session found, will create new row`);
  }
  
  if (existingRowIndex > 0) {
    // Update existing row
    Logger.log(`[${sessionId}] Updating existing session row: ${existingRowIndex}`);
    const range = sheet.getRange(existingRowIndex, 1, 1, rowData.length);
    range.setValues([rowData]);
  } else {
    // Append new row
    Logger.log(`[${sessionId}] Creating new session row`);
    sheet.appendRow(rowData);
  }
  
  // Send email notification
  sendLeadNotification(data);
  
  Logger.log(`[${sessionId}] Lead submission completed successfully`);
  
  return {
    success: true,
    message: 'Lead data captured successfully',
    sessionId: sessionId
  };
}

function handleApplicationSubmission(data, sessionId) {
  Logger.log(`[${sessionId}] Starting application submission`);
  
  // Check if we have access to a spreadsheet
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    Logger.log(`[${sessionId}] ERROR: No active spreadsheet found`);
    throw new Error('No active spreadsheet found. Please ensure the script is bound to a Google Sheet.');
  }
  
  let sheet = spreadsheet.getActiveSheet();
  
  // Parse formData if it's a JSON string
  let parsedFormData = {};
  if (data.formData) {
    try {
      parsedFormData = JSON.parse(data.formData);
    } catch (e) {
      Logger.log(`[${sessionId}] Error parsing formData: ${e.toString()}`);
      parsedFormData = {};
    }
  }
  
  // Use unified row data builder
  const rowData = buildUnifiedRowData(data, sessionId);
  
  // Check if session already exists in the sheet
  let existingRowIndex = -1;
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  // Session ID is in column B (index 1)
  Logger.log(`[${sessionId}] Searching for existing session ID: ${sessionId}`);
  for (let i = 1; i < values.length; i++) {
    const existingSessionId = values[i][1];
    Logger.log(`[${sessionId}] Row ${i + 1} has session ID: ${existingSessionId}`);
    // Compare session IDs, handling both string and null/undefined cases
    if (existingSessionId && sessionId && existingSessionId.toString() === sessionId.toString()) {
      existingRowIndex = i + 1; // +1 because sheet rows are 1-indexed
      Logger.log(`[${sessionId}] Found existing session at row ${existingRowIndex}`);
      break;
    }
  }
  
  if (existingRowIndex === -1) {
    Logger.log(`[${sessionId}] No existing session found, will create new row`);
  }
  
  if (existingRowIndex > 0) {
    // Update existing row
    Logger.log(`[${sessionId}] Updating existing session row: ${existingRowIndex}`);
    const range = sheet.getRange(existingRowIndex, 1, 1, rowData.length);
    range.setValues([rowData]);
  } else {
    // Append new row
    Logger.log(`[${sessionId}] Creating new session row`);
    sheet.appendRow(rowData);
  }
  
  // Send completion email BEFORE marking as completed  
  const emailSent = sendApplicationNotification(data, sessionId);

  // THEN update session status to submitted AND mark completed email as sent
  updateSessionStatus(sessionId, 'submitted');
  if (emailSent) {
    markEmailAsSent(sessionId, 'completed');
    Logger.log(`[${sessionId}] ✅ Application completion email sent and marked as sent`);
  }
  
  Logger.log(`[${sessionId}] Application submission completed successfully`);
  
  return {
    success: true,
    message: 'Application data captured successfully',
    sessionId: sessionId
  };
}

function handlePartialSubmission(data, sessionId) {
  Logger.log(`[${sessionId}] Starting partial submission for step ${data.currentStep}`);
  
  // Check if we have access to a spreadsheet
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    Logger.log(`[${sessionId}] ERROR: No active spreadsheet found`);
    throw new Error('No active spreadsheet found. Please ensure the script is bound to a Google Sheet.');
  }
  
  let sheet = spreadsheet.getActiveSheet();
  
  // Parse formData if it's a JSON string
  let parsedFormData = {};
  if (data.formData) {
    try {
      parsedFormData = JSON.parse(data.formData);
    } catch (e) {
      Logger.log(`[${sessionId}] Error parsing formData: ${e.toString()}`);
      parsedFormData = {};
    }
  }
  
  // Use unified row data builder
  const rowData = buildUnifiedRowData(data, sessionId);
  
  // Check if session already exists in the sheet
  let existingRowIndex = -1;
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  // Session ID is in column B (index 1)
  Logger.log(`[${sessionId}] Searching for existing session ID: ${sessionId}`);
  for (let i = 1; i < values.length; i++) {
    const existingSessionId = values[i][1];
    Logger.log(`[${sessionId}] Row ${i + 1} has session ID: ${existingSessionId}`);
    // Compare session IDs, handling both string and null/undefined cases
    if (existingSessionId && sessionId && existingSessionId.toString() === sessionId.toString()) {
      existingRowIndex = i + 1; // +1 because sheet rows are 1-indexed
      Logger.log(`[${sessionId}] Found existing session at row ${existingRowIndex}`);
      break;
    }
  }
  
  if (existingRowIndex === -1) {
    Logger.log(`[${sessionId}] No existing session found, will create new row`);
  }
  
  if (existingRowIndex > 0) {
    // Update existing row
    Logger.log(`[${sessionId}] Updating existing session row: ${existingRowIndex}`);
    const range = sheet.getRange(existingRowIndex, 1, 1, rowData.length);
    range.setValues([rowData]);
  } else {
    // Append new row
    Logger.log(`[${sessionId}] Creating new session row`);
    sheet.appendRow(rowData);
  }
  
  // Update session status based on step and phone capture
  const hasPhone = parsedFormData.contactInfo?.phone;
  const isContactStep = data.currentStep >= 6; // Contact info is step 6, not step 5

  if (hasPhone && isContactStep) {
    // Phone number captured - mark session for potential abandonment email
    updateSessionStatus(sessionId, 'phone_captured', parsedFormData);
    Logger.log(`[${sessionId}] ✅ Phone number captured at step ${data.currentStep}, session marked for abandonment tracking`);
  } else {
    // Update last activity
    updateSessionStatus(sessionId, 'active', parsedFormData);
    Logger.log(`[${sessionId}] Session marked as active (step ${data.currentStep}, hasPhone: ${!!hasPhone})`);
  }
  
  Logger.log(`[${sessionId}] Partial submission completed successfully`);
  
  return {
    success: true,
    message: 'Partial data captured successfully',
    sessionId: sessionId,
    step: data.currentStep
  };
}

function handleLeadPartialSubmission(data, sessionId) {
  Logger.log(`[${sessionId}] Starting lead partial submission`);
  
  // Check if we have access to a spreadsheet
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    Logger.log(`[${sessionId}] ERROR: No active spreadsheet found`);
    throw new Error('No active spreadsheet found. Please ensure the script is bound to a Google Sheet.');
  }
  
  let sheet = spreadsheet.getActiveSheet();
  
  // Parse formData if it's a JSON string
  let parsedFormData = {};
  if (data.formData) {
    try {
      parsedFormData = JSON.parse(data.formData);
    } catch (e) {
      Logger.log(`[${sessionId}] Error parsing formData: ${e.toString()}`);
      parsedFormData = {};
    }
  }
  
  // Use unified row data builder
  const rowData = buildUnifiedRowData(data, sessionId);
  
  // Check if session already exists in the sheet
  let existingRowIndex = -1;
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  // Session ID is in column B (index 1)
  Logger.log(`[${sessionId}] Searching for existing session ID: ${sessionId}`);
  for (let i = 1; i < values.length; i++) {
    const existingSessionId = values[i][1];
    Logger.log(`[${sessionId}] Row ${i + 1} has session ID: ${existingSessionId}`);
    // Compare session IDs, handling both string and null/undefined cases
    if (existingSessionId && sessionId && existingSessionId.toString() === sessionId.toString()) {
      existingRowIndex = i + 1; // +1 because sheet rows are 1-indexed
      Logger.log(`[${sessionId}] Found existing session at row ${existingRowIndex}`);
      break;
    }
  }
  
  if (existingRowIndex === -1) {
    Logger.log(`[${sessionId}] No existing session found, will create new row`);
  }
  
  if (existingRowIndex > 0) {
    // Update existing row
    Logger.log(`[${sessionId}] Updating existing session row: ${existingRowIndex}`);
    const range = sheet.getRange(existingRowIndex, 1, 1, rowData.length);
    range.setValues([rowData]);
  } else {
    // Append new row
    Logger.log(`[${sessionId}] Creating new session row`);
    sheet.appendRow(rowData);
  }
  
  // Update session status (no email sent here - only on abandonment or completion)
  updateSessionStatus(sessionId, 'active', parsedFormData);
  
  Logger.log(`[${sessionId}] Lead partial submission completed successfully`);
  
  return {
    success: true,
    message: 'Lead partial data captured successfully',
    sessionId: sessionId,
    step: data.currentStep
  };
}

// Unified sheet setup function - replaces all previous setup functions
function setupUnifiedSheet(sheet) {
  const headers = [
    // Core Tracking (Columns 1-4)
    'Timestamp',
    'Session ID', 
    'Status',
    'Last Activity',
    
    // Contact Information (Columns 5-11)
    'First Name',
    'Last Name', 
    'Email',
    'Phone',
    'Date of Birth',
    'Transactional Consent',
    'Marketing Consent',
    
    // Pre-Qualification Data (Columns 12-16)
    'State',
    'Military Status',
    'Branch of Service',
    'Marital Status', 
    'Coverage Amount',
    
    // Medical Information (Columns 17-22)
    'Tobacco Use',
    'Medical Conditions',
    'Height',
    'Weight',
    'Hospital Care',
    'Diabetes Medication',
    
    // Application Data (Columns 23-34)
    'Street Address',
    'City',
    'Application State',
    'ZIP Code',
    'Beneficiary Name',
    'Beneficiary Relationship',
    'VA Number',
    'Service Connected Disability',
    'SSN',
    'Bank Name',
    'Routing Number',
    'Account Number',
    
    // Quote Information (Columns 35-40)
    'Policy Date',
    'Quote Coverage Amount',
    'Quote Monthly Premium',
    'Quote User Age',
    'Quote User Gender',
    'Quote Type',
    
    // Tracking Data (Columns 41-48)
    'Current Step',
    'Step Name',
    'Form Type',
    'User Agent',
    'Referrer',
    'UTM Source',
    'UTM Medium',
    'UTM Campaign',
    
    // Email Status (Columns 49-50)
    'Partial Email Sent',
    'Completed Email Sent'
  ];
  
  // TOTAL: 50 columns exactly
  
  // Clear any existing data first
  sheet.clear();
  
  // Set headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.autoResizeColumns(1, headers.length);
  
  Logger.log(`✅ Sheet setup complete with ${headers.length} columns`);
  Logger.log(`Headers: ${headers.join(', ')}`);
  return headers.length;
}

// Validation function to verify sheet structure
function validateSheetStructure() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getActiveSheet();
  
  // Check if headers exist
  const headerRange = sheet.getRange(1, 1, 1, 50);
  const headers = headerRange.getValues()[0];
  
  Logger.log(`Current sheet has ${headers.length} columns`);
  Logger.log(`Expected: 50 columns`);
  
  if (headers.length !== 50) {
    Logger.log('❌ SHEET STRUCTURE MISMATCH');
    Logger.log('Run setupUnifiedSheet() to fix');
    return false;
  }
  
  Logger.log('✅ Sheet structure is correct');
  return true;
}

// Function to reset sheet structure
function resetSheetStructure() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getActiveSheet();
  
  // Clear existing headers
  sheet.getRange(1, 1, 1, sheet.getLastColumn()).clear();
  
  // Setup new unified structure
  setupUnifiedSheet(sheet);
  
  Logger.log('Sheet structure reset to unified format');
}

// Unified data row builder - replaces all different rowData arrays
function buildUnifiedRowData(data, sessionId) {
  Logger.log(`[${sessionId}] ===== BUILDING ROW DATA =====`);
  
  // Parse form data once
  let parsedFormData = {};
  if (data.formData) {
    try {
      parsedFormData = typeof data.formData === 'string' 
        ? JSON.parse(data.formData) 
        : data.formData;
    } catch (e) {
      Logger.log(`[${sessionId}] Error parsing formData: ${e.toString()}`);
      parsedFormData = {};
    }
  }
  
  // Log the parsed data for debugging
  Logger.log(`[${sessionId}] Form Type: ${data.formType}`);
  Logger.log(`[${sessionId}] Parsed form data keys: ${Object.keys(parsedFormData)}`);
  
  // Initialize exactly 50 columns with empty strings
  const rowData = new Array(50).fill('');
  
  // ===== CORE (Columns 1-4) =====
  rowData[0] = new Date(); // Timestamp
  rowData[1] = sessionId;   // Session ID
  rowData[2] = getStatusFromFormType(data.formType); // Status
  rowData[3] = new Date(); // Last Activity
  
  // ===== CONTACT (Columns 5-11) =====
  rowData[4] = parsedFormData.contactInfo?.firstName || ''; // First Name
  rowData[5] = parsedFormData.contactInfo?.lastName || '';  // Last Name
  rowData[6] = parsedFormData.contactInfo?.email || '';     // Email
  rowData[7] = parsedFormData.contactInfo?.phone || '';     // Phone
  rowData[8] = parsedFormData.dateOfBirth || '';            // DOB
  rowData[9] = parsedFormData.contactInfo?.transactionalConsent ? 'TRUE' : 'FALSE'; // Transactional Consent
  rowData[10] = parsedFormData.contactInfo?.marketingConsent ? 'TRUE' : 'FALSE';    // Marketing Consent
  
  // ===== PRE-QUALIFICATION (Columns 12-16) =====
  rowData[11] = parsedFormData.state || data.state || '';                    // State
  rowData[12] = parsedFormData.militaryStatus || data.militaryStatus || '';  // Military Status
  rowData[13] = parsedFormData.branchOfService || data.branchOfService || ''; // Branch
  rowData[14] = parsedFormData.maritalStatus || data.maritalStatus || '';    // Marital Status
  rowData[15] = parsedFormData.coverageAmount || data.coverageAmount || '';  // Coverage Amount
  
  // ===== MEDICAL (Columns 17-22) =====
  rowData[16] = parsedFormData.medicalAnswers?.tobaccoUse || '';                           // Tobacco Use
  rowData[17] = Array.isArray(parsedFormData.medicalAnswers?.medicalConditions)           // Medical Conditions
    ? parsedFormData.medicalAnswers.medicalConditions.join(', ') : '';
  rowData[18] = parsedFormData.medicalAnswers?.height || '';                               // Height
  rowData[19] = parsedFormData.medicalAnswers?.weight || '';                               // Weight
  rowData[20] = parsedFormData.medicalAnswers?.hospitalCare || '';                         // Hospital Care
  rowData[21] = parsedFormData.medicalAnswers?.diabetesMedication || '';                   // Diabetes Medication
  
  // ===== APPLICATION (Columns 23-34) =====
  rowData[22] = parsedFormData.applicationData?.address?.street || '';           // Street Address
  rowData[23] = parsedFormData.applicationData?.address?.city || '';             // City
  rowData[24] = parsedFormData.applicationData?.address?.state || '';            // Application State
  rowData[25] = parsedFormData.applicationData?.address?.zipCode || '';          // ZIP Code
  rowData[26] = parsedFormData.applicationData?.beneficiary?.name || '';         // Beneficiary Name
  rowData[27] = parsedFormData.applicationData?.beneficiary?.relationship || ''; // Beneficiary Relationship
  rowData[28] = parsedFormData.applicationData?.vaInfo?.vaNumber || '';          // VA Number
  rowData[29] = parsedFormData.applicationData?.vaInfo?.serviceConnected || '';  // Service Connected
  rowData[30] = parsedFormData.applicationData?.ssn || '';                       // SSN
  rowData[31] = parsedFormData.applicationData?.banking?.bankName || '';         // Bank Name
  rowData[32] = parsedFormData.applicationData?.banking?.routingNumber || '';    // Routing Number
  rowData[33] = parsedFormData.applicationData?.banking?.accountNumber || '';    // Account Number
  
  // ===== QUOTE (Columns 35-40) =====
  rowData[34] = parsedFormData.applicationData?.policyDate || '';                // Policy Date
  rowData[35] = parsedFormData.applicationData?.quoteData?.coverageAmount || ''; // Quote Coverage
  rowData[36] = parsedFormData.applicationData?.quoteData?.monthlyPremium || ''; // Quote Premium
  rowData[37] = parsedFormData.applicationData?.quoteData?.userAge || '';        // Quote Age
  rowData[38] = parsedFormData.applicationData?.quoteData?.userGender || '';     // Quote Gender
  rowData[39] = parsedFormData.applicationData?.quoteData?.quoteType || '';      // Quote Type
  
  // ===== TRACKING (Columns 41-48) =====
  rowData[40] = data.currentStep || '';   // Current Step
  rowData[41] = data.stepName || '';      // Step Name
  rowData[42] = data.formType || '';      // Form Type
  rowData[43] = data.userAgent || '';     // User Agent
  rowData[44] = data.referrer || '';      // Referrer
  rowData[45] = data.utmSource || '';     // UTM Source
  rowData[46] = data.utmMedium || '';     // UTM Medium
  rowData[47] = data.utmCampaign || '';   // UTM Campaign
  
  // ===== EMAIL STATUS (Columns 49-50) =====
  rowData[48] = 'FALSE'; // Partial Email Sent
  rowData[49] = 'FALSE'; // Completed Email Sent
  
  // Log final row data for debugging
  Logger.log(`[${sessionId}] Row data length: ${rowData.length}`);
  Logger.log(`[${sessionId}] Sample data: [${rowData.slice(0, 10).join(', ')}]`);
  
  return rowData;
}

function getStatusFromFormType(formType) {
  switch (formType) {
    case 'Lead': return 'pre-qualified';
    case 'Application': return 'submitted';
    case 'Partial': return 'active';
    case 'LeadPartial': return 'active';
    default: return 'unknown';
  }
}

// Helper function to find session row (reduces duplicate code)
function findSessionRow(sessionId, sheet) {
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  for (let i = 1; i < values.length; i++) {
    const existingSessionId = values[i][SHEET_COLUMNS.SESSION_ID - 1];
    if (existingSessionId && sessionId && existingSessionId.toString() === sessionId.toString()) {
      return i + 1; // 1-based row index
    }
  }
  
  return -1; // Not found
}

// Session tracking functions
function updateSessionStatus(sessionId, status, data = {}) {
  Logger.log(`[${sessionId}] Updating session status to: ${status}`);
  
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    Logger.log(`[${sessionId}] ERROR: No active spreadsheet found for session tracking`);
    return false;
  }
  
  let sheet = spreadsheet.getActiveSheet();
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  // Find existing session row
  let existingRowIndex = -1;
  for (let i = 1; i < values.length; i++) {
    const existingSessionId = values[i][1];
    if (existingSessionId && sessionId && existingSessionId.toString() === sessionId.toString()) {
      existingRowIndex = i + 1;
      break;
    }
  }
  
  if (existingRowIndex > 0) {
    // Update session status in the row
    const statusColumn = SHEET_COLUMNS.STATUS;
    const lastActivityColumn = SHEET_COLUMNS.LAST_ACTIVITY;
    const partialEmailSentColumn = SHEET_COLUMNS.PARTIAL_EMAIL_SENT;
    const completedEmailSentColumn = SHEET_COLUMNS.COMPLETED_EMAIL_SENT;
    
    sheet.getRange(existingRowIndex, statusColumn).setValue(status);
    sheet.getRange(existingRowIndex, lastActivityColumn).setValue(new Date());
    
    // Set email flags based on status
    if (status === 'phone_captured') {
      sheet.getRange(existingRowIndex, partialEmailSentColumn).setValue('FALSE');
    } else if (status === 'completed') {
      sheet.getRange(existingRowIndex, partialEmailSentColumn).setValue('TRUE'); // Prevent partial email
      sheet.getRange(existingRowIndex, completedEmailSentColumn).setValue('FALSE');
    }
    
    Logger.log(`[${sessionId}] Session status updated successfully`);
    return true;
  } else {
    Logger.log(`[${sessionId}] Session not found for status update`);
    return false;
  }
}

function checkSessionEmailStatus(sessionId, emailType) {
  Logger.log(`[${sessionId}] Checking ${emailType} email status for session`);
  
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    Logger.log(`[${sessionId}] ERROR: No active spreadsheet found for email status check`);
    return false;
  }
  
  let sheet = spreadsheet.getActiveSheet();
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  // Find existing session row
  let existingRowIndex = -1;
  for (let i = 1; i < values.length; i++) {
    const existingSessionId = values[i][1];
    if (existingSessionId && sessionId && existingSessionId.toString() === sessionId.toString()) {
      existingRowIndex = i + 1;
      break;
    }
  }
  
  if (existingRowIndex > 0) {
    const partialEmailSentColumn = SHEET_COLUMNS.PARTIAL_EMAIL_SENT;
    const completedEmailSentColumn = SHEET_COLUMNS.COMPLETED_EMAIL_SENT;
    
    if (emailType === 'partial') {
      const partialEmailSent = sheet.getRange(existingRowIndex, partialEmailSentColumn).getValue();
      Logger.log(`[${sessionId}] Partial email sent status: ${partialEmailSent}`);
      return partialEmailSent === 'TRUE';
    } else if (emailType === 'completed') {
      const completedEmailSent = sheet.getRange(existingRowIndex, completedEmailSentColumn).getValue();
      Logger.log(`[${sessionId}] Completed email sent status: ${completedEmailSent}`);
      return completedEmailSent === 'TRUE';
    }
  }
  
  return false;
}

function markEmailAsSent(sessionId, emailType) {
  Logger.log(`[${sessionId}] Marking ${emailType} email as sent`);
  
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    Logger.log(`[${sessionId}] ERROR: No active spreadsheet found for email marking`);
    return false;
  }
  
  let sheet = spreadsheet.getActiveSheet();
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  // Find existing session row
  let existingRowIndex = -1;
  for (let i = 1; i < values.length; i++) {
    const existingSessionId = values[i][1];
    if (existingSessionId && sessionId && existingSessionId.toString() === sessionId.toString()) {
      existingRowIndex = i + 1;
      break;
    }
  }
  
  if (existingRowIndex > 0) {
    const partialEmailSentColumn = SHEET_COLUMNS.PARTIAL_EMAIL_SENT;
    const completedEmailSentColumn = SHEET_COLUMNS.COMPLETED_EMAIL_SENT;
    
    if (emailType === 'partial') {
      sheet.getRange(existingRowIndex, partialEmailSentColumn).setValue('TRUE');
      Logger.log(`[${sessionId}] Partial email marked as sent`);
    } else if (emailType === 'completed') {
      sheet.getRange(existingRowIndex, completedEmailSentColumn).setValue('TRUE');
      Logger.log(`[${sessionId}] Completed email marked as sent`);
    }
    
    return true;
  }
  
  return false;
}

function sendPartialLeadEmail(data, sessionId) {
  // Check if partial email already sent
  if (checkSessionEmailStatus(sessionId, 'partial')) {
    Logger.log(`[${sessionId}] Partial email already sent, skipping`);
    return false;
  }
  
  // Check if user completed the application (prevent partial email)
  if (checkSessionEmailStatus(sessionId, 'completed')) {
    Logger.log(`[${sessionId}] User completed application, skipping partial email`);
    return false;
  }
  
  // Parse form data properly - handle both direct objects and JSON strings
  let parsedFormData = {};
  if (data.formData) {
    try {
      parsedFormData = typeof data.formData === 'string' 
        ? JSON.parse(data.formData) 
        : data.formData;
    } catch (e) {
      Logger.log(`[${sessionId}] Error parsing formData: ${e.toString()}`);
      // If parsing fails, assume data is already the correct structure
      parsedFormData = data;
    }
  } else {
    // No formData field, assume data is the structure itself
    parsedFormData = data;
  }
  
  const firstName = parsedFormData.contactInfo?.firstName || parsedFormData.firstName || 'there';
  const lastName = parsedFormData.contactInfo?.lastName || parsedFormData.lastName || '';
  const email = parsedFormData.contactInfo?.email || parsedFormData.email || '';
  const phone = parsedFormData.contactInfo?.phone || parsedFormData.phone || '';
  const currentStep = data.currentStep || 'Unknown';
  const stepName = data.stepName || 'Unknown Step';
  
  const subject = `📋 NEW LEAD: ${firstName} (Stopped at Step ${currentStep})`;
  
  const body = `
    <h2>📋 NEW LEAD RECEIVED</h2>
    
    <div style="background: #e3f2fd; padding: 15px; border-left: 4px solid #2196f3; margin: 10px 0;">
      <h3 style="color: #1565c0; margin-top: 0;">✅ Lead Provided Contact Info</h3>
      <p><strong>Stopped At:</strong> Step ${currentStep} - ${stepName}</p>
      <p><strong>Session ID:</strong> ${sessionId}</p>
      <p><strong>Submission Time:</strong> ${new Date().toLocaleString()}</p>
    </div>
    
    <h3>👤 Contact Information:</h3>
    <p><strong>Name:</strong> ${firstName} ${lastName}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Date of Birth:</strong> ${parsedFormData.dateOfBirth || parsedFormData.contactInfo?.dateOfBirth || ''}</p>
    
    <h3>🎖️ Military Information:</h3>
    <p><strong>State:</strong> ${parsedFormData.state || ''}</p>
    <p><strong>Military Status:</strong> ${parsedFormData.militaryStatus || ''}</p>
    <p><strong>Branch of Service:</strong> ${parsedFormData.branchOfService || ''}</p>
    <p><strong>Marital Status:</strong> ${parsedFormData.maritalStatus || ''}</p>
    <p><strong>Coverage Amount:</strong> ${parsedFormData.coverageAmount || ''}</p>
    
    <h3>🏥 Medical Information:</h3>
    <p><strong>Tobacco Use:</strong> ${parsedFormData.medicalAnswers?.tobaccoUse || ''}</p>
    <p><strong>Medical Conditions:</strong> ${parsedFormData.medicalAnswers?.medicalConditions?.join ? parsedFormData.medicalAnswers.medicalConditions.join(', ') : (parsedFormData.medicalAnswers?.medicalConditions || 'None')}</p>
    <p><strong>Height:</strong> ${parsedFormData.medicalAnswers?.height || ''}</p>
    <p><strong>Weight:</strong> ${parsedFormData.medicalAnswers?.weight || ''}</p>
    <p><strong>Hospital Care:</strong> ${parsedFormData.medicalAnswers?.hospitalCare || ''}</p>
    <p><strong>Diabetes Medication:</strong> ${parsedFormData.medicalAnswers?.diabetesMedication || ''}</p>
    
    <div style="background: #e8f5e8; padding: 15px; border-left: 4px solid #4caf50; margin: 20px 0;">
      <h3 style="color: #2e7d32; margin-top: 0;">📞 FOLLOW UP OPPORTUNITY</h3>
      <p><strong>Priority:</strong> MEDIUM - Lead provided contact info</p>
      <p><strong>Recommendation:</strong> Follow up within 24 hours</p>
      <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
    </div>
    
    <hr>
    <p><em>📋 New lead stopped at step ${currentStep} (${stepName}) on ${new Date().toLocaleString()}</em></p>
  `;
  
  // Send to admin email
  try {
    MailApp.sendEmail({
      to: CONFIG.EMAIL.ADMIN,
      subject: subject,
      htmlBody: body
    });
    
    // Mark email as sent
    markEmailAsSent(sessionId, 'partial');
    
    Logger.log(`[${sessionId}] ✅ NEW LEAD email sent successfully to ${CONFIG.EMAIL.ADMIN}`);
    return true;
  } catch (error) {
    Logger.log(`[${sessionId}] ❌ ERROR sending new lead email: ${error.toString()}`);
    return false;
  }
}

function sendLeadNotification(data) {
  Logger.log(`[${data.sessionId || 'UNKNOWN'}] 🎯 sendLeadNotification called - this should send PRE-QUALIFIED LEAD email`);
  Logger.log(`[${data.sessionId || 'UNKNOWN'}] Form Type: ${data.formType}`);
  Logger.log(`[${data.sessionId || 'UNKNOWN'}] Should contain: CONTACT, MILITARY, MEDICAL data only`);
  
  // Parse form data properly
  let parsedFormData = {};
  if (data.formData) {
    try {
      parsedFormData = typeof data.formData === 'string' 
        ? JSON.parse(data.formData) 
        : data.formData;
    } catch (e) {
      Logger.log(`Error parsing formData: ${e.toString()}`);
      parsedFormData = {};
    }
  }
  
  const firstName = parsedFormData.contactInfo?.firstName || 'there';
  const email = parsedFormData.contactInfo?.email || '';
  const phone = parsedFormData.contactInfo?.phone || '';
  const coverageAmount = parsedFormData.coverageAmount || data.coverageAmount || '';
  const currentStep = data.currentStep || 'Unknown';
  const stepName = data.stepName || 'Unknown Step';
  
  const subject = `📋 PRE-QUALIFIED LEAD: ${firstName} - ${parsedFormData.branchOfService || 'Veteran'}`;
  
  const body = `
    <h2>New React Funnel Lead Received</h2>
    
    <h3>Lead Information:</h3>
    <p><strong>Current Step:</strong> ${currentStep} - ${stepName}</p>
    <p><strong>Session ID:</strong> ${data.sessionId || 'Unknown'}</p>
    <p><strong>Submission Time:</strong> ${new Date().toLocaleString()}</p>
    
    <h3>Contact Information:</h3>
    <p><strong>Name:</strong> ${parsedFormData.contactInfo?.firstName || ''} ${parsedFormData.contactInfo?.lastName || ''}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Date of Birth:</strong> ${parsedFormData.dateOfBirth || ''}</p>
    
    <h3>Qualification Information:</h3>
    <p><strong>State:</strong> ${parsedFormData.state || data.state || ''}</p>
    <p><strong>Military Status:</strong> ${parsedFormData.militaryStatus || data.militaryStatus || ''}</p>
    <p><strong>Branch of Service:</strong> ${parsedFormData.branchOfService || data.branchOfService || ''}</p>
    <p><strong>Marital Status:</strong> ${parsedFormData.maritalStatus || data.maritalStatus || ''}</p>
    <p><strong>Coverage Amount:</strong> ${coverageAmount}</p>
    
    <h3>Medical Information:</h3>
    <p><strong>Tobacco Use:</strong> ${parsedFormData.medicalAnswers?.tobaccoUse || ''}</p>
    <p><strong>Medical Conditions:</strong> ${parsedFormData.medicalAnswers?.medicalConditions?.join(', ') || 'None'}</p>
    <p><strong>Height:</strong> ${parsedFormData.medicalAnswers?.height || ''}</p>
    <p><strong>Weight:</strong> ${parsedFormData.medicalAnswers?.weight || ''}</p>
    <p><strong>Hospital Care:</strong> ${parsedFormData.medicalAnswers?.hospitalCare || ''}</p>
    <p><strong>Diabetes Medication:</strong> ${parsedFormData.medicalAnswers?.diabetesMedication || ''}</p>
    
    <h3>Status:</h3>
    <p><strong>Status:</strong> Pre-Qualified</p>
    
    <hr>
    <p><em>This lead was submitted through the React Funnel at ${new Date().toLocaleString()}</em></p>
  `;
  
  // Send to admin email
  MailApp.sendEmail({
    to: CONFIG.EMAIL.ADMIN,
    subject: subject,
    htmlBody: body
  });
  
  // Send confirmation to lead
  if (email) {
    const confirmationSubject = 'Thank you for your interest in Veteran Life Insurance';
    const confirmationBody = `
      <h2>Thank you, ${firstName}!</h2>
      
      <p>We've received your pre-qualification information and you appear to qualify for life insurance coverage.</p>
      
      <h3>Next Steps:</h3>
      <ul>
        <li>Get your personalized quote</li>
        <li>Review coverage options</li>
        <li>Complete your application</li>
        <li>Start your coverage</li>
      </ul>
      
      <p>A licensed insurance representative will contact you within 24 hours to discuss your options.</p>
      
      <p><strong>Need immediate assistance?</strong><br>
      Call us at ${CONFIG.COMPANY.PHONE}<br>
      Monday-Friday 8AM-6PM EST</p>
      
      <hr>
      <p><em>Veteran Life Insurance</em></p>
    `;
    
    MailApp.sendEmail({
      to: email,
      subject: confirmationSubject,
      htmlBody: confirmationBody
    });
  }
}

function sendApplicationNotification(data, sessionId) {
  Logger.log(`[${sessionId}] 🎯 sendApplicationNotification called - this should send COMPLETE APPLICATION email`);
  Logger.log(`[${sessionId}] Form Type: ${data.formType}`);
  Logger.log(`[${sessionId}] Should contain: ADDRESS, BENEFICIARY, SSN, BANKING, QUOTE data`);
  
  // Check if completed email already sent
  if (checkSessionEmailStatus(sessionId, 'completed')) {
    Logger.log(`[${sessionId}] Completed email already sent, skipping`);
    return false;
  }
  
  // Debug: Log the raw data structure
  Logger.log(`[${sessionId}] Raw data keys: ${Object.keys(data)}`);
  Logger.log(`[${sessionId}] FormData type: ${typeof data.formData}`);
  
  // Parse form data properly
  let parsedFormData = {};
  if (data.formData) {
    try {
      parsedFormData = typeof data.formData === 'string' 
        ? JSON.parse(data.formData) 
        : data.formData;
      
      // Debug: Log the parsed data structure
      Logger.log(`[${sessionId}] Parsed formData keys: ${Object.keys(parsedFormData)}`);
      Logger.log(`[${sessionId}] ContactInfo keys: ${parsedFormData.contactInfo ? Object.keys(parsedFormData.contactInfo) : 'undefined'}`);
      Logger.log(`[${sessionId}] ApplicationData keys: ${parsedFormData.applicationData ? Object.keys(parsedFormData.applicationData) : 'undefined'}`);
      Logger.log(`[${sessionId}] QuoteData keys: ${parsedFormData.applicationData?.quoteData ? Object.keys(parsedFormData.applicationData.quoteData) : 'undefined'}`);
      Logger.log(`[${sessionId}] Address keys: ${parsedFormData.applicationData?.address ? Object.keys(parsedFormData.applicationData.address) : 'undefined'}`);
      Logger.log(`[${sessionId}] Banking keys: ${parsedFormData.applicationData?.banking ? Object.keys(parsedFormData.applicationData.banking) : 'undefined'}`);
      Logger.log(`[${sessionId}] SSN: ${parsedFormData.applicationData?.ssn ? '***-**-' + parsedFormData.applicationData.ssn.slice(-4) : 'Not provided'}`);
      Logger.log(`[${sessionId}] Driver's License: ${parsedFormData.applicationData?.driversLicense ? '***-' + parsedFormData.applicationData.driversLicense.slice(-4) : 'Not provided'}`);
      
    } catch (e) {
      Logger.log(`Error parsing formData: ${e.toString()}`);
      parsedFormData = {};
    }
  }
  
  const firstName = parsedFormData.contactInfo?.firstName || 'there';
  const email = parsedFormData.contactInfo?.email || '';
  const coverageAmount = parsedFormData.applicationData?.quoteData?.coverageAmount || parsedFormData.coverageAmount || '';
  const monthlyPremium = parsedFormData.applicationData?.quoteData?.monthlyPremium || '';
  const userAge = parsedFormData.applicationData?.quoteData?.userAge || '';
  const userGender = parsedFormData.applicationData?.quoteData?.userGender || '';
  const quoteType = parsedFormData.applicationData?.quoteData?.quoteType || 'IUL';
  
  // Helper function to encrypt sensitive data (show only last 4 digits)
  const encryptSensitiveData = (data) => {
    if (!data || data.length < 4) return data;
    return '*'.repeat(data.length - 4) + data.slice(-4);
  };
  
  const subject = `🎉 COMPLETE APPLICATION: ${firstName} - $${coverageAmount.toLocaleString()} Coverage`;
  
  const body = `
    <h2>NEW COMPLETE APPLICATION</h2>
    
    <h3>Application Information:</h3>
    <p><strong>Application Status:</strong> COMPLETE APPLICATION</p>
    <p><strong>Session ID:</strong> ${sessionId}</p>
    <p><strong>Submission Time:</strong> ${new Date().toLocaleString()}</p>
    
    <h3>Contact Information:</h3>
    <p><strong>Name:</strong> ${parsedFormData.contactInfo?.firstName || ''} ${parsedFormData.contactInfo?.lastName || ''}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${parsedFormData.contactInfo?.phone || ''}</p>
    <p><strong>Date of Birth:</strong> ${parsedFormData.dateOfBirth || ''}</p>
    
    <h3>Qualification Information:</h3>
    <p><strong>State:</strong> ${parsedFormData.state || ''}</p>
    <p><strong>Military Status:</strong> ${parsedFormData.militaryStatus || ''}</p>
    <p><strong>Branch of Service:</strong> ${parsedFormData.branchOfService || ''}</p>
    <p><strong>Marital Status:</strong> ${parsedFormData.maritalStatus || ''}</p>
    <p><strong>Coverage Amount:</strong> ${parsedFormData.coverageAmount || ''}</p>
    
    <h3>Medical Information:</h3>
    <p><strong>Tobacco Use:</strong> ${parsedFormData.medicalAnswers?.tobaccoUse || ''}</p>
    <p><strong>Medical Conditions:</strong> ${parsedFormData.medicalAnswers?.medicalConditions?.join(', ') || 'None'}</p>
    <p><strong>Height:</strong> ${parsedFormData.medicalAnswers?.height || ''}</p>
    <p><strong>Weight:</strong> ${parsedFormData.medicalAnswers?.weight || ''}</p>
    <p><strong>Hospital Care:</strong> ${parsedFormData.medicalAnswers?.hospitalCare || ''}</p>
    <p><strong>Diabetes Medication:</strong> ${parsedFormData.medicalAnswers?.diabetesMedication || ''}</p>
    
    <h3>Address Information:</h3>
    <p><strong>Street:</strong> ${parsedFormData.applicationData?.address?.street || 'Not provided'}</p>
    <p><strong>City:</strong> ${parsedFormData.applicationData?.address?.city || 'Not provided'}</p>
    <p><strong>State:</strong> ${parsedFormData.applicationData?.address?.state || 'Not provided'}</p>
    <p><strong>ZIP Code:</strong> ${parsedFormData.applicationData?.address?.zipCode || 'Not provided'}</p>
    
    <h3>Beneficiary Information:</h3>
    <p><strong>Name:</strong> ${parsedFormData.applicationData?.beneficiary?.name || 'Not provided'}</p>
    <p><strong>Relationship:</strong> ${parsedFormData.applicationData?.beneficiary?.relationship || 'Not provided'}</p>
    
    <h3>VA Information:</h3>
    <p><strong>VA Number:</strong> ${parsedFormData.applicationData?.vaInfo?.vaNumber || 'Not provided'}</p>
    <p><strong>Service Connected Disability:</strong> ${parsedFormData.applicationData?.vaInfo?.serviceConnected || 'Not specified'}</p>
    
    <h3>Personal Information:</h3>
    <p><strong>Social Security Number:</strong> ${parsedFormData.applicationData?.ssn ? encryptSensitiveData(parsedFormData.applicationData.ssn) : 'Not provided'}</p>
    <p><strong>Driver's License:</strong> ${parsedFormData.applicationData?.driversLicense ? encryptSensitiveData(parsedFormData.applicationData.driversLicense) : 'Not provided'}</p>
    
    <h3>Quote Information:</h3>
    <p><strong>Coverage Amount:</strong> ${coverageAmount ? '$' + coverageAmount.toLocaleString() : 'Not secured'}</p>
    <p><strong>Monthly Premium:</strong> ${monthlyPremium ? '$' + monthlyPremium.toLocaleString() : 'Not secured'}</p>
    <p><strong>Age:</strong> ${userAge || 'Not calculated'}</p>
    <p><strong>Gender:</strong> ${userGender || 'Not specified'}</p>
    <p><strong>Quote Type:</strong> ${quoteType}</p>
    
    <h3>Policy Information:</h3>
    <p><strong>Policy Date:</strong> ${parsedFormData.applicationData?.policyDate || 'Not provided'}</p>
    <p><strong>Bank Name:</strong> ${parsedFormData.applicationData?.banking?.bankName || 'Not provided'}</p>
    <p><strong>Routing Number:</strong> ${parsedFormData.applicationData?.banking?.routingNumber ? encryptSensitiveData(parsedFormData.applicationData.banking.routingNumber) : 'Not provided'}</p>
    <p><strong>Account Number:</strong> ${parsedFormData.applicationData?.banking?.accountNumber ? encryptSensitiveData(parsedFormData.applicationData.banking.accountNumber) : 'Not provided'}</p>
    
    <h3>Status:</h3>
    <p><strong>Status:</strong> COMPLETE APPLICATION SUBMITTED</p>
    
    <hr>
    <p><em>This is a COMPLETE APPLICATION with ALL data from the entire funnel at ${new Date().toLocaleString()}</em></p>
  `;
  
  // Send to admin email with error handling
  try {
    MailApp.sendEmail({
      to: CONFIG.EMAIL.ADMIN,
      subject: subject,
      htmlBody: body
    });
    Logger.log(`[${sessionId}] Admin email sent successfully`);
  } catch (error) {
    Logger.log(`[${sessionId}] ERROR sending admin email: ${error.toString()}`);
  }
  
  // Send confirmation to applicant with error handling
  if (email) {
    try {
      const confirmationSubject = 'Your application has been submitted successfully';
      const confirmationBody = `
        <h2>Let's Talk, ${firstName}!</h2>
        
        <p>Your application has been submitted successfully! A licensed insurance representative will contact you within 24 hours to finalize your policy.</p>
        
        <h3>Your Quote Summary:</h3>
        <ul>
          <li><strong>Monthly Premium:</strong> $${monthlyPremium.toLocaleString()}</li>
          <li><strong>Coverage Amount:</strong> $${coverageAmount.toLocaleString()}</li>
          <li><strong>Policy Type:</strong> IUL</li>
          <li><strong>Application Status:</strong> Submitted</li>
        </ul>
        
        <h3>What Happens Next?</h3>
        <ul>
          <li>You'll receive a confirmation email within 5 minutes</li>
          <li>A licensed agent will call you within 24 hours</li>
          <li>Your policy will be processed and finalized</li>
          <li>Coverage will begin on your selected start date</li>
        </ul>
        
        <p><strong>Need immediate assistance?</strong><br>
        Call us at ${CONFIG.COMPANY.PHONE}<br>
        Monday-Friday 8AM-6PM EST</p>
        
        <hr>
        <p><em>Veteran Life Insurance</em></p>
      `;
      
      MailApp.sendEmail({
        to: email,
        subject: confirmationSubject,
        htmlBody: confirmationBody
      });
      Logger.log(`[${sessionId}] User confirmation email sent successfully`);
    } catch (error) {
      Logger.log(`[${sessionId}] ERROR sending user confirmation email: ${error.toString()}`);
    }
  }
  
  // Mark email as sent
  markEmailAsSent(sessionId, 'completed');
  
  Logger.log(`[${sessionId}] Completed application email sent successfully`);
  return true;
}

// Abandonment detection function - called by React app when abandonment is detected
function handleAbandonmentDetection(sessionId) {
  Logger.log(`[${sessionId}] Abandonment detected, checking if partial email should be sent`);
  
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    Logger.log(`[${sessionId}] ERROR: No active spreadsheet found for abandonment check`);
    return {
      success: false,
      message: 'No active spreadsheet found',
      sessionId: sessionId
    };
  }
  
  let sheet = spreadsheet.getActiveSheet();
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  // Find existing session row
  let existingRowIndex = -1;
  for (let i = 1; i < values.length; i++) {
    const existingSessionId = values[i][SHEET_COLUMNS.SESSION_ID - 1];
    if (existingSessionId && sessionId && existingSessionId.toString() === sessionId.toString()) {
      existingRowIndex = i + 1;
      break;
    }
  }
  
  if (existingRowIndex > 0) {
    const sessionStatus = sheet.getRange(existingRowIndex, SHEET_COLUMNS.STATUS).getValue();
    
    if (sessionStatus === 'phone_captured') {
      Logger.log(`[${sessionId}] Phone captured session abandoned, sending partial email`);
      
      // Get session data for email (FIXED array indexing)
      const sessionData = {
        contactInfo: {
          firstName: values[existingRowIndex - 1][SHEET_COLUMNS.FIRST_NAME - 1] || '',
          lastName: values[existingRowIndex - 1][SHEET_COLUMNS.LAST_NAME - 1] || '',
          email: values[existingRowIndex - 1][SHEET_COLUMNS.EMAIL - 1] || '',
          phone: values[existingRowIndex - 1][SHEET_COLUMNS.PHONE - 1] || '',
          dateOfBirth: values[existingRowIndex - 1][SHEET_COLUMNS.DOB - 1] || ''
        },
        state: values[existingRowIndex - 1][SHEET_COLUMNS.STATE - 1] || '',
        militaryStatus: values[existingRowIndex - 1][SHEET_COLUMNS.MILITARY_STATUS - 1] || '',
        branchOfService: values[existingRowIndex - 1][SHEET_COLUMNS.BRANCH - 1] || '',
        maritalStatus: values[existingRowIndex - 1][SHEET_COLUMNS.MARITAL_STATUS - 1] || '',
        coverageAmount: values[existingRowIndex - 1][SHEET_COLUMNS.COVERAGE_AMOUNT - 1] || '',
        medicalAnswers: {
          tobaccoUse: values[existingRowIndex - 1][SHEET_COLUMNS.TOBACCO_USE - 1] || '',
          medicalConditions: values[existingRowIndex - 1][SHEET_COLUMNS.MEDICAL_CONDITIONS - 1] ? 
            values[existingRowIndex - 1][SHEET_COLUMNS.MEDICAL_CONDITIONS - 1].split(', ') : [],
          height: values[existingRowIndex - 1][SHEET_COLUMNS.HEIGHT - 1] || '',
          weight: values[existingRowIndex - 1][SHEET_COLUMNS.WEIGHT - 1] || '',
          hospitalCare: values[existingRowIndex - 1][SHEET_COLUMNS.HOSPITAL_CARE - 1] || '',
          diabetesMedication: values[existingRowIndex - 1][SHEET_COLUMNS.DIABETES_MEDICATION - 1] || ''
        }
      };
      
      // Create proper data structure for partial email
      const abandonmentData = {
        formData: JSON.stringify(sessionData),
        currentStep: values[existingRowIndex - 1][SHEET_COLUMNS.CURRENT_STEP - 1] || 'Unknown',
        stepName: values[existingRowIndex - 1][SHEET_COLUMNS.STEP_NAME - 1] || 'Unknown Step',
        sessionId: sessionId
      };

      // Send partial email with correct data structure
      const emailSent = sendPartialLeadEmail(abandonmentData, sessionId);
      return {
        success: true,
        message: emailSent ? 'Partial email sent successfully' : 'Partial email failed to send',
        sessionId: sessionId,
        emailSent: emailSent
      };
    } else {
      Logger.log(`[${sessionId}] Session status is ${sessionStatus}, no partial email sent`);
      return {
        success: true,
        message: `Session status is ${sessionStatus}, no partial email needed`,
        sessionId: sessionId,
        emailSent: false
      };
    }
  } else {
    Logger.log(`[${sessionId}] Session not found for abandonment check`);
    return {
      success: false,
      message: 'Session not found',
      sessionId: sessionId,
      emailSent: false
    };
  }
}

function sendLeadPartialNotification(data, parsedFormData) {
  const firstName = parsedFormData.contactInfo?.firstName || 'there';
  const email = parsedFormData.contactInfo?.email || '';
  const phone = parsedFormData.contactInfo?.phone || '';
  const branchOfService = parsedFormData.branchOfService || '';
  const coverageAmount = parsedFormData.coverageAmount || '';
  
  const subject = `New Lead Partial Application: ${firstName}`;
  
  const body = `
    <h2>New Lead Partial Application Received</h2>
    
    <h3>Contact Information:</h3>
    <p><strong>Name:</strong> ${parsedFormData.contactInfo?.firstName || ''} ${parsedFormData.contactInfo?.lastName || ''}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Date of Birth:</strong> ${parsedFormData.contactInfo?.dateOfBirth || ''}</p>
    
    <h3>Qualification Information:</h3>
    <p><strong>State:</strong> ${parsedFormData.state || ''}</p>
    <p><strong>Military Status:</strong> ${parsedFormData.militaryStatus || ''}</p>
    <p><strong>Branch of Service:</strong> ${branchOfService}</p>
    <p><strong>Marital Status:</strong> ${parsedFormData.maritalStatus || ''}</p>
    <p><strong>Coverage Amount:</strong> ${coverageAmount}</p>
    
    <h3>Medical Information:</h3>
    <p><strong>Tobacco Use:</strong> ${parsedFormData.medicalAnswers?.tobaccoUse || ''}</p>
    <p><strong>Medical Conditions:</strong> ${parsedFormData.medicalAnswers?.medicalConditions?.join(', ') || 'None'}</p>
    <p><strong>Height:</strong> ${parsedFormData.medicalAnswers?.height || ''}</p>
    <p><strong>Weight:</strong> ${parsedFormData.medicalAnswers?.weight || ''}</p>
    <p><strong>Hospital Care:</strong> ${parsedFormData.medicalAnswers?.hospitalCare || ''}</p>
    <p><strong>Diabetes Medication:</strong> ${parsedFormData.medicalAnswers?.diabetesMedication || ''}</p>
    
    <h3>Status:</h3>
    <p><strong>Status:</strong> Lead Partial Application</p>
    <p><strong>Step:</strong> ${data.currentStep || ''}</p>
    <p><strong>Step Name:</strong> ${data.stepName || ''}</p>
    
    <hr>
    <p><em>This lead partial application was submitted through the React Funnel at ${new Date().toLocaleString()}</em></p>
  `;
  
  // Send to admin email
  MailApp.sendEmail({
    to: CONFIG.EMAIL.ADMIN,
    subject: subject,
    htmlBody: body
  });
  
  // Send confirmation to lead
  if (email) {
    const confirmationSubject = 'Your pre-qualification information has been received';
    const confirmationBody = `
      <h2>Thank you, ${firstName}!</h2>
      
      <p>We've received your pre-qualification information and are currently processing your details.</p>
      
      <h3>What We're Reviewing:</h3>
      <ul>
        <li>Your ${branchOfService} service history</li>
        <li>Medical information and conditions</li>
        <li>Coverage amount preferences (${coverageAmount})</li>
        <li>State-specific requirements</li>
      </ul>
      
      <h3>Next Steps:</h3>
      <ul>
        <li>Our system is calculating your personalized options</li>
        <li>We'll review your ${branchOfService} benefits</li>
        <li>You'll receive your custom quote shortly</li>
        <li>A licensed agent will contact you within 24 hours</li>
      </ul>
      
      <p><strong>Need immediate assistance?</strong><br>
      Call us at ${CONFIG.COMPANY.PHONE}<br>
      Monday-Friday 8AM-6PM EST</p>
      
      <hr>
      <p><em>Veteran Life Insurance - Honoring Your Service</em></p>
    `;
    
    MailApp.sendEmail({
      to: email,
      subject: confirmationSubject,
      htmlBody: confirmationBody
    });
  }
}

// Test function to verify the script is working
function testScript() {
  const testData = {
    formType: 'Lead',
    state: 'CA',
    militaryStatus: 'Veteran',
    branchOfService: 'Army',
    maritalStatus: 'Married',
    coverageAmount: '$100,000',
    contactInfo: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '${CONFIG.COMPANY.PHONE}',
      dateOfBirth: '1980-01-01'
    },
    medicalAnswers: {
      tobaccoUse: 'No',
      medicalConditions: ['None'],
      height: "5'10\"",
      weight: '180',
      hospitalCare: 'No',
      diabetesMedication: 'No'
    }
  };
  
  const result = handleLeadSubmission(testData);
  Logger.log('Test result: ' + JSON.stringify(result));
}

// FIXED: Add a test function to verify the script
function testDoPost() {
  // Check if we have access to a spreadsheet first
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    Logger.log('ERROR: No active spreadsheet found. Please ensure this script is bound to a Google Sheet.');
    Logger.log('To fix this:');
    Logger.log('1. Open your Google Sheet (ID: 1nUnZ7NzZ9e3w4IlhP63f4jROleK5kMJYFeiJvyQhf9A)');
    Logger.log('2. Go to Extensions > Apps Script');
    Logger.log('3. Copy this script into the Apps Script editor');
    Logger.log('4. Save and deploy the script');
    return;
  }
  
  Logger.log('✅ Active spreadsheet found: ' + spreadsheet.getName());
  
  // Simulate a proper POST request
  const mockEvent = {
    postData: {
      contents: JSON.stringify({
        formType: 'Lead',
        state: 'CA',
        militaryStatus: 'Veteran',
        contactInfo: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com'
        }
      }),
      type: 'application/json'
    }
  };
  
  Logger.log('Testing doPost with mock data...');
  const result = doPost(mockEvent);
  Logger.log('Test result: ' + result.getContent());
}

// Test functions for email triggers
function testEmailTriggers() {
  Logger.log('=== TESTING EMAIL TRIGGERS ===');
  
  // Test 1: Create a session with phone captured
  const testSessionId = 'TEST_ABANDON_' + Utilities.getUuid();
  const testData = {
    formType: 'Partial',
    currentStep: 5,
    sessionId: testSessionId,
    formData: JSON.stringify({
      contactInfo: {
        firstName: 'John',
        lastName: 'Test',
        email: 'test@example.com',
        phone: '555-1234'
      },
      state: 'CA',
      militaryStatus: 'Veteran',
      branchOfService: 'Army',
      coverageAmount: '$100,000'
    })
  };
  
  // This should mark phone_captured but NOT send email
  Logger.log('Step 1: Processing partial submission (should NOT send email)');
  const partialResult = handlePartialSubmission(testData, testSessionId);
  Logger.log('Partial result:', partialResult);
  
  // This should send partial email
  Logger.log('Step 2: Processing abandonment (SHOULD send email)');
  const abandonResult = handleAbandonmentDetection(testSessionId);
  Logger.log('Abandon result:', abandonResult);
  
  // Test 3: Try to send again (should be blocked)
  Logger.log('Step 3: Try abandonment again (should be blocked)');
  const blockedResult = handleAbandonmentDetection(testSessionId);
  Logger.log('Blocked result:', blockedResult);
  
  Logger.log('=== EMAIL TRIGGER TESTS COMPLETE ===');
}

function testApplicationCompletion() {
  Logger.log('=== TESTING APPLICATION COMPLETION ===');
  
  const testSessionId = 'TEST_COMPLETE_' + Utilities.getUuid();
  const testData = {
    formType: 'Application',
    sessionId: testSessionId,
    currentStep: 18,
    stepName: 'FinalSuccessModal',
    formData: JSON.stringify({
      // ===== COMPLETE FUNNEL DATA =====
      contactInfo: {
        firstName: 'Jane',
        lastName: 'Complete',
        email: 'complete@example.com',
        phone: '555-5678',
        transactionalConsent: true,
        marketingConsent: true
      },
      
      // PRE-QUALIFICATION
      state: 'California',
      militaryStatus: 'Veteran',
      branchOfService: 'Army',
      maritalStatus: 'Married',
      coverageAmount: '$100,000',
      
      // PERSONAL
      dateOfBirth: '01/15/1985',
      
      // MEDICAL
      medicalAnswers: {
        tobaccoUse: 'No',
        medicalConditions: ['None'],
        height: "5'10\"",
        weight: '180',
        hospitalCare: 'No',
        diabetesMedication: 'No'
      },
      
      // APPLICATION
      applicationData: {
        address: {
          street: '123 Complete Street',
          city: 'Complete City',
          state: 'CA',
          zipCode: '90210'
        },
        beneficiary: {
          name: 'Complete Beneficiary',
          relationship: 'Spouse'
        },
        vaInfo: {
          vaNumber: 'VA123456789',
          serviceConnected: 'No'
        },
        ssn: '123-45-6789',
        banking: {
          bankName: 'Complete Bank',
          routingNumber: '123456789',
          accountNumber: '987654321'
        },
        policyDate: '02/01/2025',
        quoteData: {
          coverageAmount: 100000,
          monthlyPremium: 150,
          userAge: 39,
          userGender: 'Male',
          quoteType: 'IUL'
        }
      }
    })
  };
  
  Logger.log('Processing application completion (SHOULD send completion email)');
  const result = handleApplicationSubmission(testData, testSessionId);
  Logger.log('Completion result:', result);
  
  Logger.log('=== APPLICATION COMPLETION TEST COMPLETE ===');
}

function cleanupTestSessions() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getActiveSheet();
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  let deletedCount = 0;
  for (let i = values.length - 1; i >= 1; i--) {
    const sessionId = values[i][SHEET_COLUMNS.SESSION_ID - 1];
    if (sessionId && sessionId.startsWith('TEST_')) {
      sheet.deleteRow(i + 1);
      deletedCount++;
      Logger.log(`Deleted test session: ${sessionId}`);
    }
  }
  
  Logger.log(`Cleanup complete. Deleted ${deletedCount} test sessions.`);
}

// CRITICAL: Function to fix the sheet structure immediately
function fixSheetStructureNow() {
  Logger.log('=== FIXING SHEET STRUCTURE ===');
  
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    Logger.log('ERROR: No active spreadsheet found');
    return false;
  }
  
  const sheet = spreadsheet.getActiveSheet();
  
  // Check current structure
  const currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  Logger.log(`Current sheet has ${currentHeaders.length} columns`);
  Logger.log(`Current headers: ${currentHeaders.join(', ')}`);
  
  // Reset to unified structure
  resetSheetStructure();
  
  // Verify the fix
  const newHeaders = sheet.getRange(1, 1, 1, 50).getValues()[0];
  Logger.log(`New sheet has ${newHeaders.length} columns`);
  Logger.log(`New headers: ${newHeaders.join(', ')}`);
  
  if (newHeaders.length === 50) {
    Logger.log('✅ Sheet structure fixed successfully!');
    return true;
  } else {
    Logger.log('❌ Sheet structure fix failed!');
    return false;
  }
}

// COMPREHENSIVE QA/QC TESTING FUNCTIONS
function runCompleteQATest() {
  Logger.log('=== RUNNING COMPLETE QA/QC TEST ===');
  
  // Test 1: Sheet Structure
  const structureValid = validateSheetStructure();
  Logger.log(`Sheet Structure Valid: ${structureValid}`);
  
  // Test 2: Create Test Application
  const testAppData = {
    formType: 'Application',
    sessionId: 'QA_TEST_' + Utilities.getUuid(),
    currentStep: 18,
    stepName: 'FinalSuccessModal',
    formData: JSON.stringify({
      // ===== CONTACT INFO =====
      contactInfo: {
        firstName: 'QA',
        lastName: 'TestUser',
        email: 'qa.test@example.com',
        phone: '555-QA-TEST',
        transactionalConsent: true,
        marketingConsent: true
      },
      
      // ===== PRE-QUALIFICATION DATA =====
      state: 'California',
      militaryStatus: 'Veteran',
      branchOfService: 'Army',
      maritalStatus: 'Married',
      coverageAmount: '$100,000',
      
      // ===== PERSONAL INFO =====
      dateOfBirth: '01/15/1985',
      
      // ===== MEDICAL DATA =====
      medicalAnswers: {
        tobaccoUse: 'No',
        medicalConditions: ['None'],
        height: "5'10\"",
        weight: '180',
        hospitalCare: 'No',
        diabetesMedication: 'No'
      },
      
      // ===== APPLICATION DATA =====
      applicationData: {
        address: {
          street: '123 QA Test Street',
          city: 'Test City',
          state: 'CA',
          zipCode: '90210'
        },
        beneficiary: {
          name: 'Jane QATest',
          relationship: 'Spouse'
        },
        vaInfo: {
          vaNumber: 'VA123456789',
          serviceConnected: 'No'
        },
        driversLicense: 'CA123456789',
        ssn: '123-45-6789',
        banking: {
          bankName: 'QA Test Bank',
          routingNumber: '123456789',
          accountNumber: '987654321'
        },
        policyDate: '02/01/2025',
        quoteData: {
          coverageAmount: 100000,
          monthlyPremium: 150,
          userAge: 39,
          userGender: 'Male',
          quoteType: 'IUL'
        }
      }
    })
  };
  
  // Test 3: Submit Test Data
  const result = handleApplicationSubmission(testAppData, testAppData.sessionId);
  Logger.log(`Application Submission Result: ${JSON.stringify(result)}`);
  
  // Test 4: Verify Data in Sheet
  const verification = verifyTestDataInSheet(testAppData.sessionId);
  Logger.log(`Data Verification Result: ${JSON.stringify(verification)}`);
  
  // Test 5: Test Abandonment
  const abandonmentResult = testAbandonmentScenarios();
  Logger.log(`Abandonment Test Result: ${JSON.stringify(abandonmentResult)}`);
  
  Logger.log('=== QA/QC TEST COMPLETE ===');
}

function verifyTestDataInSheet(sessionId) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getActiveSheet();
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  // Find the test row
  let testRowIndex = -1;
  for (let i = 1; i < values.length; i++) {
    if (values[i][1] === sessionId) {
      testRowIndex = i;
      break;
    }
  }
  
  if (testRowIndex === -1) {
    return { success: false, message: 'Test row not found' };
  }
  
  const testRow = values[testRowIndex];
  const issues = [];
  
  // Verify all 50 columns have expected data
  if (testRow[4] !== 'QA') issues.push('First Name incorrect');
  if (testRow[5] !== 'TestUser') issues.push('Last Name incorrect');
  if (testRow[6] !== 'qa.test@example.com') issues.push('Email incorrect');
  if (testRow[22] !== '123 QA Test Street') issues.push('Street Address incorrect');
  if (testRow[30] !== '123-45-6789') issues.push('SSN incorrect (should be column 31)');
  if (testRow[31] !== 'QA Test Bank') issues.push('Bank Name incorrect (should be column 32)');
  if (testRow[34] !== '02/01/2025') issues.push('Policy Date incorrect (should be column 35)');
  
  // Note: VA Number and Service Connected (columns 29-30) should be empty based on current funnel
  
  return {
    success: issues.length === 0,
    issues: issues,
    totalColumns: testRow.length,
    message: issues.length === 0 ? 'All data verified correctly' : `${issues.length} issues found`
  };
}

function testAbandonmentScenarios() {
  Logger.log('=== TESTING LEAD SCENARIOS ===');
  
  const results = {
    testA: { success: false, message: 'Not implemented' },
    testB: { success: false, message: 'Not implemented' },
    testC: { success: false, message: 'Not implemented' },
    testD: { success: false, message: 'Not implemented' }
  };
  
  // Test A: No Contact Info (No Email)
  const testASessionId = 'NO_CONTACT_' + Utilities.getUuid();
  const testAData = {
    formType: 'Partial',
    sessionId: testASessionId,
    currentStep: 5,
    stepName: 'CoverageAmount',
    formData: JSON.stringify({
      // ===== PRE-QUALIFICATION DATA ONLY =====
      state: 'California',
      militaryStatus: 'Veteran',
      branchOfService: 'Army',
      maritalStatus: 'Married',
      coverageAmount: '$100,000'
      // No contact info - should NOT trigger email
    })
  };
  
  try {
    handlePartialSubmission(testAData, testASessionId);
    const abandonResult = handleAbandonmentDetection(testASessionId);
    results.testA = {
      success: !abandonResult.emailSent,
      message: abandonResult.emailSent ? 'Email sent when it should not have been' : 'Correctly did not send email'
    };
  } catch (error) {
    results.testA = { success: false, message: `Error: ${error.toString()}` };
  }
  
  // Test B: With Contact Info (Trigger Email)
  const testBSessionId = 'NEW_LEAD_' + Utilities.getUuid();
  const testBData = {
    formType: 'Partial',
    sessionId: testBSessionId,
    currentStep: 8,
    stepName: 'TobaccoUse',
    formData: JSON.stringify({
      // ===== CONTACT INFO (from steps 1-6) =====
      contactInfo: {
        firstName: 'Abandon',
        lastName: 'Test',
        email: 'abandon@example.com',
        phone: '555-ABANDON',
        transactionalConsent: true,
        marketingConsent: true
      },
      
      // ===== PRE-QUALIFICATION DATA (from steps 1-5) =====
      state: 'California',
      militaryStatus: 'Veteran',
      branchOfService: 'Army',
      maritalStatus: 'Married',
      coverageAmount: '$100,000',
      
      // ===== PERSONAL INFO (from step 7) =====
      dateOfBirth: '01/15/1985',
      
      // ===== MEDICAL DATA (from steps 8-12) =====
      medicalAnswers: {
        tobaccoUse: 'No',
        medicalConditions: ['None'],
        height: "5'10\"",
        weight: '180',
        hospitalCare: 'No',
        diabetesMedication: 'No'
      }
    })
  };
  
  try {
    handlePartialSubmission(testBData, testBSessionId);
    const leadResult = handleAbandonmentDetection(testBSessionId);
    results.testB = {
      success: leadResult.emailSent,
      message: leadResult.emailSent ? 'Correctly sent new lead email' : 'Failed to send new lead email'
    };
  } catch (error) {
    results.testB = { success: false, message: `Error: ${error.toString()}` };
  }
  
  Logger.log(`Lead Test Results: ${JSON.stringify(results)}`);
  return results;
}

function testAllEmailScenarios() {
  Logger.log('=== TESTING ALL EMAIL SCENARIOS ===');
  
  const results = {
    leadEmail: { success: false, message: 'Not tested' },
    applicationEmail: { success: false, message: 'Not tested' },
    partialEmail: { success: false, message: 'Not tested' },
    abandonmentEmail: { success: false, message: 'Not tested' }
  };
  
  // Test Lead Email
  const leadSessionId = 'EMAIL_LEAD_' + Utilities.getUuid();
  const leadData = {
    formType: 'Lead',
    sessionId: leadSessionId,
    formData: JSON.stringify({
      contactInfo: {
        firstName: 'Email',
        lastName: 'Test',
        email: 'email.test@example.com',
        phone: '555-EMAIL-TEST',
        transactionalConsent: true,
        marketingConsent: true
      },
      state: 'California',
      militaryStatus: 'Veteran',
      branchOfService: 'Army',
      maritalStatus: 'Married',
      coverageAmount: '$100,000',
      dateOfBirth: '01/15/1985',
      medicalAnswers: {
        tobaccoUse: 'No',
        medicalConditions: ['None'],
        height: "5'10\"",
        weight: '180',
        hospitalCare: 'No',
        diabetesMedication: 'No'
      }
    })
  };
  
  try {
    const leadResult = handleLeadSubmission(leadData, leadSessionId);
    results.leadEmail = {
      success: leadResult.success,
      message: leadResult.success ? 'Lead email sent successfully' : 'Lead email failed'
    };
  } catch (error) {
    results.leadEmail = { success: false, message: `Error: ${error.toString()}` };
  }
  
  // Test Application Email
  const appSessionId = 'EMAIL_APP_' + Utilities.getUuid();
  const appData = {
    formType: 'Application',
    sessionId: appSessionId,
    currentStep: 18,
    stepName: 'FinalSuccessModal',
    formData: JSON.stringify({
      // ===== CONTACT INFO (from steps 1-6) =====
      contactInfo: {
        firstName: 'App',
        lastName: 'Test',
        email: 'app.test@example.com',
        phone: '555-APP-TEST',
        transactionalConsent: true,
        marketingConsent: true
      },
      
      // ===== PRE-QUALIFICATION DATA (from steps 1-5) =====
      state: 'California',
      militaryStatus: 'Veteran',
      branchOfService: 'Army',
      maritalStatus: 'Married',
      coverageAmount: '$100,000',
      
      // ===== PERSONAL INFO (from step 7) =====
      dateOfBirth: '01/15/1985',
      
      // ===== MEDICAL DATA (from steps 8-12) =====
      medicalAnswers: {
        tobaccoUse: 'No',
        medicalConditions: ['None'],
        height: "5'10\"",
        weight: '180',
        hospitalCare: 'No',
        diabetesMedication: 'No'
      },
      
      // ===== APPLICATION DATA (from steps 16-17) =====
      applicationData: {
        address: {
          street: '123 App Test Street',
          city: 'App City',
          state: 'CA',
          zipCode: '90210'
        },
        beneficiary: {
          name: 'App Beneficiary',
          relationship: 'Spouse'
        },
        vaInfo: {
          vaNumber: 'VA123456789',
          serviceConnected: 'No'
        },
        ssn: '987-65-4321',
        banking: {
          bankName: 'App Test Bank',
          routingNumber: '987654321',
          accountNumber: '123456789'
        },
        policyDate: '03/01/2025',
        quoteData: {
          coverageAmount: 100000,
          monthlyPremium: 150,
          userAge: 39,
          userGender: 'Male',
          quoteType: 'IUL'
        }
      }
    })
  };
  
  try {
    const appResult = handleApplicationSubmission(appData, appSessionId);
    results.applicationEmail = {
      success: appResult.success,
      message: appResult.success ? 'Application email sent successfully' : 'Application email failed'
    };
  } catch (error) {
    results.applicationEmail = { success: false, message: `Error: ${error.toString()}` };
  }
  
  Logger.log(`Email Test Results: ${JSON.stringify(results)}`);
  return results;
}

function EMERGENCY_FIX_SHEET_NOW() {
  Logger.log('🚨 EMERGENCY SHEET FIX STARTING...');
  
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    Logger.log('❌ No spreadsheet found');
    return false;
  }
  
  const sheet = spreadsheet.getActiveSheet();
  
  // STEP 1: Clear everything
  sheet.clear();
  Logger.log('✅ Sheet cleared');
  
  // STEP 2: Setup correct structure
  const columnsCreated = setupUnifiedSheet(sheet);
  Logger.log(`✅ ${columnsCreated} columns created`);
  
  // STEP 3: Verify structure
  const verification = validateSheetStructure();
  Logger.log(`✅ Verification result: ${verification}`);
  
  Logger.log('🎉 EMERGENCY FIX COMPLETE!');
  return true;
} 