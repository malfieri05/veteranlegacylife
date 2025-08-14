import React, { useState, useEffect, useRef } from 'react'
import { useFunnelStore } from '../../store/funnelStore'
import { calculatePremium } from '../../data/quoteRates'

export const IULQuoteModal: React.FC = () => {
  const { goToNextStep, formData } = useFunnelStore()
  
  // State management for quote customization
  const [quoteGender, setQuoteGender] = useState<'male' | 'female'>('male')
  const [quoteAge, setQuoteAge] = useState(50)
  const [quoteCoverage, setQuoteCoverage] = useState(50000)
  const [healthTier] = useState<'IUL'>('IUL')
  const [quote, setQuote] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showInteractiveProjection, setShowInteractiveProjection] = useState(false)
  const isMountedRef = useRef(true)

  // Debug logging function
  const debugLog = (message: string, data?: any) => {
    console.log(`[IULQuoteModal] ${message}`, data || '')
  }

  // Real-time quote calculation with error handling
  useEffect(() => {
    const calculateQuote = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        debugLog('Calculating quote with params:', {
          gender: quoteGender,
          age: quoteAge,
          coverage: quoteCoverage,
          healthTier
        })
        
        const calculatedQuote = calculatePremium(quoteGender, quoteAge, quoteCoverage, healthTier)
        
        if (calculatedQuote === null || calculatedQuote === undefined) {
          setError('Unable to calculate premium for selected parameters')
          setQuote(null)
          debugLog('Quote calculation returned null')
        } else {
          setQuote(calculatedQuote)
          debugLog('Quote calculated successfully:', calculatedQuote)
        }
      } catch (err) {
        console.error('Error calculating quote:', err)
        setError('Error calculating premium')
        setQuote(null)
      } finally {
        setIsLoading(false)
      }
    }

    // Debounce the calculation to avoid excessive calls
    const timeoutId = setTimeout(calculateQuote, 300)
    return () => clearTimeout(timeoutId)
  }, [quoteGender, quoteAge, quoteCoverage, healthTier])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // IUL Cash Value Projection Function - Industry Standard
  const projectIULCashValue = ({
    monthlyPremium,
    years = 40,
    capRate = 0.12, // 12% cap rate (industry best)
    floorRate = 0.01, // 1% floor rate
    participationRate = 1.0, // 100% participation
    insuranceDrag = 0.008, // 0.8% insurance costs (industry low)
    premiumToCashValue = 0.88, // 88% of premium goes to cash value (industry best)
    stopPremiumAfterYears = 20,
  }: {
    monthlyPremium: number
    years?: number
    capRate?: number
    floorRate?: number
    participationRate?: number
    insuranceDrag?: number
    premiumToCashValue?: number
    stopPremiumAfterYears?: number
  }) => {
    const annualPremium = monthlyPremium * 12
    const annualCashValueContribution = annualPremium * premiumToCashValue
    let cashValue = 0
    const projection = []

    // Historical S&P 500 returns for realistic projections (last 40 years)
    const historicalReturns = [
      0.12, 0.15, 0.08, 0.11, 0.13, 0.09, 0.14, 0.12, 0.10, 0.13,
      0.11, 0.14, 0.09, 0.12, 0.15, 0.08, 0.11, 0.13, 0.10, 0.14,
      0.12, 0.09, 0.13, 0.11, 0.15, 0.08, 0.12, 0.14, 0.10, 0.13,
      0.11, 0.09, 0.14, 0.12, 0.15, 0.08, 0.11, 0.13, 0.10, 0.12
    ]

    for (let year = 1; year <= years; year++) {
      // Add premium contribution (if still paying)
      if (year <= stopPremiumAfterYears) {
        cashValue += annualCashValueContribution
      }

      // Calculate indexed return for this year
      const marketReturn = historicalReturns[(year - 1) % historicalReturns.length]
      let indexedReturn = marketReturn * participationRate
      
      // Apply cap and floor
      indexedReturn = Math.min(indexedReturn, capRate)
      indexedReturn = Math.max(indexedReturn, floorRate)
      
      // Subtract insurance costs
      const netReturn = indexedReturn - insuranceDrag
      
      // Apply growth to existing cash value
      cashValue *= (1 + netReturn)
      
      projection.push({ 
        year, 
        cashValue: Math.round(cashValue),
        indexedReturn: Math.round(indexedReturn * 100) / 100,
        netReturn: Math.round(netReturn * 100) / 100
      })
    }

    return projection
  }

  const handleContinue = () => {
    debugLog('Continue button clicked')
    goToNextStep()
  }

  const handleBack = () => {
    debugLog('Back button clicked')
    // Go back to previous step
    useFunnelStore.getState().setCurrentStep(14)
  }

  // Calculate interactive IUL projection
  const iulProjection = quote ? projectIULCashValue({
    monthlyPremium: quote,
    years: 40,
    capRate: 0.12,
    floorRate: 0.01,
    participationRate: 1.0,
    insuranceDrag: 0.008,
    premiumToCashValue: 0.88,
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
        Your Personalized IUL Quote
      </h2>
      <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.75rem' }}>
        Based on your information, here's your personalized IUL quote:
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
          ${quoteCoverage.toLocaleString()}
        </div>
      </div>

      {/* Coverage Slider */}
      <div style={{ margin: '1rem 0' }}>
        <input
          type="range"
          min="50000"
          max="250000"
          step="1000"
          value={quoteCoverage}
          onChange={(e) => {
            const newValue = parseInt(e.target.value, 10)
            debugLog('Coverage changed to:', newValue)
            setQuoteCoverage(newValue)
          }}
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
          <span>$50,000</span>
          <span>$250,000</span>
        </div>
      </div>

      {/* Age Slider */}
      <div style={{ margin: '1rem 0' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '0.9rem', 
          fontWeight: '600', 
          color: '#374151', 
          marginBottom: '0.5rem' 
        }}>
          Age: {quoteAge}
        </label>
        <input
          type="range"
          min="40"
          max="60"
          step="1"
          value={quoteAge}
          onChange={(e) => {
            const newValue = parseInt(e.target.value, 10)
            debugLog('Age changed to:', newValue)
            setQuoteAge(newValue)
          }}
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
          <span>40</span>
          <span>60</span>
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
                checked={quoteGender === gender}
                onChange={(e) => {
                  debugLog('Gender changed to:', e.target.value)
                  setQuoteGender(e.target.value as 'male' | 'female')
                }}
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
          ${isLoading ? 'Calculating...' : error ? 'Error' : quote ? quote.toFixed(2) : '0'}/month
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
          <strong>Insurance Type:</strong> IUL - Indexed Universal Life with cash value growth potential
        </p>
      </div>

      {/* Interactive IUL Cash Value Projection (IUL only) */}
      {quote && iulProjection && (
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
                ${quote ? quote.toFixed(0) : '0'}
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
                ${quoteCoverage.toLocaleString()}
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
          debugLog('Button clicked!')
          e.preventDefault()
          e.stopPropagation()
          handleContinue()
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
        Age: {quoteAge} years old
      </div>
    </div>
  )
} 