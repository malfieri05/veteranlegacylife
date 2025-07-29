# Email Template Organization

This document explains the new email template organization system for the Veteran Life Insurance funnel application.

## 📁 Project Structure

```
funnel-app/
├── src/
│   ├── config/
│   │   ├── api.ts (existing)
│   │   ├── globalConfig.ts (existing)
│   │   └── emailConfig.ts (NEW - email-specific config)
│   ├── templates/
│   │   ├── email/
│   │   │   ├── admin/
│   │   │   │   ├── leadNotification.html
│   │   │   │   ├── applicationComplete.html
│   │   │   │   └── abandonmentAlert.html
│   │   │   ├── customer/
│   │   │   │   ├── leadConfirmation.html
│   │   │   │   ├── applicationConfirmation.html
│   │   │   │   └── abandonmentRecovery.html
│   │   │   └── shared/
│   │   │       ├── header.html
│   │   │       ├── footer.html
│   │   │       └── styles.css
│   │   └── sms/
│   │       ├── adminAlerts.ts
│   │       └── customerMessages.ts
│   └── services/
│       └── emailService.ts (NEW - email template logic)
├── scripts/
│   └── buildEmailTemplates.js (NEW - compiles templates)
├── google-apps-script-templates/ (GENERATED)
│   ├── leadNotification.gs
│   ├── applicationComplete.gs
│   ├── abandonmentAlert.gs
│   ├── leadConfirmation.gs
│   ├── applicationConfirmation.gs
│   ├── abandonmentRecovery.gs
│   ├── EmailTemplateLoader.gs
│   └── README.md
└── google-apps-script-react-funnel.js (existing)
```

## 🎯 Benefits of This Organization

1. **Centralized Config**: Email settings reference your existing `globalConfig.ts`
2. **Version Control**: Email templates are in your React project, not buried in Google Apps Script
3. **Professional Design**: Proper HTML/CSS email templates with responsive design
4. **Easy Updates**: Change templates in your IDE, rebuild, and deploy
5. **Type Safety**: TypeScript interfaces for all email data
6. **Testing**: Can preview email templates locally before deploying
7. **Reusability**: Shared components (header, footer, styles) across all emails

## 📧 Email Templates

### Admin Templates (Notifications to Staff)

#### 1. Lead Notification (`admin/leadNotification.html`)
- **Trigger**: When a user completes pre-qualification
- **Recipients**: Admin team
- **Content**: Contact info, military details, medical info, follow-up instructions

#### 2. Application Complete (`admin/applicationComplete.html`)
- **Trigger**: When a user completes the full application
- **Recipients**: Admin team
- **Content**: Complete application data including Drivers License, SSN, banking info
- **Features**: Sensitive data encryption (last 4 digits only)

#### 3. Abandonment Alert (`admin/abandonmentAlert.html`)
- **Trigger**: When a user abandons after providing contact info
- **Recipients**: Admin team
- **Content**: Abandonment details, recovery opportunity

### Customer Templates (Confirmations to Users)

#### 1. Lead Confirmation (`customer/leadConfirmation.html`)
- **Trigger**: When a user completes pre-qualification
- **Recipients**: Customer
- **Content**: Thank you message, next steps, contact info

#### 2. Application Confirmation (`customer/applicationConfirmation.html`)
- **Trigger**: When a user completes the full application
- **Recipients**: Customer
- **Content**: Application summary, quote details, next steps

#### 3. Abandonment Recovery (`customer/abandonmentRecovery.html`)
- **Trigger**: When a user abandons after providing contact info
- **Recipients**: Customer
- **Content**: Recovery message, saved progress, completion encouragement

## 📱 SMS Templates

### Admin Alerts (`sms/adminAlerts.ts`)
- Lead notifications
- Application completions
- Abandonment alerts
- Daily summaries
- Urgent alerts

### Customer Messages (`sms/customerMessages.ts`)
- Lead confirmations
- Application confirmations
- Abandonment recovery
- Appointment reminders
- Follow-up messages
- Policy updates

## 🛠️ Usage

### 1. Building Email Templates

```bash
# Build email templates for Google Apps Script
npm run build:emails

# Build everything (React app + email templates)
npm run build:all
```

### 2. Using Email Templates in Google Apps Script

After building, copy the generated `.gs` files to your Google Apps Script project:

