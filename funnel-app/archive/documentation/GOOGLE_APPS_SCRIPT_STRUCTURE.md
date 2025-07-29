# Google Apps Script Project Structure

This document explains the new organized Google Apps Script structure for the Veteran Life Insurance funnel application.

## 📁 New File Structure

```
Google Apps Script Project:
├── Code.gs (MAIN SCRIPT - core functions and entry points)
├── Config.gs (CONFIGURATION - CONFIG object and SHEET_COLUMNS)
├── EmailTemplates.gs (EMAIL FUNCTIONS - all email notifications)
├── SMSTemplates.gs (SMS FUNCTIONS - SMS alerts and messages)
└── [Generated Template Files] (from React app build)
    ├── leadNotification.gs
    ├── applicationComplete.gs
    ├── abandonmentAlert.gs
    ├── leadConfirmation.gs
    ├── applicationConfirmation.gs
    ├── abandonmentRecovery.gs
    ├── EmailTemplateLoader.gs
    └── README.md
```

## 🔄 Migration from Old Structure

### Before (Single File)
```
google-apps-script-react-funnel.js (2139 lines)
├── CONFIG object
├── SHEET_COLUMNS mapping
├── doPost, doGet, doOptions
├── Email functions
├── SMS functions
├── Sheet management
└── Testing functions
```

### After (Organized Files)
```
Code.gs (Main entry points and core logic)
├── doPost(e) - Main webhook handler
├── doGet(e) - GET request handler
├── doOptions(e) - OPTIONS request handler
├── handleLeadSubmission()
├── handleApplicationSubmission()
├── handlePartialSubmission()
├── handleLeadPartialSubmission()
├── handleAbandonmentDetection()
├── Sheet management functions
└── Data building functions

Config.gs (Configuration)
├── CONFIG object
└── SHEET_COLUMNS mapping

EmailTemplates.gs (Email functions)
├── sendLeadNotification()
├── sendApplicationNotification()
├── sendPartialLeadEmail()
├── sendLeadPartialNotification()
└── Helper functions

SMSTemplates.gs (SMS functions)
├── Admin SMS alerts
├── Customer SMS messages
└── Helper functions
```

## 🚀 Benefits of New Structure

1. **Modularity**: Each file has a specific purpose
2. **Maintainability**: Easier to find and update specific functions
3. **Scalability**: Easy to add new features without cluttering main file
4. **Testing**: Can test individual components separately
5. **Collaboration**: Multiple developers can work on different files
6. **Version Control**: Better diff tracking and conflict resolution

## 📋 File Descriptions

### Code.gs (Main Script)
- **Purpose**: Core webhook handlers and business logic
- **Key Functions**: `doPost`, `doGet`, `doOptions`, submission handlers
- **Dependencies**: References `CONFIG` and `SHEET_COLUMNS` from `Config.gs`
- **Size**: ~800 lines (reduced from 2139)

### Config.gs (Configuration)
- **Purpose**: Centralized configuration management
- **Key Content**: `CONFIG` object, `SHEET_COLUMNS` mapping
- **Benefits**: Easy to update settings without touching main logic
- **Size**: ~100 lines

### EmailTemplates.gs (Email Functions)
- **Purpose**: All email notification logic
- **Key Functions**: Lead notifications, application completions, abandonment alerts
- **Integration**: Uses template system from React app
- **Size**: ~300 lines

### SMSTemplates.gs (SMS Functions)
- **Purpose**: SMS notifications and alerts
- **Key Functions**: Admin alerts, customer messages, follow-ups
- **Features**: Phone validation, message truncation, opt-out handling
- **Size**: ~400 lines

## 🔧 Implementation Steps

### Step 1: Create New Files in Google Apps Script
1. Open your Google Apps Script project
2. Create new files: `Config.gs`, `EmailTemplates.gs`, `SMSTemplates.gs`
3. Copy the content from the files created in this project

