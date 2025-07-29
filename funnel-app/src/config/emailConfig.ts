import { GLOBAL_CONFIG } from './globalConfig';

export const EMAIL_CONFIG = {
  // Reference your existing globalConfig.ts values
  ADMIN_EMAIL: GLOBAL_CONFIG.EMAIL.ADMIN,
  FROM_EMAIL: 'noreply@veteranlegacylife.com',
  COMPANY_NAME: GLOBAL_CONFIG.COMPANY.NAME,
  SUPPORT_PHONE: GLOBAL_CONFIG.COMPANY.PHONE,
  LOGO_URL: 'https://veteranlegacylife.com/public/logo.png',
  
  // Email styling
  COLORS: {
    PRIMARY: '#1e3a8a',      // Navy blue
    SECONDARY: '#3b82f6',    // Light blue
    ACCENT: '#10b981',       // Green
    BACKGROUND: '#f8fafc'    // Light gray
  },
  
  // Template settings
  MAX_WIDTH: '600px',
  FONT_FAMILY: 'Arial, Helvetica, sans-serif'
} as const;

export const SMS_CONFIG = {
  FROM_PHONE: '+1234567890', // Your Twilio number
  MAX_LENGTH: 160,
  OPT_OUT_TEXT: 'Reply STOP to opt out'
} as const;

// Email template types for type safety
export interface LeadNotificationData {
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    transactionalConsent: boolean;
    marketingConsent: boolean;
  };
  state: string;
  militaryStatus: string;
  branchOfService: string;
  maritalStatus: string;
  coverageAmount: string;
  dateOfBirth: string;
  medicalAnswers: {
    tobaccoUse: string;
    medicalConditions: string[];
    height: string;
    weight: string;
    hospitalCare: string;
    diabetesMedication: string;
  };
  currentStep: number;
  stepName: string;
  sessionId: string;
}

export interface ApplicationCompleteData extends LeadNotificationData {
  applicationData: {
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    beneficiary: {
      name: string;
      relationship: string;
    };
    vaInfo: {
      vaNumber: string;
      serviceConnected: string;
    };
    driversLicense: string;
    ssn: string;
    banking: {
      bankName: string;
      routingNumber: string;
      accountNumber: string;
    };
    policyDate: string;
    quoteData: {
      coverageAmount: number;
      monthlyPremium: number;
      userAge: number;
      userGender: string;
      quoteType: string;
    };
  };
}

export interface AbandonmentAlertData extends LeadNotificationData {
  abandonmentReason?: string;
  timeSpent?: string;
} 