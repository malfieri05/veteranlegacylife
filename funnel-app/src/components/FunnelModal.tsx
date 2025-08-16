import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFunnelStore } from '../store/funnelStore'
import { ProgressBar } from './shared/ProgressBar'
import { Button } from './shared/Button'
import { StreamingLoadingSpinner } from './shared/StreamingLoadingSpinner'
import { StateSelection } from './steps/StateSelection'
import { MilitaryStatus } from './steps/MilitaryStatus'
import { BranchOfService } from './steps/BranchOfService'
import { MaritalStatus } from './steps/MaritalStatus'
import { CoverageAmount } from './steps/CoverageAmount'
import { ContactInfo } from './steps/ContactInfo'
import { Birthday } from './steps/Birthday'
import { TobaccoUse } from './steps/TobaccoUse'
import { MedicalConditions } from './steps/MedicalConditions'
import { HeightWeight } from './steps/HeightWeight'
import { HospitalCare } from './steps/HospitalCare'
import { DiabetesMedication } from './steps/DiabetesMedication'

import { PreQualifiedSuccess } from './steps/PreQualifiedSuccess'
import { IULQuoteModal } from './steps/IULQuoteModal'
import { OptionsModal } from './steps/OptionsModal'
import { ApplicationStep1 } from './steps/ApplicationStep1'
import { ApplicationStep2 } from './steps/ApplicationStep2'
import { FinalSuccessModal } from './steps/FinalSuccessModal'
import { validateContactInfo } from '../utils/validation'

const TOTAL_STEPS = 19

