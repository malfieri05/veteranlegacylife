// Veteran Legacy Life - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeFormHandling();
    initializeSmoothScrolling();
    initializeAnimations();
    initializePhoneNumberFormatting();
    initializeFormValidation();
    
    // Initialize quote sliders
    let coverageSlider = null;
    let iulQuoteSlider = null;
    let userAge = null; // Store user's age globally
    
    // Add global event listener for "Get Your Quote Now" button
    const getQuoteBtn = document.getElementById('get-quote-btn');
    if (getQuoteBtn) {
        getQuoteBtn.addEventListener('click', function() {
            // Check if we have age data
            if (userAge !== null) {
                // Route based on age
                if (userAge <= 60) {
                    // Show IUL quoting tool for ages 60 and below
                    document.getElementById('iul-quote-modal').style.display = 'flex';
                    document.getElementById('iul-quote-modal').classList.add('active');
                    // Initialize the IUL quote slider if not already done
                    if (!window.iulQuoteSlider) {
                        window.iulQuoteSlider = new IULQuoteSlider();
                    }
                } else {
                    // Show final expense quoting tool for ages 61 and above
                    document.getElementById('coverage-slider-modal').style.display = 'flex';
                    document.getElementById('coverage-slider-modal').classList.add('active');
                    // Initialize the coverage slider
                    if (!window.coverageSlider) {
                        window.coverageSlider = new CoverageSlider();
                    }
                }
            } else {
                // Default to final expense if no age data
                document.getElementById('coverage-slider-modal').style.display = 'flex';
                document.getElementById('coverage-slider-modal').classList.add('active');
                // Initialize the coverage slider
                if (!window.coverageSlider) {
                    window.coverageSlider = new CoverageSlider();
                }
            }
        });
    }

    // Funnel state management
    let funnelData = {};
    const funnelSteps = [
        'funnel-state-form',
        'funnel-military-form',
        'funnel-branch-form',
        'funnel-marital-form',
        'funnel-coverage-form',
        'funnel-contact-form',
        'funnel-medical-tobacco',
        'funnel-medical-conditions',
        'funnel-medical-hospital',
        'funnel-medical-diabetes',
        'funnel-quote-tool'
    ];

    // Function to accumulate funnel data
    function accumulateFunnelData(stepName, stepData) {
        funnelData[stepName] = stepData;
        console.log(`Data accumulated for step ${stepName}:`, funnelData);
    }

    // Function to send complete funnel data to Google Sheets
    async function sendCompleteFunnelData() {
        try {
            // Calculate age from date of birth if available
            let calculatedAge = null;
            if (funnelData.contactInfo?.dateOfBirth) {
                const today = new Date();
                const birthDate = new Date(funnelData.contactInfo.dateOfBirth);
                const age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                calculatedAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
            }
            
            // Flatten the data structure to match the original working format
            const completeData = {
                // Contact info (flattened)
                firstName: funnelData.contactInfo?.firstName || '',
                lastName: funnelData.contactInfo?.lastName || '',
                phone: funnelData.contactInfo?.phone || '',
                email: funnelData.contactInfo?.email || '',
                dateOfBirth: funnelData.contactInfo?.dateOfBirth || '',
                age: calculatedAge || userAge || '',
                transactionalConsent: funnelData.contactInfo?.transactionalConsent || false,
                marketingConsent: funnelData.contactInfo?.marketingConsent || false,
                
                // Funnel data
                state: funnelData.state || '',
                militaryStatus: funnelData.militaryStatus || '',
                branchOfService: funnelData.branchOfService || '',
                maritalStatus: funnelData.maritalStatus || '',
                coverageAmount: funnelData.coverageAmount || '',
                
                // Medical answers (flattened)
                tobaccoUse: medicalAnswers.tobaccoUse || '',
                medicalConditions: medicalAnswers.medicalConditions || [],
                height: medicalAnswers.height || '',
                weight: medicalAnswers.weight || '',
                hospitalCare: medicalAnswers.hospitalCare || '',
                diabetesMedication: medicalAnswers.diabetesMedication || '',
                
                // Form type and progress
                formType: 'Funnel',
                funnelProgress: 'Complete',
                timestamp: new Date().toISOString()
            };
            
                    console.log('🚨 SENDING COMPLETE FUNNEL DATA 🚨');
        console.log('Sending complete funnel data:', completeData);
        console.log('Funnel data object:', funnelData);
        console.log('Medical answers object:', medicalAnswers);
        
        // Use the same submitFormData function
        console.log('🚨 CALLING submitFormData 🚨');
        await submitFormData(completeData);
            
            console.log('Complete funnel data sent successfully');
            
            // Show success message to user
            alert('Thank you! Your information has been submitted successfully. We will contact you within 24 hours.');
            
        } catch (error) {
            console.error('Error sending complete funnel data:', error);
            alert('There was an error submitting your information. Please try again.');
        }
    }

    // Funnel modal logic
    const funnelModal = document.getElementById('funnel-modal');
    const ctaButtons = document.querySelectorAll('.cta-button.primary, .qualify-button');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!this.closest('form')) {  // Only trigger if not a form submit button
                e.preventDefault();
                openFunnelModal();
            }
        });
    });

    function openFunnelModal() {
        funnelModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        // Hide progress tracker for regular funnel
        const tracker = document.querySelector('.funnel-progress-tracker');
        if (tracker) tracker.style.display = 'none';
        resetFunnel();
    }

    function resetFunnel() {
        funnelData = {};
        document.querySelectorAll('#funnel-modal form').forEach(form => {
            form.style.display = 'none';
            form.reset();
        });
        document.getElementById('funnel-state-form').style.display = 'block';
    }

    function goToNextStep(currentStepId) {
        const currentIndex = funnelSteps.indexOf(currentStepId);
        if (currentIndex < funnelSteps.length - 1) {
            document.getElementById(currentStepId).style.display = 'none';
            document.getElementById(funnelSteps[currentIndex + 1]).style.display = 'block';
        }
    }

    // State selection
    document.getElementById('funnel-state-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const stateSelect = document.getElementById('funnel-state-select');
        if (stateSelect.value) {
            funnelData.state = stateSelect.value;
            
            // Accumulate data
            accumulateFunnelData('state', stateSelect.value);
            
            goToNextStep('funnel-state-form');
        }
    });

    // Military status selection
    const militaryInputs = document.querySelectorAll('#funnel-military-form input[name="militaryStatus"]');
    militaryInputs.forEach(input => {
        input.addEventListener('click', () => {
            funnelData.militaryStatus = input.value;
            
            // Accumulate data
            accumulateFunnelData('militaryStatus', input.value);
            
            setTimeout(() => goToNextStep('funnel-military-form'), 300);
        });
    });

    // Branch selection
    const branchInputs = document.querySelectorAll('#funnel-branch-form input[name="branchOfService"]');
    branchInputs.forEach(input => {
        input.addEventListener('click', () => {
            funnelData.branchOfService = input.value;
            
            // Accumulate data
            accumulateFunnelData('branchOfService', input.value);
            
            setTimeout(() => goToNextStep('funnel-branch-form'), 300);
        });
    });

    // Marital status selection
    const maritalInputs = document.querySelectorAll('#funnel-marital-form input[name="maritalStatus"]');
    maritalInputs.forEach(input => {
        input.addEventListener('click', () => {
            funnelData.maritalStatus = input.value;
            
            // Accumulate data
            accumulateFunnelData('maritalStatus', input.value);
            
            setTimeout(() => goToNextStep('funnel-marital-form'), 300);
        });
    });

    // Coverage amount selection
    const coverageInputs = document.querySelectorAll('#funnel-coverage-form input[name="coverageAmount"]');
    coverageInputs.forEach(input => {
        input.addEventListener('click', () => {
            funnelData.coverageAmount = input.value;
            
            // Accumulate data
            accumulateFunnelData('coverageAmount', input.value);
            
            setTimeout(() => goToNextStep('funnel-coverage-form'), 300);
        });
    });

    // Contact form submission - send to Google Sheets via webhook
    document.getElementById('funnel-contact-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'phone', 'dateOfBirth', 'email'];
        let isValid = true;
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                clearFieldError(field);
            }
        });

        // Validate consent checkbox
        const transactionalConsent = document.querySelector('input[name="transactionalConsent"]');
        if (!transactionalConsent.checked) {
            showFieldError(transactionalConsent.parentElement, 'You must agree to receive transactional messages');
            isValid = false;
        }

        if (!isValid) return;

        // --- Visual Feedback on Click ---
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.classList.add('is-loading');
        submitBtn.innerHTML = `<span>Submitting</span><div class="spinner"></div>`;
        // --- End Visual Feedback ---

        // Collect form data and combine with accumulated funnel data
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            phone: document.getElementById('phone').value,
            dateOfBirth: document.getElementById('dateOfBirth').value,
            email: document.getElementById('email').value,
            state: funnelData.state || '',
            militaryStatus: funnelData.militaryStatus || '',
            branchOfService: funnelData.branchOfService || '',
            maritalStatus: funnelData.maritalStatus || '',
            coverageAmount: funnelData.coverageAmount || '',
            transactionalConsent: transactionalConsent.checked,
            marketingConsent: document.querySelector('input[name="marketingConsent"]').checked,
            timestamp: new Date().toISOString()
        };

        try {
            // Accumulate contact form data
            accumulateFunnelData('contactInfo', formData);

            // With 'no-cors', we can't check the response. We optimistically assume success.
            
                    // Calculate age from date of birth
        const dateOfBirth = document.getElementById('dateOfBirth').value;
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
        
        // Store age globally
        userAge = actualAge;
        
        // Store contact form data and proceed to medical questions
        funnelData.contactInfo = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            phone: document.getElementById('phone').value,
            dateOfBirth: document.getElementById('dateOfBirth').value,
            email: document.getElementById('email').value,
            age: actualAge,
            transactionalConsent: transactionalConsent.checked,
            marketingConsent: document.querySelector('input[name="marketingConsent"]').checked
        };
            
            // Go to first medical question (tobacco)
            document.getElementById('funnel-contact-form').style.display = 'none';
            document.getElementById('funnel-medical-tobacco').style.display = 'block';
            // Hide progress tracker for regular funnel flow
            const tracker = document.querySelector('.funnel-progress-tracker');
            if (tracker) tracker.style.display = 'none';
            setMedicalProgress(1, 4);
            this.reset();
            
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error submitting your information. Please try again.');
            
            // --- Re-enable button on error ---
            submitBtn.disabled = false;
            submitBtn.classList.remove('is-loading');
            submitBtn.innerHTML = originalBtnText;
        }
    });

    // Medical funnel state
    let medicalAnswers = {};

    function setMedicalProgress(step, total) {
      const tracker = document.querySelector('.funnel-progress-tracker');
      if (tracker) tracker.textContent = `${step}/${total}`;
    }

    // Medical Tobacco step
    document.getElementById('medical-tobacco-next').addEventListener('click', async function() {
        const selected = document.querySelector('input[name="tobaccoUse"]:checked');
        if (!selected) {
            showFieldError(document.querySelector('input[name="tobaccoUse"]'), 'Please select an option');
            return;
        } else {
            clearFieldError(document.querySelector('input[name="tobaccoUse"]'));
        }
        medicalAnswers.tobaccoUse = selected.value;
        
        // Accumulate medical data
        accumulateFunnelData('medicalAnswers', medicalAnswers);
        
        document.getElementById('funnel-medical-tobacco').style.display = 'none';
        document.getElementById('funnel-medical-conditions').style.display = 'block';
        setMedicalProgress(2, 5);
        // Initialize the medical conditions logic when form is shown
        initializeMedicalConditionsLogic();
    });

    // Medical Conditions step
    document.getElementById('medical-conditions-next').addEventListener('click', async function() {
        const checked = Array.from(document.querySelectorAll('input[name="medicalConditions"]:checked'));
        if (checked.length === 0) {
            showFieldError(document.querySelector('input[name="medicalConditions"]'), 'Please select at least one');
            return;
        } else {
            clearFieldError(document.querySelector('input[name="medicalConditions"]'));
        }
        medicalAnswers.medicalConditions = checked.map(cb => cb.value);
        
        // Accumulate medical data
        accumulateFunnelData('medicalAnswers', medicalAnswers);
        
        document.getElementById('funnel-medical-conditions').style.display = 'none';
        document.getElementById('funnel-medical-height-weight').style.display = 'block';
        setMedicalProgress(3, 5);
        // Initialize dropdowns when height/weight form is shown
        initializeHeightWeightDropdowns();
    });

    // Medical Height/Weight step
    document.getElementById('medical-height-weight-next').addEventListener('click', async function() {
        const height = document.getElementById('height').value.trim();
        const weight = document.getElementById('weight').value.trim();
        
        // Get valid dropdown options
        const heightDropdown = document.getElementById('height-dropdown');
        const weightDropdown = document.getElementById('weight-dropdown');
        const validHeightOptions = Array.from(heightDropdown.querySelectorAll('.dropdown-item')).map(item => item.getAttribute('data-value'));
        const validWeightOptions = Array.from(weightDropdown.querySelectorAll('.dropdown-item')).map(item => item.getAttribute('data-value'));
        
        // Also get display text options for more flexible validation
        const validHeightDisplayOptions = Array.from(heightDropdown.querySelectorAll('.dropdown-item')).map(item => item.textContent.trim());
        const validWeightDisplayOptions = Array.from(weightDropdown.querySelectorAll('.dropdown-item')).map(item => item.textContent.trim());
        
        let hasError = false;
        
        if (!height || !weight) {
            showFieldError(document.querySelector('#funnel-medical-height-weight input'), 'Please fill in both height and weight');
            return;
        }
        
        // Check if height is a valid option (check both data-value and display text)
        if (!validHeightOptions.includes(height) && !validHeightDisplayOptions.includes(height)) {
            console.log('Height validation failed:', { height, validHeightOptions, validHeightDisplayOptions });
            showFieldError(document.getElementById('height'), 'Please select a valid height from the dropdown');
            hasError = true;
        }
        
        // Check if weight is a valid option (check both data-value and display text)
        if (!validWeightOptions.includes(weight) && !validWeightDisplayOptions.includes(weight)) {
            console.log('Weight validation failed:', { weight, validWeightOptions, validWeightDisplayOptions });
            showFieldError(document.getElementById('weight'), 'Please select a valid weight from the dropdown');
            hasError = true;
        }
        
        if (hasError) {
            return;
        }
        
        // Clear any existing errors
        clearFieldError(document.getElementById('height'));
        clearFieldError(document.getElementById('weight'));
        
        medicalAnswers.height = height;
        medicalAnswers.weight = weight;
        
        // Accumulate medical data
        accumulateFunnelData('medicalAnswers', medicalAnswers);
        
        document.getElementById('funnel-medical-height-weight').style.display = 'none';
        document.getElementById('funnel-medical-hospital').style.display = 'block';
        setMedicalProgress(4, 5);
    });

    // Medical Hospital step
    document.getElementById('medical-hospital-next').addEventListener('click', async function() {
        const selected = document.querySelector('input[name="hospitalCare"]:checked');
        if (!selected) {
            showFieldError(document.querySelector('input[name="hospitalCare"]'), 'Please select an option');
            return;
        } else {
            clearFieldError(document.querySelector('input[name="hospitalCare"]'));
        }
        medicalAnswers.hospitalCare = selected.value;
        
        // Accumulate medical data
        accumulateFunnelData('medicalAnswers', medicalAnswers);
        
        document.getElementById('funnel-medical-hospital').style.display = 'none';
        document.getElementById('funnel-medical-diabetes').style.display = 'block';
        setMedicalProgress(5, 5);
    });

    // Medical Diabetes step (final submit) - Handle form submission
    document.getElementById('funnel-medical-diabetes').addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('🚨 MEDICAL SUBMISSION TRIGGERED 🚨');
        console.log('Event:', e);
        
        const selected = document.querySelector('input[name="diabetesMedication"]:checked');
        if (!selected) {
            showFieldError(document.querySelector('input[name="diabetesMedication"]'), 'Please select an option');
            return;
        } else {
            clearFieldError(document.querySelector('input[name="diabetesMedication"]'));
        }
        
        medicalAnswers.diabetesMedication = selected.value;
        console.log('Medical answers:', medicalAnswers);
        console.log('User age:', userAge);
        
        // Combine all funnel data
        const completeFormData = {
            ...funnelData,
            ...funnelData.contactInfo,
            ...medicalAnswers,
            timestamp: new Date().toISOString()
        };
        
        console.log('Complete form data:', completeFormData);
        console.log('🚨 ABOUT TO SEND FUNNEL DATA 🚨');
        
        // Send complete funnel data to Google Sheets (email sent automatically)
        await sendCompleteFunnelData();
        
        // Show loading screen
        const funnelModal = document.getElementById('funnel-modal');
        const processingModal = document.getElementById('medical-processing-modal');
        
        console.log('Funnel modal:', funnelModal);
        console.log('Processing modal:', processingModal);
        
        if (funnelModal) funnelModal.style.display = 'none';
        if (processingModal) {
            processingModal.style.display = 'flex';
            processingModal.style.zIndex = '9999';
        }
        
        // Simulate processing time
        setTimeout(() => {
            console.log('Processing timeout completed');
            
            // Hide loading screen
            if (processingModal) {
                processingModal.style.display = 'none';
            }
            
            // Show congratulations modal
            const congratsModal = document.getElementById('medical-congrats-modal');
            console.log('Congratulations modal:', congratsModal);
            
            if (congratsModal) {
                congratsModal.style.display = 'flex';
                congratsModal.style.zIndex = '9999';
                congratsModal.style.opacity = '1';
            }
            
            // Remove any existing event listeners to prevent duplication
            const getQuoteBtn = document.getElementById('get-quote-btn');
            if (getQuoteBtn) {
                const newGetQuoteBtn = getQuoteBtn.cloneNode(true);
                getQuoteBtn.parentNode.replaceChild(newGetQuoteBtn, getQuoteBtn);
                
                // Add event listener for the "Complete Application" button
                newGetQuoteBtn.addEventListener('click', function() {
                    console.log('Complete Application button clicked');
                    if (congratsModal) congratsModal.style.display = 'none';
                    
                    // Proceed to quote tool based on age
                    if (userAge !== null) {
                        console.log('Routing based on age:', userAge);
                        // Route based on age
                        if (userAge <= 60) {
                            // Show IUL quoting tool for ages 60 and below
                            document.getElementById('iul-quote-modal').style.display = 'flex';
                            document.getElementById('iul-quote-modal').classList.add('active');
                            // Initialize the IUL quote slider if not already done
                            if (!window.iulQuoteSlider) {
                                window.iulQuoteSlider = new IULQuoteSlider();
                            }
                        } else {
                            // Show final expense quoting tool for ages 61 and above
                            document.getElementById('coverage-slider-modal').style.display = 'flex';
                            document.getElementById('coverage-slider-modal').classList.add('active');
                            // Initialize the coverage slider if not already done
                            if (!window.coverageSlider) {
                                window.coverageSlider = new CoverageSlider();
                            }
                        }
                    } else {
                        console.log('No age data, defaulting to final expense');
                        // Default to final expense if no age data
                        document.getElementById('coverage-slider-modal').style.display = 'flex';
                        document.getElementById('coverage-slider-modal').classList.add('active');
                        if (!window.coverageSlider) {
                            window.coverageSlider = new CoverageSlider();
                        }
                    }
                });
            }
        }, 2000); // 2 second loading time
    });

    // Also handle the "See Results!" button click
    document.getElementById('medical-submit').addEventListener('click', function(e) {
        e.preventDefault();
        console.log('See Results button clicked');
        
        // Trigger the same logic as form submission
        const selected = document.querySelector('input[name="diabetesMedication"]:checked');
        if (!selected) {
            showFieldError(document.querySelector('input[name="diabetesMedication"]'), 'Please select an option');
            return;
        } else {
            clearFieldError(document.querySelector('input[name="diabetesMedication"]'));
        }
        
        medicalAnswers.diabetesMedication = selected.value;
        console.log('Medical answers:', medicalAnswers);
        console.log('User age:', userAge);
        
        // Combine all funnel data
        const completeFormData = {
            ...funnelData,
            ...funnelData.contactInfo,
            ...medicalAnswers,
            timestamp: new Date().toISOString()
        };
        
        console.log('Complete form data:', completeFormData);
        
        // Show loading screen
        const funnelModal = document.getElementById('funnel-modal');
        const processingModal = document.getElementById('medical-processing-modal');
        
        console.log('Funnel modal:', funnelModal);
        console.log('Processing modal:', processingModal);
        
        if (funnelModal) funnelModal.style.display = 'none';
        if (processingModal) {
            processingModal.style.display = 'flex';
            processingModal.style.zIndex = '9999';
        }
        
        // Simulate processing time
        setTimeout(() => {
            console.log('Processing timeout completed');
            
            // Hide loading screen
            if (processingModal) {
                processingModal.style.display = 'none';
            }
            
            // Show congratulations modal
            const congratsModal = document.getElementById('medical-congrats-modal');
            console.log('Congratulations modal:', congratsModal);
            
            if (congratsModal) {
                congratsModal.style.display = 'flex';
                congratsModal.style.zIndex = '9999';
                congratsModal.style.opacity = '1';
            }
            
            // Remove any existing event listeners to prevent duplication
            const getQuoteBtn = document.getElementById('get-quote-btn');
            if (getQuoteBtn) {
                const newGetQuoteBtn = getQuoteBtn.cloneNode(true);
                getQuoteBtn.parentNode.replaceChild(newGetQuoteBtn, getQuoteBtn);
                
                // Add event listener for the "Complete Application" button
                newGetQuoteBtn.addEventListener('click', function() {
                    console.log('Complete Application button clicked');
                    if (congratsModal) congratsModal.style.display = 'none';
                    
                    // Proceed to quote tool based on age
                    if (userAge !== null) {
                        console.log('Routing based on age:', userAge);
                        // Route based on age
                        if (userAge <= 60) {
                            // Show IUL quoting tool for ages 60 and below
                            document.getElementById('iul-quote-modal').style.display = 'flex';
                            document.getElementById('iul-quote-modal').classList.add('active');
                            // Initialize the IUL quote slider if not already done
                            if (!window.iulQuoteSlider) {
                                window.iulQuoteSlider = new IULQuoteSlider();
                            }
                        } else {
                            // Show final expense quoting tool for ages 61 and above
                            document.getElementById('coverage-slider-modal').style.display = 'flex';
                            document.getElementById('coverage-slider-modal').classList.add('active');
                            // Initialize the coverage slider if not already done
                            if (!window.coverageSlider) {
                                window.coverageSlider = new CoverageSlider();
                            }
                        }
                    } else {
                        console.log('No age data, defaulting to final expense');
                        // Default to final expense if no age data
                        document.getElementById('coverage-slider-modal').style.display = 'flex';
                        document.getElementById('coverage-slider-modal').classList.add('active');
                        if (!window.coverageSlider) {
                            window.coverageSlider = new CoverageSlider();
                        }
                    }
                });
            }
        }, 7000); // 7 second loading time
    });

    // Back button for diabetes step
    document.querySelector('#funnel-medical-diabetes .funnel-back-btn').addEventListener('click', function() {
        document.getElementById('funnel-medical-diabetes').style.display = 'none';
        document.getElementById('funnel-medical-hospital').style.display = 'block';
        setMedicalProgress(4, 5);
    });

    // Back button for hospital step
    document.querySelector('#funnel-medical-hospital .funnel-back-btn').addEventListener('click', function() {
        document.getElementById('funnel-medical-hospital').style.display = 'none';
        document.getElementById('funnel-medical-height-weight').style.display = 'block';
        setMedicalProgress(3, 5);
    });

    // Back button for conditions step
    document.querySelector('#funnel-medical-conditions .funnel-back-btn').addEventListener('click', function() {
        document.getElementById('funnel-medical-conditions').style.display = 'none';
        document.getElementById('funnel-medical-tobacco').style.display = 'block';
        setMedicalProgress(1, 5);
    });

    // Back button for height/weight step
    document.querySelector('#funnel-medical-height-weight .funnel-back-btn').addEventListener('click', function() {
        document.getElementById('funnel-medical-height-weight').style.display = 'none';
        document.getElementById('funnel-medical-conditions').style.display = 'block';
        setMedicalProgress(2, 5);
        // Initialize the medical conditions logic when form is shown
        initializeMedicalConditionsLogic();
        // Initialize dropdowns when height/weight form is shown
        initializeHeightWeightDropdowns();
    });

    // Back button for tobacco step
    document.querySelector('#funnel-medical-tobacco .funnel-back-btn').addEventListener('click', function() {
        document.getElementById('funnel-medical-tobacco').style.display = 'none';
        document.getElementById('funnel-contact-form').style.display = 'block';
        // Hide progress tracker when going back to contact form
        const tracker = document.querySelector('.funnel-progress-tracker');
        if (tracker) tracker.style.display = 'none';
    });

    // Application form step 1 to step 2
    document.getElementById('application-next-btn').addEventListener('click', function() {
        // Validate required fields
        const requiredFields = ['app-street-address', 'app-city', 'app-state', 'app-zip-code', 'app-beneficiary-first', 'app-beneficiary-last', 'app-beneficiary-relationship', 'app-birth-state', 'app-va-clinic', 'app-primary-doctor', 'app-driver-license'];
        let isValid = true;
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                clearFieldError(field);
            }
        });

        if (!isValid) return;

        // Save step 1 data to localStorage
        const step1Data = {};
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            step1Data[fieldId] = field.value;
        });
        localStorage.setItem('applicationPage1Data', JSON.stringify(step1Data));

        // Go to step 2
        document.getElementById('funnel-application-form').style.display = 'none';
        document.getElementById('funnel-application-final').style.display = 'block';
    });

    // Application form step 2 submit
    document.getElementById('application-submit-btn').addEventListener('click', function(e) {
        e.preventDefault();
        
        // Validate required fields
        const requiredFields = ['app-ssn', 'app-bank-name', 'app-routing', 'app-account', 'app-policy-start-date'];
        let isValid = true;
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                clearFieldError(field);
            }
        });

        if (!isValid) return;

        // Get step 1 data from localStorage
        const step1Data = JSON.parse(localStorage.getItem('applicationPage1Data') || '{}');
        
        // Get step 2 data
        const step2Data = {};
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            step2Data[fieldId] = field.value;
        });

        // Combine all data
        const completeData = { ...step1Data, ...step2Data };
        console.log('Complete application data:', completeData);

        // Show loading state
        const submitBtn = this;
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;

        // Show loading modal for 3 seconds
        const loadingModal = document.getElementById('processing-modal');
        if (loadingModal) {
            loadingModal.style.display = 'flex';
        }

        // Simulate API call for 3 seconds
        setTimeout(() => {
            // Hide loading modal
            if (loadingModal) {
                loadingModal.style.display = 'none';
            }
            
            // Clear localStorage
            localStorage.removeItem('applicationPage1Data');
            
            // Close the funnel modal
            document.getElementById('funnel-modal').style.display = 'none';
            document.body.style.overflow = '';
            
            // Show congratulations modal
            console.log('About to show congrats modal');
            showApplicationCongratsModal();
            
            // Reset the form
            resetFunnel();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 3000);
    });

    // Close modal when clicking outside
    funnelModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
            document.body.style.overflow = '';
            resetFunnel();
        }
    });

    // Success modal functionality
    function showSuccessModal() {
        const successModal = document.getElementById('success-modal');
        if (successModal) {
            successModal.classList.add('active');

            // Automatically hide and reset after 3 seconds
            setTimeout(hideSuccessModal, 3000);
        }
    }

    function hideSuccessModal() {
        const successModal = document.getElementById('success-modal');

        // Hide the success message
        if (successModal) {
            successModal.classList.remove('active');
        }
        // Ensure the main funnel stays hidden until next time
        const funnelModal = document.querySelector('.funnel-modal');
        if (funnelModal) {
            funnelModal.style.display = 'none';
        }
        // Reset the funnel steps for the next time it's opened
        resetFunnel();
    }

    // Application congratulations modal functions
    function showApplicationCongratsModal() {
        const congratsModal = document.getElementById('application-congrats-modal');
        console.log('Showing congrats modal:', congratsModal);
        if (congratsModal) {
            congratsModal.style.display = 'flex';
            congratsModal.style.opacity = '1';
            congratsModal.style.zIndex = '9999';
            console.log('Modal display set to flex');
        } else {
            console.log('Modal not found!');
        }
    }

    function hideApplicationCongratsModal() {
        const congratsModal = document.getElementById('application-congrats-modal');
        if (congratsModal) {
            congratsModal.style.display = 'none';
        }
    }

    function hideMedicalCongratsModal() {
        const congratsModal = document.getElementById('medical-congrats-modal');
        if (congratsModal) {
            congratsModal.style.display = 'none';
        }
    }

    function initializeFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    // Make functions globally available
    window.hideApplicationCongratsModal = hideApplicationCongratsModal;
    window.showApplicationCongratsModal = showApplicationCongratsModal;
    window.hideMedicalCongratsModal = hideMedicalCongratsModal;

    // Initialize FAQ functionality
    initializeFAQ();

    // Phone number formatting
    function initializePhoneNumberFormatting() {
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    if (value.length <= 3) {
                        value = value;
                    } else if (value.length <= 6) {
                        value = value.slice(0,3) + '-' + value.slice(3);
                    } else {
                        value = value.slice(0,3) + '-' + value.slice(3,6) + '-' + value.slice(6,10);
                    }
                }
                e.target.value = value;
            });
        }
    }

    function showFieldError(field, message) {
        const errorDiv = field.parentElement.querySelector('.error-message') || 
                        document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        if (!field.parentElement.querySelector('.error-message')) {
            field.parentElement.appendChild(errorDiv);
        }
        field.classList.add('error');
    }

    function clearFieldError(field) {
        const errorDiv = field.parentElement.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
        field.classList.remove('error');
    }

    document.querySelectorAll('.funnel-back-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const currentForm = this.closest('form');
            const backStepId = this.getAttribute('data-back');
            if (currentForm && backStepId) {
                currentForm.style.display = 'none';
                document.getElementById(backStepId).style.display = 'block';
            }
        });
    });






});

