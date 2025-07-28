import React, { useState, useEffect, useRef } from 'react'
import { useFunnelStore } from '../../store/funnelStore'
import { calculateIULQuote } from '../../utils/calculations'

export const IULQuoteModal: React.FC = () => {
  const { formData, updateFormData, goToNextStep } = useFunnelStore()
  const [coverageAmount, setCoverageAmount] = useState(0)
  const [monthlyPremium, setMonthlyPremium] = useState(0)
  const [userAge, setUserAge] = useState(30)
  const [userGender, setUserGender] = useState('male')
  const [sliderValue, setSliderValue] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)
  const isMountedRef = useRef(true)

  // Calculate cash value growth potential
  const calculateCashValueGrowth = (coverage: number, premium: number) => {
    const annualPremium = premium * 12
    const growthRate = 0.06 // 6% average annual growth rate for IUL
    const years = [10, 20, 30]
    
    return years.map(year => {
      // Simple compound interest calculation
      // Assumes premium payments and growth on accumulated value
      let totalValue = 0
      for (let i = 1; i <= year; i++) {
        totalValue = (totalValue + annualPremium) * (1 + growthRate)
      }
      
      // Cap at 90% of death benefit for conservative estimate
      const maxValue = coverage * 0.9
      const projectedValue = Math.min(totalValue, maxValue)
      
      return {
        year,
        projectedValue: Math.round(projectedValue),
        totalPremiums: annualPremium * year,
        growth: Math.round(projectedValue - (annualPremium * year))
      }
    })
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    // Calculate age from date of birth
    if (formData.dateOfBirth) {
      const today = new Date()
      const birthDate = new Date(formData.dateOfBirth)
      const age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      const calculatedAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age
      setUserAge(calculatedAge)
    }

    // Set initial coverage based on previous selection
    let initialCoverage = 50000 // Default fallback
    if (formData.coverageAmount) {
      const amount = parseInt(formData.coverageAmount.replace(/[$,]/g, ''))
      initialCoverage = amount
    }

    setCoverageAmount(initialCoverage)
    setSliderValue(initialCoverage)
    setIsInitialized(true)
  }, [formData.dateOfBirth, formData.coverageAmount])

  // Update quote when coverage, age, or gender changes
  useEffect(() => {
    if (isInitialized && isMountedRef.current) {
      updateQuote()
    }
  }, [coverageAmount, userAge, userGender, isInitialized])

  const updateQuote = () => {
    if (!isMountedRef.current) return
    
    console.log(`Calculating quote - Age: ${userAge}, Gender: ${userGender}, Coverage: ${coverageAmount}`)
    // The calculateIULQuote function now uses interpolation to provide more granular pricing
    // instead of fixed bracket prices, giving users more accurate quotes based on their exact coverage amount
    const premium = calculateIULQuote(coverageAmount, userAge, userGender)
    console.log(`Quote calculated - Premium: ${premium}`)
    setMonthlyPremium(premium)
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    setSliderValue(value)
    setCoverageAmount(value)
    console.log(`Slider changed to: ${value}`)
    // Remove setTimeout to prevent React error #90
  }

  const handleGenderChange = (gender: string) => {
    setUserGender(gender)
    console.log(`Gender changed to: ${gender}`)
    // Remove setTimeout to prevent React error #90
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

  // Get coverage range based on current coverage amount
  const getCoverageRange = () => {
    const currentAmount = coverageAmount || 50000
    if (currentAmount <= 50000) {
      return { min: 25000, max: 100000 }
    } else if (currentAmount <= 100000) {
      return { min: 50000, max: 250000 }
    } else {
      return { min: 100000, max: 1000000 }
    }
  }

  const coverageRange = getCoverageRange()
  const isDefaultCoverage = formData.coverageAmount && 
    parseInt(formData.coverageAmount.replace(/[$,]/g, '')) === coverageAmount

  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '1rem', 
      maxHeight: '70vh', 
      overflowY: 'auto'
    }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Your Personalized IUL Quote</h2>
      <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.75rem' }}>Based on your information, here's your personalized Indexed Universal Life quote:</p>
      
      {/* Premium Display - Much More Compact */}
      <div style={{ 
        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
        color: 'white',
        padding: '1rem',
        borderRadius: '8px',
        margin: '0.75rem 0'
      }}>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem', lineHeight: '1' }}>
          ${monthlyPremium.toLocaleString()}/month
        </div>
        <p style={{ fontSize: '0.9rem', color: 'white', margin: 0, fontWeight: '600', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>Secure this rate</p>
      </div>

      {/* Secure Rate Button - Clear and Prominent */}
      <button
        onClick={handleSecureRate}
        style={{
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          border: 'none',
          padding: '1rem 2rem',
          borderRadius: '8px',
          fontSize: '1.1rem',
          fontWeight: '700',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          width: '100%',
          maxWidth: '300px',
          margin: '1rem 0',
          boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, #059669, #047857)'
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 8px 15px -3px rgba(16, 185, 129, 0.4)'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, #10b981, #059669)'
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(16, 185, 129, 0.3)'
        }}
      >
        🔒 Secure Your Rate
      </button>

      {/* Quote Details - Much More Compact */}
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Quote Details</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '0.5rem', 
          fontSize: '0.8rem',
          background: '#f8fafc',
          padding: '0.75rem',
          borderRadius: '6px'
        }}>
          <div>
            <strong>Age:</strong> {userAge}
          </div>
          <div>
            <strong>Gender:</strong> {userGender === 'male' ? 'Male' : 'Female'}
          </div>
          <div>
            <strong>Coverage:</strong> ${coverageAmount.toLocaleString()}
            {isDefaultCoverage && (
              <span style={{ 
                fontSize: '0.7rem', 
                color: '#059669', 
                marginLeft: '0.25rem',
                fontWeight: 'normal'
              }}>
                (your selection)
              </span>
            )}
          </div>
          <div>
            <strong>Policy Type:</strong> IUL
          </div>
        </div>
      </div>

      {/* Adjust Coverage Section - Much More Compact */}
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Adjust Your Coverage</h3>
        
        {isDefaultCoverage && (
          <div style={{
            background: '#f0f9ff',
            border: '1px solid #0ea5e9',
            borderRadius: '4px',
            padding: '0.5rem',
            marginBottom: '0.75rem',
            fontSize: '0.75rem',
            color: '#0369a1'
          }}>
            ✓ Coverage amount set to your previous selection of ${coverageAmount.toLocaleString()}
          </div>
        )}
        
        {/* Coverage Slider */}
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold', fontSize: '0.8rem' }}>
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
              height: '4px',
              borderRadius: '2px',
              background: '#e5e7eb',
              outline: 'none',
              cursor: 'pointer'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem', fontSize: '0.7rem', color: '#6b7280' }}>
            <span>${coverageRange.min.toLocaleString()}</span>
            <span>${coverageRange.max.toLocaleString()}</span>
          </div>
        </div>
        
        {/* Gender Selection */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold', fontSize: '0.8rem' }}>Gender:</label>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem' }}>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={userGender === 'male'}
                onChange={(e) => handleGenderChange(e.target.value)}
              />
              Male
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem' }}>
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

      {/* IUL Benefits - Much More Compact */}
      <div style={{ 
        background: '#f8fafc', 
        padding: '0.75rem', 
        borderRadius: '6px',
        marginBottom: '1rem'
      }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>IUL Benefits</h3>
        <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0, fontSize: '0.75rem', margin: 0 }}>
          <li style={{ marginBottom: '0.125rem' }}>✓ Cash value growth potential</li>
          <li style={{ marginBottom: '0.125rem' }}>✓ Flexible premium payments</li>
          <li style={{ marginBottom: '0.125rem' }}>✓ Death benefit protection</li>
          <li style={{ marginBottom: '0.125rem' }}>✓ Living benefits available</li>
        </ul>
      </div>

      {/* Cash Value Growth Calculator */}
      <div style={{ 
        background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)', 
        padding: '0.75rem', 
        borderRadius: '6px',
        marginBottom: '1rem',
        border: '1px solid #0ea5e9'
      }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#0369a1' }}>
          💰 Cash Value Growth Potential
        </h3>
        <p style={{ fontSize: '0.7rem', color: '#0369a1', marginBottom: '0.5rem', fontStyle: 'italic' }}>
          Projected growth based on 6% annual rate (conservative estimate)
        </p>
        
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {calculateCashValueGrowth(coverageAmount, monthlyPremium).map((projection) => (
            <div key={projection.year} style={{
              background: 'white',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #e0f2fe',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.75rem'
            }}>
              <div>
                <strong style={{ color: '#0369a1' }}>{projection.year} Years</strong>
                <div style={{ fontSize: '0.65rem', color: '#6b7280' }}>
                  Premiums: ${projection.totalPremiums.toLocaleString()}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold', color: '#059669', fontSize: '0.8rem' }}>
                  ${projection.projectedValue.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#059669' }}>
                  +${projection.growth.toLocaleString()} growth
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 