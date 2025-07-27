/**
 * Configuration constants and settings for Veteran Life Insurance
 */
const Config = (function() {
    'use strict';
    
    // Google Apps Script URL
    const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxZgCXfmezXVOpVNzRUTQ_wAL79Jit16URVpSNzeTFk5Scxibpc4vjgd3JqYvZww6lq/exec';
    
    // Helper function to get API URL
    function getApiUrl() {
        return GOOGLE_APPS_SCRIPT_URL;
    }
    
    // Funnel steps configuration
    const FUNNEL_STEPS = {
        'funnel-state-form': { id: 1, name: 'State Selection', hasLoadingScreen: false, dataField: 'state' },
        'funnel-military-form': { id: 2, name: 'Military Status', hasLoadingScreen: false, dataField: 'militaryStatus' },
        'funnel-branch-form': { id: 3, name: 'Branch of Service', hasLoadingScreen: false, dataField: 'branchOfService' },
        'funnel-marital-form': { id: 4, name: 'Marital Status', hasLoadingScreen: false, dataField: 'maritalStatus' },
        'funnel-coverage-form': { id: 5, name: 'Coverage Amount', hasLoadingScreen: false, dataField: 'coverageAmount' },
        'funnel-contact-form': { id: 6, name: 'Contact Information', hasLoadingScreen: false, dataField: 'contactInfo' },
        'funnel-medical-tobacco': { id: 7, name: 'Tobacco Use', hasLoadingScreen: false, dataField: 'tobaccoUse' },
        'funnel-medical-conditions': { id: 8, name: 'Medical Conditions', hasLoadingScreen: false, dataField: 'medicalConditions' },
        'funnel-medical-height-weight': { id: 9, name: 'Height & Weight', hasLoadingScreen: false, dataField: 'heightWeight' },
        'funnel-medical-hospital': { id: 10, name: 'Hospital Care', hasLoadingScreen: false, dataField: 'hospitalCare' },
        'funnel-medical-diabetes': { id: 11, name: 'Diabetes Medication', hasLoadingScreen: true, dataField: 'diabetesMedication' }
    };
    
    // Quote calculation constants
    const QUOTE_CONSTANTS = {
        IUL: {
            baseRate: { male: 0.05, female: 0.04 },
            ageMultiplier: 30,
            coverageMultiplier: 100000
        },
        FINAL_EXPENSE: {
            baseRate: { male: 0.08, female: 0.07 },
            ageMultiplier: 25,
            coverageMultiplier: 50000
        }
    };
    
    // IUL Rate Tables
    const IUL_RATE_TABLES = {
        male: {
            30: { min: 0.03, max: 0.08 },
            35: { min: 0.035, max: 0.085 },
            40: { min: 0.04, max: 0.09 },
            45: { min: 0.045, max: 0.095 },
            50: { min: 0.05, max: 0.10 },
            55: { min: 0.055, max: 0.105 },
            60: { min: 0.06, max: 0.11 }
        },
        female: {
            30: { min: 0.025, max: 0.075 },
            35: { min: 0.03, max: 0.08 },
            40: { min: 0.035, max: 0.085 },
            45: { min: 0.04, max: 0.09 },
            50: { min: 0.045, max: 0.095 },
            55: { min: 0.05, max: 0.10 },
            60: { min: 0.055, max: 0.105 }
        }
    };
    
    // Email settings
    const EMAIL_SETTINGS = {
        recipient: 'michaelalfieri.ffl@gmail.com',
        subject: 'Veteran Life Insurance Application',
        sessionStartSubject: 'New Funnel Session Started',
        abandonmentSubject: 'Funnel Abandonment Detected'
    };
    
    // Debug settings
    const DEBUG = {
        enabled: true,
        logLevel: 'info', // 'debug', 'info', 'warn', 'error'
        testMode: false
    };
    
    // UI settings
    const UI = {
        modalZIndex: {
            base: 9999,
            loading: 99999,
            application: 999999
        },
        animationDuration: 400,
        loadingDuration: 3000
    };
    
    // Timing constants
    const TIMINGS = {
        LOADING_SCREEN_DURATION: 3000,
        MODAL_ANIMATION_DURATION: 400,
        STEP_TRANSITION_DELAY: 300,
        INACTIVITY_TIMEOUT: 30000,
        DEBOUNCE_DELAY: 250,
        THROTTLE_DELAY: 100
    };
    
    // Validation rules
    const VALIDATION = {
        phone: {
            pattern: /^\(\d{3}\) \d{3}-\d{4}$/,
            message: 'Please enter a valid phone number: (XXX) XXX-XXXX'
        },
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        ssn: {
            pattern: /^\d{3}-\d{2}-\d{4}$/,
            message: 'Please enter SSN in format: XXX-XX-XXXX'
        }
    };
    
    // Dropdown data
    const DROPDOWNS = {
        heights: [
            '4\'8"', '4\'9"', '4\'10"', '4\'11"',
            '5\'0"', '5\'1"', '5\'2"', '5\'3"', '5\'4"', '5\'5"', '5\'6"', '5\'7"', '5\'8"', '5\'9"', '5\'10"', '5\'11"',
            '6\'0"', '6\'1"', '6\'2"', '6\'3"', '6\'4"', '6\'5"', '6\'6"', '6\'7"', '6\'8"'
        ],
        weights: [
            '100 lbs', '105 lbs', '110 lbs', '115 lbs', '120 lbs', '125 lbs', '130 lbs', '135 lbs', '140 lbs', '145 lbs',
            '150 lbs', '155 lbs', '160 lbs', '165 lbs', '170 lbs', '175 lbs', '180 lbs', '185 lbs', '190 lbs', '195 lbs',
            '200 lbs', '205 lbs', '210 lbs', '215 lbs', '220 lbs', '225 lbs', '230 lbs', '235 lbs', '240 lbs', '245 lbs',
            '250 lbs', '255 lbs', '260 lbs', '265 lbs', '270 lbs', '275 lbs', '280 lbs', '285 lbs', '290 lbs', '295 lbs',
            '300 lbs', '305 lbs', '310 lbs', '315 lbs', '320 lbs', '325 lbs', '330 lbs', '335 lbs', '340 lbs', '345 lbs',
            '350 lbs', '355 lbs', '360 lbs', '365 lbs', '370 lbs', '375 lbs', '380 lbs', '385 lbs', '390 lbs', '395 lbs',
            '400 lbs', '405 lbs', '410 lbs', '415 lbs', '420 lbs', '425 lbs', '430 lbs', '435 lbs', '440 lbs', '445 lbs',
            '450 lbs', '455 lbs', '460 lbs', '465 lbs', '470 lbs', '475 lbs', '480 lbs', '485 lbs', '490 lbs', '495 lbs',
            '500 lbs'
        ]
    };
    
    // Public API
    return {
        GOOGLE_APPS_SCRIPT_URL,
        FUNNEL_STEPS,
        QUOTE_CONSTANTS,
        IUL_RATE_TABLES,
        EMAIL_SETTINGS,
        DEBUG,
        UI,
        TIMINGS,
        VALIDATION,
        DROPDOWNS,
        
        // Helper methods
        getStepById: function(stepId) {
            return FUNNEL_STEPS[stepId] || null;
        },
        
        getStepNumber: function(stepId) {
            const step = this.getStepById(stepId);
            return step ? step.id : 0;
        },
        
        getTotalSteps: function() {
            return Object.keys(FUNNEL_STEPS).length;
        },
        
        isDebugEnabled: function() {
            return DEBUG.enabled;
        },
        
        log: function(level, message, data) {
            if (this.isDebugEnabled() && DEBUG.logLevel === level) {
                console.log(`[${level.toUpperCase()}] ${message}`, data || '');
            }
        }
    };
})(); 