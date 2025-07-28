// Veteran Legacy Life - Main JavaScript

// ============================================================================
// CONFIGURATION - UPDATE THIS URL WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
// ============================================================================
// To get your Google Apps Script web app URL:
// 1. Go to https://script.google.com
// 2. Create a new project or open existing one
// 3. Copy the contents of google-apps-script.js into the script editor
// 4. Click "Deploy" > "New deployment"
// 5. Choose "Web app" as type
// 6. Set "Execute as" to "Me"
// 7. Set "Who has access" to "Anyone"
// 8. Click "Deploy" and copy the URL below
// Use centralized config
const GOOGLE_APPS_SCRIPT_URL = getApiUrl();

// Test function to verify Google Apps Script connection
async function testGoogleAppsScript() {
    console.log('=== TESTING GOOGLE APPS SCRIPT CONNECTION ===');
    try {
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'GET'
        });
        const text = await response.text();
        console.log('GET response:', text);
        console.log('Connection test successful');
        return true;
    } catch (error) {
        console.error('Connection test failed:', error);
        return false;
    }
}

// Enhanced error handling for all button clicks
function addButtonErrorHandling() {
    try {
        console.log('🔧 Adding comprehensive error handling to all buttons...');
        
        // Add error handling to all CTA buttons
        const ctaButtons = document.querySelectorAll('.cta-button');
        ctaButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                try {
                    console.log('🔄 Button clicked:', this.textContent || this.innerHTML);
                } catch (error) {
                    console.error('❌ Error in button click handler:', error);
                }
            });
        });

        // Add error handling to all form submit buttons
        const submitButtons = document.querySelectorAll('button[type="submit"]');
        submitButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                try {
                    console.log('🔄 Submit button clicked:', this.textContent || this.innerHTML);
                } catch (error) {
                    console.error('❌ Error in submit button click handler:', error);
                }
            });
        });

        // Add error handling to all modal close buttons
        const closeButtons = document.querySelectorAll('.modal-close, .modal-close-btn');
        closeButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                try {
                    console.log('🔄 Close button clicked');
                } catch (error) {
                    console.error('❌ Error in close button click handler:', error);
                }
            });
        });

        console.log('✅ Comprehensive error handling added to all buttons');
    } catch (error) {
        console.error('❌ Error adding button error handling:', error);
    }
}

// ============================================================================
// COMPLETE FUNNEL FLOW DOCUMENTATION
// ============================================================================
/*
PHASE 1: MEDICAL PRE-QUALIFICATION (12 Steps)
1. State Selection
2. Military Status  
3. Branch of Service
4. Marital Status
5. Coverage Amount
6. Contact Information
7. Tobacco Use
8. Medical Conditions
9. Height & Weight
10. Hospital Care
11. Diabetes Medication → Loading Screen → "Pre-Qualified!" Message

PHASE 2: FULL APPLICATION (Optional)
12. "Complete Application" → IUL Quote Modal (age-based)
13. IUL Modal shows actual rate with "Secure this rate" → Application Step 1
14. Application Step 1 → Address Information
15. "Continue to Step 2" → Application Step 2 (SSN, Banking, Policy Date)
16. "Submit Application" → Final Success Modal with Quote

FLOW CONTROL:
- Medical funnel auto-advances through steps 1-11
- Step 11 shows loading screen, then congratulations
- "Complete Application" triggers IUL quote modal
- IUL modal shows calculated rate with "Secure this rate" → Application Step 1
- Application Step 1 → Step 2 → Final Success Modal
*/

// ============================================================================
// FUNNEL STEP CONFIGURATION - CLEARLY DEFINED 12 STEPS
// ============================================================================
const FUNNEL_STEPS = {
    // Step 1: State Selection
    STATE: {
        id: 'funnel-state-form',
        name: 'State Selection',
        description: 'Select your state of residence',
        hasLoadingScreen: false,
        dataField: 'state'
    },
    
    // Step 2: Military Status
    MILITARY: {
        id: 'funnel-military-form',
        name: 'Military Status',
        description: 'Select your military status',
        hasLoadingScreen: false,
        dataField: 'militaryStatus'
    },
    
    // Step 3: Branch of Service
    BRANCH: {
        id: 'funnel-branch-form',
        name: 'Branch of Service',
        description: 'Select your branch of service',
        hasLoadingScreen: false,
        dataField: 'branchOfService'
    },
    
    // Step 4: Marital Status
    MARITAL: {
        id: 'funnel-marital-form',
        name: 'Marital Status',
        description: 'Select your marital status',
        hasLoadingScreen: false,
        dataField: 'maritalStatus'
    },
    
    // Step 5: Coverage Amount
    COVERAGE: {
        id: 'funnel-coverage-form',
        name: 'Coverage Amount',
        description: 'Select your desired coverage amount',
        hasLoadingScreen: false,
        dataField: 'coverageAmount'
    },
    
    // Step 6: Contact Information
    CONTACT: {
        id: 'funnel-contact-form',
        name: 'Contact Information',
        description: 'Enter your contact details',
        hasLoadingScreen: false,
        dataField: 'contactInfo'
    },
    
    // Step 7: Tobacco Use
    TOBACCO: {
        id: 'funnel-medical-tobacco',
        name: 'Tobacco Use',
        description: 'Do you use tobacco products?',
        hasLoadingScreen: false,
        dataField: 'tobaccoUse'
    },
    
    // Step 8: Medical Conditions
    CONDITIONS: {
        id: 'funnel-medical-conditions',
        name: 'Medical Conditions',
        description: 'Select any medical conditions',
        hasLoadingScreen: false,
        dataField: 'medicalConditions'
    },
    
    // Step 9: Height & Weight
    HEIGHT_WEIGHT: {
        id: 'funnel-medical-height-weight',
        name: 'Height & Weight',
        description: 'Enter your height and weight',
        hasLoadingScreen: false,
        dataField: 'heightWeight'
    },
    
    // Step 10: Hospital Care
    HOSPITAL: {
        id: 'funnel-medical-hospital',
        name: 'Hospital Care',
        description: 'Recent hospital care questions',
        hasLoadingScreen: false,
        dataField: 'hospitalCare'
    },
    
    // Step 11: Diabetes Medication
    DIABETES: {
        id: 'funnel-medical-diabetes',
        name: 'Diabetes Medication',
        description: 'Do you take medication for diabetes?',
        hasLoadingScreen: true, // This step has a loading screen
        dataField: 'diabetesMedication'
    },
    
    // Step 12: Quote Tool
    QUOTE_TOOL: {
        id: 'funnel-quote-tool',
        name: 'Quote Tool',
        description: 'Get your personalized quote',
        hasLoadingScreen: false,
        dataField: 'quoteData'
    }
};

// Convert to array for easy iteration
const FUNNEL_STEPS_ARRAY = Object.values(FUNNEL_STEPS);

