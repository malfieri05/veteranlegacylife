# Google Apps Script Setup & Testing Guide

## 🚀 **Step-by-Step Setup Instructions**

### **Step 1: Create the Files in Google Apps Script**

1. **Open your Google Apps Script project**
   - Go to [script.google.com](https://script.google.com)
   - Open your existing project or create a new one

2. **Create these 4 files** (copy the content from the files in this project):

#### **File 1: Code.gs** (Main Script)
```javascript
// Copy the entire content from funnel-app/Code.gs
// This contains all the core functions: doPost, doGet, doOptions, etc.
```

#### **File 2: Config.gs** (Configuration)
```javascript
// Copy the entire content from funnel-app/Config.gs
// This contains CONFIG object and SHEET_COLUMNS mapping
```

#### **File 3: EmailTemplates.gs** (Email Functions)
```javascript
// Copy the entire content from funnel-app/EmailTemplates.gs
// This contains all email notification functions
```

#### **File 4: SMSTemplates.gs** (SMS Functions)
```javascript
// Copy the entire content from funnel-app/SMSTemplates.gs
// This contains all SMS functions
```

### **Step 2: Add Email Template Files**

Copy these files from `funnel-app/google_scripts/` to your Google Apps Script project:

1. **EmailTemplateLoader.gs**
2. **leadNotification.gs**
3. **applicationComplete.gs**
4. **abandonmentAlert.gs**
5. **leadConfirmation.gs**
6. **applicationConfirmation.gs**
7. **abandonmentRecovery.gs**

## 🧪 **Testing Functions to Run**

### **Quick Test Functions**

#### **1. Basic Functionality Test**
```javascript
function testScript() {
  // This tests basic lead submission
  // Run this first to verify everything works
}
```

#### **2. Webhook Test**
```javascript
function testDoPost() {
  // This simulates a real POST request
  // Tests the main doPost function
}
```

#### **3. Sheet Structure Test**
```javascript
function validateSheetStructure() {
  // This checks if your sheet has the correct 51 columns
  // Run this to verify sheet setup
}
```

#### **4. Email Functionality Test**
```javascript
function testEmailTriggers() {
  // This tests email sending functionality
  // Will send test emails to your admin email
}
```

#### **5. Complete QA Test**
```javascript
function runCompleteQATest() {
  // This runs ALL tests in sequence
  // Best for comprehensive testing
}
```

### **Step-by-Step Testing Process**

#### **Phase 1: Basic Setup Testing**
1. **Run `validateSheetStructure()`**
   - Should return `true` if sheet is set up correctly
   - If `false`, run `fixSheetStructureNow()` to fix it

2. **Run `testScript()`**
   - Should log "Test result: [success response]"
   - This tests basic lead submission

3. **Run `testDoPost()`**
   - Should log "Test result: [JSON response]"
   - This tests the webhook endpoint

#### **Phase 2: Email Testing**
1. **Run `testEmailTriggers()`**
   - Should send test emails to your admin email
   - Check your email for test notifications

2. **Run `testAllEmailScenarios()`**
   - Tests all email types (lead, application, abandonment)
   - Comprehensive email testing

#### **Phase 3: Full System Testing**
1. **Run `runCompleteQATest()`**
   - Runs all tests in sequence
   - Cleans up test data automatically
   - Best for final verification

## 📧 **Email Testing Verification**

### **Check Your Email For:**
1. **Lead Notification Email** (from `testEmailTriggers()`)
   - Subject: "🚨 NEW LEAD: John (Army)"
   - Should contain lead details

2. **Application Completion Email** (from `testAllEmailScenarios()`)
   - Subject: "🎉 COMPLETE APPLICATION: App - $300,000 Coverage"
   - Should contain full application details

3. **Abandonment Alert Email** (from `testEmailTriggers()`)
   - Subject: "⚠️ LEAD ABANDONMENT: John (Stopped at Step 5)"
   - Should contain abandonment details

## 🔧 **Troubleshooting**

### **Common Issues & Solutions**

#### **Issue 1: "No active spreadsheet found"**
```javascript
// Solution: Make sure the script is bound to a Google Sheet
// 1. Open your Google Sheet
// 2. Go to Extensions > Apps Script
// 3. Copy the script files there
```

#### **Issue 2: "Sheet structure invalid"**
```javascript
// Solution: Run this function to fix the sheet
function fixSheetStructureNow() {
  // This will reset your sheet to 51 columns
  // WARNING: This will clear existing data
}
```

#### **Issue 3: "Email not sending"**
```javascript
// Solution: Check your CONFIG settings in Config.gs
// Make sure EMAIL.ADMIN is set to your email address
```

#### **Issue 4: "Function not found"**
```javascript
// Solution: Make sure all files are copied correctly
// Check that all 4 main files exist:
// - Code.gs
// - Config.gs  
// - EmailTemplates.gs
// - SMSTemplates.gs
```

## 📊 **Expected Test Results**

### **Successful Test Output:**
```
=== RUNNING COMPLETE QA TEST ===
Step 1: Testing sheet structure...
Sheet structure valid: true
Step 2: Testing lead submission...
Test result: {"success":true,"message":"Lead data captured successfully","sessionId":"..."}
Step 3: Testing email triggers...
=== EMAIL TRIGGER TEST COMPLETE ===
Step 4: Testing application completion...
=== APPLICATION COMPLETION TEST COMPLETE ===
Step 5: Testing abandonment scenarios...
=== ABANDONMENT SCENARIOS TEST COMPLETE ===
Step 6: Testing email scenarios...
=== ALL EMAIL SCENARIOS TEST COMPLETE ===
Step 7: Cleaning up test data...
✅ Cleaned up 5 test sessions
=== QA TEST COMPLETE ===
```

## 🎯 **Final Verification Checklist**

- [ ] **Sheet has 51 columns** (run `validateSheetStructure()`)
- [ ] **Basic submission works** (run `testScript()`)
- [ ] **Webhook responds** (run `testDoPost()`)
- [ ] **Emails are sent** (run `testEmailTriggers()`)
- [ ] **All functions exist** (no "function not found" errors)
- [ ] **Test data is cleaned up** (run `cleanupTestSessions()`)

## 🚀 **Ready for Production**

Once all tests pass:

1. **Deploy the script** as a web app
2. **Update the URL** in your React app
3. **Test with real data** from your funnel
4. **Monitor logs** for any issues

## 📞 **Need Help?**

If you encounter issues:

1. **Check the logs** in Google Apps Script console
2. **Run individual test functions** to isolate problems
3. **Verify file structure** matches the guide
4. **Check CONFIG settings** in Config.gs

The new structure is **100% backward compatible** and should work exactly like the old script, but with better organization and new features! 🎉 