### Step 2: Update Main Script
1. Rename your current `google-apps-script-react-funnel.js` to `Code.gs`
2. Remove the `CONFIG` object and `SHEET_COLUMNS` (now in `Config.gs`)
3. Remove email functions (now in `EmailTemplates.gs`)
4. Remove SMS functions (now in `SMSTemplates.gs`)

### Step 3: Add Generated Templates
1. Run `npm run build:emails` in your React app
2. Copy all `.gs` files from `google-apps-script-templates/` to your Google Apps Script project
3. These files contain the compiled HTML email templates

### Step 4: Test the New Structure
1. Deploy the new structure
2. Test each function to ensure it works correctly
3. Verify email templates are working

## 📧 Email Template Integration

The new structure integrates with the email template system:

```javascript
// In EmailTemplates.gs
function sendLeadNotification(data) {
  // Build email data
  const emailData = { /* ... */ };
  
  // Use template system
  const html = loadEmailTemplate('leadNotification', emailData);
  
  // Send email
  MailApp.sendEmail({
    to: CONFIG.EMAIL.ADMIN,
    subject: generateSubject('lead', data),
    htmlBody: html
  });
}
```

## 📱 SMS Integration

The SMS functions are ready for integration with your SMS service:

```javascript
// In SMSTemplates.gs
function sendLeadNotificationSMS(data) {
  const message = `🚨 NEW LEAD: ${name} (${branch}) - ${coverage} coverage. Phone: ${phone}. Call within 24h. ${SMS_CONFIG.OPT_OUT_TEXT}`;
  
  // Implement your SMS service here
  // sendSMS(CONFIG.EMAIL.ADMIN, message);
}
```

## 🔒 Security Features

- **Sensitive Data Encryption**: SSN, banking info, driver's license show only last 4 digits
- **No Logging**: Sensitive data is never logged to console
- **Template Security**: Email templates handle sensitive data properly

## 🧪 Testing

### Test Individual Files
```javascript
// Test Config.gs
function testConfig() {
  Logger.log('CONFIG:', CONFIG);
  Logger.log('SHEET_COLUMNS:', SHEET_COLUMNS);
}

// Test EmailTemplates.gs
function testEmailTemplates() {
  const testData = { /* test data */ };
  sendLeadNotification(testData);
}

// Test SMSTemplates.gs
function testSMSTemplates() {
  const testData = { /* test data */ };
  sendLeadNotificationSMS(testData);
}
```

### Test Integration
```javascript
// Test full flow
function testFullFlow() {
  const testData = {
    formType: 'Lead',
    formData: JSON.stringify({
      contactInfo: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '555-1234'
      }
    })
  };
  
  // This should trigger email and SMS
  doPost({ postData: { contents: JSON.stringify(testData) } });
}
```

## 📊 Performance Benefits

1. **Faster Loading**: Smaller individual files load faster
2. **Better Caching**: Google Apps Script can cache individual files
3. **Reduced Memory**: Only load what you need
4. **Easier Debugging**: Isolate issues to specific files

## 🔄 Migration Checklist

- [ ] Create `Config.gs` with CONFIG and SHEET_COLUMNS
- [ ] Create `EmailTemplates.gs` with email functions
- [ ] Create `SMSTemplates.gs` with SMS functions
- [ ] Update `Code.gs` to remove moved functions
- [ ] Add generated email template files
- [ ] Test all functions work correctly
- [ ] Deploy new structure
- [ ] Verify emails and SMS work
- [ ] Update documentation

## 🎯 Next Steps

1. **Deploy the new structure** to your Google Apps Script project
2. **Test all functions** to ensure they work correctly
3. **Integrate SMS service** (Twilio, etc.) in `SMSTemplates.gs`
4. **Customize email templates** as needed
5. **Set up monitoring** for email and SMS delivery

This new structure provides a clean, maintainable, and scalable foundation for your Veteran Life Insurance funnel application! 🎉 