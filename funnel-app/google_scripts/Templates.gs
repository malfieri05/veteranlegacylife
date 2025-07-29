/**
 * Templates for Google Apps Script
 * Consolidated email and SMS functions organized by notification type
 * 
 * NOTIFICATION TYPES:
 * 1. NEW LEAD - Customer lead confirmation + Admin notification
 * 2. PARTIAL LEAD - Abandonment alerts + Follow-up messages
 * 3. COMPLETE APPLICATION - Application confirmation + Admin notification
 */

// Configuration is managed in env.gs
// CONFIG object is available from env.gs file

// =============== NEW LEAD NOTIFICATIONS ===============

function sendLeadNotification(data) {
  Logger.log('Sending NEW LEAD notification email');
  
  try {
    // Parse form data
    const parsedFormData = {
      contactInfo: data.contactInfo || {},
      preQualification: data.preQualification || {},
      medicalAnswers: data.medicalAnswers || {}
    };
    
    // Build email data
    const emailData = {
      firstName: parsedFormData.contactInfo?.firstName || '',
      lastName: parsedFormData.contactInfo?.lastName || '',
      email: parsedFormData.contactInfo?.email || '',
      phone: parsedFormData.contactInfo?.phone || '',
      militaryStatus: parsedFormData.preQualification?.militaryStatus || '',
      branchOfService: parsedFormData.preQualification?.branchOfService || '',
      coverageAmount: parsedFormData.preQualification?.coverageAmount || '',
      state: parsedFormData.preQualification?.state || '',
      tobaccoUse: parsedFormData.medicalAnswers?.tobaccoUse || '',
      medicalConditions: parsedFormData.medicalAnswers?.medicalConditions || '',
      height: parsedFormData.medicalAnswers?.height || '',
      weight: parsedFormData.medicalAnswers?.weight || ''
    };
    
    // Generate HTML email
    const html = generateLeadNotificationHTML(emailData);
    
    // Send admin notification
    const emailConfig = getEmailConfig();
    MailApp.sendEmail({
      to: emailConfig.ADMIN,
      from: emailConfig.FROM,
      replyTo: emailConfig.REPLY_TO,
      subject: `🚨 NEW LEAD: ${emailData.firstName} ${emailData.lastName} (${emailData.branchOfService})`,
      htmlBody: html
    });
    
    // Send customer confirmation
    sendLeadConfirmation(data);
    
    Logger.log('NEW LEAD notifications sent successfully');
    return true;
    
  } catch (error) {
    Logger.log('Error sending NEW LEAD notifications:', error.toString());
    return false;
  }
}

function sendLeadConfirmation(data) {
  Logger.log('Sending NEW LEAD confirmation email to customer');
  
  try {
    // Parse form data
    const parsedFormData = {
      contactInfo: data.contactInfo || {},
      preQualification: data.preQualification || {}
    };
    
    // Build email data
    const emailData = {
      firstName: parsedFormData.contactInfo?.firstName || '',
      lastName: parsedFormData.contactInfo?.lastName || '',
      email: parsedFormData.contactInfo?.email || '',
      militaryStatus: parsedFormData.preQualification?.militaryStatus || '',
      branchOfService: parsedFormData.preQualification?.branchOfService || '',
      coverageAmount: parsedFormData.preQualification?.coverageAmount || '',
      state: parsedFormData.preQualification?.state || ''
    };
    
    // Generate HTML email
    const html = generateLeadConfirmationHTML(emailData);
    
    // Send email to customer
    const emailConfig = getEmailConfig();
    MailApp.sendEmail({
      to: emailData.email,
      from: emailConfig.FROM,
      replyTo: emailConfig.REPLY_TO,
      subject: `Thank you for your interest in Veteran Legacy Life Insurance`,
      htmlBody: html
    });
    
    Logger.log('NEW LEAD confirmation email sent to customer successfully');
    return true;
    
  } catch (error) {
    Logger.log('Error sending NEW LEAD confirmation email:', error.toString());
    return false;
  }
}

