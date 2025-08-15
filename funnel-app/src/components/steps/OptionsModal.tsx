import React, { useState } from 'react'
import { useFunnelStore } from '../../store/funnelStore'

export const OptionsModal: React.FC = () => {
  const { goToNextStep, closeModal } = useFunnelStore()
  const [showAgentOptions, setShowAgentOptions] = useState(false)

  const handleSubmitMyself = () => {
    goToNextStep()
  }

  const handleUseAgent = () => {
    setShowAgentOptions(true)
  }

  const handleCallNow = () => {
    window.location.href = 'tel:503-764-5097'
  }

  const handleScheduleCall = () => {
    window.open('https://calendly.com/mikealfieri/30min', '_blank')
  }

  const handleBack = () => {
    setShowAgentOptions(false)
  }

  if (showAgentOptions) {
    return (
      <div className="options-modal-container" style={{ 
        textAlign: 'center', 
        padding: '2.5rem', 
        maxWidth: '500px', 
        margin: '0 auto'
      }}>
        <style>
          {`
            @media (max-width: 768px) {
              .options-modal-container {
                padding: 2rem 1.5rem !important;
              }
              .options-title {
                font-size: 1.75rem !important;
              }
              .options-button {
                padding: 1rem 1.5rem !important;
                font-size: 1rem !important;
              }
            }
            @media (max-width: 480px) {
              .options-modal-container {
                padding: 1.5rem 1rem !important;
              }
              .options-title {
                font-size: 1.5rem !important;
              }
              .options-button {
                padding: 0.875rem 1.25rem !important;
                font-size: 0.9rem !important;
              }
            }
          `}
        </style>
        <h2 className="options-title" style={{ 
          color: '#1e293b', 
          fontSize: '2rem', 
          marginBottom: '1rem',
          fontWeight: '700',
          letterSpacing: '-0.025em'
        }}>
          Expert Assistance Available
        </h2>
        
        <p style={{ 
          color: '#64748b', 
          fontSize: '1.1rem',
          lineHeight: '1.6',
          marginBottom: '2.5rem',
          fontWeight: '400'
        }}>
          Our licensed insurance specialists are ready to guide you through the finalization process and address any questions about your policy.
        </p>

        {/* Call Now Button */}
        <button
          className="options-button"
          onClick={handleCallNow}
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            border: 'none',
            padding: '1.25rem 2rem',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            width: '100%',
            marginBottom: '1rem',
            boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)',
            transition: 'all 0.2s ease',
            letterSpacing: '0.025em'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(16, 185, 129, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(16, 185, 129, 0.2)'
          }}
        >
          Call Now: (503) 764-5097
        </button>

        <div style={{ 
          margin: '1.5rem 0',
          color: '#64748b',
          fontSize: '0.9rem',
          fontWeight: '500',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          or
        </div>

        {/* Schedule Call Button */}
        <button
          className="options-button"
          onClick={handleScheduleCall}
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            color: 'white',
            border: 'none',
            padding: '1.25rem 2rem',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            width: '100%',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px rgba(59, 130, 246, 0.2)',
            transition: 'all 0.2s ease',
            letterSpacing: '0.025em'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(59, 130, 246, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(59, 130, 246, 0.2)'
          }}
        >
          Schedule Consultation
        </button>

        {/* Back Button */}
        <button
          onClick={handleBack}
          style={{
            background: 'transparent',
            color: '#64748b',
            border: '1px solid #e2e8f0',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f8fafc'
            e.currentTarget.style.borderColor = '#cbd5e1'
            e.currentTarget.style.color = '#475569'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = '#e2e8f0'
            e.currentTarget.style.color = '#64748b'
          }}
        >
          Back to Options
        </button>
      </div>
    )
  }

  return (
    <div style={{ textAlign: 'center', padding: '2.5rem', maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ 
        color: '#1e293b', 
        fontSize: '2rem', 
        marginBottom: '1rem',
        fontWeight: '700',
        letterSpacing: '-0.025em'
      }}>
        Your Options:
      </h2>
      
      <p style={{ 
        color: '#64748b', 
        fontSize: '1.1rem',
        lineHeight: '1.6',
        marginBottom: '2.5rem',
        fontWeight: '400'
      }}>
        Select how you would like to proceed with your policy finalization.
      </p>

              {/* Submit Myself Button */}
        <button
          onClick={handleSubmitMyself}
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            border: 'none',
            padding: '1.25rem 2rem',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            width: '100%',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)',
            transition: 'all 0.2s ease',
            letterSpacing: '0.025em'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(16, 185, 129, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(16, 185, 129, 0.2)'
          }}
              >
          1) Submit application myself
        </button>

      <div style={{ 
        margin: '1.5rem 0',
        color: '#64748b',
        fontSize: '0.9rem',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }}>
        or
      </div>

              {/* Use Licensed Agent Button */}
        <button
          onClick={handleUseAgent}
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            color: 'white',
            border: 'none',
            padding: '1.25rem 2rem',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            width: '100%',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 6px rgba(59, 130, 246, 0.2)',
            transition: 'all 0.2s ease',
            letterSpacing: '0.025em'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(59, 130, 246, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(59, 130, 246, 0.2)'
          }}
              >
          2) Use a licensed agent
        </button>
    </div>
  )
}
