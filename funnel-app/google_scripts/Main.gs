/**
 * Google Apps Script for React Funnel Data Capture - SIMPLIFIED VERSION
 * Matches FunnelStore.ts structure exactly
 */

const CONFIG = {
  EMAIL: {
    ADMIN: 'lindsey08092@gmail.com',
    FROM: 'lindsey08092@gmail.com',
    TO: 'lindsey08092@gmail.com',
    REPLY_TO: 'lindsey08092@gmail.com'
  },
  GOOGLE_SHEET: {
    SHEET_ID: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    SHEET_NAME: 'Veteran Legacy Life Funnel Data'
  },
  COMPANY: {
    NAME: 'Veteran Legacy Life',
    PHONE: '(800) VET-INSURANCE',
    PHONE_DIALABLE: '180083847467',
    WEBSITE: 'https://veteranlegacylife.com'
  }
};

// Column mapping for 51 columns
const SHEET_COLUMNS = {
  TIMESTAMP: 1, SESSION_ID: 2, STATUS: 3, LAST_ACTIVITY: 4,
  FIRST_NAME: 5, LAST_NAME: 6, EMAIL: 7, PHONE: 8, DOB: 9,
  TRANSACTIONAL_CONSENT: 10, MARKETING_CONSENT: 11, STATE: 12,
  MILITARY_STATUS: 13, BRANCH: 14, MARITAL_STATUS: 15, COVERAGE_AMOUNT: 16,
  TOBACCO_USE: 17, MEDICAL_CONDITIONS: 18, HEIGHT: 19, WEIGHT: 20,
  HOSPITAL_CARE: 21, DIABETES_MEDICATION: 22, STREET_ADDRESS: 23,
  CITY: 24, APPLICATION_STATE: 25, ZIP_CODE: 26, BENEFICIARY_NAME: 27,
  BENEFICIARY_RELATIONSHIP: 28, VA_NUMBER: 29, SERVICE_CONNECTED: 30,
  SSN: 31, DRIVERS_LICENSE: 32, BANK_NAME: 33, ROUTING_NUMBER: 34,
  ACCOUNT_NUMBER: 35, POLICY_DATE: 36, QUOTE_COVERAGE: 37, QUOTE_PREMIUM: 38,
  QUOTE_AGE: 39, QUOTE_GENDER: 40, QUOTE_TYPE: 41, CURRENT_STEP: 42,
  STEP_NAME: 43, FORM_TYPE: 44, USER_AGENT: 45, REFERRER: 46,
  UTM_SOURCE: 47, UTM_MEDIUM: 48, UTM_CAMPAIGN: 49, PARTIAL_EMAIL_SENT: 50,
  COMPLETED_EMAIL_SENT: 51
};