// Form handling functionality
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
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzXsVqxdaC146Z-OhcnBqtz45c8cSXWsyoj27K0Kj34ogeVzoPGFIL2DKz8M15IlXaK/exec';

// Submit form data to Google Apps Script
async function submitFormData(data) {
    
    try {
        console.log('🚨 SUBMITFORMDATA CALLED 🚨');
        console.log('Submitting data to:', GOOGLE_APPS_SCRIPT_URL);
        console.log('Data being submitted:', data);
        
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Response error text:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        const result = await response.json();
        console.log('Form data submitted successfully:', result);
        return result;
        
    } catch (error) {
        console.error('Error submitting form data:', error);
        console.error('Error details:', error.message);
        throw error;
    }
}

// Show success message
function showSuccessMessage(message) {
    const notification = createNotification(message, 'success');
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Show error message
function showErrorMessage(message) {
    const notification = createNotification(message, 'error');
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Create notification element
function createNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s ease-out;
    `;
    
    if (type === 'success') {
        notification.style.background = '#10b981';
    } else {
        notification.style.background = '#ef4444';
    }
    
    notification.textContent = message;
    return notification;
}

// Smooth scrolling functionality
function initializeSmoothScrolling() {
    // Smooth scroll to form when CTA button is clicked
    window.scrollToForm = function() {
        const form = document.getElementById('eligibility-form');
        if (form) {
            form.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    };
    
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize animations
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.benefit-card, .testimonial-card, .why-feature');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Form validation
function initializeFormValidation() {
    const form = document.getElementById('eligibilityForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required.';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const cleanPhone = value.replace(/\D/g, '');
        if (cleanPhone.length < 10) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number.';
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
    
    .cta-button.primary:hover {
        animation: pulse 0.6s ease-in-out;
    }
    
    .benefit-card:hover .benefit-icon {
        transform: scale(1.1);
        transition: transform 0.3s ease;
    }
    
    .testimonial-card:hover {
        transform: translateY(-5px) scale(1.02);
    }
    
    .why-feature:hover i {
        transform: rotate(5deg);
        transition: transform 0.3s ease;
    }
`;
document.head.appendChild(style);

// Analytics tracking (replace with your actual analytics code)
function trackEvent(eventName, eventData = {}) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, eventData);
    }
    
    console.log('Event tracked:', eventName, eventData);
}

