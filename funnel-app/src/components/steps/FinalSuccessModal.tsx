import React from 'react'
import { useFunnelStore } from '../../store/funnelStore'

export const FinalSuccessModal: React.FC = () => {
  const { formData, closeModal } = useFunnelStore()

  const firstName = formData.contactInfo?.firstName || 'there'
  const monthlyPremium = formData.applicationData?.quoteData?.monthlyPremium || 0
  const coverageAmount = formData.applicationData?.quoteData?.coverageAmount || 0
  const userAge = formData.applicationData?.quoteData?.userAge || 0
  const userGender = formData.applicationData?.quoteData?.userGender || ''
  const quoteType = formData.applicationData?.quoteData?.quoteType || 'IUL'

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ 
          fontSize: '3rem', 
          color: '#10b981', 
          marginBottom: '1rem',
          fontWeight: 'bold'
        }}>
          🎉
        </div>
        <h2 style={{ 
          color: '#1e293b', 
          fontSize: '2rem', 
          marginBottom: '1rem',
          fontWeight: '600'
        }}>
          Let's Talk, {firstName}!
        </h2>
        <p style={{ 
          color: '#64748b', 
          fontSize: '1.1rem',
          lineHeight: '1.6',
          marginBottom: '2rem'
        }}>
          Your application has been submitted successfully! A licensed insurance representative will contact you within 24 hours to finalize your policy.
        </p>
        
        {/* Prominent Quote Display */}
        <div style={{ 
          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
          color: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            ${monthlyPremium.toLocaleString()}/month
          </div>
          <p style={{ fontSize: '1rem', opacity: 0.9, margin: '0' }}>
            for ${coverageAmount.toLocaleString()} in coverage
          </p>
        </div>
      </div>

      <div style={{ 
        background: '#f8fafc', 
        padding: '1.5rem', 
        borderRadius: '12px',
        marginBottom: '2rem'
      }}>
        <h3 style={{ 
          color: '#1e293b', 
          fontSize: '1.2rem', 
          marginBottom: '1rem',
          fontWeight: '600'
        }}>
          Your Quote Summary:
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '1rem',
          textAlign: 'left'
        }}>
          <div>
            <strong>Monthly Premium:</strong> ${monthlyPremium.toLocaleString()}
          </div>
          <div>
            <strong>Coverage Amount:</strong> ${coverageAmount.toLocaleString()}
          </div>
          <div>
            <strong>Policy Type:</strong> {quoteType}
          </div>
          <div>
            <strong>Age:</strong> {userAge}
          </div>
          <div>
            <strong>Gender:</strong> {userGender === 'male' ? 'Male' : 'Female'}
          </div>
          <div>
            <strong>Application Status:</strong> Submitted
          </div>
        </div>
      </div>

      <div style={{ 
        background: '#fef3c7', 
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        border: '1px solid #f59e0b'
      }}>
        <h3 style={{ 
          color: '#92400e', 
          fontSize: '1.1rem', 
          marginBottom: '1rem',
          fontWeight: '600'
        }}>
          What Happens Next?
        </h3>
        <ul style={{ 
          textAlign: 'left', 
          color: '#92400e',
          lineHeight: '1.6',
          margin: '0',
          paddingLeft: '1.5rem'
        }}>
          <li>You'll receive a confirmation email within 5 minutes</li>
          <li>A licensed agent will call you within 24 hours</li>
          <li>Your policy will be processed and finalized</li>
          <li>Coverage will begin on your selected start date</li>
        </ul>
      </div>

      <div style={{ 
        background: '#f0f9ff', 
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        border: '1px solid #0ea5e9'
      }}>
        <h3 style={{ 
          color: '#0c4a6e', 
          fontSize: '1.1rem', 
          marginBottom: '1rem',
          fontWeight: '600'
        }}>
          Need Immediate Assistance?
        </h3>
        <p style={{ 
          color: '#0c4a6e', 
          fontSize: '1rem',
          margin: '0'
        }}>
          <strong>Call us now:</strong> (555) 123-4567<br />
          <strong>Hours:</strong> Monday-Friday 8AM-6PM EST
        </p>
      </div>

      <button
        onClick={closeModal}
        style={{
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          padding: '1rem 2rem',
          borderRadius: '8px',
          fontSize: '1.1rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease'
        }}
        onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
        onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}
      >
        Close
      </button>
    </div>
  )
} 