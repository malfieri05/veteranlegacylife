import { create } from 'zustand'
import { getApiUrl } from '../config/globalConfig'

// Types
export interface ContactInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  transactionalConsent: boolean
  marketingConsent: boolean
}

export interface PreQualification {
  state: string
  militaryStatus: string
  branchOfService: string
  maritalStatus: string
  coverageAmount: string
}

export interface MedicalAnswers {
  tobaccoUse: string
  medicalConditions: string
  height: string
  weight: string
  hospitalCare: string
  diabetesMedication: string
  age: string
}

export interface ApplicationData {
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

export interface QuoteData {
  policyDate: string
  coverage: string
  premium: string
  age: string
  gender: string
  type: string
}

export interface TrackingData {
  currentStep: string
  stepName: string
}

export interface FormData {
  contactInfo: ContactInfo
  preQualification: PreQualification
  medicalAnswers: MedicalAnswers
  applicationData: ApplicationData
  quoteData: QuoteData
  trackingData: TrackingData
}

interface FunnelStore {
  currentStep: number
  isModalOpen: boolean
  isLoading: boolean
  autoAdvanceEnabled: boolean
  sessionId: string
  formData: FormData
  
  setCurrentStep: (step: number) => void
  openModal: () => void
  closeModal: () => void
  setLoading: (loading: boolean) => void
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
  contactInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    transactionalConsent: false,
    marketingConsent: false
  },
  preQualification: {
    state: '',
    militaryStatus: '',
    branchOfService: '',
    maritalStatus: '',
    coverageAmount: ''
  },
  medicalAnswers: {
    tobaccoUse: '',
    medicalConditions: '',
    height: '',
    weight: '',
    hospitalCare: '',
    diabetesMedication: '',
    age: ''
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
    currentStep: '',
    stepName: ''
  }
}

const generateSessionId = () => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