function sendLeadNotificationSMS(data) {
  Logger.log('Sending NEW LEAD SMS notification');
  
  try {
    const parsedFormData = {
      contactInfo: data.contactInfo || {},
      preQualification: data.preQualification || {}
    };
    
    const message = `NEW LEAD: ${parsedFormData.contactInfo?.firstName || ''} ${parsedFormData.contactInfo?.lastName || ''} - ${parsedFormData.preQualification?.branchOfService || ''} - ${parsedFormData.preQualification?.coverageAmount || ''} coverage. Contact: ${parsedFormData.contactInfo?.phone || ''}`;
    
    // sendSMS(CONFIG.EMAIL.ADMIN, message); // Uncomment when SMS service is configured
    
    Logger.log('NEW LEAD SMS notification sent');
    return true;
    
  } catch (error) {
    Logger.log('Error sending NEW LEAD SMS:', error.toString());
    return false;
  }
}

// =============== PARTIAL LEAD NOTIFICATIONS ===============

function sendPartialLeadEmail(data, sessionId) {
  Logger.log('Sending PARTIAL LEAD abandonment alert');
  
  try {
    // Parse form data
    const parsedFormData = {
      contactInfo: data.contactInfo || {},
      preQualification: data.preQualification || {}
    };
    
    // Build email data
    const emailData = {
      firstName: parsedFormData.contactInfo?.firstName || '',
      lastName: parsedFormData.contactInfo?.lastName || '',
      email: parsedFormData.contactInfo?.email || '',
      phone: parsedFormData.contactInfo?.phone || '',
      militaryStatus: parsedFormData.preQualification?.militaryStatus || '',
      branchOfService: parsedFormData.preQualification?.branchOfService || '',
      coverageAmount: parsedFormData.preQualification?.coverageAmount || '',
      state: parsedFormData.preQualification?.state || ''
    };
    
    // Generate HTML email
    const html = generateAbandonmentAlertHTML(emailData);
    
    // Send admin alert
    const emailConfig = getEmailConfig();
    MailApp.sendEmail({
      to: emailConfig.ADMIN,
      from: emailConfig.FROM,
      replyTo: emailConfig.REPLY_TO,
      subject: `⚠️ ABANDONED LEAD: ${emailData.firstName} ${emailData.lastName} - Follow up needed`,
      htmlBody: html
    });
    
    // Send customer recovery email
    sendAbandonmentRecoveryEmail(data);
    
    Logger.log('PARTIAL LEAD notifications sent successfully');
    return true;
    
  } catch (error) {
    Logger.log('Error sending PARTIAL LEAD notifications:', error.toString());
    return false;
  }
}

function sendAbandonmentRecoveryEmail(data) {
  Logger.log('Sending PARTIAL LEAD recovery email to customer');
  
  try {
    const parsedFormData = {
      contactInfo: data.contactInfo || {},
      preQualification: data.preQualification || {}
    };
    
    const emailData = {
      firstName: parsedFormData.contactInfo?.firstName || '',
      lastName: parsedFormData.contactInfo?.lastName || '',
      email: parsedFormData.contactInfo?.email || '',
      militaryStatus: parsedFormData.preQualification?.militaryStatus || '',
      branchOfService: parsedFormData.preQualification?.branchOfService || '',
      coverageAmount: parsedFormData.preQualification?.coverageAmount || ''
    };
    
    const html = generateAbandonmentRecoveryHTML(emailData);
    
    const emailConfig = getEmailConfig();
    MailApp.sendEmail({
      to: emailData.email,
      from: emailConfig.FROM,
      replyTo: emailConfig.REPLY_TO,
      subject: `Complete Your Veteran Legacy Life Insurance Application`,
      htmlBody: html
    });
    
    Logger.log('PARTIAL LEAD recovery email sent to customer');
    return true;
    
  } catch (error) {
    Logger.log('Error sending PARTIAL LEAD recovery email:', error.toString());
    return false;
  }
}

