import { EMAIL_CONFIG } from '../config/emailConfig';
import type { LeadNotificationData, ApplicationCompleteData, AbandonmentAlertData } from '../config/emailConfig';

export class EmailTemplateService {
  private static readonly SHARED_STYLES = `
    body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; color: #374151; line-height: 1.6; }
    .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 30px 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; font-weight: bold; }
    .header p { margin: 10px 0 0 0; font-size: 14px; opacity: 0.9; }
    .content { padding: 30px 20px; }
    .alert-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .alert-box.success { background: #f0fdf4; border-color: #bbf7d0; }
    .alert-box.info { background: #eff6ff; border-color: #bfdbfe; }
    .alert-box h3 { margin: 0 0 15px 0; color: #dc2626; font-size: 18px; }
    .alert-box.success h3 { color: #16a34a; }
    .alert-box.info h3 { color: #2563eb; }
    .data-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }
    .data-table th, .data-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
    .data-table th { background-color: #f9fafb; font-weight: bold; color: #374151; }
    .data-table tr:hover { background-color: #f9fafb; }
    .section { margin: 30px 0; }
    .section h3 { color: #1e3a8a; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px; }
    .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
    .contact-item { background: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6; }
    .contact-item strong { display: block; color: #374151; margin-bottom: 5px; }
    .contact-item span { color: #6b7280; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; text-align: center; }
    .cta-button:hover { background: linear-gradient(135deg, #059669, #047857); }
    .footer { background-color: #1f2937; color: white; padding: 30px 20px; text-align: center; font-size: 14px; }
    .footer a { color: #60a5fa; text-decoration: none; }
    .footer a:hover { text-decoration: underline; }
    .sensitive-data { font-family: monospace; background-color: #f3f4f6; padding: 2px 4px; border-radius: 3px; color: #6b7280; }
    @media (max-width: 600px) { .email-container { margin: 0; box-shadow: none; } .content { padding: 20px 15px; } .contact-grid { grid-template-columns: 1fr; gap: 15px; } .data-table { font-size: 12px; } .data-table th, .data-table td { padding: 8px; } }
    @media print { .email-container { box-shadow: none; max-width: none; } .cta-button { background: #10b981 !important; color: white !important; } }
  `;

  private static readonly HEADER_TEMPLATE = `
    <div class="header">
      <h1>${EMAIL_CONFIG.COMPANY_NAME}</h1>
      <p>Veteran Life Insurance Specialists</p>
    </div>
  `;

  private static readonly FOOTER_TEMPLATE = `
    <div class="footer">
      <p><strong>${EMAIL_CONFIG.COMPANY_NAME}</strong></p>
      <p>Phone: <a href="tel:${EMAIL_CONFIG.SUPPORT_PHONE}">${EMAIL_CONFIG.SUPPORT_PHONE}</a></p>
      <p>Website: <a href="${EMAIL_CONFIG.LOGO_URL.replace('/public/logo.png', '')}">${EMAIL_CONFIG.LOGO_URL.replace('/public/logo.png', '')}</a></p>
      <p style="margin-top: 20px; font-size: 12px; opacity: 0.8;">
        This email was sent to you because you submitted information through our website.<br>
        If you have any questions, please contact us at ${EMAIL_CONFIG.SUPPORT_PHONE}.
      </p>
      <p style="font-size: 11px; opacity: 0.6; margin-top: 15px;">
        © ${new Date().getFullYear()} ${EMAIL_CONFIG.COMPANY_NAME}. All rights reserved.
      </p>
    </div>
  `;

  /**
   * Generate lead notification email HTML
   */
  static generateLeadNotificationHTML(data: LeadNotificationData): string {
    const template = this.loadTemplate('admin/leadNotification.html');
    
    return this.populateTemplate(template, {
      ...data,
      SHARED_STYLES: this.SHARED_STYLES,
      HEADER: this.HEADER_TEMPLATE,
      FOOTER: this.FOOTER_TEMPLATE,
      COMPANY_NAME: EMAIL_CONFIG.COMPANY_NAME,
      SUPPORT_PHONE: EMAIL_CONFIG.SUPPORT_PHONE,
      WEBSITE_URL: EMAIL_CONFIG.LOGO_URL.replace('/public/logo.png', ''),
      CURRENT_YEAR: new Date().getFullYear().toString(),
      submissionTime: new Date().toLocaleString(),
      medicalConditions: Array.isArray(data.medicalAnswers.medicalConditions) 
        ? data.medicalAnswers.medicalConditions.join(', ') 
        : data.medicalAnswers.medicalConditions || 'None'
    });
  }

