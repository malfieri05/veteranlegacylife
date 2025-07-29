import sgMail from '@sendgrid/mail'

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

interface EmailOptions {
  to: string
  from: string
  replyTo?: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    const msg = {
      to: options.to,
      from: options.from,
      replyTo: options.replyTo || options.from,
      subject: options.subject,
      html: options.html,
      text: options.text || stripHtml(options.html)
    }
    
    await sgMail.send(msg)
    console.log(`Email sent successfully to ${options.to}`)
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

// Helper function to strip HTML for text version
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

// Email template generators (ported from Google Apps Script Templates.gs)

interface EmailData {
  firstName: string
  lastName: string
  email: string
  phone: string
  militaryStatus: string
  branchOfService: string
  coverageAmount: string
  state: string
  tobaccoUse: string
  medicalConditions: string
  height: string
  weight: string
  streetAddress: string
  city: string
  applicationState: string
  zipCode: string
  beneficiaryName: string
  beneficiaryRelationship: string
  vaNumber: string
  serviceConnected: string
  ssn: string
  driversLicense: string
  bankName: string
  routingNumber: string
  accountNumber: string
  policyDate: string
  quoteCoverage: string
  quotePremium: string
  quoteAge: string
  quoteGender: string
  quoteType: string
}

export function generateLeadNotificationHTML(submission: any): string {
  const data: EmailData = {
    firstName: submission.contactInfo?.firstName || '',
    lastName: submission.contactInfo?.lastName || '',
    email: submission.contactInfo?.email || '',
    phone: submission.contactInfo?.phone || '',
    militaryStatus: submission.preQualification?.militaryStatus || '',
    branchOfService: submission.preQualification?.branchOfService || '',
    coverageAmount: submission.preQualification?.coverageAmount || '',
    state: submission.preQualification?.state || '',
    tobaccoUse: submission.medicalAnswers?.tobaccoUse || '',
    medicalConditions: submission.medicalAnswers?.medicalConditions || '',
    height: submission.medicalAnswers?.height || '',
    weight: submission.medicalAnswers?.weight || '',
    streetAddress: submission.applicationData?.streetAddress || '',
    city: submission.applicationData?.city || '',
    applicationState: submission.applicationData?.state || '',
    zipCode: submission.applicationData?.zipCode || '',
    beneficiaryName: submission.applicationData?.beneficiaryName || '',
    beneficiaryRelationship: submission.applicationData?.beneficiaryRelationship || '',
    vaNumber: submission.applicationData?.vaNumber || '',
    serviceConnected: submission.applicationData?.serviceConnected || '',
    ssn: encryptSensitiveData(submission.applicationData?.ssn || ''),
    driversLicense: encryptSensitiveData(submission.applicationData?.driversLicense || ''),
    bankName: submission.applicationData?.bankName || '',
    routingNumber: encryptSensitiveData(submission.applicationData?.routingNumber || ''),
    accountNumber: encryptSensitiveData(submission.applicationData?.accountNumber || ''),
    policyDate: submission.quoteData?.policyDate || '',
    quoteCoverage: submission.quoteData?.coverage || '',
    quotePremium: submission.quoteData?.premium || '',
    quoteAge: submission.quoteData?.age || '',
    quoteGender: submission.quoteData?.gender || '',
    quoteType: submission.quoteData?.type || ''
  }

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
          <p>Phone: <a href="tel:180083847467">(800) VET-INSURANCE</a></p>
          <p>Website: <a href="https://veteranlegacylife.com">https://veteranlegacylife.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function generateLeadConfirmationHTML(submission: any): string {
  const data: EmailData = {
    firstName: submission.contactInfo?.firstName || '',
    lastName: submission.contactInfo?.lastName || '',
    email: submission.contactInfo?.email || '',
    phone: submission.contactInfo?.phone || '',
    militaryStatus: submission.preQualification?.militaryStatus || '',
    branchOfService: submission.preQualification?.branchOfService || '',
    coverageAmount: submission.preQualification?.coverageAmount || '',
    state: submission.preQualification?.state || '',
    tobaccoUse: '',
    medicalConditions: '',
    height: '',
    weight: '',
    streetAddress: '',
    city: '',
    applicationState: '',
    zipCode: '',
    beneficiaryName: '',
    beneficiaryRelationship: '',
    vaNumber: '',
    serviceConnected: '',
    ssn: '',
    driversLicense: '',
    bankName: '',
    routingNumber: '',
    accountNumber: '',
    policyDate: '',
    quoteCoverage: '',
    quotePremium: '',
    quoteAge: '',
    quoteGender: '',
    quoteType: ''
  }

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
          
          <p>If you have any questions, please don't hesitate to contact us at (800) VET-INSURANCE.</p>
        </div>
        
        <div class="footer">
          <p><strong>Veteran Legacy Life</strong></p>
          <p>Phone: <a href="tel:180083847467">(800) VET-INSURANCE</a></p>
          <p>Website: <a href="https://veteranlegacylife.com">https://veteranlegacylife.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function generateApplicationCompleteHTML(submission: any): string {
  const data: EmailData = {
    firstName: submission.contactInfo?.firstName || '',
    lastName: submission.contactInfo?.lastName || '',
    email: submission.contactInfo?.email || '',
    phone: submission.contactInfo?.phone || '',
    militaryStatus: submission.preQualification?.militaryStatus || '',
    branchOfService: submission.preQualification?.branchOfService || '',
    coverageAmount: submission.preQualification?.coverageAmount || '',
    state: submission.preQualification?.state || '',
    tobaccoUse: submission.medicalAnswers?.tobaccoUse || '',
    medicalConditions: submission.medicalAnswers?.medicalConditions || '',
    height: submission.medicalAnswers?.height || '',
    weight: submission.medicalAnswers?.weight || '',
    streetAddress: submission.applicationData?.streetAddress || '',
    city: submission.applicationData?.city || '',
    applicationState: submission.applicationData?.state || '',
    zipCode: submission.applicationData?.zipCode || '',
    beneficiaryName: submission.applicationData?.beneficiaryName || '',
    beneficiaryRelationship: submission.applicationData?.beneficiaryRelationship || '',
    vaNumber: submission.applicationData?.vaNumber || '',
    serviceConnected: submission.applicationData?.serviceConnected || '',
    ssn: encryptSensitiveData(submission.applicationData?.ssn || ''),
    driversLicense: encryptSensitiveData(submission.applicationData?.driversLicense || ''),
    bankName: submission.applicationData?.bankName || '',
    routingNumber: encryptSensitiveData(submission.applicationData?.routingNumber || ''),
    accountNumber: encryptSensitiveData(submission.applicationData?.accountNumber || ''),
    policyDate: submission.quoteData?.policyDate || '',
    quoteCoverage: submission.quoteData?.coverage || '',
    quotePremium: submission.quoteData?.premium || '',
    quoteAge: submission.quoteData?.age || '',
    quoteGender: submission.quoteData?.gender || '',
    quoteType: submission.quoteData?.type || ''
  }

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
          <p>Phone: <a href="tel:180083847467">(800) VET-INSURANCE</a></p>
          <p>Website: <a href="https://veteranlegacylife.com">https://veteranlegacylife.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function generateApplicationConfirmationHTML(submission: any): string {
  const data: EmailData = {
    firstName: submission.contactInfo?.firstName || '',
    lastName: submission.contactInfo?.lastName || '',
    email: submission.contactInfo?.email || '',
    phone: submission.contactInfo?.phone || '',
    militaryStatus: submission.preQualification?.militaryStatus || '',
    branchOfService: submission.preQualification?.branchOfService || '',
    coverageAmount: submission.preQualification?.coverageAmount || '',
    state: submission.preQualification?.state || '',
    tobaccoUse: '',
    medicalConditions: '',
    height: '',
    weight: '',
    streetAddress: '',
    city: '',
    applicationState: '',
    zipCode: '',
    beneficiaryName: '',
    beneficiaryRelationship: '',
    vaNumber: '',
    serviceConnected: '',
    ssn: '',
    driversLicense: '',
    bankName: '',
    routingNumber: '',
    accountNumber: '',
    policyDate: '',
    quoteCoverage: submission.quoteData?.coverage || '',
    quotePremium: submission.quoteData?.premium || '',
    quoteAge: '',
    quoteGender: '',
    quoteType: submission.quoteData?.type || ''
  }

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
          
          <p>If you have any questions or need to make changes to your application, please contact us at (800) VET-INSURANCE.</p>
        </div>
        
        <div class="footer">
          <p><strong>Veteran Legacy Life</strong></p>
          <p>Phone: <a href="tel:180083847467">(800) VET-INSURANCE</a></p>
          <p>Website: <a href="https://veteranlegacylife.com">https://veteranlegacylife.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function generateAbandonmentAlertHTML(submission: any): string {
  const data: EmailData = {
    firstName: submission.contactInfo?.firstName || '',
    lastName: submission.contactInfo?.lastName || '',
    email: submission.contactInfo?.email || '',
    phone: submission.contactInfo?.phone || '',
    militaryStatus: submission.preQualification?.militaryStatus || '',
    branchOfService: submission.preQualification?.branchOfService || '',
    coverageAmount: submission.preQualification?.coverageAmount || '',
    state: submission.preQualification?.state || '',
    tobaccoUse: '',
    medicalConditions: '',
    height: '',
    weight: '',
    streetAddress: '',
    city: '',
    applicationState: '',
    zipCode: '',
    beneficiaryName: '',
    beneficiaryRelationship: '',
    vaNumber: '',
    serviceConnected: '',
    ssn: '',
    driversLicense: '',
    bankName: '',
    routingNumber: '',
    accountNumber: '',
    policyDate: '',
    quoteCoverage: '',
    quotePremium: '',
    quoteAge: '',
    quoteGender: '',
    quoteType: ''
  }

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
          <p>Phone: <a href="tel:180083847467">(800) VET-INSURANCE</a></p>
          <p>Website: <a href="https://veteranlegacylife.com">https://veteranlegacylife.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function generateAbandonmentRecoveryHTML(submission: any): string {
  const data: EmailData = {
    firstName: submission.contactInfo?.firstName || '',
    lastName: submission.contactInfo?.lastName || '',
    email: submission.contactInfo?.email || '',
    phone: submission.contactInfo?.phone || '',
    militaryStatus: submission.preQualification?.militaryStatus || '',
    branchOfService: submission.preQualification?.branchOfService || '',
    coverageAmount: submission.preQualification?.coverageAmount || '',
    state: submission.preQualification?.state || '',
    tobaccoUse: '',
    medicalConditions: '',
    height: '',
    weight: '',
    streetAddress: '',
    city: '',
    applicationState: '',
    zipCode: '',
    beneficiaryName: '',
    beneficiaryRelationship: '',
    vaNumber: '',
    serviceConnected: '',
    ssn: '',
    driversLicense: '',
    bankName: '',
    routingNumber: '',
    accountNumber: '',
    policyDate: '',
    quoteCoverage: '',
    quotePremium: '',
    quoteAge: '',
    quoteGender: '',
    quoteType: ''
  }

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
          
          <p>If you have any questions or need assistance, please contact us at (800) VET-INSURANCE.</p>
        </div>
        
        <div class="footer">
          <p><strong>Veteran Legacy Life</strong></p>
          <p>Phone: <a href="tel:180083847467">(800) VET-INSURANCE</a></p>
          <p>Website: <a href="https://veteranlegacylife.com">https://veteranlegacylife.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function generatePartialApplicationAlertHTML(submission: any): string {
  const data: EmailData = {
    firstName: submission.contactInfo?.firstName || '',
    lastName: submission.contactInfo?.lastName || '',
    email: submission.contactInfo?.email || '',
    phone: submission.contactInfo?.phone || '',
    militaryStatus: submission.preQualification?.militaryStatus || '',
    branchOfService: submission.preQualification?.branchOfService || '',
    coverageAmount: submission.preQualification?.coverageAmount || '',
    state: submission.preQualification?.state || '',
    tobaccoUse: submission.medicalAnswers?.tobaccoUse || '',
    medicalConditions: submission.medicalAnswers?.medicalConditions || '',
    height: submission.medicalAnswers?.height || '',
    weight: submission.medicalAnswers?.weight || '',
    streetAddress: submission.applicationData?.streetAddress || '',
    city: submission.applicationData?.city || '',
    applicationState: submission.applicationData?.state || '',
    zipCode: submission.applicationData?.zipCode || '',
    beneficiaryName: submission.applicationData?.beneficiaryName || '',
    beneficiaryRelationship: submission.applicationData?.beneficiaryRelationship || '',
    vaNumber: submission.applicationData?.vaNumber || '',
    serviceConnected: submission.applicationData?.serviceConnected || '',
    ssn: encryptSensitiveData(submission.applicationData?.ssn || ''),
    driversLicense: encryptSensitiveData(submission.applicationData?.driversLicense || ''),
    bankName: submission.applicationData?.bankName || '',
    routingNumber: encryptSensitiveData(submission.applicationData?.routingNumber || ''),
    accountNumber: encryptSensitiveData(submission.applicationData?.accountNumber || ''),
    policyDate: submission.quoteData?.policyDate || '',
    quoteCoverage: submission.quoteData?.coverage || '',
    quotePremium: submission.quoteData?.premium || '',
    quoteAge: submission.quoteData?.age || '',
    quoteGender: submission.quoteData?.gender || '',
    quoteType: submission.quoteData?.type || ''
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Partial Application Alert</title>
      <style>
        body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0; }
        .email-container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 20px; text-align: center; }
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
          <h2>⚠️ Partial Application Alert</h2>
          
