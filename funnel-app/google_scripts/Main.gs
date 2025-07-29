/**
 * Google Apps Script for React Funnel Data Capture - MAIN SCRIPT
 * Captures all questions from both pre-qualification and application phases
 * Updated to support 51 columns with Drivers License field and proper step tracking
 * CONSOLIDATED VERSION - Includes Config and Core Functions
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

// Column reference map for unified sheet structure (51 columns)
const SHEET_COLUMNS = {
  // Core (1-4)
  TIMESTAMP: 1,
  SESSION_ID: 2,
  STATUS: 3,
  LAST_ACTIVITY: 4,
  
  // Contact (5-11)
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
  
  // Application (23-35)
  STREET_ADDRESS: 23,
  CITY: 24,
  APPLICATION_STATE: 25,
  ZIP_CODE: 26,
  BENEFICIARY_NAME: 27,
  BENEFICIARY_RELATIONSHIP: 28,
  VA_NUMBER: 29,
  SERVICE_CONNECTED: 30,
  SSN: 31,
  DRIVERS_LICENSE: 32, // NEW COLUMN
  BANK_NAME: 33,
  ROUTING_NUMBER: 34,
  ACCOUNT_NUMBER: 35,
  
  // Quote (36-41)
  POLICY_DATE: 36,
  QUOTE_COVERAGE: 37,
  QUOTE_PREMIUM: 38,
  QUOTE_AGE: 39,
  QUOTE_GENDER: 40,
  QUOTE_TYPE: 41,
  
  // Tracking (42-49)
  CURRENT_STEP: 42,
  STEP_NAME: 43,
  FORM_TYPE: 44,
  USER_AGENT: 45,
  REFERRER: 46,
  UTM_SOURCE: 47,
  UTM_MEDIUM: 48,
  UTM_CAMPAIGN: 49,
  
  // Email Status (50-51)
  PARTIAL_EMAIL_SENT: 50,
  COMPLETED_EMAIL_SENT: 51
};

// =============== MAIN ENTRY POINTS ===============

function doPost(e) {
  const timestamp = new Date();
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
    
    // Get session ID from request data or generate one if not provided
    sessionId = data.sessionId || Utilities.getUuid();
    Logger.log(`[${sessionId}] Using session ID: ${sessionId}`);
    
    const formType = data.formType;
    if (!formType) {
      throw new Error('Missing formType in request data');
    }
    
    Logger.log(`[${sessionId}] Processing ${formType} submission`);
    
    // TRANSFORM DATA INTO TEST FORMAT
    let transformedData;
    try {
      transformedData = transformDataToTestFormat(data);
      Logger.log(`[${sessionId}] RAW DATA: ${JSON.stringify(data)}`);
      Logger.log(`[${sessionId}] TRANSFORMED DATA: ${JSON.stringify(transformedData)}`);
    } catch (transformError) {
      Logger.log(`[${sessionId}] ERROR in transformDataToTestFormat: ${transformError.toString()}`);
      throw new Error(`Data transformation failed: ${transformError.toString()}`);
    }
    
    let response = {};
    
    if (formType === 'Lead') {
      response = handleLeadSubmission(transformedData, sessionId);
    } else if (formType === 'Application') {
      response = handleApplicationSubmission(transformedData, sessionId);
    } else if (formType === 'Partial') {
      response = handlePartialSubmission(transformedData, sessionId);
    } else if (formType === 'LeadPartial') {
      response = handleLeadPartialSubmission(transformedData, sessionId);
    } else if (formType === 'Abandonment') {
      response = handleAbandonmentDetection(sessionId);
    } else {
      throw new Error('Invalid form type: ' + formType);
    }
    
    Logger.log(`[${sessionId}] Success response: ${JSON.stringify(response)}`);
    Logger.log(`[${sessionId}] =============== END REQUEST ===============`);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log(`[${sessionId}] =============== ERROR ===============`);
    Logger.log(`[${sessionId}] Error: ${error.toString()}`);
    Logger.log(`[${sessionId}] Stack trace: ${error.stack}`);
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
        timestamp: timestamp
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function transformDataToTestFormat(data) {
  // Transform data into the exact same structure as the test
  // Handle both nested structure (new) and flat structure (old) for backward compatibility
  const transformedData = {
    formType: data.formType,
    currentStep: data.currentStep,
    stepName: data.stepName,
    
    // Contact Info - handle both nested and flat data
    contactInfo: {
      firstName: data.contactInfo?.firstName || data.firstName || data.first_name || '',
      lastName: data.contactInfo?.lastName || data.lastName || data.last_name || '',
      email: data.contactInfo?.email || data.email || '',
      phone: data.contactInfo?.phone || data.phone || '',
      dateOfBirth: data.contactInfo?.dateOfBirth || data.dateOfBirth || data.dob || '',
      transactionalConsent: normalizeBoolean(data.contactInfo?.transactionalConsent || data.transactionalConsent || data.transactional_consent),
      marketingConsent: normalizeBoolean(data.contactInfo?.marketingConsent || data.marketingConsent || data.marketing_consent)
    },
    
    // Pre-qualification - handle both nested and flat data
    preQualification: {
      state: data.preQualification?.state || data.state || '',
      militaryStatus: data.preQualification?.militaryStatus || data.militaryStatus || data.military_status || '',
      branchOfService: data.preQualification?.branchOfService || data.branchOfService || data.branch || '',
      maritalStatus: data.preQualification?.maritalStatus || data.maritalStatus || data.marital_status || '',
      coverageAmount: data.preQualification?.coverageAmount || data.coverageAmount || data.coverage || ''
    },
    
    // Medical Answers - handle both nested and flat data
    medicalAnswers: {
      tobaccoUse: data.medicalAnswers?.tobaccoUse || data.tobaccoUse || data.tobacco_use || '',
      medicalConditions: data.medicalAnswers?.medicalConditions || data.medicalConditions || data.medical_conditions || '',
      height: data.medicalAnswers?.height || data.height || '',
      weight: data.medicalAnswers?.weight || data.weight || '',
      hospitalCare: data.medicalAnswers?.hospitalCare || data.hospitalCare || data.hospital_care || '',
      diabetesMedication: data.medicalAnswers?.diabetesMedication || data.diabetesMedication || data.diabetes_medication || ''
    },
    
    // Application Data - handle both nested and flat data
    applicationData: {
      streetAddress: data.applicationData?.streetAddress || data.streetAddress || '',
      city: data.applicationData?.city || data.city || '',
      state: data.applicationData?.state || data.applicationState || data.state || '',
      zipCode: data.applicationData?.zipCode || data.zipCode || '',
      beneficiaryName: data.applicationData?.beneficiaryName || data.beneficiaryName || '',
      beneficiaryRelationship: data.applicationData?.beneficiaryRelationship || data.beneficiaryRelationship || '',
      vaNumber: data.applicationData?.vaNumber || data.vaNumber || '',
      serviceConnected: data.applicationData?.serviceConnected || data.serviceConnected || '',
      driversLicense: data.applicationData?.driversLicense || data.driversLicense || '',
      ssn: data.applicationData?.ssn || data.ssn || '',
      bankName: data.applicationData?.bankName || data.bankName || '',
      routingNumber: data.applicationData?.routingNumber || data.routingNumber || '',
      accountNumber: data.applicationData?.accountNumber || data.accountNumber || ''
    },
    
    // Quote Data - handle both nested and flat data
    quoteData: {
      policyDate: data.quoteData?.policyDate || data.policyDate || data.policy_date || '',
      coverage: data.quoteData?.coverage || data.coverageAmount || data.coverage || '',
      premium: data.quoteData?.premium || data.monthlyPremium || data.premium || '',
      age: data.quoteData?.age || data.userAge || data.age || '',
      gender: data.quoteData?.gender || data.userGender || data.gender || '',
      type: data.quoteData?.type || data.quoteType || data.type || ''
    },
    
    // Tracking Data - handle both nested and flat data
    trackingData: {
      currentStep: data.trackingData?.currentStep || data.currentStep || 'UnknownStep',
      stepName: data.trackingData?.stepName || data.stepName || 'Unknown Step Name'
    }
  };
  
  // Debug logging for quote data transformation
  Logger.log(`Quote Data Transformation Debug:`);
  Logger.log(`  Original data.quoteData: ${JSON.stringify(data.quoteData)}`);
  Logger.log(`  Transformed quoteData: ${JSON.stringify(transformedData.quoteData)}`);
  
  // Log the flattened applicationData for debugging
  Logger.log(`Flattened applicationData: ${JSON.stringify(transformedData.applicationData)}`);
  
  return transformedData;
}

function normalizeBoolean(value) {
  if (value === true || value === 'true' || value === 'TRUE' || value === 1 || value === '1') {
    return true;
  }
  if (value === false || value === 'false' || value === 'FALSE' || value === 0 || value === '0') {
    return false;
  }
  return false; // Default to false for any other value
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'OK',
      message: 'Google Apps Script is running',
      timestamp: new Date()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// =============== SUBMISSION HANDLERS ===============

function handleLeadSubmission(data, sessionId) {
  Logger.log(`[${sessionId}] Processing NEW LEAD submission`);
  
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Ensure sheet structure is correct
    validateSheetStructure();
    
    // Build unified row data
    const rowData = buildUnifiedRowData(data, sessionId);
    
    // Add timestamp and session info using correct column mapping
    rowData[SHEET_COLUMNS.TIMESTAMP - 1] = new Date();
    rowData[SHEET_COLUMNS.SESSION_ID - 1] = sessionId;
    rowData[SHEET_COLUMNS.STATUS - 1] = 'Lead';
    rowData[SHEET_COLUMNS.LAST_ACTIVITY - 1] = new Date();
    
    // Ensure step tracking is never empty using correct column mapping
    rowData[SHEET_COLUMNS.CURRENT_STEP - 1] = data.currentStep || 'ContactInfo';
    rowData[SHEET_COLUMNS.STEP_NAME - 1] = data.stepName || 'Contact Information';
    
    // Append to sheet
    sheet.appendRow(rowData);
    
    // Send NEW LEAD notifications (admin + customer)
    sendLeadNotification(data);
    
    Logger.log(`[${sessionId}] NEW LEAD submission completed successfully`);
    
    return {
      success: true,
      sessionId: sessionId,
      message: 'Lead submitted successfully'
    };
    
  } catch (error) {
    Logger.log(`[${sessionId}] Error in handleLeadSubmission: ${error.toString()}`);
    throw error;
  }
}

function handleApplicationSubmission(data, sessionId) {
  Logger.log(`[${sessionId}] Processing COMPLETE APPLICATION submission`);
  
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Ensure sheet structure is correct
    validateSheetStructure();
    
    // Build unified row data
    const rowData = buildUnifiedRowData(data, sessionId);
    
    // Add timestamp and session info using correct column mapping
    rowData[SHEET_COLUMNS.TIMESTAMP - 1] = new Date();
    rowData[SHEET_COLUMNS.SESSION_ID - 1] = sessionId;
    rowData[SHEET_COLUMNS.STATUS - 1] = 'Application';
    rowData[SHEET_COLUMNS.LAST_ACTIVITY - 1] = new Date();
    
    // Ensure step tracking is never empty using correct column mapping
    rowData[SHEET_COLUMNS.CURRENT_STEP - 1] = data.currentStep || 'FinalSuccess';
    rowData[SHEET_COLUMNS.STEP_NAME - 1] = data.stepName || 'Application Complete';
    
    // Append to sheet using getRange instead of appendRow
    Logger.log(`About to append row with ${rowData.length} elements`);
    Logger.log(`Row data for quote columns (35-40): ${rowData[35]}, ${rowData[36]}, ${rowData[37]}, ${rowData[38]}, ${rowData[39]}, ${rowData[40]}`);
    
    // Get the next empty row
    const lastRow = sheet.getLastRow();
    const targetRow = lastRow + 1;
    Logger.log(`Writing to row ${targetRow}`);
    
    // Write the entire row at once
    sheet.getRange(targetRow, 1, 1, rowData.length).setValues([rowData]);
    Logger.log(`Row written successfully using getRange`);
    
    // Send COMPLETE APPLICATION notifications (admin + customer)
    sendApplicationNotification(data, sessionId);
    
    Logger.log(`[${sessionId}] COMPLETE APPLICATION submission completed successfully`);
    
    return {
      success: true,
      sessionId: sessionId,
      message: 'Application submitted successfully'
    };
    
  } catch (error) {
    Logger.log(`[${sessionId}] Error in handleApplicationSubmission: ${error.toString()}`);
    throw error;
  }
}

function handlePartialSubmission(data, sessionId) {
  Logger.log(`[${sessionId}] Processing PARTIAL LEAD submission`);
  
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Ensure sheet structure is correct
    validateSheetStructure();
    
    // Build unified row data
    const rowData = buildUnifiedRowData(data, sessionId);
    
    // Add timestamp and session info using correct column mapping
    rowData[SHEET_COLUMNS.TIMESTAMP - 1] = new Date();
    rowData[SHEET_COLUMNS.SESSION_ID - 1] = sessionId;
    rowData[SHEET_COLUMNS.STATUS - 1] = 'Partial';
    rowData[SHEET_COLUMNS.LAST_ACTIVITY - 1] = new Date();
    
    // Ensure step tracking is never empty using correct column mapping
    rowData[SHEET_COLUMNS.CURRENT_STEP - 1] = data.currentStep || 'Partial';
    rowData[SHEET_COLUMNS.STEP_NAME - 1] = data.stepName || 'Partial Submission';
    
    // Append to sheet
    sheet.appendRow(rowData);
    
    // Send PARTIAL LEAD notifications (admin alert + customer recovery)
    if (!checkSessionEmailStatus(sessionId, 'partial')) {
      sendPartialLeadEmail(data, sessionId);
      markEmailAsSent(sessionId, 'partial');
    }
    
    Logger.log(`[${sessionId}] PARTIAL LEAD submission completed successfully`);
    
    return {
      success: true,
      sessionId: sessionId,
      message: 'Partial submission recorded'
    };
    
  } catch (error) {
    Logger.log(`[${sessionId}] Error in handlePartialSubmission: ${error.toString()}`);
    throw error;
  }
}

function handleLeadPartialSubmission(data, sessionId) {
  Logger.log(`[${sessionId}] Processing lead partial submission`);
  
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Ensure sheet structure is correct
    validateSheetStructure();
    
    // Build unified row data
    const rowData = buildUnifiedRowData(data, sessionId);
    
    // Add timestamp and session info using correct column mapping
    rowData[SHEET_COLUMNS.TIMESTAMP - 1] = new Date();
    rowData[SHEET_COLUMNS.SESSION_ID - 1] = sessionId;
    rowData[SHEET_COLUMNS.STATUS - 1] = 'LeadPartial';
    rowData[SHEET_COLUMNS.LAST_ACTIVITY - 1] = new Date();
    
    // Ensure step tracking is never empty using correct column mapping
    rowData[SHEET_COLUMNS.CURRENT_STEP - 1] = data.currentStep || 'LeadPartial';
    rowData[SHEET_COLUMNS.STEP_NAME - 1] = data.stepName || 'Lead Partial Submission';
    
    // Append to sheet
    sheet.appendRow(rowData);
    
    // No email notifications for lead partial - just track the data
    Logger.log(`[${sessionId}] Lead partial submission completed successfully`);
    
    return {
      success: true,
      sessionId: sessionId,
      message: 'Lead partial submission recorded'
    };
    
  } catch (error) {
    Logger.log(`[${sessionId}] Error in handleLeadPartialSubmission: ${error.toString()}`);
    throw error;
  }
}

function handleAbandonmentDetection(sessionId) {
  Logger.log(`[${sessionId}] Processing abandonment detection`);
  
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Find existing session row
    const sessionRow = findSessionRow(sessionId, sheet);
    
    if (sessionRow) {
      // Update existing session status
      updateSessionStatus(sessionId, 'Abandoned', {});
    } else {
      // Create new abandonment record
      const rowData = new Array(51).fill('');
      rowData[0] = new Date(); // TIMESTAMP
      rowData[1] = sessionId; // SESSION_ID
      rowData[2] = 'Abandoned'; // STATUS
      rowData[3] = new Date(); // LAST_ACTIVITY
      rowData[41] = 'Abandoned'; // CURRENT_STEP
      rowData[42] = 'Session Abandoned'; // STEP_NAME
      
      sheet.appendRow(rowData);
    }
    
    Logger.log(`[${sessionId}] Abandonment detection completed`);
    
    return {
      success: true,
      sessionId: sessionId,
      message: 'Abandonment recorded'
    };
    
  } catch (error) {
    Logger.log(`[${sessionId}] Error in handleAbandonmentDetection: ${error.toString()}`);
    throw error;
  }
}

// =============== SHEET MANAGEMENT ===============

function validateSheetStructure() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const headers = sheet.getRange(1, 1, 1, 51).getValues()[0];
  
  // Check if we have the correct number of columns
  if (headers.length !== 51) {
    Logger.log('Sheet structure validation failed: Expected 51 columns, found ' + headers.length);
    setupUnifiedSheet(sheet);
    return false;
  }
  
  // Check for required headers
  const requiredHeaders = [
    'Timestamp', 'Session ID', 'Status', 'Last Activity',
    'First Name', 'Last Name', 'Email', 'Phone', 'Date of Birth',
    'Transactional Consent', 'Marketing Consent', 'State', 'Military Status',
    'Branch of Service', 'Marital Status', 'Coverage Amount', 'Tobacco Use',
    'Medical Conditions', 'Height', 'Weight', 'Hospital Care', 'Diabetes Medication',
    'Street Address', 'City', 'Application State', 'Zip Code', 'Beneficiary Name',
    'Beneficiary Relationship', 'VA Number', 'Service Connected', 'SSN',
    'Drivers License', 'Bank Name', 'Routing Number', 'Account Number',
    'Policy Date', 'Quote Coverage', 'Quote Premium', 'Quote Age', 'Quote Gender',
    'Quote Type', 'Current Step', 'Step Name', 'Form Type', 'User Agent',
    'Referrer', 'UTM Source', 'UTM Medium', 'UTM Campaign', 'Partial Email Sent',
    'Completed Email Sent'
  ];
  
  for (let i = 0; i < requiredHeaders.length; i++) {
    if (headers[i] !== requiredHeaders[i]) {
      Logger.log(`Header mismatch at column ${i + 1}: Expected "${requiredHeaders[i]}", found "${headers[i]}"`);
      setupUnifiedSheet(sheet);
      return false;
    }
  }
  
  Logger.log('Sheet structure validation passed');
  return true;
}

function setupUnifiedSheet(sheet) {
  Logger.log('Setting up unified sheet structure');
  
  // Validate sheet parameter
  if (!sheet) {
    Logger.log('Error: No sheet provided to setupUnifiedSheet');
    return false;
  }
  
  try {
    // Clear existing content
    sheet.clear();
  
  // Define headers for 51 columns
  const headers = [
    'Timestamp', 'Session ID', 'Status', 'Last Activity',
    'First Name', 'Last Name', 'Email', 'Phone', 'Date of Birth',
    'Transactional Consent', 'Marketing Consent', 'State', 'Military Status',
    'Branch of Service', 'Marital Status', 'Coverage Amount', 'Tobacco Use',
    'Medical Conditions', 'Height', 'Weight', 'Hospital Care', 'Diabetes Medication',
    'Street Address', 'City', 'Application State', 'Zip Code', 'Beneficiary Name',
    'Beneficiary Relationship', 'VA Number', 'Service Connected', 'SSN',
    'Drivers License', 'Bank Name', 'Routing Number', 'Account Number',
    'Policy Date', 'Quote Coverage', 'Quote Premium', 'Quote Age', 'Quote Gender',
    'Quote Type', 'Current Step', 'Step Name', 'Form Type', 'User Agent',
    'Referrer', 'UTM Source', 'UTM Medium', 'UTM Campaign', 'Partial Email Sent',
    'Completed Email Sent'
  ];
  
  // Set headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Debug: Log the actual number of columns in the sheet
  Logger.log(`Sheet has ${sheet.getLastColumn()} columns`);
  Logger.log(`Headers array has ${headers.length} elements`);
  Logger.log(`Expected 51 columns, actual: ${sheet.getLastColumn()}`);
  
  // Force the sheet to have exactly 51 columns
  if (sheet.getLastColumn() < 51) {
    Logger.log(`Expanding sheet to 51 columns`);
    sheet.getRange(1, sheet.getLastColumn() + 1, 1, 51 - sheet.getLastColumn()).setValues([new Array(51 - sheet.getLastColumn()).fill('')]);
  }
  
  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#f3f4f6');
  headerRange.setBorder(true, true, true, true, true, true);
  
    // Freeze header row
    sheet.setFrozenRows(1);
    
    Logger.log('Unified sheet structure setup completed');
    return true;
  } catch (error) {
    Logger.log('Error setting up unified sheet structure:', error.toString());
    return false;
  }
}

function buildUnifiedRowData(data, sessionId) {
  // Initialize array with 51 empty strings
  const rowData = new Array(51).fill('');
  
  // Debug array size
  Logger.log(`Array size: ${rowData.length}`);
  Logger.log(`Array indices 35-40 (quote data): ${rowData[35]}, ${rowData[36]}, ${rowData[37]}, ${rowData[38]}, ${rowData[39]}, ${rowData[40]}`);
  
  try {
    // Validate input data
    if (!data) {
      Logger.log('Warning: No data provided to buildUnifiedRowData, using empty defaults');
      data = {};
    }
    
    // Parse form data with safe defaults - EXACTLY like the test
    const parsedFormData = {
      contactInfo: data.contactInfo || {},
      preQualification: data.preQualification || {},
      medicalAnswers: data.medicalAnswers || {},
      applicationData: data.applicationData || {},
      quoteData: data.quoteData || {},
      trackingData: data.trackingData || {}
    };
    
    // Debug what data we're receiving
    Logger.log(`buildUnifiedRowData Debug:`);
    Logger.log(`  Received data keys: ${Object.keys(data)}`);
    Logger.log(`  data.quoteData: ${JSON.stringify(data.quoteData)}`);
    Logger.log(`  parsedFormData.quoteData: ${JSON.stringify(parsedFormData.quoteData)}`);
    
    // Contact Information (columns 5-11, array indices 4-10) - EXACTLY like test
    rowData[SHEET_COLUMNS.FIRST_NAME - 1] = parsedFormData.contactInfo?.firstName || '';
    rowData[SHEET_COLUMNS.LAST_NAME - 1] = parsedFormData.contactInfo?.lastName || '';
    rowData[SHEET_COLUMNS.EMAIL - 1] = parsedFormData.contactInfo?.email || '';
    rowData[SHEET_COLUMNS.PHONE - 1] = parsedFormData.contactInfo?.phone || '';
    rowData[SHEET_COLUMNS.DOB - 1] = parsedFormData.contactInfo?.dateOfBirth || '';
    rowData[SHEET_COLUMNS.TRANSACTIONAL_CONSENT - 1] = parsedFormData.contactInfo?.transactionalConsent || '';
    rowData[SHEET_COLUMNS.MARKETING_CONSENT - 1] = parsedFormData.contactInfo?.marketingConsent || '';
    
    // Pre-qualification (columns 12-16, array indices 11-15) - EXACTLY like test
    rowData[SHEET_COLUMNS.STATE - 1] = parsedFormData.preQualification?.state || '';
    rowData[SHEET_COLUMNS.MILITARY_STATUS - 1] = parsedFormData.preQualification?.militaryStatus || '';
    rowData[SHEET_COLUMNS.BRANCH - 1] = parsedFormData.preQualification?.branchOfService || '';
    rowData[SHEET_COLUMNS.MARITAL_STATUS - 1] = parsedFormData.preQualification?.maritalStatus || '';
    rowData[SHEET_COLUMNS.COVERAGE_AMOUNT - 1] = parsedFormData.preQualification?.coverageAmount || '';
    
    // Medical (columns 17-22, array indices 16-21) - EXACTLY like test
    rowData[SHEET_COLUMNS.TOBACCO_USE - 1] = parsedFormData.medicalAnswers?.tobaccoUse || '';
    rowData[SHEET_COLUMNS.MEDICAL_CONDITIONS - 1] = parsedFormData.medicalAnswers?.medicalConditions || '';
    rowData[SHEET_COLUMNS.HEIGHT - 1] = parsedFormData.medicalAnswers?.height || '';
    rowData[SHEET_COLUMNS.WEIGHT - 1] = parsedFormData.medicalAnswers?.weight || '';
    rowData[SHEET_COLUMNS.HOSPITAL_CARE - 1] = parsedFormData.medicalAnswers?.hospitalCare || '';
    rowData[SHEET_COLUMNS.DIABETES_MEDICATION - 1] = parsedFormData.medicalAnswers?.diabetesMedication || '';
    
    // Application (columns 23-35, array indices 22-34) - EXACTLY like test
    rowData[SHEET_COLUMNS.STREET_ADDRESS - 1] = parsedFormData.applicationData?.streetAddress || '';
    rowData[SHEET_COLUMNS.CITY - 1] = parsedFormData.applicationData?.city || '';
    rowData[SHEET_COLUMNS.APPLICATION_STATE - 1] = parsedFormData.applicationData?.state || '';
    rowData[SHEET_COLUMNS.ZIP_CODE - 1] = parsedFormData.applicationData?.zipCode || '';
    rowData[SHEET_COLUMNS.BENEFICIARY_NAME - 1] = parsedFormData.applicationData?.beneficiaryName || '';
    rowData[SHEET_COLUMNS.BENEFICIARY_RELATIONSHIP - 1] = parsedFormData.applicationData?.beneficiaryRelationship || '';
    rowData[SHEET_COLUMNS.VA_NUMBER - 1] = parsedFormData.applicationData?.vaNumber || '';
    rowData[SHEET_COLUMNS.SERVICE_CONNECTED - 1] = parsedFormData.applicationData?.serviceConnected || '';
    rowData[SHEET_COLUMNS.SSN - 1] = parsedFormData.applicationData?.ssn || '';
    rowData[SHEET_COLUMNS.DRIVERS_LICENSE - 1] = parsedFormData.applicationData?.driversLicense || '';
    rowData[SHEET_COLUMNS.BANK_NAME - 1] = parsedFormData.applicationData?.bankName || '';
    rowData[SHEET_COLUMNS.ROUTING_NUMBER - 1] = parsedFormData.applicationData?.routingNumber || '';
    rowData[SHEET_COLUMNS.ACCOUNT_NUMBER - 1] = parsedFormData.applicationData?.accountNumber || '';
    
    // Quote (columns 36-41, array indices 35-40) - EXACTLY like test
    const policyDateValue = parsedFormData.quoteData?.policyDate || '';
    const coverageValue = parsedFormData.quoteData?.coverage || '';
    const premiumValue = parsedFormData.quoteData?.premium || '';
    const ageValue = parsedFormData.quoteData?.age || '';
    const genderValue = parsedFormData.quoteData?.gender || '';
    const typeValue = parsedFormData.quoteData?.type || '';
    
    // HARDCODE TEST VALUES for EVERY SINGLE COLUMN to find the cutoff
    for (let i = 0; i < 51; i++) {
      rowData[i] = `COL_${i + 1}`;
    }
    
    // Debug after assignment
    Logger.log(`After assignment - Array indices 35-40: ${rowData[35]}, ${rowData[36]}, ${rowData[37]}, ${rowData[38]}, ${rowData[39]}, ${rowData[40]}`);
    
    // Debug the actual values being assigned
    Logger.log(`Quote Data Assignment Debug:`);
    Logger.log(`  Policy Date (col ${SHEET_COLUMNS.POLICY_DATE}): "${policyDateValue}"`);
    Logger.log(`  Coverage (col ${SHEET_COLUMNS.QUOTE_COVERAGE}): "${coverageValue}"`);
    Logger.log(`  Premium (col ${SHEET_COLUMNS.QUOTE_PREMIUM}): "${premiumValue}"`);
    Logger.log(`  Age (col ${SHEET_COLUMNS.QUOTE_AGE}): "${ageValue}"`);
    Logger.log(`  Gender (col ${SHEET_COLUMNS.QUOTE_GENDER}): "${genderValue}"`);
    Logger.log(`  Type (col ${SHEET_COLUMNS.QUOTE_TYPE}): "${typeValue}"`);
    
    // Tracking (columns 42-49, array indices 41-48) - EXACTLY like test
    rowData[SHEET_COLUMNS.CURRENT_STEP - 1] = parsedFormData.trackingData?.currentStep || data.currentStep || '';
    rowData[SHEET_COLUMNS.STEP_NAME - 1] = parsedFormData.trackingData?.stepName || data.stepName || '';
    rowData[SHEET_COLUMNS.FORM_TYPE - 1] = data.formType || '';
    rowData[SHEET_COLUMNS.USER_AGENT - 1] = parsedFormData.trackingData?.userAgent || data.userAgent || '';
    rowData[SHEET_COLUMNS.REFERRER - 1] = parsedFormData.trackingData?.referrer || data.referrer || '';
    rowData[SHEET_COLUMNS.UTM_SOURCE - 1] = parsedFormData.trackingData?.utmSource || data.utmSource || '';
    rowData[SHEET_COLUMNS.UTM_MEDIUM - 1] = parsedFormData.trackingData?.utmMedium || data.utmMedium || '';
    rowData[SHEET_COLUMNS.UTM_CAMPAIGN - 1] = parsedFormData.trackingData?.utmCampaign || data.utmCampaign || '';
    
    // Email Status (columns 50-51, array indices 49-50)
    rowData[SHEET_COLUMNS.PARTIAL_EMAIL_SENT - 1] = 'No';
    rowData[SHEET_COLUMNS.COMPLETED_EMAIL_SENT - 1] = 'No';
    
  } catch (error) {
    Logger.log(`Error building unified row data: ${error.toString()}`);
    // Return empty row data instead of throwing error
    return new Array(51).fill('');
  }
  
  return rowData;
}

// =============== HELPER FUNCTIONS ===============

function getStatusFromFormType(formType) {
  switch (formType) {
    case 'Lead': return 'Lead';
    case 'Application': return 'Application';
    case 'Partial': return 'Partial';
    case 'LeadPartial': return 'LeadPartial';
    case 'Abandonment': return 'Abandoned';
    default: return 'Unknown';
  }
}

function findSessionRow(sessionId, sheet) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === sessionId) { // Session ID is in column 2
      return i + 1; // Return 1-based row number
    }
  }
  return null;
}

function updateSessionStatus(sessionId, status, data = {}) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const row = findSessionRow(sessionId, sheet);
  
  if (row) {
    // Update status (column 3)
    sheet.getRange(row, 3).setValue(status);
    // Update last activity (column 4)
    sheet.getRange(row, 4).setValue(new Date());
    
    Logger.log(`[${sessionId}] Session status updated to: ${status}`);
  } else {
    Logger.log(`[${sessionId}] Session not found for status update`);
  }
}

function checkSessionEmailStatus(sessionId, emailType) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const row = findSessionRow(sessionId, sheet);
  
  if (row) {
    const data = sheet.getDataRange().getValues();
    const rowData = data[row - 1]; // Convert to 0-based index
    
    if (emailType === 'partial') {
      return rowData[49] === 'Yes'; // Partial Email Sent column
    } else if (emailType === 'completed') {
      return rowData[50] === 'Yes'; // Completed Email Sent column
    }
  }
  
  return false;
}

function markEmailAsSent(sessionId, emailType) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const row = findSessionRow(sessionId, sheet);
  
  if (row) {
    if (emailType === 'partial') {
      sheet.getRange(row, 50).setValue('Yes'); // Partial Email Sent column
    } else if (emailType === 'completed') {
      sheet.getRange(row, 51).setValue('Yes'); // Completed Email Sent column
    }
    
    Logger.log(`[${sessionId}] Email marked as sent: ${emailType}`);
  }
}

// =============== TESTING FUNCTIONS ===============

function testNewEntriesAndEmails() {
  Logger.log('=== TESTING NEW ENTRIES AND EMAILS ===');
  
  try {
    // Test 1: NEW LEAD Entry
    Logger.log('Test 1: Creating NEW LEAD entry...');
    const leadSessionId = 'TEST_LEAD_' + Utilities.getUuid();
    const leadData = {
      formType: 'Lead',
      currentStep: 'ContactInfo',
      stepName: 'Contact Information',
      contactInfo: {
        firstName: 'John',
        lastName: 'TestLead',
        email: 'john.testlead@example.com',
        phone: '555-123-4567',
        dateOfBirth: '1985-03-15',
        transactionalConsent: true,
        marketingConsent: true
      },
      preQualification: {
        state: 'CA',
        militaryStatus: 'Veteran',
        branchOfService: 'Army',
        maritalStatus: 'Married',
        coverageAmount: '$250,000'
      },
      medicalAnswers: {
        tobaccoUse: 'No',
        medicalConditions: 'None',
        height: "5'10\"",
        weight: '180',
        hospitalCare: 'No',
        diabetesMedication: 'No'
      }
    };
    
    const leadResult = handleLeadSubmission(leadData, leadSessionId);
    Logger.log('NEW LEAD test result:', leadResult);
    
    // Test 2: COMPLETE APPLICATION Entry
    Logger.log('Test 2: Creating COMPLETE APPLICATION entry...');
    const appSessionId = 'TEST_APP_' + Utilities.getUuid();
    const appData = {
      formType: 'Application',
      currentStep: 'FinalSuccess',
      stepName: 'Application Complete',
      contactInfo: {
        firstName: 'Jane',
        lastName: 'TestApp',
        email: 'jane.testapp@example.com',
        phone: '555-987-6543',
        dateOfBirth: '1988-07-22',
        transactionalConsent: true,
        marketingConsent: true
      },
      preQualification: {
        state: 'TX',
        militaryStatus: 'Veteran',
        branchOfService: 'Navy',
        maritalStatus: 'Single',
        coverageAmount: '$500,000'
      },
      medicalAnswers: {
        tobaccoUse: 'No',
        medicalConditions: 'None',
        height: "5'6\"",
        weight: '140',
        hospitalCare: 'No',
        diabetesMedication: 'No'
      },
      applicationData: {
        streetAddress: '123 Test Street',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001',
        beneficiaryName: 'John TestApp',
        beneficiaryRelationship: 'Spouse',
        vaNumber: '123456789',
        serviceConnected: 'No',
        ssn: '123-45-6789',
        driversLicense: 'TX1234567',
        bankName: 'Test Bank',
        routingNumber: '123456789',
        accountNumber: '987654321'
      },
      quoteData: {
        policyDate: '2024-01-15',
        coverage: '$500,000',
        premium: '$75.50',
        age: '35',
        gender: 'Female',
        type: 'Term Life'
      }
    };
    
    const appResult = handleApplicationSubmission(appData, appSessionId);
    Logger.log('COMPLETE APPLICATION test result:', appResult);
    
    // Test 3: PARTIAL LEAD Entry
    Logger.log('Test 3: Creating PARTIAL LEAD entry...');
    const partialSessionId = 'TEST_PARTIAL_' + Utilities.getUuid();
    const partialData = {
      formType: 'Partial',
      currentStep: 'ContactInfo',
      stepName: 'Contact Information',
      contactInfo: {
        firstName: 'Bob',
        lastName: 'TestPartial',
        email: 'bob.testpartial@example.com',
        phone: '555-555-5555',
        dateOfBirth: '1990-12-10',
        transactionalConsent: true,
        marketingConsent: false
      },
      preQualification: {
        state: 'FL',
        militaryStatus: 'Veteran',
        branchOfService: 'Air Force',
        maritalStatus: 'Divorced',
        coverageAmount: '$100,000'
      }
    };
    
    const partialResult = handlePartialSubmission(partialData, partialSessionId);
    Logger.log('PARTIAL LEAD test result:', partialResult);
    
    Logger.log('=== ALL TESTS COMPLETED SUCCESSFULLY ===');
    Logger.log('Check your email for notifications and the Google Sheet for new entries.');
    
    return {
      success: true,
      message: 'All test entries and emails completed successfully',
      leadSessionId: leadSessionId,
      appSessionId: appSessionId,
      partialSessionId: partialSessionId
    };
    
  } catch (error) {
    Logger.log('=== TEST FAILED ===');
    Logger.log('Error:', error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
} 