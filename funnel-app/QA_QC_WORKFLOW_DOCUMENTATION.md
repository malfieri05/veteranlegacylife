# QA/QC Workflow Documentation - Veteran Life Insurance Funnel

## **CORRECT FUNNEL FLOW (18 Steps Total)**

### **Step-by-Step Flow:**
```
1. State Selection
2. Military Status  
3. Branch of Service
4. Marital Status
5. Coverage Amount
6. Contact Information (Name, Email, Phone, Consents)
7. Date of Birth (Birthday component)
8. Tobacco Use
9. Medical Conditions
10. Height & Weight
11. Hospital Care
12. Diabetes Medication
13. Loading Screen (Pre-qualification processing)
14. Pre-Qualified Success Modal
15. IUL Quote Modal (when clicking "Complete Application")
16. Application Step 1 (Address, Beneficiary info)
17. Application Step 2 (SSN, Banking, Policy Date)  
18. Final Success Modal
```

## **COMPREHENSIVE TESTING SCENARIOS**

### **Test Scenario 1: Complete Application Flow**

#### **Step-by-Step Test:**
1. **Complete Pre-Qualification (Steps 1-14):**
   - State: `California`
   - Military Status: `Veteran` 
   - Branch: `Army`
   - Marital Status: `Married`
   - Coverage Amount: `$100,000`
   - First Name: `John`, Last Name: `TestLead`
   - Email: `john.testlead@example.com`
   - Phone: `(555) 123-4567`
   - Transactional Consent: ✅, Marketing Consent: ✅
   - DOB: `01/15/1985`
   - Tobacco: `No`, Medical Conditions: `None`
   - Height: `5'10"`, Weight: `180 lbs`
   - Hospital Care: `No`, Diabetes Meds: `No`
   
2. **IUL Quote Modal (Step 15):**
   - Verify quote displays correctly
   - Click "Lock in This Rate"
   
3. **Application Step 1 (Step 16):**
   - Street Address: `123 Test Street`
   - City: `Test City`
   - State: `CA`
   - ZIP Code: `90210`
   - Beneficiary Name: `Jane TestLead`
   - Beneficiary Relationship: `Spouse`
   - Click "Continue"
   
4. **Application Step 2 (Step 17):**
   - SSN: `123-45-6789`
   - Bank Name: `Test Bank`
   - Routing Number: `123456789`
   - Account Number: `987654321`
   - Policy Start Date: `02/01/2025`
   - Click "Submit Application"
   
5. **Final Success Modal (Step 18):**
   - Verify success message displays
   - Verify all data is correct

#### **CRITICAL: Complete Google Sheet Verification (All 50 Columns):**

**Columns 1-4 (Core):**
- [ ] Timestamp: `[Current DateTime]`
- [ ] Session ID: `[UUID format]`
- [ ] Status: `submitted`
- [ ] Last Activity: `[Current DateTime]`

**Columns 5-11 (Contact):**
- [ ] First Name: `John`
- [ ] Last Name: `TestLead`
- [ ] Email: `john.testlead@example.com`
- [ ] Phone: `(555) 123-4567`
- [ ] DOB: `01/15/1985`
- [ ] Transactional Consent: `TRUE`
- [ ] Marketing Consent: `TRUE`

**Columns 12-16 (Pre-qualification):**
- [ ] State: `California`
- [ ] Military Status: `Veteran`
- [ ] Branch: `Army`
- [ ] Marital Status: `Married`
- [ ] Coverage Amount: `$100,000`

**Columns 17-22 (Medical):**
- [ ] Tobacco Use: `No`
- [ ] Medical Conditions: `None`
- [ ] Height: `5'10"`
- [ ] Weight: `180 lbs`
- [ ] Hospital Care: `No`
- [ ] Diabetes Medication: `No`

**Columns 23-34 (Application) - Based on Steps 16-17:**
- [ ] Street Address: `123 Test Street`
- [ ] City: `Test City`
- [ ] Application State: `CA`
- [ ] ZIP Code: `90210`
- [ ] Beneficiary Name: `Jane TestLead`
- [ ] Beneficiary Relationship: `Spouse`
- [ ] VA Number: `(empty - not collected in current funnel)`
- [ ] Service Connected: `(empty - not collected in current funnel)`
- [ ] SSN: `123-45-6789`
- [ ] Bank Name: `Test Bank`
- [ ] Routing Number: `123456789`
- [ ] Account Number: `987654321`