document.addEventListener('DOMContentLoaded', function() {
    // Test Google Apps Script connection
    testGoogleAppsScript().then(success => {
        if (success) {
            console.log('✅ Google Apps Script connection verified');
        } else {
            console.error('❌ Google Apps Script connection failed');
        }
    });
    
    // Initialize Load Screen functionality
    initializeLoadScreen();
    
    // Initialize abandonment tracking
    initializeAbandonmentTracking();
    
    // Initialize all functionality
    initializeFormHandling();
    initializeSmoothScrolling();
    initializeAnimations();
    initializePhoneNumberFormatting();
    initializeFormValidation();
    
    // Add comprehensive error handling to all buttons
    addButtonErrorHandling();
    
    // Initialize "See If I Qualify" button
    const seeIfQualifyBtn = document.querySelector('.qualify-button, .cta-button.qualify-button, #see-if-qualify-btn, [data-action="open-funnel"]');
    console.log('🔍 Looking for "See If I Qualify" button...');
    console.log('Button found:', !!seeIfQualifyBtn);
    
    if (seeIfQualifyBtn) {
        seeIfQualifyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🚀 "See If I Qualify" button clicked - opening funnel');
            openFunnelModal();
        });
        console.log('✅ Button event listener added');
    } else {
        console.log('❌ "See If I Qualify" button not found');
        // Try alternative selectors
        const alternativeButtons = document.querySelectorAll('.cta-button, button[class*="qualify"], button[class*="funnel"]');
        console.log('Alternative buttons found:', alternativeButtons.length);
        alternativeButtons.forEach((btn, index) => {
            console.log(`Button ${index}:`, btn.textContent.trim());
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('🚀 Alternative button clicked - opening funnel');
                openFunnelModal();
            });
        });
    }
    
    // Initialize quote sliders
    let coverageSlider = null;
    let iulQuoteSlider = null;
    let userAge = null; // Store user's age globally
    
    // Add event listener for "Complete Application" button to show quote modal
    const getQuoteBtn = document.getElementById('get-quote-btn');
    if (getQuoteBtn) {
        getQuoteBtn.addEventListener('click', function() {
            console.log('🔄 "Complete Application" button clicked - showing quote modal');
            
            // Hide the congratulations modal
            hideMedicalCongratsModal();
            
            // Check if we have age data
            const userAge = window.funnelData.age || 26; // Default to 26 if not set
            console.log('🎯 User age for quote modal:', userAge);
            
                if (userAge <= 60) {
                    // Show IUL quoting tool for ages 60 and below
                const iulModal = document.getElementById('iul-quote-modal');
                if (iulModal) {
                    iulModal.style.display = 'flex';
                    iulModal.classList.add('active');
                    console.log('📊 IUL Quote modal displayed');
                    
                    // Initialize the IUL quote slider if not already done
                    if (!window.iulQuoteSlider) {
                        window.iulQuoteSlider = new IULQuoteSlider();
                        window.iulQuoteSlider.init(); // Initialize with proper data
                    } else {
                        // Re-initialize with updated data
                        window.iulQuoteSlider.userAge = userAge;
                        window.iulQuoteSlider.coverageRange = window.iulQuoteSlider.getCoverageRangeFromPreviousStep();
                        window.iulQuoteSlider.currentValue = window.iulQuoteSlider.coverageRange.min;
                        window.iulQuoteSlider.lockAgeSlider();
                        window.iulQuoteSlider.setCoverageSliderRange();
                        window.iulQuoteSlider.updateQuote();
                    }
                    }
                } else {
                    // Show final expense quoting tool for ages 61 and above
                const coverageModal = document.getElementById('coverage-slider-modal');
                if (coverageModal) {
                    coverageModal.style.display = 'flex';
                    coverageModal.classList.add('active');
                    console.log('📊 Coverage Slider modal displayed');
                    
                    // Initialize the coverage slider
                    if (!window.coverageSlider) {
                        window.coverageSlider = new CoverageSlider();
                    }
                }
            }
        });
    }
    
    // Note: Quote modals are now triggered only after application submission
    // The get-quote-btn now only shows the application form, not the quote modals

    // Funnel state management (make globally accessible)
    window.funnelData = {};
    window.sessionId = null; // Will store the unique session ID
    window.abandonmentEmailSent = false; // Flag to prevent multiple abandonment emails per session
    
    // Generate unique session ID
    function generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Function to accumulate funnel data
    function accumulateFunnelData(stepName, stepData) {
        window.funnelData[stepName] = stepData;
    }

    // ============================================================================
    // FUNNEL NAVIGATION FUNCTIONS
    // ============================================================================
    
    // Function to go to next step with optional loading screen
    function goToNextStep(currentStepId, showLoadingScreen = false) {
        const currentStepIndex = FUNNEL_STEPS_ARRAY.findIndex(step => step.id === currentStepId);
        const nextStep = FUNNEL_STEPS_ARRAY[currentStepIndex + 1];
        
        if (nextStep) {
            // Hide current step
            const currentElement = document.getElementById(currentStepId);
            if (currentElement) {
                currentElement.style.display = 'none';
            }
            
            // Show loading screen if specified
            if (showLoadingScreen && nextStep.hasLoadingScreen) {
                showLoadingModal();
                setTimeout(() => {
                    hideLoadingModal();
                    showStep(nextStep.id);
                }, 3000); // 3 second loading screen
            } else {
                showStep(nextStep.id);
            }
            
            // Update progress
            updateFunnelProgress(nextStep.id);
            
            // Update current step for abandonment tracking
            window.currentStep = currentStepIndex + 2; // +2 because arrays are 0-indexed and we're moving to next step
            
            console.log(`✅ Moved from ${currentStepId} to ${nextStep.id} (Step ${currentStepIndex + 2}/12)`);
        }
    }
    
    // Function to show a specific step
    function showStep(stepId) {
        const stepElement = document.getElementById(stepId);
        if (stepElement) {
            stepElement.style.display = 'flex';
        }
    }
    
    // Function to go back to previous step
    function goToPreviousStep(currentStepId) {
        const currentStepIndex = FUNNEL_STEPS_ARRAY.findIndex(step => step.id === currentStepId);
        const previousStep = FUNNEL_STEPS_ARRAY[currentStepIndex - 1];
        
        if (previousStep) {
            // Hide current step
            const currentElement = document.getElementById(currentStepId);
            if (currentElement) {
                currentElement.style.display = 'none';
            }
            
            // Show previous step
            showStep(previousStep.id);
            
            // Update progress
            updateFunnelProgress(previousStep.id);
            
            // Update current step for abandonment tracking
            window.currentStep = currentStepIndex;
            
            console.log(`⬅️ Moved back from ${currentStepId} to ${previousStep.id} (Step ${currentStepIndex}/12)`);
        }
    }
    
    // Function to reset funnel to first step
    function resetFunnel() {
        window.funnelData = {};
        window.sessionId = generateSessionId(); // Generate new session ID
        window.abandonmentEmailSent = false; // Reset abandonment flag for new session
        console.log('=== NEW SESSION STARTED ===');
        console.log('Session ID:', window.sessionId);
        
        // Hide all forms
        FUNNEL_STEPS_ARRAY.forEach(step => {
            const element = document.getElementById(step.id);
            if (element) {
                element.style.display = 'none';
                // Reset form if it's a form element
                if (element.tagName === 'FORM') {
                    element.reset();
                }
            }
        });
        
        // Show first step
        showStep(FUNNEL_STEPS.STATE.id);
        updateFunnelProgress(FUNNEL_STEPS.STATE.id);
        window.currentStep = 1;
    }
    
    // Function to open funnel modal
    function openFunnelModal() {
        const modal = document.getElementById('funnel-modal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('active');
        resetFunnel();
            
            // Send session start email
            window.sendSessionStartEmail();
        }
    }
    
    // ============================================================================
    // LOADING SCREEN FUNCTIONS
    // ============================================================================
    
    function showLoadingModal() {
        console.log('🔄 Creating loading modal from scratch...');
        
        // Remove any existing loading modal
        const existingModal = document.getElementById('funnel-load-screen-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal container with smooth transition
        const modal = document.createElement('div');
        modal.id = 'funnel-load-screen-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '99999';
        modal.style.opacity = '0';
        modal.style.visibility = 'visible';
        modal.style.transition = 'opacity 0.4s ease-in-out';
        
        // Create modal content with smooth entrance
        const content = document.createElement('div');
        content.style.background = 'white';
        content.style.padding = '3rem 2rem';
        content.style.borderRadius = '20px';
        content.style.textAlign = 'center';
        content.style.maxWidth = '500px';
        content.style.width = '90%';
        content.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        content.style.transform = 'scale(0.8)';
        content.style.transition = 'transform 0.4s ease-in-out';
        
        // Add logo
        const logo = document.createElement('div');
        logo.style.marginBottom = '2rem';
        const logoImg = document.createElement('img');
        logoImg.src = 'assets/logo.png';
        logoImg.alt = 'Veteran Legacy Life Logo';
        logoImg.style.height = '80px';
        logoImg.style.width = 'auto';
        logoImg.style.objectFit = 'contain';
        logo.appendChild(logoImg);
        
        // Add title
        const title = document.createElement('h2');
        title.textContent = 'Your answers are being processed. Please wait.';
        title.style.color = '#1e293b';
        title.style.fontSize = '1.5rem';
        title.style.fontWeight = '600';
        title.style.marginBottom = '2rem';
        title.style.lineHeight = '1.4';
        
        // Add spinner
        const spinner = document.createElement('div');
        spinner.style.display = 'flex';
        spinner.style.justifyContent = 'center';
        spinner.style.alignItems = 'center';
        spinner.style.marginTop = '2rem';
        
        const spinnerRing = document.createElement('div');
        spinnerRing.style.width = '60px';
        spinnerRing.style.height = '60px';
        spinnerRing.style.border = '4px solid #e2e8f0';
        spinnerRing.style.borderTop = '4px solid #3b82f6';
        spinnerRing.style.borderRadius = '50%';
        spinnerRing.style.animation = 'spin 1s linear infinite';
        spinnerRing.style.animationName = 'spin';
        spinnerRing.style.animationDuration = '1s';
        spinnerRing.style.animationTimingFunction = 'linear';
        spinnerRing.style.animationIterationCount = 'infinite';
        
        // Add keyframes for spin animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        spinner.appendChild(spinnerRing);
        
        // Assemble content
        content.appendChild(logo);
        content.appendChild(title);
        content.appendChild(spinner);
        
        // Add to modal
        modal.appendChild(content);
        
        // Add to page
        document.body.appendChild(modal);
        
        // Hide the funnel modal first
        const funnelModal = document.getElementById('funnel-modal');
        if (funnelModal) {
            funnelModal.style.display = 'none';
            console.log('🔍 Funnel modal hidden');
        }
        
        // Trigger smooth entrance animation
        setTimeout(() => {
            modal.style.opacity = '1';
            content.style.transform = 'scale(1)';
        }, 50);
        
        console.log('🔄 Loading screen displayed');
        console.log('Loading modal element:', modal);
        console.log('Loading modal display:', modal.style.display);
        console.log('Loading modal z-index:', modal.style.zIndex);
        
        const rect = modal.getBoundingClientRect();
        console.log('Loading modal bounding rect:', rect);
        console.log('Loading modal is visible:', rect.width > 0 && rect.height > 0);
        
        // Auto-hide after 3 seconds with smooth exit
        setTimeout(() => {
            hideLoadingModal();
        }, 3000);
    }
    
    function hideLoadingModal() {
        const loadingModal = document.getElementById('funnel-load-screen-modal');
        if (loadingModal) {
            // Smooth exit animation
            loadingModal.style.opacity = '0';
            const content = loadingModal.querySelector('div');
            if (content) {
                content.style.transform = 'scale(0.9)';
            }
            
            // Remove after animation
            setTimeout(() => {
                if (loadingModal.parentNode) {
                    loadingModal.remove();
                    console.log('✅ Loading screen hidden');
                    
                    // Show the medical congratulations modal
                    showMedicalCongratsModal();
                }
            }, 300);
        }
    }
    
    // Function to show medical congratulations modal after loading
    function showMedicalCongratsModal() {
        console.log('🎉 Showing medical congratulations modal...');
        
        // Hide any existing modals first
        const existingModals = document.querySelectorAll('.modal-overlay');
        existingModals.forEach(modal => {
            if (modal.id !== 'medical-congrats-modal') {
                modal.style.display = 'none';
            }
        });
        
        const congratsModal = document.getElementById('medical-congrats-modal');
        if (congratsModal) {
            // Show with smooth animation
            congratsModal.style.display = 'flex';
            congratsModal.style.opacity = '0';
            congratsModal.style.transform = 'scale(0.9)';
            congratsModal.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out';
            
            setTimeout(() => {
                congratsModal.style.opacity = '1';
                congratsModal.style.transform = 'scale(1)';
            }, 10);
            
            console.log('🎉 Medical congratulations modal displayed');
            
            // NO AUTO-ADVANCE - wait for user to click "Complete Application"
        } else {
            console.error('❌ Medical congratulations modal not found');
            // Fallback: show next step directly
            showNextStepAfterCongrats();
        }
    }
    
    // Function to show the next step after congratulations
    function showNextStepAfterCongrats() {
        console.log('🔄 Showing application form after congratulations...');
        
        // Hide the congratulations modal completely
        hideMedicalCongratsModal();
        
        // Hide the funnel modal completely
        const funnelModal = document.getElementById('funnel-modal');
        if (funnelModal) {
            funnelModal.style.display = 'none';
        }
        
        // Hide any other modals that might be showing
        const coverageModal = document.getElementById('coverage-slider-modal');
        if (coverageModal) {
            coverageModal.style.display = 'none';
        }
        
        const iulModal = document.getElementById('iul-quote-modal');
        if (iulModal) {
            iulModal.style.display = 'none';
        }
        
        // Show the application form as a separate modal
        const applicationForm = document.getElementById('funnel-application-form');
        if (applicationForm) {
            // Create a new modal container for the application form
            const appModal = document.createElement('div');
            appModal.id = 'application-modal-overlay';
            appModal.style.position = 'fixed';
            appModal.style.top = '0';
            appModal.style.left = '0';
            appModal.style.width = '100%';
            appModal.style.height = '100%';
            appModal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            appModal.style.display = 'flex';
            appModal.style.justifyContent = 'center';
            appModal.style.alignItems = 'center';
            appModal.style.zIndex = '999999'; // Higher than other modals
            appModal.style.opacity = '0';
            appModal.style.transition = 'opacity 0.3s ease-in-out';
            
            // Create content container
            const appContent = document.createElement('div');
            appContent.style.background = 'white';
            appContent.style.padding = '2rem';
            appContent.style.borderRadius = '15px';
            appContent.style.maxWidth = '600px';
            appContent.style.width = '90%';
            appContent.style.maxHeight = '90vh';
            appContent.style.overflowY = 'auto';
            appContent.style.transform = 'scale(0.9)';
            appContent.style.transition = 'transform 0.3s ease-in-out';
            
            // Clone the application form content
            const formClone = applicationForm.cloneNode(true);
            formClone.style.display = 'block';
            formClone.style.border = 'none';
            formClone.style.padding = '0';
            formClone.style.margin = '0';
            
            // Add close button
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '×';
            closeBtn.style.position = 'absolute';
            closeBtn.style.top = '15px';
            closeBtn.style.right = '15px';
            closeBtn.style.background = 'none';
            closeBtn.style.border = 'none';
            closeBtn.style.fontSize = '24px';
            closeBtn.style.color = '#666';
            closeBtn.style.cursor = 'pointer';
            closeBtn.onclick = function() {
                appModal.style.opacity = '0';
                appContent.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    if (appModal.parentNode) {
                        appModal.remove();
                    }
                }, 300);
            };
            
            appContent.appendChild(closeBtn);
            appContent.appendChild(formClone);
            appModal.appendChild(appContent);
            document.body.appendChild(appModal);
            
            // Attach event listeners to the cloned buttons
            const nextBtn = formClone.querySelector('#application-next-btn');
            if (nextBtn) {
                nextBtn.addEventListener('click', function() {
                    console.log('🔄 "Continue to Step 2" button clicked in cloned form');
                    
                    // Hide the current application form step
                    formClone.style.display = 'none';
                    
                    // Show the final application step
                    const finalForm = document.getElementById('funnel-application-final');
                    if (finalForm) {
                        finalForm.style.display = 'block';
                        console.log('📝 Application step 2 displayed');
                    } else {
                        console.error('❌ Final application form not found');
                    }
                });
                console.log('✅ Event listener attached to cloned "Continue to Step 2" button');
            } else {
                console.error('❌ Application next button not found in cloned form');
            }
            
            // Trigger smooth entrance animation
            setTimeout(() => {
                appModal.style.opacity = '1';
                appContent.style.transform = 'scale(1)';
            }, 10);
            
            console.log('📝 Application form displayed as separate modal');
        } else {
            console.error('❌ Application form not found');
        }
    }
    
    // Add event listener for the "Complete Application" button
    function initializeMedicalCongratsButton() {
        const getQuoteBtn = document.getElementById('get-quote-btn');
        if (getQuoteBtn) {
            console.log('✅ Medical congratulations button found and initialized');
            getQuoteBtn.addEventListener('click', function() {
                console.log('🔄 "Complete Application" button clicked - showing quote modal');
                
                // Hide the congratulations modal
                hideMedicalCongratsModal();
                
                // Check if we have age data
                const userAge = window.funnelData.age || 26; // Default to 26 if not set
                console.log('🎯 User age for quote modal:', userAge);
                
                if (userAge <= 60) {
                    // Show IUL quoting tool for ages 60 and below
                    const iulModal = document.getElementById('iul-quote-modal');
                    if (iulModal) {
                        iulModal.style.display = 'flex';
                        iulModal.classList.add('active');
                        console.log('📊 IUL Quote modal displayed');
                        
                        // Initialize the IUL quote slider if not already done
                        if (!window.iulQuoteSlider) {
                            window.iulQuoteSlider = new IULQuoteSlider();
                        }
                    }
                } else {
                    // Show final expense quoting tool for ages 61 and above
                    const coverageModal = document.getElementById('coverage-slider-modal');
                    if (coverageModal) {
                        coverageModal.style.display = 'flex';
                        coverageModal.classList.add('active');
                        console.log('📊 Coverage Slider modal displayed');
                        
                // Initialize the coverage slider
                if (!window.coverageSlider) {
                    window.coverageSlider = new CoverageSlider();
                        }
                }
            }
        });
        } else {
            console.error('❌ Medical congratulations button not found');
        }
    }

    // Send session start email
    window.sendSessionStartEmail = async function() {
        try {
            console.log('=== SENDING SESSION START EMAIL ===');
            
            const sessionStartData = {
                sessionId: window.sessionId,
                formType: 'SessionStart',
                funnelProgress: 'Started',
                timestamp: new Date().toISOString()
            };
            
            console.log('Session start data:', sessionStartData);
            await submitFormData(sessionStartData);
            console.log('=== SESSION START EMAIL SENT ===');
            
        } catch (error) {
            console.error('=== ERROR in sendSessionStartEmail ===');
            console.error('Error type:', error.constructor.name);
            console.error('Error message:', error.message);
            // Don't show error to user for session start emails
        }
    }

    // Function to send abandonment email
    window.sendAbandonmentEmail = async function(reason) {
        // Check if abandonment email already sent for this session
        if (window.abandonmentEmailSent) {
            console.log(`=== ABANDONMENT EMAIL ALREADY SENT FOR SESSION ${window.sessionId} ===`);
            return;
        }
        
        try {
            console.log(`=== SENDING ABANDONMENT EMAIL: ${reason} ===`);
            
            // Calculate age from date of birth if available
            let calculatedAge = null;
            if (window.funnelData.contactInfo?.dateOfBirth) {
                const today = new Date();
                const birthDate = new Date(window.funnelData.contactInfo.dateOfBirth);
                const age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                calculatedAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
            }
            
            const abandonmentData = {
                sessionId: window.sessionId,
                formType: 'Abandoned',
                funnelProgress: `Abandoned at step ${window.currentStep}`,
                abandonmentReason: reason,
                
                // Include whatever data we have so far
                firstName: window.funnelData.contactInfo?.firstName || '',
                lastName: window.funnelData.contactInfo?.lastName || '',
                phone: window.funnelData.contactInfo?.phone || '',
                email: window.funnelData.contactInfo?.email || '',
                dateOfBirth: window.funnelData.contactInfo?.dateOfBirth || '',
                age: calculatedAge || userAge || '',
                transactionalConsent: window.funnelData.contactInfo?.transactionalConsent || false,
                marketingConsent: window.funnelData.contactInfo?.marketingConsent || false,
                
                state: window.funnelData.state || '',
                militaryStatus: window.funnelData.militaryStatus || '',
                branchOfService: window.funnelData.branchOfService || '',
                maritalStatus: window.funnelData.maritalStatus || '',
                coverageAmount: window.funnelData.coverageAmount || '',
                
                tobaccoUse: medicalAnswers.tobaccoUse || '',
                medicalConditions: medicalAnswers.medicalConditions || [],
                height: medicalAnswers.height || '',
                weight: medicalAnswers.weight || '',
                hospitalCare: medicalAnswers.hospitalCare || '',
                diabetesMedication: medicalAnswers.diabetesMedication || '',
                
                timestamp: new Date().toISOString()
            };
            
            console.log('Abandonment data being sent:', abandonmentData);
            await submitFormData(abandonmentData);
            console.log(`=== ABANDONMENT EMAIL SENT: ${reason} ===`);
            
            // Set flag to prevent multiple abandonment emails for this session
            window.abandonmentEmailSent = true;
            
        } catch (error) {
            console.error('=== ERROR in sendAbandonmentEmail ===');
            console.error('Error type:', error.constructor.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            console.error('Abandonment reason:', reason);
            console.error('Current step:', window.currentStep);
            console.error('Funnel data available:', !!window.funnelData);
            console.error('Medical answers available:', !!medicalAnswers);
        }
    }

    // ============================================================================
    // PARTIAL DATA SAVING FUNCTIONS
    // ============================================================================
    
    // Send partial funnel data (silent backend operation)
    window.sendPartialFunnelData = async function(stepNumber, totalSteps) {
        try {
            console.log(`=== SILENT PARTIAL SAVE: Step ${stepNumber}/${totalSteps} ===`);
            
            // Calculate age from date of birth if available
            let calculatedAge = null;
            if (window.funnelData.contactInfo?.dateOfBirth) {
                const today = new Date();
                const birthDate = new Date(window.funnelData.contactInfo.dateOfBirth);
                const age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                calculatedAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
            }
            
            const partialData = {
                sessionId: window.sessionId, // Added
                firstName: window.funnelData.contactInfo?.firstName || '',
                lastName: window.funnelData.contactInfo?.lastName || '',
                phone: window.funnelData.contactInfo?.phone || '',
                email: window.funnelData.contactInfo?.email || '',
                dateOfBirth: window.funnelData.contactInfo?.dateOfBirth || '',
                age: calculatedAge || userAge || '',
                transactionalConsent: window.funnelData.contactInfo?.transactionalConsent || false,
                marketingConsent: window.funnelData.contactInfo?.marketingConsent || false,
                
                state: window.funnelData.state || '',
                militaryStatus: window.funnelData.militaryStatus || '',
                branchOfService: window.funnelData.branchOfService || '',
                maritalStatus: window.funnelData.maritalStatus || '',
                coverageAmount: window.funnelData.coverageAmount || '',
                
                tobaccoUse: medicalAnswers?.tobaccoUse || '',
                medicalConditions: medicalAnswers?.medicalConditions || [],
                height: medicalAnswers?.height || '',
                weight: medicalAnswers?.weight || '',
                hospitalCare: medicalAnswers?.hospitalCare || '',
                diabetesMedication: medicalAnswers?.diabetesMedication || '',
                
                formType: 'Partial',
                funnelProgress: `Step ${stepNumber}/${totalSteps}`,
                timestamp: new Date().toISOString()
            };
            
            console.log('Partial data being sent:', partialData);
            await submitFormData(partialData);
            console.log(`=== PARTIAL SAVE COMPLETE: Step ${stepNumber}/${totalSteps} ===`);
            
        } catch (error) {
            console.error('=== ERROR in sendPartialFunnelData ===');
            console.error('Error type:', error.constructor.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            console.error('Step number:', stepNumber);
            console.error('Total steps:', totalSteps);
            console.error('Funnel data available:', !!window.funnelData);
            console.error('Medical answers available:', !!medicalAnswers);
        }
    }

    // ============================================================================
    // COMPLETE FUNNEL DATA SUBMISSION
    // ============================================================================
    
    async function sendCompleteFunnelData() {
        try {
            console.log('=== START: sendCompleteFunnelData ===');
            console.log('funnelData:', window.funnelData);
            console.log('medicalAnswers:', medicalAnswers);
            
            // Collect application data from forms
            collectApplicationData();
            
            // Calculate age from date of birth
            let calculatedAge = null;
            if (window.funnelData.contactInfo?.dateOfBirth) {
                const today = new Date();
                const birthDate = new Date(window.funnelData.contactInfo.dateOfBirth);
                const age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                calculatedAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
            }
            
            const completeData = {
                sessionId: window.sessionId,
                // Phase 1 - Pre-Qualification Data
                state: window.funnelData.state || '',
                militaryStatus: window.funnelData.militaryStatus || '',
                branchOfService: window.funnelData.branchOfService || '',
                maritalStatus: window.funnelData.maritalStatus || '',
                coverageAmount: window.funnelData.coverageAmount || '',
                firstName: window.funnelData.contactInfo?.firstName || '',
                lastName: window.funnelData.contactInfo?.lastName || '',
                email: window.funnelData.contactInfo?.email || '',
                phone: window.funnelData.contactInfo?.phone || '',
                dateOfBirth: window.funnelData.contactInfo?.dateOfBirth || '',
                tobaccoUse: medicalAnswers.tobaccoUse || '',
                medicalConditions: medicalAnswers.medicalConditions || [],
                height: medicalAnswers.height || '',
                weight: medicalAnswers.weight || '',
                hospitalCare: medicalAnswers.hospitalCare || '',
                diabetesMedication: medicalAnswers.diabetesMedication || '',
                
                // Phase 2 - Application Data (ALL FIELDS)
                addressStreet: window.applicationData?.address?.street || '',
                addressCity: window.applicationData?.address?.city || '',
                addressState: window.applicationData?.address?.state || '',
                addressZip: window.applicationData?.address?.zipCode || '',
                beneficiaryName: window.applicationData?.beneficiary?.name || '',
                beneficiaryRelationship: window.applicationData?.beneficiary?.relationship || '',
                vaNumber: window.applicationData?.vaInfo?.vaNumber || '',
                serviceConnected: window.applicationData?.vaInfo?.serviceConnected || '',
                ssn: window.applicationData?.ssn || '',
                bankName: window.applicationData?.banking?.bankName || '',
                routingNumber: window.applicationData?.banking?.routingNumber || '',
                accountNumber: window.applicationData?.banking?.accountNumber || '',
                policyDate: window.applicationData?.policyDate || '',
                quoteAmount: window.applicationData?.quoteData?.coverageAmount || '',
                monthlyPremium: window.applicationData?.quoteData?.monthlyPremium || '',
                userAge: calculatedAge || window.applicationData?.quoteData?.userAge || '',
                userGender: window.applicationData?.quoteData?.userGender || '',
                quoteType: window.applicationData?.quoteData?.quoteType || '',
                
                // Tracking Data
                currentStep: 'Complete',
                stepName: 'Complete Funnel',
                formType: 'Funnel',
                userAgent: navigator.userAgent,
                referrer: document.referrer,
                utmSource: new URLSearchParams(window.location.search).get('utm_source') || '',
                utmMedium: new URLSearchParams(window.location.search).get('utm_medium') || '',
                utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign') || '',
                timestamp: new Date().toISOString()
            };
            
            console.log('Complete data being sent:', completeData);
            
            // Data validation - Required fields
            console.log('Data validation - Required fields:');
            console.log('- firstName:', !!completeData.firstName);
            console.log('- lastName:', !!completeData.lastName);
            console.log('- email:', !!completeData.email);
            console.log('- phone:', !!completeData.phone);
            
            console.log('Calling submitFormData...');
            const result = await submitFormData(completeData);
            console.log('submitFormData result:', result);
            
            console.log('=== END: sendCompleteFunnelData (SUCCESS) ===');
            return result;
            
        } catch (error) {
            console.error('=== ERROR in sendCompleteFunnelData ===');
            console.error('Error type:', error.constructor.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            throw error;
        }
    }

    // ============================================================================
    // FUNNEL STEP EVENT HANDLERS - CLEARLY ORGANIZED BY STEP
    // ============================================================================
    
    // STEP 1: State Selection
    function initializeStateStep() {
        const stateForm = document.getElementById(FUNNEL_STEPS.STATE.id);
        if (!stateForm) return;
        
        stateForm.addEventListener('submit', function(e) {
        e.preventDefault();
            
            try {
        const stateSelect = document.getElementById('funnel-state-select');
                console.log('State select element found:', !!stateSelect);
                console.log('Selected state value:', stateSelect?.value);
                
                if (!stateSelect || !stateSelect.value) {
                    showFieldError(stateSelect, 'Please select your state');
                    return;
                }
                
                // Save state data
                window.funnelData.state = stateSelect.value;
                console.log('State saved to funnelData:', window.funnelData.state);
            
            // Accumulate data
            accumulateFunnelData('state', stateSelect.value);
                console.log('State data accumulated successfully');
                
                goToNextStep(FUNNEL_STEPS.STATE.id);
                console.log('✅ State step completed successfully');
                
            } catch (error) {
                console.error('Error in state step:', error);
            }
        });
    }
    
    // STEP 2: Military Status
    function initializeMilitaryStep() {
        const militaryInputs = document.querySelectorAll(`#${FUNNEL_STEPS.MILITARY.id} input[name="militaryStatus"]`);
    militaryInputs.forEach(input => {
        input.addEventListener('click', () => {
                window.funnelData.militaryStatus = input.value;
            
            // Accumulate data
            accumulateFunnelData('militaryStatus', input.value);
            
                setTimeout(() => {
                    goToNextStep(FUNNEL_STEPS.MILITARY.id);
                }, 300);
        });
    });
    }

    // STEP 3: Branch of Service
    function initializeBranchStep() {
        const branchInputs = document.querySelectorAll(`#${FUNNEL_STEPS.BRANCH.id} input[name="branchOfService"]`);
    branchInputs.forEach(input => {
        input.addEventListener('click', () => {
                window.funnelData.branchOfService = input.value;
            
            // Accumulate data
            accumulateFunnelData('branchOfService', input.value);
            
                setTimeout(() => {
                    goToNextStep(FUNNEL_STEPS.BRANCH.id);
                }, 300);
        });
    });
    }

    // STEP 4: Marital Status
    function initializeMaritalStep() {
        const maritalInputs = document.querySelectorAll(`#${FUNNEL_STEPS.MARITAL.id} input[name="maritalStatus"]`);
    maritalInputs.forEach(input => {
        input.addEventListener('click', () => {
                window.funnelData.maritalStatus = input.value;
            
            // Accumulate data
            accumulateFunnelData('maritalStatus', input.value);
            
                setTimeout(() => {
                    goToNextStep(FUNNEL_STEPS.MARITAL.id);
                }, 300);
        });
    });
    }

    // STEP 5: Coverage Amount
    function initializeCoverageStep() {
        const coverageInputs = document.querySelectorAll(`#${FUNNEL_STEPS.COVERAGE.id} input[name="coverageAmount"]`);
    coverageInputs.forEach(input => {
        input.addEventListener('click', () => {
                window.funnelData.coverageAmount = input.value;
            
            // Accumulate data
            accumulateFunnelData('coverageAmount', input.value);
            
                setTimeout(() => {
                    goToNextStep(FUNNEL_STEPS.COVERAGE.id);
                }, 300);
        });
    });
    }
    
    // STEP 6: Contact Information
    function initializeContactStep() {
        const contactForm = document.getElementById(FUNNEL_STEPS.CONTACT.id);
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
            try {
                // Get form data
                const formData = new FormData(contactForm);
                const contactData = {
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    phone: formData.get('phone'),
                    email: formData.get('email'),
                    dateOfBirth: formData.get('dateOfBirth'),
                    transactionalConsent: formData.get('transactionalConsent') === 'on',
                    marketingConsent: formData.get('marketingConsent') === 'on'
                };
                
                // Validate required fields
                const requiredFields = ['firstName', 'lastName', 'phone', 'email', 'dateOfBirth'];
                for (const field of requiredFields) {
                    if (!contactData[field] || contactData[field].trim() === '') {
                        showFieldError(document.querySelector(`[name="${field}"]`), `Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
                        return;
                    }
                }
                
                // Calculate age
        const today = new Date();
                const birthDate = new Date(contactData.dateOfBirth);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
                userAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
                
                // Save contact data
                window.funnelData.contactInfo = contactData;
                window.funnelData.contactInfo.age = userAge;
                
                // Accumulate data
                accumulateFunnelData('contactInfo', contactData);
                
                console.log('Contact data saved:', contactData);
                console.log('Calculated age:', userAge);
                
                goToNextStep(FUNNEL_STEPS.CONTACT.id);
                
            } catch (error) {
                console.error('Error in contact step:', error);
            }
        });
    }
    
    // STEP 7: Tobacco Use
    function initializeTobaccoStep() {
        const tobaccoInputs = document.querySelectorAll(`#${FUNNEL_STEPS.TOBACCO.id} input[name="tobaccoUse"]`);
        tobaccoInputs.forEach(input => {
            input.addEventListener('click', () => {
                medicalAnswers.tobaccoUse = input.value;
                
                setTimeout(() => {
                    goToNextStep(FUNNEL_STEPS.TOBACCO.id);
                }, 300);
            });
        });
    }
    
    // STEP 8: Medical Conditions
    function initializeConditionsStep() {
        const conditionsForm = document.getElementById(FUNNEL_STEPS.CONDITIONS.id);
        if (!conditionsForm) return;
        
        conditionsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const selectedConditions = [];
            const checkboxes = conditionsForm.querySelectorAll('input[type="checkbox"]:checked');
            checkboxes.forEach(checkbox => {
                selectedConditions.push(checkbox.value);
            });
            
            medicalAnswers.medicalConditions = selectedConditions;
            
            goToNextStep(FUNNEL_STEPS.CONDITIONS.id);
        });
    }
    
    // STEP 9: Height & Weight
    function initializeHeightWeightStep() {
        const heightWeightForm = document.getElementById(FUNNEL_STEPS.HEIGHT_WEIGHT.id);
        if (!heightWeightForm) return;
        
        // Add click event listener for the Next button
        const nextButton = document.getElementById('medical-height-weight-next');
        if (nextButton) {
            nextButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                const heightInput = heightWeightForm.querySelector('input[name="height"]');
                const weightInput = heightWeightForm.querySelector('input[name="weight"]');
                
                if (!heightInput.value || !weightInput.value) {
            showFieldError(document.querySelector('#funnel-medical-height-weight input'), 'Please fill in both height and weight');
            return;
        }
        
                medicalAnswers.height = heightInput.value;
                medicalAnswers.weight = weightInput.value;
                
                goToNextStep(FUNNEL_STEPS.HEIGHT_WEIGHT.id);
            });
        }
        
        heightWeightForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const heightInput = heightWeightForm.querySelector('input[name="height"]');
            const weightInput = heightWeightForm.querySelector('input[name="weight"]');
            
            if (!heightInput.value || !weightInput.value) {
                showFieldError(document.querySelector('#funnel-medical-height-weight input'), 'Please fill in both height and weight');
            return;
        }
        
            medicalAnswers.height = heightInput.value;
            medicalAnswers.weight = weightInput.value;
            
            goToNextStep(FUNNEL_STEPS.HEIGHT_WEIGHT.id);
        });
    }
    
    // STEP 10: Hospital Care
    function initializeHospitalStep() {
        const hospitalInputs = document.querySelectorAll(`#${FUNNEL_STEPS.HOSPITAL.id} input[name="hospitalCare"]`);
        hospitalInputs.forEach(input => {
            input.addEventListener('click', () => {
                medicalAnswers.hospitalCare = input.value;
                
                setTimeout(() => {
                    goToNextStep(FUNNEL_STEPS.HOSPITAL.id);
                }, 300);
            });
        });
        
        // Add click event listener for the Next button
        const nextButton = document.getElementById('medical-hospital-next');
        if (nextButton) {
            nextButton.addEventListener('click', function(e) {
        e.preventDefault();
                
                const selectedInput = document.querySelector(`#${FUNNEL_STEPS.HOSPITAL.id} input[name="hospitalCare"]:checked`);
                
                if (!selectedInput) {
                    showFieldError(document.querySelector('#funnel-medical-hospital input'), 'Please select an option');
            return;
                }
                
                medicalAnswers.hospitalCare = selectedInput.value;
                goToNextStep(FUNNEL_STEPS.HOSPITAL.id);
            });
        }
    }
    
    // STEP 11: Diabetes Medication (with loading screen)
    function initializeDiabetesStep() {
        const diabetesForm = document.getElementById(FUNNEL_STEPS.DIABETES.id);
        if (!diabetesForm) return;
        
        // Add click event listener for the submit button as backup
        const submitButton = document.getElementById('medical-submit');
        if (submitButton) {
            submitButton.addEventListener('click', async function(e) {
                e.preventDefault();
                
                const diabetesInputs = diabetesForm.querySelectorAll('input[name="diabetesMedication"]');
                let selectedValue = '';
                
                diabetesInputs.forEach(input => {
                    if (input.checked) {
                        selectedValue = input.value;
                    }
                });
                
                if (!selectedValue) {
                    showFieldError(document.querySelector('#funnel-medical-diabetes input'), 'Please select an option');
                    return;
                }
                
                medicalAnswers.diabetesMedication = selectedValue;
                
                // Show fake loading screen for 3 seconds
                showLoadingModal();
                
                setTimeout(() => {
                    hideLoadingModal();
                    // Show medical congratulations modal
                    showMedicalCongratsModal();
                }, 3000); // 3 second loading screen
                
                // Send complete funnel data in background
                try {
                    await sendCompleteFunnelData();
                    console.log('✅ Complete funnel data sent successfully');
                } catch (error) {
                    console.error('❌ Error sending complete funnel data:', error);
                }
            });
        }
    }
    
    // STEP 12: Quote Tool (final step)
    function initializeQuoteToolStep() {
        // This step is handled by the quote tool classes
        console.log('Quote tool step initialized');
    }
    
    // ============================================================================
    // BACK BUTTON HANDLERS
    // ============================================================================
    
    function initializeBackButtons() {
        // Back button handlers for each step
        const backButtons = document.querySelectorAll('.funnel-back-btn');
        backButtons.forEach(button => {
            button.addEventListener('click', function() {
                const currentForm = this.closest('form');
                if (currentForm) {
                    goToPreviousStep(currentForm.id);
                }
            });
        });
    }
    
    // ============================================================================
    // INITIALIZE ALL FUNNEL STEPS
    // ============================================================================
    
    function initializeAllFunnelSteps() {
        console.log('🚀 Initializing all 12 funnel steps...');
        
        // Initialize each step
        initializeStateStep();
        initializeMilitaryStep();
        initializeBranchStep();
        initializeMaritalStep();
        initializeCoverageStep();
        initializeContactStep();
        initializeTobaccoStep();
        initializeConditionsStep();
        initializeHeightWeightStep();
        initializeHospitalStep();
        initializeDiabetesStep();
        initializeQuoteToolStep();
        
        // Initialize back buttons
        initializeBackButtons();
        
        console.log('✅ All 12 funnel steps initialized');
    }
    
    // Initialize all funnel steps
    initializeAllFunnelSteps();

    // ============================================================================
    // ADDITIONAL BUTTON INITIALIZATIONS (RESTORED FROM ORIGINAL)
    // ============================================================================
    
    // Initialize "Load Screen" button
    const loadScreenBtn = document.querySelector('.load-screen-btn, [data-action="load-screen"]');
    if (loadScreenBtn) {
        loadScreenBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔄 Load Screen button clicked');
            showLoadingModal();
            setTimeout(() => {
                hideLoadingModal();
                // Show medical congratulations modal
                showMedicalCongratsModal();
            }, 7000); // 7 seconds as requested
        });
    }
    
    // Initialize all medical form inputs (restored from original)
    function initializeMedicalFormInputs() {
        // Tobacco use inputs
        const tobaccoInputs = document.querySelectorAll('#funnel-medical-tobacco input[name="tobaccoUse"]');
        tobaccoInputs.forEach(input => {
            input.addEventListener('click', () => {
                medicalAnswers.tobaccoUse = input.value;
                // Navigation is handled by the form submit in the step functions
            });
        });
        
        // Hospital care inputs
        const hospitalInputs = document.querySelectorAll('#funnel-medical-hospital input[name="hospitalCare"]');
        hospitalInputs.forEach(input => {
            input.addEventListener('click', () => {
                medicalAnswers.hospitalCare = input.value;
                // Navigation is handled by the form submit in the step functions
            });
        });
        
        // Diabetes medication inputs
        const diabetesInputs = document.querySelectorAll('#funnel-medical-diabetes input[name="diabetesMedication"]');
        diabetesInputs.forEach(input => {
            input.addEventListener('click', () => {
                medicalAnswers.diabetesMedication = input.value;
                // Navigation is handled by the form submit in the step functions
            });
        });
    }
    
    // Initialize medical form inputs
    initializeMedicalFormInputs();
    
    // Initialize height/weight dropdowns
    initializeHeightWeightDropdowns();
    
    // Initialize medical conditions logic
    initializeMedicalConditionsLogic();
    
    // Initialize application form navigation
    initializeApplicationFormNavigation();
    
    // Initialize FAQ functionality
    initializeFAQ();
    
    // Initialize image optimization
    optimizeImages();
    
    // Initialize all other missing functionality
    console.log('🔧 Initializing additional functionality...');
    
    // Track all CTA button clicks
    document.addEventListener('click', function(e) {
        if (e.target.matches('.cta-button, button[class*="cta"], .qualify-button')) {
            const buttonText = e.target.textContent.trim();
            const pageLocation = window.location.href;
            trackEvent('cta_click', {
                button_text: buttonText,
                page_location: pageLocation
            });
        }
    });
    
    console.log('✅ All additional functionality initialized');

    // ============================================================================
    // PROGRESS TRACKING
    // ============================================================================
    
    function setMedicalProgress(step, total) {
        const progressBar = document.querySelector('.medical-progress-bar');
        if (progressBar) {
            const percentage = (step / total) * 100;
            progressBar.style.width = percentage + '%';
        }
        // Log progress even if no visual bar exists
        console.log(`📊 Medical Progress: Step ${step}/${total} (${Math.round((step / total) * 100)}%)`);
    }
    
    function updateFunnelProgress(currentStepId) {
        const currentStepIndex = FUNNEL_STEPS_ARRAY.findIndex(step => step.id === currentStepId);
        const stepNumber = currentStepIndex + 1;
        const percentage = Math.round((stepNumber / 12) * 100);
        
        console.log(`📊 Progress: Step ${stepNumber}/12 (${percentage}%)`);
        
        // Update progress tracker text
        const progressTracker = document.querySelector('.funnel-progress-tracker');
        if (progressTracker) {
            progressTracker.textContent = `${stepNumber}/12`;
        }
        
        // Update progress bar fill
        const progressFill = document.querySelector('.funnel-progress-fill');
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        
        // Update current step for abandonment tracking
        window.currentStep = stepNumber;
    }

    // ============================================================================
    // MODAL FUNCTIONS
    // ============================================================================
    
    function showSuccessModal() {
        const modal = document.getElementById('success-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    function hideSuccessModal() {
        const modal = document.getElementById('success-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    function showApplicationCongratsModal() {
        const modal = document.getElementById('application-congrats-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    function hideApplicationCongratsModal() {
        const modal = document.getElementById('application-congrats-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    function hideMedicalCongratsModal() {
        const congratsModal = document.getElementById('medical-congrats-modal');
        if (congratsModal) {
            // Smooth exit animation
            congratsModal.style.opacity = '0';
            congratsModal.style.transform = 'scale(0.9)';
            congratsModal.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out';
            
            // Remove after animation
            setTimeout(() => {
            congratsModal.style.display = 'none';
                console.log('✅ Medical congratulations modal hidden');
            }, 300);
        }
    }

    // ============================================================================
    // UTILITY FUNCTIONS
    // ============================================================================

    function initializeFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (question && answer) {
            question.addEventListener('click', () => {
                    const isOpen = item.classList.contains('active');
                
                    // Close all FAQ items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                    // Open clicked item if it wasn't open
                    if (!isOpen) {
                    item.classList.add('active');
                }
            });
            }
        });
    }
    
    function initializePhoneNumberFormatting() {
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(input => {
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    if (value.length <= 3) {
                        value = `(${value}`;
                    } else if (value.length <= 6) {
                        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                    } else {
                        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                    }
                }
                e.target.value = value;
            });
            });
    }

    function showFieldError(field, message) {
        if (!field) return;
        
        // Remove existing error
        clearFieldError(field);
        
        // Add error styling
        field.classList.add('error');
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '5px';
        
        // Insert error message after field
        field.parentNode.insertBefore(errorDiv, field.nextSibling);
        
        // Scroll to error
        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function clearFieldError(field) {
        if (!field) return;
        
        // Remove error styling
        field.classList.remove('error');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    // Make clearFieldError globally accessible
    window.clearFieldError = clearFieldError;

    // Submit form data to Google Apps Script
    async function submitFormData(data) {
        console.log('=== START: submitFormData ===');
        
        try {
            // Validate input data
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid data: data must be an object');
            }
            
            console.log('Input data:', data);
            console.log('Data type:', typeof data);
            console.log('Data keys:', Object.keys(data));
            
            // Convert data to URL-encoded format to avoid CORS preflight
            const formData = new URLSearchParams();
            let paramCount = 0;
            
            for (const [key, value] of Object.entries(data)) {
                try {
                    if (Array.isArray(value)) {
                        formData.append(key, value.join(', '));
                    } else {
                        formData.append(key, value || '');
                    }
                    paramCount++;
                } catch (paramError) {
                    console.error(`Error processing parameter ${key}:`, paramError);
                }
            }
            
            console.log('Parameters processed:', paramCount);
            
            const requestBody = formData.toString();
            console.log('Request body length:', requestBody.length);
            console.log('Request body preview:', requestBody.substring(0, 200) + '...');
            console.log('Target URL:', GOOGLE_APPS_SCRIPT_URL);
            
            // Validate URL
            if (!GOOGLE_APPS_SCRIPT_URL || !GOOGLE_APPS_SCRIPT_URL.includes('script.google.com')) {
                throw new Error('Invalid Google Apps Script URL');
            }
            
            console.log('Making fetch request...');
            const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: requestBody
            });
            
            console.log('Response received');
            console.log('Response status:', response.status);
            console.log('Response status text:', response.statusText);
            console.log('Response URL:', response.url);
            
            // Log all response headers
            const headers = {};
            response.headers.forEach((value, key) => {
                headers[key] = value;
            });
            console.log('Response headers:', headers);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response body:', errorText);
                throw new Error(`HTTP ${response.status} ${response.statusText}: ${errorText}`);
            }
            
            console.log('Response is OK, parsing JSON...');
            const result = await response.json();
            console.log('Parsed result:', result);
            console.log('=== END: submitFormData (SUCCESS) ===');
            return result;
            
        } catch (error) {
            console.error('=== ERROR in submitFormData ===');
            console.error('Error type:', error.constructor.name);
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            
            // Additional error context
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                console.error('Network error detected - check internet connection');
            }
            
            if (error.message.includes('CORS')) {
                console.error('CORS error detected - check Google Apps Script deployment');
            }
            
            console.error('=== END ERROR ===');
            throw error;
        }
    }

    // ============================================================================
    // FORM HANDLING FUNCTIONS
    // ============================================================================
    