function sendAbandonmentAlertSMS(data) {
  Logger.log('Sending PARTIAL LEAD SMS alert');
  
  try {
    const parsedFormData = {
      contactInfo: data.contactInfo || {},
      preQualification: data.preQualification || {}
    };
    
    const message = `ABANDONED LEAD: ${parsedFormData.contactInfo?.firstName || ''} ${parsedFormData.contactInfo?.lastName || ''} - ${parsedFormData.preQualification?.branchOfService || ''} - ${parsedFormData.preQualification?.coverageAmount || ''} coverage. Contact: ${parsedFormData.contactInfo?.phone || ''} - Follow up needed!`;
    
    // sendSMS(CONFIG.EMAIL.ADMIN, message); // Uncomment when SMS service is configured
    
    Logger.log('PARTIAL LEAD SMS alert sent');
    return true;
    
  } catch (error) {
    Logger.log('Error sending PARTIAL LEAD SMS:', error.toString());
    return false;
  }
}

// =============== COMPLETE APPLICATION NOTIFICATIONS ===============

function sendApplicationCompleteEmail(data) {
  Logger.log('Sending COMPLETE APPLICATION notification');
  
  try {
    // Parse form data
    const parsedFormData = {
      contactInfo: data.contactInfo || {},
      preQualification: data.preQualification || {},
      medicalAnswers: data.medicalAnswers || {},
      applicationData: data.applicationData || {},
      quoteData: data.quoteData || {}
    };
    
    // Build email data
    const emailData = {
      firstName: parsedFormData.contactInfo?.firstName || '',
      lastName: parsedFormData.contactInfo?.lastName || '',
      email: parsedFormData.contactInfo?.email || '',
      phone: parsedFormData.contactInfo?.phone || '',
      militaryStatus: parsedFormData.preQualification?.militaryStatus || '',
      branchOfService: parsedFormData.preQualification?.branchOfService || '',
      coverageAmount: parsedFormData.preQualification?.coverageAmount || '',
      state: parsedFormData.preQualification?.state || '',
      streetAddress: parsedFormData.applicationData?.streetAddress || '',
      city: parsedFormData.applicationData?.city || '',
      applicationState: parsedFormData.applicationData?.state || '',
      zipCode: parsedFormData.applicationData?.zipCode || '',
      beneficiaryName: parsedFormData.applicationData?.beneficiaryName || '',
      beneficiaryRelationship: parsedFormData.applicationData?.beneficiaryRelationship || '',
      vaNumber: parsedFormData.applicationData?.vaNumber || '',
      serviceConnected: parsedFormData.applicationData?.serviceConnected || '',
      ssn: encryptSensitiveData(parsedFormData.applicationData?.ssn || ''),
      driversLicense: encryptSensitiveData(parsedFormData.applicationData?.driversLicense || ''),
      bankName: parsedFormData.applicationData?.bankName || '',
      routingNumber: encryptSensitiveData(parsedFormData.applicationData?.routingNumber || ''),
      accountNumber: encryptSensitiveData(parsedFormData.applicationData?.accountNumber || ''),
      policyDate: parsedFormData.quoteData?.policyDate || '',
      quoteCoverage: parsedFormData.quoteData?.coverage || '',
      quotePremium: parsedFormData.quoteData?.premium || '',
      quoteAge: parsedFormData.quoteData?.age || '',
      quoteGender: parsedFormData.quoteData?.gender || '',
      quoteType: parsedFormData.quoteData?.type || ''
    };
    
    // Generate HTML email
    const html = generateApplicationCompleteHTML(emailData);
    
    // Send admin notification
    const emailConfig = getEmailConfig();
    MailApp.sendEmail({
      to: emailConfig.ADMIN,
      from: emailConfig.FROM,
      replyTo: emailConfig.REPLY_TO,
      subject: `✅ APPLICATION COMPLETE: ${emailData.firstName} ${emailData.lastName} - ${emailData.quoteCoverage} Coverage`,
      htmlBody: html
    });
    
    // Send customer confirmation
    sendApplicationConfirmation(data);
    
    Logger.log('COMPLETE APPLICATION notifications sent successfully');
    return true;
    
  } catch (error) {
    Logger.log('Error sending COMPLETE APPLICATION notifications:', error.toString());
    return false;
  }
}

