import React from 'react'
import { useFunnelStore } from '../../store/funnelStore'

export const PreQualifiedSuccess: React.FC = () => {
  const { } = useFunnelStore()

  const handleCompleteApplication = () => {
    // Move to the IUL Quote Modal step
    useFunnelStore.getState().setCurrentStep(13)
  }

  return (
    <div className="text-center">
      {/* Success Icon */}
      <div className="mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Pre-Qualified!
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Congratulations! Based on your answers, you appear to qualify for life insurance coverage.
        </p>
      </div>

      {/* Next Steps */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Next Steps:
        </h3>
        <ul className="text-left text-gray-600 space-y-2">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
            Get your personalized quote
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
            Review coverage options
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
            Complete your application
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
            Start your coverage
          </li>
        </ul>
      </div>

      {/* CTA Button */}
      <button
        onClick={handleCompleteApplication}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-300 mb-8"
      >
        Complete Application
      </button>

      {/* Help Section */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <p className="text-blue-800 text-sm">
          <strong>Need help?</strong> Call us at (555) 123-4567<br />
          Monday-Friday 8AM-6PM EST
        </p>
      </div>
    </div>
  )
} 