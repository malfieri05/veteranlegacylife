// Google Apps Script for Veteran Legacy Life - Leads
// Deploy this as a web app to handle form submissions

function doPost(e) {
  try {
    // Handle CORS preflight requests
    if (e.parameter.method === 'OPTIONS') {
      return ContentService
        .createTextOutput('')
        .setMimeType(ContentService.MimeType.TEXT)
        .setHeader('Access-Control-Allow-Origin', '*')
        .setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        .setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }
    
    // Log the incoming request for debugging
    console.log('Received POST request');
    console.log('Post data contents:', e.postData.contents);
    
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    console.log('Parsed data:', data);
    
    // Get the active spreadsheet
    const spreadsheetId = '1MvmvfqRBnt8fjplbRgFIi7BTnzcAGaMNeIDwCHGPis8';
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getActiveSheet();
    
    console.log('Sheet name:', sheet.getName());
    console.log('Sheet URL:', spreadsheet.getUrl());
    
    // Prepare comprehensive row data with ALL funnel information
    const rowData = [
      new Date(), // Timestamp
      data.firstName || '',
      data.lastName || '',
      data.phone || '',
      data.email || '',
      data.dateOfBirth || '',
      data.age || '',
      data.state || '',
      data.militaryStatus || '',
      data.branchOfService || '',
      data.maritalStatus || '',
      data.coverageAmount || '',
      data.quoteType || '',
      data.gender || '',
      data.tobaccoUse || '',
      Array.isArray(data.medicalConditions) ? data.medicalConditions.join(', ') : (data.medicalConditions || ''),
      data.height || '',
      data.weight || '',
      data.hospitalCare || '',
      data.diabetesMedication || '',
      data.transactionalConsent || false,
      data.marketingConsent || false,
      data.formType || 'Funnel',
      data.funnelProgress || 'Complete',
      data.ssn || '',
      data.bankName || '',
      data.routingNumber || '',
      data.accountNumber || '',
      data.policyStartDate || '',
      data.quoteAmount || '',
      data.healthTier || '',
      data.monthlyPremium || ''
    ];
    
    console.log('Row data to append:', rowData);
    
    // SEND EMAIL FIRST for immediate delivery
    // Send comprehensive email notification with ALL funnel data - IMMEDIATE DELIVERY
    try {
      const emailAddress = 'michaelalfieri.ffl@gmail.com';
      const subject = `🚨 NEW LEAD: ${data.firstName || ''} ${data.lastName || ''} - ${data.state || ''} - ${data.coverageAmount || ''}`;
      
      // Create comprehensive message with all captured data
      const message = `
🚨 NEW VETERAN LIFE INSURANCE LEAD 🚨

=== CONTACT INFORMATION ===
Name: ${data.firstName || ''} ${data.lastName || ''}
Phone: ${data.phone || ''}
Email: ${data.email || ''}
Date of Birth: ${data.dateOfBirth || ''}
Age: ${data.age || 'Not provided'}

=== LOCATION & MILITARY INFO ===
State: ${data.state || ''}
Military Status: ${data.militaryStatus || ''}
Branch of Service: ${data.branchOfService || ''}
Marital Status: ${data.maritalStatus || ''}

=== INSURANCE PREFERENCES ===
Coverage Amount: ${data.coverageAmount || ''}
Quote Type: ${data.quoteType || 'Standard'}
Gender: ${data.gender || ''}

=== MEDICAL INFORMATION ===
Tobacco Use: ${data.tobaccoUse || ''}
Height: ${data.height || ''}
Weight: ${data.weight || ''}
Hospital Care (Past 2 Years): ${data.hospitalCare || ''}
Diabetes Medication: ${data.diabetesMedication || ''}

Medical Conditions: ${Array.isArray(data.medicalConditions) ? data.medicalConditions.join(', ') : (data.medicalConditions || 'None listed')}

=== CONSENT & MARKETING ===
Transactional Consent: ${data.transactionalConsent ? 'YES' : 'NO'}
Marketing Consent: ${data.marketingConsent ? 'YES' : 'NO'}

=== ADDITIONAL DATA ===
Form Type: ${data.formType || 'Funnel'}
Funnel Progress: ${data.funnelProgress || 'Complete'}
Timestamp: ${new Date().toLocaleString()}

=== APPLICATION DATA (if applicable) ===
SSN: ${data.ssn || 'Not provided'}
Bank Name: ${data.bankName || 'Not provided'}
Routing Number: ${data.routingNumber || 'Not provided'}
Account Number: ${data.accountNumber || 'Not provided'}
Policy Start Date: ${data.policyStartDate || 'Not provided'}

=== QUOTE DATA (if applicable) ===
Quote Amount: ${data.quoteAmount || 'Not provided'}
Health Tier: ${data.healthTier || 'Not provided'}
Monthly Premium: ${data.monthlyPremium || 'Not provided'}

📊 View all leads in the Google Sheet: ${spreadsheet.getUrl()}

---
This lead was generated from the Veteran Legacy Life website funnel.
      `;
      
      // Send email with maximum priority for immediate delivery
      MailApp.sendEmail({
        to: emailAddress,
        subject: subject,
        body: message,
        noReply: false,
        replyTo: emailAddress
      });
      console.log('🚨 IMMEDIATE EMAIL SENT TO michaelalfieri.ffl@gmail.com 🚨');
    } catch (emailError) {
      console.log('Email error:', emailError.toString());
    }
    
    // Append the data to the sheet (after email is sent)
    sheet.appendRow(rowData);
    console.log('Data appended successfully');
    
    // Return success response with CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'message': 'Data recorded and email sent' }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type');
      
  } catch (error) {
    console.log('Error in doPost:', error.toString());
    // Return error response with CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type');
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
    const testRow = ['Test', 'Data', 'Row', new Date()];
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