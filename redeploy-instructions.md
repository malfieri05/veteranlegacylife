# Google Apps Script Redeployment Instructions

## To fix the CORS error, you need to redeploy the Google Apps Script:

1. **Open Google Apps Script Editor**
   - Go to: https://script.google.com/
   - Open your project: "Veteran Legacy Life Funnel"

2. **Copy the updated code**
   - The Main.gs file has been updated with CORS headers
   - Copy all the code from `funnel-app/google_scripts/Main.gs`

3. **Replace the existing code**
   - In the Google Apps Script editor, replace all the code in Main.gs
   - Save the project (Ctrl+S or Cmd+S)

4. **Deploy as Web App**
   - Click "Deploy" → "New deployment"
   - Choose "Web app"
   - Set "Execute as" to "Me"
   - Set "Who has access" to "Anyone"
   - Click "Deploy"

5. **Copy the new URL**
   - Copy the new deployment URL
   - Update it in `funnel-app/src/config/globalConfig.ts`

6. **Rebuild the React app**
   ```bash
   cd funnel-app
   npm run build
   cp dist/veteran-funnel.iife.js ../veteran-funnel.iife.js
   cp dist/veteran-funnel.css ../veteran-funnel.css
   ```

## The CORS headers added:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

This will allow requests from localhost to work properly. 