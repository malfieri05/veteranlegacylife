import React from 'react'
import { useFunnelStore } from '../../store/funnelStore'

export const PreQualifiedSuccess: React.FC = () => {
  const { } = useFunnelStore()

  const handleCompleteApplication = () => {
    // Move to the IUL Quote Modal step
    useFunnelStore.getState().setCurrentStep(13)
  }

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
          Pre-Qualified!
        </h2>
        <p style={{ 
          color: '#64748b', 
          fontSize: '1.1rem',
          lineHeight: '1.6',
          marginBottom: '2rem'
        }}>
          Congratulations! Based on your answers, you appear to qualify for life insurance coverage.
        </p>
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
          Next Steps:
        </h3>
        <ul style={{ 
          textAlign: 'left', 
          color: '#64748b',
          lineHeight: '1.6'
        }}>
          <li>Get your personalized quote</li>
          <li>Review coverage options</li>
          <li>Complete your application</li>
          <li>Start your coverage</li>
        </ul>
      </div>

      <button
        onClick={handleCompleteApplication}
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
        Complete Application
      </button>

      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem',
        background: '#fef3c7',
        borderRadius: '8px',
        border: '1px solid #f59e0b'
      }}>
        <p style={{ 
          color: '#92400e', 
          fontSize: '0.9rem',
          margin: '0'
        }}>
          <strong>Need help?</strong> Call us at (555) 123-4567<br />
          Monday-Friday 8AM-6PM EST
        </p>
      </div>
    </div>
  )
} 