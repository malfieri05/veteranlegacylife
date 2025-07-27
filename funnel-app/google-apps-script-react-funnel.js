/**
 * Google Apps Script for React Funnel Data Capture
 * Captures all questions from both pre-qualification and application phases
 */

// Column reference map for unified sheet structure
const SHEET_COLUMNS = {
  // Core (1-4)
  TIMESTAMP: 1,
  SESSION_ID: 2,
  STATUS: 3,
  LAST_ACTIVITY: 4,
  
  // Contact (5-9)
  FIRST_NAME: 5,
  LAST_NAME: 6,
  EMAIL: 7,
  PHONE: 8,
  DOB: 9,
  
  // Pre-qualification (10-14)
  STATE: 10,
  MILITARY_STATUS: 11,
  BRANCH: 12,
  MARITAL_STATUS: 13,
  COVERAGE_AMOUNT: 14,
  
  // Medical (15-20)
  TOBACCO_USE: 15,
  MEDICAL_CONDITIONS: 16,
  HEIGHT: 17,
  WEIGHT: 18,
  HOSPITAL_CARE: 19,
  DIABETES_MEDICATION: 20,
  
  // Application (21-32)
  STREET_ADDRESS: 21,
  CITY: 22,
  APPLICATION_STATE: 23,
  ZIP_CODE: 24,
  BENEFICIARY_NAME: 25,
  BENEFICIARY_RELATIONSHIP: 26,
  VA_NUMBER: 27,
  SERVICE_CONNECTED: 28,
  SSN: 29,
  BANK_NAME: 30,
  ROUTING_NUMBER: 31,
  ACCOUNT_NUMBER: 32,
  
  // Quote (33-38)
  POLICY_DATE: 33,
  QUOTE_COVERAGE: 34,
  QUOTE_PREMIUM: 35,
  QUOTE_AGE: 36,
  QUOTE_GENDER: 37,
  QUOTE_TYPE: 38,
  
  // Tracking (39-46)
  CURRENT_STEP: 39,
  STEP_NAME: 40,
  FORM_TYPE: 41,
  USER_AGENT: 42,
  REFERRER: 43,
  UTM_SOURCE: 44,
  UTM_MEDIUM: 45,
  UTM_CAMPAIGN: 46,
  
  // Email Status (47-48)
  PARTIAL_EMAIL_SENT: 47,
  COMPLETED_EMAIL_SENT: 48
};