// Track form submissions
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('eligibilityForm');
    if (form) {
        form.addEventListener('submit', function() {
            trackEvent('form_submit', {
                form_name: 'eligibility_form',
                page_location: window.location.href
            });
        });
    }
    
    // Track CTA button clicks
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            trackEvent('cta_click', {
                button_text: this.textContent.trim(),
                page_location: window.location.href
            });
        });
    });
});

// Performance optimization
function optimizeImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.loading = 'lazy';
        img.decoding = 'async';
    });
}

// Initialize image optimization
document.addEventListener('DOMContentLoaded', optimizeImages);

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Update the funnel data collection
document.getElementById('funnel-state-select').addEventListener('change', function() {
    document.getElementById('form-state').value = this.value;
});

document.querySelectorAll('#funnel-military-form input[name="militaryStatus"]').forEach(input => {
    input.addEventListener('change', function() {
        document.getElementById('form-military-status').value = this.value;
    });
});

document.querySelectorAll('#funnel-branch-form input[name="branchOfService"]').forEach(input => {
    input.addEventListener('change', function() {
        document.getElementById('form-branch').value = this.value;
    });
});

document.querySelectorAll('#funnel-marital-form input[name="maritalStatus"]').forEach(input => {
    input.addEventListener('change', function() {
        document.getElementById('form-marital-status').value = this.value;
    });
});

