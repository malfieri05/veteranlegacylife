import { create } from 'zustand'
import { getApiUrl } from '../config/api'

// Types
export interface ContactInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
}

export interface MedicalAnswers {
  tobaccoUse: string
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
  contactInfo: ContactInfo
  medicalAnswers: MedicalAnswers
  
  // Phase 2 data  
  applicationData: ApplicationData
}

interface FunnelStore {
  // Current step management
  currentStep: number
  isModalOpen: boolean
  isLoading: boolean
  isStreamingLoading: boolean
  
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
  setStreamingLoading: (loading: boolean) => void
  setAutoAdvanceEnabled: (enabled: boolean) => void
  updateFormData: (data: Partial<FormData>) => void
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
  contactInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: ''
  },
  medicalAnswers: {
    tobaccoUse: '',
    medicalConditions: [],
    height: '',
    weight: '',
    hospitalCare: '',
    diabetesMedication: ''
  },
  applicationData: {
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    beneficiary: {
      name: '',
      relationship: ''
    },
    vaInfo: {
      vaNumber: '',
      serviceConnected: ''
    },
    ssn: '',
    banking: {
      accountNumber: '',
      routingNumber: '',
      bankName: ''
    },
    policyDate: ''
  }
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
  setStreamingLoading: (loading) => set({ isStreamingLoading: loading }),
  setAutoAdvanceEnabled: (enabled) => set({ autoAdvanceEnabled: enabled }),
  
  updateFormData: (data) => set((state) => ({
    formData: { ...state.formData, ...data }
  })),
  
  submitPartial: async (currentStep: number, stepName: string) => {
    const { formData, sessionId } = get()
    
    try {
      // Convert data to URL-encoded format to avoid CORS preflight (same as old script)
      const formDataParams = new URLSearchParams()
      formDataParams.append('formType', 'Partial')
      formDataParams.append('sessionId', sessionId)
      formDataParams.append('currentStep', currentStep.toString())
      formDataParams.append('stepName', stepName)
      formDataParams.append('formData', JSON.stringify(formData))
      formDataParams.append('userAgent', navigator.userAgent)
      formDataParams.append('referrer', document.referrer)
      formDataParams.append('utmSource', new URLSearchParams(window.location.search).get('utm_source') || '')
      formDataParams.append('utmMedium', new URLSearchParams(window.location.search).get('utm_medium') || '')
      formDataParams.append('utmCampaign', new URLSearchParams(window.location.search).get('utm_campaign') || '')
      
      const response = await fetch(getApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDataParams.toString()
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
    
    // Submit partial data after every step (except the last step)
    if (currentStep < 15) {
      const stepNames = [
        'State Selection',
        'Military Status',
        'Branch of Service', 
        'Marital Status',
        'Coverage Amount',
        'Contact Information',
        'Tobacco Use',
        'Medical Conditions',
        'Height & Weight',
        'Hospital Care',
        'Diabetes Medication',
        'Pre-Qualified Success',
        'IUL Quote Modal',
        'Application Step 1',
        'Application Step 2'
      ]
      get().submitPartial(currentStep, stepNames[currentStep - 1])
    }
    
    // Submit lead data after step 5 (contact info)
    if (currentStep === 5) {
      get().submitLead()
    }
    
    // After step 11 (Diabetes Medication), go to loading step (11.5) and submit lead partial
    if (currentStep === 11) {
      get().submitLeadPartial()
      set({ currentStep: 11.5, isStreamingLoading: true })
      return
    }
    
    // After loading step (11.5), go to step 12 (Pre-Qualified Success)
    if (currentStep === 11.5) {
      set({ isStreamingLoading: false, currentStep: 12 })
      return
    }
    
    // Submit application data after step 15 (success)
    if (currentStep === 15) {
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
      if (currentStep === 12) {
        // If we're on step 12 (Pre-Qualified Success), go back to step 11 (Diabetes Medication)
        set({ currentStep: 11 })
      } else if (currentStep === 11.5) {
        // If we're on loading step, go back to step 11 (Diabetes Medication)
        set({ currentStep: 11, isStreamingLoading: false })
      } else {
        set({ currentStep: currentStep - 1 })
      }
    }
  },
  
  submitLeadPartial: async () => {
    const { formData, sessionId } = get()
    
    try {
      // Convert data to URL-encoded format to avoid CORS preflight (same as old script)
      const formDataParams = new URLSearchParams()
      formDataParams.append('formType', 'LeadPartial')
      formDataParams.append('sessionId', sessionId)
      formDataParams.append('currentStep', '11') // Diabetes Medication step
      formDataParams.append('stepName', 'Diabetes Medication')
      formDataParams.append('formData', JSON.stringify(formData))
      formDataParams.append('userAgent', navigator.userAgent)
      formDataParams.append('referrer', document.referrer)
      formDataParams.append('utmSource', new URLSearchParams(window.location.search).get('utm_source') || '')
      formDataParams.append('utmMedium', new URLSearchParams(window.location.search).get('utm_medium') || '')
      formDataParams.append('utmCampaign', new URLSearchParams(window.location.search).get('utm_campaign') || '')
      
      const response = await fetch(getApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDataParams.toString()
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
    const { formData, sessionId } = get()
    
    try {
      // Convert data to URL-encoded format to avoid CORS preflight (same as old script)
      const formDataParams = new URLSearchParams()
      formDataParams.append('formType', 'Lead')
      formDataParams.append('sessionId', sessionId)
      formDataParams.append('formData', JSON.stringify(formData))
      formDataParams.append('userAgent', navigator.userAgent)
      formDataParams.append('referrer', document.referrer)
      formDataParams.append('utmSource', new URLSearchParams(window.location.search).get('utm_source') || '')
      formDataParams.append('utmMedium', new URLSearchParams(window.location.search).get('utm_medium') || '')
      formDataParams.append('utmCampaign', new URLSearchParams(window.location.search).get('utm_campaign') || '')
      
      const response = await fetch(getApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDataParams.toString()
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
    const { formData, sessionId } = get()
    
    try {
      // Convert data to URL-encoded format to avoid CORS preflight (same as old script)
      const formDataParams = new URLSearchParams()
      formDataParams.append('formType', 'Funnel') // Changed from 'Application' to 'Funnel' to match Google Apps Script
      formDataParams.append('sessionId', sessionId)
      
      formDataParams.append('formData', JSON.stringify(formData))
      
      formDataParams.append('userAgent', navigator.userAgent)
      formDataParams.append('referrer', document.referrer)
      formDataParams.append('utmSource', new URLSearchParams(window.location.search).get('utm_source') || '')
      formDataParams.append('utmMedium', new URLSearchParams(window.location.search).get('utm_medium') || '')
      formDataParams.append('utmCampaign', new URLSearchParams(window.location.search).get('utm_campaign') || '')
      
      const response = await fetch(getApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDataParams.toString()
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
    isStreamingLoading: false,
    sessionId: generateSessionId(),
    formData: initialState
  })
})) 