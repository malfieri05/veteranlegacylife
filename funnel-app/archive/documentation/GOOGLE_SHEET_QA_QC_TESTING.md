# Google Sheet QA/QC Testing Documentation

## **PRE-TEST SETUP**

### **Current Configuration Verification:**
**NOTE: All configuration values are defined in `funnel-app/src/config/globalConfig.ts`**

- [ ] **Google Apps Script URL:** Verify matches `GLOBAL_CONFIG.GOOGLE_APPS_SCRIPT_URL`
- [ ] **Email From:** Verify matches `GLOBAL_CONFIG.EMAIL.FROM`  
- [ ] **Email To:** Verify matches `GLOBAL_CONFIG.EMAIL.TO`
- [ ] **Google Sheet ID:** Verify matches `GLOBAL_CONFIG.GOOGLE_SHEET.SHEET_ID`
- [ ] **Company Phone:** Verify matches `GLOBAL_CONFIG.COMPANY.PHONE`

**Current Values (from globalConfig.ts):**
- Google Apps Script URL: `https://script.google.com/macros/s/AKfycbxcWggxWdEJzsSW_noiLBbfP6ovmTHWLRIDnWvc6jAj4-1HV_sEp9OBw4UCvXBsEu3M/exec`
- Admin Email: `lindsey08092@gmail.com`
- Email From: `lindsey08092@gmail.com`
- Email To: `lindsey08092@gmail.com`
- Email Reply-To: `lindsey08092@gmail.com`
- Google Sheet ID: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`
- Company Phone: `(800) VET-INSURANCE`

### **Google Apps Script Functions Available:**
- [ ] `runCompleteQATest()` - Comprehensive end-to-end test
- [ ] `fixSheetStructureNow()` - Fix sheet structure to 50 columns
- [ ] `testAbandonmentScenarios()` - Test abandonment triggers
- [ ] `testAllEmailScenarios()` - Test all email functionality
- [ ] `cleanupTestSessions()` - Remove test data

## **CONFIGURATION VALIDATION**

### **Step 1: Verify globalConfig.ts Values**
1. Open `funnel-app/src/config/globalConfig.ts`
2. Verify these values match your deployment:
   - `GOOGLE_APPS_SCRIPT_URL`: Current deployment URL
   - `EMAIL.FROM`: Sender email address
   - `EMAIL.TO`: Recipient email address  
   - `GOOGLE_SHEET.SHEET_ID`: Target Google Sheet ID
   - `COMPANY.PHONE`: Display phone number

### **Step 2: Sync All Config Files**
1. Copy values from `globalConfig.ts` to:
   - `js/config.js` → Update `GOOGLE_APPS_SCRIPT_URL`
   - `google-apps-script-react-funnel.js` → Update entire CONFIG object
2. Rebuild React app: `npm run build`
3. Deploy updated files

### **Step 3: Verify Deployment**
1. Check browser network tab shows correct API calls
2. Verify Google Sheet receives data with correct structure
3. Confirm emails are sent to addresses specified in globalConfig.ts

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

## **TEST SCENARIO 1: COMPLETE APPLICATION FLOW**

### **Step-by-Step Test Data:**

#### **Pre-Qualification Data (Steps 1-14):**
```
State: California
Military Status: Veteran
Branch of Service: Army
Marital Status: Married
Coverage Amount: $100,000
First Name: John
Last Name: TestLead
Email: john.testlead@example.com
Phone: (555) 123-4567
Transactional Consent: ✅
Marketing Consent: ✅
Date of Birth: 01/15/1985
Tobacco Use: No
Medical Conditions: None
Height: 5'10"
Weight: 180 lbs
Hospital Care: No
Diabetes Medication: No
```

#### **Application Data (Steps 16-17):**
```
Street Address: 123 Test Street
City: Test City
State: CA
ZIP Code: 90210
Beneficiary Name: Jane TestLead
Beneficiary Relationship: Spouse
SSN: 123-45-6789
Bank Name: Test Bank
Routing Number: 123456789
Account Number: 987654321
Policy Start Date: 02/01/2025
```

### **Expected Google Sheet Verification (All 50 Columns):**

#### **Columns 1-4 (Core):**
- [ ] **Timestamp:** `[Current DateTime]`
- [ ] **Session ID:** `[UUID format]`
- [ ] **Status:** `submitted`
- [ ] **Last Activity:** `[Current DateTime]`

#### **Columns 5-11 (Contact):**
- [ ] **First Name:** `John`
- [ ] **Last Name:** `TestLead`
- [ ] **Email:** `john.testlead@example.com`
- [ ] **Phone:** `(555) 123-4567`
- [ ] **DOB:** `01/15/1985`
- [ ] **Transactional Consent:** `TRUE`
- [ ] **Marketing Consent:** `TRUE`

#### **Columns 12-16 (Pre-qualification):**
- [ ] **State:** `California`
- [ ] **Military Status:** `Veteran`
- [ ] **Branch:** `Army`
- [ ] **Marital Status:** `Married`
- [ ] **Coverage Amount:** `$100,000`

#### **Columns 17-22 (Medical):**
- [ ] **Tobacco Use:** `No`
- [ ] **Medical Conditions:** `None`
- [ ] **Height:** `5'10"`
- [ ] **Weight:** `180 lbs`
- [ ] **Hospital Care:** `No`
- [ ] **Diabetes Medication:** `No`

