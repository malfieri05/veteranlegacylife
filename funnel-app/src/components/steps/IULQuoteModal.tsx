import React, { useState, useEffect } from 'react'
import { useFunnelStore } from '../../store/funnelStore'
import { calculateIULQuote } from '../../utils/calculations'

export const IULQuoteModal: React.FC = () => {
  const { formData, updateFormData, goToNextStep } = useFunnelStore()
  const [coverageAmount, setCoverageAmount] = useState(50000)
  const [monthlyPremium, setMonthlyPremium] = useState(0)
  const [userAge, setUserAge] = useState(30)
  const [userGender, setUserGender] = useState('male')

  useEffect(() => {
    // Calculate age from date of birth
    if (formData.contactInfo?.dateOfBirth) {
      const today = new Date()
      const birthDate = new Date(formData.contactInfo.dateOfBirth)
      const age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      const calculatedAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age
      setUserAge(calculatedAge)
    }

    // Set initial coverage based on previous selection
    if (formData.coverageAmount) {
      const amount = parseInt(formData.coverageAmount.replace(/[$,]/g, ''))
      setCoverageAmount(amount)
    }

    updateQuote()
  }, [])

  const updateQuote = () => {
    const premium = calculateIULQuote(coverageAmount, userAge, userGender)
    setMonthlyPremium(premium)
  }

  const handleCoverageChange = (value: number) => {
    setCoverageAmount(value)
    updateQuote()
  }

  const handleGenderChange = (gender: string) => {
    setUserGender(gender)
    updateQuote()
  }

  const handleSecureRate = () => {
    // Save quote data and move to next step
    updateFormData({
      applicationData: {
        ...formData.applicationData,
        quoteData: {
          coverageAmount,
          monthlyPremium,
          userAge,
          userGender,
          quoteType: 'IUL'
        }
      }
    })
    goToNextStep()
  }

  const coverageOptions = [
    { value: 25000, label: '$25,000' },
    { value: 50000, label: '$50,000' },
    { value: 100000, label: '$100,000' },
    { value: 250000, label: '$250,000' },
    { value: 500000, label: '$500,000' },
    { value: 1000000, label: '$1,000,000' }
  ]

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>Your Personalized IUL Quote</h2>
      <p>Based on your information, here's your personalized Indexed Universal Life quote:</p>
      
      <div style={{ 
        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
        color: 'white',
        padding: '2rem',
        borderRadius: '12px',
        margin: '2rem 0'
      }}>
        <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          ${monthlyPremium.toLocaleString()}/month
        </div>
        <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Secure this rate</p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>Quote Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <strong>Age:</strong> {userAge}
          </div>
          <div>
            <strong>Gender:</strong> {userGender === 'male' ? 'Male' : 'Female'}
          </div>
          <div>
            <strong>Coverage:</strong> ${coverageAmount.toLocaleString()}
          </div>
          <div>
            <strong>Policy Type:</strong> IUL
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>Adjust Your Coverage</h3>
        <div style={{ marginBottom: '1rem' }}>
          <label>Coverage Amount:</label>
          <select 
            value={coverageAmount}
            onChange={(e) => handleCoverageChange(parseInt(e.target.value))}
            style={{ marginLeft: '1rem', padding: '0.5rem' }}
          >
            {coverageOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label>Gender:</label>
          <div style={{ display: 'inline-flex', gap: '1rem', marginLeft: '1rem' }}>
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={userGender === 'male'}
                onChange={(e) => handleGenderChange(e.target.value)}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={userGender === 'female'}
                onChange={(e) => handleGenderChange(e.target.value)}
              />
              Female
            </label>
          </div>
        </div>
      </div>

      <div style={{ 
        background: '#f8fafc', 
        padding: '1.5rem', 
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h3>IUL Benefits</h3>
        <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0 }}>
          <li>✓ Cash value growth potential</li>
          <li>✓ Flexible premium payments</li>
          <li>✓ Death benefit protection</li>
          <li>✓ Living benefits available</li>
        </ul>
      </div>

      <button
        onClick={handleSecureRate}
        style={{
          background: '#10b981',
          color: 'white',
          border: 'none',
          padding: '1rem 2rem',
          borderRadius: '8px',
          fontSize: '1.1rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease'
        }}
        onMouseOver={(e) => e.currentTarget.style.background = '#059669'}
        onMouseOut={(e) => e.currentTarget.style.background = '#10b981'}
      >
        Secure Your Rate
      </button>
    </div>
  )
} 