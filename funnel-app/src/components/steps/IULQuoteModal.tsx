import React, { useState, useEffect, useRef } from 'react'
import { useFunnelStore } from '../../store/funnelStore'
import { calculateQuote, getInsuranceType } from '../../utils/calculations'

export const IULQuoteModal: React.FC = () => {
  const { formData, updateFormData, goToNextStep } = useFunnelStore()
  const [coverageAmount, setCoverageAmount] = useState(0)
  const [monthlyPremium, setMonthlyPremium] = useState(0)
  const [userAge, setUserAge] = useState(30)
  const [userGender, setUserGender] = useState('male')
  const [sliderValue, setSliderValue] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)
  const [insuranceType, setInsuranceType] = useState<'IUL' | 'Final Expense'>('IUL')
  const isMountedRef = useRef(true)

  // Calculate cash value growth potential (only for IUL)
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
    if (formData.contactInfo?.dateOfBirth) {
      const today = new Date()
      const birthDate = new Date(formData.contactInfo.dateOfBirth)
      const age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      const calculatedAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age
      setUserAge(calculatedAge)
      
      // Determine insurance type based on age
      const type = getInsuranceType(calculatedAge)
      setInsuranceType(type)
    }

    // Set initial coverage based on previous selection
    let initialCoverage = 50000 // Default fallback
    if (formData.preQualification?.coverageAmount) {
      const amount = parseInt(formData.preQualification.coverageAmount.replace(/[$,]/g, ''))
      initialCoverage = amount
    }

    setCoverageAmount(initialCoverage)
    setSliderValue(initialCoverage)
    setIsInitialized(true)
  }, [formData.contactInfo?.dateOfBirth, formData.preQualification?.coverageAmount])

  // Update quote when coverage, age, or gender changes
  useEffect(() => {
    if (isInitialized && isMountedRef.current) {
      updateQuote()
    }
  }, [coverageAmount, userAge, userGender, isInitialized])

  const updateQuote = () => {
    if (!isMountedRef.current) return
    
    console.log(`Calculating quote - Age: ${userAge}, Gender: ${userGender}, Coverage: ${coverageAmount}`)
    const quoteResult = calculateQuote(coverageAmount, userAge, userGender)
    console.log(`Quote calculated - Premium: ${quoteResult.premium}, Type: ${quoteResult.type}`)
    setMonthlyPremium(quoteResult.premium)
    setInsuranceType(quoteResult.type)
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
    const quoteData = {
      policyDate: new Date().toISOString().split('T')[0], // Today's date
      coverage: `$${coverageAmount.toLocaleString()}`,
      premium: `$${monthlyPremium.toFixed(2)}`,
      age: userAge.toString(),
      gender: userGender === 'male' ? 'Male' : 'Female',
      type: insuranceType
    }
    
    console.log('🔍 IULQuoteModal - Saving quote data:', quoteData)
    
    updateFormData({
      quoteData: quoteData
    })
    
    console.log('🔍 IULQuoteModal - Quote data saved, calling goToNextStep')
    goToNextStep()
  }

  // Get coverage range based on insurance type and current coverage amount
  const getCoverageRange = () => {
    if (insuranceType === 'Final Expense') {
      // Final Expense typically has lower coverage amounts
      return { min: 5000, max: 20000 }
    } else {
      // IUL coverage ranges
      const currentAmount = coverageAmount || 50000
      if (currentAmount <= 50000) {
        return { min: 25000, max: 100000 }
      } else if (currentAmount <= 100000) {
        return { min: 50000, max: 250000 }
      } else {
        return { min: 100000, max: 1000000 }
      }
    }
  }

  const coverageRange = getCoverageRange()

  const cashValueGrowth = insuranceType === 'IUL' ? calculateCashValueGrowth(coverageAmount, monthlyPremium) : null

  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '1rem', 
      maxHeight: '70vh', 
      overflowY: 'auto'
    }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
        Your Personalized {insuranceType} Quote
      </h2>
      <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.75rem' }}>
        Based on your information, here's your personalized {insuranceType} quote:
      </p>
      
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
        <p style={{ fontSize: '0.9rem', color: 'white', margin: 0, fontWeight: '600', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
          Secure this rate
        </p>
      </div>

      {/* Insurance Type Info */}
      <div style={{ 
        background: '#f8fafc', 
        padding: '0.75rem', 
        borderRadius: '6px', 
        margin: '0.75rem 0',
        border: '1px solid #e2e8f0'
      }}>
        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
          <strong>Insurance Type:</strong> {insuranceType}
          {insuranceType === 'Final Expense' && ' - Covers final expenses and burial costs'}
          {insuranceType === 'IUL' && ' - Indexed Universal Life with cash value growth potential'}
        </p>
      </div>

      {/* Coverage Slider */}
      <div style={{ margin: '1rem 0' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '0.9rem', 
          fontWeight: '600', 
          color: '#374151', 
          marginBottom: '0.5rem' 
        }}>
          Coverage Amount: ${sliderValue.toLocaleString()}
        </label>
        <input
          type="range"
          min={coverageRange.min}
          max={coverageRange.max}
          value={sliderValue}
          onChange={handleSliderChange}
          style={{
            width: '100%',
            height: '8px',
            borderRadius: '4px',
            background: '#e5e7eb',
            outline: 'none',
            WebkitAppearance: 'none',
            cursor: 'pointer'
          }}
        />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          fontSize: '0.7rem', 
          color: '#6b7280', 
          marginTop: '0.25rem' 
        }}>
          <span>${coverageRange.min.toLocaleString()}</span>
          <span>${coverageRange.max.toLocaleString()}</span>
        </div>
      </div>

      {/* Gender Selection */}
      <div style={{ margin: '1rem 0' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '0.9rem', 
          fontWeight: '600', 
          color: '#374151', 
          marginBottom: '0.5rem' 
        }}>
          Gender:
        </label>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {['male', 'female'].map(gender => (
            <label key={gender} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="gender"
                value={gender}
                checked={userGender === gender}
                onChange={(e) => handleGenderChange(e.target.value)}
                style={{ margin: 0 }}
              />
              <span style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}>{gender}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Cash Value Growth (IUL only) */}
      {insuranceType === 'IUL' && cashValueGrowth && (
        <div style={{ 
          background: '#f0f9ff', 
          padding: '0.75rem', 
          borderRadius: '6px', 
          margin: '0.75rem 0',
          border: '1px solid #bae6fd'
        }}>
          <h4 style={{ fontSize: '0.9rem', margin: '0 0 0.5rem 0', color: '#0369a1' }}>
            💰 Cash Value Growth Potential
          </h4>
          <div style={{ fontSize: '0.75rem', color: '#0c4a6e' }}>
            {cashValueGrowth.map(({ year, projectedValue, growth }) => (
              <div key={year} style={{ marginBottom: '0.25rem' }}>
                <strong>{year} years:</strong> ${projectedValue.toLocaleString()} projected value 
                (${growth.toLocaleString()} growth)
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Secure Rate Button - Clear and Prominent */}
      <button
        onClick={handleSecureRate}
        style={{
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          marginTop: '1rem',
          width: '100%',
          maxWidth: '300px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        Secure Your Rate
      </button>

      {/* Age Display */}
      <div style={{ 
        marginTop: '1rem', 
        fontSize: '0.8rem', 
        color: '#6b7280',
        fontStyle: 'italic'
      }}>
        Age: {userAge} years old
      </div>
    </div>
  )
} 