export const useFunnelStore = create<FunnelStore>((set, get) => ({
  currentStep: 1,
  isModalOpen: false,
  isLoading: false,
  autoAdvanceEnabled: true,
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

  submitPartial: async (currentStep: number, stepName: string) => {
    const { formData, sessionId } = get()
    
    try {
      const payload = {
        sessionId,
        formType: 'Partial',
        contactInfo: formData.contactInfo,
        preQualification: formData.preQualification,
        medicalAnswers: formData.medicalAnswers,
        applicationData: formData.applicationData,
        quoteData: formData.quoteData,
        trackingData: {
          currentStep: currentStep.toString(),
          stepName: stepName
        }
      }
      
      console.log(`🔍 submitPartial - Step ${currentStep} (${stepName})`)
      console.log(`🔍 submitPartial - Quote data:`, formData.quoteData)
      
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(payload)) {
        if (typeof value === 'object') {
          params.append(key, JSON.stringify(value));
        } else {
          params.append(key, String(value));
        }
      }
      
      const response = await fetch(getApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse response - Google Apps Script might return different formats
      const responseText = await response.text();
      console.log('🔍 Raw response:', responseText);
      
      let result;
      if (responseText.startsWith('{') || responseText.startsWith('[')) {
        // JSON response
        try {
          result = JSON.parse(responseText);
        } catch (e) {
          result = { success: false, error: 'Invalid JSON response' };
        }
      } else if (responseText.includes('=')) {
        // URL-encoded response
        const params = new URLSearchParams(responseText);
        result = {
          success: params.get('success') === 'true',
          error: params.get('error') || null,
          message: params.get('message') || null
        };
      } else {
        // Plain text response
        result = { success: true, message: responseText };
      }
      console.log('Partial save successful:', result)
    } catch (error) {
      console.error('Error submitting partial data:', error)
    }
  },

  submitLeadPartial: async () => {
    const { formData, sessionId } = get()
    
    try {
      const payload = {
        sessionId,
        formType: 'LeadPartial',
        contactInfo: formData.contactInfo,
        preQualification: formData.preQualification,
        medicalAnswers: formData.medicalAnswers,
        applicationData: formData.applicationData,
        quoteData: formData.quoteData,
        trackingData: {
          currentStep: '12',
          stepName: 'Diabetes Medication'
        }
      }
      
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(payload)) {
        if (typeof value === 'object') {
          params.append(key, JSON.stringify(value));
        } else {
          params.append(key, String(value));
        }
      }
      
      const response = await fetch(getApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit lead partial data')
      }
      
      // Parse response - Google Apps Script might return different formats
      const responseText = await response.text();
      console.log('🔍 Raw response:', responseText);
      
      let result;
      if (responseText.startsWith('{') || responseText.startsWith('[')) {
        // JSON response
        try {
          result = JSON.parse(responseText);
        } catch (e) {
          result = { success: false, error: 'Invalid JSON response' };
        }
      } else if (responseText.includes('=')) {
        // URL-encoded response
        const params = new URLSearchParams(responseText);
        result = {
          success: params.get('success') === 'true',
          error: params.get('error') || null,
          message: params.get('message') || null
        };
      } else {
        // Plain text response
        result = { success: true, message: responseText };
      }
      
      console.log('Lead partial data submitted successfully:', result)
    } catch (error) {
      console.error('Error submitting lead partial data:', error)
    }
  },

  submitLead: async () => {
    const { formData, sessionId } = get()
    
    try {
      const payload = {
        sessionId,
        formType: 'Lead',
        contactInfo: formData.contactInfo,
        preQualification: formData.preQualification,
        medicalAnswers: formData.medicalAnswers,
        applicationData: formData.applicationData,
        quoteData: formData.quoteData,
        trackingData: {
          currentStep: '6',
          stepName: 'Contact Information'
        }
      }
      
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(payload)) {
        if (typeof value === 'object') {
          params.append(key, JSON.stringify(value));
        } else {
          params.append(key, String(value));
        }
      }
      
      const response = await fetch(getApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit lead data')
      }
      
      // Parse response - Google Apps Script might return different formats
      const responseText = await response.text();
      console.log('🔍 Raw response:', responseText);
      
      let result;
      if (responseText.startsWith('{') || responseText.startsWith('[')) {
        // JSON response
        try {
          result = JSON.parse(responseText);
        } catch (e) {
          result = { success: false, error: 'Invalid JSON response' };
        }
      } else if (responseText.includes('=')) {
        // URL-encoded response
        const params = new URLSearchParams(responseText);
        result = {
          success: params.get('success') === 'true',
          error: params.get('error') || null,
          message: params.get('message') || null
        };
      } else {
        // Plain text response
        result = { success: true, message: responseText };
      }
      
      console.log('Lead data submitted successfully:', result)
    } catch (error) {
      console.error('Error submitting lead data:', error)
      alert('There was an issue submitting your information. Please try again.')
    }
  },
  
  submitApplication: async () => {
    const { formData, sessionId } = get()
    
    try {
      const payload = {
        sessionId,
        formType: 'Application',
        contactInfo: formData.contactInfo,
        preQualification: formData.preQualification,
        medicalAnswers: formData.medicalAnswers,
        applicationData: formData.applicationData,
        quoteData: formData.quoteData,
        trackingData: {
          currentStep: '18',
          stepName: 'Application Complete'
        }
      }
      
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(payload)) {
        if (typeof value === 'object') {
          params.append(key, JSON.stringify(value));
        } else {
          params.append(key, String(value));
        }
      }
      
      const response = await fetch(getApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit application data')
      }
      
      // Parse response - Google Apps Script might return different formats
      const responseText = await response.text();
      console.log('🔍 Raw response:', responseText);
      
      let result;
      if (responseText.startsWith('{') || responseText.startsWith('[')) {
        // JSON response
        try {
          result = JSON.parse(responseText);
        } catch (e) {
          result = { success: false, error: 'Invalid JSON response' };
        }
      } else if (responseText.includes('=')) {
        // URL-encoded response
        const params = new URLSearchParams(responseText);
        result = {
          success: params.get('success') === 'true',
          error: params.get('error') || null,
          message: params.get('message') || null
        };
      } else {
        // Plain text response
        result = { success: true, message: responseText };
      }
      
      console.log('Application data submitted successfully:', result)
    } catch (error) {
      console.error('Error submitting application data:', error)
      alert('There was an issue submitting your application. Please try again.')
    }
  },

  goToNextStep: () => {
    const { currentStep } = get()
    const nextStep = currentStep + 1
    
    // Submit partial data after every step (except the last step)
    if (currentStep < 18) {
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
      set({ autoAdvanceEnabled: false })
      
      if (currentStep === 14) {
        set({ currentStep: 12 })
      } else if (currentStep === 13) {
        set({ currentStep: 12 })
      } else if (currentStep === 15) {
        set({ currentStep: 14 })
      } else if (currentStep === 16) {
        set({ currentStep: 15 })
      } else if (currentStep === 17) {
        set({ currentStep: 16 })
      } else if (currentStep === 18) {
        set({ currentStep: 17 })
      } else {
        set({ currentStep: currentStep - 1 })
      }
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