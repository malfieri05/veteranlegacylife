# 🔧 Session ID Fix - Deployment Instructions

## 🎯 **Problem Fixed:**
- Google Apps Script was generating its own session IDs instead of using frontend session IDs
- This caused multiple rows per funnel session instead of updating existing rows

## ✅ **What Was Fixed:**

### **Frontend (funnelStore.ts):**
- ✅ Session ID now generated only when funnel starts (`openModal()`)
- ✅ Session ID cleared when funnel resets (`reset()`)
- ✅ Each funnel session has one unique session ID throughout

### **Backend (Main.gs):**
- ✅ Removed automatic session ID generation in `doPost()`
- ✅ Now extracts session ID from frontend data
- ✅ Added `findRowBySessionId()` function to find existing rows
- ✅ Updated all submission functions to update existing rows instead of creating new ones

## 🚀 **Deployment Steps:**

### **1. Deploy Updated Google Apps Script:**
1. Go to [Google Apps Script](https://script.google.com/)
2. Open your project
3. Replace the content of `Main.gs` with the updated code
4. Click **Deploy** → **New deployment**
5. Choose **Web app** as type
6. Set **Execute as**: `Me`
7. Set **Who has access**: `Anyone`
8. Click **Deploy**
9. Copy the new deployment URL

### **2. Update Frontend API URL:**
1. Open `funnel-app/src/config/globalConfig.ts`
2. Update the `GOOGLE_APPS_SCRIPT` URL to your new deployment URL
3. Run `./build.sh` to rebuild the frontend

### **3. Test the Fix:**
1. Run the test script: `node test-session-id-fix.js`
2. Check your Google Sheet - you should see only ONE row per session ID
3. Go through the funnel manually - each session should create only one row

## 🎉 **Expected Result:**
- ✅ **One row per funnel session** in Google Sheets
- ✅ **No more duplicate rows** with same session ID
- ✅ **Clean, organized data** structure
- ✅ **Proper session tracking** throughout the funnel

## 📝 **Test the Fix:**
After deployment, run:
```bash
node test-session-id-fix.js
```

This will test that the same session ID creates only one row in your Google Sheet. 