**Columns 35-40 (Quote):**
- [ ] Policy Date: `02/01/2025` (from Step 17)
- [ ] Quote Coverage: `100000`
- [ ] Quote Premium: `[Calculated Amount]`
- [ ] Quote Age: `39`
- [ ] Quote Gender: `[From Form]`
- [ ] Quote Type: `IUL`

**Columns 41-48 (Tracking):**
- [ ] Current Step: `18`
- [ ] Step Name: `FinalSuccessModal`
- [ ] Form Type: `Application`
- [ ] User Agent: `[Browser Info]`
- [ ] Referrer: `[Page URL]`
- [ ] UTM Source: `[If Present]`
- [ ] UTM Medium: `[If Present]`
- [ ] UTM Campaign: `[If Present]`

**Columns 49-50 (Email Status):**
- [ ] Partial Email Sent: `FALSE`
- [ ] Completed Email Sent: `TRUE`

### **Test Scenario 2: Partial Lead (Pre-Qualification Only)**

#### **Step-by-Step Test:**
1. **Complete Steps 1-14 (Pre-Qualification):**
   - Use same data as Test Scenario 1
   - Stop at Pre-Qualified Success Modal
   - Do NOT click "Complete Application"

#### **Expected Google Sheet Verification:**
- [ ] Status: `pre-qualified`
- [ ] All pre-qualification data populated (columns 5-22)
- [ ] Application data empty (columns 23-40)
- [ ] Partial Email Sent: `TRUE`
- [ ] Completed Email Sent: `FALSE`

### **Test Scenario 3: Lead Partial (Medical Questions Only)**

#### **Step-by-Step Test:**
1. **Complete Steps 1-6 (Contact Info):**
   - Stop after providing contact information
   - Close browser or abandon

#### **Expected Google Sheet Verification:**
- [ ] Status: `active`
- [ ] Contact data populated (columns 5-11)
- [ ] Pre-qualification data empty (columns 12-16)
- [ ] Medical data empty (columns 17-22)
- [ ] Application data empty (columns 23-40)
- [ ] Partial Email Sent: `TRUE` (if phone provided)
- [ ] Completed Email Sent: `FALSE`

### **Test Scenario 4: Application Data Verification (Steps 16-17)**

#### **Test Step 16 Data Collection:**
1. **Address Information:**
   - Street Address: `456 Application St`
   - City: `App City`
   - State: `TX`
   - ZIP Code: `75201`
   - Verify appears in columns 23-26

2. **Beneficiary Information:**
   - Beneficiary Name: `John Beneficiary`
   - Relationship: `Son`
   - Verify appears in columns 27-28

#### **Test Step 17 Data Collection:**
1. **Financial Information:**
   - SSN: `987-65-4321`
   - Bank Name: `Application Bank`
   - Routing: `987654321`
   - Account: `123456789`
   - Policy Date: `03/01/2025`
   - Verify appears in columns 31-34 and 35

### **Test Scenario 5: Banking Information Security Test (Step 17)**

#### **Verify Sensitive Data Handling:**
- [ ] SSN appears in column 31 (from Step 17)
- [ ] Banking info appears in columns 32-34 (from Step 17)
- [ ] Policy date appears in column 35 (from Step 17)
- [ ] Verify data is properly secured
- [ ] Check for any data truncation
- [ ] Verify no data leakage in logs

### **Test Scenario 6: Abandonment Trigger Testing**

#### **Test A: Abandon Before Phone (No Email):**
1. Complete steps 1-4 (before contact info)
2. Close browser
3. Verify NO abandonment email sent
4. Verify session status is `active`

#### **Test B: Abandon After Phone (Trigger Email):**
1. Complete through step 6 (contact info with phone)
2. Close browser
3. Wait 30+ seconds
4. Trigger abandonment detection
5. Verify abandonment email sent
6. Verify session status is `phone_captured`

#### **Test C: Abandon After Pre-Qualified (Still Send Email):**
1. Complete through step 14 (pre-qualified)
2. Close browser before clicking "Complete Application"
3. Trigger abandonment detection
4. Verify abandonment email sent (user had phone)

#### **Test D: Complete Application (No Abandonment Email):**
1. Complete full application (step 18)
2. Trigger abandonment detection
3. Verify NO abandonment email sent
4. Verify only completion email sent

## **EMAIL VERIFICATION CHECKLISTS**

### **Complete Email Verification Checklist:**

#### **Admin Application Email:**
- [ ] Subject: `New React Funnel Application: John`
- [ ] Contains ALL application data including:
  - [ ] Address and beneficiary information from Step 16
  - [ ] SSN: `123-45-6789` from Step 17
  - [ ] Full banking information from Step 17
  - [ ] Policy start date from Step 17
  - [ ] Quote information from Step 15

