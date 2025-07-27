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
import { TobaccoUse } from './steps/TobaccoUse'
import { MedicalConditions } from './steps/MedicalConditions'
import { HeightWeight } from './steps/HeightWeight'
import { HospitalCare } from './steps/HospitalCare'
import { DiabetesMedication } from './steps/DiabetesMedication'
import { PreQualifiedSuccess } from './steps/PreQualifiedSuccess'
import { IULQuoteModal } from './steps/IULQuoteModal'
import { ApplicationStep1 } from './steps/ApplicationStep1'
import { ApplicationStep2 } from './steps/ApplicationStep2'
import { FinalSuccessModal } from './steps/FinalSuccessModal'
import { validateContactInfo } from '../utils/validation'

const TOTAL_STEPS = 13

export const FunnelModal: React.FC = () => {
  const { 
    isModalOpen, 
    closeModal, 
    currentStep, 
    goToNextStep, 
    goToPreviousStep,
    formData,
    isStreamingLoading,
    setStreamingLoading
  } = useFunnelStore()

  const renderStep = () => {
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
        return <ContactInfo />
      case 7:
        return <TobaccoUse />
      case 8:
        return <MedicalConditions />
      case 9:
        return <HeightWeight />
      case 10:
        return <HospitalCare />
      case 11:
        return <DiabetesMedication />
      case 12:
        return <PreQualifiedSuccess />
      case 13:
        return <IULQuoteModal />
      case 14:
        return <ApplicationStep1 />
      case 15:
        return <ApplicationStep2 />
      case 16:
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
        return !!formData.state
      case 2:
        return !!formData.militaryStatus
      case 3:
        return !!formData.branchOfService
      case 4:
        return !!formData.maritalStatus
      case 5:
        return !!formData.coverageAmount
      case 6:
        const validation = validateContactInfo(formData.contactInfo)
        return validation.isValid
      case 7:
        return !!formData.medicalAnswers?.tobaccoUse
      case 8:
        return formData.medicalAnswers?.medicalConditions && formData.medicalAnswers.medicalConditions.length > 0
      case 9:
        return !!formData.medicalAnswers?.height && !!formData.medicalAnswers?.weight
      case 10:
        return !!formData.medicalAnswers?.hospitalCare
      case 11:
        return !!formData.medicalAnswers?.diabetesMedication
      case 11.5:
        return false // Loading step - no manual progression
      case 12:
        return true // Success step - can always proceed
      case 13:
        return true // IUL Quote Modal - can always proceed
      case 14:
        return !!formData.applicationData?.address?.street && 
               !!formData.applicationData?.address?.city && 
               !!formData.applicationData?.address?.state && 
               !!formData.applicationData?.address?.zipCode &&
               !!formData.applicationData?.beneficiary?.name &&
               !!formData.applicationData?.beneficiary?.relationship
      case 14:
        return !!formData.applicationData?.ssn &&
               !!formData.applicationData?.banking?.bankName &&
               !!formData.applicationData?.banking?.routingNumber &&
               !!formData.applicationData?.banking?.accountNumber &&
               !!formData.applicationData?.policyDate
      case 15:
        return true // Final success - can always proceed
      default:
        return true
    }
  }

  const handleNext = () => {
    if (canGoNext()) {
      goToNextStep()
    }
  }

  const handleBack = () => {
    goToPreviousStep()
  }

  if (!isModalOpen) return null

  // Don't render modal content when streaming loading is active
  if (isStreamingLoading) {
    return (
      <>
        {/* Streaming Loading Spinner */}
        <StreamingLoadingSpinner
          branchOfService={formData.branchOfService || 'Military'}
          isVisible={isStreamingLoading}
          onComplete={() => setStreamingLoading(false)}
                  onStepComplete={() => {
          // Automatically progress to the next step after loading completes
          if (currentStep === 11.5) {
            goToNextStep()
          }
        }}
        />
      </>
    )
  }

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
            color: 'var(--text-light)'
          }}
        >
          ×
        </button>

        {/* Don't show progress bar during loading screen */}
        {!isStreamingLoading && (
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

        {/* Don't show action buttons during loading screen */}
        {!isStreamingLoading && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginTop: '2rem',
            gap: '1rem'
          }}>
            {currentStep > 1 && (
              <Button
                variant="secondary"
                onClick={handleBack}
              >
                Back
              </Button>
            )}
            
            <div style={{ flex: 1 }}></div>
            
            {currentStep < TOTAL_STEPS && (
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