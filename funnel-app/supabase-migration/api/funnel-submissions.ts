import { createClient } from '@supabase/supabase-js'
import { sendEmail } from '../services/email-service'
import { sendSMS } from '../services/sms-service'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Types matching the Google Apps Script structure
interface ContactInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  transactionalConsent: boolean
  marketingConsent: boolean
}

interface PreQualification {
  state: string
  militaryStatus: string
  branchOfService: string
  maritalStatus: string
  coverageAmount: string
}

interface MedicalAnswers {
  tobaccoUse: string
  medicalConditions: string
  height: string
  weight: string
  hospitalCare: string
  diabetesMedication: string
  age: string
}

interface ApplicationData {
  streetAddress: string
  city: string
  state: string
  zipCode: string
  beneficiaryName: string
  beneficiaryRelationship: string
  vaNumber: string
  serviceConnected: string
  ssn: string
  driversLicense: string
  bankName: string
  routingNumber: string
  accountNumber: string
}

interface QuoteData {
  policyDate: string
  coverage: string
  premium: string
  age: string
  gender: string
  type: string
}

interface TrackingData {
  currentStep: string
  stepName: string
}

interface FunnelSubmission {
  sessionId: string
  formType: 'Lead' | 'LeadPartial' | 'Partial' | 'Application'
  contactInfo: ContactInfo
  preQualification: PreQualification
  medicalAnswers: MedicalAnswers
  applicationData: ApplicationData
  quoteData: QuoteData
  trackingData: TrackingData
}

// Helper function to get configuration
async function getConfig(key: string): Promise<string> {
  const { data, error } = await supabase
    .from('config')
    .select('value')
    .eq('key', key)
    .single()
  
  if (error) throw new Error(`Failed to get config: ${error.message}`)
  return data.value
}

// Helper function to update session
async function updateSession(sessionId: string, submissionId: string, currentStep: number, stepName: string) {
  const { error } = await supabase
    .from('sessions')
    .upsert({
      session_id: sessionId,
      submission_id: submissionId,
      current_step: currentStep,
      step_name: stepName,
      last_activity: new Date().toISOString()
    })
  
  if (error) throw new Error(`Failed to update session: ${error.message}`)
}

// Helper function to log email notification
async function logEmailNotification(
  submissionId: string,
  notificationType: string,
  recipientEmail: string,
  subject: string,
  htmlContent: string
) {
  const { error } = await supabase
    .from('email_notifications')
    .insert({
      submission_id: submissionId,
      notification_type: notificationType,
      recipient_email: recipientEmail,
      subject: subject,
      html_content: htmlContent
    })
  
  if (error) console.error('Failed to log email notification:', error)
}

// Helper function to log SMS notification
async function logSMSNotification(
  submissionId: string,
  notificationType: string,
  recipientPhone: string,
  message: string
) {
  const { error } = await supabase
    .from('sms_notifications')
    .insert({
      submission_id: submissionId,
      notification_type: notificationType,
      recipient_phone: recipientPhone,
      message: message
    })
  
  if (error) console.error('Failed to log SMS notification:', error)
}

// Main submission handler (replaces doPost)
export async function handleFunnelSubmission(submission: FunnelSubmission) {
  const sessionId = submission.sessionId
  console.log(`[${sessionId}] Processing ${submission.formType} submission`)
  
  try {
    // Insert submission data
    const { data: submissionData, error: insertError } = await supabase
      .from('funnel_submissions')
      .insert({
        session_id: sessionId,
        status: submission.formType,
        first_name: submission.contactInfo.firstName,
        last_name: submission.contactInfo.lastName,
        email: submission.contactInfo.email,
        phone: submission.contactInfo.phone,
        date_of_birth: submission.contactInfo.dateOfBirth,
        transactional_consent: submission.contactInfo.transactionalConsent,
        marketing_consent: submission.contactInfo.marketingConsent,
        state: submission.preQualification.state,
        military_status: submission.preQualification.militaryStatus,
        branch_of_service: submission.preQualification.branchOfService,
        marital_status: submission.preQualification.maritalStatus,
        coverage_amount: submission.preQualification.coverageAmount,
        tobacco_use: submission.medicalAnswers.tobaccoUse,
        medical_conditions: submission.medicalAnswers.medicalConditions,
        height: submission.medicalAnswers.height,
        weight: submission.medicalAnswers.weight,
        hospital_care: submission.medicalAnswers.hospitalCare,
        diabetes_medication: submission.medicalAnswers.diabetesMedication,
        street_address: submission.applicationData.streetAddress,
        city: submission.applicationData.city,
        application_state: submission.applicationData.state,
        zip_code: submission.applicationData.zipCode,
        beneficiary_name: submission.applicationData.beneficiaryName,
        beneficiary_relationship: submission.applicationData.beneficiaryRelationship,
        va_number: submission.applicationData.vaNumber,
        service_connected: submission.applicationData.serviceConnected,
        ssn: submission.applicationData.ssn,
        drivers_license: submission.applicationData.driversLicense,
        bank_name: submission.applicationData.bankName,
        routing_number: submission.applicationData.routingNumber,
        account_number: submission.applicationData.accountNumber,
        policy_date: submission.quoteData.policyDate,
        quote_coverage: submission.quoteData.coverage,
        quote_premium: submission.quoteData.premium,
        quote_age: submission.quoteData.age,
        quote_gender: submission.quoteData.gender,
        quote_type: submission.quoteData.type,
        current_step: submission.trackingData.currentStep,
        step_name: submission.trackingData.stepName,
        form_type: submission.formType
      })
      .select()
      .single()
    
    if (insertError) throw new Error(`Failed to insert submission: ${insertError.message}`)
    
    // Update session
    await updateSession(sessionId, submissionData.id, parseInt(submission.trackingData.currentStep), submission.trackingData.stepName)
    
    // Handle notifications based on form type
    switch (submission.formType) {
      case 'Lead':
        await handleLeadNotifications(submission, submissionData.id)
        break
      case 'LeadPartial':
        await handleLeadPartialNotifications(submission, submissionData.id)
        break
      case 'Partial':
        await handlePartialNotifications(submission, submissionData.id)
        break
      case 'Application':
        await handleApplicationNotifications(submission, submissionData.id)
        break
    }
    
    console.log(`[${sessionId}] ${submission.formType} submission processed successfully`)
    return {
      success: true,
      sessionId: sessionId,
      message: `${submission.formType} submitted successfully`
    }
    
  } catch (error) {
    console.error(`[${sessionId}] Error processing submission:`, error)
    throw error
  }
}

