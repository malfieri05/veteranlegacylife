# Veteran Legacy Life Funnel - QA/QC Workflow Documentation

## Overview
This document details the complete funnel workflow, including all steps, their functionality, data collection, navigation, and email triggers. Use this as the single source of truth when making changes.

## Step-by-Step Workflow

### **Step 1: StateSelection**
- **Component**: `StateSelection.tsx`
- **Question**: "What state do you live in?"
- **Data Variable**: `formData.state`
- **Google Sheet Column**: `STATE` (column 12)
- **Buttons**: Back (disabled), Continue
- **Auto-Advance**: Yes (500ms delay when state selected)
- **Validation**: Must select a state
- **Navigation**: Step 1 → Step 2

### **Step 2: MilitaryStatus**
- **Component**: `MilitaryStatus.tsx`
- **Question**: "Military Status" (radio buttons)
- **Data Variable**: `formData.militaryStatus`
- **Google Sheet Column**: `MILITARY_STATUS` (column 13)
- **Buttons**: Back, Continue
- **Auto-Advance**: Yes (500ms delay when selection made)
- **Validation**: Must select military status
- **Navigation**: Step 2 → Step 3

### **Step 3: BranchOfService**
- **Component**: `BranchOfService.tsx`
- **Question**: "Branch of Service" (radio buttons)
- **Data Variable**: `formData.branchOfService`
- **Google Sheet Column**: `BRANCH` (column 14)
- **Buttons**: Back, Continue
- **Auto-Advance**: Yes (500ms delay when selection made)
- **Validation**: Must select branch
- **Navigation**: Step 3 → Step 4

### **Step 4: MaritalStatus**
- **Component**: `MaritalStatus.tsx`
- **Question**: "Marital Status" (radio buttons: Single, Married, Divorced, Widowed)
- **Data Variable**: `formData.maritalStatus`
- **Google Sheet Column**: `MARITAL_STATUS` (column 15)
- **Buttons**: Back, Continue
- **Auto-Advance**: Yes (500ms delay when selection made)
- **Validation**: Must select marital status
- **Navigation**: Step 4 → Step 5

### **Step 5: CoverageAmount**
- **Component**: `CoverageAmount.tsx`
- **Question**: "Coverage Amount" (radio buttons: $10K, $25K, $50K, $100K, $250K, $500K, $1M)
- **Data Variable**: `formData.coverageAmount`
- **Google Sheet Column**: `COVERAGE_AMOUNT` (column 16)
- **Buttons**: Back, Continue
- **Auto-Advance**: Yes (500ms delay when selection made)
- **Validation**: Must select coverage amount
- **Navigation**: Step 5 → Step 6
- **Email Trigger**: `submitLead()` - Sends initial lead data

### **Step 6: ContactInfo**
- **Component**: `ContactInfo.tsx`
- **Questions**: 
  - First Name
  - Last Name
  - Email Address
  - Phone Number
  - Transactional Consent (checkbox)
  - Marketing Consent (checkbox)
- **Data Variables**: 
  - `formData.contactInfo.firstName`
  - `formData.contactInfo.lastName`
  - `formData.contactInfo.email`
  - `formData.contactInfo.phone`
  - `formData.contactInfo.transactionalConsent`
  - `formData.contactInfo.marketingConsent`
- **Google Sheet Columns**: 
  - `FIRST_NAME` (column 5)
  - `LAST_NAME` (column 6)
  - `EMAIL` (column 7)
  - `PHONE` (column 8)
  - `TRANSACTIONAL_CONSENT` (column 10)
  - `MARKETING_CONSENT` (column 11)
- **Buttons**: Back, Continue
- **Auto-Advance**: Yes (500ms delay when all fields filled and valid)
- **Validation**: All fields required, email format, phone format, both checkboxes must be checked
- **Navigation**: Step 6 → Step 7

### **Step 7: Birthday**
- **Component**: `Birthday.tsx`
- **Question**: "What is your date of birth?"
- **Data Variable**: `formData.dateOfBirth` (top-level)
- **Google Sheet Column**: `DOB` (column 9)
- **Buttons**: Back, Continue
- **Auto-Advance**: Yes (500ms delay when all fields filled)
- **Validation**: Must be 18-100 years old, valid date format
- **Navigation**: Step 7 → Step 8

### **Step 8: TobaccoUse**
- **Component**: `TobaccoUse.tsx`
- **Question**: "Have you used any form of tobacco or nicotine in the past 12 months?" (radio buttons: Yes/No)
- **Data Variable**: `formData.medicalAnswers.tobaccoUse`
- **Google Sheet Column**: `TOBACCO_USE` (column 17)
- **Buttons**: Back, Continue
- **Auto-Advance**: Yes (500ms delay when selection made)
- **Validation**: Must select yes/no
- **Navigation**: Step 8 → Step 9

### **Step 9: MedicalConditions**
- **Component**: `MedicalConditions.tsx`
- **Question**: "Have you ever been diagnosed with or treated for any of the following? (Check all that apply)" (checkboxes)
- **Data Variable**: `formData.medicalAnswers.medicalConditions` (array)
- **Google Sheet Column**: `MEDICAL_CONDITIONS` (column 18)
- **Buttons**: Back, Continue
- **Auto-Advance**: No (manual continue required)
- **Validation**: Must select at least one condition
- **Navigation**: Step 9 → Step 10

