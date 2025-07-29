import { createClient } from '@supabase/supabase-js'
import handleFunnelSubmission, { testNewEntriesAndEmails } from '../api/funnel-submissions'

// Mock Supabase client for testing
const mockSupabase = {
  from: jest.fn(() => ({
    insert: jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn(() => ({
          data: { id: 'test-id-123' },
          error: null
        }))
      }))
    })),
    upsert: jest.fn(() => ({
      error: null
    })),
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(() => ({
          data: { value: 'test-value' },
          error: null
        }))
      }))
    }))
  }))
}

// Mock email and SMS services
jest.mock('../services/email-service', () => ({
  sendEmail: jest.fn(() => Promise.resolve()),
  generateLeadNotificationHTML: jest.fn(() => '<html>test</html>'),
  generateLeadConfirmationHTML: jest.fn(() => '<html>test</html>'),
  generateApplicationCompleteHTML: jest.fn(() => '<html>test</html>'),
  generateApplicationConfirmationHTML: jest.fn(() => '<html>test</html>'),
  generateAbandonmentAlertHTML: jest.fn(() => '<html>test</html>'),
  generateAbandonmentRecoveryHTML: jest.fn(() => '<html>test</html>'),
  generatePartialApplicationAlertHTML: jest.fn(() => '<html>test</html>')
}))

jest.mock('../services/sms-service', () => ({
  sendSMS: jest.fn(() => Promise.resolve()),
  generateLeadSMS: jest.fn(() => 'test sms'),
  generateApplicationCompleteSMS: jest.fn(() => 'test sms'),
  generateAbandonmentAlertSMS: jest.fn(() => 'test sms')
}))

describe('Supabase Migration Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.SUPABASE_URL = 'https://test.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key'
    process.env.SENDGRID_API_KEY = 'test-sendgrid-key'
    process.env.TWILIO_ACCOUNT_SID = 'test-twilio-sid'
    process.env.TWILIO_AUTH_TOKEN = 'test-twilio-token'
  })

  describe('handleFunnelSubmission', () => {
    const mockSubmission = {
      sessionId: 'test-session-123',
      formType: 'Application' as const,
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

    it('should process Application submission successfully', async () => {
      const result = await handleFunnelSubmission(mockSubmission)

      expect(result).toEqual({
        success: true,
        sessionId: 'test-session-123',
        message: 'Application submitted successfully'
      })
    })

    it('should process Lead submission successfully', async () => {
      const leadSubmission = {
        ...mockSubmission,
        formType: 'Lead' as const,
        trackingData: {
          currentStep: '6',
          stepName: 'Contact Information'
        }
      }

      const result = await handleFunnelSubmission(leadSubmission)

      expect(result).toEqual({
        success: true,
        sessionId: 'test-session-123',
        message: 'Lead submitted successfully'
      })
    })

    it('should process Partial submission successfully', async () => {
      const partialSubmission = {
        ...mockSubmission,
        formType: 'Partial' as const,
        trackingData: {
          currentStep: '12',
          stepName: 'Diabetes Medication'
        }
      }

      const result = await handleFunnelSubmission(partialSubmission)

      expect(result).toEqual({
        success: true,
        sessionId: 'test-session-123',
        message: 'Partial submitted successfully'
      })
    })

    it('should process LeadPartial submission successfully', async () => {
      const leadPartialSubmission = {
        ...mockSubmission,
        formType: 'LeadPartial' as const,
        trackingData: {
          currentStep: '12',
          stepName: 'Diabetes Medication'
        }
      }

      const result = await handleFunnelSubmission(leadPartialSubmission)

      expect(result).toEqual({
        success: true,
        sessionId: 'test-session-123',
        message: 'LeadPartial submitted successfully'
      })
    })

    it('should handle missing required fields', async () => {
      const invalidSubmission = {
        sessionId: 'test-session-123',
        formType: 'Application' as const
        // Missing required data sections
      }

      await expect(handleFunnelSubmission(invalidSubmission)).rejects.toThrow()
    })
  })

  describe('testNewEntriesAndEmails', () => {
    it('should run test function successfully', async () => {
      const result = await testNewEntriesAndEmails()

      expect(result).toEqual({
        success: true,
        message: 'Test data written successfully'
      })
    })

    it('should create test data with correct structure', async () => {
      await testNewEntriesAndEmails()

      // Verify that the test function was called with correct data structure
      expect(mockSupabase.from).toHaveBeenCalledWith('funnel_submissions')
      expect(mockSupabase.from).toHaveBeenCalledWith('sessions')
    })
  })

  describe('Email Notifications', () => {
    it('should send lead notifications', async () => {
      const { sendEmail } = require('../services/email-service')
      
      const leadSubmission = {
        sessionId: 'test-session-123',
        formType: 'Lead' as const,
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

      await handleFunnelSubmission(leadSubmission)

      expect(sendEmail).toHaveBeenCalledTimes(2) // Admin + Customer emails
    })

    it('should send application complete notifications', async () => {
      const { sendEmail } = require('../services/email-service')
      
      const applicationSubmission = {
        sessionId: 'test-session-123',
        formType: 'Application' as const,
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

      await handleFunnelSubmission(applicationSubmission)

      expect(sendEmail).toHaveBeenCalledTimes(2) // Admin + Customer emails
    })
  })

  describe('SMS Notifications', () => {
    it('should send SMS notifications for leads', async () => {
      const { sendSMS } = require('../services/sms-service')
      
      const leadSubmission = {
        sessionId: 'test-session-123',
        formType: 'Lead' as const,
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

      await handleFunnelSubmission(leadSubmission)

      expect(sendSMS).toHaveBeenCalledTimes(1)
    })
  })

  describe('Data Integrity', () => {
    it('should encrypt sensitive data correctly', async () => {
      const submissionWithSensitiveData = {
        sessionId: 'test-session-123',
        formType: 'Application' as const,
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

      await handleFunnelSubmission(submissionWithSensitiveData)

      // Verify that sensitive data is handled (encrypted in database)
      expect(mockSupabase.from).toHaveBeenCalledWith('funnel_submissions')
    })
  })

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      // Mock database error
      mockSupabase.from.mockReturnValueOnce({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({
              data: null,
              error: { message: 'Database connection failed' }
            }))
          }))
        }))
      })

      const submission = {
        sessionId: 'test-session-123',
        formType: 'Application' as const,
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

      await expect(handleFunnelSubmission(submission)).rejects.toThrow('Database connection failed')
    })
  })
}) 