function doPost(e) {
  try {
    const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    Logger.log(`[${sessionId}] Processing request`);
    
    // Check for test function call first
    if (e.postData && e.postData.contents) {
      const data = JSON.parse(e.postData.contents);
      if (data.action === 'testNewEntriesAndEmails') {
        Logger.log(`[${sessionId}] Running testNewEntriesAndEmails`);
        return testNewEntriesAndEmails();
      }
      if (data.action === 'setupHeaders') {
        Logger.log(`[${sessionId}] Running setupHeaders`);
        return setupHeaders();
      }
    }
    
    // Parse the incoming data
    const parsedData = JSON.parse(e.postData.contents);
    Logger.log(`[${sessionId}] Parsed data: ${JSON.stringify(parsedData)}`);
    
    // Determine form type and route accordingly
    const formType = parsedData.formType || 'Unknown';
    Logger.log(`[${sessionId}] Form type: ${formType}`);
    
    let result;
    switch (formType) {
      case 'Lead':
        result = handleLeadSubmission(parsedData, sessionId);
        break;
      case 'LeadPartial':
        result = handleLeadPartialSubmission(parsedData, sessionId);
        break;
      case 'Partial':
        result = handlePartialSubmission(parsedData, sessionId);
        break;
      case 'Application':
        result = handleApplicationSubmission(parsedData, sessionId);
        break;
      default:
        throw new Error(`Unknown form type: ${formType}`);
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log(`Error in doPost: ${error.toString()}`);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleApplicationSubmission(data, sessionId) {
  Logger.log(`[${sessionId}] Processing Application submission`);
  
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const rowData = new Array(51).fill('');
    
    // Contact Info (columns 5-11)
    rowData[SHEET_COLUMNS.FIRST_NAME - 1] = data.contactInfo?.firstName || '';
    rowData[SHEET_COLUMNS.LAST_NAME - 1] = data.contactInfo?.lastName || '';
    rowData[SHEET_COLUMNS.EMAIL - 1] = data.contactInfo?.email || '';
    rowData[SHEET_COLUMNS.PHONE - 1] = data.contactInfo?.phone || '';
    rowData[SHEET_COLUMNS.DOB - 1] = data.contactInfo?.dateOfBirth || '';
    rowData[SHEET_COLUMNS.TRANSACTIONAL_CONSENT - 1] = data.contactInfo?.transactionalConsent || false;
    rowData[SHEET_COLUMNS.MARKETING_CONSENT - 1] = data.contactInfo?.marketingConsent || false;
    
    // Pre-qualification (columns 12-16)
    rowData[SHEET_COLUMNS.STATE - 1] = data.preQualification?.state || '';
    rowData[SHEET_COLUMNS.MILITARY_STATUS - 1] = data.preQualification?.militaryStatus || '';
    rowData[SHEET_COLUMNS.BRANCH - 1] = data.preQualification?.branchOfService || '';
    rowData[SHEET_COLUMNS.MARITAL_STATUS - 1] = data.preQualification?.maritalStatus || '';
    rowData[SHEET_COLUMNS.COVERAGE_AMOUNT - 1] = data.preQualification?.coverageAmount || '';
    
    // Medical (columns 17-22)
    rowData[SHEET_COLUMNS.TOBACCO_USE - 1] = data.medicalAnswers?.tobaccoUse || '';
    rowData[SHEET_COLUMNS.MEDICAL_CONDITIONS - 1] = data.medicalAnswers?.medicalConditions || '';
    rowData[SHEET_COLUMNS.HEIGHT - 1] = data.medicalAnswers?.height || '';
    rowData[SHEET_COLUMNS.WEIGHT - 1] = data.medicalAnswers?.weight || '';
    rowData[SHEET_COLUMNS.HOSPITAL_CARE - 1] = data.medicalAnswers?.hospitalCare || '';
    rowData[SHEET_COLUMNS.DIABETES_MEDICATION - 1] = data.medicalAnswers?.diabetesMedication || '';
    
    // Application (columns 23-35)
    rowData[SHEET_COLUMNS.STREET_ADDRESS - 1] = data.applicationData?.streetAddress || '';
    rowData[SHEET_COLUMNS.CITY - 1] = data.applicationData?.city || '';
    rowData[SHEET_COLUMNS.APPLICATION_STATE - 1] = data.applicationData?.state || '';
    rowData[SHEET_COLUMNS.ZIP_CODE - 1] = data.applicationData?.zipCode || '';
    rowData[SHEET_COLUMNS.BENEFICIARY_NAME - 1] = data.applicationData?.beneficiaryName || '';
    rowData[SHEET_COLUMNS.BENEFICIARY_RELATIONSHIP - 1] = data.applicationData?.beneficiaryRelationship || '';
    rowData[SHEET_COLUMNS.VA_NUMBER - 1] = data.applicationData?.vaNumber || '';
    rowData[SHEET_COLUMNS.SERVICE_CONNECTED - 1] = data.applicationData?.serviceConnected || '';
    rowData[SHEET_COLUMNS.SSN - 1] = data.applicationData?.ssn || '';
    rowData[SHEET_COLUMNS.DRIVERS_LICENSE - 1] = data.applicationData?.driversLicense || '';
    rowData[SHEET_COLUMNS.BANK_NAME - 1] = data.applicationData?.bankName || '';
    rowData[SHEET_COLUMNS.ROUTING_NUMBER - 1] = data.applicationData?.routingNumber || '';
    rowData[SHEET_COLUMNS.ACCOUNT_NUMBER - 1] = data.applicationData?.accountNumber || '';
    
    // Quote Data (columns 36-41) - CRITICAL FIX
    const policyDate = data.quoteData?.policyDate || '';
    const quoteCoverage = data.quoteData?.coverage || '';
    const quotePremium = data.quoteData?.premium || '';
    const quoteAge = data.quoteData?.age || '';
    const quoteGender = data.quoteData?.gender || '';
    const quoteType = data.quoteData?.type || '';
    
    Logger.log(`[${sessionId}] Quote data values: policyDate=${policyDate}, coverage=${quoteCoverage}, premium=${quotePremium}, age=${quoteAge}, gender=${quoteGender}, type=${quoteType}`);
    
    rowData[SHEET_COLUMNS.POLICY_DATE - 1] = policyDate;
    rowData[SHEET_COLUMNS.QUOTE_COVERAGE - 1] = quoteCoverage;
    rowData[SHEET_COLUMNS.QUOTE_PREMIUM - 1] = quotePremium;
    rowData[SHEET_COLUMNS.QUOTE_AGE - 1] = quoteAge;
    rowData[SHEET_COLUMNS.QUOTE_GENDER - 1] = quoteGender;
    rowData[SHEET_COLUMNS.QUOTE_TYPE - 1] = quoteType;
    
    Logger.log(`[${sessionId}] Quote data array positions: [35]=${rowData[35]}, [36]=${rowData[36]}, [37]=${rowData[37]}, [38]=${rowData[38]}, [39]=${rowData[39]}, [40]=${rowData[40]}`);
    
    // Tracking (columns 42-49)
    rowData[SHEET_COLUMNS.CURRENT_STEP - 1] = data.trackingData?.currentStep || '';
    rowData[SHEET_COLUMNS.STEP_NAME - 1] = data.trackingData?.stepName || '';
    rowData[SHEET_COLUMNS.FORM_TYPE - 1] = 'Application';
    
    // Core (columns 1-4)
    rowData[SHEET_COLUMNS.TIMESTAMP - 1] = new Date();
    rowData[SHEET_COLUMNS.SESSION_ID - 1] = sessionId;
    rowData[SHEET_COLUMNS.STATUS - 1] = 'Application';
    rowData[SHEET_COLUMNS.LAST_ACTIVITY - 1] = new Date();
    
    // Email flags (columns 50-51)
    rowData[SHEET_COLUMNS.PARTIAL_EMAIL_SENT - 1] = 'No';
    rowData[SHEET_COLUMNS.COMPLETED_EMAIL_SENT - 1] = 'No';
    
    Logger.log(`[${sessionId}] About to append row with ${rowData.length} elements`);
    Logger.log(`[${sessionId}] Quote data: ${rowData[35]}, ${rowData[36]}, ${rowData[37]}, ${rowData[38]}, ${rowData[39]}, ${rowData[40]}`);
    
    sheet.appendRow(rowData);
    Logger.log(`[${sessionId}] Row written successfully`);
    
    return {
      success: true,
      sessionId: sessionId,
      message: 'Application submitted successfully'
    };
    
  } catch (error) {
    Logger.log(`[${sessionId}] Error in handleApplicationSubmission: ${error.toString()}`);
    throw error;
  }
}

function handlePartialSubmission(data, sessionId) {
  Logger.log(`[${sessionId}] Processing Partial submission`);
  Logger.log(`[${sessionId}] Quote data received: ${JSON.stringify(data.quoteData)}`);
  
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const rowData = new Array(51).fill('');
    
    // Same mapping as Application but with Partial status
    rowData[SHEET_COLUMNS.FIRST_NAME - 1] = data.contactInfo?.firstName || '';
    rowData[SHEET_COLUMNS.LAST_NAME - 1] = data.contactInfo?.lastName || '';
    rowData[SHEET_COLUMNS.EMAIL - 1] = data.contactInfo?.email || '';
    rowData[SHEET_COLUMNS.PHONE - 1] = data.contactInfo?.phone || '';
    rowData[SHEET_COLUMNS.DOB - 1] = data.contactInfo?.dateOfBirth || '';
    rowData[SHEET_COLUMNS.TRANSACTIONAL_CONSENT - 1] = data.contactInfo?.transactionalConsent || false;
    rowData[SHEET_COLUMNS.MARKETING_CONSENT - 1] = data.contactInfo?.marketingConsent || false;
    
    rowData[SHEET_COLUMNS.STATE - 1] = data.preQualification?.state || '';
    rowData[SHEET_COLUMNS.MILITARY_STATUS - 1] = data.preQualification?.militaryStatus || '';
    rowData[SHEET_COLUMNS.BRANCH - 1] = data.preQualification?.branchOfService || '';
    rowData[SHEET_COLUMNS.MARITAL_STATUS - 1] = data.preQualification?.maritalStatus || '';
    rowData[SHEET_COLUMNS.COVERAGE_AMOUNT - 1] = data.preQualification?.coverageAmount || '';
    
    rowData[SHEET_COLUMNS.TOBACCO_USE - 1] = data.medicalAnswers?.tobaccoUse || '';
    rowData[SHEET_COLUMNS.MEDICAL_CONDITIONS - 1] = data.medicalAnswers?.medicalConditions || '';
    rowData[SHEET_COLUMNS.HEIGHT - 1] = data.medicalAnswers?.height || '';
    rowData[SHEET_COLUMNS.WEIGHT - 1] = data.medicalAnswers?.weight || '';
    rowData[SHEET_COLUMNS.HOSPITAL_CARE - 1] = data.medicalAnswers?.hospitalCare || '';
    rowData[SHEET_COLUMNS.DIABETES_MEDICATION - 1] = data.medicalAnswers?.diabetesMedication || '';
    
    rowData[SHEET_COLUMNS.STREET_ADDRESS - 1] = data.applicationData?.streetAddress || '';
    rowData[SHEET_COLUMNS.CITY - 1] = data.applicationData?.city || '';
    rowData[SHEET_COLUMNS.APPLICATION_STATE - 1] = data.applicationData?.state || '';
    rowData[SHEET_COLUMNS.ZIP_CODE - 1] = data.applicationData?.zipCode || '';
    rowData[SHEET_COLUMNS.BENEFICIARY_NAME - 1] = data.applicationData?.beneficiaryName || '';
    rowData[SHEET_COLUMNS.BENEFICIARY_RELATIONSHIP - 1] = data.applicationData?.beneficiaryRelationship || '';
    rowData[SHEET_COLUMNS.VA_NUMBER - 1] = data.applicationData?.vaNumber || '';
    rowData[SHEET_COLUMNS.SERVICE_CONNECTED - 1] = data.applicationData?.serviceConnected || '';
    rowData[SHEET_COLUMNS.SSN - 1] = data.applicationData?.ssn || '';
    rowData[SHEET_COLUMNS.DRIVERS_LICENSE - 1] = data.applicationData?.driversLicense || '';
    rowData[SHEET_COLUMNS.BANK_NAME - 1] = data.applicationData?.bankName || '';
    rowData[SHEET_COLUMNS.ROUTING_NUMBER - 1] = data.applicationData?.routingNumber || '';
    rowData[SHEET_COLUMNS.ACCOUNT_NUMBER - 1] = data.applicationData?.accountNumber || '';
    
    const policyDate = data.quoteData?.policyDate || '';
    const quoteCoverage = data.quoteData?.coverage || '';
    const quotePremium = data.quoteData?.premium || '';
    const quoteAge = data.quoteData?.age || '';
    const quoteGender = data.quoteData?.gender || '';
    const quoteType = data.quoteData?.type || '';
    
    Logger.log(`[${sessionId}] Partial - Quote data values: policyDate=${policyDate}, coverage=${quoteCoverage}, premium=${quotePremium}, age=${quoteAge}, gender=${quoteGender}, type=${quoteType}`);
    
    rowData[SHEET_COLUMNS.POLICY_DATE - 1] = policyDate;
    rowData[SHEET_COLUMNS.QUOTE_COVERAGE - 1] = quoteCoverage;
    rowData[SHEET_COLUMNS.QUOTE_PREMIUM - 1] = quotePremium;
    rowData[SHEET_COLUMNS.QUOTE_AGE - 1] = quoteAge;
    rowData[SHEET_COLUMNS.QUOTE_GENDER - 1] = quoteGender;
    rowData[SHEET_COLUMNS.QUOTE_TYPE - 1] = quoteType;
    
    Logger.log(`[${sessionId}] Partial - Quote data array positions: [35]=${rowData[35]}, [36]=${rowData[36]}, [37]=${rowData[37]}, [38]=${rowData[38]}, [39]=${rowData[39]}, [40]=${rowData[40]}`);
    
    rowData[SHEET_COLUMNS.CURRENT_STEP - 1] = data.trackingData?.currentStep || '';
    rowData[SHEET_COLUMNS.STEP_NAME - 1] = data.trackingData?.stepName || '';
    rowData[SHEET_COLUMNS.FORM_TYPE - 1] = 'Partial';
    
    rowData[SHEET_COLUMNS.TIMESTAMP - 1] = new Date();
    rowData[SHEET_COLUMNS.SESSION_ID - 1] = sessionId;
    rowData[SHEET_COLUMNS.STATUS - 1] = 'Partial';
    rowData[SHEET_COLUMNS.LAST_ACTIVITY - 1] = new Date();
    
    rowData[SHEET_COLUMNS.PARTIAL_EMAIL_SENT - 1] = 'No';
    rowData[SHEET_COLUMNS.COMPLETED_EMAIL_SENT - 1] = 'No';
    
    sheet.appendRow(rowData);
    
    return {
      success: true,
      sessionId: sessionId,
      message: 'Partial submission recorded'
    };
    
  } catch (error) {
    Logger.log(`[${sessionId}] Error in handlePartialSubmission: ${error.toString()}`);
    throw error;
  }
}

function handleLeadSubmission(data, sessionId) {
  Logger.log(`[${sessionId}] Processing Lead submission`);
  
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const rowData = new Array(51).fill('');
    
    // Same mapping as Application but with Lead status
    rowData[SHEET_COLUMNS.FIRST_NAME - 1] = data.contactInfo?.firstName || '';
    rowData[SHEET_COLUMNS.LAST_NAME - 1] = data.contactInfo?.lastName || '';
    rowData[SHEET_COLUMNS.EMAIL - 1] = data.contactInfo?.email || '';
    rowData[SHEET_COLUMNS.PHONE - 1] = data.contactInfo?.phone || '';
    rowData[SHEET_COLUMNS.DOB - 1] = data.contactInfo?.dateOfBirth || '';
    rowData[SHEET_COLUMNS.TRANSACTIONAL_CONSENT - 1] = data.contactInfo?.transactionalConsent || false;
    rowData[SHEET_COLUMNS.MARKETING_CONSENT - 1] = data.contactInfo?.marketingConsent || false;
    
    rowData[SHEET_COLUMNS.STATE - 1] = data.preQualification?.state || '';
    rowData[SHEET_COLUMNS.MILITARY_STATUS - 1] = data.preQualification?.militaryStatus || '';
    rowData[SHEET_COLUMNS.BRANCH - 1] = data.preQualification?.branchOfService || '';
    rowData[SHEET_COLUMNS.MARITAL_STATUS - 1] = data.preQualification?.maritalStatus || '';
    rowData[SHEET_COLUMNS.COVERAGE_AMOUNT - 1] = data.preQualification?.coverageAmount || '';
    
    rowData[SHEET_COLUMNS.TOBACCO_USE - 1] = data.medicalAnswers?.tobaccoUse || '';
    rowData[SHEET_COLUMNS.MEDICAL_CONDITIONS - 1] = data.medicalAnswers?.medicalConditions || '';
    rowData[SHEET_COLUMNS.HEIGHT - 1] = data.medicalAnswers?.height || '';
    rowData[SHEET_COLUMNS.WEIGHT - 1] = data.medicalAnswers?.weight || '';
    rowData[SHEET_COLUMNS.HOSPITAL_CARE - 1] = data.medicalAnswers?.hospitalCare || '';
    rowData[SHEET_COLUMNS.DIABETES_MEDICATION - 1] = data.medicalAnswers?.diabetesMedication || '';
    
    rowData[SHEET_COLUMNS.STREET_ADDRESS - 1] = data.applicationData?.streetAddress || '';
    rowData[SHEET_COLUMNS.CITY - 1] = data.applicationData?.city || '';
    rowData[SHEET_COLUMNS.APPLICATION_STATE - 1] = data.applicationData?.state || '';
    rowData[SHEET_COLUMNS.ZIP_CODE - 1] = data.applicationData?.zipCode || '';
    rowData[SHEET_COLUMNS.BENEFICIARY_NAME - 1] = data.applicationData?.beneficiaryName || '';
    rowData[SHEET_COLUMNS.BENEFICIARY_RELATIONSHIP - 1] = data.applicationData?.beneficiaryRelationship || '';
    rowData[SHEET_COLUMNS.VA_NUMBER - 1] = data.applicationData?.vaNumber || '';
    rowData[SHEET_COLUMNS.SERVICE_CONNECTED - 1] = data.applicationData?.serviceConnected || '';
    rowData[SHEET_COLUMNS.SSN - 1] = data.applicationData?.ssn || '';
    rowData[SHEET_COLUMNS.DRIVERS_LICENSE - 1] = data.applicationData?.driversLicense || '';
    rowData[SHEET_COLUMNS.BANK_NAME - 1] = data.applicationData?.bankName || '';
    rowData[SHEET_COLUMNS.ROUTING_NUMBER - 1] = data.applicationData?.routingNumber || '';
    rowData[SHEET_COLUMNS.ACCOUNT_NUMBER - 1] = data.applicationData?.accountNumber || '';
    
    rowData[SHEET_COLUMNS.POLICY_DATE - 1] = data.quoteData?.policyDate || '';
    rowData[SHEET_COLUMNS.QUOTE_COVERAGE - 1] = data.quoteData?.coverage || '';
    rowData[SHEET_COLUMNS.QUOTE_PREMIUM - 1] = data.quoteData?.premium || '';
    rowData[SHEET_COLUMNS.QUOTE_AGE - 1] = data.quoteData?.age || '';
    rowData[SHEET_COLUMNS.QUOTE_GENDER - 1] = data.quoteData?.gender || '';
    rowData[SHEET_COLUMNS.QUOTE_TYPE - 1] = data.quoteData?.type || '';
    
    rowData[SHEET_COLUMNS.CURRENT_STEP - 1] = data.trackingData?.currentStep || '';
    rowData[SHEET_COLUMNS.STEP_NAME - 1] = data.trackingData?.stepName || '';
    rowData[SHEET_COLUMNS.FORM_TYPE - 1] = 'Lead';
    
    rowData[SHEET_COLUMNS.TIMESTAMP - 1] = new Date();
    rowData[SHEET_COLUMNS.SESSION_ID - 1] = sessionId;
    rowData[SHEET_COLUMNS.STATUS - 1] = 'Lead';
    rowData[SHEET_COLUMNS.LAST_ACTIVITY - 1] = new Date();
    
    rowData[SHEET_COLUMNS.PARTIAL_EMAIL_SENT - 1] = 'No';
    rowData[SHEET_COLUMNS.COMPLETED_EMAIL_SENT - 1] = 'No';
    
    sheet.appendRow(rowData);
    
    return {
      success: true,
      sessionId: sessionId,
      message: 'Lead submitted successfully'
    };
    
  } catch (error) {
    Logger.log(`[${sessionId}] Error in handleLeadSubmission: ${error.toString()}`);
    throw error;
  }
}

