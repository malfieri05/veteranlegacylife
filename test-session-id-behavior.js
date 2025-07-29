// Test script to verify session ID behavior
console.log('🧪 Testing Session ID Behavior...');

// Simulate the React funnel session ID behavior
let sessionId = null;

function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function openModal() {
  sessionId = generateSessionId();
  console.log('🎯 OPENING MODAL - Generated new session ID:', sessionId);
  return sessionId;
}

function submitPartial(step, stepName) {
  console.log(`🎯 SUBMIT PARTIAL - Step ${step} (${stepName}) - Session ID: ${sessionId}`);
  
  if (!sessionId) {
    console.log('⚠️ WARNING: Session ID is empty! Regenerating...');
    sessionId = generateSessionId();
    console.log('🎯 Generated new session ID:', sessionId);
  }
  
  return sessionId;
}

function goToNextStep(currentStep) {
  const nextStep = currentStep + 1;
  console.log(`🎯 GO TO NEXT STEP - From step ${currentStep} to ${nextStep} - Session ID: ${sessionId}`);
  
  if (currentStep < 18) {
    const stepNames = [
      'State Selection', 'Military Status', 'Branch of Service', 'Marital Status',
      'Coverage Amount', 'Contact Information', 'Birthday', 'Tobacco Use',
      'Medical Conditions', 'Height & Weight', 'Hospital Care', 'Diabetes Medication',
      'Loading Screen', 'Pre-Qualified Success', 'IUL Quote Modal',
      'Application Step 1', 'Application Step 2', 'Final Success'
    ];
    
    const usedSessionId = submitPartial(currentStep, stepNames[currentStep - 1]);
    console.log(`✅ Used session ID: ${usedSessionId}`);
  }
  
  return nextStep;
}

// Test the session ID behavior
console.log('🚀 Starting session ID test...');

// Simulate opening the modal
const initialSessionId = openModal();
console.log('📝 Initial session ID:', initialSessionId);

// Simulate going through a few steps
let currentStep = 1;
for (let i = 0; i < 5; i++) {
  currentStep = goToNextStep(currentStep);
  console.log(`📊 Step ${currentStep} completed`);
}

console.log('🎉 Test completed! All steps should have used the same session ID:', initialSessionId); 