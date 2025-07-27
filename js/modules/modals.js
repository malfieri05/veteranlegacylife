/**
 * Modals module for modal management
 */
const ModalsModule = (function() {
    'use strict';
    
    // Private variables
    let isInitialized = false;
    
    /**
     * Initialize modal management
     */
    function init() {
        if (isInitialized) {
            Config.log('warn', 'Modals module already initialized');
            return;
        }
        
        Config.log('info', 'Initializing modals module...');
        
        // Initialize modal close buttons
        initializeModalCloseButtons();
        
        // Initialize modal overlays
        initializeModalOverlays();
        
        isInitialized = true;
        Config.log('info', '✅ Modals module initialized');
    }
    
    /**
     * Initialize modal close buttons
     */
    function initializeModalCloseButtons() {
        Config.log('info', 'Initializing modal close buttons...');
        
        const closeButtons = document.querySelectorAll('.modal-close, .modal-close-btn');
        closeButtons.forEach(button => {
            DOMUtils.addEventListener(button, 'click', function(e) {
                e.preventDefault();
                const modal = button.closest('.modal-overlay');
                if (modal) {
                    hideModal(modal);
                }
            });
        });
    }
    
    /**
     * Initialize modal overlays
     */
    function initializeModalOverlays() {
        Config.log('info', 'Initializing modal overlays...');
        
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => {
            DOMUtils.addEventListener(modal, 'click', function(e) {
                if (e.target === modal) {
                    hideModal(modal);
                }
            });
        });
    }
    
    /**
     * Show modal
     */
    function showModal(modalId, options = {}) {
        const modal = DOMUtils.getElement(modalId);
        if (!modal) {
            Config.log('error', `Modal not found: ${modalId}`);
            return false;
        }
        
        // Hide any currently active modal
        if (AppState.modals.active) {
            hideModal(AppState.modals.active);
        }
        
        // Show the new modal
        const success = DOMUtils.showElement(modal, {
            display: 'flex',
            zIndex: options.zIndex || Config.UI.modalZIndex.base,
            animate: options.animate !== false
        });
        
        if (success) {
            AppState.modals.active = modal;
            AppState.modals.stack.push(modal);
            Config.log('info', `Modal shown: ${modalId}`);
        }
        
        return success;
    }
    
    /**
     * Hide modal
     */
    function hideModal(modal) {
        if (!modal) return false;
        
        const success = DOMUtils.hideElement(modal, {
            animate: true
        });
        
        if (success) {
            // Remove from active stack
            AppState.modals.stack = AppState.modals.stack.filter(m => m !== modal);
            AppState.modals.active = AppState.modals.stack.length > 0 ? 
                AppState.modals.stack[AppState.modals.stack.length - 1] : null;
            
            Config.log('info', `Modal hidden: ${modal.id}`);
        }
        
        return success;
    }
    
    /**
     * Create loading modal
     */
    function createLoadingModal(options = {}) {
        const {
            id = 'loading-modal',
            message = 'Processing your information...',
            duration = Config.UI.loadingDuration
        } = options;
        
        const content = `
            <div style="text-align: center; color: white; padding: 2rem;">
                <div style="margin-bottom: 1rem;">
                    <img src="assets/logo.png" alt="Veteran Legacy Life" style="height: 60px; filter: brightness(0) invert(1);">
                </div>
                <div class="spinner-ring" style="width: 50px; height: 50px; border: 4px solid rgba(255,255,255,0.3); border-top: 4px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                <h2 style="margin: 0 0 1rem 0; font-size: 1.5rem;">${message}</h2>
                <p style="margin: 0; opacity: 0.8;">Please wait while we process your information...</p>
            </div>
        `;
        
        const modal = DOMUtils.createModalOverlay({
            id: id,
            content: content,
            zIndex: Config.UI.modalZIndex.loading,
            backgroundColor: 'rgba(0,0,0,0.9)'
        });
        
        // Auto-hide after duration
        if (duration > 0) {
            setTimeout(() => {
                DOMUtils.removeModalOverlay(id);
            }, duration);
        }
        
        return modal;
    }
    
    /**
     * Show success modal
     */
    function showSuccessModal(message, title = 'Success') {
        const content = `
            <div style="text-align: center; padding: 2rem;">
                <div class="success-checkmark" style="margin-bottom: 1rem;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" style="width: 60px; height: 60px;">
                        <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none" stroke="#22c55e" stroke-width="2"/>
                        <path class="checkmark-check" fill="none" stroke="#22c55e" stroke-width="3" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                </div>
                <h2 style="margin: 0 0 1rem 0; color: #22c55e;">${title}</h2>
                <p style="margin: 0; color: #666;">${message}</p>
            </div>
        `;
        
        return DOMUtils.createModalOverlay({
            id: 'success-modal',
            content: content,
            zIndex: Config.UI.modalZIndex.base
        });
    }
    
    /**
     * Show error modal
     */
    function showErrorModal(message, title = 'Error') {
        const content = `
            <div style="text-align: center; padding: 2rem;">
                <div style="margin-bottom: 1rem; color: #dc2626; font-size: 3rem;">⚠️</div>
                <h2 style="margin: 0 0 1rem 0; color: #dc2626;">${title}</h2>
                <p style="margin: 0; color: #666;">${message}</p>
            </div>
        `;
        
        return DOMUtils.createModalOverlay({
            id: 'error-modal',
            content: content,
            zIndex: Config.UI.modalZIndex.base
        });
    }
    
    /**
     * Hide all modals
     */
    function hideAllModals() {
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => {
            DOMUtils.hideElement(modal, { animate: false });
        });
        
        AppState.modals.active = null;
        AppState.modals.stack = [];
        Config.log('info', 'All modals hidden');
    }
    
    /**
     * Get active modal
     */
    function getActiveModal() {
        return AppState.modals.active;
    }
    
    /**
     * Check if any modal is active
     */
    function isModalActive() {
        return AppState.modals.active !== null;
    }
    
    // Public API
    return {
        init,
        showModal,
        hideModal,
        createLoadingModal,
        showSuccessModal,
        showErrorModal,
        hideAllModals,
        getActiveModal,
        isModalActive
    };
})(); 