function handleLeadPartialSubmission(data, sessionId) {
  Logger.log(`[${sessionId}] Processing LeadPartial submission`);
  
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const rowData = new Array(51).fill('');
    
    // Same mapping as Application but with LeadPartial status
    rowData[SHEET_COLUMNS.FIRST_NAME - 1] = data.contactInfo?.firstName || '';
    rowData[SHEET_COLUMNS.LAST_NAME - 1] = data.contactInfo?.lastName || '';
    rowData[SHEET_COLUMNS.EMAIL - 1] = data.contactInfo?.email || '';
    rowData[SHEET_COLUMNS.PHONE - 1] = data.contactInfo?.phone || '';
    rowData[SHEET_COLUMNS.DOB - 1] = data.contactInfo?.dateOfBirth || '';
    rowData[SHEET_COLUMNS.TRANSACTIONAL_CONSENT - 1] = data.contactInfo?.transactionalConsent || false;
    rowData[SHEET_COLUMNS.MARKETING_CONSENT - 1] = data.contactInfo?.marketingConsent || false;
    
    rowData[SHEET_COLUMNS.STATE - 1] = data.preQualification?.state || '';
    rowData[SHEET_COLUMNS.MILITARY_STATUS - 1] = data.preQualification?.militaryStatus || '';
    rowData[SHEET_COLUMNS.BRANCH - 1] = data.preQualification?.branchOfService || '';
    rowData[SHEET_COLUMNS.MARITAL_STATUS - 1] = data.preQualification?.maritalStatus || '';
    rowData[SHEET_COLUMNS.COVERAGE_AMOUNT - 1] = data.preQualification?.coverageAmount || '';
    
    rowData[SHEET_COLUMNS.TOBACCO_USE - 1] = data.medicalAnswers?.tobaccoUse || '';
    rowData[SHEET_COLUMNS.MEDICAL_CONDITIONS - 1] = data.medicalAnswers?.medicalConditions || '';
    rowData[SHEET_COLUMNS.HEIGHT - 1] = data.medicalAnswers?.height || '';
    rowData[SHEET_COLUMNS.WEIGHT - 1] = data.medicalAnswers?.weight || '';
    rowData[SHEET_COLUMNS.HOSPITAL_CARE - 1] = data.medicalAnswers?.hospitalCare || '';
    rowData[SHEET_COLUMNS.DIABETES_MEDICATION - 1] = data.medicalAnswers?.diabetesMedication || '';
    
    rowData[SHEET_COLUMNS.STREET_ADDRESS - 1] = data.applicationData?.streetAddress || '';
    rowData[SHEET_COLUMNS.CITY - 1] = data.applicationData?.city || '';
    rowData[SHEET_COLUMNS.APPLICATION_STATE - 1] = data.applicationData?.state || '';
    rowData[SHEET_COLUMNS.ZIP_CODE - 1] = data.applicationData?.zipCode || '';
    rowData[SHEET_COLUMNS.BENEFICIARY_NAME - 1] = data.applicationData?.beneficiaryName || '';
    rowData[SHEET_COLUMNS.BENEFICIARY_RELATIONSHIP - 1] = data.applicationData?.beneficiaryRelationship || '';
    rowData[SHEET_COLUMNS.VA_NUMBER - 1] = data.applicationData?.vaNumber || '';
    rowData[SHEET_COLUMNS.SERVICE_CONNECTED - 1] = data.applicationData?.serviceConnected || '';
    rowData[SHEET_COLUMNS.SSN - 1] = data.applicationData?.ssn || '';
    rowData[SHEET_COLUMNS.DRIVERS_LICENSE - 1] = data.applicationData?.driversLicense || '';
    rowData[SHEET_COLUMNS.BANK_NAME - 1] = data.applicationData?.bankName || '';
    rowData[SHEET_COLUMNS.ROUTING_NUMBER - 1] = data.applicationData?.routingNumber || '';
    rowData[SHEET_COLUMNS.ACCOUNT_NUMBER - 1] = data.applicationData?.accountNumber || '';
    
    rowData[SHEET_COLUMNS.POLICY_DATE - 1] = data.quoteData?.policyDate || '';
    rowData[SHEET_COLUMNS.QUOTE_COVERAGE - 1] = data.quoteData?.coverage || '';
    rowData[SHEET_COLUMNS.QUOTE_PREMIUM - 1] = data.quoteData?.premium || '';
    rowData[SHEET_COLUMNS.QUOTE_AGE - 1] = data.quoteData?.age || '';
    rowData[SHEET_COLUMNS.QUOTE_GENDER - 1] = data.quoteData?.gender || '';
    rowData[SHEET_COLUMNS.QUOTE_TYPE - 1] = data.quoteData?.type || '';
    
    rowData[SHEET_COLUMNS.CURRENT_STEP - 1] = data.trackingData?.currentStep || '';
    rowData[SHEET_COLUMNS.STEP_NAME - 1] = data.trackingData?.stepName || '';
    rowData[SHEET_COLUMNS.FORM_TYPE - 1] = 'LeadPartial';
    
    rowData[SHEET_COLUMNS.TIMESTAMP - 1] = new Date();
    rowData[SHEET_COLUMNS.SESSION_ID - 1] = sessionId;
    rowData[SHEET_COLUMNS.STATUS - 1] = 'LeadPartial';
    rowData[SHEET_COLUMNS.LAST_ACTIVITY - 1] = new Date();
    
    rowData[SHEET_COLUMNS.PARTIAL_EMAIL_SENT - 1] = 'No';
    rowData[SHEET_COLUMNS.COMPLETED_EMAIL_SENT - 1] = 'No';
    
    sheet.appendRow(rowData);
    
    return {
      success: true,
      sessionId: sessionId,
      message: 'Lead partial submitted successfully'
    };
    
  } catch (error) {
    Logger.log(`[${sessionId}] Error in handleLeadPartialSubmission: ${error.toString()}`);
    throw error;
  }
}

