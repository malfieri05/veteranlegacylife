import { create } from 'zustand'
import { getApiUrl } from '../config/globalConfig'

// Types
export interface ContactInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  transactionalConsent?: boolean
  marketingConsent?: boolean
}

export interface MedicalAnswers {
  tobaccoUse: string
  age: string
  medicalConditions: string[]
  height: string
  weight: string
  hospitalCare: string
  diabetesMedication: string
}

export interface ApplicationData {
  address: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  beneficiary: {
    name: string
    relationship: string
  }
  vaInfo: {
    vaNumber: string
    serviceConnected: string
  }
  driversLicense: string
  ssn: string
  banking: {
    accountNumber: string
    routingNumber: string
    bankName: string
  }
  policyDate: string
  quoteData?: {
    coverageAmount: number
    monthlyPremium: number
    userAge: number
    userGender: string
    quoteType: string
  }
}

export interface FormData {
  // Phase 1 data
  state: string
  militaryStatus: string
  branchOfService: string
  maritalStatus: string
  coverageAmount: string
  dateOfBirth: string
  contactInfo: ContactInfo
  medicalAnswers: MedicalAnswers
  
  // Phase 2 data - FLAT KEYS
  // Address fields
  streetAddress: string
  city: string
  applicationState: string
  zipCode: string
  
  // Beneficiary fields
  beneficiaryName: string
  beneficiaryRelationship: string
  
  // VA fields
  vaNumber: string
  serviceConnected: string
  
  // Identity fields
  driversLicense: string
  ssn: string
  
  // Banking fields
  bankName: string
  routingNumber: string
  accountNumber: string
  
  // Quote fields
  policyDate: string
  quoteData?: {
    coverageAmount: number
    monthlyPremium: number
    userAge: number
    userGender: string
    quoteType: string
  }
  
  // Tracking fields
  currentStep?: number
  stepName?: string
}

interface FunnelStore {
  // Current step management
  currentStep: number
  isModalOpen: boolean
  isLoading: boolean
  
  // Auto-advance management
  autoAdvanceEnabled: boolean
  
  // Session management
  sessionId: string
  
  // Form data
  formData: FormData
  
  // Actions
  setCurrentStep: (step: number) => void
  openModal: () => void
  closeModal: () => void
  setLoading: (loading: boolean) => void
  setAutoAdvanceEnabled: (enabled: boolean) => void
  updateFormData: (data: Partial<FormData>) => void
  transformFormDataForSubmission: (formData: FormData) => any
  submitPartial: (currentStep: number, stepName: string) => Promise<void>
  submitLeadPartial: () => Promise<void>
  submitLead: () => Promise<void>
  submitApplication: () => Promise<void>
  reset: () => void
  goToNextStep: () => void
  goToPreviousStep: () => void
}

const initialState: FormData = {
  state: '',
  militaryStatus: '',
  branchOfService: '',
  maritalStatus: '',
  coverageAmount: '',
  dateOfBirth: '',
      contactInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      transactionalConsent: false,
      marketingConsent: false
    },
      medicalAnswers: {
      tobaccoUse: '',
      age: '',
      medicalConditions: [],
      height: '',
      weight: '',
      hospitalCare: '',
      diabetesMedication: ''
    },
  // Phase 2 data - FLAT KEYS
  // Address fields
  streetAddress: '',
  city: '',
  applicationState: '',
  zipCode: '',
  
  // Beneficiary fields
  beneficiaryName: '',
  beneficiaryRelationship: '',
  
  // VA fields
  vaNumber: '',
  serviceConnected: '',
  
  // Identity fields
  driversLicense: '',
  ssn: '',
  
  // Banking fields
  bankName: '',
  routingNumber: '',
  accountNumber: '',
  
  // Quote fields
  policyDate: '',
  quoteData: undefined
}

// Generate a unique session ID for this funnel session
const generateSessionId = () => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