  /**
   * Generate application complete email HTML
   */
  static generateApplicationCompleteHTML(data: ApplicationCompleteData): string {
    const template = this.loadTemplate('admin/applicationComplete.html');
    
    return this.populateTemplate(template, {
      ...data,
      SHARED_STYLES: this.SHARED_STYLES,
      HEADER: this.HEADER_TEMPLATE,
      FOOTER: this.FOOTER_TEMPLATE,
      COMPANY_NAME: EMAIL_CONFIG.COMPANY_NAME,
      SUPPORT_PHONE: EMAIL_CONFIG.SUPPORT_PHONE,
      WEBSITE_URL: EMAIL_CONFIG.LOGO_URL.replace('/public/logo.png', ''),
      CURRENT_YEAR: new Date().getFullYear().toString(),
      submissionTime: new Date().toLocaleString(),
      medicalConditions: Array.isArray(data.medicalAnswers.medicalConditions) 
        ? data.medicalAnswers.medicalConditions.join(', ') 
        : data.medicalAnswers.medicalConditions || 'None',
      // Application data
      streetAddress: data.applicationData?.address?.street || '',
      city: data.applicationData?.address?.city || '',
      applicationState: data.applicationData?.address?.state || '',
      zipCode: data.applicationData?.address?.zipCode || '',
      beneficiaryName: data.applicationData?.beneficiary?.name || '',
      beneficiaryRelationship: data.applicationData?.beneficiary?.relationship || '',
      vaNumber: data.applicationData?.vaInfo?.vaNumber || '',
      serviceConnected: data.applicationData?.vaInfo?.serviceConnected || '',
      driversLicense: data.applicationData?.driversLicense || '',
      ssn: data.applicationData?.ssn || '',
      bankName: data.applicationData?.banking?.bankName || '',
      routingNumber: data.applicationData?.banking?.routingNumber || '',
      accountNumber: data.applicationData?.banking?.accountNumber || '',
      policyDate: data.applicationData?.policyDate || '',
      coverageAmount: data.applicationData?.quoteData?.coverageAmount || '',
      monthlyPremium: data.applicationData?.quoteData?.monthlyPremium || '',
      userAge: data.applicationData?.quoteData?.userAge || '',
      userGender: data.applicationData?.quoteData?.userGender || '',
      quoteType: data.applicationData?.quoteData?.quoteType || ''
    });
  }

  /**
   * Generate abandonment alert email HTML
   */
  static generateAbandonmentAlertHTML(data: AbandonmentAlertData): string {
    const template = this.loadTemplate('admin/abandonmentAlert.html');
    
    return this.populateTemplate(template, {
      ...data,
      SHARED_STYLES: this.SHARED_STYLES,
      HEADER: this.HEADER_TEMPLATE,
      FOOTER: this.FOOTER_TEMPLATE,
      COMPANY_NAME: EMAIL_CONFIG.COMPANY_NAME,
      SUPPORT_PHONE: EMAIL_CONFIG.SUPPORT_PHONE,
      WEBSITE_URL: EMAIL_CONFIG.LOGO_URL.replace('/public/logo.png', ''),
      CURRENT_YEAR: new Date().getFullYear().toString(),
      submissionTime: new Date().toLocaleString(),
      medicalConditions: Array.isArray(data.medicalAnswers.medicalConditions) 
        ? data.medicalAnswers.medicalConditions.join(', ') 
        : data.medicalAnswers.medicalConditions || 'None',
      abandonmentReason: data.abandonmentReason || 'Not specified',
      timeSpent: data.timeSpent || 'Unknown'
    });
  }

