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
              .primary-cta {
                padding: 1.25rem 1.5rem !important;
              }
              .primary-cta div:first-child {
                font-size: 0.8rem !important;
              }
              .primary-cta div:last-child {
                font-size: 1.2rem !important;
              }
              .secondary-cta {
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
              .primary-cta {
                padding: 1rem 1.25rem !important;
              }
              .primary-cta div:first-child {
                font-size: 0.7rem !important;
              }
              .primary-cta div:last-child {
                font-size: 1.1rem !important;
              }
              .secondary-cta {
                padding: 0.875rem 1.25rem !important;
                font-size: 0.9rem !important;
              }
              
              /* Mobile styles for the main options buttons */
              button[onclick*="handleSubmitMyself"] {
                padding: 1.25rem 1.5rem !important;
              }
              button[onclick*="handleSubmitMyself"] div:first-child {
                font-size: 0.8rem !important;
              }
              button[onclick*="handleSubmitMyself"] div:last-child {
                font-size: 1.2rem !important;
              }
              button[onclick*="handleSubmitMyself"] .fa-arrow-right {
                font-size: 0.9rem !important;
              }
              button[onclick*="handleUseAgent"] {
                padding: 1rem 1.5rem !important;
                font-size: 1rem !important;
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

        {/* Call Directly Button - Primary CTA */}
        <button
          className="options-button primary-cta"
          onClick={handleCallNow}
          style={{
            background: 'white',
            color: '#1e3a8a',
            border: '2px solid #1e3a8a',
            padding: '1.5rem 2rem',
            borderRadius: '12px',
            fontSize: '1.2rem',
            fontWeight: '700',
            cursor: 'pointer',
            width: '100%',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 8px rgba(30, 58, 138, 0.1)',
            transition: 'all 0.3s ease',
            letterSpacing: '0.025em',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            textAlign: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(30, 58, 138, 0.2)'
            e.currentTarget.style.background = '#f8fafc'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(30, 58, 138, 0.1)'
            e.currentTarget.style.background = 'white'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <i className="fas fa-phone" style={{ fontSize: '1rem' }}></i>
            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Call Directly:</span>
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: '700' }}>503-764-5097</div>
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

        {/* Schedule Consultation Button - Secondary CTA */}
        <button
          className="options-button secondary-cta"
          onClick={handleScheduleCall}
          style={{
            background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
            color: 'white',
            border: 'none',
            padding: '1.25rem 2rem',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: '700',
            cursor: 'pointer',
            width: '100%',
            marginBottom: '2rem',
            boxShadow: '0 8px 16px rgba(220, 38, 38, 0.3)',
            transition: 'all 0.3s ease',
            letterSpacing: '0.025em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(220, 38, 38, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(220, 38, 38, 0.3)'
          }}
        >
          <i className="fas fa-calendar" style={{ fontSize: '1.1rem' }}></i>
          Schedule Consultation
        </button>

        {/* Close/Back Button */}
        <button
          onClick={handleBack}
          style={{
            background: '#f3f4f6',
            color: '#6b7280',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            width: '100%'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#e5e7eb'
            e.currentTarget.style.color = '#4b5563'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#f3f4f6'
            e.currentTarget.style.color = '#6b7280'
          }}
        >
          <i className="fas fa-times" style={{ fontSize: '0.8rem' }}></i>
          Close
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

                            {/* Submit Myself Button - Call Directly Style */}
        <button
          onClick={handleSubmitMyself}
          style={{
            background: 'white',
            color: '#1e3a8a',
            border: '2px solid #1e3a8a',
            padding: '1.5rem 2rem',
            borderRadius: '12px',
            fontSize: '1.2rem',
            fontWeight: '700',
            cursor: 'pointer',
            width: '100%',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 8px rgba(30, 58, 138, 0.1)',
            transition: 'all 0.3s ease',
            letterSpacing: '0.025em',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            textAlign: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(30, 58, 138, 0.2)'
            e.currentTarget.style.background = '#f8fafc'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(30, 58, 138, 0.1)'
            e.currentTarget.style.background = 'white'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <i className="fas fa-user-check" style={{ fontSize: '1rem' }}></i>
            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Submit Application:</span>
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Myself
            <i className="fas fa-arrow-right" style={{ fontSize: '1rem' }}></i>
          </div>
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

              {/* Use Licensed Agent Button - Schedule Consultation Style */}
        <button
          onClick={handleUseAgent}
          style={{
            background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
            color: 'white',
            border: 'none',
            padding: '1.25rem 2rem',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: '700',
            cursor: 'pointer',
            width: '100%',
            marginBottom: '1.5rem',
            boxShadow: '0 8px 16px rgba(220, 38, 38, 0.3)',
            transition: 'all 0.3s ease',
            letterSpacing: '0.025em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(220, 38, 38, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(220, 38, 38, 0.3)'
          }}
        >
          <i className="fas fa-user-tie" style={{ fontSize: '1.1rem' }}></i>
          Use a Licensed Agent
        </button>
    </div>
  )
}