function doPost(e) {
  const timestamp = new Date();
  
  // Get session ID from request or generate one if not provided
  let sessionId = '';
  
  try {
    Logger.log(`[${sessionId}] =============== START REQUEST ===============`);
    Logger.log(`[${sessionId}] Timestamp: ${timestamp}`);
    
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
  
  // THEN update session status to completed
  updateSessionStatus(sessionId, 'completed');
  
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
  
  // Update session status based on step
  if (data.currentStep === 5 && parsedFormData.contactInfo?.phone) {
    // Phone number captured - mark session for potential abandonment email
    updateSessionStatus(sessionId, 'phone_captured', parsedFormData);
    Logger.log(`[${sessionId}] Phone number captured, session marked for abandonment tracking`);
  } else {
    // Update last activity
    updateSessionStatus(sessionId, 'active', parsedFormData);
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
    
    // Contact Information (Columns 5-9)
    'First Name',
    'Last Name', 
    'Email',
    'Phone',
    'Date of Birth',
    
    // Pre-Qualification Data (Columns 10-14)
    'State',
    'Military Status',
    'Branch of Service',
    'Marital Status', 
    'Coverage Amount',
    
    // Medical Information (Columns 15-20)
    'Tobacco Use',
    'Medical Conditions',
    'Height',
    'Weight',
    'Hospital Care',
    'Diabetes Medication',
    
    // Application Data (Columns 21-32)
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
    
    // Quote Information (Columns 33-38)
    'Policy Date',
    'Quote Coverage Amount',
    'Quote Monthly Premium',
    'Quote User Age',
    'Quote User Gender',
    'Quote Type',
    
    // Tracking Data (Columns 39-46)
    'Current Step',
    'Step Name',
    'Form Type',
    'User Agent',
    'Referrer',
    'UTM Source',
    'UTM Medium',
    'UTM Campaign',
    
    // Email Status (Columns 47-48)
    'Partial Email Sent',
    'Completed Email Sent'
  ];
  
  // TOTAL: 48 columns exactly
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.autoResizeColumns(1, headers.length);
  
  Logger.log(`Sheet setup complete with ${headers.length} columns`);
  return headers.length;
}

// Validation function to verify sheet structure
function validateSheetStructure() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getActiveSheet();
  
  // Check if headers exist
  const headerRange = sheet.getRange(1, 1, 1, 48);
  const headers = headerRange.getValues()[0];
  
  Logger.log(`Current sheet has ${headers.length} columns`);
  Logger.log(`Expected: 48 columns`);
  
  if (headers.length !== 48) {
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
  
  // Build exactly 48 values in correct order
  const rowData = new Array(48).fill(''); // Initialize all 48 columns
  
  // Core (1-4)
  rowData[SHEET_COLUMNS.TIMESTAMP - 1] = new Date();
  rowData[SHEET_COLUMNS.SESSION_ID - 1] = sessionId;
  rowData[SHEET_COLUMNS.STATUS - 1] = getStatusFromFormType(data.formType);
  rowData[SHEET_COLUMNS.LAST_ACTIVITY - 1] = new Date();
  
  // Contact (5-9)
  rowData[SHEET_COLUMNS.FIRST_NAME - 1] = parsedFormData.contactInfo?.firstName || '';
  rowData[SHEET_COLUMNS.LAST_NAME - 1] = parsedFormData.contactInfo?.lastName || '';
  rowData[SHEET_COLUMNS.EMAIL - 1] = parsedFormData.contactInfo?.email || '';
  rowData[SHEET_COLUMNS.PHONE - 1] = parsedFormData.contactInfo?.phone || '';
  rowData[SHEET_COLUMNS.DOB - 1] = parsedFormData.contactInfo?.dateOfBirth || '';
  
  // Pre-qualification (10-14)
  rowData[SHEET_COLUMNS.STATE - 1] = parsedFormData.state || data.state || '';
  rowData[SHEET_COLUMNS.MILITARY_STATUS - 1] = parsedFormData.militaryStatus || data.militaryStatus || '';
  rowData[SHEET_COLUMNS.BRANCH - 1] = parsedFormData.branchOfService || data.branchOfService || '';
  rowData[SHEET_COLUMNS.MARITAL_STATUS - 1] = parsedFormData.maritalStatus || data.maritalStatus || '';
  rowData[SHEET_COLUMNS.COVERAGE_AMOUNT - 1] = parsedFormData.coverageAmount || data.coverageAmount || '';
  
  // Medical (15-20)
  rowData[SHEET_COLUMNS.TOBACCO_USE - 1] = parsedFormData.medicalAnswers?.tobaccoUse || '';
  rowData[SHEET_COLUMNS.MEDICAL_CONDITIONS - 1] = Array.isArray(parsedFormData.medicalAnswers?.medicalConditions) 
    ? parsedFormData.medicalAnswers.medicalConditions.join(', ') : '';
  rowData[SHEET_COLUMNS.HEIGHT - 1] = parsedFormData.medicalAnswers?.height || '';
  rowData[SHEET_COLUMNS.WEIGHT - 1] = parsedFormData.medicalAnswers?.weight || '';
  rowData[SHEET_COLUMNS.HOSPITAL_CARE - 1] = parsedFormData.medicalAnswers?.hospitalCare || '';
  rowData[SHEET_COLUMNS.DIABETES_MEDICATION - 1] = parsedFormData.medicalAnswers?.diabetesMedication || '';
  
  // Application (21-32)
  rowData[SHEET_COLUMNS.STREET_ADDRESS - 1] = parsedFormData.applicationData?.address?.street || '';
  rowData[SHEET_COLUMNS.CITY - 1] = parsedFormData.applicationData?.address?.city || '';
  rowData[SHEET_COLUMNS.APPLICATION_STATE - 1] = parsedFormData.applicationData?.address?.state || '';
  rowData[SHEET_COLUMNS.ZIP_CODE - 1] = parsedFormData.applicationData?.address?.zipCode || '';
  rowData[SHEET_COLUMNS.BENEFICIARY_NAME - 1] = parsedFormData.applicationData?.beneficiary?.name || '';
  rowData[SHEET_COLUMNS.BENEFICIARY_RELATIONSHIP - 1] = parsedFormData.applicationData?.beneficiary?.relationship || '';
  rowData[SHEET_COLUMNS.VA_NUMBER - 1] = parsedFormData.applicationData?.vaInfo?.vaNumber || '';
  rowData[SHEET_COLUMNS.SERVICE_CONNECTED - 1] = parsedFormData.applicationData?.vaInfo?.serviceConnected || '';
  rowData[SHEET_COLUMNS.SSN - 1] = parsedFormData.applicationData?.ssn || '';
  rowData[SHEET_COLUMNS.BANK_NAME - 1] = parsedFormData.applicationData?.banking?.bankName || '';
  rowData[SHEET_COLUMNS.ROUTING_NUMBER - 1] = parsedFormData.applicationData?.banking?.routingNumber || '';
  rowData[SHEET_COLUMNS.ACCOUNT_NUMBER - 1] = parsedFormData.applicationData?.banking?.accountNumber || '';
  
  // Quote (33-38)
  rowData[SHEET_COLUMNS.POLICY_DATE - 1] = parsedFormData.applicationData?.policyDate || '';
  rowData[SHEET_COLUMNS.QUOTE_COVERAGE - 1] = parsedFormData.applicationData?.quoteData?.coverageAmount || '';
  rowData[SHEET_COLUMNS.QUOTE_PREMIUM - 1] = parsedFormData.applicationData?.quoteData?.monthlyPremium || '';
  rowData[SHEET_COLUMNS.QUOTE_AGE - 1] = parsedFormData.applicationData?.quoteData?.userAge || '';
  rowData[SHEET_COLUMNS.QUOTE_GENDER - 1] = parsedFormData.applicationData?.quoteData?.userGender || '';
  rowData[SHEET_COLUMNS.QUOTE_TYPE - 1] = parsedFormData.applicationData?.quoteData?.quoteType || '';
  
  // Tracking (39-46)
  rowData[SHEET_COLUMNS.CURRENT_STEP - 1] = data.currentStep || '';
  rowData[SHEET_COLUMNS.STEP_NAME - 1] = data.stepName || '';
  rowData[SHEET_COLUMNS.FORM_TYPE - 1] = data.formType || '';
  rowData[SHEET_COLUMNS.USER_AGENT - 1] = data.userAgent || '';
  rowData[SHEET_COLUMNS.REFERRER - 1] = data.referrer || '';
  rowData[SHEET_COLUMNS.UTM_SOURCE - 1] = data.utmSource || '';
  rowData[SHEET_COLUMNS.UTM_MEDIUM - 1] = data.utmMedium || '';
  rowData[SHEET_COLUMNS.UTM_CAMPAIGN - 1] = data.utmCampaign || '';
  
  // Email Status (47-48)
  rowData[SHEET_COLUMNS.PARTIAL_EMAIL_SENT - 1] = 'FALSE';
  rowData[SHEET_COLUMNS.COMPLETED_EMAIL_SENT - 1] = 'FALSE';
  
  return rowData;
}

function getStatusFromFormType(formType) {
  switch (formType) {
    case 'Lead': return 'Pre-Qualified';
    case 'Application': return 'Submitted';
    case 'Partial': return 'Active';
    case 'LeadPartial': return 'Active';
    default: return 'Unknown';
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
  
  const firstName = data.contactInfo?.firstName || 'there';
  const email = data.contactInfo?.email || '';
  const phone = data.contactInfo?.phone || '';
  const coverageAmount = data.coverageAmount || '';
  
  const subject = `Lead Abandonment Alert: ${firstName}`;
  
  const body = `
    <h2>Lead Abandonment Alert</h2>
    
    <h3>Contact Information:</h3>
    <p><strong>Name:</strong> ${data.contactInfo?.firstName || ''} ${data.contactInfo?.lastName || ''}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Date of Birth:</strong> ${data.contactInfo?.dateOfBirth || ''}</p>
    
    <h3>Qualification Information:</h3>
    <p><strong>State:</strong> ${data.state || ''}</p>
    <p><strong>Military Status:</strong> ${data.militaryStatus || ''}</p>
    <p><strong>Branch of Service:</strong> ${data.branchOfService || ''}</p>
    <p><strong>Marital Status:</strong> ${data.maritalStatus || ''}</p>
    <p><strong>Coverage Amount:</strong> ${coverageAmount}</p>
    
    <h3>Medical Information:</h3>
    <p><strong>Tobacco Use:</strong> ${data.medicalAnswers?.tobaccoUse || ''}</p>
    <p><strong>Medical Conditions:</strong> ${data.medicalAnswers?.medicalConditions?.join(', ') || 'None'}</p>
    <p><strong>Height:</strong> ${data.medicalAnswers?.height || ''}</p>
    <p><strong>Weight:</strong> ${data.medicalAnswers?.weight || ''}</p>
    <p><strong>Hospital Care:</strong> ${data.medicalAnswers?.hospitalCare || ''}</p>
    <p><strong>Diabetes Medication:</strong> ${data.medicalAnswers?.diabetesMedication || ''}</p>
    
    <h3>Status:</h3>
    <p><strong>Status:</strong> Lead Abandoned (Phone Captured)</p>
    <p><strong>Session ID:</strong> ${sessionId}</p>
    
    <hr>
    <p><em>This lead abandoned the funnel after providing phone number at ${new Date().toLocaleString()}</em></p>
  `;
  
  // Send to admin email
  const adminEmail = 'lindsey08092@gmail.com';
  MailApp.sendEmail({
    to: adminEmail,
    subject: subject,
    htmlBody: body
  });
  
  // Mark email as sent
  markEmailAsSent(sessionId, 'partial');
  
  Logger.log(`[${sessionId}] Partial lead email sent successfully`);
  return true;
}

function sendLeadNotification(data) {
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
  
  const subject = `New React Funnel Lead: ${firstName}`;
  
  const body = `
    <h2>New React Funnel Lead Received</h2>
    
    <h3>Contact Information:</h3>
    <p><strong>Name:</strong> ${parsedFormData.contactInfo?.firstName || ''} ${parsedFormData.contactInfo?.lastName || ''}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Date of Birth:</strong> ${parsedFormData.contactInfo?.dateOfBirth || ''}</p>
    
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
  const adminEmail = 'lindsey08092@gmail.com';
  MailApp.sendEmail({
    to: adminEmail,
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
      Call us at (555) 123-4567<br>
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
  // Check if completed email already sent
  if (checkSessionEmailStatus(sessionId, 'completed')) {
    Logger.log(`[${sessionId}] Completed email already sent, skipping`);
    return false;
  }
  
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
  const coverageAmount = parsedFormData.applicationData?.quoteData?.coverageAmount || '';
  const monthlyPremium = parsedFormData.applicationData?.quoteData?.monthlyPremium || '';
  
  const subject = `New React Funnel Application: ${firstName}`;
  
  const body = `
    <h2>New React Funnel Application Received</h2>
    
    <h3>Contact Information:</h3>
    <p><strong>Name:</strong> ${parsedFormData.contactInfo?.firstName || ''} ${parsedFormData.contactInfo?.lastName || ''}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${parsedFormData.contactInfo?.phone || ''}</p>
    <p><strong>Date of Birth:</strong> ${parsedFormData.contactInfo?.dateOfBirth || ''}</p>
    
    <h3>Address Information:</h3>
    <p><strong>Street:</strong> ${parsedFormData.applicationData?.address?.street || ''}</p>
    <p><strong>City:</strong> ${parsedFormData.applicationData?.address?.city || ''}</p>
    <p><strong>State:</strong> ${parsedFormData.applicationData?.address?.state || ''}</p>
    <p><strong>ZIP Code:</strong> ${parsedFormData.applicationData?.address?.zipCode || ''}</p>
    
    <h3>Beneficiary Information:</h3>
    <p><strong>Name:</strong> ${parsedFormData.applicationData?.beneficiary?.name || ''}</p>
    <p><strong>Relationship:</strong> ${parsedFormData.applicationData?.beneficiary?.relationship || ''}</p>
    
    <h3>VA Information:</h3>
    <p><strong>VA Number:</strong> ${parsedFormData.applicationData?.vaInfo?.vaNumber || 'Not provided'}</p>
    <p><strong>Service Connected Disability:</strong> ${parsedFormData.applicationData?.vaInfo?.serviceConnected || 'Not specified'}</p>
    
    <h3>Quote Information:</h3>
    <p><strong>Coverage Amount:</strong> $${coverageAmount.toLocaleString()}</p>
    <p><strong>Monthly Premium:</strong> $${monthlyPremium.toLocaleString()}</p>
    <p><strong>Age:</strong> ${parsedFormData.applicationData?.quoteData?.userAge || ''}</p>
    <p><strong>Gender:</strong> ${parsedFormData.applicationData?.quoteData?.userGender || ''}</p>
    <p><strong>Quote Type:</strong> ${parsedFormData.applicationData?.quoteData?.quoteType || ''}</p>
    
    <h3>Policy Information:</h3>
    <p><strong>Policy Date:</strong> ${parsedFormData.applicationData?.policyDate || ''}</p>
    <p><strong>Bank Name:</strong> ${parsedFormData.applicationData?.banking?.bankName || ''}</p>
    <p><strong>Routing Number:</strong> ${parsedFormData.applicationData?.banking?.routingNumber || ''}</p>
    <p><strong>Account Number:</strong> ${parsedFormData.applicationData?.banking?.accountNumber || ''}</p>
    
    <h3>Status:</h3>
    <p><strong>Status:</strong> Application Submitted</p>
    <p><strong>Session ID:</strong> ${sessionId}</p>
    
    <hr>
    <p><em>This application was submitted through the React Funnel at ${new Date().toLocaleString()}</em></p>
  `;
  
  // Send to admin email
  const adminEmail = 'lindsey08092@gmail.com';
  MailApp.sendEmail({
    to: adminEmail,
    subject: subject,
    htmlBody: body
  });
  
  // Send confirmation to applicant
  if (email) {
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
      Call us at (555) 123-4567<br>
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
      
      // Send partial email
      const emailSent = sendPartialLeadEmail(sessionData, sessionId);
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
  const adminEmail = 'lindsey08092@gmail.com';
  MailApp.sendEmail({
    to: adminEmail,
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
      Call us at (555) 123-4567<br>
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
      phone: '(555) 123-4567',
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
    formData: JSON.stringify({
      contactInfo: {
        firstName: 'Jane',
        lastName: 'Complete',
        email: 'complete@example.com',
        phone: '555-5678'
      },
      applicationData: {
        quoteData: {
          coverageAmount: 100000,
          monthlyPremium: 150
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
  const newHeaders = sheet.getRange(1, 1, 1, 48).getValues()[0];
  Logger.log(`New sheet has ${newHeaders.length} columns`);
  Logger.log(`New headers: ${newHeaders.join(', ')}`);
  
  if (newHeaders.length === 48) {
    Logger.log('✅ Sheet structure fixed successfully!');
    return true;
  } else {
    Logger.log('❌ Sheet structure fix failed!');
    return false;
  }
} 