// Lead notifications (replaces sendLeadNotification)
async function handleLeadNotifications(submission: FunnelSubmission, submissionId: string) {
  console.log(`[${submission.sessionId}] Sending Lead notifications`)
  
  try {
    const adminEmail = await getConfig('admin_email')
    const fromEmail = await getConfig('from_email')
    const replyToEmail = await getConfig('reply_to_email')
    
    // Send admin notification
    const adminSubject = `🚨 NEW LEAD: ${submission.contactInfo.firstName} ${submission.contactInfo.lastName} (${submission.preQualification.branchOfService})`
    const adminHtml = generateLeadNotificationHTML(submission)
    
    await sendEmail({
      to: adminEmail,
      from: fromEmail,
      replyTo: replyToEmail,
      subject: adminSubject,
      html: adminHtml
    })
    
    await logEmailNotification(submissionId, 'lead', adminEmail, adminSubject, adminHtml)
    
    // Send customer confirmation
    const customerSubject = 'Thank you for your interest in Veteran Legacy Life Insurance'
    const customerHtml = generateLeadConfirmationHTML(submission)
    
    await sendEmail({
      to: submission.contactInfo.email,
      from: fromEmail,
      replyTo: replyToEmail,
      subject: customerSubject,
      html: customerHtml
    })
    
    await logEmailNotification(submissionId, 'lead_confirmation', submission.contactInfo.email, customerSubject, customerHtml)
    
    // Send SMS notification
    const smsMessage = `NEW LEAD: ${submission.contactInfo.firstName} ${submission.contactInfo.lastName} - ${submission.preQualification.branchOfService} - ${submission.preQualification.coverageAmount} coverage. Contact: ${submission.contactInfo.phone}`
    
    await sendSMS(adminEmail, smsMessage)
    await logSMSNotification(submissionId, 'lead', adminEmail, smsMessage)
    
  } catch (error) {
    console.error(`[${submission.sessionId}] Error sending Lead notifications:`, error)
  }
}

// Lead partial notifications (replaces sendPartialLeadEmail)
async function handleLeadPartialNotifications(submission: FunnelSubmission, submissionId: string) {
  console.log(`[${submission.sessionId}] Sending LeadPartial notifications`)
  
  try {
    const adminEmail = await getConfig('admin_email')
    const fromEmail = await getConfig('from_email')
    const replyToEmail = await getConfig('reply_to_email')
    
    // Send admin alert
    const adminSubject = `⚠️ ABANDONED LEAD: ${submission.contactInfo.firstName} ${submission.contactInfo.lastName} - Follow up needed`
    const adminHtml = generateAbandonmentAlertHTML(submission)
    
    await sendEmail({
      to: adminEmail,
      from: fromEmail,
      replyTo: replyToEmail,
      subject: adminSubject,
      html: adminHtml
    })
    
    await logEmailNotification(submissionId, 'partial_lead', adminEmail, adminSubject, adminHtml)
    
    // Send customer recovery email
    const customerSubject = 'Complete Your Veteran Legacy Life Insurance Application'
    const customerHtml = generateAbandonmentRecoveryHTML(submission)
    
    await sendEmail({
      to: submission.contactInfo.email,
      from: fromEmail,
      replyTo: replyToEmail,
      subject: customerSubject,
      html: customerHtml
    })
    
    await logEmailNotification(submissionId, 'abandonment_recovery', submission.contactInfo.email, customerSubject, customerHtml)
    
    // Send SMS alert
    const smsMessage = `ABANDONED LEAD: ${submission.contactInfo.firstName} ${submission.contactInfo.lastName} - ${submission.preQualification.branchOfService} - ${submission.preQualification.coverageAmount} coverage. Contact: ${submission.contactInfo.phone} - Follow up needed!`
    
    await sendSMS(adminEmail, smsMessage)
    await logSMSNotification(submissionId, 'abandonment_alert', adminEmail, smsMessage)
    
  } catch (error) {
    console.error(`[${submission.sessionId}] Error sending LeadPartial notifications:`, error)
  }
}