### **Step 10: HeightWeight**
- **Component**: `HeightWeight.tsx`
- **Questions**: 
  - Height (ft/in)
  - Weight (lbs)
- **Data Variables**: 
  - `formData.medicalAnswers.height`
  - `formData.medicalAnswers.weight`
- **Google Sheet Columns**: 
  - `HEIGHT` (column 19)
  - `WEIGHT` (column 20)
- **Buttons**: Back, Continue
- **Auto-Advance**: Yes (500ms delay when both filled)
- **Validation**: Both height and weight required
- **Navigation**: Step 10 → Step 11

### **Step 11: HospitalCare**
- **Component**: `HospitalCare.tsx`
- **Question**: "Are you currently in a hospital, nursing home, or receiving hospice care?" (radio buttons: Yes/No)
- **Data Variable**: `formData.medicalAnswers.hospitalCare`
- **Google Sheet Column**: `HOSPITAL_CARE` (column 21)
- **Buttons**: Back, Continue
- **Auto-Advance**: Yes (500ms delay when selection made)
- **Validation**: Must select yes/no
- **Navigation**: Step 11 → Step 12

### **Step 12: DiabetesMedication**
- **Component**: `DiabetesMedication.tsx`
- **Question**: "Do you take medication for diabetes?" (radio buttons: No, Yes I take pills, Yes I take insulin)
- **Data Variable**: `formData.medicalAnswers.diabetesMedication`
- **Google Sheet Column**: `DIABETES_MEDICATION` (column 22)
- **Buttons**: Back, Continue
- **Auto-Advance**: Yes (500ms delay when selection made)
- **Validation**: Must select an option
- **Navigation**: Step 12 → Step 13
- **Email Trigger**: `submitLeadPartial()` - Sends partial lead data

### **Step 13: LoadingScreen**
- **Component**: `StreamingLoadingSpinner` (with logo)
- **Function**: Processing animation with typing effect
- **Data Variables**: None (display only)
- **Google Sheet Columns**: None
- **Buttons**: None (auto-advance only)
- **Auto-Advance**: Yes (8 seconds total duration)
- **Validation**: None
- **Navigation**: Step 13 → Step 14

### **Step 14: PreQualifiedSuccess**
- **Component**: `PreQualifiedSuccess.tsx`
- **Function**: Success message with "Complete Application" button
- **Data Variables**: None (display only)
- **Google Sheet Columns**: None
- **Buttons**: "Complete Application" (custom button)
- **Auto-Advance**: No
- **Validation**: None
- **Navigation**: Step 14 → Step 15 (via custom button)

### **Step 15: IULQuoteModal**
- **Component**: `IULQuoteModal.tsx`
- **Function**: Display personalized IUL quote with coverage slider
- **Data Variables**: 
  - `formData.applicationData.quoteData.coverageAmount`
  - `formData.applicationData.quoteData.monthlyPremium`
  - `formData.applicationData.quoteData.userAge`
  - `formData.applicationData.quoteData.userGender`
  - `formData.applicationData.quoteData.quoteType`
- **Google Sheet Columns**: 
  - `QUOTE_COVERAGE` (column 36)
  - `QUOTE_PREMIUM` (column 37)
  - `QUOTE_AGE` (column 38)
  - `QUOTE_GENDER` (column 39)
  - `QUOTE_TYPE` (column 40)
- **Buttons**: "Secure Your Rate" (custom button)
- **Auto-Advance**: No
- **Validation**: None
- **Navigation**: Step 15 → Step 16 (via custom button)

### **Step 16: ApplicationStep1**
- **Component**: `ApplicationStep1.tsx`
- **Questions**: 
  - Street Address
  - City
  - State
  - Zip Code
  - Beneficiary Name
  - Beneficiary Relationship
- **Data Variables**: 
  - `formData.applicationData.address.street`
  - `formData.applicationData.address.city`
  - `formData.applicationData.address.state`
  - `formData.applicationData.address.zipCode`
  - `formData.applicationData.beneficiary.name`
  - `formData.applicationData.beneficiary.relationship`
- **Google Sheet Columns**: 
  - `STREET_ADDRESS` (column 23)
  - `CITY` (column 24)
  - `APPLICATION_STATE` (column 25)
  - `ZIP_CODE` (column 26)
  - `BENEFICIARY_NAME` (column 27)
  - `BENEFICIARY_RELATIONSHIP` (column 28)
- **Buttons**: Back, Continue
- **Auto-Advance**: No
- **Validation**: All fields required
- **Navigation**: Step 16 → Step 17

### **Step 17: ApplicationStep2**
- **Component**: `ApplicationStep2.tsx`
- **Questions**: 
  - SSN
  - Bank Name
  - Routing Number
  - Account Number
  - Policy Date
- **Data Variables**: 
  - `formData.applicationData.ssn`
  - `formData.applicationData.banking.bankName`
  - `formData.applicationData.banking.routingNumber`
  - `formData.applicationData.banking.accountNumber`
  - `formData.applicationData.policyDate`
