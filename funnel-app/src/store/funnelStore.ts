import { create } from 'zustand'

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
  
  // Session management
  sessionId: string
  
  // Form data
  formData: FormData
  
  // Actions
  setCurrentStep: (step: number) => void
  openModal: () => void
  closeModal: () => void
  setLoading: (loading: boolean) => void
  updateFormData: (data: Partial<FormData>) => void
  submitPartial: (currentStep: number, stepName: string) => Promise<void>
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
  sessionId: generateSessionId(),
  formData: initialState,

  setCurrentStep: (step) => set({ currentStep: step }),
  
  openModal: () => set({ isModalOpen: true }),
  
  closeModal: () => set({ isModalOpen: false }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
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
      
      const response = await fetch('https://script.google.com/macros/s/AKfycbyGyM8VQ_wRWSZRD3xiniaov45n-_sa3LbSPFniYYUxTYcIR8mPN-WDmpeYPM89VU7_/exec', {
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
    
    // Submit application data after step 15 (success)
    if (currentStep === 15) {
      get().submitApplication()
    }
    
    set({ currentStep: nextStep })
  },
  
  goToPreviousStep: () => {
    const { currentStep } = get()
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1 })
    }
  },
  
  submitLead: async () => {
    const { formData, sessionId } = get()
    
    try {
      // Convert data to URL-encoded format to avoid CORS preflight (same as old script)
      const formDataParams = new URLSearchParams()
      formDataParams.append('formType', 'Lead')
      formDataParams.append('sessionId', sessionId)
      
      // Add all formData properties
      for (const [key, value] of Object.entries(formData)) {
        if (Array.isArray(value)) {
          formDataParams.append(key, value.join(', '))
        } else if (typeof value === 'object' && value !== null) {
          formDataParams.append(key, JSON.stringify(value))
        } else {
          formDataParams.append(key, value || '')
        }
      }
      
      formDataParams.append('userAgent', navigator.userAgent)
      formDataParams.append('referrer', document.referrer)
      formDataParams.append('utmSource', new URLSearchParams(window.location.search).get('utm_source') || '')
      formDataParams.append('utmMedium', new URLSearchParams(window.location.search).get('utm_medium') || '')
      formDataParams.append('utmCampaign', new URLSearchParams(window.location.search).get('utm_campaign') || '')
      
      const response = await fetch('https://script.google.com/macros/s/AKfycbyGyM8VQ_wRWSZRD3xiniaov45n-_sa3LbSPFniYYUxTYcIR8mPN-WDmpeYPM89VU7_/exec', {
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
      formDataParams.append('formType', 'Application')
      formDataParams.append('sessionId', sessionId)
      
      // Add all formData properties
      for (const [key, value] of Object.entries(formData)) {
        if (Array.isArray(value)) {
          formDataParams.append(key, value.join(', '))
        } else if (typeof value === 'object' && value !== null) {
          formDataParams.append(key, JSON.stringify(value))
        } else {
          formDataParams.append(key, value || '')
        }
      }
      
      formDataParams.append('userAgent', navigator.userAgent)
      formDataParams.append('referrer', document.referrer)
      formDataParams.append('utmSource', new URLSearchParams(window.location.search).get('utm_source') || '')
      formDataParams.append('utmMedium', new URLSearchParams(window.location.search).get('utm_medium') || '')
      formDataParams.append('utmCampaign', new URLSearchParams(window.location.search).get('utm_campaign') || '')
      
      const response = await fetch('https://script.google.com/macros/s/AKfycbyGyM8VQ_wRWSZRD3xiniaov45n-_sa3LbSPFniYYUxTYcIR8mPN-WDmpeYPM89VU7_/exec', {
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
    sessionId: generateSessionId(),
    formData: initialState
  })
})) 