function initializeFormHandling() {
    const form = document.getElementById('eligibilityForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(form);
    });
}

// Handle form submission
async function handleFormSubmission(form) {
    const submitButton = form.querySelector('.submit-button');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking Eligibility...';
    submitButton.classList.add('loading');
    submitButton.disabled = true;

    try {
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate form data
        if (!validateFormData(data)) {
            throw new Error('Please fill in all required fields correctly.');
        }

        // Submit form data to Google Apps Script
        await submitFormData(data);
        
        // Show success message
        showSuccessMessage('Thank you! We\'ve received your information. A licensed insurance representative will contact you within 24 hours to discuss your eligibility and options.');
        
        // Reset form
        form.reset();
        
    } catch (error) {
        // Show error message
        showErrorMessage(error.message || 'Something went wrong. Please try again.');
    } finally {
        // Reset button state
        submitButton.innerHTML = originalText;
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
    }
}

// Validate form data
function validateFormData(data) {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'state', 'militaryStatus'];
    
    for (const field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            return false;
        }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return false;
    }
    
    // Validate phone number (basic validation)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = data.phone.replace(/\D/g, '');
    if (!phoneRegex.test(cleanPhone)) {
        return false;
    }
    
    return true;
}

// ============================================================================
    // MESSAGE FUNCTIONS