function testNewEntriesAndEmails() {
  Logger.log('Running testNewEntriesAndEmails function');
  
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Test data that matches the new FunnelStore structure exactly
    const testData1 = {
      sessionId: 'TEST_1_' + Date.now(),
      formType: 'Application',
      contactInfo: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '555-123-4567',
        dateOfBirth: '1990-01-01',
        transactionalConsent: true,
        marketingConsent: true
      },
      preQualification: {
        state: 'CA',
        militaryStatus: 'Veteran',
        branchOfService: 'Army',
        maritalStatus: 'Single',
        coverageAmount: '$100,000'
      },
      medicalAnswers: {
        tobaccoUse: 'No',
        medicalConditions: 'None',
        height: "5'10\"",
        weight: '180',
        hospitalCare: 'No',
        diabetesMedication: 'No',
        age: '30'
      },
      applicationData: {
        streetAddress: '123 Test Street',
        city: 'Test City',
        state: 'CA',
        zipCode: '90210',
        beneficiaryName: 'Jane Doe',
        beneficiaryRelationship: 'Spouse',
        vaNumber: '123456789',
        serviceConnected: 'No',
        ssn: '123-45-6789',
        driversLicense: 'CA1234567',
        bankName: 'Test Bank',
        routingNumber: '123456789',
        accountNumber: '987654321'
      },
      quoteData: {
        policyDate: '2024-01-15',
        coverage: '$100,000',
        premium: '$45.00',
        age: '30',
        gender: 'Male',
        type: 'Term Life'
      },
      trackingData: {
        currentStep: '18',
        stepName: 'Application Complete'
      }
    };
    
    const testData2 = {
      sessionId: 'TEST_2_' + Date.now(),
      formType: 'Lead',
      contactInfo: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '555-987-6543',
        dateOfBirth: '1985-05-15',
        transactionalConsent: true,
        marketingConsent: false
      },
      preQualification: {
        state: 'TX',
        militaryStatus: 'Active Duty',
        branchOfService: 'Navy',
        maritalStatus: 'Married',
        coverageAmount: '$250,000'
      },
      medicalAnswers: {
        tobaccoUse: 'No',
        medicalConditions: 'Hypertension',
        height: "5'8\"",
        weight: '160',
        hospitalCare: 'Yes',
        diabetesMedication: 'No',
        age: '35'
      },
      applicationData: {
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        beneficiaryName: '',
        beneficiaryRelationship: '',
        vaNumber: '',
        serviceConnected: '',
        ssn: '',
        driversLicense: '',
        bankName: '',
        routingNumber: '',
        accountNumber: ''
      },
      quoteData: {
        policyDate: '',
        coverage: '',
        premium: '',
        age: '',
        gender: '',
        type: ''
      },
      trackingData: {
        currentStep: '6',
        stepName: 'Contact Information'
      }
    };
    
    const testData3 = {
      sessionId: 'TEST_3_' + Date.now(),
      formType: 'Partial',
      contactInfo: {
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@example.com',
        phone: '555-555-5555',
        dateOfBirth: '1975-12-25',
        transactionalConsent: false,
        marketingConsent: true
      },
      preQualification: {
        state: 'FL',
        militaryStatus: 'Veteran',
        branchOfService: 'Air Force',
        maritalStatus: 'Divorced',
        coverageAmount: '$500,000'
      },
      medicalAnswers: {
        tobaccoUse: 'Yes',
        medicalConditions: 'Diabetes',
        height: "6'0\"",
        weight: '200',
        hospitalCare: 'Yes',
        diabetesMedication: 'Yes',
        age: '45'
      },
      applicationData: {
        streetAddress: '456 Partial Ave',
        city: 'Partial City',
        state: 'FL',
        zipCode: '33101',
        beneficiaryName: 'Child Johnson',
        beneficiaryRelationship: 'Child',
        vaNumber: '987654321',
        serviceConnected: 'Yes',
        ssn: '987-65-4321',
        driversLicense: 'FL9876543',
        bankName: 'Partial Bank',
        routingNumber: '987654321',
        accountNumber: '123456789'
      },
      quoteData: {
        policyDate: '2024-02-20',
        coverage: '$500,000',
        premium: '$125.00',
        age: '45',
        gender: 'Male',
        type: 'Term Life'
      },
      trackingData: {
        currentStep: '12',
        stepName: 'Diabetes Medication'
      }
    };
    
    // Process all test data
    handleApplicationSubmission(testData1, testData1.sessionId);
    handleLeadSubmission(testData2, testData2.sessionId);
    handlePartialSubmission(testData3, testData3.sessionId);
    
    Logger.log('testNewEntriesAndEmails completed successfully');
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Test data written successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log(`Error in testNewEntriesAndEmails: ${error.toString()}`);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
} 

