# Google Apps Script Files - Complete Setup

This folder contains ALL the Google Apps Script files needed for the Veteran Life Insurance funnel.

## 📁 **File Structure**

### **Core Files (Required)**
- **`Code.gs`** - Main script with all core functions (doPost, doGet, doOptions, etc.)
- **`Config.gs`** - Configuration (CONFIG object and SHEET_COLUMNS mapping)
- **`EmailTemplates.gs`** - Email notification functions
- **`SMSTemplates.gs`** - SMS functions

### **Email Template Files (Required for Professional Emails)**
- **`EmailTemplateLoader.gs`** - Loads email templates
- **`leadNotification.gs`** - Lead notification email template
- **`applicationComplete.gs`** - Application completion email template
- **`abandonmentAlert.gs`** - Abandonment alert email template
- **`leadConfirmation.gs`** - Customer lead confirmation email template
- **`applicationConfirmation.gs`** - Customer application confirmation email template
- **`abandonmentRecovery.gs`** - Customer abandonment recovery email template

## 🚀 **Setup Instructions**

### **Step 1: Copy All Files to Google Apps Script**

1. Open your Google Apps Script project at [script.google.com](https://script.google.com)
2. Copy ALL files from this folder to your Google Apps Script project
3. Make sure to copy all 12 files (4 core + 8 email templates)

### **Step 2: Test Everything**

Run these functions in order:

1. **`validateSheetStructure()`** - Check if sheet has 51 columns
2. **`testScript()`** - Test basic functionality
3. **`testEmailTriggers()`** - Test email sending
4. **`runCompleteQATest()`** - Full system test

### **Step 3: Deploy**

1. Click **"Deploy"** → **"New deployment"**
2. Choose **"Web app"**
3. Set **Execute as**: "Me"
4. Set **Who has access**: "Anyone"
5. Click **"Deploy"**
6. Copy the **Web app URL**

## ✅ **Benefits of This Structure**

- **Everything in one place** - All files organized in one folder
- **Professional email templates** - Responsive HTML emails
- **SMS integration ready** - Functions for SMS alerts
- **51-column support** - Includes Drivers License field
- **Backward compatible** - Works exactly like old script but better organized

## 🧪 **Testing Functions**

### **Quick Tests:**
- `validateSheetStructure()` - Check sheet setup
- `testScript()` - Basic functionality
- `testEmailTriggers()` - Email testing
- `runCompleteQATest()` - Full QA test

### **Expected Results:**
- Sheet has 51 columns
- Emails are sent to admin email
- No "function not found" errors
- Test data is cleaned up automatically

## 📧 **Email Verification**

After running `testEmailTriggers()`, check your email for:
- **"🚨 NEW LEAD: John (Army)"**
- **"⚠️ LEAD ABANDONMENT: John (Stopped at Step 5)"**

## 🔧 **Troubleshooting**

### **"No active spreadsheet found"**
- Make sure script is bound to a Google Sheet

### **"Sheet structure invalid"**
- Run `fixSheetStructureNow()` to fix

### **"Email not sending"**
- Check `EMAIL.ADMIN` in `Config.gs`

### **"Function not found"**
- Make sure all 12 files are copied

## 🎯 **Ready for Production**

Once all tests pass:
1. Deploy as web app
2. Update URL in React app
3. Test with real data
4. Monitor logs

**All files are required for full functionality!** 🚀