export const FunnelModal: React.FC = () => {
  const { 
    isModalOpen, 
    closeModal, 
    currentStep, 
    goToNextStep, 
    goToPreviousStep,
    formData,
    setAutoAdvanceEnabled
  } = useFunnelStore()

  const renderStep = () => {
    console.log('🎯 Rendering step:', currentStep)
    switch (currentStep) {
      case 1:
        return <StateSelection />
      case 2:
        return <MilitaryStatus />
      case 3:
        return <BranchOfService />
      case 4:
        return <MaritalStatus />
      case 5:
        return <CoverageAmount />
      case 6:
        return <Birthday />
      case 7:
        return <ContactInfo />
      case 8:
        return <TobaccoUse />
      case 9:
        return <MedicalConditions />
      case 10:
        return <HeightWeight />
      case 11:
        return <HospitalCare />
      case 12:
        return <DiabetesMedication />
      case 13:
        return (
          <StreamingLoadingSpinner
            branchOfService={formData.preQualification?.branchOfService || 'Military'}
            isVisible={true}
            onComplete={() => goToNextStep()}
          />
        )
      case 14:
        return <PreQualifiedSuccess />
      case 15:
        return <IULQuoteModal />
      case 16:
        return <OptionsModal />
      case 17:
        return <ApplicationStep1 />
      case 18:
        return <ApplicationStep2 />
      case 19:
        return <FinalSuccessModal />
      default:
        return <div>
          <h2>Step {currentStep}</h2>
          <p>This step is under development.</p>
        </div>
    }
  }

  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return !!formData.preQualification?.state
      case 2:
        return !!formData.preQualification?.militaryStatus
      case 3:
        return !!formData.preQualification?.branchOfService
      case 4:
        return !!formData.preQualification?.maritalStatus
      case 5:
        return !!formData.preQualification?.coverageAmount
      case 6:
        return !!formData.contactInfo?.dateOfBirth
      case 7:
        const validation = validateContactInfo(formData.contactInfo)
        return validation.isValid
      case 8:
        return !!formData.medicalAnswers?.tobaccoUse
      case 9:
        return formData.medicalAnswers?.medicalConditions && formData.medicalAnswers.medicalConditions.length > 0
      case 10:
        return !!formData.medicalAnswers?.height && !!formData.medicalAnswers?.weight
      case 11:
        return !!formData.medicalAnswers?.hospitalCare
      case 12:
        return !!formData.medicalAnswers?.diabetesMedication
      case 13:
        return false // Loading step - no manual progression
      case 14:
        return true // Success step - can always proceed
      case 15:
        return true // IUL Quote Modal - can always proceed
      case 16:
        return true // OptionsModal - can always proceed
      case 17:
        return isApplicationStep1Complete()
      case 18:
        return isApplicationStep2Complete()
      case 19:
        return true // Final success - can always proceed
      default:
        return true
    }
  }

  const handleNext = () => {
    if (canGoNext()) {
      // Re-enable auto-advance when user clicks Continue
      setAutoAdvanceEnabled(true)
      goToNextStep()
    }
  }

  const handleBack = () => {
    goToPreviousStep()
  }

  const isApplicationStep1Complete = () => {
    const beneficiaries = formData.applicationData?.beneficiaries || []
    
    // Debug logging
    console.log('🔍 ApplicationStep1 Validation Check:')
    console.log('Street Address:', formData.applicationData?.streetAddress)
    console.log('City:', formData.applicationData?.city)
    console.log('State:', formData.applicationData?.state)
    console.log('ZIP Code:', formData.applicationData?.zipCode)
    console.log('Drivers License:', formData.applicationData?.driversLicense)
    console.log('License State:', formData.applicationData?.licenseState)
    console.log('Beneficiaries:', beneficiaries)
    
    // Check if at least one beneficiary is complete
    const hasValidBeneficiary = beneficiaries.length > 0 && 
      beneficiaries.some(beneficiary => {
        const isValid = beneficiary.name && beneficiary.name.trim() !== '' && beneficiary.relationship && beneficiary.relationship !== ''
        console.log('Beneficiary validation:', { name: beneficiary.name, relationship: beneficiary.relationship, isValid })
        return isValid
      })
    
    // Check if multiple beneficiaries have valid percentages
    const hasValidPercentages = beneficiaries.length <= 1 || 
      beneficiaries.reduce((sum, b) => sum + b.percentage, 0) === 100
    
    const isComplete = !!formData.applicationData?.streetAddress &&
           !!formData.applicationData?.city &&
           !!formData.applicationData?.state &&
           !!formData.applicationData?.zipCode &&
           hasValidBeneficiary &&
           hasValidPercentages &&
           !!formData.applicationData?.driversLicense &&
           !!formData.applicationData?.licenseState
    
    console.log('✅ ApplicationStep1 Complete:', isComplete)
    return isComplete
  }

  const isApplicationStep2Complete = () => {
    return !!formData.applicationData?.ssn &&
           !!formData.applicationData?.bankName &&
           !!formData.applicationData?.routingNumber &&
           !!formData.applicationData?.accountNumber &&
           !!formData.quoteData?.policyDate
  }

  if (!isModalOpen) return null

  return (
    <>
      <motion.div
        className="modal-overlay active"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeModal}
      >
      <motion.div
        className="modal-content"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={closeModal}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: 'var(--text-light)',
            zIndex: 10,
            width: '2rem',
            height: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'all 0.3s ease'
          }}
        >
          ×
        </button>

        {/* Don't show progress bar during loading screen, options modal, or final success */}
        {currentStep !== 13 && currentStep !== 16 && currentStep !== 19 && (
          <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Don't show action buttons during loading screen or for IULQuoteModal */}
        {currentStep !== 13 && currentStep !== 15 && (
          <div className="modal-action-buttons" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginTop: '2rem',
            gap: '1rem'
          }}>
            <style>
              {`
                @media (max-width: 768px) {
                  .modal-action-buttons {
                    margin-top: 1.5rem !important;
                    gap: 0.75rem !important;
                  }
                  .modal-action-buttons .cta-button {
                    padding: 0.875rem 1rem !important;
                    font-size: 0.875rem !important;
                  }
                }
                @media (max-width: 480px) {
                  .modal-action-buttons {
                    flex-direction: column !important;
                    gap: 0.75rem !important;
                    margin-top: 1rem !important;
                  }
                  .modal-action-buttons .cta-button {
                    width: 100% !important;
                    padding: 0.75rem 1rem !important;
                    font-size: 0.875rem !important;
                  }
                }
              `}
            </style>
            {currentStep > 1 && (
              <Button
                variant="secondary"
                onClick={handleBack}
              >
                Back
              </Button>
            )}
            
            <div style={{ flex: 1 }}></div>
            
            {currentStep < TOTAL_STEPS && currentStep !== 16 && (
              <Button
                onClick={handleNext}
                disabled={!canGoNext()}
              >
                {currentStep === TOTAL_STEPS - 1 ? 'Submit' : 'Continue'}
              </Button>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
    </>
  )
} 