export const useFunnelStore = create<FunnelStore>((set, get) => ({
  currentStep: 1,
  isModalOpen: false,
  isLoading: false,
  isStreamingLoading: false,
  autoAdvanceEnabled: true, // Start with auto-advance enabled
  sessionId: generateSessionId(),
  formData: initialState,

  setCurrentStep: (step) => set({ currentStep: step }),
  
  openModal: () => set({ isModalOpen: true }),
  
  closeModal: () => set({ isModalOpen: false }),
  
      setLoading: (loading) => set({ isLoading: loading }),
  setAutoAdvanceEnabled: (enabled) => set({ autoAdvanceEnabled: enabled }),
  
  updateFormData: (data) => set((state) => ({
    formData: { ...state.formData, ...data }
  })),

  // Transform formData into the exact structure expected by testNewEntriesAndEmails
  transformFormDataForSubmission: (formData: FormData) => {
    return {
      formType: 'Application', // Will be overridden by specific submission types
      
      // Contact Info - nested object exactly like testNewEntriesAndEmails
      contactInfo: {
        firstName: formData.contactInfo?.firstName || '',
        lastName: formData.contactInfo?.lastName || '',
        email: formData.contactInfo?.email || '',
        phone: formData.contactInfo?.phone || '',
        dateOfBirth: formData.dateOfBirth || '',
        transactionalConsent: formData.contactInfo?.transactionalConsent || false,
        marketingConsent: formData.contactInfo?.marketingConsent || false
      },
      
      // Pre-qualification - nested object exactly like testNewEntriesAndEmails
      preQualification: {
        state: formData.state || '',
        militaryStatus: formData.militaryStatus || '',
        branchOfService: formData.branchOfService || '',
        maritalStatus: formData.maritalStatus || '',
        coverageAmount: formData.coverageAmount || ''
      },
      
      // Medical Answers - nested object exactly like testNewEntriesAndEmails
      medicalAnswers: {
        tobaccoUse: formData.medicalAnswers?.tobaccoUse || '',
        medicalConditions: formData.medicalAnswers?.medicalConditions?.join(', ') || '',
        height: formData.medicalAnswers?.height || '',
        weight: formData.medicalAnswers?.weight || '',
        hospitalCare: formData.medicalAnswers?.hospitalCare || '',
        diabetesMedication: formData.medicalAnswers?.diabetesMedication || ''
      },
      
      // Application Data - nested object exactly like testNewEntriesAndEmails
      applicationData: {
        streetAddress: formData.streetAddress || '',
        city: formData.city || '',
        state: formData.applicationState || '',
        zipCode: formData.zipCode || '',
        beneficiaryName: formData.beneficiaryName || '',
        beneficiaryRelationship: formData.beneficiaryRelationship || '',
        vaNumber: formData.vaNumber || '',
        serviceConnected: formData.serviceConnected || '',
        driversLicense: formData.driversLicense || '',
        ssn: formData.ssn || '',
        bankName: formData.bankName || '',
        routingNumber: formData.routingNumber || '',
        accountNumber: formData.accountNumber || ''
      },
      
      // Quote Data - nested object exactly like testNewEntriesAndEmails
      quoteData: {
        policyDate: formData.policyDate || '',
        coverage: formData.coverageAmount ? `$${formData.coverageAmount}` : '',
        premium: formData.quoteData?.monthlyPremium ? `$${formData.quoteData.monthlyPremium.toFixed(2)}` : '',
        age: formData.medicalAnswers?.age || '',
        gender: 'Male', // Default gender
        type: 'Term Life' // Default type
      },
      
      // Tracking Data - nested object exactly like testNewEntriesAndEmails
      trackingData: {
        currentStep: formData.currentStep?.toString() || '',
        stepName: formData.stepName || ''
      }
    }
  },

  submitPartial: async (currentStep: number, stepName: string) => {
    const { formData, sessionId, transformFormDataForSubmission } = get()
    
    try {
      // Transform formData into the exact structure expected by testNewEntriesAndEmails
      const transformedData = transformFormDataForSubmission(formData)
      transformedData.formType = 'Partial'
      
      // Update tracking data with current step info
      transformedData.trackingData.currentStep = currentStep.toString()
      transformedData.trackingData.stepName = stepName
      
      // Send as JSON POST exactly like testNewEntriesAndEmails expects
      const payload = {
        sessionId,
        ...transformedData
      }
      
      const response = await fetch(getApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json()
      console.log('Partial save successful:', result)
    } catch (error) {
      console.error('Error submitting partial data:', error)
    }
  },

  goToNextStep: () => {
    const { currentStep } = get()
    const nextStep = currentStep + 1
    
    // Submit partial data after every step (except the last step and application steps)
    if (currentStep < 18 && currentStep !== 16 && currentStep !== 17) {
      const stepNames = [
        'State Selection',
        'Military Status',
        'Branch of Service', 
        'Marital Status',
        'Coverage Amount',
        'Contact Information',
        'Birthday',
        'Tobacco Use',
        'Medical Conditions',
        'Height & Weight',
        'Hospital Care',
        'Diabetes Medication',
        'Loading Screen',
        'Pre-Qualified Success',
        'IUL Quote Modal',
        'Application Step 1',
        'Application Step 2',
        'Final Success'
      ]
      
      // Update formData with current step info before submitting partial
      set((state) => ({
        formData: {
          ...state.formData,
          currentStep,
          stepName: stepNames[currentStep - 1]
        }
      }))
      
      get().submitPartial(currentStep, stepNames[currentStep - 1])
    }
    
    // Submit lead data after step 6 (contact info)
    if (currentStep === 6) {
      get().submitLead()
    }
    
    // After step 12 (Diabetes Medication), go to loading step (13) and submit lead partial
    if (currentStep === 12) {
      get().submitLeadPartial()
      set({ currentStep: 13 })
      return
    }
    
    // Submit application data after step 18 (final success)
    if (currentStep === 18) {
      get().submitApplication()
    }
    
    set({ currentStep: nextStep })
  },
  
  goToPreviousStep: () => {
    const { currentStep } = get()
    if (currentStep > 1) {
      // Disable auto-advance when going back
      set({ autoAdvanceEnabled: false })
      
      // Handle special case for loading step
      if (currentStep === 14) {
        // If we're on step 14 (Pre-Qualified Success), go back to step 12 (Diabetes Medication)
        set({ currentStep: 12 })
      } else if (currentStep === 13) {
        // If we're on loading step, go back to step 12 (Diabetes Medication)
        set({ currentStep: 12 })
      } else if (currentStep === 15) {
        // If we're on IUL Quote Modal, go back to step 14 (Pre-Qualified Success)
        set({ currentStep: 14 })
      } else if (currentStep === 16) {
        // If we're on Application Step 1, go back to step 15 (IUL Quote Modal)
        set({ currentStep: 15 })
      } else if (currentStep === 17) {
        // If we're on Application Step 2, go back to step 16 (Application Step 1)
        set({ currentStep: 16 })
      } else if (currentStep === 18) {
        // If we're on Final Success, go back to step 17 (Application Step 2)
        set({ currentStep: 17 })
      } else {
        set({ currentStep: currentStep - 1 })
      }
    }
  },
  
  submitLeadPartial: async () => {
    const { formData, sessionId, transformFormDataForSubmission } = get()
    
    try {
      // Transform formData into the exact structure expected by testNewEntriesAndEmails
      const transformedData = transformFormDataForSubmission(formData)
      transformedData.formType = 'LeadPartial'
      
      // Update tracking data with current step info
      transformedData.trackingData.currentStep = '12'
      transformedData.trackingData.stepName = 'Diabetes Medication'
      
      // Send as JSON POST exactly like testNewEntriesAndEmails expects
      const payload = {
        sessionId,
        ...transformedData
      }
      
      const response = await fetch(getApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit lead partial data')
      }
      
      console.log('Lead partial data submitted successfully')
    } catch (error) {
      console.error('Error submitting lead partial data:', error)
    }
  },

  submitLead: async () => {
    const { formData, sessionId, transformFormDataForSubmission } = get()
    
    try {
      // Transform formData into the exact structure expected by testNewEntriesAndEmails
      const transformedData = transformFormDataForSubmission(formData)
      transformedData.formType = 'Lead'
      
      // Send as JSON POST exactly like testNewEntriesAndEmails expects
      const payload = {
        sessionId,
        ...transformedData
      }
      
      const response = await fetch(getApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit lead data')
      }
      
      console.log('Lead data submitted successfully')
    } catch (error) {
      console.error('Error submitting lead data:', error)
      // Fallback to alert for user feedback
      alert('There was an issue submitting your information. Please try again.')
    }
  },
  
  submitApplication: async () => {
    const { formData, sessionId, transformFormDataForSubmission } = get()
    
    // CRITICAL: According to QA/QC documentation, users MUST secure their rate in IUL Quote Modal
    // before proceeding to application steps. This ensures quote data is always available.
    let updatedFormData = { ...formData }
    
    // Verify quote data exists (should always be present if user followed correct flow)
    if (!formData.quoteData) {
      console.warn('Quote data missing - this should not happen if user followed correct flow')
      
      // Calculate age from date of birth
      let userAge = 30 // Default age
      if (formData.dateOfBirth) {
        const today = new Date()
        const birthDate = new Date(formData.dateOfBirth)
        const age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        userAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age
      }
      
      // Calculate default coverage amount
      let coverageAmount = 50000 // Default coverage
      if (formData.coverageAmount) {
        coverageAmount = parseInt(formData.coverageAmount.replace(/[$,]/g, ''))
      }
      
      // Import calculateIULQuote function dynamically
      const { calculateIULQuote } = await import('../utils/calculations')
      const monthlyPremium = calculateIULQuote(coverageAmount, userAge, 'male') // Default to male
      
      // Create default quote data
      updatedFormData = {
        ...formData,
        quoteData: {
          coverageAmount,
          monthlyPremium,
          userAge,
          userGender: 'male', // Default gender
          quoteType: 'IUL'
        }
      }
      
      // Update the store with the quote data
      set({ formData: updatedFormData })
    }
    
    try {
      // Transform formData into the exact structure expected by testNewEntriesAndEmails
      const transformedData = transformFormDataForSubmission(updatedFormData)
      transformedData.formType = 'Application'
      
      // Update tracking data with current step info
      transformedData.trackingData.currentStep = '18'
      transformedData.trackingData.stepName = 'Application Complete'
      
      // Send as JSON POST exactly like testNewEntriesAndEmails expects
      const payload = {
        sessionId,
        ...transformedData
      }
      
      const response = await fetch(getApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit application data')
      }
      
      console.log('Application data submitted successfully')
    } catch (error) {
      console.error('Error submitting application data:', error)
      alert('There was an issue submitting your application. Please try again.')
    }
  },
  
  reset: () => set({
    currentStep: 1,
    isModalOpen: false,
    isLoading: false,
    sessionId: generateSessionId(),
    formData: initialState
  })
})) 