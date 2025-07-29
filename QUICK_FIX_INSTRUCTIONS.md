# 🚀 QUICK FIX: No More CORS Errors!

## The Problem
- CORS errors happen because browsers send "preflight" requests for JSON data
- We switched to URL-encoded data to avoid this
- But the Google Apps Script needs to be updated to handle URL-encoded data

## The Solution
**Redeploy your Google Apps Script with the updated code:**

1. **Open Google Apps Script Editor**
   - Go to: https://script.google.com/
   - Open your project: "Veteran Legacy Life Funnel"

2. **Replace the Main.gs code**
   - Copy ALL the code from `funnel-app/google_scripts/Main.gs`
   - Replace everything in your Google Apps Script editor
   - Save (Ctrl+S or Cmd+S)

3. **Deploy as Web App**
   - Click "Deploy" → "New deployment"
   - Choose "Web app"
   - Set "Execute as" to "Me"
   - Set "Who has access" to "Anyone"
   - Click "Deploy"

4. **Copy the new URL**
   - Copy the new deployment URL
   - Update it in `funnel-app/src/config/globalConfig.ts`

5. **Test it**
   - Run: `node test-url-encoded.js`
   - If it works, the React app will work too!

## What Changed
- ✅ **Frontend**: Now sends URL-encoded data (no CORS preflight)
- ✅ **Backend**: Now handles both JSON and URL-encoded data
- ✅ **No CORS headers needed** - URL-encoded avoids the issue entirely

**This will fix the CORS error permanently!** 🎉 