document.querySelectorAll('#funnel-coverage-form input[name="coverageAmount"]').forEach(input => {
    input.addEventListener('change', function() {
        document.getElementById('form-coverage-amount').value = this.value;
    });
});

// Add quote-utils.js script tag to the head
document.addEventListener('DOMContentLoaded', function() {
    // Add quote-utils.js script if not already present
    if (!document.querySelector('script[src="quote-utils.js"]')) {
        const script = document.createElement('script');
        script.src = 'quote-utils.js';
        document.head.appendChild(script);
    }
});

// Coverage Slider functionality
class CoverageSlider {
    constructor() {
        this.quoteGender = 'male';
        this.quoteAge = 60; // Default starting age (minimum)
        this.quoteCoverage = 5000; // Default starting coverage (minimum)
        this.healthTier = 'select1'; // Default health tier
        
        // Initialize with funnel data if available
        this.initializeFromFunnelData();
        
                this.init();

        // Set initial slider values
        this.updateSliderValues();
        
        // Setup modal close listener
        this.setupModalCloseListener();
    }

    init() {
        this.setupEventListeners();
        this.updateQuote();
    }

    setupEventListeners() {
        // Age slider
        document.getElementById('age-slider').addEventListener('input', (e) => {
            this.quoteAge = parseInt(e.target.value);
            document.getElementById('age-display').textContent = this.quoteAge;
            this.updateQuote();
        });

        // Coverage slider
        document.getElementById('coverage-slider').addEventListener('input', (e) => {
            this.quoteCoverage = parseInt(e.target.value);
            document.getElementById('coverage-display').textContent = this.quoteCoverage.toLocaleString();
            this.updateQuote();
        });

        // Gender selection
        document.querySelectorAll('input[name="gender"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.quoteGender = e.target.value;
                this.updateQuote();
            });
        });

        // Quote card click
        document.getElementById('quote-card').addEventListener('click', () => {
            if (this.getQuote()) {
                this.showApplicationModal();
            }
        });

        // Modal close
        document.getElementById('modal-close').addEventListener('click', () => {
            this.hideSecureQuoteModal();
        });

        // Form submission
        document.getElementById('quote-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Application form submission
        const applicationForm = document.getElementById('application-form');
        if (applicationForm) {
            applicationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleApplicationSubmit();
            });
        }
    }

    getQuote() {
        // Use real quote calculation engine with default health tier
        if (typeof QuoteUtils !== 'undefined') {
            return QuoteUtils.getNationalQuote(this.quoteGender, this.quoteAge, this.quoteCoverage, this.healthTier);
        } else {
            console.error('QuoteUtils not loaded');
            return null;
        }
    }

    updateQuote() {
        console.log('updateQuote called with:', this.quoteAge, this.quoteCoverage, this.quoteGender, this.healthTier);
        const quote = this.getQuote();
        const quoteCard = document.getElementById('quote-card');

        if (quote) {
            quoteCard.innerHTML = `
                <div class="quote-amount">$${quote}</div>
                <div class="quote-period">/month</div>
                <div class="quote-actions">
                    <button class="quote-action-btn secondary" id="final-expense-secure-quote-btn">
                        <i class="fas fa-shield-alt"></i>
                        Secure Quote
                    </button>
                </div>
            `;
            // Add event listener for the Secure Quote button
            setTimeout(() => {
                const secureBtn = document.getElementById('final-expense-secure-quote-btn');
                if (secureBtn) {
                    secureBtn.onclick = () => {
                        // Hide coverage slider modal
                        document.getElementById('coverage-slider-modal').style.display = 'none';
                        document.getElementById('coverage-slider-modal').classList.remove('active');
                        // Show application form step in funnel modal
                        document.getElementById('funnel-modal').style.display = 'flex';
                        document.body.style.overflow = 'hidden';
                        document.getElementById('funnel-application-form').style.display = 'block';
                        // Optionally, hide all other funnel steps
                        document.querySelectorAll('#funnel-modal form').forEach(form => {
                            if (form.id !== 'funnel-application-form') form.style.display = 'none';
                        });
                    };
                }
            }, 0);
        } else {
            quoteCard.innerHTML = '<div class="quote-placeholder">Adjust sliders to get your rate!</div>';
        }
    }

    showApplicationModal() {
        // Hide coverage slider modal
        document.getElementById('coverage-slider-modal').style.display = 'none';
        document.getElementById('coverage-slider-modal').classList.remove('active');
        // Show application modal
        document.getElementById('application-modal').style.display = 'flex';
        document.getElementById('application-modal').classList.add('active');
    }

    showSecureQuoteModal() {
        // Hide coverage slider modal
        document.getElementById('coverage-slider-modal').style.display = 'none';
        document.getElementById('coverage-slider-modal').classList.remove('active');
        // Show application form step in funnel modal
        document.getElementById('funnel-modal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
        document.getElementById('funnel-application-form').style.display = 'block';
        // Optionally, hide all other funnel steps
        document.querySelectorAll('#funnel-modal form').forEach(form => {
            if (form.id !== 'funnel-application-form') form.style.display = 'none';
        });
    }

    hideSecureQuoteModal() {
        document.getElementById('secure-quote-modal').style.display = 'none';
    }
    
    // Add event listener for modal close button
    setupModalCloseListener() {
        const closeButton = document.getElementById('modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.hideSecureQuoteModal();
            });
        }
    }
    
    updateSliderValues() {
        // Update age slider
        const ageSlider = document.getElementById('age-slider');
        const ageDisplay = document.getElementById('age-display');
        if (ageSlider && ageDisplay) {
            ageSlider.value = this.quoteAge;
            ageDisplay.textContent = this.quoteAge;
        }
        
        // Update coverage slider
        const coverageSlider = document.getElementById('coverage-slider');
        const coverageDisplay = document.getElementById('coverage-display');
        if (coverageSlider && coverageDisplay) {
            coverageSlider.value = this.quoteCoverage;
            coverageDisplay.textContent = this.quoteCoverage.toLocaleString();
        }
    }

    async handleFormSubmit() {
        const submitButton = document.getElementById('submit-button');
        const formMessage = document.getElementById('form-message');
        
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        formMessage.style.display = 'none';

        try {
            // Get form data
            const form = document.getElementById('quote-form');
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Add comprehensive quote data
            data.coverageAmount = this.quoteAmount;
            data.age = this.quoteAge;
            data.healthTier = this.healthTier;
            data.quoteType = 'coverage_slider';
            data.monthlyPremium = this.monthlyPremium;
            data.formType = 'Quote';
            data.timestamp = new Date().toISOString();
            
            // Submit to Google Apps Script
            await submitFormData(data);
            
            formMessage.className = 'form-message form-success';
            formMessage.textContent = 'Quote sent successfully! Check your email.';
            formMessage.style.display = 'block';
            
            // Reset form
            form.reset();
            
        } catch (error) {
            console.error('Error submitting quote form:', error);
            formMessage.className = 'form-message form-error';
            formMessage.textContent = 'Error sending quote. Please try again.';
            formMessage.style.display = 'block';
        } finally {
            submitButton.textContent = 'Get My Quote';
            submitButton.disabled = false;
        }
    }

    async handleApplicationSubmit() {
        const submitButton = document.querySelector('#application-form .cta-button');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;

        try {
            // Get form data
            const form = document.getElementById('application-form');
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Add form type identifier
            data.formType = 'application_form';
            
            // Submit to Google Apps Script
            await submitFormData(data);
            
            // Show success message
            alert('Application submitted successfully! A representative will contact you within 24 hours.');
            
            // Close application modal
            document.getElementById('application-modal').style.display = 'none';
            document.getElementById('application-modal').classList.remove('active');
            
            // Reset form
            form.reset();
            
        } catch (error) {
            console.error('Error submitting application form:', error);
            alert('Error submitting application. Please try again.');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }
}