- **Google Sheet Columns**: 
  - `SSN` (column 32)
  - `BANK_NAME` (column 33)
  - `ROUTING_NUMBER` (column 34)
  - `ACCOUNT_NUMBER` (column 35)
  - `POLICY_DATE` (column 41)
- **Buttons**: Back, Submit
- **Auto-Advance**: No
- **Validation**: All fields required
- **Navigation**: Step 17 → Step 18
- **Email Trigger**: `submitApplication()` - Sends final application data

### **Step 18: FinalSuccessModal**
- **Component**: `FinalSuccessModal.tsx`
- **Function**: Final success message
- **Data Variables**: None (display only)
- **Google Sheet Columns**: None
- **Buttons**: None (modal close only)
- **Auto-Advance**: No
- **Validation**: None
- **Navigation**: Modal closes

## Email Triggers

### **Partial Lead Email** (Step 12)
- **Trigger**: After DiabetesMedication step
- **Function**: `submitLeadPartial()`
- **Data**: All form data up to medical questions
- **Google Apps Script**: `handleLeadPartialSubmission()`

### **Final Application Email** (Step 17)
- **Trigger**: After ApplicationStep2 submission
- **Function**: `submitApplication()`
- **Data**: Complete application data
- **Google Apps Script**: `handleApplicationSubmission()`

## Auto-Advance Behavior

### **Auto-Advance Enabled Steps**:
- Step 1 (StateSelection): 500ms delay when state selected
- Step 2 (MilitaryStatus): 500ms delay when selection made
- Step 3 (BranchOfService): 500ms delay when selection made
- Step 4 (MaritalStatus): 500ms delay when selection made
- Step 5 (CoverageAmount): 500ms delay when selection made
- Step 6 (ContactInfo): 500ms delay when all fields filled and valid
- Step 7 (Birthday): 500ms delay when all fields filled
- Step 8 (TobaccoUse): 500ms delay when selection made
- Step 10 (HeightWeight): 500ms delay when both fields filled
- Step 11 (HospitalCare): 500ms delay when selection made
- Step 12 (DiabetesMedication): 500ms delay when selection made
- Step 13 (LoadingScreen): 8 seconds

### **Manual Navigation Steps**:
- Step 9 (MedicalConditions): Manual Continue button (checkboxes require manual selection)
- Step 14 (PreQualifiedSuccess): Custom "Complete Application" button
- Step 15 (IULQuoteModal): Custom "Secure Your Rate" button
- Steps 16-17: Manual Continue/Submit buttons
- Step 18: Modal close only

## Configuration Management

### **Global Configuration Files**:
- **Primary**: `funnel-app/src/config/globalConfig.ts` - Main configuration for React app
- **Legacy**: `js/config.js` - Configuration for legacy JavaScript code
- **Google Apps Script**: `funnel-app/google-apps-script-react-funnel.js` - CONFIG section at top

### **Configuration Values to Update**:
- **Google Apps Script URL**: Update in all three config files when deploying new version
- **Email Addresses**: 
  - Admin email (where notifications are sent)
  - From email (sender)
  - To email (recipient) - change to actual user email when authorized
  - Reply-to email
- **Google Sheet ID**: Found in the URL of the Google Sheet
- **Company Information**: Name, phone, website

### **Configuration Update Checklist**:
- [ ] Update `globalConfig.ts` with new values
- [ ] Update `js/config.js` with new Google Apps Script URL
- [ ] Update `google-apps-script-react-funnel.js` CONFIG section
- [ ] Rebuild React app (`npm run build`)
- [ ] Copy new files to parent directory
- [ ] Update cache-busting version in `index.html`
- [ ] Test email functionality
- [ ] Verify Google Sheet integration

## Button Visibility Rules

### **Standard Back/Continue Buttons Hidden For**:
- Step 13 (LoadingScreen): No buttons (auto-advance only)
- Step 15 (IULQuoteModal): No buttons (custom "Secure Your Rate" button)

### **Progress Bar Hidden For**:
- Step 13 (LoadingScreen): No progress bar

## Data Flow Summary

### **Phase 1: Pre-Qualification** (Steps 1-12)
- Collects basic info, contact details, medical questions
- Sends partial lead data after Step 12

### **Phase 2: Quote & Application** (Steps 13-18)
- Shows loading screen with logo
- Displays personalized IUL quote
- Collects application data
- Sends final application data after Step 17

## Change Management Process

1. **Update this QA/QC document first** with the proposed changes
2. **Create/update the TSX component** in `funnel-app/src/components/steps/`
3. **Update FunnelModal.tsx** with new step mapping
4. **Update funnelStore.ts** with new validation logic
5. **Update Google Apps Script** if new data fields are added
6. **Test the complete flow** to ensure no functionality is broken

## Notes
- All steps use `useFunnelStore` for state management
- Google Apps Script expects specific column mappings
- Auto-advance can be disabled by user interaction
- Email triggers are automatic based on step completion
- Button visibility is controlled by FunnelModal.tsx 