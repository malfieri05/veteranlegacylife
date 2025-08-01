import React, { useState, useEffect, useRef } from 'react'
import { useFunnelStore } from '../../store/funnelStore'
import { calculateQuote, calculateAge, getInsuranceType, getCoverageRange, calculateHealthTier } from '../../utils/calculations'

export const IULQuoteModal: React.FC = () => {
  const { formData, updateFormData, goToNextStep } = useFunnelStore()
  const [coverageAmount, setCoverageAmount] = useState(0)
  const [monthlyPremium, setMonthlyPremium] = useState(0)
  const [userAge, setUserAge] = useState(30)
  const [userGender, setUserGender] = useState('male')
  const [sliderValue, setSliderValue] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)
  const [insuranceType, setInsuranceType] = useState<'IUL' | 'Final Expense'>('IUL')
  const [showInteractiveProjection, setShowInteractiveProjection] = useState(false)
  const isMountedRef = useRef(true)

  // IUL Cash Value Projection Function
  const projectIULCashValue = ({
    monthlyPremium,
    years = 40,
    annualReturn = 0.1025,
    insuranceDrag = 0.01,
    stopPremiumAfterYears = 20,
  }: {
    monthlyPremium: number
    years?: number
    annualReturn?: number
    insuranceDrag?: number
    stopPremiumAfterYears?: number
  }) => {
    const annualPremium = monthlyPremium * 12
    const netReturn = annualReturn - insuranceDrag
    let cashValue = 0
    const projection = []

    for (let year = 1; year <= years; year++) {
      if (year <= stopPremiumAfterYears) {
        cashValue += annualPremium
      }
      cashValue *= 1 + netReturn
      projection.push({ year, cashValue: Math.round(cashValue) })
    }

    return projection
  }

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
    // Calculate age from birthday question
    if (formData.contactInfo?.dateOfBirth) {
      const calculatedAge = calculateAge(formData.contactInfo.dateOfBirth);
      setUserAge(calculatedAge);
      
      // Determine insurance type based on calculated age
      const type = getInsuranceType(calculatedAge);
      setInsuranceType(type);
      
      console.log(`User age calculated: ${calculatedAge}, Insurance type: ${type}`);
    }

    // Set initial coverage from previous coverage amount question
    let initialCoverage = 25000; // Default fallback
    
    if (formData.preQualification?.coverageAmount) {
      // Parse the coverage amount from the previous question
      const previousAmount = formData.preQualification.coverageAmount;
      const numericAmount = parseInt(previousAmount.replace(/[$,]/g, ''));
      
      // Use their previous selection but ensure it meets minimum requirements
      if (userAge >= 61) {
        // Final Expense: 5K-20K range
        initialCoverage = Math.max(5000, Math.min(numericAmount, 20000));
      } else {
        // IUL: 25K+ range  
        initialCoverage = Math.max(25000, numericAmount);
      }
      
      console.log(`Previous coverage selection: ${previousAmount}, Adjusted to: ${initialCoverage}`);
    }

    setCoverageAmount(initialCoverage);
    setSliderValue(initialCoverage);
    setIsInitialized(true);
  }, [formData.contactInfo?.dateOfBirth, formData.preQualification?.coverageAmount, userAge]);

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
    console.log('🔍 IULQuoteModal - handleSecureRate called!')
    console.log('🔍 Current step before:', useFunnelStore.getState().currentStep)
    
    try {
    // Calculate health tier from medical answers
    const healthTier = calculateHealthTier(formData.medicalAnswers || {});
      console.log('🔍 Health tier calculated:', healthTier)
    
    const quoteData = {
      policyDate: new Date().toISOString().split('T')[0],
      coverage: `$${coverageAmount.toLocaleString()}`,
      premium: `$${monthlyPremium.toFixed(2)}`,
      age: userAge.toString(),
      gender: userGender === 'male' ? 'Male' : 'Female',
      type: insuranceType,
      healthTier: healthTier
    }
    
    console.log('🔍 IULQuoteModal - Saving quote data with health tier:', quoteData)
    
    updateFormData({ quoteData });
      console.log('🔍 Form data updated successfully')
      
      console.log('🔍 About to call goToNextStep')
    goToNextStep();
      console.log('🔍 After goToNextStep call')
      
    } catch (error: unknown) {
      console.error('🔍 Error in handleSecureRate:', error)
      if (error instanceof Error) {
        console.error('🔍 Error stack:', error.stack)
      }
      alert('There was an error processing your request. Please try again.')
    }
  }

  const coverageRange = getCoverageRange(insuranceType, userAge)

  const cashValueGrowth = insuranceType === 'IUL' ? calculateCashValueGrowth(coverageAmount, monthlyPremium) : null
  
  // Calculate interactive IUL projection
  const iulProjection = insuranceType === 'IUL' ? projectIULCashValue({
    monthlyPremium,
    years: 40,
    annualReturn: 0.1025,
    insuranceDrag: 0.01,
    stopPremiumAfterYears: 20
  }) : null

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
      
      {/* Coverage Amount Display - Prominent Green Box */}
      <div style={{ 
        background: 'linear-gradient(135deg, #10b981, #059669)', 
        color: 'white',
        padding: '1.25rem',
        borderRadius: '8px',
        margin: '1rem 0',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)'
      }}>
        <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.9 }}>
          Coverage Amount
        </div>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: '1', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
          ${sliderValue.toLocaleString()}
        </div>
      </div>

      {/* Coverage Slider */}
      <div style={{ margin: '1rem 0' }}>
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
      
      {/* Premium Display - Smaller and Less Prominent */}
      <div style={{ 
        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
        color: 'white',
        padding: '0.75rem',
        borderRadius: '6px',
        margin: '0.75rem auto',
        textAlign: 'center',
        maxWidth: '300px'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem', lineHeight: '1' }}>
          ${monthlyPremium.toLocaleString()}/month
        </div>
        <p style={{ fontSize: '0.8rem', color: 'white', margin: 0, fontWeight: '500', opacity: 0.9 }}>
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

      {/* Interactive IUL Cash Value Projection (IUL only) */}
      {insuranceType === 'IUL' && iulProjection && (
        <div style={{ 
          background: '#ffffff', 
          padding: '1.25rem', 
          borderRadius: '12px', 
          margin: '0.75rem 0',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
        }}>
          
          {/* Interactive 40-Year Projection Graph */}
          <div style={{ 
            background: '#f8fafc', 
            padding: '1rem', 
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            marginBottom: '1rem'
          }}>
            <div style={{ 
              fontSize: '0.9rem', 
              color: '#374151', 
              marginBottom: '0.75rem',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              Policy Value Projections
            </div>
            
            {/* Interactive Line Graph */}
            <div style={{ 
              height: '150px', 
              position: 'relative',
              marginBottom: '0.5rem'
            }}>
              {/* Y-axis labels */}
              <div style={{ 
                position: 'absolute', 
                left: '0', 
                top: '0', 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                fontSize: '0.6rem',
                color: '#6b7280',
                width: '35px'
              }}>
                <span>${Math.max(...iulProjection.map(p => p.cashValue)).toLocaleString()}</span>
                <span>${Math.round(Math.max(...iulProjection.map(p => p.cashValue)) * 0.75).toLocaleString()}</span>
                <span>${Math.round(Math.max(...iulProjection.map(p => p.cashValue)) * 0.5).toLocaleString()}</span>
                <span>${Math.round(Math.max(...iulProjection.map(p => p.cashValue)) * 0.25).toLocaleString()}</span>
                <span>$0</span>
              </div>
              
              {/* Graph area */}
              <div style={{ 
                position: 'absolute', 
                left: '40px', 
                top: '0', 
                right: '0', 
                height: '100%',
                borderLeft: '1px solid #d1d5db',
                borderBottom: '1px solid #d1d5db'
              }}>
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map((percent, index) => (
                  <div key={index} style={{
                    position: 'absolute',
                    left: '0',
                    right: '0',
                    top: `${percent}%`,
                    height: '1px',
                    background: '#e5e7eb'
                  }} />
                ))}
                
                {/* Data line */}
                <svg style={{ 
                  position: 'absolute', 
                  left: '0', 
                  top: '0', 
                  width: '100%', 
                  height: '100%',
                  overflow: 'visible'
                }}>
                  <defs>
                    <linearGradient id="iulLineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.1"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Area fill */}
                  <path
                    d={`M 0 ${100 - (iulProjection[0]?.cashValue || 0) / Math.max(...iulProjection.map(p => p.cashValue)) * 100} ${iulProjection.map((point, index) => 
                      `L ${(index / (iulProjection.length - 1)) * 100} ${100 - (point.cashValue / Math.max(...iulProjection.map(p => p.cashValue))) * 100}`
                    ).join(' ')} V 100 Z`}
                    fill="url(#iulLineGradient)"
                  />
                  
                  {/* Line */}
                  <path
                    d={`M 0 ${100 - (iulProjection[0]?.cashValue || 0) / Math.max(...iulProjection.map(p => p.cashValue)) * 100} ${iulProjection.map((point, index) => 
                      `L ${(index / (iulProjection.length - 1)) * 100} ${100 - (point.cashValue / Math.max(...iulProjection.map(p => p.cashValue))) * 100}`
                    ).join(' ')}`}
                    stroke="#10b981"
                    strokeWidth="2"
                    fill="none"
                  />
                  
                  {/* Data points for key years */}
                  {[0, 9, 19, 29, 39].map((index) => {
                    const point = iulProjection[index]
                    if (!point) return null
                    return (
                      <circle
                        key={index}
                        cx={`${(index / (iulProjection.length - 1)) * 100}%`}
                        cy={`${100 - (point.cashValue / Math.max(...iulProjection.map(p => p.cashValue))) * 100}%`}
                        r="3"
                        fill="#10b981"
                        stroke="white"
                        strokeWidth="1"
                      />
                    )
                  })}
                </svg>
                
                {/* X-axis labels */}
                <div style={{ 
                  position: 'absolute', 
                  bottom: '-20px', 
                  left: '0', 
                  right: '0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.6rem',
                  color: '#6b7280'
                }}>
                  <span>Year 1</span>
                  <span>Year 10</span>
                  <span>Year 20</span>
                  <span>Year 30</span>
                  <span>Year 40</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Benefit Summary Cards */}
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem',
            justifyContent: 'space-between'
          }}>
            <div style={{ 
              background: '#f0f9ff', 
              padding: '0.5rem', 
              borderRadius: '6px',
              border: '1px solid #bae6fd',
              flex: '1',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.7rem', color: '#0369a1', marginBottom: '0.25rem' }}>
                Monthly Premium
              </div>
              <div style={{ 
                background: 'white', 
                padding: '0.25rem', 
                borderRadius: '4px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                color: '#1e293b'
              }}>
                ${monthlyPremium.toFixed(0)}
              </div>
            </div>
            
            <div style={{ 
              background: '#f0f9ff', 
              padding: '0.5rem', 
              borderRadius: '6px',
              border: '1px solid #bae6fd',
              flex: '1',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.7rem', color: '#0369a1', marginBottom: '0.25rem' }}>
                Death Benefit
              </div>
              <div style={{ 
                background: 'white', 
                padding: '0.25rem', 
                borderRadius: '4px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                color: '#1e293b'
              }}>
                ${coverageAmount.toLocaleString()}
              </div>
            </div>
            
            <div style={{ 
              background: '#f0f9ff', 
              padding: '0.5rem', 
              borderRadius: '6px',
              border: '1px solid #bae6fd',
              flex: '1',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.7rem', color: '#0369a1', marginBottom: '0.25rem' }}>
                Year 40 Value
              </div>
              <div style={{ 
                background: 'white', 
                padding: '0.25rem', 
                borderRadius: '4px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                color: '#1e293b'
              }}>
                ${(iulProjection[39]?.cashValue || 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Secure Rate Button - Clear and Prominent */}
      <button
        onClick={(e) => {
          console.log('🔍 Button clicked!')
          e.preventDefault()
          e.stopPropagation()
          handleSecureRate()
        }}
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
          maxWidth: '300px',
          position: 'relative',
          zIndex: 10,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
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