// Add methods to CoverageSlider class for funnel integration
CoverageSlider.prototype.initializeFromFunnelData = function() {
    // Get funnel data from global scope if available
    if (typeof funnelData !== 'undefined' && funnelData.contactInfo) {
        // Set age from funnel data
        if (funnelData.contactInfo.age) {
            this.quoteAge = parseInt(funnelData.contactInfo.age);
            // Update the slider to match
            const ageSlider = document.getElementById('age-slider');
            if (ageSlider) {
                ageSlider.value = this.quoteAge;
                document.getElementById('age-display').textContent = this.quoteAge;
            }
        }
        
        // Determine health tier based on medical answers
        this.determineHealthTier();
    }
};

CoverageSlider.prototype.determineHealthTier = function() {
    // Get medical answers from funnel data
    if (typeof funnelData !== 'undefined' && funnelData.medicalAnswers) {
        const answers = funnelData.medicalAnswers;
        let riskFactors = 0;
        
        // Check tobacco use
        if (answers.tobaccoUse === 'Yes') {
            riskFactors += 2;
        }
        
        // Check medical conditions
        if (answers.medicalConditions) {
            const conditions = Array.isArray(answers.medicalConditions) 
                ? answers.medicalConditions 
                : [answers.medicalConditions];
            
            conditions.forEach(condition => {
                if (condition !== 'None') {
                    riskFactors += 1;
                }
            });
        }
        
        // Check diabetes
        if (answers.diabetesMedication && answers.diabetesMedication !== 'No') {
            riskFactors += 1;
        }
        
        // Determine health tier based on risk factors
        if (riskFactors === 0) {
            this.healthTier = 'select1'; // Best rates
        } else if (riskFactors <= 2) {
            this.healthTier = 'select2'; // Standard rates
        } else {
            this.healthTier = 'select3'; // Higher rates
        }
    }
};

