// Google Apps Script to handle form submissions
function doPost(e) {
  // Parse the JSON data from the request
  const data = JSON.parse(e.postData.contents);
  
  // Get the active spreadsheet and sheet
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Leads');
  
  // Create timestamp
  const timestamp = new Date();
  
  // Prepare row data
  const rowData = [
    timestamp,
    data.state,
    data.militaryStatus,
    data.branchOfService,
    data.maritalStatus,
    data.coverageAmount,
    data.firstName,
    data.lastName,
    data.phone,
    data.dateOfBirth,
    data.email,
    data.transactionalConsent,
    data.marketingConsent
  ];
  
  // Append the data to the sheet
  sheet.appendRow(rowData);
  
  // Send email notification
  const emailAddress = 'YOUR_EMAIL@gmail.com'; // Replace with your email
  const subject = 'New Lead from Veteran Legacy Life';
  const message = `
    New lead received from Veteran Legacy Life website:
    
    Name: ${data.firstName} ${data.lastName}
    Phone: ${data.phone}
    Email: ${data.email}
    State: ${data.state}
    Military Status: ${data.militaryStatus}
    Branch of Service: ${data.branchOfService}
    Coverage Amount: ${data.coverageAmount}
    
    View all leads in the Google Sheet: ${ss.getUrl()}
  `;
  
  MailApp.sendEmail(emailAddress, subject, message);
  
  // Return success response
  return ContentService.createTextOutput(JSON.stringify({
    'status': 'success',
    'message': 'Data successfully recorded'
  })).setMimeType(ContentService.MimeType.JSON);
} 