  /**
   * Generate customer lead confirmation email HTML
   */
  static generateLeadConfirmationHTML(data: LeadNotificationData): string {
    const template = this.loadTemplate('customer/leadConfirmation.html');
    
    return this.populateTemplate(template, {
      ...data,
      SHARED_STYLES: this.SHARED_STYLES,
      HEADER: this.HEADER_TEMPLATE,
      FOOTER: this.FOOTER_TEMPLATE,
      COMPANY_NAME: EMAIL_CONFIG.COMPANY_NAME,
      SUPPORT_PHONE: EMAIL_CONFIG.SUPPORT_PHONE,
      WEBSITE_URL: EMAIL_CONFIG.LOGO_URL.replace('/public/logo.png', ''),
      CURRENT_YEAR: new Date().getFullYear().toString()
    });
  }

  /**
   * Generate customer application confirmation email HTML
   */
  static generateApplicationConfirmationHTML(data: ApplicationCompleteData): string {
    const template = this.loadTemplate('customer/applicationConfirmation.html');
    
    return this.populateTemplate(template, {
      ...data,
      SHARED_STYLES: this.SHARED_STYLES,
      HEADER: this.HEADER_TEMPLATE,
      FOOTER: this.FOOTER_TEMPLATE,
      COMPANY_NAME: EMAIL_CONFIG.COMPANY_NAME,
      SUPPORT_PHONE: EMAIL_CONFIG.SUPPORT_PHONE,
      WEBSITE_URL: EMAIL_CONFIG.LOGO_URL.replace('/public/logo.png', ''),
      CURRENT_YEAR: new Date().getFullYear().toString(),
      // Application data
      beneficiaryName: data.applicationData?.beneficiary?.name || '',
      beneficiaryRelationship: data.applicationData?.beneficiary?.relationship || '',
      policyDate: data.applicationData?.policyDate || '',
      coverageAmount: data.applicationData?.quoteData?.coverageAmount || '',
      monthlyPremium: data.applicationData?.quoteData?.monthlyPremium || '',
      quoteType: data.applicationData?.quoteData?.quoteType || ''
    });
  }

  /**
   * Generate customer abandonment recovery email HTML
   */
  static generateAbandonmentRecoveryHTML(data: LeadNotificationData): string {
    const template = this.loadTemplate('customer/abandonmentRecovery.html');
    
    return this.populateTemplate(template, {
      ...data,
      SHARED_STYLES: this.SHARED_STYLES,
      HEADER: this.HEADER_TEMPLATE,
      FOOTER: this.FOOTER_TEMPLATE,
      COMPANY_NAME: EMAIL_CONFIG.COMPANY_NAME,
      SUPPORT_PHONE: EMAIL_CONFIG.SUPPORT_PHONE,
      WEBSITE_URL: EMAIL_CONFIG.LOGO_URL.replace('/public/logo.png', ''),
      CURRENT_YEAR: new Date().getFullYear().toString()
    });
  }

  /**
   * Load template from file system (in production, this would fetch from server)
   * For now, we'll use the templates as string literals
   */
  private static loadTemplate(templatePath: string): string {
    // In a real implementation, this would load from the file system
    // For now, we'll return a placeholder that will be replaced by the actual template
    return `{{TEMPLATE_${templatePath.replace('/', '_').replace('.html', '').toUpperCase()}}}`;
  }