#### **Columns 23-34 (Application):**
- [ ] **Street Address:** `123 Test Street`
- [ ] **City:** `Test City`
- [ ] **Application State:** `CA`
- [ ] **ZIP Code:** `90210`
- [ ] **Beneficiary Name:** `Jane TestLead`
- [ ] **Beneficiary Relationship:** `Spouse`
- [ ] **VA Number:** `(empty - not collected)`
- [ ] **Service Connected:** `(empty - not collected)`
- [ ] **SSN:** `123-45-6789`
- [ ] **Bank Name:** `Test Bank`
- [ ] **Routing Number:** `123456789`
- [ ] **Account Number:** `987654321`

#### **Columns 35-40 (Quote):**
- [ ] **Policy Date:** `02/01/2025`
- [ ] **Quote Coverage:** `100000`
- [ ] **Quote Premium:** `[Calculated Amount]`
- [ ] **Quote Age:** `39`
- [ ] **Quote Gender:** `[From Form]`
- [ ] **Quote Type:** `IUL`

#### **Columns 41-48 (Tracking):**
- [ ] **Current Step:** `18`
- [ ] **Step Name:** `FinalSuccessModal`
- [ ] **Form Type:** `Application`
- [ ] **User Agent:** `[Browser Info]`
- [ ] **Referrer:** `[Page URL]`
- [ ] **UTM Source:** `[If Present]`
- [ ] **UTM Medium:** `[If Present]`
- [ ] **UTM Campaign:** `[If Present]`

#### **Columns 49-50 (Email Status):**
- [ ] **Partial Email Sent:** `FALSE`
- [ ] **Completed Email Sent:** `TRUE`

### **Expected Email Verification:**

#### **Admin Application Email:**
- [ ] **Subject:** `New React Funnel Application: John`
- [ ] **Contains:** All application data including address, beneficiary, SSN, banking info
- [ ] **Quote Info:** Coverage amount, monthly premium, policy type
- [ ] **Contact Info:** Name, email, phone, DOB

#### **User Confirmation Email:**
- [ ] **Subject:** `Your application has been submitted successfully`
- [ ] **Contains:** Quote summary with premium and coverage
- [ ] **Contains:** Next steps and timeline
- [ ] **Contains:** Company phone: `(800) VET-INSURANCE`

## **TEST SCENARIO 2: PARTIAL LEAD (PRE-QUALIFICATION ONLY)**

### **Test Data:**
```
Use same data as Test Scenario 1, but stop at Pre-Qualified Success Modal
Do NOT click "Complete Application"
```