// Partial notifications (replaces sendPartialLeadEmail for Partial type)
async function handlePartialNotifications(submission: FunnelSubmission, submissionId: string) {
  console.log(`[${submission.sessionId}] Sending Partial notifications`)
  
  try {
    const adminEmail = await getConfig('admin_email')
    const fromEmail = await getConfig('from_email')
    const replyToEmail = await getConfig('reply_to_email')
    
    // Send admin alert
    const adminSubject = `⚠️ PARTIAL APPLICATION: ${submission.contactInfo.firstName} ${submission.contactInfo.lastName} - Follow up needed`
    const adminHtml = generatePartialApplicationAlertHTML(submission)
    
    await sendEmail({
      to: adminEmail,
      from: fromEmail,
      replyTo: replyToEmail,
      subject: adminSubject,
      html: adminHtml
    })
    
    await logEmailNotification(submissionId, 'partial_lead', adminEmail, adminSubject, adminHtml)
    
    // Send customer recovery email
    const customerSubject = 'Complete Your Veteran Legacy Life Insurance Application'
    const customerHtml = generateAbandonmentRecoveryHTML(submission)
    
    await sendEmail({
      to: submission.contactInfo.email,
      from: fromEmail,
      replyTo: replyToEmail,
      subject: customerSubject,
      html: customerHtml
    })
    
    await logEmailNotification(submissionId, 'abandonment_recovery', submission.contactInfo.email, customerSubject, customerHtml)
    
  } catch (error) {
    console.error(`[${submission.sessionId}] Error sending Partial notifications:`, error)
  }
}

// Application notifications (replaces sendApplicationNotification)
async function handleApplicationNotifications(submission: FunnelSubmission, submissionId: string) {
  console.log(`[${submission.sessionId}] Sending Application notifications`)
  
  try {
    const adminEmail = await getConfig('admin_email')
    const fromEmail = await getConfig('from_email')
    const replyToEmail = await getConfig('reply_to_email')
    
    // Send admin notification
    const adminSubject = `✅ APPLICATION COMPLETE: ${submission.contactInfo.firstName} ${submission.contactInfo.lastName} - ${submission.quoteData.coverage} Coverage`
    const adminHtml = generateApplicationCompleteHTML(submission)
    
    await sendEmail({
      to: adminEmail,
      from: fromEmail,
      replyTo: replyToEmail,
      subject: adminSubject,
      html: adminHtml
    })
    
    await logEmailNotification(submissionId, 'application_complete', adminEmail, adminSubject, adminHtml)
    
    // Send customer confirmation
    const customerSubject = 'Your Veteran Legacy Life Insurance Application is Complete'
    const customerHtml = generateApplicationConfirmationHTML(submission)
    
    await sendEmail({
      to: submission.contactInfo.email,
      from: fromEmail,
      replyTo: replyToEmail,
      subject: customerSubject,
      html: customerHtml
    })
    
    await logEmailNotification(submissionId, 'application_confirmation', submission.contactInfo.email, customerSubject, customerHtml)
    
    // Send SMS notification
    const smsMessage = `APPLICATION COMPLETE: ${submission.contactInfo.firstName} ${submission.contactInfo.lastName} - ${submission.quoteData.coverage} coverage - ${submission.quoteData.premium} premium. Contact: ${submission.contactInfo.phone}`
    
    await sendSMS(adminEmail, smsMessage)
    await logSMSNotification(submissionId, 'application_complete', adminEmail, smsMessage)
    
  } catch (error) {
    console.error(`[${submission.sessionId}] Error sending Application notifications:`, error)
  }
}

// Test function (replaces testNewEntriesAndEmails)
export async function testNewEntriesAndEmails() {
  console.log('Running testNewEntriesAndEmails function')
  
  try {
    // Test data that matches the FunnelStore structure exactly
    const testData1: FunnelSubmission = {
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
    }
    
    const testData2: FunnelSubmission = {
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
    }
    
    const testData3: FunnelSubmission = {
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
    }
    
    // Process all test data
    await handleFunnelSubmission(testData1)
    await handleFunnelSubmission(testData2)
    await handleFunnelSubmission(testData3)
    
    console.log('testNewEntriesAndEmails completed successfully')
    return {
      success: true,
      message: 'Test data written successfully'
    }
    
  } catch (error) {
    console.error('Error in testNewEntriesAndEmails:', error)
    return {
      success: false,
      error: error.toString()
    }
  }
}

// Export the main handler for use in API routes
export { handleFunnelSubmission as default } 