# Google Sheets Integration Setup Guide

## 🚀 Quick Setup Steps

### Step 1: Deploy Google Apps Script

1. **Go to Google Apps Script**: https://script.google.com
2. **Create New Project** or open existing one
3. **Copy the code** from `google-apps-script.js` into the script editor
4. **Save the project** with a name like "Veteran Life Insurance Form Handler"

### Step 2: Deploy as Web App

1. Click **"Deploy"** > **"New deployment"**
2. Choose **"Web app"** as the type
3. Set **"Execute as"** to **"Me"**
4. Set **"Who has access"** to **"Anyone"**
5. Click **"Deploy"**
6. **Copy the Web App URL** (it will look like: `https://script.google.com/macros/s/AKfycbz.../exec`)

### Step 3: Update Your Website

1. Open `script.js` in your project
2. Find this line near the top:
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
3. Replace `'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE'` with your actual web app URL
4. Save the file

### Step 4: Test the Integration

1. **Refresh your local server** (if it's running)
2. **Fill out a form** on your website
3. **Submit the form**
4. **Check your Google Sheet** - data should appear in the sheet with ID: `1MvmvfqRBnt8fjplbRgFIi7BTnzcAGaMNeIDwCHGPis8`

## 📊 Google Sheet Structure

The script will automatically create these columns in your Google Sheet:

| Column | Data |
|--------|------|
| A | Timestamp |
| B | First Name |
| C | Last Name |
| D | Phone |
| E | Email |
| F | Date of Birth |
| G | State |
| H | Military Status |
| I | Branch of Service |
| J | Marital Status |
| K | Coverage Amount |
| L | Tobacco Use |
| M | Medical Conditions |
| N | Height |
| O | Weight |
| P | Hospital Care |
| Q | Diabetes Medication |
| R | Transactional Consent |
| S | Marketing Consent |
| T | Funnel Progress |

## 🔧 Troubleshooting

### Data Not Appearing in Sheet?

1. **Check the URL**: Make sure you copied the entire web app URL
2. **Check Permissions**: Ensure the web app is set to "Anyone" access
3. **Check Console**: Open browser developer tools and look for errors
4. **Test the Script**: Use the `testSheetAccess()` function in Google Apps Script

### Email Notifications Not Working?

1. **Check Email Address**: Verify `michaelalfieri.ffl@gmail.com` is correct
2. **Check Permissions**: Make sure the script has permission to send emails
3. **Check Spam Folder**: Notifications might go to spam

### Forms Not Submitting?

1. **Check Network Tab**: Look for failed requests in browser developer tools
2. **Check CORS**: The script handles CORS automatically
3. **Check Form Data**: Ensure all required fields are filled

## 📧 Email Notifications

The script will automatically send email notifications to `michaelalfieri.ffl@gmail.com` when:
- New leads are submitted
- Forms are completed
- Applications are submitted

## 🔒 Security Notes

- The web app URL is public but only accepts POST requests
- Form data is validated before processing
- Personal information is handled securely
- Email notifications include a link to view all leads in the sheet

## 🚀 Next Steps

After setup:
1. **Test all forms** on your website
2. **Verify data** appears in Google Sheets
3. **Check email notifications** are working
4. **Customize the sheet** layout if needed
5. **Set up additional automation** if required

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify the Google Apps Script URL is correct
3. Test the `testSheetAccess()` function in Google Apps Script
4. Check that your Google Sheet ID is correct in the script

---

**Your forms are now connected to Google Sheets!** 🎉 