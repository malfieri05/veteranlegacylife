# Google Sheet Integration & Email Functionality QA/QC Testing Guide

## Overview
This document provides a systematic testing approach to verify that all modal data from the funnel is properly captured in the Google Sheet and that email functionality works correctly.

## Pre-Test Setup

### 1. Google Sheet Verification
- [ ] Open the Google Sheet: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`
- [ ] Verify the sheet has exactly 50 columns with proper headers
- [ ] Run `fixSheetStructureNow()` in Google Apps Script if needed
- [ ] Clear any test data from previous runs

### 2. Email Configuration Check
- [ ] Verify admin email is set to: `lindsey08092@gmail.com`
- [ ] Verify company phone is set to: `(800) VET-INSURANCE`
- [ ] Verify Google Apps Script URL is current: `https://script.google.com/macros/s/AKfycbxcWggxWdEJzsSW_noiLBbfP6ovmTHWLRIDnWvc6jAj4-1HV_sEp9OBw4UCvXBsEu3M/exec`

## Test Scenarios

### Test Scenario 1: Complete Lead Flow (Pre-Qualification Only)

#### **Step-by-Step Test:**
1. **Open the funnel application**
2. **Complete all steps through ContactInfo (Step 6):**
   - State: `California`
   - Military Status: `Veteran`
   - Branch of Service: `Army`
   - Marital Status: `Married`
   - Coverage Amount: `$100,000`
   - First Name: `John`
   - Last Name: `TestLead`
   - Email: `john.testlead@example.com`
   - Phone: `(555) 123-4567`
   - Transactional Consent: ✅ Checked
   - Marketing Consent: ✅ Checked
3. **Complete Birthday step (Step 7):**
   - Month: `January`
   - Day: `15`
   - Year: `1985`
4. **Complete all medical questions (Steps 8-12):**
   - Tobacco Use: `No`
   - Medical Conditions: `None`
   - Height: `5'10"`
   - Weight: `180 lbs`
   - Hospital Care: `No`
   - Diabetes Medication: `No`
5. **Wait for loading screen (Step 13)**
6. **Verify Pre-Qualified Success screen (Step 14)**
7. **Click "Complete Application"**
8. **Complete IUL Quote Modal (Step 15):**
   - Coverage Amount: `$100,000`
   - Monthly Premium: `$150`
   - Click "Secure Your Rate"
9. **Complete Application Step 1 (Step 16):**
   - Street Address: `123 Test Street`
   - City: `Test City`
   - State: `CA`
   - ZIP Code: `90210`
   - Beneficiary Name: `Jane TestLead`
   - Beneficiary Relationship: `Spouse`
10. **Complete Application Step 2 (Step 17):**
    - SSN: `123-45-6789`
    - Bank Name: `Test Bank`
    - Routing Number: `123456789`
    - Account Number: `987654321`
    - Policy Date: `01/15/2025`
11. **Verify Final Success Modal (Step 18)**

#### **Google Sheet Verification Checklist:**
- [ ] **New row created** with Session ID
- [ ] **Timestamp** populated correctly
- [ ] **Status** shows `submitted`
- [ ] **Contact Information (Columns 5-11):**
  - [ ] First Name: `John`
  - [ ] Last Name: `TestLead`
  - [ ] Email: `john.testlead@example.com`
  - [ ] Phone: `(555) 123-4567`
  - [ ] DOB: `01/15/1985`
  - [ ] Transactional Consent: `TRUE`
  - [ ] Marketing Consent: `TRUE`
- [ ] **Pre-qualification Data (Columns 12-16):**
  - [ ] State: `California`
  - [ ] Military Status: `Veteran`
  - [ ] Branch: `Army`
  - [ ] Marital Status: `Married`
  - [ ] Coverage Amount: `$100,000`
- [ ] **Medical Information (Columns 17-22):**
  - [ ] Tobacco Use: `No`
  - [ ] Medical Conditions: `None`
  - [ ] Height: `5'10"`
  - [ ] Weight: `180 lbs`
  - [ ] Hospital Care: `No`
  - [ ] Diabetes Medication: `No`
- [ ] **Application Data (Columns 23-34):**
  - [ ] Street Address: `123 Test Street`
  - [ ] City: `Test City`
  - [ ] Application State: `CA`
  - [ ] ZIP Code: `90210`
  - [ ] Beneficiary Name: `Jane TestLead`
  - [ ] Beneficiary Relationship: `Spouse`
  - [ ] VA Number: `(empty)`
  - [ ] Service Connected: `(empty)`
  - [ ] SSN: `123-45-6789`
  - [ ] Bank Name: `Test Bank`
  - [ ] Routing Number: `123456789`
  - [ ] Account Number: `987654321`