function setupHeaders() {
  try {
    Logger.log('Using active sheet for setupHeaders');
    const sheet = SpreadsheetApp.getActiveSheet();
    
    if (!sheet) {
      throw new Error('No active sheet found');
    }
    
    Logger.log('Active sheet name: ' + sheet.getName());
    
    // Define headers for 51 columns
    const headers = [
      'Timestamp',
      'Session ID', 
      'Status',
      'Last Activity',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Date of Birth',
      'Transactional Consent',
      'Marketing Consent',
      'State',
      'Military Status',
      'Branch of Service',
      'Marital Status',
      'Coverage Amount',
      'Tobacco Use',
      'Medical Conditions',
      'Height',
      'Weight',
      'Hospital Care',
      'Diabetes Medication',
      'Street Address',
      'City',
      'Application State',
      'ZIP Code',
      'Beneficiary Name',
      'Beneficiary Relationship',
      'VA Number',
      'Service Connected',
      'SSN',
      'Driver\'s License',
      'Bank Name',
      'Routing Number',
      'Account Number',
      'Policy Date',
      'Quote Coverage',
      'Quote Premium',
      'Quote Age',
      'Quote Gender',
      'Quote Type',
      'Current Step',
      'Step Name',
      'Form Type',
      'User Agent',
      'Referrer',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
      'Partial Email Sent',
      'Completed Email Sent'
    ];
    
    // Clear existing headers and set new ones
    Logger.log('Clearing existing data and setting headers...');
    sheet.clear();
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    Logger.log('Headers set successfully');
    
    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');
    
    // Auto-resize columns
    for (let i = 1; i <= headers.length; i++) {
      sheet.autoResizeColumn(i);
    }
    
    Logger.log('Headers setup completed successfully');
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Headers setup completed successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log(`Error in setupHeaders: ${error.toString()}`);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
} 