# Google Apps Script Deployment Guide

## ✅ **ULTRA-CONSOLIDATED FILES FOR EASY DEPLOYMENT**

You now have only **2 files** to deploy instead of 12!

### **📁 Files to Deploy:**

1. **`Main.gs`** - All core functions + configuration
2. **`Templates.gs`** - All email and SMS functions organized by notification type

---

## 🚀 **DEPLOYMENT STEPS**

### **Step 1: Open Google Apps Script**
1. Go to [script.google.com](https://script.google.com)
2. Create a new project or open your existing project
3. Delete any old files

### **Step 2: Add the Files**
1. **Add `Main.gs`**:
   - Click the "+" next to "Files"
   - Select "Script"
   - Name it "Main"
   - Copy and paste the contents of `Main.gs`

2. **Add `Templates.gs`**:
   - Click the "+" next to "Files"
   - Select "Script"
   - Name it "Templates"
   - Copy and paste the contents of `Templates.gs`

### **Step 3: Test the Setup**
1. Run `testGoogleSheetHeaders()` to verify sheet structure
2. Run `testNewEntriesAndEmails()` to test all functionality

### **Step 4: Deploy as Web App**
1. Click "Deploy" → "New deployment"
2. Choose "Web app"
3. Set access to "Anyone"
4. Click "Deploy"
5. Copy the Web App URL

---

## 📧 **NOTIFICATION TYPES ORGANIZED**

### **1. NEW LEAD Notifications:**
- ✅ `sendLeadNotification()` - Admin alert + Customer confirmation
- ✅ `sendLeadConfirmation()` - Customer thank you email
- ✅ `sendLeadNotificationSMS()` - Admin SMS alert

### **2. PARTIAL LEAD Notifications:**
- ✅ `sendPartialLeadEmail()` - Admin abandonment alert + Customer recovery
- ✅ `sendAbandonmentRecoveryEmail()` - Customer follow-up email
- ✅ `sendAbandonmentAlertSMS()` - Admin SMS alert

### **3. COMPLETE APPLICATION Notifications:**
- ✅ `sendApplicationNotification()` - Admin alert + Customer confirmation
- ✅ `sendApplicationConfirmation()` - Customer success email
- ✅ `sendApplicationCompleteSMS()` - Admin SMS alert

---

## 🧪 **TESTING FUNCTIONS**

### **`testGoogleSheetHeaders()`**
- Validates 51-column structure
- Checks header names and formatting
- Auto-fixes any issues

### **`testNewEntriesAndEmails()`**
- Creates test NEW LEAD entry
- Creates test COMPLETE APPLICATION entry
- Creates test PARTIAL LEAD entry
- Triggers all email notifications

---

## ⚙️ **CONFIGURATION**

All settings are in `Main.gs`:
- **Admin Email**: `lindsey08092@gmail.com`
- **Company Info**: Veteran Legacy Life
- **Sheet ID**: Your Google Sheet ID
- **51 Columns**: Including Drivers License field

---

## 🎯 **WHAT'S INCLUDED**

### **Core Functions:**
- ✅ Webhook handlers (`doPost`, `doGet`, `doOptions`)
- ✅ Submission handlers (NEW LEAD, COMPLETE APPLICATION, PARTIAL LEAD)
- ✅ Sheet management (51 columns with Drivers License)
- ✅ Session tracking and email status

### **Email Templates:**
- ✅ Professional HTML emails with responsive design
- ✅ Sensitive data encryption (SSN, banking info, drivers license)
- ✅ Organized by notification type:
  - **NEW LEAD**: Admin alert + Customer confirmation
  - **PARTIAL LEAD**: Abandonment alert + Recovery email
  - **COMPLETE APPLICATION**: Admin alert + Customer confirmation

### **SMS Functions:**
- ✅ SMS alerts for all notification types
- ✅ Phone validation and message truncation
- ✅ Ready for Twilio integration

### **Testing:**
- ✅ Sheet structure validation
- ✅ Complete functionality testing
- ✅ Email and SMS testing

---

## 🚨 **IMPORTANT NOTES**

1. **Only 2 files** instead of 12 - ultra-easy to manage!
2. **Organized by notification type** - clear structure
3. **All essential functions** are included
4. **Professional email templates** with proper styling
5. **Drivers License support** (51 columns)
6. **Sensitive data encryption** for SSN, banking info, etc.

**You're ready to deploy with just 2 files!** 🚀 