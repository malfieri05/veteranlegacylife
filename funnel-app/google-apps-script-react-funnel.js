/**
 * Google Apps Script for React Funnel Data Capture
 * Captures all questions from both pre-qualification and application phases
 */

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
  
  const timestamp = new Date();
  const rowData = [
    timestamp, // Timestamp
    sessionId, // Session ID (use the one from request)
    data.state || parsedFormData.state || '',
    data.militaryStatus || parsedFormData.militaryStatus || '',
    data.branchOfService || parsedFormData.branchOfService || '',
    data.maritalStatus || parsedFormData.maritalStatus || '',
    data.coverageAmount || parsedFormData.coverageAmount || '',
    parsedFormData.contactInfo?.firstName || '',
    parsedFormData.contactInfo?.lastName || '',
    parsedFormData.contactInfo?.email || '',
    parsedFormData.contactInfo?.phone || '',
    parsedFormData.contactInfo?.dateOfBirth || '',
    parsedFormData.medicalAnswers?.tobaccoUse || '',
    Array.isArray(parsedFormData.medicalAnswers?.medicalConditions) ? parsedFormData.medicalAnswers.medicalConditions.join(', ') : '',
    parsedFormData.medicalAnswers?.height || '',
    parsedFormData.medicalAnswers?.weight || '',
    parsedFormData.medicalAnswers?.hospitalCare || '',
    parsedFormData.medicalAnswers?.diabetesMedication || '',
    // Application Data (Phase 2) - ALL FIELDS
    parsedFormData.applicationData?.address?.street || '',
    parsedFormData.applicationData?.address?.city || '',
    parsedFormData.applicationData?.address?.state || '',
    parsedFormData.applicationData?.address?.zipCode || '',
    parsedFormData.applicationData?.beneficiary?.name || '',
    parsedFormData.applicationData?.beneficiary?.relationship || '',
    parsedFormData.applicationData?.vaInfo?.vaNumber || '',
    parsedFormData.applicationData?.vaInfo?.serviceConnected || '',
    parsedFormData.applicationData?.ssn || '',
    parsedFormData.applicationData?.banking?.bankName || '',
    parsedFormData.applicationData?.banking?.routingNumber || '',
    parsedFormData.applicationData?.banking?.accountNumber || '',
    parsedFormData.applicationData?.policyDate || '',
    parsedFormData.applicationData?.quoteData?.coverageAmount || '',
    parsedFormData.applicationData?.quoteData?.monthlyPremium || '',
    parsedFormData.applicationData?.quoteData?.userAge || '',
    parsedFormData.applicationData?.quoteData?.userGender || '',
    parsedFormData.applicationData?.quoteData?.quoteType || '',
    'Pre-Qualified', // Status
    data.userAgent || '',
    data.referrer || '',
    data.utmSource || '',
    data.utmMedium || '',
    data.utmCampaign || ''
  ];
  
  // Check if session already exists in the sheet
  let existingRowIndex = -1;
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  // Session ID is in column B (index 1)
  for (let i = 1; i < values.length; i++) {
    if (values[i][1] === sessionId) {
      existingRowIndex = i + 1; // +1 because sheet rows are 1-indexed
      break;
    }
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
  
  const timestamp = new Date();
  const rowData = [
    timestamp, // Timestamp
    sessionId, // Session ID (use the one from request)
    parsedFormData.contactInfo?.firstName || '',
    parsedFormData.contactInfo?.lastName || '',
    parsedFormData.contactInfo?.email || '',
    parsedFormData.contactInfo?.phone || '',
    parsedFormData.contactInfo?.dateOfBirth || '',
    parsedFormData.applicationData?.address?.street || '',
    parsedFormData.applicationData?.address?.city || '',
    parsedFormData.applicationData?.address?.state || '',
    parsedFormData.applicationData?.address?.zipCode || '',
    parsedFormData.applicationData?.beneficiary?.name || '',
    parsedFormData.applicationData?.beneficiary?.relationship || '',
    parsedFormData.applicationData?.vaInfo?.vaNumber || '',
    parsedFormData.applicationData?.vaInfo?.serviceConnected || '',
    parsedFormData.applicationData?.driversLicense || '',
    parsedFormData.applicationData?.ssn || '',
    parsedFormData.applicationData?.banking?.bankName || '',
    parsedFormData.applicationData?.banking?.routingNumber || '',
    parsedFormData.applicationData?.banking?.accountNumber || '',
    parsedFormData.applicationData?.policyDate || '',
    parsedFormData.applicationData?.quoteData?.coverageAmount || '',
    parsedFormData.applicationData?.quoteData?.monthlyPremium || '',
    parsedFormData.applicationData?.quoteData?.userAge || '',
    parsedFormData.applicationData?.quoteData?.userGender || '',
    parsedFormData.applicationData?.quoteData?.quoteType || '',
    'Submitted', // Status
    data.userAgent || '',
    data.referrer || '',
    data.utmSource || '',
    data.utmMedium || '',
    data.utmCampaign || ''
  ];
  
  Logger.log(`[${sessionId}] Appending application data to sheet`);
  sheet.appendRow(rowData);
  
  // Send email notification
  sendApplicationNotification(data);
  
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
  
  // Prepare the row data with ALL funnel information (complete structure)
  const rowData = [
    new Date(), // Timestamp
    sessionId, // Session ID for tracking (use the one from request)
    // Phase 1 - Pre-Qualification Data
    parsedFormData.state || '',
    parsedFormData.militaryStatus || '',
    parsedFormData.branchOfService || '',
    parsedFormData.maritalStatus || '',
    parsedFormData.coverageAmount || '',
    parsedFormData.contactInfo?.firstName || '',
    parsedFormData.contactInfo?.lastName || '',
    parsedFormData.contactInfo?.email || '',
    parsedFormData.contactInfo?.phone || '',
    parsedFormData.contactInfo?.dateOfBirth || '',
    parsedFormData.medicalAnswers?.tobaccoUse || '',
    Array.isArray(parsedFormData.medicalAnswers?.medicalConditions) ? parsedFormData.medicalAnswers.medicalConditions.join(', ') : '',
    parsedFormData.medicalAnswers?.height || '',
    parsedFormData.medicalAnswers?.weight || '',
    parsedFormData.medicalAnswers?.hospitalCare || '',
    parsedFormData.medicalAnswers?.diabetesMedication || '',
    // Phase 2 - Application Data (ALL FIELDS)
    parsedFormData.applicationData?.address?.street || '',
    parsedFormData.applicationData?.address?.city || '',
    parsedFormData.applicationData?.address?.state || '',
    parsedFormData.applicationData?.address?.zipCode || '',
    parsedFormData.applicationData?.beneficiary?.name || '',
    parsedFormData.applicationData?.beneficiary?.relationship || '',
    parsedFormData.applicationData?.vaInfo?.vaNumber || '',
    parsedFormData.applicationData?.vaInfo?.serviceConnected || '',
    parsedFormData.applicationData?.driversLicense || '',
    parsedFormData.applicationData?.ssn || '',
    parsedFormData.applicationData?.banking?.bankName || '',
    parsedFormData.applicationData?.banking?.routingNumber || '',
    parsedFormData.applicationData?.banking?.accountNumber || '',
    parsedFormData.applicationData?.policyDate || '',
    parsedFormData.applicationData?.quoteData?.coverageAmount || '',
    parsedFormData.applicationData?.quoteData?.monthlyPremium || '',
    parsedFormData.applicationData?.quoteData?.userAge || '',
    parsedFormData.applicationData?.quoteData?.userGender || '',
    parsedFormData.applicationData?.quoteData?.quoteType || '',
    // Tracking Data
    data.currentStep || '', // Current step
    data.stepName || '', // Step name
    data.formType || 'Partial', // Form type
    data.userAgent || '',
    data.referrer || '',
    data.utmSource || '',
    data.utmMedium || '',
    data.utmCampaign || ''
  ];
  
  // Check if session already exists in the sheet
  let existingRowIndex = -1;
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  // Session ID is in column B (index 1)
  for (let i = 1; i < values.length; i++) {
    if (values[i][1] === sessionId) {
      existingRowIndex = i + 1; // +1 because sheet rows are 1-indexed
      break;
    }
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
  
  // Prepare the row data with ALL funnel information (complete structure)
  const rowData = [
    new Date(), // Timestamp
    sessionId, // Session ID for tracking (use the one from request)
    // Phase 1 - Pre-Qualification Data
    parsedFormData.state || '',
    parsedFormData.militaryStatus || '',
    parsedFormData.branchOfService || '',
    parsedFormData.maritalStatus || '',
    parsedFormData.coverageAmount || '',
    parsedFormData.contactInfo?.firstName || '',
    parsedFormData.contactInfo?.lastName || '',
    parsedFormData.contactInfo?.email || '',
    parsedFormData.contactInfo?.phone || '',
    parsedFormData.contactInfo?.dateOfBirth || '',
    parsedFormData.medicalAnswers?.tobaccoUse || '',
    Array.isArray(parsedFormData.medicalAnswers?.medicalConditions) ? parsedFormData.medicalAnswers.medicalConditions.join(', ') : '',
    parsedFormData.medicalAnswers?.height || '',
    parsedFormData.medicalAnswers?.weight || '',
    parsedFormData.medicalAnswers?.hospitalCare || '',
    parsedFormData.medicalAnswers?.diabetesMedication || '',
    // Phase 2 - Application Data (ALL FIELDS)
    parsedFormData.applicationData?.address?.street || '',
    parsedFormData.applicationData?.address?.city || '',
    parsedFormData.applicationData?.address?.state || '',
    parsedFormData.applicationData?.address?.zipCode || '',
    parsedFormData.applicationData?.beneficiary?.name || '',
    parsedFormData.applicationData?.beneficiary?.relationship || '',
    parsedFormData.applicationData?.vaInfo?.vaNumber || '',
    parsedFormData.applicationData?.vaInfo?.serviceConnected || '',
    parsedFormData.applicationData?.driversLicense || '',
    parsedFormData.applicationData?.ssn || '',
    parsedFormData.applicationData?.banking?.bankName || '',
    parsedFormData.applicationData?.banking?.routingNumber || '',
    parsedFormData.applicationData?.banking?.accountNumber || '',
    parsedFormData.applicationData?.policyDate || '',
    parsedFormData.applicationData?.quoteData?.coverageAmount || '',
    parsedFormData.applicationData?.quoteData?.monthlyPremium || '',
    parsedFormData.applicationData?.quoteData?.userAge || '',
    parsedFormData.applicationData?.quoteData?.userGender || '',
    parsedFormData.applicationData?.quoteData?.quoteType || '',
    // Tracking Data
    data.currentStep || '', // Current step
    data.stepName || '', // Step name
    data.formType || 'LeadPartial', // Form type
    data.userAgent || '',
    data.referrer || '',
    data.utmSource || '',
    data.utmMedium || '',
    data.utmCampaign || ''
  ];
  
  // Check if session already exists in the sheet
  let existingRowIndex = -1;
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  // Session ID is in column B (index 1)
  for (let i = 1; i < values.length; i++) {
    if (values[i][1] === sessionId) {
      existingRowIndex = i + 1; // +1 because sheet rows are 1-indexed
      break;
    }
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
  
  // Send lead partial notification email
  sendLeadPartialNotification(data, parsedFormData);
  
  Logger.log(`[${sessionId}] Lead partial submission completed successfully`);
  
  return {
    success: true,
    message: 'Lead partial data captured successfully',
    sessionId: sessionId,
    step: data.currentStep
  };
}

function setupPartialSheet(sheet) {
  const headers = [
    'Timestamp',
    'Session ID',
    // Phase 1 - Pre-Qualification Data
    'State',
    'Military Status',
    'Branch of Service',
    'Marital Status',
    'Coverage Amount',
    'First Name',
    'Last Name',
    'Email',
    'Phone',
    'Date of Birth',
    'Tobacco Use',
    'Medical Conditions',
    'Height',
    'Weight',
    'Hospital Care',
    'Diabetes Medication',
    // Phase 2 - Application Data (ALL FIELDS)
    'Street Address',
    'City',
    'State (Application)',
    'ZIP Code',
    'Beneficiary Name',
    'Beneficiary Relationship',
    'VA Number',
    'Service Connected Disability',
    'SSN',
    'Bank Name',
    'Routing Number',
    'Account Number',
    'Policy Date',
    'Quote Coverage Amount',
    'Quote Monthly Premium',
    'Quote User Age',
    'Quote User Gender',
    'Quote Type',
    // Tracking Data
    'Current Step',
    'Step Name',
    'Form Type',
    'User Agent',
    'Referrer',
    'UTM Source',
    'UTM Medium',
    'UTM Campaign'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.autoResizeColumns(1, headers.length);
}

function setupLeadSheet(sheet) {
  const headers = [
    'Timestamp',
    'Session ID',
    // Phase 1 - Pre-Qualification Data
    'State',
    'Military Status',
    'Branch of Service',
    'Marital Status',
    'Coverage Amount',
    'First Name',
    'Last Name',
    'Email',
    'Phone',
    'Date of Birth',
    'Tobacco Use',
    'Medical Conditions',
    'Height',
    'Weight',
    'Hospital Care',
    'Diabetes Medication',
    // Phase 2 - Application Data (ALL FIELDS)
    'Street Address',
    'City',
    'State (Application)',
    'ZIP Code',
    'Beneficiary Name',
    'Beneficiary Relationship',
    'VA Number',
    'Service Connected Disability',
    'SSN',
    'Bank Name',
    'Routing Number',
    'Account Number',
    'Policy Date',
    'Quote Coverage Amount',
    'Quote Monthly Premium',
    'Quote User Age',
    'Quote User Gender',
    'Quote Type',
    'Status',
    'User Agent',
    'Referrer',
    'UTM Source',
    'UTM Medium',
    'UTM Campaign'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.autoResizeColumns(1, headers.length);
}

function setupApplicationSheet(sheet) {
  const headers = [
    'Timestamp',
    'Session ID',
    'First Name',
    'Last Name',
    'Email',
    'Phone',
    'Date of Birth',
    'Street Address',
    'City',
    'State',
    'ZIP Code',
    'Beneficiary Name',
    'Beneficiary Relationship',
    'VA Number',
    'Service Connected Disability',
    'SSN',
    'Bank Name',
    'Routing Number',
    'Account Number',
    'Policy Date',
    'Coverage Amount',
    'Monthly Premium',
    'Age',
    'Gender',
    'Quote Type',
    'Status',
    'User Agent',
    'Referrer',
    'UTM Source',
    'UTM Medium',
    'UTM Campaign'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.autoResizeColumns(1, headers.length);
}

function sendLeadNotification(data) {
  const firstName = data.contactInfo?.firstName || 'there';
  const email = data.contactInfo?.email || '';
  const phone = data.contactInfo?.phone || '';
  const coverageAmount = data.coverageAmount || '';
  
  const subject = `New React Funnel Lead: ${firstName}`;
  
  const body = `
    <h2>New React Funnel Lead Received</h2>
    
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

function sendApplicationNotification(data) {
  const firstName = data.contactInfo?.firstName || 'there';
  const email = data.contactInfo?.email || '';
  const coverageAmount = data.applicationData?.quoteData?.coverageAmount || '';
  const monthlyPremium = data.applicationData?.quoteData?.monthlyPremium || '';
  
  const subject = `New React Funnel Application: ${firstName}`;
  
  const body = `
    <h2>New React Funnel Application Received</h2>
    
    <h3>Contact Information:</h3>
    <p><strong>Name:</strong> ${data.contactInfo?.firstName || ''} ${data.contactInfo?.lastName || ''}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${data.contactInfo?.phone || ''}</p>
    <p><strong>Date of Birth:</strong> ${data.contactInfo?.dateOfBirth || ''}</p>
    
    <h3>Address Information:</h3>
    <p><strong>Street:</strong> ${data.applicationData?.address?.street || ''}</p>
    <p><strong>City:</strong> ${data.applicationData?.address?.city || ''}</p>
    <p><strong>State:</strong> ${data.applicationData?.address?.state || ''}</p>
    <p><strong>ZIP Code:</strong> ${data.applicationData?.address?.zipCode || ''}</p>
    
    <h3>Beneficiary Information:</h3>
    <p><strong>Name:</strong> ${data.applicationData?.beneficiary?.name || ''}</p>
    <p><strong>Relationship:</strong> ${data.applicationData?.beneficiary?.relationship || ''}</p>
    
    <h3>VA Information:</h3>
    <p><strong>VA Number:</strong> ${data.applicationData?.vaInfo?.vaNumber || 'Not provided'}</p>
    <p><strong>Service Connected Disability:</strong> ${data.applicationData?.vaInfo?.serviceConnected || 'Not specified'}</p>
    
    <h3>Quote Information:</h3>
    <p><strong>Coverage Amount:</strong> $${coverageAmount.toLocaleString()}</p>
    <p><strong>Monthly Premium:</strong> $${monthlyPremium.toLocaleString()}</p>
    <p><strong>Age:</strong> ${data.applicationData?.quoteData?.userAge || ''}</p>
    <p><strong>Gender:</strong> ${data.applicationData?.quoteData?.userGender || ''}</p>
    <p><strong>Quote Type:</strong> ${data.applicationData?.quoteData?.quoteType || ''}</p>
    
    <h3>Policy Information:</h3>
    <p><strong>Policy Date:</strong> ${data.applicationData?.policyDate || ''}</p>
    <p><strong>Bank Name:</strong> ${data.applicationData?.banking?.bankName || ''}</p>
    <p><strong>Routing Number:</strong> ${data.applicationData?.banking?.routingNumber || ''}</p>
    <p><strong>Account Number:</strong> ${data.applicationData?.banking?.accountNumber || ''}</p>
    
    <h3>Status:</h3>
    <p><strong>Status:</strong> Application Submitted</p>
    
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