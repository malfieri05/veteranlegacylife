import twilio from 'twilio'

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

interface SMSOptions {
  to: string
  from: string
  body: string
}

export async function sendSMS(options: SMSOptions): Promise<void> {
  try {
    await client.messages.create({
      to: options.to,
      from: options.from,
      body: options.body
    })
    
    console.log(`SMS sent successfully to ${options.to}`)
  } catch (error) {
    console.error('Error sending SMS:', error)
    throw error
  }
}

// SMS message generators for different notification types
export function generateLeadSMS(submission: any): string {
  const firstName = submission.contactInfo?.firstName || ''
  const lastName = submission.contactInfo?.lastName || ''
  const branchOfService = submission.preQualification?.branchOfService || ''
  const coverageAmount = submission.preQualification?.coverageAmount || ''
  const phone = submission.contactInfo?.phone || ''
  
  return `NEW LEAD: ${firstName} ${lastName} - ${branchOfService} - ${coverageAmount} coverage. Contact: ${phone}`
}

export function generateApplicationCompleteSMS(submission: any): string {
  const firstName = submission.contactInfo?.firstName || ''
  const lastName = submission.contactInfo?.lastName || ''
  const coverage = submission.quoteData?.coverage || ''
  const premium = submission.quoteData?.premium || ''
  const phone = submission.contactInfo?.phone || ''
  
  return `APPLICATION COMPLETE: ${firstName} ${lastName} - ${coverage} coverage - ${premium} premium. Contact: ${phone}`
}

export function generateAbandonmentAlertSMS(submission: any): string {
  const firstName = submission.contactInfo?.firstName || ''
  const lastName = submission.contactInfo?.lastName || ''
  const branchOfService = submission.preQualification?.branchOfService || ''
  const coverageAmount = submission.preQualification?.coverageAmount || ''
  const phone = submission.contactInfo?.phone || ''
  
  return `ABANDONED LEAD: ${firstName} ${lastName} - ${branchOfService} - ${coverageAmount} coverage. Contact: ${phone} - Follow up needed!`
} 