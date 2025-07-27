/**
 * DOM manipulation utility functions
 */
const DOMUtils = (function() {
    'use strict';
    
    // Cache for frequently accessed elements
    const elementCache = new Map();
    
    /**
     * Get element by ID with caching
     */
    function getElement(id) {
        if (!elementCache.has(id)) {
            elementCache.set(id, document.getElementById(id));
        }
        return elementCache.get(id);
    }
    
    /**
     * Show element with optional animation
     */
    function showElement(element, options = {}) {
        if (!element) return false;
        
        const {
            display = 'flex',
            opacity = '1',
            zIndex = Config.UI.modalZIndex.base,
            animate = true,
            duration = Config.UI.animationDuration
        } = options;
        
        element.style.display = display;
        element.style.zIndex = zIndex;
        
        if (animate) {
            element.style.opacity = '0';
            element.style.transition = `opacity ${duration}ms ease-in-out`;
            
            requestAnimationFrame(() => {
                element.style.opacity = opacity;
            });
        } else {
            element.style.opacity = opacity;
        }
        
        return true;
    }
    
    /**
     * Hide element with optional animation
     */
    function hideElement(element, options = {}) {
        if (!element) return false;
        
        const {
            animate = true,
            duration = Config.UI.animationDuration
        } = options;
        
        if (animate) {
            element.style.transition = `opacity ${duration}ms ease-in-out`;
            element.style.opacity = '0';
            
            setTimeout(() => {
                element.style.display = 'none';
            }, duration);
        } else {
            element.style.display = 'none';
            element.style.opacity = '0';
        }
        
        return true;
    }
    
    /**
     * Create modal overlay dynamically
     */
    function createModalOverlay(options = {}) {
        const {
            id = 'dynamic-modal',
            content = '',
            zIndex = Config.UI.modalZIndex.base,
            backgroundColor = 'rgba(0,0,0,0.8)'
        } = options;
        
        // Remove existing modal if it exists
        const existingModal = getElement(id);
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.id = id;
        modal.className = 'modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: ${backgroundColor};
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: ${zIndex};
            opacity: 0;
            transition: opacity ${Config.UI.animationDuration}ms ease-in-out;
        `;
        
        modal.innerHTML = content;
        document.body.appendChild(modal);
        
        // Animate in
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
        });
        
        return modal;
    }
    
    /**
     * Remove modal overlay
     */
    function removeModalOverlay(id) {
        const modal = getElement(id);
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.remove();
            }, Config.UI.animationDuration);
        }
    }
    
    /**
     * Add event listener with error handling
     */
    function addEventListener(element, event, handler, options = {}) {
        if (!element) {
            Config.log('warn', `Cannot add event listener: element not found`);
            return false;
        }
        
        try {
            element.addEventListener(event, handler, options);
            return true;
        } catch (error) {
            Config.log('error', `Failed to add event listener: ${error.message}`);
            return false;
        }
    }
    
    /**
     * Remove event listener
     */
    function removeEventListener(element, event, handler, options = {}) {
        if (!element) return false;
        
        try {
            element.removeEventListener(event, handler, options);
            return true;
        } catch (error) {
            Config.log('error', `Failed to remove event listener: ${error.message}`);
            return false;
        }
    }
    
    /**
     * Update element text content safely
     */
    function updateText(element, text) {
        if (!element) return false;
        
        try {
            element.textContent = text;
            return true;
        } catch (error) {
            Config.log('error', `Failed to update text: ${error.message}`);
            return false;
        }
    }
    
    /**
     * Update element HTML safely
     */
    function updateHTML(element, html) {
        if (!element) return false;
        
        try {
            element.innerHTML = html;
            return true;
        } catch (error) {
            Config.log('error', `Failed to update HTML: ${error.message}`);
            return false;
        }
    }
    
    /**
     * Clear element cache
     */
    function clearCache() {
        elementCache.clear();
    }
    
    // Public API
    return {
        getElement,
        showElement,
        hideElement,
        createModalOverlay,
        removeModalOverlay,
        addEventListener,
        removeEventListener,
        updateText,
        updateHTML,
        clearCache
    };
})(); 