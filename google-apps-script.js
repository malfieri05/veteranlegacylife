// Google Apps Script for Veteran Legacy Life - Leads
// Deploy this as a web app to handle form submissions

function doPost(e) {
  try {
    
    // Parse the incoming form data
    const formData = e.postData.contents;
    const data = {};
    
    // Parse URL-encoded form data manually (URLSearchParams not available in GAS)
    const params = formData.split('&');
    for (let i = 0; i < params.length; i++) {
      const pair = params[i].split('=');
      if (pair.length === 2) {
        const key = decodeURIComponent(pair[0]);
        const value = decodeURIComponent(pair[1]);
        data[key] = value;
      }
    }
    
    // Get the active spreadsheet
    const spreadsheetId = '1MvmvfqRBnt8fjplbRgFIi7BTnzcAGaMNeIDwCHGPis8';
    const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();
    
    // Prepare the row data with all funnel information (flattened structure)
    const rowData = [
      new Date(), // Timestamp
      data.sessionId || '', // Session ID for tracking
      data.firstName || '',
      data.lastName || '',
      data.phone || '',
      data.email || '',
      data.dateOfBirth || '',
      data.state || '',
      data.militaryStatus || '',
      data.branchOfService || '',
      data.maritalStatus || '',
      data.coverageAmount || '',
      data.tobaccoUse || '',
      data.medicalConditions || '', // Already a string from frontend
      data.height || '',
      data.weight || '',
      data.hospitalCare || '',
      data.diabetesMedication || '',
      data.transactionalConsent || false,
      data.marketingConsent || false,
      data.funnelProgress || 'Complete',
      data.formType || 'Unknown' // Track if partial or complete
    ];
    
    // Check if session already exists in the sheet
    const sessionId = data.sessionId;
    let existingRowIndex = -1;
    
    if (sessionId) {
      // Find existing row with this session ID
      const dataRange = sheet.getDataRange();
      const values = dataRange.getValues();
      
      // Session ID is in column B (index 1)
      for (let i = 1; i < values.length; i++) {
        if (values[i][1] === sessionId) {
          existingRowIndex = i + 1; // +1 because sheet rows are 1-indexed
          break;
        }
      }
    }
    
    if (existingRowIndex > 0) {
      // Update existing row
      console.log('Updating existing session row:', existingRowIndex);
      const range = sheet.getRange(existingRowIndex, 1, 1, rowData.length);
      range.setValues([rowData]);
    } else {
      // Append new row
      console.log('Creating new session row');
      sheet.appendRow(rowData);
    }
    
    // Send email notifications based on form type
    const emailAddress = 'michaelalfieri.ffl@gmail.com';
    
    if (data.formType === 'SessionStart') {
        // Email: "New user started funnel"
        const subject = '🚀 New User Started Funnel - Veteran Legacy Life';
        const message = `
          New user started the funnel:
          
          Session ID: ${data.sessionId || 'N/A'}
          Timestamp: ${data.timestamp || new Date().toISOString()}
          
          View all leads in the Google Sheet: https://docs.google.com/spreadsheets/d/1MvmvfqRBnt8fjplbRgFIi7BTnzcAGaMNeIDwCHGPis8/edit
        `;
        
        MailApp.sendEmail(emailAddress, subject, message);
        
    } else if (data.formType === 'Abandoned') {
        // Email: "User abandoned funnel"
        const subject = '⚠️ User Abandoned Funnel - Veteran Legacy Life';
        const message = `
          User abandoned the funnel:
          
          Session ID: ${data.sessionId || 'N/A'}
          Reason: ${data.abandonmentReason || 'Unknown'}
          Progress: ${data.funnelProgress || 'Unknown'}
          
          Data collected:
          - State: ${data.state || 'None'}
          - Military Status: ${data.militaryStatus || 'None'}
          - Branch: ${data.branchOfService || 'None'}
          - Marital Status: ${data.maritalStatus || 'None'}
          - Coverage: ${data.coverageAmount || 'None'}
          - Contact Info: ${data.firstName ? 'Yes' : 'No'}
          
          View all leads in the Google Sheet: https://docs.google.com/spreadsheets/d/1MvmvfqRBnt8fjplbRgFIi7BTnzcAGaMNeIDwCHGPis8/edit
        `;
        
        MailApp.sendEmail(emailAddress, subject, message);
        
    } else if (data.formType === 'Funnel') {
        // Email: "User completed funnel" (existing logic)
        const subject = '✅ New Lead Completed - Veteran Legacy Life';
        const message = `
          New lead completed the funnel:
          
          Session ID: ${data.sessionId || 'N/A'}
          Name: ${data.firstName || ''} ${data.lastName || ''}
          Phone: ${data.phone || ''}
          Email: ${data.email || ''}
          Date of Birth: ${data.dateOfBirth || ''}
          State: ${data.state || ''}
          Military Status: ${data.militaryStatus || ''}
          Branch of Service: ${data.branchOfService || ''}
          Marital Status: ${data.maritalStatus || ''}
          Coverage Amount: ${data.coverageAmount || ''}
          Tobacco Use: ${data.tobaccoUse || ''}
          Medical Conditions: ${data.medicalConditions || ''}
          Height: ${data.height || ''}
          Weight: ${data.weight || ''}
          Hospital Care: ${data.hospitalCare || ''}
          Diabetes Medication: ${data.diabetesMedication || ''}
          
          View all leads in the Google Sheet: https://docs.google.com/spreadsheets/d/1MvmvfqRBnt8fjplbRgFIi7BTnzcAGaMNeIDwCHGPis8/edit
        `;
        
        MailApp.sendEmail(emailAddress, subject, message);
    }
    
    // Return success response with CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response with CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('Veteran Legacy Life - Form Handler is running')
    .setMimeType(ContentService.MimeType.TEXT);
}

// Test function to verify sheet access
function testSheetAccess() {
  try {
    console.log('Starting sheet access test...');
    
    const spreadsheetId = '1MvmvfqRBnt8fjplbRgFIi7BTnzcAGaMNeIDwCHGPis8';
    console.log('Attempting to open spreadsheet with ID:', spreadsheetId);
    
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    console.log('Spreadsheet opened successfully');
    console.log('Spreadsheet name:', spreadsheet.getName());
    console.log('Spreadsheet URL:', spreadsheet.getUrl());
    
    const sheet = spreadsheet.getActiveSheet();
    console.log('Active sheet name:', sheet.getName());
    console.log('Sheet access successful');
    
    // Test append a row
    const testRow = ['Test', 'session_test_123', 'Data', 'Row', new Date()];
    console.log('Appending test row:', testRow);
    sheet.appendRow(testRow);
    console.log('Test row appended successfully');
    
    // Test email
    try {
      MailApp.sendEmail('michaelalfieri.ffl@gmail.com', 'Test Email from Google Apps Script', 'This is a test email to verify email permissions are working.');
      console.log('Test email sent successfully');
    } catch (emailError) {
      console.log('Email test failed:', emailError.toString());
    }
    
    console.log('All tests completed successfully!');
    
  } catch (error) {
    console.log('Test failed:', error.toString());
    console.log('Error details:', error);
  }
} 