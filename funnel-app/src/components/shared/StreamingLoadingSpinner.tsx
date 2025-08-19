import React, { useState, useEffect, useRef } from 'react'
import { useFunnelStore } from '../../store/funnelStore'

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
  console.log('🎯 StreamingLoadingSpinner component MOUNTED, isVisible:', isVisible)
  console.log('🎯 StreamingLoadingSpinner props:', { branchOfService, isVisible })
  
  const { loadingStepStartedAt, loadingStepCompleted } = useFunnelStore()
  console.log('🎯 StreamingLoadingSpinner store values:', { loadingStepStartedAt, loadingStepCompleted })
  
  const [currentMessage, setCurrentMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(false)
  const onCompleteRef = useRef(onComplete)
  const onStepCompleteRef = useRef(onStepComplete)
  const hasStartedRef = useRef(false) // Move hasStarted to useRef to persist across re-renders

  // Update refs when props change to prevent stale closures
  useEffect(() => {
    onCompleteRef.current = onComplete
    onStepCompleteRef.current = onStepComplete
  }, [onComplete, onStepComplete])

  useEffect(() => {
    console.log('🎯 StreamingLoadingSpinner useEffect triggered, isVisible:', isVisible, 'hasCompleted:', hasCompleted, 'hasStarted:', hasStartedRef.current, 'loadingStepCompleted:', loadingStepCompleted)
    
    // Simplified condition - just check if we should start
    if (!isVisible) {
      console.log('🎯 StreamingLoadingSpinner skipping - not visible')
      return
    }
    
    if (hasCompleted) {
      console.log('🎯 StreamingLoadingSpinner skipping - already completed locally')
      return
    }
    
    if (hasStartedRef.current) {
      console.log('🎯 StreamingLoadingSpinner skipping - already started')
      return
    }
    
    if (loadingStepCompleted) {
      console.log('🎯 StreamingLoadingSpinner skipping - already completed globally')
      return
    }
    
    console.log('🎯 StreamingLoadingSpinner starting - all conditions passed')

    let typingTimer: NodeJS.Timeout
    let completionTimer: NodeJS.Timeout

    const startLoading = () => {
      if (hasStartedRef.current) {
        console.log('🎯 StreamingLoadingSpinner already started, skipping')
        return
      }
      hasStartedRef.current = true
      console.log('🎯 StreamingLoadingSpinner starting loading sequence')
      
      // Start typing the message
      typeMessage(processingMessage, () => {
        // After typing is complete, show loader
        console.log('🎯 StreamingLoadingSpinner typing complete, showing loader')
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

    // DEADLINE-BASED TIMER (resistant to remounts)
    const now = Date.now()
    const startTime = loadingStepStartedAt || now
    const elapsed = now - startTime
    const remainingMs = Math.max(0, 12000 - elapsed)
    
    console.log(`🎯 StreamingLoadingSpinner deadline timer: elapsed=${elapsed}ms, remaining=${remainingMs}ms, startTime=${startTime}`)
    
    if (remainingMs <= 0) {
      console.log('🎯 StreamingLoadingSpinner deadline already passed, calling onComplete immediately')
      setHasCompleted(true)
      // Set global completion flag to prevent double completion
      useFunnelStore.setState({ loadingStepCompleted: true })
      console.log('🎯 Loading step completed - calling onComplete')
      onCompleteRef.current()
      if (onStepCompleteRef.current) {
        onStepCompleteRef.current()
      }
    } else {
      console.log(`🎯 StreamingLoadingSpinner setting deadline timer for ${remainingMs}ms`)
      completionTimer = setTimeout(() => {
        console.log('🎯 StreamingLoadingSpinner deadline timer completed, calling onComplete')
        setHasCompleted(true)
        // Set global completion flag to prevent double completion
        useFunnelStore.setState({ loadingStepCompleted: true })
        console.log('🎯 Loading step completed - calling onComplete')
        onCompleteRef.current()
        if (onStepCompleteRef.current) {
          onStepCompleteRef.current()
        }
      }, remainingMs)
    }

    return () => {
      clearTimeout(typingTimer)
      clearTimeout(completionTimer)
    }
  }, [isVisible, loadingStepStartedAt, loadingStepCompleted]) // Add loadingStepStartedAt to dependencies

  if (!isVisible) return null

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Logo */}
      <div style={{ marginBottom: '2rem' }}>
        <img 
                          src="/assets/logo.png" 
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