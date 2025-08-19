import React, { useEffect } from 'react'
import { useFunnelStore } from '../../store/funnelStore'

export const LoadingScreen: React.FC = () => {
  const { goToNextStep } = useFunnelStore()

  useEffect(() => {
    // Auto-advance to next step after 3 seconds
    const timer = setTimeout(() => {
      goToNextStep()
    }, 3000)

    return () => clearTimeout(timer)
  }, [goToNextStep])

  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '300px'
    }}>
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
      
      <div style={{
        width: '60px',
        height: '60px',
        border: '4px solid #e5e7eb',
        borderTop: '4px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '1.5rem'
      }}></div>
      
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#374151' }}>
        Processing Your Information
      </h2>
      
      <p style={{ fontSize: '1rem', color: '#6b7280', marginBottom: '1rem' }}>
        We're analyzing your responses to find the best insurance options for you.
      </p>
      
      <div style={{ 
        background: '#f8fafc', 
        padding: '1rem', 
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        maxWidth: '400px'
      }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#374151' }}>
          What we're checking:
        </h3>
        <ul style={{ 
          textAlign: 'left', 
          listStyle: 'none', 
          padding: 0, 
          margin: 0,
          fontSize: '0.9rem',
          color: '#6b7280'
        }}>
          <li style={{ marginBottom: '0.25rem' }}>✓ Military service eligibility</li>
          <li style={{ marginBottom: '0.25rem' }}>✓ Health and medical factors</li>
          <li style={{ marginBottom: '0.25rem' }}>✓ Coverage requirements</li>
          <li style={{ marginBottom: '0.25rem' }}>✓ Available policy options</li>
        </ul>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
} 