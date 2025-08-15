import React from 'react'
import { useFunnelStore } from '../../store/funnelStore'

export const FinalSuccessModal: React.FC = () => {
  const { formData, closeModal } = useFunnelStore()
  
  const monthlyPremium = parseFloat(formData.quoteData?.premium?.replace('$', '').replace(',', '') || '0')
  const coverageAmount = parseFloat(formData.quoteData?.coverage?.replace('$', '').replace(',', '') || '0')
  const userAge = parseInt(formData.quoteData?.age || '0')
  const userGender = formData.quoteData?.gender || ''
  const quoteType = formData.quoteData?.type || 'IUL'

  return (
    <div style={{ textAlign: 'center', padding: '0 1.5rem', maxWidth: '600px', margin: '0 auto' }}>
      {/* Logo */}
      <div style={{ marginBottom: '1rem' }}>
        <img 
          src="/logo.png" 
          alt="Veteran Legacy Life Logo" 
          style={{ height: '4rem', width: 'auto', objectFit: 'contain', margin: '0 auto' }}
          onError={(e) => {
            // Fallback if logo doesn't load
            e.currentTarget.style.display = 'none'
          }}
        />
      </div>
      
      {/* Success Title */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ 
          color: '#1e293b', 
          fontSize: '1.8rem', 
          marginBottom: '0.75rem',
          fontWeight: '600'
        }}>
          Congrats, {formData.contactInfo?.firstName || 'there'}!
        </h2>
        <p style={{ 
          color: '#64748b', 
          fontSize: '1rem',
          lineHeight: '1.5',
          marginBottom: '1rem'
        }}>
          Your application has been submitted successfully! A licensed insurance representative will contact you within 24 hours to finalize your policy.
        </p>
      </div>
        
      {/* Prominent Quote Display - Shows user's actual selections */}
      <div style={{ 
        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
        color: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '1rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '2px solid #2563eb'
      }}>
        <div style={{ 
          fontSize: '0.9rem', 
          fontWeight: '500',
          marginBottom: '0.5rem',
          opacity: 0.9,
          textShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}>
          Coverage Amount
        </div>
        <div style={{ 
          fontSize: '2.2rem', 
          fontWeight: 'bold', 
          marginBottom: '0.5rem',
          textShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}>
          ${coverageAmount.toLocaleString()}
        </div>
        <div style={{ 
          fontSize: '1.1rem', 
          fontWeight: '500',
          opacity: 0.95,
          margin: '0',
          textShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}>
          ${monthlyPremium.toFixed(2)} /mo
        </div>
      </div>

      {/* Quote Summary - Compact and Clear */}
      <div style={{ 
        background: '#ffffff', 
        padding: '1.25rem', 
        borderRadius: '12px',
        marginBottom: '1rem',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
      }}>
        <h3 style={{ 
          color: '#1e293b', 
          fontSize: '1.1rem', 
          marginBottom: '1rem',
          fontWeight: '600',
          textAlign: 'center'
        }}>
          Your Quote Summary
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '0.75rem',
          textAlign: 'left',
          fontSize: '0.9rem'
        }}>
          <div style={{ color: '#374151' }}>
            <strong style={{ color: '#1e293b' }}>Monthly Premium:</strong><br />
            <span style={{ color: '#059669', fontWeight: '600' }}>${monthlyPremium.toLocaleString()}</span>
          </div>
          <div style={{ color: '#374151' }}>
            <strong style={{ color: '#1e293b' }}>Coverage Amount:</strong><br />
            <span style={{ color: '#059669', fontWeight: '600' }}>${coverageAmount.toLocaleString()}</span>
          </div>
          <div style={{ color: '#374151' }}>
            <strong style={{ color: '#1e293b' }}>Policy Type:</strong><br />
            <span style={{ color: '#059669', fontWeight: '600' }}>{quoteType}</span>
          </div>
          <div style={{ color: '#374151' }}>
            <strong style={{ color: '#1e293b' }}>Age:</strong><br />
            <span style={{ color: '#059669', fontWeight: '600' }}>{userAge}</span>
          </div>
          <div style={{ color: '#374151' }}>
            <strong style={{ color: '#1e293b' }}>Gender:</strong><br />
            <span style={{ color: '#059669', fontWeight: '600' }}>{userGender === 'male' ? 'Male' : 'Female'}</span>
          </div>
          <div style={{ color: '#374151' }}>
            <strong style={{ color: '#1e293b' }}>Status:</strong><br />
            <span style={{ color: '#059669', fontWeight: '600' }}>Submitted</span>
          </div>
        </div>
      </div>

      {/* What Happens Next - More Compact */}
      <div style={{ 
        background: '#fef3c7', 
        padding: '1.25rem',
        borderRadius: '12px',
        marginBottom: '1rem',
        border: '1px solid #f59e0b'
      }}>
        <h3 style={{ 
          color: '#92400e', 
          fontSize: '1rem', 
          marginBottom: '0.75rem',
          fontWeight: '600',
          textAlign: 'center'
        }}>
          What Happens Next?
        </h3>
        <ul style={{ 
          textAlign: 'left', 
          color: '#92400e',
          lineHeight: '1.5',
          margin: '0',
          paddingLeft: '1.25rem',
          fontSize: '0.9rem'
        }}>
          <li>You'll receive a confirmation email within 5 minutes</li>
          <li>A licensed agent will call you within 24 hours</li>
          <li>Your policy will be processed and finalized</li>
          <li>Coverage will begin on your selected start date</li>
        </ul>
      </div>

      {/* Contact Information - More Compact */}
      <div style={{ 
        background: '#f0f9ff', 
        padding: '1.25rem',
        borderRadius: '12px',
        marginBottom: '1rem',
        border: '1px solid #0ea5e9'
      }}>
        <h3 style={{ 
          color: '#0c4a6e', 
          fontSize: '1rem', 
          marginBottom: '0.75rem',
          fontWeight: '600',
          textAlign: 'center'
        }}>
          Need Immediate Assistance?
        </h3>
        <p style={{ 
          color: '#0c4a6e', 
          fontSize: '0.9rem',
          margin: '0',
          textAlign: 'center'
        }}>
          <strong>Call us now:</strong> 503-764-5097<br />
          <strong>Hours:</strong> Monday-Friday 8AM-6PM Pacific Time
        </p>
      </div>

      {/* Close Button */}
      <button
        onClick={() => closeModal()}
        style={{
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          padding: '0.875rem 2rem',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = '#2563eb'
          e.currentTarget.style.transform = 'translateY(-1px)'
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = '#3b82f6'
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}
      >
        Finished!
      </button>
    </div>
  )
} 