import React, { useState, useEffect } from 'react'

interface StreamingLoadingSpinnerProps {
  branchOfService: string
  isVisible: boolean
  onComplete: () => void
  onStepComplete?: () => void
}

const loadingMessages = [
  'Calculating your policy options...',
  'Analyzing your military benefits...',
  'Reviewing your medical information...',
  'Checking state-specific requirements...',
  'Generating personalized quotes...',
  'Optimizing coverage options...',
  'Finalizing your custom plan...'
]

const iulTips = [
  'IUL policies offer both death benefit protection and cash value growth potential',
  'Your military service may qualify you for special veteran discounts',
  'IUL policies can provide tax-advantaged growth and flexible premium payments',
  'Many veterans find IUL policies complement their existing VA benefits',
  'IUL policies can help protect your family while building wealth over time'
]

const veteranBenefits = [
  'Special rates for active duty and veterans',
  'Waived medical exams for qualified applicants',
  'Flexible underwriting for service-related conditions',
  'Expedited processing for military families',
  'Comprehensive coverage options designed for veterans'
]

export const StreamingLoadingSpinner: React.FC<StreamingLoadingSpinnerProps> = ({
  branchOfService,
  isVisible,
  onComplete,
  onStepComplete
}) => {
  const [displayedMessage, setDisplayedMessage] = useState('')
  const [displayedTip, setDisplayedTip] = useState('')
  const [displayedBenefit, setDisplayedBenefit] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (!isVisible) return

    let messageTimer: NodeJS.Timeout
    let tipTimer: NodeJS.Timeout
    let benefitTimer: NodeJS.Timeout
    let typingTimer: NodeJS.Timeout

    // Start the loading sequence
    const startLoading = () => {
      // Type out the first message
      typeMessage(loadingMessages[0], setDisplayedMessage, () => {
        // After typing, wait and then move to next message
        messageTimer = setTimeout(() => {
          typeMessage(loadingMessages[1], setDisplayedMessage, () => {
            messageTimer = setTimeout(() => {
              typeMessage(loadingMessages[2], setDisplayedMessage, () => {
                messageTimer = setTimeout(() => {
                  typeMessage(loadingMessages[3], setDisplayedMessage, () => {
                    messageTimer = setTimeout(() => {
                      typeMessage(loadingMessages[4], setDisplayedMessage, () => {
                        messageTimer = setTimeout(() => {
                          typeMessage(loadingMessages[5], setDisplayedMessage, () => {
                            messageTimer = setTimeout(() => {
                              typeMessage(loadingMessages[6], setDisplayedMessage, () => {
                                // Complete after the last message
                                setTimeout(() => {
                                  onComplete()
                                  // Also trigger step progression if callback provided
                                  if (onStepComplete) {
                                    onStepComplete()
                                  }
                                }, 1000)
                              })
                            }, 800)
                          })
                        }, 800)
                      })
                    }, 800)
                  })
                }, 800)
              })
            }, 800)
          })
        }, 800)
      })

      // Start showing tips after a delay
      tipTimer = setTimeout(() => {
        typeMessage(iulTips[0], setDisplayedTip, () => {
          tipTimer = setTimeout(() => {
            typeMessage(iulTips[1], setDisplayedTip, () => {
              tipTimer = setTimeout(() => {
                typeMessage(iulTips[2], setDisplayedTip, () => {
                  tipTimer = setTimeout(() => {
                    typeMessage(iulTips[3], setDisplayedTip, () => {
                      tipTimer = setTimeout(() => {
                        typeMessage(iulTips[4], setDisplayedTip)
                      }, 2000)
                    })
                  }, 2000)
                })
              }, 2000)
            })
          }, 2000)
        })
      }, 2000)

      // Start showing benefits after a longer delay
      benefitTimer = setTimeout(() => {
        typeMessage(veteranBenefits[0], setDisplayedBenefit, () => {
          benefitTimer = setTimeout(() => {
            typeMessage(veteranBenefits[1], setDisplayedBenefit, () => {
              benefitTimer = setTimeout(() => {
                typeMessage(veteranBenefits[2], setDisplayedBenefit, () => {
                  benefitTimer = setTimeout(() => {
                    typeMessage(veteranBenefits[3], setDisplayedBenefit, () => {
                      benefitTimer = setTimeout(() => {
                        typeMessage(veteranBenefits[4], setDisplayedBenefit)
                      }, 2000)
                    })
                  }, 2000)
                })
              }, 2000)
            })
          }, 2000)
        })
      }, 4000)
    }

    const typeMessage = (message: string, setter: (text: string) => void, callback?: () => void) => {
      setIsTyping(true)
      let index = 0
      setter('')
      
      const typeNextChar = () => {
        if (index < message.length) {
          setter(message.substring(0, index + 1))
          index++
          typingTimer = setTimeout(typeNextChar, 30)
        } else {
          setIsTyping(false)
          if (callback) callback()
        }
      }
      
      typeNextChar()
    }

    startLoading()

    return () => {
      clearTimeout(messageTimer)
      clearTimeout(tipTimer)
      clearTimeout(benefitTimer)
      clearTimeout(typingTimer)
    }
  }, [isVisible, onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 shadow-2xl">
        <div className="text-center mb-6">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Calculating Your Policy Options
          </h2>
          <p className="text-gray-600">
            Seeing what you qualify for in the {branchOfService}...
          </p>
        </div>

        <div className="space-y-6">
          {/* Main loading message */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Processing Your Information</h3>
            <p className="text-blue-700 min-h-[1.5rem]">
              {displayedMessage}
              {isTyping && <span className="animate-pulse">|</span>}
            </p>
          </div>

          {/* IUL Tips */}
          {displayedTip && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">💡 IUL Policy Benefits</h3>
              <p className="text-green-700 min-h-[1.5rem]">
                {displayedTip}
                {isTyping && <span className="animate-pulse">|</span>}
              </p>
            </div>
          )}

          {/* Veteran Benefits */}
          {displayedBenefit && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">🎖️ Veteran Benefits</h3>
              <p className="text-purple-700 min-h-[1.5rem]">
                {displayedBenefit}
                {isTyping && <span className="animate-pulse">|</span>}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            This usually takes 7-10 seconds...
          </p>
        </div>
      </div>
    </div>
  )
} 