### **Expected Google Sheet Verification:**
- [ ] **Status:** `pre-qualified`
- [ ] **Columns 5-22:** All pre-qualification data populated
- [ ] **Columns 23-40:** Application data empty
- [ ] **Partial Email Sent:** `TRUE`
- [ ] **Completed Email Sent:** `FALSE`

### **Expected Email Verification:**
- [ ] **Admin Lead Email:** Sent with pre-qualification data
- [ ] **User Email:** NOT sent (no application completed)

## **TEST SCENARIO 3: LEAD PARTIAL (MEDICAL QUESTIONS ONLY)**

### **Test Data:**
```
Complete through Contact Info (Step 6), then abandon
```

### **Expected Google Sheet Verification:**
- [ ] **Status:** `active`
- [ ] **Columns 5-11:** Contact data populated
- [ ] **Columns 12-22:** Pre-qualification and medical data empty
- [ ] **Columns 23-40:** Application data empty
- [ ] **Partial Email Sent:** `TRUE` (if phone provided)
- [ ] **Completed Email Sent:** `FALSE`

### **Expected Email Verification:**
- [ ] **Abandonment Email:** Sent if phone number captured
- [ ] **Application Email:** NOT sent

## **TEST SCENARIO 4: APPLICATION DATA VERIFICATION**

### **Test Step 16 Data (Address & Beneficiary):**
```
Street Address: 456 Application St
City: App City
State: TX
ZIP Code: 75201
Beneficiary Name: John Beneficiary
Beneficiary Relationship: Son
```

### **Expected Columns 23-28:**
- [ ] **Street Address:** `456 Application St`
- [ ] **City:** `App City`
- [ ] **Application State:** `TX`
- [ ] **ZIP Code:** `75201`
- [ ] **Beneficiary Name:** `John Beneficiary`
- [ ] **Beneficiary Relationship:** `Son`

### **Test Step 17 Data (Financial):**
```
SSN: 987-65-4321
Bank Name: Application Bank
Routing Number: 987654321
Account Number: 123456789
Policy Start Date: 03/01/2025
```

### **Expected Columns 31-35:**
- [ ] **SSN:** `987-65-4321`
- [ ] **Bank Name:** `Application Bank`
- [ ] **Routing Number:** `987654321`
- [ ] **Account Number:** `123456789`
- [ ] **Policy Date:** `03/01/2025`

## **TEST SCENARIO 5: BANKING INFORMATION SECURITY**

### **Security Verification:**
- [ ] **SSN Handling:** Properly secured in column 31
- [ ] **Banking Info:** Properly secured in columns 32-34
- [ ] **Data Truncation:** No data loss or truncation
- [ ] **Log Security:** No sensitive data in logs
- [ ] **Transmission Security:** Secure transmission to Google Apps Script

## **TEST SCENARIO 6: ABANDONMENT TRIGGER TESTING**

### **Test A: Abandon Before Phone (No Email):**
1. Complete steps 1-4 (before contact info)
2. Close browser
3. **Expected:** NO abandonment email sent
4. **Expected:** Session status is `active`

### **Test B: Abandon After Phone (Trigger Email):**
1. Complete through step 6 (contact info with phone)
2. Close browser
3. Wait 30+ seconds
4. Trigger abandonment detection
5. **Expected:** Abandonment email sent
6. **Expected:** Session status is `phone_captured`

### **Test C: Abandon After Pre-Qualified (Still Send Email):**
1. Complete through step 14 (pre-qualified)
2. Close browser before clicking "Complete Application"
3. Trigger abandonment detection
4. **Expected:** Abandonment email sent (user had phone)

### **Test D: Complete Application (No Abandonment Email):**
1. Complete full application (step 18)
2. Trigger abandonment detection
3. **Expected:** NO abandonment email sent
4. **Expected:** Only completion email sent

## **PERFORMANCE TESTING**