- [ ] **Quote Information (Columns 35-40):**
  - [ ] Policy Date: `01/15/2025`
  - [ ] Quote Coverage: `100000`
  - [ ] Quote Premium: `150`
  - [ ] Quote Age: `39`
  - [ ] Quote Gender: `(from form)`
  - [ ] Quote Type: `IUL`
- [ ] **Tracking Data (Columns 41-48):**
  - [ ] Current Step: `18`
  - [ ] Step Name: `FinalSuccessModal`
  - [ ] Form Type: `Application`
  - [ ] User Agent: `(populated)`
  - [ ] Referrer: `(populated)`
  - [ ] UTM Source: `(populated)`
  - [ ] UTM Medium: `(populated)`
  - [ ] UTM Campaign: `(populated)`
- [ ] **Email Status (Columns 49-50):**
  - [ ] Partial Email Sent: `FALSE`
  - [ ] Completed Email Sent: `TRUE`

#### **Email Verification Checklist:**
- [ ] **Admin notification email received** at `lindsey08092@gmail.com`
- [ ] **Subject line:** `New React Funnel Application: John`
- [ ] **Email contains all application data**
- [ ] **Confirmation email sent to user** at `john.testlead@example.com`
- [ ] **Subject line:** `Your application has been submitted successfully`
- [ ] **Email contains quote summary and next steps**

### Test Scenario 2: Partial Lead Flow (Abandonment Test)

#### **Step-by-Step Test:**
1. **Open the funnel application**
2. **Complete through ContactInfo (Step 6):**
   - First Name: `Jane`
   - Last Name: `TestPartial`
   - Email: `jane.testpartial@example.com`
   - Phone: `(555) 987-6543`
   - Transactional Consent: ✅ Checked
   - Marketing Consent: ✅ Checked
3. **Complete Birthday step (Step 7):**
   - Month: `March`
   - Day: `20`
   - Year: `1990`
4. **Complete medical questions (Steps 8-12):**
   - Tobacco Use: `No`
   - Medical Conditions: `None`
   - Height: `5'6"`
   - Weight: `140 lbs`
   - Hospital Care: `No`
   - Diabetes Medication: `No`
5. **Wait for loading screen (Step 13)**
6. **On Pre-Qualified Success screen (Step 14), close the browser**
7. **Wait 30 seconds**
8. **Call abandonment detection manually**

#### **Google Sheet Verification Checklist:**
- [ ] **New row created** with Session ID
- [ ] **Status** shows `phone_captured`
- [ ] **Contact Information populated correctly**
- [ ] **Medical Information populated correctly**
- [ ] **Application Data columns empty**
- [ ] **Quote Information columns empty**

#### **Email Verification Checklist:**
- [ ] **Partial abandonment email received** at `lindsey08092@gmail.com`
- [ ] **Subject line:** `Lead Abandonment Alert: Jane`
- [ ] **Email contains contact and medical information**
- [ ] **No confirmation email sent to user** (abandoned)

### Test Scenario 3: Lead Partial Flow (Medical Questions Only)

#### **Step-by-Step Test:**
1. **Open the funnel application**
2. **Complete through ContactInfo (Step 6):**
   - First Name: `Bob`
   - Last Name: `TestMedical`
   - Email: `bob.testmedical@example.com`
   - Phone: `(555) 456-7890`
   - Transactional Consent: ✅ Checked
   - Marketing Consent: ✅ Checked
3. **Complete Birthday step (Step 7):**
   - Month: `July`
   - Day: `10`
   - Year: `1975`
4. **Complete medical questions (Steps 8-12):**
   - Tobacco Use: `Yes`
   - Medical Conditions: `Diabetes, High Blood Pressure`
   - Height: `6'0"`
   - Weight: `200 lbs`
   - Hospital Care: `Yes`
   - Diabetes Medication: `Yes`
5. **Wait for loading screen (Step 13)**
6. **On Pre-Qualified Success screen (Step 14), close the browser**