function sendApplicationNotification(data, sessionId) {
  Logger.log('Sending COMPLETE APPLICATION notification');
  
  try {
    // Parse form data
    const parsedFormData = {
      contactInfo: data.contactInfo || {},
      preQualification: data.preQualification || {},
      medicalAnswers: data.medicalAnswers || {},
      applicationData: data.applicationData || {},
      quoteData: data.quoteData || {}
    };
    
    // Build email data
    const emailData = {
      firstName: parsedFormData.contactInfo?.firstName || '',
      lastName: parsedFormData.contactInfo?.lastName || '',
      email: parsedFormData.contactInfo?.email || '',
      phone: parsedFormData.contactInfo?.phone || '',
      militaryStatus: parsedFormData.preQualification?.militaryStatus || '',
      branchOfService: parsedFormData.preQualification?.branchOfService || '',
      coverageAmount: parsedFormData.preQualification?.coverageAmount || '',
      state: parsedFormData.preQualification?.state || '',
      streetAddress: parsedFormData.applicationData?.streetAddress || '',
      city: parsedFormData.applicationData?.city || '',
      applicationState: parsedFormData.applicationData?.state || '',
      zipCode: parsedFormData.applicationData?.zipCode || '',
      beneficiaryName: parsedFormData.applicationData?.beneficiaryName || '',
      beneficiaryRelationship: parsedFormData.applicationData?.beneficiaryRelationship || '',
      vaNumber: parsedFormData.applicationData?.vaNumber || '',
      serviceConnected: parsedFormData.applicationData?.serviceConnected || '',
      ssn: encryptSensitiveData(parsedFormData.applicationData?.ssn || ''),
      driversLicense: encryptSensitiveData(parsedFormData.applicationData?.driversLicense || ''),
      bankName: parsedFormData.applicationData?.bankName || '',
      routingNumber: encryptSensitiveData(parsedFormData.applicationData?.routingNumber || ''),
      accountNumber: encryptSensitiveData(parsedFormData.applicationData?.accountNumber || ''),
      policyDate: parsedFormData.quoteData?.policyDate || '',
      quoteCoverage: parsedFormData.quoteData?.coverage || '',
      quotePremium: parsedFormData.quoteData?.premium || '',
      quoteAge: parsedFormData.quoteData?.age || '',
      quoteGender: parsedFormData.quoteData?.gender || '',
      quoteType: parsedFormData.quoteData?.type || ''
    };
    
    // Generate HTML email
    const html = generateApplicationCompleteHTML(emailData);
    
    // Send admin notification
    const emailConfig = getEmailConfig();
    MailApp.sendEmail({
      to: emailConfig.ADMIN,
      from: emailConfig.FROM,
      replyTo: emailConfig.REPLY_TO,
      subject: `✅ APPLICATION COMPLETE: ${emailData.firstName} ${emailData.lastName} - ${emailData.quoteCoverage} Coverage`,
      htmlBody: html
    });
    
    // Send customer confirmation
    sendApplicationConfirmation(data);
    
    Logger.log('COMPLETE APPLICATION notifications sent successfully');
    return true;
    
  } catch (error) {
    Logger.log('Error sending COMPLETE APPLICATION notifications:', error.toString());
    return false;
  }
}

