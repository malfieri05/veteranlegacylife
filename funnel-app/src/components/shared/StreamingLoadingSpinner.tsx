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

  const getMessageStyle = () => {
    switch (messageType) {
      case 'loading':
        return 'bg-blue-50 border-l-blue-500'
      case 'iul':
        return 'bg-green-50 border-l-green-500'
      case 'veteran':
        return 'bg-purple-50 border-l-purple-500'
      default:
        return 'bg-blue-50 border-l-blue-500'
    }
  }

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

  const getMessageTextColor = () => {
    switch (messageType) {
      case 'loading':
        return 'text-blue-700'
      case 'iul':
        return 'text-green-700'
      case 'veteran':
        return 'text-purple-700'
      default:
        return 'text-blue-700'
    }
  }

  return (
    <div className="text-center">
      {/* Logo */}
      <div className="mb-8">
        <img 
          src="/logo.png" 
          alt="Veteran Legacy Life Logo" 
          className="h-16 w-auto object-contain mx-auto"
          onError={(e) => {
            // Fallback if logo doesn't load
            e.currentTarget.style.display = 'none'
          }}
        />
      </div>

      {/* Title */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 leading-relaxed">
          Calculating Your Policy Options
        </h2>
        <p className="text-gray-600">
          Seeing what you qualify for in the {branchOfService}...
        </p>
      </div>

      {/* Single Message Display */}
      <div className="mb-8">
        <div className={`p-6 rounded-lg border-l-4 ${getMessageStyle()}`}>
          <h3 className="font-semibold text-gray-800 mb-3 text-lg">{getMessageTitle()}</h3>
          <p className={`text-base leading-relaxed min-h-[3rem] ${getMessageTextColor()}`}>
            {currentMessage}
            {isTyping && <span className="animate-pulse">|</span>}
          </p>
        </div>
      </div>

      {/* Spinner */}
      <div className="flex justify-center items-center mt-8">
        <div 
          className="w-15 h-15 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"
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

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          This usually takes 7-10 seconds...
        </p>
      </div>
    </div>
  )
} 