class IULQuoteSlider {
    constructor() {
        this.iulData = {
            male: {
                40: [35.75, 39.26, 42.77, 46.27, 49.78, 50.94, 54.27, 57.60, 60.93, 64.26, 66.12, 69.30, 72.49, 75.67, 78.86, 81.30, 84.35, 87.41, 90.46, 93.52, 96.49, 99.53, 102.60, 105.66, 108.71, 111.69, 114.67, 117.65, 120.63, 123.61, 126.87, 129.85, 132.83, 135.81, 138.79, 142.05, 145.03, 148.01, 150.99, 154.07, 157.25],
                41: [37.90, 41.60, 45.31, 49.01, 52.71, 54.16, 57.71, 61.26, 64.81, 68.36, 70.42, 73.83, 77.24, 80.65, 84.06, 86.68, 89.88, 93.09, 96.29, 99.50, 102.94, 106.13, 109.33, 112.53, 115.73, 119.20, 122.39, 125.59, 128.79, 132.00, 135.46, 138.66, 141.86, 145.06, 148.26, 151.72, 154.92, 158.12, 161.32, 164.24, 167.99],
                42: [40.05, 43.95, 47.84, 51.74, 55.64, 57.39, 61.14, 64.90, 68.66, 72.41, 74.72, 78.36, 82.00, 85.64, 89.28, 92.05, 95.42, 98.78, 102.15, 105.52, 109.39, 112.73, 116.08, 119.42, 122.77, 126.72, 130.06, 133.40, 136.75, 140.09, 144.05, 147.39, 150.74, 154.08, 157.42, 161.40, 164.74, 168.08, 171.43, 174.73, 178.73],
                43: [42.20, 46.30, 50.39, 54.49, 58.59, 60.61, 64.58, 68.54, 72.51, 76.48, 78.02, 82.29, 86.56, 90.83, 95.10, 97.43, 101.03, 104.64, 108.24, 111.85, 115.84, 119.43, 123.02, 126.61, 130.21, 134.23, 137.82, 141.41, 145.01, 148.60, 152.64, 156.23, 159.83, 163.42, 167.02, 171.07, 174.66, 178.26, 181.85, 185.99, 189.48],
                44: [44.80, 49.14, 53.48, 57.82, 62.16, 64.52, 68.78, 73.04, 77.30, 81.56, 84.23, 88.79, 93.35, 97.91, 102.47, 103.92, 107.79, 111.66, 115.53, 119.40, 123.64, 127.50, 131.36, 135.22, 139.08, 143.35, 147.21, 151.07, 154.93, 158.79, 163.06, 166.92, 170.78, 174.64, 178.50, 182.77, 186.63, 190.49, 194.35, 199.07, 202.48],
                45: [47.53, 52.09, 56.66, 61.23, 65.80, 68.62, 73.08, 77.54, 81.99, 86.45, 89.70, 94.53, 99.37, 104.20, 109.03, 110.77, 114.88, 118.99, 123.10, 127.21, 131.82, 135.93, 140.04, 144.15, 148.26, 152.87, 157.00, 161.12, 165.24, 169.37, 173.97, 178.09, 182.21, 186.34, 190.46, 194.89, 199.01, 203.14, 207.26, 212.90, 216.17],
                46: [50.27, 55.04, 59.81, 64.58, 69.35, 72.72, 77.38, 82.04, 86.70, 91.36, 95.17, 100.27, 105.37, 110.47, 115.57, 117.61, 121.97, 126.33, 130.69, 135.05, 140.06, 144.42, 148.78, 153.14, 157.50, 162.52, 166.88, 171.24, 175.60, 179.96, 184.96, 189.32, 193.68, 198.04, 202.40, 207.41, 211.77, 216.13, 220.49, 226.73, 229.86],
                47: [53.60, 58.68, 63.77, 68.85, 73.94, 77.72, 82.68, 87.64, 92.60, 97.56, 101.83, 107.27, 112.71, 118.15, 123.59, 125.94, 130.57, 135.20, 139.83, 144.46, 149.86, 154.49, 159.12, 163.75, 168.38, 173.88, 178.51, 183.14, 187.77, 192.40, 197.90, 202.53, 207.16, 211.79, 216.42, 221.80, 226.43, 231.06, 235.69, 242.76, 245.97],
                48: [56.94, 62.31, 67.68, 73.05, 78.42, 82.72, 87.98, 93.24, 98.50, 103.76, 108.49, 114.27, 120.05, 125.83, 131.61, 134.28, 139.17, 144.06, 148.95, 153.84, 160.06, 165.00, 169.94, 174.88, 179.82, 185.83, 190.77, 195.71, 200.65, 205.59, 211.61, 216.55, 221.49, 226.43, 231.37, 237.39, 242.33, 247.27, 252.21, 260.04, 263.17],
                49: [60.44, 66.16, 71.88, 77.60, 83.32, 87.96, 93.52, 99.08, 104.64, 110.20, 115.48, 121.60, 127.72, 133.84, 139.96, 142.92, 148.21, 153.50, 158.79, 164.08, 170.54, 175.83, 181.12, 186.41, 191.70, 197.97, 203.26, 208.55, 213.84, 219.13, 225.75, 231.04, 236.33, 241.62, 246.91, 253.12, 258.41, 263.70, 268.99, 277.60, 280.65],
                50: [63.94, 69.96, 75.98, 82.00, 88.02, 93.19, 99.06, 104.93, 110.80, 116.67, 122.47, 128.93, 135.39, 141.85, 148.31, 151.75, 157.25, 162.75, 168.25, 173.75, 181.03, 186.53, 192.03, 197.53, 203.03, 210.30, 215.80, 221.30, 226.80, 232.30, 239.58, 245.08, 250.58, 256.08, 261.58, 268.85, 274.35, 279.85, 285.35, 295.17, 298.13],
                51: [67.95, 74.33, 80.71, 87.09, 93.47, 99.22, 105.46, 111.70, 117.94, 124.18, 130.51, 137.26, 144.01, 150.76, 157.51, 161.79, 167.79, 173.79, 179.79, 185.79, 193.07, 199.07, 205.07, 211.07, 217.07, 224.36, 230.36, 236.36, 242.36, 248.36, 255.65, 261.65, 267.65, 273.65, 279.65, 286.92, 292.92, 298.92, 304.92, 315.26, 318.21],
                52: [71.96, 78.70, 85.44, 92.18, 98.92, 105.25, 111.86, 118.47, 125.08, 131.69, 138.55, 145.59, 152.63, 159.67, 166.71, 171.84, 178.33, 184.82, 191.31, 197.80, 205.12, 211.61, 218.10, 224.59, 231.08, 238.42, 244.91, 251.40, 257.89, 264.38, 271.71, 278.20, 284.69, 291.18, 297.67, 305.00, 311.49, 317.98, 324.47, 335.35, 338.29],
                53: [76.43, 83.56, 90.69, 97.82, 104.95, 111.97, 118.98, 126.00, 133.01, 140.02, 147.50, 154.92, 162.34, 169.76, 177.18, 182.84, 189.49, 196.14, 202.79, 209.44, 218.05, 224.70, 231.35, 238.00, 244.65, 253.58, 260.23, 266.88, 273.53, 280.18, 289.11, 295.76, 302.41, 309.06, 315.71, 324.64, 331.29, 337.94, 344.59, 357.22, 360.17],
                54: [80.90, 88.43, 95.96, 103.49, 111.02, 118.68, 126.10, 133.52, 140.94, 148.36, 156.45, 164.25, 172.05, 179.85, 187.65, 194.21, 201.65, 209.09, 216.53, 223.97, 231.98, 239.42, 246.86, 254.30, 261.74, 269.74, 277.18, 284.62, 292.06, 299.50, 307.52, 314.96, 322.40, 329.84, 337.28, 345.28, 352.72, 360.16, 367.60, 383.04, 383.04],
                55: [86.16, 94.16, 102.16, 110.16, 118.16, 126.56, 134.36, 142.16, 149.96, 157.76, 167.44, 175.58, 183.72, 191.86, 200.00, 207.83, 215.67, 223.51, 231.35, 239.19, 248.22, 256.06, 263.90, 271.74, 279.58, 288.61, 296.45, 304.29, 312.13, 319.97, 329.00, 336.84, 344.68, 352.52, 360.36, 369.90, 377.74, 385.58, 393.42, 407.90, 410.78],
                56: [91.41, 99.80, 108.19, 116.58, 124.97, 134.43, 142.62, 150.81, 159.00, 167.19, 177.44, 186.23, 195.02, 203.81, 212.60, 220.46, 228.84, 237.22, 245.60, 253.98, 263.46, 272.25, 281.04, 289.83, 298.62, 306.48, 315.27, 324.06, 332.85, 341.64, 349.49, 358.28, 367.07, 375.86, 384.65, 392.52, 401.31, 410.10, 418.89, 432.76, 435.53],
                57: [97.54, 106.50, 115.46, 124.42, 133.38, 143.61, 152.37, 161.13, 169.89, 178.65, 189.68, 198.88, 208.08, 217.28, 226.48, 235.76, 244.96, 254.16, 263.36, 272.56, 281.82, 291.02, 300.22, 309.42, 318.62, 327.90, 337.10, 346.30, 355.50, 364.70, 373.98, 383.18, 392.38, 401.58, 410.78, 420.06, 429.26, 438.46, 447.66, 463.37, 466.14],
                58: [103.66, 113.08, 122.50, 131.92, 141.34, 152.78, 162.12, 171.46, 180.80, 190.14, 201.92, 211.54, 221.16, 230.78, 240.40, 251.06, 260.68, 270.30, 279.92, 289.54, 300.19, 309.81, 319.43, 329.05, 338.67, 349.33, 358.95, 368.57, 378.19, 387.81, 398.47, 408.09, 417.71, 427.33, 436.95, 447.61, 457.23, 466.85, 476.47, 493.98, 496.74],
                59: [80.47, 88.23, 95.99, 103.75, 111.51, 117.78, 125.44, 133.10, 140.76, 148.42, 155.58, 163.54, 171.50, 179.46, 187.42, 193.39, 200.35, 207.31, 214.27, 221.23, 230.19, 237.91, 245.63, 253.35, 261.07, 270.03, 277.75, 285.47, 293.19, 300.91, 309.87, 317.59, 325.31, 333.03, 340.75, 349.71, 357.43, 365.15, 372.87, 408.38, 408.38],
                60: [85.97, 94.23, 102.49, 110.75, 119.01, 126.27, 134.43, 142.59, 150.75, 158.91, 166.58, 175.14, 183.70, 192.26, 200.82, 206.87, 214.63, 222.39, 230.15, 237.91, 247.17, 254.93, 262.69, 270.45, 278.21, 287.47, 295.23, 302.99, 310.75, 318.51, 327.76, 335.52, 343.28, 351.04, 358.80, 368.06, 375.82, 383.58, 391.34, 408.38, 408.38]
            }
        };
        this.coverageAmounts = [50000, 55000, 60000, 65000, 70000, 75000, 80000, 85000, 90000, 95000, 100000, 105000, 110000, 115000, 120000, 125000, 130000, 135000, 140000, 145000, 150000, 155000, 160000, 165000, 170000, 175000, 180000, 185000, 190000, 195000, 200000, 205000, 210000, 215000, 220000, 225000, 230000, 235000, 240000, 245000, 250000];
        this.init();
        this.setupModalCloseListener();
    }

    init() {
        this.setupEventListeners();
        this.updateQuote();
    }

