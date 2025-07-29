import { NextApiRequest, NextApiResponse } from 'next'
import handleFunnelSubmission, { testNewEntriesAndEmails } from './funnel-submissions'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  try {
    const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    console.log(`[${sessionId}] Processing request`)
    
    // Check for test function call first
    if (req.body && req.body.action === 'testNewEntriesAndEmails') {
      console.log(`[${sessionId}] Running testNewEntriesAndEmails`)
      const result = await testNewEntriesAndEmails()
      return res.status(200).json(result)
    }
    
    // Parse the incoming data
    const submission = req.body
    console.log(`[${sessionId}] Parsed data: ${JSON.stringify(submission)}`)
    
    // Validate required fields
    if (!submission.formType) {
      throw new Error('Missing formType in request data')
    }
    
    if (!submission.contactInfo || !submission.preQualification || !submission.medicalAnswers || !submission.applicationData || !submission.quoteData || !submission.trackingData) {
      throw new Error('Missing required data sections')
    }
    
    // Process the submission
    const result = await handleFunnelSubmission(submission)
    
    return res.status(200).json(result)
    
  } catch (error) {
    console.error('Error in webhook handler:', error)
    return res.status(500).json({
      success: false,
      error: error.toString()
    })
  }
} 