```javascript
// In your Google Apps Script
function sendLeadNotification(data) {
  const html = loadEmailTemplate('leadNotification', {
    firstName: data.contactInfo.firstName,
    lastName: data.contactInfo.lastName,
    email: data.contactInfo.email,
    phone: data.contactInfo.phone,
    // ... other data
  });
  
  MailApp.sendEmail({
    to: CONFIG.EMAIL.ADMIN,
    subject: '🚨 NEW LEAD: ' + data.contactInfo.firstName,
    htmlBody: html
  });
}
```

### 3. Using Email Service in React

```typescript
import { EmailTemplateService } from '../services/emailService';

// Generate email HTML
const emailHTML = EmailTemplateService.generateLeadNotificationHTML(leadData);

// Generate subject line
const subject = EmailTemplateService.generateSubject('lead', leadData);
```

## 🔧 Configuration

### Email Configuration (`src/config/emailConfig.ts`)

```typescript
export const EMAIL_CONFIG = {
  ADMIN_EMAIL: globalConfig.googleAppsScript.adminEmail,
  FROM_EMAIL: 'noreply@veteranlegacylife.com',
  COMPANY_NAME: globalConfig.company.name,
  SUPPORT_PHONE: globalConfig.company.phone,
  // ... styling and other settings
};
```

### SMS Configuration

```typescript
export const SMS_CONFIG = {
  FROM_PHONE: '+1234567890', // Your Twilio number
  MAX_LENGTH: 160,
  OPT_OUT_TEXT: 'Reply STOP to opt out'
};
```

## 🎨 Styling

All email templates use shared CSS styles (`src/templates/email/shared/styles.css`) with:

- **Responsive Design**: Works on mobile and desktop
- **Professional Colors**: Navy blue, light blue, green accents
- **Accessibility**: High contrast, readable fonts
- **Brand Consistency**: Matches your company branding

## 🔒 Security

- **Sensitive Data Encryption**: SSN, banking info, driver's license show only last 4 digits
- **No Logging**: Sensitive data is never logged to console
- **Secure Transmission**: All data encrypted in transit

## 📋 Template Variables

### Common Variables
- `{{firstName}}` - User's first name
- `{{lastName}}` - User's last name
- `{{email}}` - User's email address
- `{{phone}}` - User's phone number
- `{{militaryStatus}}` - Veteran status
- `{{branchOfService}}` - Military branch
- `{{coverageAmount}}` - Requested coverage amount

### Application-Specific Variables
- `{{driversLicense}}` - Driver's license number (encrypted)
- `{{ssn}}` - Social Security Number (encrypted)
- `{{bankName}}` - Bank name
- `{{routingNumber}}` - Routing number (encrypted)
- `{{accountNumber}}` - Account number (encrypted)
- `{{monthlyPremium}}` - Monthly premium amount
- `{{beneficiaryName}}` - Beneficiary name
- `{{beneficiaryRelationship}}` - Relationship to beneficiary

## 🚀 Deployment

### 1. Build Templates
```bash
npm run build:emails
```

### 2. Copy to Google Apps Script
Copy all `.gs` files from `google-apps-script-templates/` to your Google Apps Script project.

### 3. Update Your Google Apps Script
Replace the old email functions with calls to the new template system:

```javascript
// OLD WAY
function sendLeadNotification(data) {
  const body = `
    <h2>New Lead</h2>
    <p>Name: ${data.firstName}</p>
    // ... more HTML
  `;
  MailApp.sendEmail({...});
}

// NEW WAY
function sendLeadNotification(data) {
  const html = loadEmailTemplate('leadNotification', data);
  MailApp.sendEmail({
    to: CONFIG.EMAIL.ADMIN,
    subject: EmailTemplateService.generateSubject('lead', data),
    htmlBody: html
  });
}
```

## 🧪 Testing

### Preview Templates Locally
You can preview email templates by running the build script and opening the generated HTML files.

### Test in Google Apps Script
Use the test functions in your Google Apps Script to verify email delivery:

```javascript
function testEmailTemplates() {
  const testData = {
    contactInfo: {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '555-1234'
    },
    // ... other test data
  };
  
  const html = loadEmailTemplate('leadNotification', testData);
  Logger.log('Email HTML generated successfully');
}
```

## 📞 Support

For questions about the email template system:
- Check the generated `README.md` in `google-apps-script-templates/`
- Review the template files in `src/templates/email/`
- Test with the provided test functions

## 🔄 Updates

To update email templates:
1. Edit the HTML files in `src/templates/email/`
2. Run `npm run build:emails`
3. Copy the new `.gs` files to Google Apps Script
4. Test the updated templates

This organization provides a professional, maintainable, and secure email system that integrates seamlessly with your existing React funnel application. 