    setupEventListeners() {
        const ageSlider = document.getElementById('iul-age-slider');
        const coverageSlider = document.getElementById('iul-coverage-slider');
        const genderInputs = document.querySelectorAll('input[name="iul-gender"]');

        if (ageSlider) {
            ageSlider.addEventListener('input', () => {
                document.getElementById('iul-age-display').textContent = ageSlider.value;
                this.updateQuote();
            });
        }

        if (coverageSlider) {
            coverageSlider.addEventListener('input', () => {
                document.getElementById('iul-coverage-display').textContent = this.formatNumber(parseInt(coverageSlider.value));
                this.updateQuote();
            });
        }

        genderInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.updateQuote();
            });
        });
    }

    updateQuote() {
        const age = parseInt(document.getElementById('iul-age-slider').value);
        const coverage = parseInt(document.getElementById('iul-coverage-slider').value);
        const gender = document.querySelector('input[name="iul-gender"]:checked').value;
        
        const quoteCard = document.getElementById('iul-quote-card');
        
        // Find the closest coverage amount in our data
        const coverageIndex = this.coverageAmounts.findIndex(amount => amount >= coverage);
        const actualCoverage = this.coverageAmounts[coverageIndex >= 0 ? coverageIndex : this.coverageAmounts.length - 1];
        
        // Get the rate from our data
        const rates = this.iulData[gender][age];
        if (rates && rates[coverageIndex] !== undefined) {
            const monthlyRate = rates[coverageIndex];
            quoteCard.innerHTML = `
                <div class="quote-amount">$${this.formatNumber(actualCoverage)}</div>
                <div class="quote-period">Monthly Premium: $${monthlyRate.toFixed(2)}</div>
                <div class="quote-actions">
                    <button class="quote-action-btn secondary" id="iul-secure-quote-btn">
                        <i class="fas fa-shield-alt"></i>
                        Secure Quote
                    </button>
                </div>
            `;
            // Add event listener for the Secure Quote button
            setTimeout(() => {
                const secureBtn = document.getElementById('iul-secure-quote-btn');
                if (secureBtn) {
                    secureBtn.onclick = () => {
                        // Hide IUL quote modal
                        document.getElementById('iul-quote-modal').style.display = 'none';
                        document.getElementById('iul-quote-modal').classList.remove('active');
                        // Show application form step in funnel modal
                        document.getElementById('funnel-modal').style.display = 'flex';
                        document.body.style.overflow = 'hidden';
                        document.getElementById('funnel-application-form').style.display = 'block';
                        // Optionally, hide all other funnel steps
                        document.querySelectorAll('#funnel-modal form').forEach(form => {
                            if (form.id !== 'funnel-application-form') form.style.display = 'none';
                        });
                    };
                }
            }, 0);
        } else {
            quoteCard.innerHTML = '<div class="quote-placeholder">Rate not available for this combination</div>';
        }
    }

    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    showSecureQuoteModal() {
        // Get current quote data
        const age = parseInt(document.getElementById('iul-age-slider').value);
        const coverage = parseInt(document.getElementById('iul-coverage-slider').value);
        const gender = document.querySelector('input[name="iul-gender"]:checked').value;
        
        // Find the closest coverage amount in our data
        const coverageIndex = this.coverageAmounts.findIndex(amount => amount >= coverage);
        const actualCoverage = this.coverageAmounts[coverageIndex >= 0 ? coverageIndex : this.coverageAmounts.length - 1];
        
        // Get the rate from our data
        const rates = this.iulData[gender][age];
        let monthlyRate = 0;
        if (rates && rates[coverageIndex] !== undefined) {
            monthlyRate = rates[coverageIndex];
        }
        
        const rate = monthlyRate > 0 ? `$${monthlyRate.toFixed(2)}/month` : '$0.00/month';
        const coverageFormatted = `$${this.formatNumber(actualCoverage)}`;
        
        // Update modal with current quote data
        document.getElementById('secure-quote-rate').textContent = rate;
        document.getElementById('secure-quote-coverage').textContent = coverageFormatted;
        document.getElementById('secure-quote-age').textContent = age;
        
        // Show the modal
        document.getElementById('secure-quote-modal').style.display = 'flex';
    }
    
    setupModalCloseListener() {
        const closeButton = document.getElementById('modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                document.getElementById('secure-quote-modal').style.display = 'none';
            });
        }
    }

    async handleFormSubmit() {
        const submitButton = document.getElementById('iul-submit-button');
        const formMessage = document.getElementById('iul-form-message');
        
        if (submitButton) submitButton.textContent = 'Sending...';
        if (submitButton) submitButton.disabled = true;
        if (formMessage) formMessage.style.display = 'none';

        try {
            // Get form data
            const form = document.getElementById('iul-quote-form');
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Get current quote data
            const age = parseInt(document.getElementById('iul-age-slider').value);
            const coverage = parseInt(document.getElementById('iul-coverage-slider').value);
            const gender = document.querySelector('input[name="iul-gender"]:checked').value;
            
            // Find the closest coverage amount in our data
            const coverageIndex = this.coverageAmounts.findIndex(amount => amount >= coverage);
            const actualCoverage = this.coverageAmounts[coverageIndex >= 0 ? coverageIndex : this.coverageAmounts.length - 1];
            
            // Get the rate from our data
            const rates = this.iulData[gender][age];
            let monthlyRate = 0;
            if (rates && rates[coverageIndex] !== undefined) {
                monthlyRate = rates[coverageIndex];
            }
            
            // Add comprehensive quote data
            data.coverageAmount = actualCoverage;
            data.age = age;
            data.gender = gender;
            data.quoteType = 'iul_quote';
            data.monthlyPremium = monthlyRate;
            data.formType = 'Quote';
            data.timestamp = new Date().toISOString();
            
            // Submit to Google Apps Script
            await submitFormData(data);
            
            if (formMessage) {
                formMessage.className = 'form-message form-success';
                formMessage.textContent = 'Quote sent successfully! Check your email.';
                formMessage.style.display = 'block';
            }
            
            // Reset form
            if (form) form.reset();
            
        } catch (error) {
            console.error('Error submitting IUL quote form:', error);
            if (formMessage) {
                formMessage.className = 'form-message form-error';
                formMessage.textContent = 'Error sending quote. Please try again.';
                formMessage.style.display = 'block';
            }
        } finally {
            if (submitButton) {
                submitButton.textContent = 'Get My Quote';
                submitButton.disabled = false;
            }
        }
    }
}

// Initialize height/weight dropdown functionality
function initializeHeightWeightDropdowns() {
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const heightDropdown = document.getElementById('height-dropdown');
    const weightDropdown = document.getElementById('weight-dropdown');
    
    if (!heightInput || !weightInput || !heightDropdown || !weightDropdown) {
        console.log('Dropdown elements not found:', { heightInput, weightInput, heightDropdown, weightDropdown });
        return;
    }
    
    console.log('Initializing dropdowns...');
    
    // Height dropdown functionality
    heightInput.addEventListener('focus', () => {
        heightDropdown.classList.add('show');
        filterDropdownItems(heightInput, heightDropdown);
    });
    
    heightInput.addEventListener('input', () => {
        heightDropdown.classList.add('show');
        filterDropdownItems(heightInput, heightDropdown);
        // Clear error styling whenever user types anything
        clearFieldError(heightInput);
    });
    
    heightInput.addEventListener('blur', () => {
        setTimeout(() => {
            heightDropdown.classList.remove('show');
        }, 200);
    });
    
    // Height keyboard navigation
    heightInput.addEventListener('keydown', (e) => {
        handleDropdownKeydown(e, heightInput, heightDropdown);
    });
    
    // Weight dropdown functionality
    weightInput.addEventListener('focus', () => {
        weightDropdown.classList.add('show');
        filterDropdownItems(weightInput, weightDropdown);
    });
    
    weightInput.addEventListener('input', () => {
        weightDropdown.classList.add('show');
        filterDropdownItems(weightInput, weightDropdown);
        // Clear error styling whenever user types anything
        clearFieldError(weightInput);
    });
    
    weightInput.addEventListener('blur', () => {
        setTimeout(() => {
            weightDropdown.classList.remove('show');
        }, 200);
    });
    
    // Weight keyboard navigation
    weightInput.addEventListener('keydown', (e) => {
        handleDropdownKeydown(e, weightInput, weightDropdown);
    });
    
    // Add click handlers for dropdown items
    heightDropdown.addEventListener('click', (e) => {
        if (e.target.classList.contains('dropdown-item')) {
            heightInput.value = e.target.getAttribute('data-value');
            heightDropdown.classList.remove('show');
            // Clear error styling when value is selected
            clearFieldError(heightInput);
        }
    });
    
    weightDropdown.addEventListener('click', (e) => {
        if (e.target.classList.contains('dropdown-item')) {
            weightInput.value = e.target.getAttribute('data-value');
            weightDropdown.classList.remove('show');
            // Clear error styling when value is selected
            clearFieldError(weightInput);
        }
    });
}

function filterDropdownItems(input, dropdown) {
    const searchTerm = input.value.toLowerCase();
    const items = dropdown.querySelectorAll('.dropdown-item');
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.startsWith(searchTerm)) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}

