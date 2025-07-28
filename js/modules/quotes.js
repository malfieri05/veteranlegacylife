/**
 * Quotes module for quote calculations
 */
const QuotesModule = (function() {
    'use strict';
    
    // Private variables
    let isInitialized = false;
    let iulSlider = null;
    let coverageSlider = null;
    
    /**
     * Initialize quote calculations
     */
    function init() {
        if (isInitialized) {
            Config.log('warn', 'Quotes module already initialized');
            return;
        }
        
        Config.log('info', 'Initializing quotes module...');
        
        // Initialize IUL slider
        initializeIULSlider();
        
        // Initialize coverage slider
        initializeCoverageSlider();
        
        isInitialized = true;
        Config.log('info', '✅ Quotes module initialized');
    }
    
    /**
     * Initialize IUL Quote Slider
     */
    function initializeIULSlider() {
        Config.log('info', '🔧 Initializing IUL Quote Slider...');
        
        try {
            const slider = DOMUtils.getElement('iul-coverage-slider');
            const ageSlider = DOMUtils.getElement('iul-age-slider');
            const quoteDisplay = DOMUtils.getElement('iul-quote-card');
            
            if (!slider || !quoteDisplay) {
                Config.log('error', '❌ IUL slider elements not found');
                return;
            }
            
            // Get user data from AppState
            const userAge = calculateAgeFromPreviousStep();
            const coverageRange = getCoverageRangeFromPreviousStep();
            const currentValue = coverageRange.min;
            
            Config.log('info', `📊 Age calculated from birthday: ${userAge}`);
            Config.log('info', `📊 Coverage range from previous step:`, coverageRange);
            
            // Disable age slider
            if (ageSlider) {
                ageSlider.value = userAge;
                ageSlider.disabled = true;
                ageSlider.style.opacity = '0.5';
                ageSlider.style.pointerEvents = 'none';
                ageSlider.setAttribute('readonly', 'readonly');
                Config.log('info', '🔒 Age slider disabled and locked');
            }
            
            // Set up coverage slider
            slider.min = coverageRange.min;
            slider.max = coverageRange.max;
            slider.value = currentValue;
            Config.log('info', `📊 Coverage slider range set: ${coverageRange.min} to ${coverageRange.max}`);
            
            // Set up event listeners
            DOMUtils.addEventListener(slider, 'input', function() {
                try {
                    const newValue = parseInt(slider.value);
                    Config.log('info', `📊 Coverage slider changed to: ${newValue}`);
                    updateIULQuote(newValue, userAge);
                } catch (error) {
                    Config.log('error', `❌ Error handling coverage slider change: ${error.message}`);
                }
            });
            
            // Set up gender selection
            const genderInputs = document.querySelectorAll('input[name="iul-gender"]');
            genderInputs.forEach(input => {
                DOMUtils.addEventListener(input, 'change', function() {
                    try {
                        const gender = input.value;
                        Config.log('info', `📊 Gender changed to: ${gender}`);
                        updateIULQuote(parseInt(slider.value), userAge, gender);
                    } catch (error) {
                        Config.log('error', `❌ Error handling gender change: ${error.message}`);
                    }
                });
            });
            
            // Initial quote update
            updateIULQuote(currentValue, userAge);
            
            Config.log('info', '✅ IUL Quote Slider event listeners set up successfully');
            Config.log('info', `✅ IUL Quote Slider initialized successfully with age: ${userAge} coverage range:`, coverageRange);
            
        } catch (error) {
            Config.log('error', `❌ Error initializing IUL Quote Slider: ${error.message}`);
        }
    }
    
    /**
     * Initialize Coverage Slider
     */
    function initializeCoverageSlider() {
        Config.log('info', '🔧 Initializing Coverage Slider...');
        
        try {
            const slider = DOMUtils.getElement('coverage-slider');
            const quoteDisplay = DOMUtils.getElement('coverage-quote-display');
            
            if (!slider || !quoteDisplay) {
                Config.log('info', 'Coverage slider elements not found (may not be needed)');
                return;
            }
            
            // Set up event listeners
            DOMUtils.addEventListener(slider, 'input', function() {
                try {
                    const newValue = parseInt(slider.value);
                    Config.log('info', `📊 Coverage slider changed to: ${newValue}`);
                    updateCoverageQuote(newValue);
                } catch (error) {
                    Config.log('error', `❌ Error handling coverage slider change: ${error.message}`);
                }
            });
            
            // Initial quote update
            updateCoverageQuote(parseInt(slider.value));
            
            Config.log('info', '✅ Coverage Slider initialized successfully');
            
        } catch (error) {
            Config.log('error', `❌ Error initializing Coverage Slider: ${error.message}`);
        }
    }
    
    /**
     * Update IUL quote display
     */
    function updateIULQuote(coverage, age, gender = 'male') {
        try {
            const quoteDisplay = DOMUtils.getElement('iul-quote-card');
            if (!quoteDisplay) {
                Config.log('error', '❌ Quote display element not found');
                return;
            }
            
            const monthlyPremium = calculateIULQuote(coverage, age, gender);
            Config.log('info', `💰 Calculating IUL quote - Age: ${age} Gender: ${gender} Coverage: ${coverage} Premium: ${monthlyPremium}`);
            
            // Update the main quote display
            const quoteHTML = `
                <div class="quote-result">
                    <div class="premium-amount" style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">$${monthlyPremium.toLocaleString()}</div>
                    <p class="secure-rate-text" style="font-size: 1rem; color: #ffffff; opacity: 0.9; margin-bottom: 1.5rem;">Secure this rate</p>
                    <button class="cta-button" onclick="handleIULQuoteNow()" style="background: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background-color 0.3s ease;">Secure Your Rate</button>
                </div>
            `;
            
            DOMUtils.updateHTML(quoteDisplay, quoteHTML);
            
            // Update individual display spans
            const ageDisplay = DOMUtils.getElement('iul-age-display');
            if (ageDisplay) {
                DOMUtils.updateText(ageDisplay, age.toString());
            }
            
            const coverageDisplay = DOMUtils.getElement('iul-coverage-display');
            if (coverageDisplay) {
                const cleanAmount = coverage.toLocaleString();
                DOMUtils.updateText(coverageDisplay, `$${cleanAmount}`);
            }
            
            Config.log('info', '✅ Quote display updated successfully');
            
        } catch (error) {
            Config.log('error', `❌ Error updating quote display: ${error.message}`);
        }
    }
    
    /**
     * Update coverage quote display
     */
    function updateCoverageQuote(coverage) {
        try {
            const quoteDisplay = DOMUtils.getElement('coverage-quote-display');
            if (!quoteDisplay) {
                Config.log('error', '❌ Coverage quote display element not found');
                return;
            }
            
            const monthlyPremium = calculateCoverageQuote(coverage);
            Config.log('info', `💰 Calculating coverage quote - Coverage: ${coverage} Premium: ${monthlyPremium}`);
            
            // Update the quote display
            const quoteHTML = `
                <div class="quote-result">
                    <div class="premium-amount" style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">$${monthlyPremium.toLocaleString()}</div>
                    <p class="secure-rate-text" style="font-size: 1rem; color: #ffffff; opacity: 0.9; margin-bottom: 1.5rem;">Secure this rate</p>
                    <button class="cta-button" onclick="handleCoverageQuoteNow()" style="background: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background-color 0.3s ease;">Get Your Quote Now</button>
                </div>
            `;
            
            DOMUtils.updateHTML(quoteDisplay, quoteHTML);
            
            Config.log('info', '✅ Coverage quote display updated successfully');
            
        } catch (error) {
            Config.log('error', `❌ Error updating coverage quote display: ${error.message}`);
        }
    }
    
    /**
     * Calculate IUL quote using actual rate tables
     */
    function calculateIULQuote(coverage, age, gender = 'male') {
        try {
            // IUL rate table data - Updated to match React version with lower coverage brackets
            const iulData = {
                male: {
                    "18-25": {
                        "25000-50000": 45,
                        "51000-100000": 65,
                        "100000-250000": 85,
                        "251000-500000": 165,
                        "501000-1000000": 325,
                        "1001000-2000000": 650,
                        "2001000-5000000": 1625
                    },
                    "26-30": {
                        "25000-50000": 55,
                        "51000-100000": 75,
                        "100000-250000": 95,
                        "251000-500000": 185,
                        "501000-1000000": 365,
                        "1001000-2000000": 730,
                        "2001000-5000000": 1825
                    },
                    "31-35": {
                        "25000-50000": 65,
                        "51000-100000": 85,
                        "100000-250000": 110,
                        "251000-500000": 215,
                        "501000-1000000": 425,
                        "1001000-2000000": 850,
                        "2001000-5000000": 2125
                    },
                    "36-40": {
                        "25000-50000": 75,
                        "51000-100000": 95,
                        "100000-250000": 130,
                        "251000-500000": 255,
                        "501000-1000000": 505,
                        "1001000-2000000": 1010,
                        "2001000-5000000": 2525
                    },
                    "41-45": {
                        "25000-50000": 85,
                        "51000-100000": 105,
                        "100000-250000": 155,
                        "251000-500000": 305,
                        "501000-1000000": 605,
                        "1001000-2000000": 1210,
                        "2001000-5000000": 3025
                    },
                    "46-50": {
                        "25000-50000": 95,
                        "51000-100000": 115,
                        "100000-250000": 185,
                        "251000-500000": 365,
                        "501000-1000000": 725,
                        "1001000-2000000": 1450,
                        "2001000-5000000": 3625
                    },
                    "51-55": {
                        "25000-50000": 115,
                        "51000-100000": 135,
                        "100000-250000": 225,
                        "251000-500000": 445,
                        "501000-1000000": 885,
                        "1001000-2000000": 1770,
                        "2001000-5000000": 4425
                    },
                    "56-60": {
                        "25000-50000": 135,
                        "51000-100000": 155,
                        "100000-250000": 275,
                        "251000-500000": 545,
                        "501000-1000000": 1085,
                        "1001000-2000000": 2170,
                        "2001000-5000000": 5425
                    }
                },
                female: {
                    "18-25": {
                        "25000-50000": 35,
                        "51000-100000": 55,
                        "100000-250000": 75,
                        "251000-500000": 145,
                        "501000-1000000": 285,
                        "1001000-2000000": 570,
                        "2001000-5000000": 1425
                    },
                    "26-30": {
                        "25000-50000": 45,
                        "51000-100000": 65,
                        "100000-250000": 85,
                        "251000-500000": 165,
                        "501000-1000000": 325,
                        "1001000-2000000": 650,
                        "2001000-5000000": 1625
                    },
                    "31-35": {
                        "25000-50000": 55,
                        "51000-100000": 75,
                        "100000-250000": 95,
                        "251000-500000": 185,
                        "501000-1000000": 365,
                        "1001000-2000000": 730,
                        "2001000-5000000": 1825
                    },
                    "36-40": {
                        "25000-50000": 65,
                        "51000-100000": 85,
                        "100000-250000": 110,
                        "251000-500000": 215,
                        "501000-1000000": 425,
                        "1001000-2000000": 850,
                        "2001000-5000000": 2125
                    },
                    "41-45": {
                        "25000-50000": 75,
                        "51000-100000": 95,
                        "100000-250000": 130,
                        "251000-500000": 255,
                        "501000-1000000": 505,
                        "1001000-2000000": 1010,
                        "2001000-5000000": 2525
                    },
                    "46-50": {
                        "25000-50000": 85,
                        "51000-100000": 105,
                        "100000-250000": 155,
                        "251000-500000": 305,
                        "501000-1000000": 605,
                        "1001000-2000000": 1210,
                        "2001000-5000000": 3025
                    },
                    "51-55": {
                        "25000-50000": 105,
                        "51000-100000": 125,
                        "100000-250000": 185,
                        "251000-500000": 365,
                        "501000-1000000": 725,
                        "1001000-2000000": 1450,
                        "2001000-5000000": 3625
                    },
                    "56-60": {
                        "25000-50000": 125,
                        "51000-100000": 145,
                        "100000-250000": 225,
                        "251000-500000": 445,
                        "501000-1000000": 885,
                        "1001000-2000000": 1770,
                        "2001000-5000000": 4425
                    }
                }
            };

            Config.log('info', `🔍 calculateIULQuote called with: coverageAmount=${coverage}, age=${age}, gender=${gender}`);
            
            // Get the appropriate gender table
            const genderTable = iulData[gender];
            if (!genderTable) {
                Config.log('error', '❌ Invalid gender:', gender);
                return 0;
            }
            
            Config.log('info', `✅ Gender table found for: ${gender}`);
            
            // Find the appropriate age bracket
            let ageBracket = null;
            const ageBrackets = Object.keys(genderTable);
            Config.log('info', `🔍 Available age brackets: ${ageBrackets.join(', ')}`);
            
            for (const bracket of ageBrackets) {
                const [minAge, maxAge] = bracket.split('-').map(Number);
                Config.log('info', `🔍 Checking bracket ${bracket}: ${minAge}-${maxAge}, age=${age}`);
                if (age >= minAge && age <= maxAge) {
                    ageBracket = bracket;
                    Config.log('info', `✅ Found matching age bracket: ${ageBracket}`);
                    break;
                }
            }
            
            if (!ageBracket) {
                Config.log('error', '❌ Age out of range:', age);
                return 0;
            }
            
            // Get the coverage ranges for this age bracket
            const coverageRanges = genderTable[ageBracket];
            if (!coverageRanges) {
                Config.log('error', '❌ No coverage ranges found for age bracket:', ageBracket);
                return 0;
            }
            
            Config.log('info', `✅ Coverage ranges found for age bracket ${ageBracket}:`, Object.keys(coverageRanges));
            
            // Find the appropriate coverage range and calculate interpolated premium
            let selectedPremium = 0;
            let foundRange = false;
            
            // Sort coverage ranges by minimum coverage for proper interpolation
            const sortedRanges = Object.entries(coverageRanges).sort((a, b) => {
                const aMin = parseInt(a[0].split('-')[0]);
                const bMin = parseInt(b[0].split('-')[0]);
                return aMin - bMin;
            });
            
            for (let i = 0; i < sortedRanges.length; i++) {
                const [range, premium] = sortedRanges[i];
                const [minCoverage, maxCoverage] = range.split('-').map(Number);
                Config.log('info', `🔍 Checking range ${range}: ${minCoverage}-${maxCoverage}, coverageAmount=${coverage}`);
                
                if (coverage >= minCoverage && coverage <= maxCoverage) {
                    // If coverage amount is exactly at the bracket boundaries, use the fixed premium
                    if (coverage === minCoverage || coverage === maxCoverage) {
                        selectedPremium = premium;
                        Config.log('info', `✅ Exact match at boundary - Coverage: ${coverage}, Premium: ${selectedPremium}`);
                    } else {
                        // Interpolate between the current bracket and the next bracket if available
                        let interpolatedPremium = premium;
                        
                        if (i < sortedRanges.length - 1) {
                            const [nextRange, nextPremium] = sortedRanges[i + 1];
                            const [nextMinCoverage] = nextRange.split('-').map(Number);
                            
                            // Calculate interpolation factor
                            const rangeSize = maxCoverage - minCoverage;
                            const positionInRange = coverage - minCoverage;
                            const interpolationFactor = positionInRange / rangeSize;
                            
                            // Interpolate between current and next premium
                            const premiumDifference = nextPremium - premium;
                            interpolatedPremium = Math.round(premium + (premiumDifference * interpolationFactor));
                            
                            Config.log('info', `✅ Interpolated premium - Factor: ${interpolationFactor.toFixed(3)}, Premium: ${interpolatedPremium}`);
                        }
                        
                        selectedPremium = interpolatedPremium;
                    }
                    
                    foundRange = true;
                    break;
                }
            }
            
            if (!foundRange) {
                Config.log('error', '❌ Coverage amount out of range:', coverage);
                Config.log('error', '❌ Available ranges:', Object.keys(coverageRanges));
                return 0;
            }
            
            Config.log('info', `💰 IUL Quote calculated - Age: ${age} (${ageBracket}), Gender: ${gender}, Coverage: ${coverage}, Premium: ${selectedPremium}`);
            return selectedPremium;
            
        } catch (error) {
            Config.log('error', `❌ Error calculating IUL quote: ${error.message}`);
            return 0;
        }
    }
    
    /**
     * Calculate coverage quote
     */
    function calculateCoverageQuote(coverage) {
        try {
            // Simplified calculation for coverage slider
            const baseRate = 0.08; // 8% annual rate
            const monthlyPremium = Math.round(coverage * baseRate / 12);
            
            Config.log('info', `💰 Coverage Quote calculated: ${monthlyPremium}`);
            return monthlyPremium;
            
        } catch (error) {
            Config.log('error', `❌ Error calculating coverage quote: ${error.message}`);
            return 0;
        }
    }
    
    /**
     * Handle IUL quote button click
     */
    function handleIULQuoteNow() {
        Config.log('info', '🔄 handleIULQuoteNow called - proceeding to application form');
        
        try {
            // Hide the IUL quote modal
            const iulModal = DOMUtils.getElement('iul-quote-modal');
            if (iulModal) {
                DOMUtils.hideElement(iulModal);
                Config.log('info', '✅ IUL quote modal hidden');
            }
            
            // Show the application form
            showNextStepAfterCongrats();
            
        } catch (error) {
            Config.log('error', `❌ Error in handleIULQuoteNow: ${error.message}`);
        }
    }
    
    /**
     * Handle coverage quote button click
     */
    function handleCoverageQuoteNow() {
        Config.log('info', '🔄 handleCoverageQuoteNow called - proceeding to application form');
        
        try {
            // Hide the coverage slider modal
            const coverageModal = DOMUtils.getElement('coverage-slider-modal');
            if (coverageModal) {
                DOMUtils.hideElement(coverageModal);
                Config.log('info', '✅ Coverage slider modal hidden');
            }
            
            // Show the application form
            showNextStepAfterCongrats();
            
        } catch (error) {
            Config.log('error', `❌ Error in handleCoverageQuoteNow: ${error.message}`);
        }
    }
    
    /**
     * Show next step after congratulations
     */
    function showNextStepAfterCongrats() {
        Config.log('info', '🔄 Showing application form after quote selection');
        
        try {
            // Hide medical congratulations modal
            const congratsModal = DOMUtils.getElement('medical-congrats-modal');
            if (congratsModal) {
                DOMUtils.hideElement(congratsModal);
                Config.log('info', '✅ Medical congratulations modal hidden');
            }
            
            // Hide all other funnel forms first
            const allFunnelForms = document.querySelectorAll('.funnel-modal form');
            allFunnelForms.forEach(form => {
                form.style.display = 'none';
                Config.log('info', `🔒 Hidden form: ${form.id}`);
            });
            
            // Show application form
            const applicationForm = DOMUtils.getElement('funnel-application-form');
            if (applicationForm) {
                // Force the application form to be visible
                applicationForm.style.display = 'flex';
                applicationForm.style.opacity = '1';
                applicationForm.style.visibility = 'visible';
                applicationForm.style.zIndex = Config.UI.modalZIndex.application;
                
                // Remove any inline styles that might hide it
                applicationForm.style.position = '';
                applicationForm.style.top = '';
                applicationForm.style.left = '';
                applicationForm.style.width = '';
                applicationForm.style.height = '';
                applicationForm.style.backgroundColor = '';
                
                Config.log('info', '✅ Application form displayed with forced visibility');
                Config.log('info', `📊 Application form display: ${applicationForm.style.display}`);
                Config.log('info', `📊 Application form opacity: ${applicationForm.style.opacity}`);
                Config.log('info', `📊 Application form z-index: ${applicationForm.style.zIndex}`);
                
                // Check what other forms are visible
                const visibleForms = document.querySelectorAll('.funnel-modal form[style*="display: flex"], .funnel-modal form[style*="display:flex"]');
                Config.log('info', `🔍 Currently visible forms: ${visibleForms.length}`);
                visibleForms.forEach((form, index) => {
                    Config.log('info', `  ${index + 1}. Visible form: ${form.id}`);
                });
                
                // Double-check visibility after a short delay
                setTimeout(() => {
                    const computedStyle = window.getComputedStyle(applicationForm);
                    Config.log('info', '🎭 Final application form state:');
                    Config.log('info', `  - Display: ${computedStyle.display}`);
                    Config.log('info', `  - Opacity: ${computedStyle.opacity}`);
                    Config.log('info', `  - Visibility: ${computedStyle.visibility}`);
                    Config.log('info', `  - Z-index: ${computedStyle.zIndex}`);
                    
                    if (computedStyle.display === 'flex' && computedStyle.opacity !== '0') {
                        Config.log('info', '✅ Application form should be visible now!');
                    } else {
                        Config.log('error', '❌ Application form still not visible!');
                    }
                }, 100);
                
            } else {
                Config.log('error', '❌ Application form element not found');
                Config.log('info', '🔍 Available forms on page:');
                const allForms = document.querySelectorAll('[id*="application"], [id*="form"]');
                allForms.forEach((form, index) => {
                    Config.log('info', `  ${index + 1}. Form ID: ${form.id}, Display: ${form.style.display}`);
                });
            }
            
        } catch (error) {
            Config.log('error', `❌ Error showing next step: ${error.message}`);
        }
    }
    
    /**
     * Calculate age from previous step
     */
    function calculateAgeFromPreviousStep() {
        try {
            const contactInfo = AppState.funnel.data.contactInfo || {};
            const dateOfBirth = contactInfo.dateOfBirth;
            
            if (!dateOfBirth) {
                Config.log('warn', 'No date of birth found, using default age');
                return 30;
            }
            
            const birthDate = new Date(dateOfBirth);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            let calculatedAge = age;
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                calculatedAge--;
            }
            
            return calculatedAge;
            
        } catch (error) {
            Config.log('error', `❌ Error calculating age: ${error.message}`);
            return 30;
        }
    }
    
    /**
     * Get coverage range from previous step
     */
    function getCoverageRangeFromPreviousStep() {
        try {
            const coverageAmount = AppState.funnel.data.coverageAmount;
            
            // Default ranges based on coverage amount
            const ranges = {
                '25000': { min: 25000, max: 100000 },
                '50000': { min: 50000, max: 150000 },
                '100000': { min: 100000, max: 250000 },
                '250000': { min: 250000, max: 500000 },
                '500000': { min: 500000, max: 1000000 }
            };
            
            const range = ranges[coverageAmount] || { min: 25000, max: 100000 };
            Config.log('info', `📊 Coverage range for ${coverageAmount}: ${range.min} to ${range.max}`);
            
            return range;
            
        } catch (error) {
            Config.log('error', `❌ Error getting coverage range: ${error.message}`);
            return { min: 25000, max: 100000 };
        }
    }
    
    // Public API
    return {
        init,
        handleIULQuoteNow,
        handleCoverageQuoteNow,
        updateIULQuote,
        updateCoverageQuote,
        calculateIULQuote,
        calculateCoverageQuote,
        showNextStepAfterCongrats
    };
})(); 