// Test script to verify React funnel functionality
console.log('🧪 Testing React Funnel...');

// Check if VeteranFunnel is available
if (typeof window !== 'undefined' && window.VeteranFunnel) {
  console.log('✅ VeteranFunnel is available');
  console.log('Available methods:', Object.keys(window.VeteranFunnel));
  
  // Test opening the funnel
  console.log('🚀 Opening React funnel...');
  window.VeteranFunnel.open();
  
  // Check if it's open
  setTimeout(() => {
    const isOpen = window.VeteranFunnel.isOpen();
    console.log('📊 Funnel is open:', isOpen);
  }, 1000);
  
} else {
  console.log('❌ VeteranFunnel not available');
}

// Monitor for any console logs from the React funnel
const originalLog = console.log;
console.log = function(...args) {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('🎯')) {
    console.log('🔍 React Funnel Log:', ...args);
  }
  originalLog.apply(console, args);
}; 