### **Response Time Verification:**
- [ ] **Application Submission:** < 10 seconds
- [ ] **Lead Submission:** < 5 seconds
- [ ] **Partial Submission:** < 3 seconds
- [ ] **Email Sending:** < 30 seconds

### **Error Handling Verification:**
- [ ] **Invalid Data:** Proper error messages
- [ ] **Network Issues:** Graceful handling
- [ ] **Sheet Access:** Proper error handling
- [ ] **Email Failures:** Logged but don't break submission

## **DATA INTEGRITY TESTING**

### **Column Count Verification:**
- [ ] **Total Columns:** Exactly 50
- [ ] **Header Row:** All 50 headers present
- [ ] **Data Rows:** All 50 columns populated
- [ ] **No Extra Columns:** No columns beyond 50

### **Data Type Verification:**
- [ ] **Timestamps:** Proper date/time format
- [ ] **Numbers:** Proper numeric format
- [ ] **Booleans:** TRUE/FALSE format
- [ ] **Text:** Proper string format

### **Duplicate Prevention:**
- [ ] **Session IDs:** Unique for each submission
- [ ] **No Duplicate Rows:** Same session ID doesn't create multiple rows
- [ ] **Status Updates:** Proper status progression

## **EMAIL FUNCTIONALITY TESTING**

### **Email Trigger Verification:**
- [ ] **Lead Email:** Sent for pre-qualification
- [ ] **Application Email:** Sent for completed applications
- [ ] **Abandonment Email:** Sent only when phone captured
- [ ] **No Duplicate Emails:** Each scenario sends exactly one email

### **Email Content Verification:**
- [ ] **Admin Emails:** Contain all relevant data
- [ ] **User Emails:** Contain appropriate information
- [ ] **Subject Lines:** Correct and descriptive
- [ ] **Company Info:** Correct phone and contact details

## **TROUBLESHOOTING COMMANDS**

### **Google Apps Script Functions:**
```javascript
// Run comprehensive test
runCompleteQATest()

// Fix sheet structure
fixSheetStructureNow()

// Test abandonment scenarios
testAbandonmentScenarios()

// Test all email scenarios
testAllEmailScenarios()

// Clean up test data
cleanupTestSessions()

// Verify specific session
verifyTestDataInSheet('SESSION_ID_HERE')
```

### **Manual Verification Commands:**
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

## **SUCCESS CRITERIA**

### **✅ Test PASSES when:**
- [ ] **All 50 columns** populated with correct data
- [ ] **No duplicate rows** created
- [ ] **Email notifications** sent correctly
- [ ] **No script errors** or timeouts
- [ ] **No data corruption** or loss
- [ ] **Performance acceptable** (< 10 seconds per submission)
- [ ] **Security maintained** (no sensitive data leakage)

### **❌ Test FAILS when:**
- [ ] **Missing or incorrect data** in any column
- [ ] **Duplicate rows** created
- [ ] **Email notifications** not sent
- [ ] **Script errors** or timeouts
- [ ] **Data corruption** or loss

## **EXECUTION INSTRUCTIONS**

### **Step 1: Pre-Test Setup**
1. Run `fixSheetStructureNow()` in Google Apps Script
2. Verify sheet has exactly 50 columns
3. Set `TESTING_MODE: false` in CONFIG for email testing

### **Step 2: Execute Test Scenarios**
1. Run through Test Scenario 1 manually
2. Verify all 50 columns in Google Sheet
3. Check email inbox for admin and user emails
4. Repeat for Test Scenarios 2-6

### **Step 3: Automated Testing**
1. Run `runCompleteQATest()` in Google Apps Script
2. Check logs for any errors
3. Verify test data appears in sheet
4. Run `cleanupTestSessions()` when done

### **Step 4: Performance Verification**
1. Monitor response times
2. Check for any timeouts
3. Verify error handling works
4. Test with various data scenarios

---

**Last Updated:** July 29, 2024  
**Version:** 2.0 (Comprehensive Testing)  
**Status:** Ready for Production Testing 