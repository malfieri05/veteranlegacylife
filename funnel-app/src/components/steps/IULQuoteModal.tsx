import React, { useState, useEffect } from 'react'
import { useFunnelStore } from '../../store/funnelStore'
import { calculateIULQuote } from '../../utils/calculations'

export const IULQuoteModal: React.FC = () => {
  const { formData, updateFormData, goToNextStep } = useFunnelStore()
  const [coverageAmount, setCoverageAmount] = useState(50000)
  const [monthlyPremium, setMonthlyPremium] = useState(0)
  const [userAge, setUserAge] = useState(30)
  const [userGender, setUserGender] = useState('male')
  const [sliderValue, setSliderValue] = useState(50000)

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
      setSliderValue(amount)
    }
  }, [formData.contactInfo?.dateOfBirth, formData.coverageAmount])

  // Update quote when coverage, age, or gender changes
  useEffect(() => {
    updateQuote()
  }, [coverageAmount, userAge, userGender])

  const updateQuote = () => {
    console.log(`Calculating quote - Age: ${userAge}, Gender: ${userGender}, Coverage: ${coverageAmount}`)
    const premium = calculateIULQuote(coverageAmount, userAge, userGender)
    console.log(`Quote calculated - Premium: ${premium}`)
    setMonthlyPremium(premium)
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    setSliderValue(value)
    setCoverageAmount(value)
    console.log(`Slider changed to: ${value}`)
  }

  const handleGenderChange = (gender: string) => {
    setUserGender(gender)
    console.log(`Gender changed to: ${gender}`)
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

  // Get coverage range based on previous selection
  const getCoverageRange = () => {
    if (formData.coverageAmount) {
      const amount = parseInt(formData.coverageAmount.replace(/[$,]/g, ''))
      if (amount <= 50000) {
        return { min: 25000, max: 100000 }
      } else if (amount <= 100000) {
        return { min: 50000, max: 250000 }
      } else {
        return { min: 100000, max: 1000000 }
      }
    }
    return { min: 25000, max: 100000 } // Default range
  }

  const coverageRange = getCoverageRange()

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
        
        {/* Coverage Slider */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Coverage Amount: ${sliderValue.toLocaleString()}
          </label>
          <input
            type="range"
            min={coverageRange.min}
            max={coverageRange.max}
            step={5000}
            value={sliderValue}
            onChange={handleSliderChange}
            style={{
              width: '100%',
              height: '8px',
              borderRadius: '4px',
              background: '#e5e7eb',
              outline: 'none',
              cursor: 'pointer'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
            <span>${coverageRange.min.toLocaleString()}</span>
            <span>${coverageRange.max.toLocaleString()}</span>
          </div>
        </div>
        
        {/* Gender Selection */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Gender:</label>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={userGender === 'male'}
                onChange={(e) => handleGenderChange(e.target.value)}
              />
              Male
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
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