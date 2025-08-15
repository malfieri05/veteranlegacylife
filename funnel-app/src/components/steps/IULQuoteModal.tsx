import React, { useState, useEffect, useRef } from 'react'
import { useFunnelStore } from '../../store/funnelStore'
import { calculatePremium } from '../../data/quoteRates'

export const IULQuoteModal: React.FC = () => {
  const { goToNextStep, formData, updateFormData } = useFunnelStore()
  
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

  /**
   * Calculate IUL cash value projection
   * @param {number} monthlyPremium - User's monthly premium in dollars
   * @param {number} years - Projection length (default 25 years)
   * @returns {Array} - Array of projection data for each year
   */
  const projectIULCashValue = ({
    monthlyPremium,
    years = 25,
  }: {
    monthlyPremium: number
    years?: number
  }) => {
    const annualReturn = 0.11; // 11% annual return
    const annualPremium = monthlyPremium * 12;
    let cashValue = 0;
    const projection = [];

    for (let year = 1; year <= years; year++) {
      let allocationPercent;

      if (year === 1) {
        allocationPercent = 0.70; // Year 1: 70% to cash value
      } else if (year === 2) {
        allocationPercent = 0.85; // Year 2: 85% to cash value
      } else {
        allocationPercent = 0.90; // Year 3+: 90% to cash value
      }

      const allocatedPremium = annualPremium * allocationPercent;

      // Add allocated premium, then grow by annual return
      cashValue = (cashValue + allocatedPremium) * (1 + annualReturn);

      projection.push({ 
        year, 
        cashValue: Math.round(cashValue),
        allocatedPremium: Math.round(allocatedPremium),
        annualReturn: annualReturn
      });
    }

    return projection;
  }

  const handleContinue = () => {
    debugLog('Continue button clicked')
    
    // Save quote data to store
    updateFormData({
      quoteData: {
        policyDate: new Date().toISOString().split('T')[0],
        coverage: quoteCoverage.toString(),
        premium: quote ? quote.toFixed(2) : '0',
        age: quoteAge.toString(),
        gender: quoteGender,
        type: 'IUL'
      }
    })
    
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
    years: 25
  }) : null

  return (
    <div className="iul-quote-container" style={{ 
      textAlign: 'center', 
      padding: '0.5rem 0.75rem 1rem 0.75rem', 
      maxHeight: '70vh', 
      overflowY: 'auto'
    }}>
      <style>
        {`
          .gold-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #10b981;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          .gold-slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #10b981;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          
          @media (max-width: 768px) {
            .iul-quote-container {
              padding: 0.25rem 0.5rem 0.75rem 0.5rem !important;
            }
            .iul-title {
              font-size: 1.75rem !important;
            }
            .coverage-display {
              font-size: 2rem !important;
            }
            .quote-button {
              padding: 1rem 1.5rem !important;
              font-size: 1rem !important;
            }
          }
          
          @media (max-width: 480px) {
            .iul-quote-container {
              padding: 0.25rem 0.25rem 0.5rem 0.25rem !important;
            }
            .iul-title {
              font-size: 1.5rem !important;
            }
            .coverage-display {
              font-size: 1.75rem !important;
            }
            .quote-button {
              padding: 0.875rem 1.25rem !important;
              font-size: 0.9rem !important;
            }
          }
        `}
      </style>
      <h2 className="iul-title" style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 'bold', color: '#1f2937', marginTop: '0' }}>
        Your Personalized IUL Quote
      </h2>
      
      {/* Insurance Type Info - Moved here */}
      <div style={{ 
        background: '#f8fafc', 
        padding: '0.75rem', 
        borderRadius: '6px', 
        margin: '0.5rem 0',
        border: '1px solid #e2e8f0'
      }}>
        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
          <strong>Insurance Type:</strong> IUL - Indexed Universal Life with cash value growth potential
        </p>
      </div>
      

      
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
        <div className="coverage-display" style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: '1', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
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
          className="gold-slider"
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
          className="gold-slider"
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
      
      {/* Premium Display - Clickable Button */}
              <button
          className="quote-button"
          onClick={(e) => {
            debugLog('Blue quote button clicked!')
            e.preventDefault()
            e.stopPropagation()
            handleContinue()
          }}
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
            color: 'white',
            padding: '1.25rem 2rem',
            borderRadius: '16px',
            margin: '1rem auto',
            textAlign: 'center',
            maxWidth: '320px',
            width: '100%',
            border: '2px solid #2563eb',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'block',
            position: 'relative',
            zIndex: 10,
            boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3), 0 4px 8px rgba(0, 0, 0, 0.1)',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'
          e.currentTarget.style.boxShadow = '0 12px 24px rgba(59, 130, 246, 0.4), 0 6px 12px rgba(0, 0, 0, 0.15)'
          e.currentTarget.style.background = 'linear-gradient(135deg, #60a5fa, #3b82f6)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)'
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(59, 130, 246, 0.3), 0 4px 8px rgba(0, 0, 0, 0.1)'
          e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
        }}
      >
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem', lineHeight: '1' }}>
            <span>${isLoading ? 'Calculating...' : error ? 'Error' : quote ? quote.toFixed(2) : '0'}</span>
            <span style={{ fontSize: '1.2rem' }}> /mo</span>
          </div>
        <p style={{ fontSize: '0.8rem', color: 'white', margin: 0, fontWeight: '500', opacity: 0.9 }}>
          Secure this rate →
        </p>
      </button>



      {/* Benefit Summary Cards */}
      {quote && iulProjection && (
        <div style={{ 
          background: '#ffffff', 
          padding: '1.25rem', 
          borderRadius: '12px', 
          margin: '0.75rem 0',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
        }}>
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
                  Cash Value
                </div>
                <div style={{ 
                  background: 'white', 
                  padding: '0.25rem', 
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  color: '#1e293b',
                  lineHeight: '1.2'
                }}>
                  Market linked<br/>
                  Tax-deferred<br/>
                  0% Floor
                </div>
            </div>
          </div>
        </div>
      )}



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