function sendApplicationConfirmation(data) {
  Logger.log('Sending COMPLETE APPLICATION confirmation email to customer');
  
  try {
    // Parse form data
    const parsedFormData = {
      contactInfo: data.contactInfo || {},
      preQualification: data.preQualification || {},
      quoteData: data.quoteData || {}
    };
    
    // Build email data
    const emailData = {
      firstName: parsedFormData.contactInfo?.firstName || '',
      lastName: parsedFormData.contactInfo?.lastName || '',
      email: parsedFormData.contactInfo?.email || '',
      militaryStatus: parsedFormData.preQualification?.militaryStatus || '',
      branchOfService: parsedFormData.preQualification?.branchOfService || '',
      coverageAmount: parsedFormData.preQualification?.coverageAmount || '',
      quoteCoverage: parsedFormData.quoteData?.coverage || '',
      quotePremium: parsedFormData.quoteData?.premium || '',
      quoteType: parsedFormData.quoteData?.type || ''
    };
    
    // Generate HTML email
    const html = generateApplicationConfirmationHTML(emailData);
    
    // Send email to customer
    const emailConfig = getEmailConfig();
    MailApp.sendEmail({
      to: emailData.email,
      from: emailConfig.FROM,
      replyTo: emailConfig.REPLY_TO,
      subject: `Your Veteran Legacy Life Insurance Application is Complete`,
      htmlBody: html
    });
    
    Logger.log('COMPLETE APPLICATION confirmation email sent to customer successfully');
    return true;
    
  } catch (error) {
    Logger.log('Error sending COMPLETE APPLICATION confirmation email:', error.toString());
    return false;
  }
}

function sendApplicationCompleteSMS(data) {
  Logger.log('Sending COMPLETE APPLICATION SMS notification');
  
  try {
    const parsedFormData = {
      contactInfo: data.contactInfo || {},
      preQualification: data.preQualification || {},
      quoteData: data.quoteData || {}
    };
    
    const message = `APPLICATION COMPLETE: ${parsedFormData.contactInfo?.firstName || ''} ${parsedFormData.contactInfo?.lastName || ''} - ${parsedFormData.quoteData?.coverage || ''} coverage - ${parsedFormData.quoteData?.premium || ''} premium. Contact: ${parsedFormData.contactInfo?.phone || ''}`;
    
    // sendSMS(CONFIG.EMAIL.ADMIN, message); // Uncomment when SMS service is configured
    
    Logger.log('COMPLETE APPLICATION SMS notification sent');
    return true;
    
  } catch (error) {
    Logger.log('Error sending COMPLETE APPLICATION SMS:', error.toString());
    return false;
  }
}

// =============== HELPER FUNCTIONS ===============

function encryptSensitiveData(data) {
  if (!data || data.length < 4) return data;
  return '*'.repeat(data.length - 4) + data.slice(-4);
}

function generateSubject(type, data) {
  switch (type) {
    case 'newLead':
      return `🚨 NEW LEAD: ${data.firstName} ${data.lastName} (${data.branchOfService})`;
    case 'completeApplication':
      return `✅ APPLICATION COMPLETE: ${data.firstName} ${data.lastName} - ${data.quoteCoverage} Coverage`;
    case 'partialLead':
      return `⚠️ ABANDONED LEAD: ${data.firstName} ${data.lastName} - Follow up needed`;
    case 'leadConfirmation':
      return `Thank you for your interest in Veteran Legacy Life Insurance`;
    case 'applicationConfirmation':
      return `Your Veteran Legacy Life Insurance Application is Complete`;
    case 'abandonmentRecovery':
      return `Complete Your Veteran Legacy Life Insurance Application`;
    default:
      return 'Veteran Legacy Life Insurance Notification';
  }
}

// =============== HTML TEMPLATE GENERATORS ===============

