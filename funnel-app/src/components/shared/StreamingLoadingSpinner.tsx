import React, { useState, useEffect } from 'react'

interface StreamingLoadingSpinnerProps {
  branchOfService: string
  isVisible: boolean
  onComplete: () => void
  onStepComplete?: () => void
}

const loadingMessages = [
  'Gathering your information and medical details...',
  'Analyzing your military service and benefits...',
  'Checking state-specific requirements for your location...',
  'Generating personalized quotes based on your answers...',
  'Optimizing coverage options for your family...',
  'Finalizing your custom policy recommendations...'
]

const iulBenefits = [
  'IUL policies provide both death benefit protection and cash value growth potential',
  'Tax-advantaged growth with flexible premium payments',
  'Tax-free withdrawals and policy loans available',
  'IUL policies can complement your existing VA benefits',
  'Build wealth while protecting your family'
]

const veteranBenefits = [
  'Special rates for active duty and veterans',
  'Flexible underwriting for service-related conditions',
  'Expedited processing for military families',
  'Comprehensive coverage options designed for veterans',
  'Tax advantages that complement your military benefits'
]

export const StreamingLoadingSpinner: React.FC<StreamingLoadingSpinnerProps> = ({
  branchOfService,
  isVisible,
  onComplete,
  onStepComplete
}) => {
  const [currentMessage, setCurrentMessage] = useState('')
  const [messageType, setMessageType] = useState<'loading' | 'iul' | 'veteran'>('loading')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (!isVisible) return

    let messageTimer: NodeJS.Timeout
    let typingTimer: NodeJS.Timeout
    let messageIndex = 0
    let allMessages: Array<{ text: string; type: 'loading' | 'iul' | 'veteran' }> = []

    // Combine all messages in sequence
    loadingMessages.forEach(msg => allMessages.push({ text: msg, type: 'loading' }))
    iulBenefits.forEach(msg => allMessages.push({ text: msg, type: 'iul' }))
    veteranBenefits.forEach(msg => allMessages.push({ text: msg, type: 'veteran' }))

    const startLoading = () => {
      const showNextMessage = () => {
        if (messageIndex < allMessages.length) {
          const message = allMessages[messageIndex]
          setMessageType(message.type)
          typeMessage(message.text, () => {
            messageIndex++
            messageTimer = setTimeout(showNextMessage, 1000) // Wait 1 second between messages
          })
        } else {
          // Complete after all messages
          setTimeout(() => {
            onComplete()
            if (onStepComplete) {
              onStepComplete()
            }
          }, 1000)
        }
      }

      showNextMessage()
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

    return () => {
      clearTimeout(messageTimer)
      clearTimeout(typingTimer)
    }
  }, [isVisible, onComplete])

  if (!isVisible) return null

  const getMessageTitle = () => {
    switch (messageType) {
      case 'loading':
        return 'Processing Your Information'
      case 'iul':
        return 'IUL Policy Benefits'
      case 'veteran':
        return 'Veteran Benefits'
      default:
        return 'Processing Your Information'
    }
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Logo */}
      <div style={{ marginBottom: '2rem' }}>
        <img 
          src="assets/logo.png" 
          alt="Veteran Legacy Life Logo" 
          style={{ height: '4rem', width: 'auto', objectFit: 'contain', margin: '0 auto' }}
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
          Seeing what you qualify for in the {branchOfService}...
        </p>
      </div>

      {/* Single Message Display */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ 
          padding: '1.5rem', 
          borderRadius: '0.5rem', 
          borderLeft: '4px solid',
          ...(messageType === 'loading' ? { background: '#eff6ff', borderLeftColor: '#3b82f6' } : {}),
          ...(messageType === 'iul' ? { background: '#f0fdf4', borderLeftColor: '#22c55e' } : {}),
          ...(messageType === 'veteran' ? { background: '#faf5ff', borderLeftColor: '#a855f7' } : {})
        }}>
          <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.75rem', fontSize: '1.125rem' }}>{getMessageTitle()}</h3>
          <p style={{ 
            fontSize: '1rem', 
            lineHeight: '1.6', 
            minHeight: '3rem',
            ...(messageType === 'loading' ? { color: '#1d4ed8' } : {}),
            ...(messageType === 'iul' ? { color: '#15803d' } : {}),
            ...(messageType === 'veteran' ? { color: '#7c3aed' } : {})
          }}>
            {currentMessage}
            {isTyping && <span style={{ animation: 'pulse 1s infinite' }}>|</span>}
          </p>
        </div>
      </div>

      {/* Spinner */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem' }}>
        <div 
          style={{
            width: '60px',
            height: '60px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        ></div>
      </div>

      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          This usually takes 7-10 seconds...
        </p>
      </div>
    </div>
  )
} 