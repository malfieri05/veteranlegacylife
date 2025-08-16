import React from 'react'
import ReactDOM from 'react-dom/client'
import { FunnelModal } from './components/FunnelModal'
import { useFunnelStore } from './store/funnelStore'
import './styles/globals.css'

// Declare global interface
declare global {
  interface Window {
    VeteranFunnel: any
  }
}

// Create a container for the React app
const createFunnelContainer = () => {
  const container = document.createElement('div')
  container.className = 'veteran-funnel'
  container.id = 'veteran-funnel-container'
  document.body.appendChild(container)
  return container
}

// Initialize the funnel
const initializeFunnel = () => {
  const container = createFunnelContainer()
  const root = ReactDOM.createRoot(container)
  
  root.render(
    <React.StrictMode>
      <FunnelModal />
    </React.StrictMode>
  )
  
  return root
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFunnel)
} else {
  initializeFunnel()
}

// For production builds, also try to initialize immediately
// This ensures the React app mounts even if DOMContentLoaded already fired
setTimeout(initializeFunnel, 0)

// Create and expose the global API
const VeteranFunnel = {
  open: () => {
    // Use the store directly without hooks
    const store = useFunnelStore.getState()
    store.openModal()
    console.log('🎯 VeteranFunnel.open() called')
  },
  
  close: () => {
    // Use the store directly without hooks
    const store = useFunnelStore.getState()
    store.closeModal()
    console.log('🎯 VeteranFunnel.close() called')
  },
  
  isOpen: () => {
    // Use the store directly without hooks
    const store = useFunnelStore.getState()
    const isOpen = store.isModalOpen
    console.log('🎯 VeteranFunnel.isOpen() called, result:', isOpen)
    return isOpen
  },
  
  reset: () => {
    // Use the store directly without hooks
    const store = useFunnelStore.getState()
    store.reset()
    console.log('🎯 VeteranFunnel.reset() called')
  },
  
  // Add a method to check if the app is initialized
  isInitialized: () => {
    const container = document.getElementById('veteran-funnel-container')
    return !!container
  }
}

// Expose to global scope
if (typeof window !== 'undefined') {
  window.VeteranFunnel = VeteranFunnel
}

// Export for module systems
export { VeteranFunnel } 