  /**
   * Generate a simple application confirmation email template
   */
  static generateSimpleApplicationConfirmationHTML(data: ApplicationCompleteData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Confirmation - ${EMAIL_CONFIG.COMPANY_NAME}</title>
        <style>
          ${this.SHARED_STYLES}
        </style>
      </head>
      <body>
        <div class="email-container">
          ${this.HEADER_TEMPLATE}
          
          <div class="content">
            <h2 style="color: #1e3a8a; margin-bottom: 20px;">Congratulations, ${data.contactInfo.firstName}!</h2>
            
            <div class="alert-box success">
              <h3>Your Application Has Been Submitted Successfully</h3>
              <p>Thank you for choosing ${EMAIL_CONFIG.COMPANY_NAME} for your life insurance needs. A licensed insurance representative will contact you within 24 hours to finalize your policy.</p>
            </div>

            <!-- Coverage Summary -->
            <div class="section">
              <h3>Your Coverage Summary</h3>
              <div style="background: linear-gradient(135deg, #fbbf24, #f59e0b); color: white; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0;">
                <div style="font-size: 14px; margin-bottom: 10px; opacity: 0.9;">Coverage Amount</div>
                <div style="font-size: 32px; font-weight: bold; margin-bottom: 10px;">$${data.applicationData.quoteData.coverageAmount.toLocaleString()}</div>
                <div style="font-size: 18px; font-weight: 500;">$${data.applicationData.quoteData.monthlyPremium.toFixed(2)} /month</div>
              </div>
            </div>

            <!-- Policy Details -->
            <div class="section">
              <h3>Policy Details</h3>
              <table class="data-table">
                <tr>
                  <th>Policy Type</th>
                  <td>${data.applicationData.quoteData.quoteType}</td>
                </tr>
                <tr>
                  <th>Age</th>
                  <td>${data.applicationData.quoteData.userAge}</td>
                </tr>
                <tr>
                  <th>Gender</th>
                  <td>${data.applicationData.quoteData.userGender === 'male' ? 'Male' : 'Female'}</td>
                </tr>
                <tr>
                  <th>Coverage Amount</th>
                  <td>$${data.applicationData.quoteData.coverageAmount.toLocaleString()}</td>
                </tr>
                <tr>
                  <th>Monthly Premium</th>
                  <td>$${data.applicationData.quoteData.monthlyPremium.toFixed(2)}</td>
                </tr>
              </table>
            </div>

            <!-- Next Steps -->
            <div class="section">
              <h3>What Happens Next?</h3>
              <ul style="line-height: 1.8; color: #374151;">
                <li><strong>Confirmation Email:</strong> You'll receive this confirmation within 5 minutes</li>
                <li><strong>Agent Contact:</strong> A licensed agent will call you within 24 hours</li>
                <li><strong>Policy Processing:</strong> Your policy will be processed and finalized</li>
                <li><strong>Coverage Start:</strong> Coverage will begin on your selected start date</li>
              </ul>
            </div>

            <!-- Contact Information -->
            <div class="section">
              <h3>Need Immediate Assistance?</h3>
              <div class="contact-grid">
                <div class="contact-item">
                  <strong>Phone</strong>
                  <span><a href="tel:${EMAIL_CONFIG.SUPPORT_PHONE}">${EMAIL_CONFIG.SUPPORT_PHONE}</a></span>
                </div>
                <div class="contact-item">
                  <strong>Hours</strong>
                  <span>Monday-Friday 8AM-6PM Pacific Time</span>
                </div>
              </div>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="tel:${EMAIL_CONFIG.SUPPORT_PHONE}" class="cta-button">Call Now</a>
            </div>
          </div>
          
          ${this.FOOTER_TEMPLATE}
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Populate template with data
   */
  private static populateTemplate(template: string, data: Record<string, any>): string {
    let result = template;
    
    // Replace all placeholders with actual values
    for (const [key, value] of Object.entries(data)) {
      const placeholder = `{{${key}}}`;
      result = result.replace(new RegExp(placeholder, 'g'), value?.toString() || '');
    }
    
    return result;
  }

  /**
   * Encrypt sensitive data (show only last 4 digits)
   */
  static encryptSensitiveData(data: string): string {
    if (!data || data.length < 4) return data;
    return '*'.repeat(data.length - 4) + data.slice(-4);
  }

  /**
   * Generate email subject lines
   */
  static generateSubject(type: 'lead' | 'application' | 'abandonment' | 'leadConfirmation' | 'applicationConfirmation' | 'abandonmentRecovery', data: any): string {
    switch (type) {
      case 'lead':
        return `🚨 NEW LEAD: ${data.contactInfo?.firstName || 'Unknown'} (${data.branchOfService || 'Veteran'})`;
      case 'application':
        return `🎉 COMPLETE APPLICATION: ${data.contactInfo?.firstName || 'Unknown'} - $${data.applicationData?.quoteData?.coverageAmount?.toLocaleString() || '0'} Coverage`;
      case 'abandonment':
        return `⚠️ LEAD ABANDONMENT: ${data.contactInfo?.firstName || 'Unknown'} (Stopped at Step ${data.currentStep})`;
      case 'leadConfirmation':
        return `Thank you for your interest in Veteran Life Insurance`;
      case 'applicationConfirmation':
        return `Your application has been submitted successfully`;
      case 'abandonmentRecovery':
        return `Complete your Veteran Life Insurance application`;
      default:
        return 'Veteran Life Insurance - Important Information';
    }
  }
} 