          <div class="alert-box">
            <h3>Application Information</h3>
            <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Military Status:</strong> ${data.militaryStatus} - ${data.branchOfService}</p>
            <p><strong>Desired Coverage:</strong> ${data.coverageAmount}</p>
            <p><strong>State:</strong> ${data.state}</p>
          </div>
          
          <p>This applicant started the full application process but did not complete it. They have provided significant information and should be prioritized for follow-up.</p>
          
          <table class="data-table">
            <tr><th colspan="2">Application Progress</th></tr>
            <tr><td>Contact Information</td><td>✅ Complete</td></tr>
            <tr><td>Medical Information</td><td>✅ Complete</td></tr>
            <tr><td>Application Details</td><td>✅ Complete</td></tr>
            <tr><td>Quote Information</td><td>✅ Complete</td></tr>
            <tr><td>Final Submission</td><td>❌ Incomplete</td></tr>
          </table>
        </div>
        
        <div class="footer">
          <p><strong>Veteran Legacy Life</strong></p>
          <p>Phone: <a href="tel:180083847467">(800) VET-INSURANCE</a></p>
          <p>Website: <a href="https://veteranlegacylife.com">https://veteranlegacylife.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Helper function to encrypt sensitive data
function encryptSensitiveData(data: string): string {
  if (!data || data.length < 4) return data
  return '*'.repeat(data.length - 4) + data.slice(-4)
} 