// ============================================================================
    
function showSuccessMessage(message) {
        createNotification(message, 'success');
    }
    
function showErrorMessage(message) {
        createNotification(message, 'error');
    }
    
function createNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '5px';
        notification.style.color = 'white';
        notification.style.fontWeight = 'bold';
        notification.style.zIndex = '10000';
        notification.style.maxWidth = '300px';
        notification.style.wordWrap = 'break-word';
    
    if (type === 'success') {
            notification.style.backgroundColor = '#27ae60';
    } else {
            notification.style.backgroundColor = '#e74c3c';
        }
        
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    // ============================================================================
    // ANIMATION AND SCROLLING FUNCTIONS
    // ============================================================================
    
    function initializeSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initializeAnimations() {
        // Add animation classes to elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
        const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
        // Observe elements with animation classes
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in, .scale-in');
        animatedElements.forEach(el => observer.observe(el));
    }

    // ============================================================================
    // FORM VALIDATION FUNCTIONS
    // ============================================================================
    
    function initializeFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
                input.addEventListener('blur', () => validateField(input));
                input.addEventListener('input', () => clearFieldError(input));
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
        const fieldName = field.name || field.id;
    
        // Clear previous errors
        clearFieldError(field);
        
        // Required field validation
    if (field.hasAttribute('required') && !value) {
            showFieldError(field, `${fieldName} is required`);
            return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = value.replace(/\D/g, '');
            if (!phoneRegex.test(cleanPhone)) {
                showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
        }
        
        return true;
    }

    // ============================================================================
    // EVENT TRACKING FUNCTIONS
    // ============================================================================
    
    function trackEvent(eventName, eventData = {}) {
        try {
            // Add timestamp and page location
            const eventPayload = {
                ...eventData,
                timestamp: new Date().toISOString(),
                page_location: window.location.href,
                user_agent: navigator.userAgent
            };
            
            console.log('Event tracked:', eventName, eventPayload);
            
            // You can integrate with Google Analytics, Facebook Pixel, etc. here
    if (typeof gtag !== 'undefined') {
                gtag('event', eventName, eventPayload);
    }
    
    if (typeof fbq !== 'undefined') {
                fbq('track', eventName, eventPayload);
            }
            
        } catch (error) {
            console.error('Error tracking event:', error);
        }
    }

    // ============================================================================
    // IMAGE OPTIMIZATION FUNCTIONS
    // ============================================================================
    
function optimizeImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
            // Add loading="lazy" for better performance
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add alt text if missing
            if (!img.hasAttribute('alt')) {
                img.setAttribute('alt', 'Veteran Legacy Life Insurance');
            }
            
            // Add error handling
            img.addEventListener('error', function() {
                this.style.display = 'none';
                console.error('Image failed to load:', this.src);
            });
        });
    }

    // ============================================================================
    // QUOTE SLIDER CLASSES
    // ============================================================================
    
class CoverageSlider {
    constructor() {
            this.slider = document.getElementById('coverage-slider');
            this.quoteDisplay = document.getElementById('coverage-quote');
            this.currentValue = 10000;
                this.init();
    }

    init() {
            if (this.slider) {
        this.setupEventListeners();
        this.updateQuote();
            }
    }

    setupEventListeners() {
            this.slider.addEventListener('input', () => {
                this.currentValue = parseInt(this.slider.value);
            this.updateQuote();
        });

            // Add quote button event listener
            const getQuoteBtn = document.getElementById('get-coverage-quote');
            if (getQuoteBtn) {
                getQuoteBtn.addEventListener('click', () => this.showApplicationModal());
        }
    }

    getQuote() {
            // Final Expense rate calculation
            const baseRate = 0.05; // 5% base rate
            const coverageMultiplier = this.currentValue / 10000;
            return Math.round(this.currentValue * baseRate * coverageMultiplier);
    }

    updateQuote() {
        try {
            if (this.quoteDisplay) {
                const monthlyPremium = this.getQuote();
                console.log('💰 Calculating Coverage quote - Coverage:', this.currentValue, 'Premium:', monthlyPremium);
                
                this.quoteDisplay.innerHTML = `
                    <div class="quote-result">
                        <h3>Your Estimated Monthly Premium</h3>
                        <div class="premium-amount">$${monthlyPremium.toLocaleString()}</div>
                        <p>For $${this.currentValue.toLocaleString()} in coverage</p>
                        <button class="cta-button" onclick="handleCoverageQuoteNow()">Get Your Quote Now</button>
                </div>
            `;
                console.log('✅ Coverage quote display updated successfully');
        } else {
                console.error('❌ Coverage quote display element not found');
            }
        } catch (error) {
            console.error('❌ Error updating coverage quote display:', error);
        }
    }

    showApplicationModal() {
        console.log('🔄 "Get Your Quote Now" clicked - showing application form');
        // Hide the coverage slider modal
        const coverageModal = document.getElementById('coverage-slider-modal');
        if (coverageModal) {
            coverageModal.style.display = 'none';
        }
        // Show the application form
        showNextStepAfterCongrats();
    }

    showSecureQuoteModal() {
            const modal = document.getElementById('secure-quote-modal');
            if (modal) {
                modal.style.display = 'flex';
                this.setupModalCloseListener();
            }
    }

    hideSecureQuoteModal() {
            const modal = document.getElementById('secure-quote-modal');
            if (modal) {
                modal.style.display = 'none';
            }
    }
    
    setupModalCloseListener() {
            const closeBtn = document.querySelector('#secure-quote-modal .close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.hideSecureQuoteModal());
        }
    }
    
    updateSliderValues() {
            if (this.slider) {
                const min = parseInt(this.slider.min);
                const max = parseInt(this.slider.max);
                const value = parseInt(this.slider.value);
                
                // Update display values
                const minDisplay = document.getElementById('coverage-min');
                const maxDisplay = document.getElementById('coverage-max');
                const currentDisplay = document.getElementById('coverage-current');
                
                if (minDisplay) minDisplay.textContent = `$${min.toLocaleString()}`;
                if (maxDisplay) maxDisplay.textContent = `$${max.toLocaleString()}`;
                if (currentDisplay) currentDisplay.textContent = `$${value.toLocaleString()}`;
        }
    }

    async handleFormSubmit() {
            const form = document.getElementById('quote-form');
            if (!form) return;
            
            try {
            const formData = new FormData(form);
                const data = {
                    coverageAmount: this.currentValue,
                    monthlyPremium: this.getQuote(),
                    ...Object.fromEntries(formData)
                };
                
            await submitFormData(data);
                this.showSecureQuoteModal();
            
        } catch (error) {
            console.error('Error submitting quote form:', error);
                showErrorMessage('Error submitting form. Please try again.');
        }
    }