#### **User Confirmation Email:**
- [ ] Subject: `Your application has been submitted successfully`
- [ ] Contains quote summary
- [ ] Contains next steps
- [ ] Contains correct company phone: `(800) VET-INSURANCE`

#### **Admin Lead Email:**
- [ ] Subject: `New React Funnel Lead: John`
- [ ] Contains pre-qualification data
- [ ] Contains contact information
- [ ] Contains medical information

#### **Abandonment Email:**
- [ ] Subject: `Lead Abandonment Alert: John`
- [ ] Contains all available data
- [ ] Only sent when phone number is captured
- [ ] Not sent for completed applications

## **AUTO-ADVANCE BEHAVIOR**

### **Steps with Auto-Advance:**
- [ ] **ContactInfo (Step 6):** Auto-advances when all required fields filled
- [ ] **Birthday (Step 7):** Auto-advances when all dropdowns selected
- [ ] **HeightWeight (Step 10):** Auto-advances when both height and weight selected
- [ ] **LoadingScreen (Step 13):** Auto-advances after processing
- [ ] **IULQuoteModal (Step 15):** Manual advance only (user must click "Lock in This Rate")

### **Steps with Manual Advance Only:**
- [ ] **StateSelection (Step 1):** Manual advance
- [ ] **MilitaryStatus (Step 2):** Manual advance
- [ ] **BranchOfService (Step 3):** Manual advance
- [ ] **MaritalStatus (Step 4):** Manual advance
- [ ] **CoverageAmount (Step 5):** Manual advance
- [ ] **TobaccoUse (Step 8):** Manual advance
- [ ] **MedicalConditions (Step 9):** Manual advance
- [ ] **HospitalCare (Step 11):** Manual advance
- [ ] **DiabetesMedication (Step 12):** Manual advance
- [ ] **PreQualifiedSuccess (Step 14):** Manual advance
- [ ] **ApplicationStep1 (Step 16):** Manual advance
- [ ] **ApplicationStep2 (Step 17):** Manual advance
- [ ] **FinalSuccessModal (Step 18):** Manual close

## **CONFIGURATION MANAGEMENT**

### **Global Configuration Files:**
- **PRIMARY SOURCE OF TRUTH**: `funnel-app/src/config/globalConfig.ts` - Main configuration for React app
- **Legacy**: `js/config.js` - Must be updated to match globalConfig.ts values
- **Google Apps Script**: `funnel-app/google-apps-script-react-funnel.js` - CONFIG section must match globalConfig.ts

**IMPORTANT**: All configuration values should be sourced from `globalConfig.ts`. Other config files must be manually synchronized with these values.

### **Configuration Validation Process:**
1. **Verify globalConfig.ts Values**: Check all configuration values in the primary config file
2. **Sync Legacy Config**: Update `js/config.js` to match globalConfig.ts
3. **Sync Google Apps Script**: Update CONFIG object in Google Apps Script
4. **Rebuild and Deploy**: Run `npm run build` and deploy updated files
5. **Test Integration**: Verify all systems use the same configuration values

## **⚠️ CRITICAL: Configuration Sync Requirements**

**BEFORE RUNNING ANY TESTS:**

1. **Verify globalConfig.ts is authoritative source**
2. **Update Google Apps Script CONFIG object** to match globalConfig.ts exactly
3. **Update legacy js/config.js** to match globalConfig.ts URL
4. **Rebuild React app**: `npm run build`
5. **Deploy all updated files**

**Common Sync Issues:**
- ❌ Admin emails don't match between globalConfig.ts and Google Apps Script  
- ❌ Google Apps Script URL outdated in legacy config files
- ❌ Sheet ID mismatch between configurations
- ❌ Phone number format inconsistent

**Verification Command:**
```javascript
// Run in Google Apps Script to verify CONFIG matches globalConfig.ts
Logger.log('Admin Email (should be lindsey08092@gmail.com):', CONFIG.EMAIL.ADMIN);
Logger.log('Sheet ID:', CONFIG.GOOGLE_SHEET.SHEET_ID);
Logger.log('Company Phone:', CONFIG.COMPANY.PHONE);
```

### **Global Configuration Variables:**
**NOTE: All configuration values are defined in `funnel-app/src/config/globalConfig.ts`**