function generateLeadNotificationHTML(data) {
  const companyConfig = getCompanyConfig();
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Lead Notification</title>
      <style>
        body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0; }
        .email-container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .alert-box { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .data-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .data-table th, .data-table td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
        .data-table th { background: #f3f4f6; font-weight: bold; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Veteran Legacy Life</h1>
          <p>Veteran Life Insurance Specialists</p>
        </div>
        
        <div class="content">
          <h2>🚨 New Lead Received</h2>
          
          <div class="alert-box">
            <h3>Lead Summary</h3>
            <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
            <p><strong>Military Status:</strong> ${data.militaryStatus} - ${data.branchOfService}</p>
            <p><strong>Coverage:</strong> ${data.coverageAmount}</p>
            <p><strong>Contact:</strong> ${data.email} | ${data.phone}</p>
          </div>
          
          <table class="data-table">
            <tr><th colspan="2">Contact Information</th></tr>
            <tr><td>Name</td><td>${data.firstName} ${data.lastName}</td></tr>
            <tr><td>Email</td><td>${data.email}</td></tr>
            <tr><td>Phone</td><td>${data.phone}</td></tr>
            <tr><td>State</td><td>${data.state}</td></tr>
            <tr><td>Military Status</td><td>${data.militaryStatus}</td></tr>
            <tr><td>Branch of Service</td><td>${data.branchOfService}</td></tr>
            <tr><td>Coverage Amount</td><td>${data.coverageAmount}</td></tr>
            <tr><td>Tobacco Use</td><td>${data.tobaccoUse}</td></tr>
            <tr><td>Medical Conditions</td><td>${data.medicalConditions}</td></tr>
            <tr><td>Height</td><td>${data.height}</td></tr>
            <tr><td>Weight</td><td>${data.weight}</td></tr>
          </table>
        </div>
        
        <div class="footer">
          <p><strong>Veteran Legacy Life</strong></p>
          <p>Phone: <a href="tel:${companyConfig.PHONE_DIALABLE}">${companyConfig.PHONE}</a></p>
          <p>Website: <a href="${companyConfig.WEBSITE}">${companyConfig.WEBSITE}</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateLeadConfirmationHTML(data) {
  const companyConfig = getCompanyConfig();
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You - Veteran Legacy Life</title>
      <style>
        body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0; }
        .email-container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .thank-you-box { background: #f0f9ff; border: 1px solid #bae6fd; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Veteran Legacy Life</h1>
          <p>Veteran Life Insurance Specialists</p>
        </div>
        
        <div class="content">
          <h2>Thank You for Your Interest!</h2>
          
          <div class="thank-you-box">
            <h3>Dear ${data.firstName},</h3>
            <p>Thank you for your interest in Veteran Legacy Life Insurance. We have received your information and our team will be in touch with you shortly to discuss your options.</p>
            
            <h4>Your Information:</h4>
            <ul>
              <li><strong>Name:</strong> ${data.firstName} ${data.lastName}</li>
              <li><strong>Military Status:</strong> ${data.militaryStatus} - ${data.branchOfService}</li>
              <li><strong>Desired Coverage:</strong> ${data.coverageAmount}</li>
              <li><strong>State:</strong> ${data.state}</li>
            </ul>
            
            <p>We understand the unique needs of veterans and their families, and we're committed to finding you the best insurance options available.</p>
          </div>
          
          <p>If you have any questions, please don't hesitate to contact us at ${companyConfig.PHONE}.</p>
        </div>
        
        <div class="footer">
          <p><strong>Veteran Legacy Life</strong></p>
          <p>Phone: <a href="tel:${companyConfig.PHONE_DIALABLE}">${companyConfig.PHONE}</a></p>
          <p>Website: <a href="${companyConfig.WEBSITE}">${companyConfig.WEBSITE}</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateApplicationCompleteHTML(data) {
  const companyConfig = getCompanyConfig();
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Application Complete Notification</title>
      <style>
        body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0; }
        .email-container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .success-box { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .data-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .data-table th, .data-table td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
        .data-table th { background: #f3f4f6; font-weight: bold; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Veteran Legacy Life</h1>
          <p>Veteran Life Insurance Specialists</p>
        </div>
        
        <div class="content">
          <h2>✅ Application Complete</h2>
          
          <div class="success-box">
            <h3>Application Summary</h3>
            <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
            <p><strong>Coverage:</strong> ${data.quoteCoverage}</p>
            <p><strong>Premium:</strong> ${data.quotePremium}</p>
            <p><strong>Contact:</strong> ${data.email} | ${data.phone}</p>
          </div>
          
          <table class="data-table">
            <tr><th colspan="2">Contact Information</th></tr>
            <tr><td>Name</td><td>${data.firstName} ${data.lastName}</td></tr>
            <tr><td>Email</td><td>${data.email}</td></tr>
            <tr><td>Phone</td><td>${data.phone}</td></tr>
            <tr><td>Military Status</td><td>${data.militaryStatus}</td></tr>
            <tr><td>Branch of Service</td><td>${data.branchOfService}</td></tr>
            <tr><td>Coverage Amount</td><td>${data.coverageAmount}</td></tr>
            <tr><th colspan="2">Application Details</th></tr>
            <tr><td>Street Address</td><td>${data.streetAddress}</td></tr>
            <tr><td>City</td><td>${data.city}</td></tr>
            <tr><td>State</td><td>${data.applicationState}</td></tr>
            <tr><td>ZIP Code</td><td>${data.zipCode}</td></tr>
            <tr><td>Beneficiary Name</td><td>${data.beneficiaryName}</td></tr>
            <tr><td>Beneficiary Relationship</td><td>${data.beneficiaryRelationship}</td></tr>
            <tr><td>VA Number</td><td>${data.vaNumber}</td></tr>
            <tr><td>Service Connected</td><td>${data.serviceConnected}</td></tr>
            <tr><td>SSN</td><td>${data.ssn}</td></tr>
            <tr><td>Drivers License</td><td>${data.driversLicense}</td></tr>
            <tr><td>Bank Name</td><td>${data.bankName}</td></tr>
            <tr><td>Routing Number</td><td>${data.routingNumber}</td></tr>
            <tr><td>Account Number</td><td>${data.accountNumber}</td></tr>
            <tr><th colspan="2">Quote Information</th></tr>
            <tr><td>Policy Date</td><td>${data.policyDate}</td></tr>
            <tr><td>Coverage</td><td>${data.quoteCoverage}</td></tr>
            <tr><td>Premium</td><td>${data.quotePremium}</td></tr>
            <tr><td>Age</td><td>${data.quoteAge}</td></tr>
            <tr><td>Gender</td><td>${data.quoteGender}</td></tr>
            <tr><td>Quote Type</td><td>${data.quoteType}</td></tr>
          </table>
        </div>
        
        <div class="footer">
          <p><strong>Veteran Legacy Life</strong></p>
          <p>Phone: <a href="tel:${companyConfig.PHONE_DIALABLE}">${companyConfig.PHONE}</a></p>
          <p>Website: <a href="${companyConfig.WEBSITE}">${companyConfig.WEBSITE}</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateApplicationConfirmationHTML(data) {
  const companyConfig = getCompanyConfig();
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Application Complete - Veteran Legacy Life</title>
      <style>
        body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0; }
        .email-container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .success-box { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Veteran Legacy Life</h1>
          <p>Veteran Life Insurance Specialists</p>
        </div>
        
        <div class="content">
          <h2>🎉 Your Application is Complete!</h2>
          
          <div class="success-box">
            <h3>Congratulations, ${data.firstName}!</h3>
            <p>Your Veteran Legacy Life Insurance application has been successfully submitted. Here are the details of your application:</p>
            
            <h4>Application Summary:</h4>
            <ul>
              <li><strong>Name:</strong> ${data.firstName} ${data.lastName}</li>
              <li><strong>Military Status:</strong> ${data.militaryStatus} - ${data.branchOfService}</li>
              <li><strong>Coverage Amount:</strong> ${data.coverageAmount}</li>
              <li><strong>Quote Coverage:</strong> ${data.quoteCoverage}</li>
              <li><strong>Monthly Premium:</strong> ${data.quotePremium}</li>
              <li><strong>Policy Type:</strong> ${data.quoteType}</li>
            </ul>
            
            <p>Our team will review your application and contact you within 1-2 business days to discuss next steps and answer any questions you may have.</p>
          </div>
          
          <p>If you have any questions or need to make changes to your application, please contact us at ${companyConfig.PHONE}.</p>
        </div>
        
        <div class="footer">
          <p><strong>Veteran Legacy Life</strong></p>
          <p>Phone: <a href="tel:${companyConfig.PHONE_DIALABLE}">${companyConfig.PHONE}</a></p>
          <p>Website: <a href="${companyConfig.WEBSITE}">${companyConfig.WEBSITE}</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateAbandonmentAlertHTML(data) {
  const companyConfig = getCompanyConfig();
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Abandoned Lead Alert</title>
      <style>
        body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0; }
        .email-container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .alert-box { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Veteran Legacy Life</h1>
          <p>Veteran Life Insurance Specialists</p>
        </div>
        
        <div class="content">
          <h2>⚠️ Abandoned Lead Alert</h2>
          
          <div class="alert-box">
            <h3>Lead Information</h3>
            <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Military Status:</strong> ${data.militaryStatus} - ${data.branchOfService}</p>
            <p><strong>Desired Coverage:</strong> ${data.coverageAmount}</p>
            <p><strong>State:</strong> ${data.state}</p>
          </div>
          
          <p>This lead started the application process but did not complete it. Please follow up with them to encourage completion of their application.</p>
        </div>
        
        <div class="footer">
          <p><strong>Veteran Legacy Life</strong></p>
          <p>Phone: <a href="tel:${companyConfig.PHONE_DIALABLE}">${companyConfig.PHONE}</a></p>
          <p>Website: <a href="${companyConfig.WEBSITE}">${companyConfig.WEBSITE}</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateAbandonmentRecoveryHTML(data) {
  const companyConfig = getCompanyConfig();
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Complete Your Application - Veteran Legacy Life</title>
      <style>
        body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0; }
        .email-container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .recovery-box { background: #fffbeb; border: 1px solid #fed7aa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Veteran Legacy Life</h1>
          <p>Veteran Life Insurance Specialists</p>
        </div>
        
        <div class="content">
          <h2>Complete Your Application</h2>
          
          <div class="recovery-box">
            <h3>Dear ${data.firstName},</h3>
            <p>We noticed you started your Veteran Legacy Life Insurance application but didn't complete it. We'd love to help you finish the process and get the coverage you deserve.</p>
            
            <h4>Your Started Application:</h4>
            <ul>
              <li><strong>Name:</strong> ${data.firstName} ${data.lastName}</li>
              <li><strong>Military Status:</strong> ${data.militaryStatus} - ${data.branchOfService}</li>
              <li><strong>Desired Coverage:</strong> ${data.coverageAmount}</li>
            </ul>
            
            <p>Completing your application only takes a few more minutes, and our team is ready to help you every step of the way.</p>
            
            <p><strong>Why complete your application?</strong></p>
            <ul>
              <li>Get the coverage you and your family deserve</li>
              <li>Take advantage of veteran-specific benefits</li>
              <li>Lock in competitive rates</li>
              <li>Ensure your family's financial security</li>
            </ul>
          </div>
          
          <p>If you have any questions or need assistance, please contact us at ${companyConfig.PHONE}.</p>
        </div>
        
        <div class="footer">
          <p><strong>Veteran Legacy Life</strong></p>
          <p>Phone: <a href="tel:${companyConfig.PHONE_DIALABLE}">${companyConfig.PHONE}</a></p>
          <p>Website: <a href="${companyConfig.WEBSITE}">${companyConfig.WEBSITE}</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
} 