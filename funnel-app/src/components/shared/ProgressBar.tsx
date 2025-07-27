import React from 'react'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  className?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  className = ''
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100
  
  return (
    <div className={`progress-container ${className}`}>
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="progress-text">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  )
} 