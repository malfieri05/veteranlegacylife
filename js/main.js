/**
 * Main entry point for Veteran Life Insurance application
 */
(function() {
    'use strict';
    
    // Global state management
    window.AppState = {
        funnel: {
            data: {},
            currentStep: 1,
            sessionId: null,
            abandonmentEmailSent: false
        },
        medical: {
            answers: {
                tobaccoUse: '',
                medicalConditions: [],
                height: '',
                weight: '',
                hospitalCare: '',
                diabetesMedication: ''
            }
        },
        quotes: {
            iul: null,
            coverage: null
        },
        modals: {
            active: null,
            stack: []
        }
    };
    
    // Legacy compatibility - expose medicalAnswers globally
    window.medicalAnswers = AppState.medical.answers;
    
    // Initialize all modules
    function initializeModules() {
        Config.log('info', '🚀 Initializing Veteran Life Insurance application...');
        
        try {
            // 1. Initialize configuration
            Config.log('info', '📋 Initializing configuration...');
            
            // 2. Check feature support
            Config.log('info', '🔍 Checking feature support...');
            if (typeof FeatureUtils !== 'undefined') {
                const featuresSupported = FeatureUtils.checkRequiredFeatures();
                if (!featuresSupported) {
                    Config.log('error', '❌ Required features not supported - application may not work properly');
                }
            }
            
            // 3. Initialize utility modules
            Config.log('info', '🔧 Initializing utility modules...');
            
            // 3. Initialize API module
            Config.log('info', '🌐 Initializing API module...');
            APIModule.init();
            
            // 4. Initialize core modules (order matters)
            Config.log('info', '📝 Initializing form handling...');
            if (typeof FormsModule !== 'undefined') {
                FormsModule.init();
            }
            
            Config.log('info', '🎭 Initializing modal management...');
            if (typeof ModalsModule !== 'undefined') {
                ModalsModule.init();
            }
            
            Config.log('info', '🔄 Initializing funnel logic...');
            if (typeof FunnelModule !== 'undefined') {
                FunnelModule.init();
            }
            
            Config.log('info', '💰 Initializing quote calculations...');
            if (typeof QuotesModule !== 'undefined') {
                QuotesModule.init();
            }
            
            Config.log('info', '📊 Initializing tracking...');
            if (typeof TrackingModule !== 'undefined') {
                TrackingModule.init();
            }
            
            // 5. Expose global functions for HTML compatibility
            Config.log('info', '🔗 Exposing global functions...');
            exposeGlobalFunctions();
            
            // 6. Attach global event handlers
            Config.log('info', '🔗 Attaching global event handlers...');
            attachGlobalHandlers();
            
            // 6. Register service worker if supported
            if (typeof FeatureUtils !== 'undefined' && FeatureUtils.hasServiceWorker()) {
                Config.log('info', '🔧 Registering service worker...');
                try {
                    navigator.serviceWorker.register('/sw.js')
                        .then(registration => {
                            Config.log('info', '✅ Service worker registered successfully');
                        })
                        .catch(error => {
                            Config.log('error', `❌ Service worker registration failed: ${error.message}`);
                        });
                } catch (error) {
                    Config.log('error', `❌ Service worker registration error: ${error.message}`);
                }
            }
            
            // 7. Run initial tests if in debug mode
            if (Config.DEBUG.enabled) {
                Config.log('info', '🧪 Running initial diagnostics...');
                runDiagnostics();
            }
            
            Config.log('info', '✅ Application initialization completed successfully');
            
        } catch (error) {
            Config.log('error', `❌ Application initialization failed: ${error.message}`);
            console.error('Initialization error:', error);
        }
    }
    
    /**
     * Attach global event handlers
     */
    function attachGlobalHandlers() {
        // Handle page visibility changes
        document.addEventListener('visibilitychange', function() {
            if (document.hidden && AppState.funnel.sessionId && !AppState.funnel.abandonmentEmailSent) {
                Config.log('info', 'Page hidden - triggering abandonment tracking');
                if (typeof TrackingModule !== 'undefined') {
                    TrackingModule.handlePageHidden();
                }
            }
        });
        
        // Handle beforeunload (browser close)
        window.addEventListener('beforeunload', function(e) {
            if (AppState.funnel.sessionId && !AppState.funnel.abandonmentEmailSent) {
                Config.log('info', 'Browser closing - triggering abandonment tracking');
                if (typeof TrackingModule !== 'undefined') {
                    TrackingModule.handleBrowserClose();
                }
            }
        });
        
        // Handle window focus/blur
        window.addEventListener('blur', function() {
            if (AppState.funnel.sessionId && !AppState.funnel.abandonmentEmailSent) {
                Config.log('info', 'Window blurred - triggering abandonment tracking');
                if (typeof TrackingModule !== 'undefined') {
                    TrackingModule.handleWindowBlur();
                }
            }
        });
        
        // Add error handling to all button clicks
        document.addEventListener('click', function(e) {
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                const button = e.target.tagName === 'BUTTON' ? e.target : e.target.closest('button');
                
                // Wrap button click in error handling
                const originalOnClick = button.onclick;
                if (originalOnClick) {
                    try {
                        originalOnClick.call(button, e);
                    } catch (error) {
                        Config.log('error', `Button click error: ${error.message}`);
                        console.error('Button click error:', error);
                    }
                }
            }
        });
    }
    
    /**
     * Run diagnostic tests
     */
    function runDiagnostics() {
        Config.log('info', '=== RUNNING DIAGNOSTICS ===');
        
        // Test DOM elements
        const criticalElements = [
            'funnel-modal',
            'funnel-state-form',
            'funnel-military-form',
            'funnel-branch-form',
            'funnel-marital-form',
            'funnel-coverage-form',
            'funnel-contact-form',
            'funnel-medical-tobacco',
            'funnel-medical-conditions',
            'funnel-medical-height-weight',
            'funnel-medical-hospital',
            'funnel-medical-diabetes'
        ];
        
        Config.log('info', 'Testing critical DOM elements...');
        criticalElements.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                Config.log('info', `✅ ${elementId} found`);
            } else {
                Config.log('error', `❌ ${elementId} NOT FOUND`);
            }
        });
        
        // Test module availability
        const modules = ['FormsModule', 'ModalsModule', 'FunnelModule', 'QuotesModule', 'TrackingModule'];
        Config.log('info', 'Testing module availability...');
        modules.forEach(moduleName => {
            if (typeof window[moduleName] !== 'undefined') {
                Config.log('info', `✅ ${moduleName} available`);
            } else {
                Config.log('warn', `⚠️ ${moduleName} not available`);
            }
        });
        
        // Test API connection
        APIModule.testConnection().then(result => {
            if (result.success) {
                Config.log('info', '✅ API connection successful');
            } else {
                Config.log('error', `❌ API connection failed: ${result.message}`);
            }
        });
        
        Config.log('info', '=== DIAGNOSTICS COMPLETED ===');
    }
    
    /**
     * Generate session ID
     */
    function generateSessionId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 10);
        return `session_${timestamp}_${random}`;
    }
    
    /**
     * Initialize session
     */
    function initializeSession() {
        AppState.funnel.sessionId = generateSessionId();
        AppState.funnel.abandonmentEmailSent = false;
        AppState.funnel.currentStep = 1;
        
        Config.log('info', '=== NEW SESSION STARTED ===');
        Config.log('info', `Session ID: ${AppState.funnel.sessionId}`);
        
        // Send session start email
        APIModule.sendSessionStartEmail(AppState.funnel.sessionId);
    }
    
    /**
     * Reset application state
     */
    function resetApplication() {
        AppState.funnel.data = {};
        AppState.funnel.currentStep = 1;
        AppState.funnel.sessionId = null;
        AppState.funnel.abandonmentEmailSent = false;
        AppState.medical.answers = {};
        AppState.quotes.iul = null;
        AppState.quotes.coverage = null;
        AppState.modals.active = null;
        AppState.modals.stack = [];
        
        Config.log('info', 'Application state reset');
    }
    
    // Expose global functions
    window.AppState = AppState;
    window.initializeSession = initializeSession;
    window.resetApplication = resetApplication;
    window.generateSessionId = generateSessionId;
    
    // Expose global functions for HTML onclick handlers
    function exposeGlobalFunctions() {
        Config.log('info', '🔗 Exposing global functions for HTML compatibility...');
        
        // Funnel functions
        window.handleApplicationNext = function() {
            Config.log('info', '🔄 handleApplicationNext called');
            if (typeof FunnelModule !== 'undefined' && FunnelModule.handleApplicationNext) {
                return FunnelModule.handleApplicationNext();
            } else {
                Config.log('warn', 'FunnelModule.handleApplicationNext not available');
                return false;
            }
        };
        
        window.handleApplicationSubmit = function() {
            Config.log('info', '🔄 handleApplicationSubmit called');
            if (typeof FunnelModule !== 'undefined' && FunnelModule.handleApplicationSubmit) {
                return FunnelModule.handleApplicationSubmit();
            } else {
                Config.log('warn', 'FunnelModule.handleApplicationSubmit not available');
                return false;
            }
        };
        
        // Quote functions
        window.handleIULQuoteNow = function() {
            Config.log('info', '🔄 handleIULQuoteNow called');
            if (typeof QuotesModule !== 'undefined' && QuotesModule.handleIULQuoteNow) {
                return QuotesModule.handleIULQuoteNow();
            } else {
                Config.log('warn', 'QuotesModule.handleIULQuoteNow not available');
                // Fallback to legacy function if available
                if (typeof window.handleIULQuoteNowLegacy === 'function') {
                    return window.handleIULQuoteNowLegacy();
                }
                return false;
            }
        };
        
        window.handleCoverageQuoteNow = function() {
            Config.log('info', '🔄 handleCoverageQuoteNow called');
            if (typeof QuotesModule !== 'undefined' && QuotesModule.handleCoverageQuoteNow) {
                return QuotesModule.handleCoverageQuoteNow();
            } else {
                Config.log('warn', 'QuotesModule.handleCoverageQuoteNow not available');
                // Fallback to legacy function if available
                if (typeof window.handleCoverageQuoteNowLegacy === 'function') {
                    return window.handleCoverageQuoteNowLegacy();
                }
                return false;
            }
        };
        
        // Modal functions
        window.closeFinalSuccessModal = function() {
            Config.log('info', '🔄 closeFinalSuccessModal called');
            if (typeof ModalsModule !== 'undefined' && ModalsModule.closeFinalSuccessModal) {
                return ModalsModule.closeFinalSuccessModal();
            } else {
                Config.log('warn', 'ModalsModule.closeFinalSuccessModal not available');
                return false;
            }
        };
        
        window.hideApplicationCongratsModal = function() {
            Config.log('info', '🔄 hideApplicationCongratsModal called');
            if (typeof ModalsModule !== 'undefined' && ModalsModule.hideApplicationCongratsModal) {
                return ModalsModule.hideApplicationCongratsModal();
            } else {
                Config.log('warn', 'ModalsModule.hideApplicationCongratsModal not available');
                return false;
            }
        };
        
        // Legacy compatibility functions
        window.showLoadingModal = function() {
            Config.log('info', '🔄 showLoadingModal called');
            if (typeof ModalsModule !== 'undefined' && ModalsModule.createLoadingModal) {
                return ModalsModule.createLoadingModal();
            } else {
                Config.log('warn', 'ModalsModule.createLoadingModal not available');
                return false;
            }
        };
        
        window.hideLoadingModal = function() {
            Config.log('info', '🔄 hideLoadingModal called');
            if (typeof ModalsModule !== 'undefined' && ModalsModule.hideAllModals) {
                return ModalsModule.hideAllModals();
            } else {
                Config.log('warn', 'ModalsModule.hideAllModals not available');
                return false;
            }
        };
        
        window.showFinalSuccessModal = function() {
            Config.log('info', '🔄 showFinalSuccessModal called');
            if (typeof ModalsModule !== 'undefined' && ModalsModule.showSuccessModal) {
                return ModalsModule.showSuccessModal('Your application has been submitted successfully!', 'Congratulations!');
            } else {
                Config.log('warn', 'ModalsModule.showSuccessModal not available');
                return false;
            }
        };
        
        Config.log('info', '✅ Global functions exposed');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeModules);
    } else {
        initializeModules();
    }
    
    // Expose initialization function for manual calls
    window.initializeVeteranLifeInsurance = initializeModules;
    
})(); 