#### **Google Sheet Verification Checklist:**
- [ ] **New row created** with Session ID
- [ ] **Status** shows `active`
- [ ] **Contact Information populated correctly**
- [ ] **Medical Information populated correctly:**
  - [ ] Tobacco Use: `Yes`
  - [ ] Medical Conditions: `Diabetes, High Blood Pressure`
  - [ ] Height: `6'0"`
  - [ ] Weight: `200 lbs`
  - [ ] Hospital Care: `Yes`
  - [ ] Diabetes Medication: `Yes`
- [ ] **Application Data columns empty**
- [ ] **Quote Information columns empty**

#### **Email Verification Checklist:**
- [ ] **Lead notification email received** at `lindsey08092@gmail.com`
- [ ] **Subject line:** `New React Funnel Lead: Bob`
- [ ] **Email contains all lead data**
- [ ] **Confirmation email sent to user** at `bob.testmedical@example.com`
- [ ] **Subject line:** `Thank you for your interest in Veteran Life Insurance`

## Data Integrity Tests

### Test 4: Duplicate Session Prevention
- [ ] **Run complete flow twice with same session ID**
- [ ] **Verify only one row created** in Google Sheet
- [ ] **Verify existing row updated** instead of creating duplicate

### Test 5: Column Count Verification
- [ ] **Run `validateSheetStructure()`** in Google Apps Script
- [ ] **Verify exactly 50 columns** exist
- [ ] **Verify all headers match** SHEET_COLUMNS constant

### Test 6: Data Type Verification
- [ ] **Verify dates are formatted correctly** (MM/DD/YYYY)
- [ ] **Verify numbers are numeric** (not text)
- [ ] **Verify boolean values** (TRUE/FALSE for consents)
- [ ] **Verify arrays are joined** (medical conditions as comma-separated)

## Error Handling Tests

### Test 7: Missing Spreadsheet Test
- [ ] **Temporarily rename the Google Sheet**
- [ ] **Submit form data**
- [ ] **Verify proper error message** returned
- [ ] **Restore sheet name**

### Test 8: Invalid Data Test
- [ ] **Submit form with missing required fields**
- [ ] **Verify graceful error handling**
- [ ] **Verify no partial data saved** to sheet

## Performance Tests

### Test 9: Multiple Concurrent Submissions
- [ ] **Open multiple browser tabs**
- [ ] **Submit forms simultaneously**
- [ ] **Verify all submissions processed** correctly
- [ ] **Verify no data corruption**

### Test 10: Large Data Set Test
- [ ] **Submit form with very long text fields**
- [ ] **Verify data truncated appropriately** if needed
- [ ] **Verify no script timeouts**

## Email Functionality Tests

### Test 11: Email Template Verification
- [ ] **Verify all email templates** use CONFIG variables
- [ ] **Verify phone number** displays as `(800) VET-INSURANCE`
- [ ] **Verify company name** displays as `Veteran Legacy Life`
- [ ] **Verify email addresses** are correct

### Test 12: Email Status Tracking
- [ ] **Verify email status columns** updated correctly
- [ ] **Verify no duplicate emails** sent
- [ ] **Verify email blocking** works for completed applications

## Troubleshooting Commands

### Google Apps Script Functions to Run:
```javascript
// Fix sheet structure
fixSheetStructureNow()

// Validate current structure
validateSheetStructure()

// Test email functionality
testEmailTriggers()

// Clean up test data
cleanupTestSessions()

// Test application completion
testApplicationCompletion()
```

## Success Criteria

### ✅ **Test Passes When:**
- [ ] **All 50 columns** populated correctly
- [ ] **No duplicate rows** created
- [ ] **All email notifications** sent properly
- [ ] **Data types** are correct
- [ ] **Error handling** works gracefully
- [ ] **Performance** is acceptable (< 10 seconds per submission)

### ❌ **Test Fails When:**
- [ ] **Missing or incorrect data** in any column
- [ ] **Duplicate rows** created
- [ ] **Email notifications** not sent
- [ ] **Script errors** or timeouts
- [ ] **Data corruption** or loss

## Maintenance Notes

### **When to Update This Document:**
- [ ] **New fields added** to any modal
- [ ] **Email templates changed**
- [ ] **Google Sheet structure modified**
- [ ] **Configuration values updated**

### **Regular Testing Schedule:**
- [ ] **Weekly:** Run Test Scenarios 1-3
- [ ] **Monthly:** Run all tests including performance
- [ ] **After deployments:** Run complete test suite
- [ ] **Before production:** Run all tests with real data

---

**Last Updated:** [Current Date]
**Tested By:** [Tester Name]
**Next Review:** [Date + 1 month] 