- [ ] **Google Apps Script URL:** Verify matches `GLOBAL_CONFIG.GOOGLE_APPS_SCRIPT_URL`
- [ ] **Email From:** Verify matches `GLOBAL_CONFIG.EMAIL.FROM`
- [ ] **Email To:** Verify matches `GLOBAL_CONFIG.EMAIL.TO`
- [ ] **Google Sheet ID:** Verify matches `GLOBAL_CONFIG.GOOGLE_SHEET.SHEET_ID`
- [ ] **Company Phone:** Verify matches `GLOBAL_CONFIG.COMPANY.PHONE`
- [ ] **Company Phone (Dialable):** Verify matches `GLOBAL_CONFIG.COMPANY.PHONE_DIALABLE`

**Current Values (from globalConfig.ts):**
- Google Apps Script URL: `https://script.google.com/macros/s/AKfycbxcWggxWdEJzsSW_noiLBbfP6ovmTHWLRIDnWvc6jAj4-1HV_sEp9OBw4UCvXBsEu3M/exec`
- Admin Email: `lindsey08092@gmail.com`
- Email From: `lindsey08092@gmail.com`
- Email To: `lindsey08092@gmail.com`
- Email Reply-To: `lindsey08092@gmail.com`
- Google Sheet ID: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`
- Company Phone: `(800) VET-INSURANCE`
- Company Phone (Dialable): `180083847467`

### **Configuration Update Checklist:**
- [ ] **PRIMARY**: Update `globalConfig.ts` with new values (SINGLE SOURCE OF TRUTH)
- [ ] **SYNC**: Update `js/config.js` to match globalConfig.ts values
- [ ] **SYNC**: Update `google-apps-script-react-funnel.js` CONFIG section to match globalConfig.ts
- [ ] **VERIFY**: Ensure all three config files have identical values
- [ ] **TEST**: Test all email functionality
- [ ] **VERIFY**: Verify Google Sheet integration
- [ ] **UPDATE**: Update cache-busting version in `index.html`

## **GOOGLE APPS SCRIPT TESTING FUNCTIONS**

### **Available Test Functions:**
- [ ] `runCompleteQATest()` - Comprehensive end-to-end test
- [ ] `verifyTestDataInSheet(sessionId)` - Verify data in specific row
- [ ] `testAbandonmentScenarios()` - Test all abandonment scenarios
- [ ] `testAllEmailScenarios()` - Test all email functionality
- [ ] `fixSheetStructureNow()` - Fix sheet structure to 50 columns
- [ ] `cleanupTestSessions()` - Remove test data

### **Testing Commands:**
```javascript
// Run comprehensive QA test
runCompleteQATest()

// Fix sheet structure
fixSheetStructureNow()

// Test abandonment scenarios
testAbandonmentScenarios()

// Test all email scenarios
testAllEmailScenarios()

// Clean up test data
cleanupTestSessions()
```

## **SUCCESS CRITERIA**

### **Data Integrity:**
- [ ] **All 50 columns** populate with correct data
- [ ] **No duplicate rows** created
- [ ] **No data corruption** or loss
- [ ] **All data types** correct (dates, numbers, booleans)

### **Email Functionality:**
- [ ] **Admin emails** sent for all scenarios
- [ ] **User confirmation emails** sent for applications
- [ ] **Abandonment emails** sent only when appropriate
- [ ] **No email spam** or duplicate emails

### **Performance:**
- [ ] **Response time** < 10 seconds per submission
- [ ] **No timeouts** or script errors
- [ ] **Consistent behavior** across all scenarios
- [ ] **Error handling** works properly

### **Security:**
- [ ] **Sensitive data** properly handled
- [ ] **No data leakage** in logs
- [ ] **Secure transmission** to Google Apps Script
- [ ] **Proper validation** of all inputs

## **TROUBLESHOOTING**

### **Common Issues:**
1. **Missing Data:** Check column mapping in `buildUnifiedRowData()`
2. **Duplicate Rows:** Verify session ID handling
3. **Email Failures:** Check CONFIG email settings
4. **Sheet Structure:** Run `fixSheetStructureNow()`
5. **Performance Issues:** Check Google Apps Script quotas

### **Debug Commands:**
```javascript
// Check sheet structure
validateSheetStructure()

// Test specific function
testDoPost()

// Check email status
checkSessionEmailStatus(sessionId, 'completed')

// Verify data mapping
buildUnifiedRowData(testData, sessionId)
```

---

**Last Updated:** July 29, 2024  
**Version:** 2.0 (Comprehensive QA/QC)  
**Status:** Ready for Production Testing 