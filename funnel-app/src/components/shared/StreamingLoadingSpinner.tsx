import React, { useState, useEffect } from 'react'

interface StreamingLoadingSpinnerProps {
  branchOfService: string
  isVisible: boolean
  onComplete: () => void
  onStepComplete?: () => void
}

// Only keep the processing message
const processingMessage = 'Processing your information and gathering your personalized quote options...'

export const StreamingLoadingSpinner: React.FC<StreamingLoadingSpinnerProps> = ({
  branchOfService,
  isVisible,
  onComplete,
  onStepComplete
}) => {
  const [currentMessage, setCurrentMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showLoader, setShowLoader] = useState(false)

  useEffect(() => {
    if (!isVisible) return

    let typingTimer: NodeJS.Timeout
    let completionTimer: NodeJS.Timeout

    const startLoading = () => {
      // Start typing the message
      typeMessage(processingMessage, () => {
        // After typing is complete, show loader
        setShowLoader(true)
      })
    }

    const typeMessage = (message: string, callback?: () => void) => {
      setIsTyping(true)
      let index = 0
      setCurrentMessage('')
      
      const typeNextChar = () => {
        if (index < message.length) {
          setCurrentMessage(message.substring(0, index + 1))
          index++
          typingTimer = setTimeout(typeNextChar, 30)
        } else {
          setIsTyping(false)
          if (callback) callback()
        }
      }
      
      typeNextChar()
    }

    startLoading()

    // Set exact 12-second timer
    completionTimer = setTimeout(() => {
      onComplete()
      if (onStepComplete) {
        onStepComplete()
      }
    }, 12000) // Exactly 12 seconds

    return () => {
      clearTimeout(typingTimer)
      clearTimeout(completionTimer)
    }
  }, [isVisible, onComplete])

  if (!isVisible) return null

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Logo */}
      <div style={{ marginBottom: '2rem' }}>
        <img 
          src="/logo.png" 
          alt="Veteran Legacy Life Logo" 
          style={{ height: '6rem', width: 'auto', objectFit: 'contain', margin: '0 auto' }}
          onError={(e) => {
            // Fallback if logo doesn't load
            e.currentTarget.style.display = 'none'
          }}
        />
      </div>

      {/* Title */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', lineHeight: '1.6' }}>
          Calculating Your Policy Options
        </h2>
        <p style={{ color: '#6b7280' }}>
          Seeing what you qualify for: {branchOfService}...
        </p>
      </div>

      {/* Message Display */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ 
          padding: '1.5rem', 
          borderRadius: '0.5rem', 
          background: '#eff6ff', 
          borderLeft: '4px solid #3b82f6'
        }}>
          <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.75rem', fontSize: '1.125rem' }}>
            Processing Your Information
          </h3>
          <p style={{ 
            fontSize: '1rem', 
            lineHeight: '1.6', 
            minHeight: '3rem',
            color: '#1d4ed8'
          }}>
            {currentMessage}
            {isTyping && <span style={{ animation: 'pulse 1s infinite' }}>|</span>}
          </p>
        </div>
      </div>

      {/* Tasteful Loader - appears after typing is complete */}
      {showLoader && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          marginTop: '1rem',
          marginBottom: '1rem'
        }}>
          <div 
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid #e2e8f0',
              borderTop: '3px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          ></div>
        </div>
      )}

      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          This usually takes 7-10 seconds...
        </p>
      </div>
    </div>
  )
} 