function handleDropdownKeydown(e, input, dropdown) {
    const visibleItems = dropdown.querySelectorAll('.dropdown-item:not(.hidden)');
    
    if (e.key === 'Enter') {
        e.preventDefault();
        if (visibleItems.length === 1) {
            // If only one item matches, select it
            const selectedItem = visibleItems[0];
            input.value = selectedItem.getAttribute('data-value');
            dropdown.classList.remove('show');
            // Clear error styling when value is selected
            clearFieldError(input);
        } else if (visibleItems.length > 1) {
            // If multiple items match, select the first one
            const firstItem = visibleItems[0];
            input.value = firstItem.getAttribute('data-value');
            dropdown.classList.remove('show');
            // Clear error styling when value is selected
            clearFieldError(input);
        }
    } else if (e.key === 'Escape') {
        // Close dropdown on Escape
        dropdown.classList.remove('show');
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        // Navigate down through visible items
        const currentIndex = Array.from(visibleItems).findIndex(item => 
            item.classList.contains('selected')
        );
        const nextIndex = (currentIndex + 1) % visibleItems.length;
        
        // Remove previous selection
        visibleItems.forEach(item => item.classList.remove('selected'));
        
        // Select next item
        if (visibleItems[nextIndex]) {
            const selectedItem = visibleItems[nextIndex];
            selectedItem.classList.add('selected');
            // Scroll to keep the selected item visible
            selectedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        // Navigate up through visible items
        const currentIndex = Array.from(visibleItems).findIndex(item => 
            item.classList.contains('selected')
        );
        const prevIndex = currentIndex <= 0 ? visibleItems.length - 1 : currentIndex - 1;
        
        // Remove previous selection
        visibleItems.forEach(item => item.classList.remove('selected'));
        
        // Select previous item
        if (visibleItems[prevIndex]) {
            const selectedItem = visibleItems[prevIndex];
            selectedItem.classList.add('selected');
            // Scroll to keep the selected item visible
            selectedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }
}

// Handle medical conditions checkbox logic
function initializeMedicalConditionsLogic() {
    const medicalConditionsForm = document.getElementById('funnel-medical-conditions');
    if (!medicalConditionsForm) return;
    
    const noneCheckbox = medicalConditionsForm.querySelector('input[value="None"]');
    const otherCheckboxes = medicalConditionsForm.querySelectorAll('input[name="medicalConditions"]:not([value="None"])');
    
    // Remove any existing event listeners to prevent duplicates
    const allCheckboxes = medicalConditionsForm.querySelectorAll('input[name="medicalConditions"]');
    allCheckboxes.forEach(checkbox => {
        checkbox.removeEventListener('change', handleMedicalConditionChange);
        checkbox.addEventListener('change', handleMedicalConditionChange);
    });
    
    function handleMedicalConditionChange() {
        const isNoneChecked = noneCheckbox && noneCheckbox.checked;
        const isOtherChecked = Array.from(otherCheckboxes).some(cb => cb.checked);
        
        if (this.value === 'None' && this.checked) {
            // "None of the above" was checked - uncheck all others
            otherCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
        } else if (this.value !== 'None' && this.checked) {
            // A specific condition was checked - uncheck "None of the above"
            if (noneCheckbox) {
                noneCheckbox.checked = false;
            }
        }
    }
}

// Initialize IUL Quote Slider when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize IUL Quote Slider if the modal exists
    const iulQuoteModal = document.getElementById('iul-quote-modal');
    if (iulQuoteModal) {
        window.iulQuoteSlider = new IULQuoteSlider();
    }
    

    
                    // Add close button functionality for secure quote modal
                const modalCloseBtn = document.getElementById('modal-close');
                if (modalCloseBtn) {
                    modalCloseBtn.addEventListener('click', function() {
                        document.getElementById('secure-quote-modal').style.display = 'none';
                    });
                }

                // Add Complete Application button functionality for secure quote modal
                const completeApplicationSecureBtn = document.getElementById('complete-application-secure-btn');
                if (completeApplicationSecureBtn) {
                    completeApplicationSecureBtn.addEventListener('click', function() {
                        // Hide secure quote modal
                        document.getElementById('secure-quote-modal').style.display = 'none';
                        // Show application modal
                        document.getElementById('application-modal').style.display = 'flex';
                    });
                }

                // Add close button functionality for application modal
                const applicationModalCloseBtn = document.getElementById('application-modal-close');
                if (applicationModalCloseBtn) {
                    applicationModalCloseBtn.addEventListener('click', function() {
                        document.getElementById('application-modal').style.display = 'none';
                    });
                }

                // Add Finish Application button functionality for application modal
                const finishApplicationModalBtn = document.getElementById('finish-application-modal-btn');
                if (finishApplicationModalBtn) {
                    finishApplicationModalBtn.addEventListener('click', function() {
                        // Save form data to localStorage
                        const formData = new FormData(document.getElementById('application-form'));
                        const data = {};
                        for (let [key, value] of formData.entries()) {
                            data[key] = value;
                        }
                        localStorage.setItem('applicationPage1Data', JSON.stringify(data));
                        
                        // Hide application modal
                        document.getElementById('application-modal').style.display = 'none';
                        
                        // Show application final modal
                        document.getElementById('application-final-modal').style.display = 'flex';
                    });
                }

                // Add close button functionality for application final modal
                const applicationFinalModalCloseBtn = document.getElementById('application-final-modal-close');
                if (applicationFinalModalCloseBtn) {
                    applicationFinalModalCloseBtn.addEventListener('click', function() {
                        document.getElementById('application-final-modal').style.display = 'none';
                    });
                }

                // Add back button functionality for application final modal
                const backToPage1Btn = document.getElementById('back-to-page1-btn');
                if (backToPage1Btn) {
                    backToPage1Btn.addEventListener('click', function() {
                        document.getElementById('application-final-modal').style.display = 'none';
                        document.getElementById('application-modal').style.display = 'flex';
                    });
                }

                // Add form submission handling for application final modal
                const applicationFinalForm = document.getElementById('application-final-form');
                if (applicationFinalForm) {
                    applicationFinalForm.addEventListener('submit', async function(e) {
                        e.preventDefault();
                        
                        const submitButton = this.querySelector('button[type="submit"]');
                        const originalText = submitButton.innerHTML;
                        
                        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                        submitButton.disabled = true;

                        try {
                            // Get data from both pages
                            const page1Data = JSON.parse(localStorage.getItem('applicationPage1Data') || '{}');
                            const formData = new FormData(this);
                            const page2Data = {};
                            for (let [key, value] of formData.entries()) {
                                page2Data[key] = value;
                            }

                            // Combine all data
                            const completeData = { 
                                ...page1Data, 
                                ...page2Data,
                                formType: 'Application',
                                timestamp: new Date().toISOString()
                            };
                            console.log('Complete application data:', completeData);

                            // Submit to Google Apps Script
                            await submitFormData(completeData);
                            
                            // Clear localStorage
                            localStorage.removeItem('applicationPage1Data');
                            
                            // Show success message
                            alert('Application submitted successfully! A licensed agent will contact you within 24 hours.');
                            
                            // Hide application final modal
                            document.getElementById('application-final-modal').style.display = 'none';
                            
                        } catch (error) {
                            alert('Error submitting application. Please try again.');
                        } finally {
                            submitButton.innerHTML = originalText;
                            submitButton.disabled = false;
                        }
                    });
                }

                // SSN formatting for application final modal
                const ssnInput = document.getElementById('ssn');
                if (ssnInput) {
                    ssnInput.addEventListener('input', function(e) {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 5) {
                            value = value.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3');
                        } else if (value.length >= 3) {
                            value = value.replace(/(\d{3})(\d{0,2})/, '$1-$2');
                        }
                        e.target.value = value;
                    });
                }

                // Routing number formatting for application final modal
                const routingInput = document.getElementById('routing');
                if (routingInput) {
                    routingInput.addEventListener('input', function(e) {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length > 9) {
                            value = value.substring(0, 9);
                        }
                        e.target.value = value;
                    });
                }

                // SSN formatting for funnel application form
                const funnelSsnInput = document.getElementById('app-ssn');
                if (funnelSsnInput) {
                    funnelSsnInput.addEventListener('input', function(e) {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 5) {
                            value = value.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3');
                        } else if (value.length >= 3) {
                            value = value.replace(/(\d{3})(\d{0,2})/, '$1-$2');
                        }
                        e.target.value = value;
                    });
                }

                // Routing number formatting for funnel application form
                const funnelRoutingInput = document.getElementById('app-routing');
                if (funnelRoutingInput) {
                    funnelRoutingInput.addEventListener('input', function(e) {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length > 9) {
                            value = value.substring(0, 9);
                        }
                        e.target.value = value;
                    });
                }

                // Policy start date functionality
                const policyStartDateInput = document.getElementById('app-policy-start-date');
                
                if (policyStartDateInput) {
                    // Set minimum and maximum dates
                    const today = new Date();
                    const maxDate = new Date();
                    maxDate.setDate(today.getDate() + 30);
                    
                    const yyyy = today.getFullYear();
                    const mm = String(today.getMonth() + 1).padStart(2, '0');
                    const dd = String(today.getDate()).padStart(2, '0');
                    
                    const maxYyyy = maxDate.getFullYear();
                    const maxMm = String(maxDate.getMonth() + 1).padStart(2, '0');
                    const maxDd = String(maxDate.getDate()).padStart(2, '0');
                    
                    policyStartDateInput.min = `${yyyy}-${mm}-${dd}`;
                    policyStartDateInput.max = `${maxYyyy}-${maxMm}-${maxDd}`;
                    
                    // Add validation on change
                    policyStartDateInput.addEventListener('change', function(e) {
                        const selectedDate = new Date(e.target.value);
                        const today = new Date();
                        const maxDate = new Date();
                        maxDate.setDate(today.getDate() + 30);
                        
                        if (selectedDate < today) {
                            alert('Please select a date today or in the future.');
                            e.target.value = '';
                        } else if (selectedDate > maxDate) {
                            alert('Please select a date within the next 30 days.');
                            e.target.value = '';
                        }
                    });
                }
});