    async handleApplicationSubmit() {
            const form = document.getElementById('application-form');
            if (!form) return;
            
            try {
            const formData = new FormData(form);
                const data = {
                    formType: 'Application',
                    coverageAmount: this.currentValue,
                    monthlyPremium: this.getQuote(),
                    ...Object.fromEntries(formData)
                };
                
            await submitFormData(data);
                showSuccessMessage('Application submitted successfully!');
                
                // Hide modal
                const modal = document.getElementById('application-modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            
        } catch (error) {
                console.error('Error submitting application:', error);
                showErrorMessage('Error submitting application. Please try again.');
            }
        }
    }

class IULQuoteSlider {
    constructor() {
        this.slider = document.getElementById('iul-coverage-slider');
        this.ageSlider = document.getElementById('iul-age-slider');
        this.quoteDisplay = document.getElementById('iul-quote-card');
        this.currentValue = 50000; // Default coverage
        this.userAge = 30; // Default age
        this.userGender = 'male'; // Default gender
    }

    init() {
        try {
            console.log('🔧 Initializing IUL Quote Slider...');
            this.userAge = calculateAgeFromPreviousStep();
            const coverageRange = getCoverageRangeFromPreviousStep();
            this.currentValue = coverageRange.min; // Start at min of the range
            
            if (this.ageSlider) {
                this.ageSlider.value = this.userAge;
                this.ageSlider.disabled = true; // Disable age slider
                this.ageSlider.style.opacity = '0.5'; // Visually indicate disabled
                this.ageSlider.style.pointerEvents = 'none'; // Prevent interaction
                this.ageSlider.setAttribute('readonly', 'readonly'); // Additional protection
                console.log('🔒 Age slider disabled and locked');
            }
            if (this.slider) {
                this.slider.min = coverageRange.min;
                this.slider.max = coverageRange.max;
                this.slider.value = this.currentValue;
                console.log('📊 Coverage slider range set:', coverageRange.min, 'to', coverageRange.max);
            }

        this.setupEventListeners();
        this.updateQuote();
            console.log('✅ IUL Quote Slider initialized successfully with age:', this.userAge, 'coverage range:', coverageRange);
        } catch (error) {
            console.error('❌ Error initializing IUL Quote Slider:', error);
        }
    }

    setupEventListeners() {
        try {
            // Coverage slider (only this one is active)
            if (this.slider) {
                this.slider.addEventListener('input', () => {
                    try {
                        this.currentValue = parseInt(this.slider.value);
                        console.log('📊 Coverage slider changed to:', this.currentValue);
                this.updateQuote();
                    } catch (error) {
                        console.error('❌ Error handling coverage slider change:', error);
        }
            });
            } else {
                console.error('❌ Coverage slider not found');
        }

            // Age slider is disabled and locked - no event listener needed

            // Gender selection (still active)
            const genderInputs = document.querySelectorAll('input[name="gender"]');
        genderInputs.forEach(input => {
            input.addEventListener('change', () => {
                    try {
                        this.userGender = input.value;
                        console.log('📊 Gender changed to:', this.userGender);
                this.updateQuote();
                    } catch (error) {
                        console.error('❌ Error handling gender change:', error);
                    }
            });
        });

            console.log('✅ IUL Quote Slider event listeners set up successfully');
        } catch (error) {
            console.error('❌ Error setting up IUL Quote Slider event listeners:', error);
        }
    }

    updateQuote() {
        try {
            if (this.quoteDisplay) {
                const monthlyPremium = this.getIULQuote();
                console.log('💰 Calculating IUL quote - Age:', this.userAge, 'Gender:', this.userGender, 'Coverage:', this.currentValue, 'Premium:', monthlyPremium);
                
                // Update the main quote display
                this.quoteDisplay.innerHTML = `
                    <div class="quote-result">
                        <div class="premium-amount" style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">$${monthlyPremium.toLocaleString()}</div>
                        <p class="secure-rate-text" style="font-size: 1rem; color: #ffffff; opacity: 0.9; margin-bottom: 1.5rem;">Secure this rate</p>
                        <button class="cta-button" onclick="handleIULQuoteNow()" style="background: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background-color 0.3s ease;">Secure Your Rate</button>
                </div>
            `;
                
                // Update individual display spans
                const ageDisplay = document.getElementById('iul-age-display');
                if (ageDisplay) {
                    ageDisplay.textContent = this.userAge;
                }
                
                const coverageDisplay = document.getElementById('iul-coverage-display');
                if (coverageDisplay) {
                    // Ensure no double dollar signs - only add $ if it's not already there
                    const cleanAmount = this.currentValue.toLocaleString();
                    coverageDisplay.textContent = `$${cleanAmount}`;
                }
                
                console.log('✅ Quote display updated successfully');
        } else {
                console.error('❌ Quote display element not found');
            }
        } catch (error) {
            console.error('❌ Error updating quote display:', error);
        }
    }
        
    getIULQuote() {
        try {
            const age = this.userAge || 30;
            const gender = this.userGender || 'male';
            const coverage = this.currentValue || 50000;
            
            // Get the appropriate gender table
            const genderTable = iulData[gender];
            if (!genderTable) {
                console.error('❌ Invalid gender:', gender);
                return 0;
            }
            
            // Find the appropriate age bracket
            let ageBracket = null;
            const ageBrackets = Object.keys(genderTable);
            
            for (const bracket of ageBrackets) {
                const [minAge, maxAge] = bracket.split('-').map(Number);
                if (age >= minAge && age <= maxAge) {
                    ageBracket = bracket;
                    break;
                }
            }
            
            if (!ageBracket) {
                console.error('❌ Age out of range:', age);
                return 0;
            }
            
            // Get the coverage ranges for this age bracket
            const coverageRanges = genderTable[ageBracket];
            if (!coverageRanges) {
                console.error('❌ No coverage ranges found for age bracket:', ageBracket);
                return 0;
            }
            
            // Find the appropriate coverage range
            let selectedRange = null;
            let selectedPremium = 0;
            
            for (const [range, premium] of Object.entries(coverageRanges)) {
                const [minCoverage, maxCoverage] = range.split('-').map(Number);
                if (coverage >= minCoverage && coverage <= maxCoverage) {
                    selectedRange = range;
                    selectedPremium = premium;
                    break;
                }
            }
            
            if (!selectedRange) {
                console.error('❌ Coverage amount out of range:', coverage);
                return 0;
            }
            
            console.log(`💰 IUL Quote calculated - Age: ${age} (${ageBracket}), Gender: ${gender}, Coverage: ${coverage} (${selectedRange}), Premium: ${selectedPremium}`);
            return selectedPremium;
            
        } catch (error) {
            console.error('❌ Error calculating IUL quote:', error);
            return 0;
        }
    }

    formatNumber(num) {
        try {
            return num.toLocaleString();
        } catch (error) {
            console.error('❌ Error formatting number:', error);
            return num.toString();
        }
    }

    showSecureQuoteModal() {
        try {
            console.log('🔄 "Get Your Quote Now" clicked - showing application form');
            // Hide the IUL quote modal
            const iulModal = document.getElementById('iul-quote-modal');
            if (iulModal) {
                iulModal.style.display = 'none';
                console.log('✅ IUL quote modal hidden');
            } else {
                console.error('❌ IUL quote modal not found');
            }
            // Show the application form
            showNextStepAfterCongrats();
        } catch (error) {
            console.error('❌ Error in showSecureQuoteModal:', error);
        }
    }
        
    hideSecureQuoteModal() {
        try {
            const modal = document.getElementById('iul-secure-quote-modal');
            if (modal) {
                modal.style.display = 'none';
                console.log('✅ IUL secure quote modal hidden');
            } else {
                console.error('❌ IUL secure quote modal not found');
            }
        } catch (error) {
            console.error('❌ Error hiding IUL secure quote modal:', error);
        }
    }
    
    setupModalCloseListener() {
        try {
            const closeBtn = document.querySelector('#iul-secure-quote-modal .close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.hideSecureQuoteModal());
                console.log('✅ IUL modal close listener set up');
            } else {
                console.error('❌ IUL modal close button not found');
            }
        } catch (error) {
            console.error('❌ Error setting up IUL modal close listener:', error);
        }
    }
        
    async handleFormSubmit() {
        try {
            const form = document.getElementById('iul-quote-form');
            if (!form) {
                console.error('❌ IUL quote form not found');
        return;
    }
    
            const formData = new FormData(form);
            const data = {
                formType: 'IULQuote',
                coverageAmount: this.currentValue,
                monthlyPremium: this.getIULQuote(),
                userAge: this.userAge,
                userGender: this.userGender,
                ...Object.fromEntries(formData)
            };
            
            console.log('📤 Submitting IUL quote data:', data);
            await submitFormData(data);
            this.showSecureQuoteModal();
            
        } catch (error) {
            console.error('❌ Error submitting IUL quote form:', error);
            showErrorMessage('Error submitting form. Please try again.');
        }
    }
}

    // ============================================================================
    // MEDICAL FORM FUNCTIONS
    // ============================================================================
    
function initializeHeightWeightDropdowns() {
        // Height dropdown
        const heightInput = document.getElementById('height-input');
    const heightDropdown = document.getElementById('height-dropdown');
        
        if (heightInput && heightDropdown) {
    heightInput.addEventListener('input', () => {
        filterDropdownItems(heightInput, heightDropdown);
            });
            
    heightInput.addEventListener('keydown', (e) => {
        handleDropdownKeydown(e, heightInput, heightDropdown);
    });
    
            // Add click listeners to dropdown items
            const heightItems = heightDropdown.querySelectorAll('.dropdown-item');
            heightItems.forEach(item => {
                item.addEventListener('click', () => {
                    heightInput.value = item.textContent;
                    heightDropdown.style.display = 'none';
                    medicalAnswers.height = item.textContent;
                });
            });
        }
        
        // Weight dropdown
        const weightInput = document.getElementById('weight-input');
        const weightDropdown = document.getElementById('weight-dropdown');
        
        if (weightInput && weightDropdown) {
    weightInput.addEventListener('input', () => {
        filterDropdownItems(weightInput, weightDropdown);
            });
            
    weightInput.addEventListener('keydown', (e) => {
        handleDropdownKeydown(e, weightInput, weightDropdown);
    });
    
            // Add click listeners to dropdown items
            const weightItems = weightDropdown.querySelectorAll('.dropdown-item');
            weightItems.forEach(item => {
                item.addEventListener('click', () => {
                    weightInput.value = item.textContent;
                    weightDropdown.style.display = 'none';
                    medicalAnswers.weight = item.textContent;
                });
            });
        }
}

function filterDropdownItems(input, dropdown) {
    const searchTerm = input.value.toLowerCase();
    const items = dropdown.querySelectorAll('.dropdown-item');
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                item.style.display = 'block';
        } else {
                item.style.display = 'none';
        }
    });
        
        dropdown.style.display = 'block';
}

function handleDropdownKeydown(e, input, dropdown) {
        const items = dropdown.querySelectorAll('.dropdown-item:not([style*="display: none"])');
        const currentIndex = Array.from(items).findIndex(item => item.classList.contains('selected'));
    
        switch (e.key) {
            case 'ArrowDown':
        e.preventDefault();
                const nextIndex = (currentIndex + 1) % items.length;
                items.forEach(item => item.classList.remove('selected'));
                if (items[nextIndex]) {
                    items[nextIndex].classList.add('selected');
                }
                break;
                
            case 'ArrowUp':
        e.preventDefault();
                const prevIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
                items.forEach(item => item.classList.remove('selected'));
                if (items[prevIndex]) {
                    items[prevIndex].classList.add('selected');
                }
                break;
                
            case 'Enter':
                e.preventDefault();
                const selectedItem = dropdown.querySelector('.dropdown-item.selected');
                if (selectedItem) {
                    input.value = selectedItem.textContent;
                    dropdown.style.display = 'none';
                    if (input.id === 'height-input') {
                        medicalAnswers.height = selectedItem.textContent;
                    } else if (input.id === 'weight-input') {
                        medicalAnswers.weight = selectedItem.textContent;
                    }
                }
                break;
                
            case 'Escape':
                dropdown.style.display = 'none';
                break;
        }
    }
    
