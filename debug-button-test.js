// Debug script to test "Secure Your Rate" button functionality
console.log('🔍 Starting button debug test...')

// Test 1: Check if the button element exists
function testButtonExists() {
  console.log('🔍 Test 1: Checking if button exists...')
  const button = document.querySelector('button')
  if (button && button.textContent.includes('Secure Your Rate')) {
    console.log('✅ Button found:', button)
    return true
  } else {
    console.log('❌ Button not found')
    return false
  }
}

// Test 2: Check if click event fires
function testButtonClick() {
  console.log('🔍 Test 2: Testing button click...')
  const button = document.querySelector('button')
  if (button) {
    button.addEventListener('click', (e) => {
      console.log('✅ Button click event fired!')
      console.log('Event details:', e)
    })
    
    // Simulate click
    button.click()
  }
}

// Test 3: Check if goToNextStep function exists
function testGoToNextStep() {
  console.log('🔍 Test 3: Checking goToNextStep function...')
  if (window.useFunnelStore) {
    console.log('✅ useFunnelStore exists')
    const store = window.useFunnelStore.getState()
    console.log('Store state:', store)
    return true
  } else {
    console.log('❌ useFunnelStore not found')
    return false
  }
}

// Test 4: Check for JavaScript errors
function testForErrors() {
  console.log('🔍 Test 4: Checking for JavaScript errors...')
  const originalError = console.error
  const errors = []
  
  console.error = (...args) => {
    errors.push(args)
    originalError.apply(console, args)
  }
  
  // Wait a moment then check for errors
  setTimeout(() => {
    if (errors.length > 0) {
      console.log('❌ JavaScript errors found:', errors)
    } else {
      console.log('✅ No JavaScript errors detected')
    }
    console.error = originalError
  }, 1000)
}

// Test 5: Check if quote-utils.js is loaded
function testQuoteUtils() {
  console.log('🔍 Test 5: Checking quote-utils.js...')
  const scripts = Array.from(document.scripts)
  const quoteUtils = scripts.find(script => script.src.includes('quote-utils'))
  
  if (quoteUtils) {
    console.log('✅ quote-utils.js found:', quoteUtils.src)
  } else {
    console.log('❌ quote-utils.js not found - this might cause issues')
  }
}

// Run all tests
function runAllTests() {
  console.log('🚀 Running comprehensive button debug tests...')
  
  testButtonExists()
  testButtonClick()
  testGoToNextStep()
  testForErrors()
  testQuoteUtils()
  
  console.log('🔍 Debug tests completed. Check console for results.')
}

// Auto-run when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runAllTests)
} else {
  runAllTests()
}

// Also run when window loads (for React components)
window.addEventListener('load', () => {
  console.log('🔍 Window loaded, running additional tests...')
  setTimeout(runAllTests, 2000) // Wait for React to render
}) 