function initializeMedicalConditionsLogic() {
    const medicalConditionsForm = document.getElementById('funnel-medical-conditions');
    if (!medicalConditionsForm) return;
    
        const checkboxes = medicalConditionsForm.querySelectorAll('input[type="checkbox"]');
        const otherConditionInput = document.getElementById('other-condition');
        const otherConditionCheckbox = document.getElementById('other-condition-checkbox');
        
        // Handle "Other" condition
        if (otherConditionCheckbox && otherConditionInput) {
            otherConditionCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    otherConditionInput.style.display = 'block';
                    otherConditionInput.focus();
                } else {
                    otherConditionInput.style.display = 'none';
                    otherConditionInput.value = '';
                }
            });
            
            // Handle "Other" input
            otherConditionInput.addEventListener('input', function() {
                if (this.value.trim()) {
                    otherConditionCheckbox.checked = true;
                }
            });
        }
        
        // Handle medical condition changes
    function handleMedicalConditionChange() {
            const selectedConditions = [];
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    if (checkbox.id === 'other-condition-checkbox') {
                        const otherValue = otherConditionInput ? otherConditionInput.value.trim() : '';
                        if (otherValue) {
                            selectedConditions.push(otherValue);
                        }
                    } else {
                        selectedConditions.push(checkbox.value);
                    }
                }
            });
            
            medicalAnswers.medicalConditions = selectedConditions;
            console.log('Medical conditions updated:', selectedConditions);
        }
        
        // Add event listeners
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', handleMedicalConditionChange);
        });
        
        if (otherConditionInput) {
            otherConditionInput.addEventListener('input', handleMedicalConditionChange);
        }
    }

    // ============================================================================
    // LOADING SCREEN FUNCTIONS
    // ============================================================================
    
    function initializeLoadScreen() {
        // Initialize load screen functionality
        console.log('Load screen functionality initialized');
    }
    
    function initializeAbandonmentTracking() {
        // Initialize abandonment tracking
        window.currentStep = 0;
        
        function updateCurrentStep(stepNumber) {
            window.currentStep = stepNumber;
            
            // Trigger partial saves at specific checkpoints
            if (stepNumber === 4 || stepNumber === 7 || stepNumber === 10) {
                window.sendPartialFunnelData(stepNumber, 12);
            }
        }
        
        // Browser close detection
        window.addEventListener('beforeunload', function() {
            if (!window.abandonmentEmailSent) {
                window.sendAbandonmentEmail('Browser closed');
            }
        });
        
        // Page visibility change detection (tab switch/minimize)
        document.addEventListener('visibilitychange', function() {
            if (document.hidden && !window.abandonmentEmailSent) {
                window.sendAbandonmentEmail('Page hidden (tab switch/minimize)');
            }
        });
        
        // Inactivity detection (30 seconds)
        let inactivityTimer;
        function resetInactivityTimer() {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                if (!window.abandonmentEmailSent) {
                    window.sendAbandonmentEmail('User inactive for 30 seconds');
                }
            }, 30000); // 30 seconds
        }
        
        // Reset timer on user activity
        document.addEventListener('mousemove', resetInactivityTimer);
        document.addEventListener('keypress', resetInactivityTimer);
        document.addEventListener('click', resetInactivityTimer);
        document.addEventListener('scroll', resetInactivityTimer);
        
        // Initialize timer
        resetInactivityTimer();
        
        // Make updateCurrentStep globally accessible
        window.updateCurrentStep = updateCurrentStep;
    }

    // ============================================================================
    // MEDICAL ANSWERS OBJECT
    // ============================================================================
    
    const medicalAnswers = {
        tobaccoUse: '',
        medicalConditions: [],
        height: '',
        weight: '',
        hospitalCare: '',
        diabetesMedication: ''
    };

    // ============================================================================
    // IUL DATA (RATE TABLES)
    // ============================================================================
    
    const iulData = {
        male: {
            "18-25": {
                "100000-250000": 85,
                "251000-500000": 165,
                "501000-1000000": 325,
                "1001000-2000000": 650,
                "2001000-5000000": 1625
            },
            "26-30": {
                "100000-250000": 95,
                "251000-500000": 185,
                "501000-1000000": 365,
                "1001000-2000000": 730,
                "2001000-5000000": 1825
            },
            "31-35": {
                "100000-250000": 110,
                "251000-500000": 215,
                "501000-1000000": 425,
                "1001000-2000000": 850,
                "2001000-5000000": 2125
            },
            "36-40": {
                "100000-250000": 130,
                "251000-500000": 255,
                "501000-1000000": 505,
                "1001000-2000000": 1010,
                "2001000-5000000": 2525
            },
            "41-45": {
                "100000-250000": 155,
                "251000-500000": 305,
                "501000-1000000": 605,
                "1001000-2000000": 1210,
                "2001000-5000000": 3025
            },
            "46-50": {
                "100000-250000": 185,
                "251000-500000": 365,
                "501000-1000000": 725,
                "1001000-2000000": 1450,
                "2001000-5000000": 3625
            },
            "51-55": {
                "100000-250000": 225,
                "251000-500000": 445,
                "501000-1000000": 885,
                "1001000-2000000": 1770,
                "2001000-5000000": 4425
            },
            "56-60": {
                "100000-250000": 275,
                "251000-500000": 545,
                "501000-1000000": 1085,
                "1001000-2000000": 2170,
                "2001000-5000000": 5425
            }
        },
        female: {
            "18-25": {
                "100000-250000": 75,
                "251000-500000": 145,
                "501000-1000000": 285,
                "1001000-2000000": 570,
                "2001000-5000000": 1425
            },
            "26-30": {
                "100000-250000": 85,
                "251000-500000": 165,
                "501000-1000000": 325,
                "1001000-2000000": 650,
                "2001000-5000000": 1625
            },
            "31-35": {
                "100000-250000": 95,
                "251000-500000": 185,
                "501000-1000000": 365,
                "1001000-2000000": 730,
                "2001000-5000000": 1825
            },
            "36-40": {
                "100000-250000": 110,
                "251000-500000": 215,
                "501000-1000000": 425,
                "1001000-2000000": 850,
                "2001000-5000000": 2125
            },
            "41-45": {
                "100000-250000": 130,
                "251000-500000": 255,
                "501000-1000000": 505,
                "1001000-2000000": 1010,
                "2001000-5000000": 2525
            },
            "46-50": {
                "100000-250000": 155,
                "251000-500000": 305,
                "501000-1000000": 605,
                "1001000-2000000": 1210,
                "2001000-5000000": 3025
            },
            "51-55": {
                "100000-250000": 185,
                "251000-500000": 365,
                "501000-1000000": 725,
                "1001000-2000000": 1450,
                "2001000-5000000": 3625
            },
            "56-60": {
                "100000-250000": 225,
                "251000-500000": 445,
                "501000-1000000": 885,
                "1001000-2000000": 1770,
                "2001000-5000000": 4425
            }
        }
    };

    // Test function to manually show loading modal
    window.testLoadingModal = function() {
        console.log('🧪 Testing loading modal...');
        const loadingModal = document.getElementById('funnel-load-screen-modal');
        if (loadingModal) {
            console.log('Found loading modal:', loadingModal);
            loadingModal.style.display = 'flex';
            loadingModal.style.zIndex = '10000';
            loadingModal.style.position = 'fixed';
            loadingModal.style.top = '0';
            loadingModal.style.left = '0';
            loadingModal.style.width = '100%';
            loadingModal.style.height = '100%';
            loadingModal.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
            loadingModal.style.justifyContent = 'center';
            loadingModal.style.alignItems = 'center';
            
            console.log('Modal styles applied');
            console.log('Modal display:', loadingModal.style.display);
            console.log('Modal z-index:', loadingModal.style.zIndex);
            
            const rect = loadingModal.getBoundingClientRect();
            console.log('Modal bounding rect:', rect);
            console.log('Modal is visible:', rect.width > 0 && rect.height > 0);
            
            // Hide after 3 seconds
            setTimeout(() => {
                loadingModal.style.display = 'none';
                console.log('Test modal hidden');
            }, 3000);
        } else {
            console.error('Loading modal not found for test');
        }
    };

    // Test function to create a modal from scratch
    window.createTestModal = function() {
        console.log('🧪 Creating test modal from scratch...');
        
        // Remove any existing test modal
        const existingTestModal = document.getElementById('test-modal');
        if (existingTestModal) {
            existingTestModal.remove();
        }
        
        // Create modal container
        const modal = document.createElement('div');
        modal.id = 'test-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '99999';
        
        // Create modal content
        const content = document.createElement('div');
        content.style.background = 'white';
        content.style.padding = '2rem';
        content.style.borderRadius = '10px';
        content.style.textAlign = 'center';
        content.style.maxWidth = '400px';
        content.style.width = '90%';
        
        // Add content
        content.innerHTML = `
            <h2 style="color: #333; margin-bottom: 1rem;">Test Modal</h2>
            <p style="color: #666; margin-bottom: 1rem;">This is a test modal created from scratch.</p>
            <div style="width: 50px; height: 50px; border: 4px solid #e2e8f0; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
            <button onclick="document.getElementById('test-modal').remove()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
        `;
        
        // Add to page
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        console.log('Test modal created:', modal);
        console.log('Modal display:', modal.style.display);
        console.log('Modal z-index:', modal.style.zIndex);
        
        const rect = modal.getBoundingClientRect();
        console.log('Modal bounding rect:', rect);
        console.log('Modal is visible:', rect.width > 0 && rect.height > 0);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
                console.log('Test modal removed');
            }
        }, 5000);
    };

    // Initialize medical congratulations button
    initializeMedicalCongratsButton();
    
    // Initialize abandonment tracking
    initializeAbandonmentTracking();

    // Test function to manually show congratulations modal
    window.testCongratsModal = function() {
        console.log('🧪 Testing congratulations modal...');
        showMedicalCongratsModal();
    };

    // Test function to manually show application form
    window.testApplicationForm = function() {
        console.log('🧪 Testing application form display...');
        showNextStepAfterCongrats();
    };

    // Function to initialize application form navigation
    function initializeApplicationFormNavigation() {
        const applicationNextBtn = document.getElementById('application-next-btn');
        if (applicationNextBtn) {
            applicationNextBtn.addEventListener('click', () => {
                console.log('🔄 "Continue to Step 2" button clicked');
                
                // Hide the current application form step
                const currentForm = document.getElementById('funnel-application-form');
                if (currentForm) {
                    currentForm.style.display = 'none';
                }
                
                // Show the final application step
                const finalForm = document.getElementById('funnel-application-final');
                if (finalForm) {
                    finalForm.style.display = 'block';
                    console.log('📝 Application step 2 displayed');
                } else {
                    console.error('❌ Final application form not found');
                }
            });
        } else {
            console.error('❌ Application next button not found');
        }
        
        // Also handle the back button in the final step
        const applicationBackBtn = document.querySelector('#funnel-application-final .funnel-back-btn');
        if (applicationBackBtn) {
            applicationBackBtn.addEventListener('click', () => {
                console.log('⬅️ Going back to application step 1');
                
                // Hide the final step
                const finalForm = document.getElementById('funnel-application-final');
                if (finalForm) {
                    finalForm.style.display = 'none';
                }
                
                // Show the first step
                const firstForm = document.getElementById('funnel-application-form');
                if (firstForm) {
                    firstForm.style.display = 'block';
                }
            });
        }
    }

    // Initialize global application data storage
    window.applicationData = {
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: ''
        },
        beneficiary: {
            name: '',
            relationship: ''
        },
        vaInfo: {
            vaNumber: '',
            serviceConnected: ''
        },
        ssn: '',
        banking: {
            bankName: '',
            routingNumber: '',
            accountNumber: ''
        },
        policyDate: '',
        quoteData: {
            coverageAmount: '',
            monthlyPremium: '',
            userAge: '',
            userGender: '',
            quoteType: ''
        }
    };
    
    // Function to collect application data from forms
    function collectApplicationData() {
        console.log('📝 Collecting application data from forms...');
        
        // Collect address data from application form
        const addressStreet = document.querySelector('input[name="app-street"]')?.value || '';
        const addressCity = document.querySelector('input[name="app-city"]')?.value || '';
        const addressState = document.querySelector('input[name="app-state"]')?.value || '';
        const addressZip = document.querySelector('input[name="app-zip"]')?.value || '';
        
        // Collect beneficiary data
        const beneficiaryName = document.querySelector('input[name="app-beneficiary-name"]')?.value || '';
        const beneficiaryRelationship = document.querySelector('select[name="app-beneficiary-relationship"]')?.value || '';
        
        // Collect VA data
        const vaNumber = document.querySelector('input[name="app-va-number"]')?.value || '';
        const serviceConnected = document.querySelector('select[name="app-service-connected"]')?.value || '';
        
        // Collect financial data
        const ssn = document.querySelector('input[name="app-ssn"]')?.value || '';
        const bankName = document.querySelector('input[name="app-bank-name"]')?.value || '';
        const routingNumber = document.querySelector('input[name="app-routing"]')?.value || '';
        const accountNumber = document.querySelector('input[name="app-account"]')?.value || '';
        const policyDate = document.querySelector('input[name="app-policy-start-date"]')?.value || '';
        
        // Update global application data
        window.applicationData = {
            address: {
                street: addressStreet,
                city: addressCity,
                state: addressState,
                zipCode: addressZip
            },
            beneficiary: {
                name: beneficiaryName,
                relationship: beneficiaryRelationship
            },
            vaInfo: {
                vaNumber: vaNumber,
                serviceConnected: serviceConnected
            },
            ssn: ssn,
            banking: {
                bankName: bankName,
                routingNumber: routingNumber,
                accountNumber: accountNumber
            },
            policyDate: policyDate,
            quoteData: {
                coverageAmount: window.funnelData?.coverageAmount || '',
                monthlyPremium: window.funnelData?.monthlyPremium || '',
                userAge: window.funnelData?.age || '',
                userGender: window.funnelData?.gender || '',
                quoteType: 'IUL'
            }
        };
        
        console.log('📝 Application data collected:', window.applicationData);
        return window.applicationData;
    }
    
    // Initialize application form navigation
    initializeApplicationFormNavigation();
    
    console.log('✅ All additional functionality initialized');

    // Global function to handle application form navigation (for onclick attributes)
    window.handleApplicationNext = function() {
        console.log('🔄 "Continue to Step 2" button clicked via global function');
        console.log('🔍 Looking for application forms...');
        
        // Hide the current application modal
        const currentModal = document.getElementById('application-modal-overlay');
        if (currentModal) {
            currentModal.style.opacity = '0';
            currentModal.style.transform = 'scale(0.9)';
            setTimeout(() => {
                if (currentModal.parentNode) {
                    currentModal.remove();
                }
            }, 300);
        }
        
        // Show the final application step as a new modal
        const finalForm = document.getElementById('funnel-application-final');
        console.log('Final form found:', !!finalForm);
        if (finalForm) {
            // Create a new modal container for the final application step
            const finalModal = document.createElement('div');
            finalModal.id = 'application-final-modal-overlay';
            finalModal.style.position = 'fixed';
            finalModal.style.top = '0';
            finalModal.style.left = '0';
            finalModal.style.width = '100%';
            finalModal.style.height = '100%';
            finalModal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            finalModal.style.display = 'flex';
            finalModal.style.justifyContent = 'center';
            finalModal.style.alignItems = 'center';
            finalModal.style.zIndex = '999999';
            finalModal.style.opacity = '0';
            finalModal.style.transition = 'opacity 0.3s ease-in-out';
            
            // Create content container
            const finalContent = document.createElement('div');
            finalContent.style.background = 'white';
            finalContent.style.padding = '2rem';
            finalContent.style.borderRadius = '15px';
            finalContent.style.maxWidth = '600px';
            finalContent.style.width = '90%';
            finalContent.style.maxHeight = '90vh';
            finalContent.style.overflowY = 'auto';
            finalContent.style.transform = 'scale(0.9)';
            finalContent.style.transition = 'transform 0.3s ease-in-out';
            
            // Clone the final form content
            const formClone = finalForm.cloneNode(true);
            formClone.style.display = 'block';
            formClone.style.border = 'none';
            formClone.style.padding = '0';
            formClone.style.margin = '0';
            
            // Add close button
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '×';
            closeBtn.style.position = 'absolute';
            closeBtn.style.top = '15px';
            closeBtn.style.right = '15px';
            closeBtn.style.background = 'none';
            closeBtn.style.border = 'none';
            closeBtn.style.fontSize = '24px';
            closeBtn.style.color = '#666';
            closeBtn.style.cursor = 'pointer';
            closeBtn.onclick = function() {
                finalModal.style.opacity = '0';
                finalContent.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    if (finalModal.parentNode) {
                        finalModal.remove();
                    }
                }, 300);
            };
            
            finalContent.appendChild(closeBtn);
            finalContent.appendChild(formClone);
            finalModal.appendChild(finalContent);
            document.body.appendChild(finalModal);
            
            // Trigger smooth entrance animation
            setTimeout(() => {
                finalModal.style.opacity = '1';
                finalContent.style.transform = 'scale(1)';
            }, 10);
            
            console.log('📝 Application step 2 displayed as modal');
        } else {
            console.error('❌ Final application form not found');
        }
    };
    
    // Test function to manually test application form navigation
    window.testApplicationNavigation = function() {
        console.log('🧪 Testing application form navigation...');
        const applicationNextBtn = document.getElementById('application-next-btn');
        if (applicationNextBtn) {
            console.log('✅ Application next button found');
            applicationNextBtn.click();
        } else {
            console.error('❌ Application next button not found');
        }
    };

    // Test function to check if the application next button exists and works
    window.testApplicationButton = function() {
        console.log('🧪 Testing application button...');
        
        // Check if button exists in the original form
        const originalBtn = document.getElementById('application-next-btn');
        console.log('Original button found:', !!originalBtn);
        
        // Check if button exists in any cloned forms
        const allButtons = document.querySelectorAll('#application-next-btn');
        console.log('Total application next buttons found:', allButtons.length);
        
        // Try to click the first button found
        if (allButtons.length > 0) {
            console.log('🔄 Clicking first button found...');
            allButtons[0].click();
        } else {
            console.error('❌ No application next buttons found');
        }
    };

    // Test function to verify final application form content
    window.testFinalApplicationForm = function() {
        console.log('🧪 Testing final application form...');
        
        const finalForm = document.getElementById('funnel-application-final');
        if (finalForm) {
            console.log('✅ Final form found');
            console.log('Form content:', finalForm.innerHTML.substring(0, 200) + '...');
            
            // Check for specific fields
            const ssnField = finalForm.querySelector('#app-ssn');
            const bankField = finalForm.querySelector('#app-bank-name');
            const routingField = finalForm.querySelector('#app-routing');
            const accountField = finalForm.querySelector('#app-account');
            
            console.log('SSN field found:', !!ssnField);
            console.log('Bank field found:', !!bankField);
            console.log('Routing field found:', !!routingField);
            console.log('Account field found:', !!accountField);
            
            // Test the modal display
            handleApplicationNext();
        } else {
            console.error('❌ Final application form not found');
        }
    };

    // Global function to handle application form submission
    window.handleApplicationSubmit = function() {
        console.log('🔄 "Submit Application" button clicked');
        console.log('📋 Starting application submission process...');
        
        // Get form data
        const finalForm = document.getElementById('funnel-application-final');
        console.log('🔍 Looking for final application form:', finalForm ? 'Found' : 'NOT FOUND');
        
        if (finalForm) {
            const formData = new FormData(finalForm);
            const applicationData = {
                ssn: formData.get('app-ssn'),
                bankName: formData.get('app-bank-name'),
                routingNumber: formData.get('app-routing'),
                accountNumber: formData.get('app-account'),
                policyStartDate: formData.get('app-policy-start-date')
            };
            
            console.log('📝 Application data collected:', applicationData);
            
            // Validate required fields
            const requiredFields = ['ssn', 'bankName', 'routingNumber', 'accountNumber', 'policyStartDate'];
            let allFieldsValid = true;
            
            for (const field of requiredFields) {
                if (!applicationData[field] || applicationData[field].trim() === '') {
                    console.error(`❌ Missing required field: ${field}`);
                    allFieldsValid = false;
                }
            }
            
            if (!allFieldsValid) {
                console.error('❌ Form validation failed - cannot proceed');
                return;
            }
            
            console.log('✅ Form validation passed');
            
            // Hide the application modal
            const applicationModal = document.getElementById('application-final-modal-overlay');
            console.log('🔍 Looking for application modal to hide:', applicationModal ? 'Found' : 'NOT FOUND');
            
            if (applicationModal) {
                console.log('🎭 Hiding application modal...');
                applicationModal.style.opacity = '0';
                applicationModal.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    if (applicationModal.parentNode) {
                        applicationModal.remove();
                        console.log('✅ Application modal removed from DOM');
                    }
                }, 300);
            } else {
                console.warn('⚠️ Application modal not found - continuing anyway');
            }
            
            // Show comprehensive success modal with quote information
            console.log('⏰ Scheduling final success modal display...');
            setTimeout(() => {
                console.log('🎉 Calling showFinalSuccessModal()...');
                showFinalSuccessModal();
                console.log('✅ showFinalSuccessModal() called successfully');
            }, 350);
            
        } else {
            console.error('❌ Final application form not found');
            console.log('🔍 Available forms on page:');
            const allForms = document.querySelectorAll('form');
            allForms.forEach((form, index) => {
                console.log(`  ${index + 1}. Form ID: ${form.id}, Classes: ${form.className}`);
            });
        }
    };

    // Test function to verify success modal
    window.testSuccessModal = function() {
        console.log('🧪 Testing success modal...');
        showSuccessModal();
        console.log('✅ Success modal should be visible');
    };

    // Test function to verify quote modal appears after application submission
    window.testQuoteModalAfterSubmission = function() {
        console.log('🧪 Testing quote modal after application submission...');
        
        // Simulate application submission
        const testApplicationData = {
            ssn: '123-45-6789',
            bankName: 'Test Bank',
            routingNumber: '123456789',
            accountNumber: '987654321',
            policyStartDate: '2025-08-01'
        };
        
        console.log('📝 Test application data:', testApplicationData);
        
        // Set user age for testing (26 years old)
        window.funnelData.age = 26;
        
        // Show the appropriate quote modal
        const userAge = window.funnelData.age || 26;
        console.log('🎯 User age for quote modal:', userAge);
        
        if (userAge <= 60) {
            // Show IUL quoting tool for ages 60 and below
            const iulModal = document.getElementById('iul-quote-modal');
            if (iulModal) {
                iulModal.style.display = 'flex';
                iulModal.classList.add('active');
                console.log('📊 IUL Quote modal displayed');
            }
        } else {
            // Show final expense quoting tool for ages 61 and above
            const coverageModal = document.getElementById('coverage-slider-modal');
            if (coverageModal) {
                coverageModal.style.display = 'flex';
                coverageModal.classList.add('active');
                console.log('📊 Coverage Slider modal displayed');
            }
        }
    };

    // Global function to handle IUL quote modal and transition to application
    window.handleIULQuoteComplete = function() {
        console.log('🔄 IUL quote completed - transitioning to application form');
        
        // Hide the IUL quote modal
        const iulModal = document.getElementById('iul-quote-modal');
        if (iulModal) {
            iulModal.style.display = 'none';
            iulModal.classList.remove('active');
        }
        
        // Show the application form as a modal
        setTimeout(() => {
            showNextStepAfterCongrats();
            console.log('📝 Application form displayed after IUL quote');
        }, 300);
    };

    // Function to show comprehensive final success modal
    function showFinalSuccessModal() {
        console.log('🎉 === SHOW FINAL SUCCESS MODAL STARTED ===');
        console.log('🔍 Checking window.funnelData:', window.funnelData);
        
        // Get user data for personalized message
        const firstName = window.funnelData?.firstName || 'Michael';
        const estimatedQuote = window.funnelData?.estimatedQuote || '$45-85/month';
        
        console.log('📝 User data extracted:');
        console.log('  - First Name:', firstName);
        console.log('  - Estimated Quote:', estimatedQuote);
        
        // Update the personalized greeting
        const userFirstNameElement = document.getElementById('user-first-name');
        console.log('🔍 Looking for user-first-name element:', userFirstNameElement ? 'Found' : 'NOT FOUND');
        
        if (userFirstNameElement) {
            userFirstNameElement.textContent = firstName;
            console.log('✅ Personalized greeting updated with name:', firstName);
        } else {
            console.error('❌ user-first-name element not found');
        }
        
        // Show estimated quote if available
        const finalQuoteDisplay = document.getElementById('final-quote-display');
        const finalQuoteAmount = document.getElementById('final-quote-amount');
        console.log('🔍 Looking for quote display elements:');
        console.log('  - final-quote-display:', finalQuoteDisplay ? 'Found' : 'NOT FOUND');
        console.log('  - final-quote-amount:', finalQuoteAmount ? 'Found' : 'NOT FOUND');
        
        if (finalQuoteDisplay && finalQuoteAmount && estimatedQuote !== '$45-85/month') {
            finalQuoteAmount.textContent = estimatedQuote;
            finalQuoteDisplay.style.display = 'block';
            console.log('✅ Quote display updated and shown');
        } else {
            console.log('ℹ️ Quote display not shown (using default or elements not found)');
        }
        
        // Show the modal
        const modal = document.getElementById('application-congrats-modal');
        console.log('🔍 Looking for application-congrats-modal:', modal ? 'Found' : 'NOT FOUND');
        
        if (modal) {
            console.log('🎭 Current modal display style:', modal.style.display);
            console.log('🎭 Current modal opacity:', modal.style.opacity);
            console.log('🎭 Current modal z-index:', modal.style.zIndex);
            
            // Force modal to be visible
            modal.style.display = 'flex';
            modal.style.opacity = '1';
            modal.style.zIndex = '999999';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
            
            console.log('🎭 Modal forced to be visible');
            console.log('🎭 New display style:', modal.style.display);
            console.log('🎭 New opacity:', modal.style.opacity);
            console.log('🎭 New z-index:', modal.style.zIndex);
            
            // Double-check visibility after a short delay
            setTimeout(() => {
                const computedStyle = window.getComputedStyle(modal);
                console.log('🎭 Final modal state:');
                console.log('  - Display:', computedStyle.display);
                console.log('  - Opacity:', computedStyle.opacity);
                console.log('  - Visibility:', computedStyle.visibility);
                console.log('  - Z-index:', computedStyle.zIndex);
                console.log('  - Position:', computedStyle.position);
                
                if (computedStyle.display === 'flex' && computedStyle.opacity !== '0') {
                    console.log('✅ Modal should be visible now!');
                } else {
                    console.error('❌ Modal still not visible!');
                }
            }, 100);
            
            console.log('✅ Final success modal display process completed for:', firstName);
        } else {
            console.error('❌ application-congrats-modal not found in DOM');
            console.log('🔍 Available modals on page:');
            const allModals = document.querySelectorAll('[id*="modal"]');
            allModals.forEach((modal, index) => {
                console.log(`  ${index + 1}. Modal ID: ${modal.id}, Display: ${modal.style.display}`);
            });
        }
        
        console.log('🎉 === SHOW FINAL SUCCESS MODAL COMPLETED ===');
    }
    
    // Function to close the final success modal
    window.closeFinalSuccessModal = function() {
        const successModal = document.getElementById('final-success-modal-overlay');
        if (successModal) {
            successModal.style.opacity = '0';
            successModal.style.transform = 'scale(0.9)';
            setTimeout(() => {
                if (successModal.parentNode) {
                    successModal.remove();
                }
            }, 300);
        }
    };

    // Comprehensive test function to verify entire funnel flow
    window.testCompleteFunnelFlow = function() {
        console.log('🧪 Testing complete funnel flow...');
        console.log('📋 PHASE 1: Medical Pre-Qualification (Steps 1-11)');
        console.log('📋 PHASE 2: Full Application (Steps 12-15)');
        
        // Test data
        window.funnelData = {
            age: 26,
            coverageAmount: '25001-50000',
            state: 'FL',
            militaryStatus: 'Veteran/retired',
            branchOfService: 'Marine Corps',
            maritalStatus: 'Married'
        };
        
        console.log('✅ Test data set:', window.funnelData);
        console.log('🎯 Expected flow:');
        console.log('   1. Complete medical funnel (11 steps)');
        console.log('   2. Loading screen → Pre-Qualified message');
        console.log('   3. "Complete Application" → IUL Quote Modal');
        console.log('   4. "Get Your Quote Now" → Application Step 1');
        console.log('   5. "Continue to Step 2" → Application Step 2');
        console.log('   6. "Submit Application" → Final Success Modal');
        
        return 'Complete funnel flow test ready. Run through the actual funnel to test.';
    };

    // Comprehensive functionality test
    window.testAllFunctionality = function() {
        console.log('🧪 Testing all functionality...');
        
        // Test 1: Check if all key functions exist
        const functionsToTest = [
            'openFunnelModal',
            'showLoadingModal', 
            'hideLoadingModal',
            'showMedicalCongratsModal',
            'hideMedicalCongratsModal',
            'showNextStepAfterCongrats',
            'handleApplicationSubmit',
            'handleIULQuoteComplete',
            'showFinalSuccessModal',
            'closeFinalSuccessModal'
        ];
        
        console.log('✅ Testing function availability:');
        functionsToTest.forEach(funcName => {
            if (typeof window[funcName] === 'function') {
                console.log(`   ✅ ${funcName} exists`);
            } else {
                console.log(`   ❌ ${funcName} missing`);
            }
        });
        
        // Test 2: Check if all key elements exist
        const elementsToTest = [
            'funnel-modal',
            'medical-congrats-modal',
            'get-quote-btn',
            'iul-quote-modal',
            'coverage-slider-modal',
            'funnel-application-form',
            'funnel-application-final',
            'application-next-btn',
            'application-submit-btn'
        ];
        
        console.log('✅ Testing element availability:');
        elementsToTest.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                console.log(`   ✅ ${elementId} exists`);
            } else {
                console.log(`   ❌ ${elementId} missing`);
            }
        });
        
        // Test 3: Check if event listeners are properly attached
        console.log('✅ Testing event listeners:');
        
        const getQuoteBtn = document.getElementById('get-quote-btn');
        if (getQuoteBtn) {
            console.log('   ✅ get-quote-btn found');
            // Check if it has click event listeners
            const listeners = getEventListeners ? getEventListeners(getQuoteBtn) : 'Cannot check (DevTools required)';
            console.log('   📊 get-quote-btn event listeners:', listeners);
        } else {
            console.log('   ❌ get-quote-btn not found');
        }
        
        console.log('🎯 All functionality tests completed!');
        return 'Functionality test completed - check console for results';
    };

    // Comprehensive test function to verify the complete flow
    window.testCompleteFlow = function() {
        console.log('🧪 Testing complete flow from medical questions to application...');
        
        // Step 1: Simulate completing medical questions
        console.log('📋 Step 1: Medical questions completed');
        
        // Step 2: Show loading screen
        console.log('⏳ Step 2: Showing loading screen...');
        showLoadingModal();
        
        // Step 3: After loading, show congratulations
        setTimeout(() => {
            console.log('🎉 Step 3: Showing congratulations modal...');
            hideLoadingModal();
            showMedicalCongratsModal();
            
            // Step 4: Simulate clicking "Complete Application"
            setTimeout(() => {
                console.log('🔄 Step 4: Clicking "Complete Application"...');
                const getQuoteBtn = document.getElementById('get-quote-btn');
                if (getQuoteBtn) {
                    getQuoteBtn.click();
                    console.log('✅ "Complete Application" button clicked');
                } else {
                    console.error('❌ "Complete Application" button not found');
                }
                
                // Step 5: Verify quote modal appears
                setTimeout(() => {
                    console.log('📊 Step 5: Checking if quote modal appeared...');
                    const iulModal = document.getElementById('iul-quote-modal');
                    const coverageModal = document.getElementById('coverage-slider-modal');
                    
                    if (iulModal && iulModal.style.display === 'flex') {
                        console.log('✅ IUL Quote modal is visible');
                    } else if (coverageModal && coverageModal.style.display === 'flex') {
                        console.log('✅ Coverage Slider modal is visible');
                    } else {
                        console.error('❌ No quote modal is visible');
                    }
                    
                    // Step 6: Simulate clicking "Get Your Quote Now"
                    setTimeout(() => {
                        console.log('🔄 Step 6: Simulating "Get Your Quote Now" click...');
                        
                        // Find and click the "Get Your Quote Now" button
                        const getQuoteNowBtn = document.querySelector('#iul-quote-modal .cta-button') || 
                                             document.querySelector('#coverage-slider-modal .cta-button');
                        
                        if (getQuoteNowBtn) {
                            getQuoteNowBtn.click();
                            console.log('✅ "Get Your Quote Now" button clicked');
                            
                            // Step 7: Verify application form appears
                            setTimeout(() => {
                                console.log('📝 Step 7: Checking if application form appeared...');
                                const appModal = document.getElementById('application-modal-overlay');
                                if (appModal) {
                                    console.log('✅ Application form modal is visible');
                                } else {
                                    console.error('❌ Application form modal not found');
                                }
                                
                                console.log('🎯 Complete flow test finished!');
                            }, 1000);
                        } else {
                            console.error('❌ "Get Your Quote Now" button not found');
                        }
                    }, 2000);
                }, 1000);
            }, 2000);
        }, 3000);
    };

    // Global function to handle IUL "Get Your Quote Now" button click
    window.handleIULQuoteNow = function() {
        try {
            console.log('🔄 IUL "Get Your Quote Now" button clicked');
            
            // Get the current IUL quote slider instance
            if (window.iulQuoteSlider) {
                window.iulQuoteSlider.showSecureQuoteModal();
            } else {
                console.error('❌ IUL Quote Slider not initialized');
                // Fallback: manually trigger the application form
                showNextStepAfterCongrats();
            }
                        } catch (error) {
            console.error('❌ Error handling IUL quote now button:', error);
            // Fallback: manually trigger the application form
            showNextStepAfterCongrats();
        }
    };

    // Global function to handle Coverage "Get Your Quote Now" button click
    window.handleCoverageQuoteNow = function() {
        try {
            console.log('🔄 Coverage "Get Your Quote Now" button clicked');
            
            // Get the current Coverage slider instance
            if (window.coverageSlider) {
                window.coverageSlider.showApplicationModal();
            } else {
                console.error('❌ Coverage Slider not initialized');
                // Fallback: manually trigger the application form
                showNextStepAfterCongrats();
            }
        } catch (error) {
            console.error('❌ Error handling Coverage quote now button:', error);
            // Fallback: manually trigger the application form
            showNextStepAfterCongrats();
        }
    };

    // Comprehensive test function to verify all buttons and sliders
    window.testAllButtonsAndSliders = function() {
        console.log('🧪 Testing all buttons and sliders...');
        
        // Test 1: Check if all sliders exist and are functional
        console.log('📊 Testing sliders...');
        const sliders = document.querySelectorAll('input[type="range"]');
        sliders.forEach((slider, index) => {
            if (slider) {
                console.log(`   ✅ Slider ${index + 1} found:`, slider.id || slider.name);
                // Test if slider can be changed
                const originalValue = slider.value;
                slider.value = parseInt(slider.value) + 1000;
                slider.dispatchEvent(new Event('input'));
                console.log(`   📊 Slider ${index + 1} value changed from ${originalValue} to ${slider.value}`);
            } else {
                console.log(`   ❌ Slider ${index + 1} not found`);
            }
        });

        // Test 2: Check if all buttons exist and are clickable
        console.log('🔘 Testing buttons...');
        const buttons = document.querySelectorAll('button');
        buttons.forEach((button, index) => {
            if (button) {
                console.log(`   ✅ Button ${index + 1} found:`, button.textContent?.trim() || button.innerHTML?.trim());
                // Test if button is not disabled
                if (!button.disabled) {
                    console.log(`   ✅ Button ${index + 1} is enabled`);
                } else {
                    console.log(`   ⚠️ Button ${index + 1} is disabled`);
                }
            } else {
                console.log(`   ❌ Button ${index + 1} not found`);
            }
        });

        // Test 3: Check if all radio buttons exist
        console.log('📻 Testing radio buttons...');
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        radioButtons.forEach((radio, index) => {
            if (radio) {
                console.log(`   ✅ Radio button ${index + 1} found:`, radio.name, radio.value);
            } else {
                console.log(`   ❌ Radio button ${index + 1} not found`);
            }
        });

        // Test 4: Check if all modals exist
        console.log('🪟 Testing modals...');
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach((modal, index) => {
            if (modal) {
                console.log(`   ✅ Modal ${index + 1} found:`, modal.id);
            } else {
                console.log(`   ❌ Modal ${index + 1} not found`);
            }
        });

        // Test 5: Test IUL Quote Slider specifically
        console.log('📊 Testing IUL Quote Slider...');
        if (window.iulQuoteSlider) {
            console.log('   ✅ IUL Quote Slider instance exists');
            try {
                window.iulQuoteSlider.updateQuote();
                console.log('   ✅ IUL Quote Slider updateQuote() works');
            } catch (error) {
                console.error('   ❌ Error in IUL Quote Slider updateQuote():', error);
            }
        } else {
            console.log('   ❌ IUL Quote Slider instance not found');
        }

        // Test 6: Test Coverage Slider specifically
        console.log('📊 Testing Coverage Slider...');
        if (window.coverageSlider) {
            console.log('   ✅ Coverage Slider instance exists');
            try {
                window.coverageSlider.updateQuote();
                console.log('   ✅ Coverage Slider updateQuote() works');
            } catch (error) {
                console.error('   ❌ Error in Coverage Slider updateQuote():', error);
            }
        } else {
            console.log('   ❌ Coverage Slider instance not found');
        }

        console.log('🎯 All buttons and sliders test completed!');
        return 'Button and slider test completed - check console for results';
    };

    // Test function to verify IUL sliders are working
    window.testIULSliders = function() {
        console.log('🧪 Testing IUL sliders...');
        
        // Test 1: Check if sliders exist
        const coverageSlider = document.getElementById('iul-coverage-slider');
        const ageSlider = document.getElementById('iul-age-slider');
        const quoteDisplay = document.getElementById('iul-quote-card');
        
        console.log('📊 Coverage slider found:', !!coverageSlider);
        console.log('📊 Age slider found:', !!ageSlider);
        console.log('📊 Quote display found:', !!quoteDisplay);
        
        // Test 2: Check if IULQuoteSlider instance exists
        if (window.iulQuoteSlider) {
            console.log('✅ IULQuoteSlider instance exists');
            console.log('📊 Current age:', window.iulQuoteSlider.userAge);
            console.log('📊 Current coverage:', window.iulQuoteSlider.currentValue);
            console.log('📊 Coverage range:', window.iulQuoteSlider.coverageRange);
            
            // Test 3: Simulate slider movement
            if (coverageSlider) {
                const originalValue = coverageSlider.value;
                coverageSlider.value = parseInt(originalValue) + 10000;
                coverageSlider.dispatchEvent(new Event('input'));
                console.log('📊 Coverage slider moved from', originalValue, 'to', coverageSlider.value);
            }
            
            // Test 4: Check if quote updates
            setTimeout(() => {
                const quoteText = quoteDisplay ? quoteDisplay.textContent : '';
                console.log('📊 Quote display content:', quoteText);
                console.log('✅ IUL sliders test completed');
            }, 100);
        } else {
            console.error('❌ IULQuoteSlider instance not found');
        }
    };

    // Comprehensive workflow test function
    window.testCompleteWorkflow = function() {
        console.log('🧪 Testing complete workflow...');
        
        // Test 1: Verify all buttons exist and work
        console.log('🔘 Testing all workflow buttons...');
        const buttonsToTest = [
            { id: 'get-quote-btn', text: 'Complete Application' },
            { id: 'iul-quote-modal .cta-button', text: 'Secure Your Rate' },
            { id: 'application-next-btn', text: 'Continue to Step 2' },
            { id: 'application-submit-btn', text: 'Submit Application' }
        ];
        
        buttonsToTest.forEach(button => {
            const element = document.querySelector(button.id);
            if (element) {
                console.log(`   ✅ ${button.text} button found`);
            } else {
                console.log(`   ❌ ${button.text} button not found`);
            }
        });
        
        // Test 2: Verify IUL quote calculation
        console.log('💰 Testing IUL quote calculation...');
        if (window.iulQuoteSlider) {
            const testQuote = window.iulQuoteSlider.getIULQuote();
            console.log(`   ✅ IUL quote calculated: $${testQuote.toLocaleString()}`);
        } else {
            console.log('   ❌ IUL Quote Slider not initialized');
        }
        
        // Test 3: Verify workflow functions exist
        console.log('🔧 Testing workflow functions...');
        const functionsToTest = [
            'showNextStepAfterCongrats',
            'handleIULQuoteNow',
            'handleApplicationSubmit',
            'showFinalSuccessModal'
        ];
        
        functionsToTest.forEach(funcName => {
            if (typeof window[funcName] === 'function') {
                console.log(`   ✅ ${funcName} function exists`);
            } else {
                console.log(`   ❌ ${funcName} function missing`);
            }
        });
        
        // Test 4: Verify modal transitions
        console.log('🪟 Testing modal transitions...');
        const modalsToTest = [
            'medical-congrats-modal',
            'iul-quote-modal',
            'funnel-application-form',
            'funnel-application-final',
            'application-congrats-modal'
        ];
        
        modalsToTest.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) {
                console.log(`   ✅ ${modalId} modal exists`);
            } else {
                console.log(`   ❌ ${modalId} modal not found`);
            }
        });
        
        console.log('🎯 Complete workflow test finished!');
        console.log('📋 Expected flow:');
        console.log('   1. Medical questions (11 steps)');
        console.log('   2. Loading screen → Pre-Qualified message');
        console.log('   3. "Complete Application" → IUL Quote Modal');
        console.log('   4. IUL modal shows rate + "Secure this rate"');
        console.log('   5. "Secure Your Rate" → Application Step 1');
        console.log('   6. "Continue to Step 2" → Application Step 2');
        console.log('   7. "Submit Application" → Final Success Modal');
        
        return 'Complete workflow test finished - check console for results';
    };

    // Quick test to verify "See If I Qualify" button is working
    window.testSeeIfQualifyButton = function() {
        console.log('🧪 Testing "See If I Qualify" button...');
        
        const seeIfQualifyBtn = document.querySelector('.qualify-button, .cta-button.qualify-button, #see-if-qualify-btn, [data-action="open-funnel"]');
        
        if (seeIfQualifyBtn) {
            console.log('✅ "See If I Qualify" button found');
            console.log('Button text:', seeIfQualifyBtn.textContent.trim());
            console.log('Button classes:', seeIfQualifyBtn.className);
            
            // Test if button is clickable
            if (!seeIfQualifyBtn.disabled) {
                console.log('✅ Button is enabled and clickable');
            } else {
                console.log('❌ Button is disabled');
            }
            
            // Test if event listener is attached
            const events = getEventListeners(seeIfQualifyBtn);
            console.log('Event listeners attached:', events ? Object.keys(events) : 'None');
            
            return 'See If I Qualify button test completed - check console for results';
        } else {
            console.log('❌ "See If I Qualify" button not found');
            
            // Check for alternative buttons
            const allButtons = document.querySelectorAll('button');
            console.log('All buttons found:', allButtons.length);
            allButtons.forEach((btn, index) => {
                const text = btn.textContent.trim();
                if (text.toLowerCase().includes('qualify') || text.toLowerCase().includes('see')) {
                    console.log(`Potential qualify button ${index}:`, text);
                }
            });
            
            return 'See If I Qualify button not found - check console for alternatives';
        }
    };

    // Helper functions for IUL Quote Slider
    function calculateAgeFromPreviousStep() {
        try {
            if (window.funnelData && window.funnelData.contactInfo && window.funnelData.contactInfo.dateOfBirth) {
                const birthDate = new Date(window.funnelData.contactInfo.dateOfBirth);
                        const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                const finalAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
                console.log('📊 Age calculated from birthday:', finalAge);
                return finalAge;
            } else {
                console.log('📊 No birthday data found, using default age 30');
                return 30;
            }
        } catch (error) {
            console.error('❌ Error calculating age from previous step:', error);
            return 30;
        }
    }

    function getCoverageRangeFromPreviousStep() {
        try {
            if (window.funnelData && window.funnelData.coverageAmount) {
                const coverage = window.funnelData.coverageAmount;
                let min, max;
                
                switch(coverage) {
                    case '25000-50000':
                        min = 25000;
                        max = 50000;
                        break;
                    case '50001-100000':
                        min = 50001;
                        max = 100000;
                        break;
                    case '100001-200000':
                        min = 100001;
                        max = 200000;
                        break;
                    case '200001-500000':
                        min = 200001;
                        max = 500000;
                        break;
                    case '500001+':
                        min = 500001;
                        max = 1000000;
                        break;
                    default:
                        min = 25000;
                        max = 100000;
                }
                
                console.log('📊 Coverage range from previous step:', { min, max });
                return { min, max };
            } else {
                console.log('📊 No coverage data found, using default range');
                return { min: 25000, max: 100000 };
            }
        } catch (error) {
            console.error('❌ Error getting coverage range from previous step:', error);
            return { min: 25000, max: 100000 };
        }
    }

    // Test function to manually trigger final success modal
    window.testFinalSuccessModal = function() {
        console.log('🧪 === TESTING FINAL SUCCESS MODAL ===');
        
        // Set test data
        window.funnelData = {
            firstName: 'TestUser',
            estimatedQuote: '$150/month'
        };
        
        console.log('📝 Test data set:', window.funnelData);
        
        // Call the function directly
        showFinalSuccessModal();
        
        return 'Final success modal test initiated - check console for logs';
    };

    // Test function to check if final success modal HTML exists
    window.testModalHTML = function() {
        console.log('🔍 === TESTING MODAL HTML EXISTENCE ===');
        
        const modal = document.getElementById('application-congrats-modal');
        console.log('🔍 application-congrats-modal found:', modal ? 'YES' : 'NO');
        
        if (modal) {
            console.log('📋 Modal properties:');
            console.log('  - ID:', modal.id);
            console.log('  - Classes:', modal.className);
            console.log('  - Display:', modal.style.display);
            console.log('  - Z-index:', modal.style.zIndex);
            console.log('  - Children count:', modal.children.length);
            
            // Check for key elements inside modal
            const userFirstName = document.getElementById('user-first-name');
            const finalQuoteDisplay = document.getElementById('final-quote-display');
            const finalQuoteAmount = document.getElementById('final-quote-amount');
            
            console.log('🔍 Key elements found:');
            console.log('  - user-first-name:', userFirstName ? 'YES' : 'NO');
            console.log('  - final-quote-display:', finalQuoteDisplay ? 'YES' : 'NO');
            console.log('  - final-quote-amount:', finalQuoteAmount ? 'YES' : 'NO');
            
            // Show modal briefly for visual test
            modal.style.display = 'flex';
            modal.style.opacity = '1';
            modal.style.zIndex = '999999';
            
            console.log('👁️ Modal should be visible now for 3 seconds...');
            
            setTimeout(() => {
                modal.style.display = 'none';
                console.log('✅ Modal hidden again');
            }, 3000);
            
        } else {
            console.error('❌ Modal not found in DOM');
            console.log('🔍 Available elements with "modal" in ID:');
            const allElements = document.querySelectorAll('[id*="modal"]');
            allElements.forEach((el, index) => {
                console.log(`  ${index + 1}. ${el.id}`);
            });
        }
        
        return 'Modal HTML test completed - check console for results';
    };

    // Simple test function to check final confirmation modal
    window.testFinalConfirmation = function() {
        console.log('🧪 === TESTING FINAL CONFIRMATION MODAL ===');
        
        // Check if modal HTML exists
        const modal = document.getElementById('application-congrats-modal');
        console.log('🔍 Modal HTML exists:', modal ? 'YES' : 'NO');
        
        if (modal) {
            console.log('📋 Modal properties:');
            console.log('  - ID:', modal.id);
            console.log('  - Classes:', modal.className);
            console.log('  - Current display:', modal.style.display);
            console.log('  - Current z-index:', modal.style.zIndex);
            
            // Check for key elements
            const userFirstName = document.getElementById('user-first-name');
            const finalQuoteDisplay = document.getElementById('final-quote-display');
            const finalQuoteAmount = document.getElementById('final-quote-amount');
            
            console.log('🔍 Key elements:');
            console.log('  - user-first-name:', userFirstName ? 'Found' : 'Missing');
            console.log('  - final-quote-display:', finalQuoteDisplay ? 'Found' : 'Missing');
            console.log('  - final-quote-amount:', finalQuoteAmount ? 'Found' : 'Missing');
            
            // Try to show the modal
            console.log('🎭 Attempting to show modal...');
            modal.style.display = 'flex';
            modal.style.opacity = '1';
            modal.style.zIndex = '999999';
            
            console.log('✅ Modal should now be visible!');
            console.log('🎭 New display style:', modal.style.display);
            console.log('🎭 New opacity:', modal.style.opacity);
            
            // Hide after 5 seconds
            setTimeout(() => {
                modal.style.display = 'none';
                console.log('✅ Modal hidden again');
            }, 5000);
            
        } else {
            console.error('❌ Modal not found!');
            console.log('🔍 Available modals on page:');
            const allModals = document.querySelectorAll('[id*="modal"]');
            allModals.forEach((modal, index) => {
                console.log(`  ${index + 1}. ${modal.id}`);
            });
        }
        
        return 'Final confirmation test completed - check console for results';
    };

    // Test function to simulate complete application submission
    window.testCompleteSubmission = function() {
        console.log('🧪 === TESTING COMPLETE APPLICATION SUBMISSION ===');
        
        // Set test data
        window.funnelData = {
            firstName: 'TestUser',
            lastName: 'TestLast',
            age: 30,
            coverageAmount: '25001-50000',
            estimatedQuote: '$150/month'
        };
        
        console.log('📝 Test data set:', window.funnelData);
        
        // Simulate clicking "Submit Application" button
        console.log('🔄 Simulating "Submit Application" button click...');
        
        // Call the handleApplicationSubmit function directly
        if (typeof window.handleApplicationSubmit === 'function') {
            console.log('✅ handleApplicationSubmit function found, calling it...');
            window.handleApplicationSubmit();
        } else {
            console.error('❌ handleApplicationSubmit function not found!');
        }
        
        return 'Complete submission test initiated - watch console for logs';
    };

});