/**
 * Forms module for form handling and validation
 */
const FormsModule = (function() {
    'use strict';
    
    // Private variables
    let isInitialized = false;
    
    /**
     * Initialize form handling
     */
    function init() {
        if (isInitialized) {
            Config.log('warn', 'Forms module already initialized');
            return;
        }
        
        Config.log('info', 'Initializing forms module...');
        
        // Initialize form validation
        initializeFormValidation();
        
        // Initialize phone number formatting
        initializePhoneNumberFormatting();
        
        // Initialize height/weight dropdowns
        initializeHeightWeightDropdowns();
        
        // Initialize medical conditions logic
        initializeMedicalConditionsLogic();
        
        isInitialized = true;
        Config.log('info', '✅ Forms module initialized');
    }
    
    /**
     * Initialize form validation
     */
    function initializeFormValidation() {
        Config.log('info', 'Initializing form validation...');
        
        // Add validation to all form inputs
        const formInputs = document.querySelectorAll('input[required], select[required], textarea[required]');
        formInputs.forEach(input => {
            DOMUtils.addEventListener(input, 'blur', function() {
                validateField(input);
            });
            
            DOMUtils.addEventListener(input, 'input', function() {
                ValidationUtils.clearFieldError(input);
            });
        });
    }
    
    /**
     * Validate a single field
     */
    function validateField(field) {
        if (!field) return { valid: false, message: 'Field not found' };
        
        const value = field.value.trim();
        const fieldName = field.name || field.id || 'Field';
        
        // Check if required
        if (field.hasAttribute('required') && !value) {
            ValidationUtils.showFieldError(field, `${fieldName} is required`);
            return { valid: false, message: `${fieldName} is required` };
        }
        
        // Validate based on field type
        switch (field.type) {
            case 'email':
                const emailResult = ValidationUtils.validateEmail(value);
                if (!emailResult.valid) {
                    ValidationUtils.showFieldError(field, emailResult.message);
                    return emailResult;
                }
                break;
                
            case 'tel':
                const phoneResult = ValidationUtils.validatePhone(value);
                if (!phoneResult.valid) {
                    ValidationUtils.showFieldError(field, phoneResult.message);
                    return phoneResult;
                }
                break;
                
            case 'date':
                const dateResult = ValidationUtils.validateDateOfBirth(value);
                if (!dateResult.valid) {
                    ValidationUtils.showFieldError(field, dateResult.message);
                    return dateResult;
                }
                break;
        }
        
        ValidationUtils.clearFieldError(field);
        return { valid: true };
    }
    
    /**
     * Initialize phone number formatting
     */
    function initializePhoneNumberFormatting() {
        Config.log('info', 'Initializing phone number formatting...');
        
        const phoneInputs = document.querySelectorAll('input[type="tel"], input[name*="phone"]');
        phoneInputs.forEach(input => {
            DOMUtils.addEventListener(input, 'input', function() {
                ValidationUtils.formatPhoneNumber(input);
            });
        });
    }
    
    /**
     * Initialize height/weight dropdowns
     */
    function initializeHeightWeightDropdowns() {
        Config.log('info', 'Initializing height/weight dropdowns...');
        
        // Height dropdown
        const heightInput = document.getElementById('medical-height');
        const heightDropdown = document.getElementById('height-dropdown');
        
        if (heightInput && heightDropdown) {
            DOMUtils.addEventListener(heightInput, 'input', function() {
                filterDropdownItems(heightInput, heightDropdown);
            });
            
            DOMUtils.addEventListener(heightInput, 'keydown', function(e) {
                handleDropdownKeydown(e, heightInput, heightDropdown);
            });
        }
        
        // Weight dropdown
        const weightInput = document.getElementById('medical-weight');
        const weightDropdown = document.getElementById('weight-dropdown');
        
        if (weightInput && weightDropdown) {
            DOMUtils.addEventListener(weightInput, 'input', function() {
                filterDropdownItems(weightInput, weightDropdown);
            });
            
            DOMUtils.addEventListener(weightInput, 'keydown', function(e) {
                handleDropdownKeydown(e, weightInput, weightDropdown);
            });
        }
    }
    
    /**
     * Filter dropdown items based on input
     */
    function filterDropdownItems(input, dropdown) {
        const value = input.value.toLowerCase();
        const items = dropdown.querySelectorAll('.dropdown-item');
        
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(value)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    /**
     * Handle dropdown keyboard navigation
     */
    function handleDropdownKeydown(e, input, dropdown) {
        const items = dropdown.querySelectorAll('.dropdown-item:not([style*="display: none"])');
        const currentIndex = Array.from(items).findIndex(item => item.classList.contains('selected'));
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % items.length;
                selectDropdownItem(items, nextIndex, input);
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                const prevIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
                selectDropdownItem(items, prevIndex, input);
                break;
                
            case 'Enter':
                e.preventDefault();
                if (currentIndex >= 0) {
                    input.value = items[currentIndex].textContent;
                    dropdown.style.display = 'none';
                }
                break;
                
            case 'Escape':
                dropdown.style.display = 'none';
                break;
        }
    }
    
    /**
     * Select dropdown item
     */
    function selectDropdownItem(items, index, input) {
        items.forEach(item => item.classList.remove('selected'));
        if (items[index]) {
            items[index].classList.add('selected');
            input.value = items[index].textContent;
        }
    }
    
    /**
     * Initialize medical conditions logic
     */
    function initializeMedicalConditionsLogic() {
        Config.log('info', 'Initializing medical conditions logic...');
        
        const conditionCheckboxes = document.querySelectorAll('input[name="medical-conditions"]');
        conditionCheckboxes.forEach(checkbox => {
            DOMUtils.addEventListener(checkbox, 'change', function() {
                handleMedicalConditionChange();
            });
        });
    }
    
    /**
     * Handle medical condition changes
     */
    function handleMedicalConditionChange() {
        const selectedConditions = [];
        const checkboxes = document.querySelectorAll('input[name="medical-conditions"]:checked');
        
        checkboxes.forEach(checkbox => {
            selectedConditions.push(checkbox.value);
        });
        
        AppState.medical.answers.medicalConditions = selectedConditions;
        Config.log('info', 'Medical conditions updated:', selectedConditions);
    }
    
    /**
     * Get form data from a form element
     */
    function getFormData(form) {
        if (!form) return {};
        
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                // Handle multiple values (like checkboxes)
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }
        
        return data;
    }
    
    /**
     * Validate form data
     */
    function validateFormData(data, requiredFields = []) {
        return ValidationUtils.validateFormData(data, requiredFields);
    }
    
    /**
     * Submit form data
     */
    async function submitFormData(data) {
        return await APIModule.submitFormData(data);
    }
    
    // Public API
    return {
        init,
        validateField,
        getFormData,
        validateFormData,
        submitFormData,
        filterDropdownItems,
        handleDropdownKeydown,
        handleMedicalConditionChange
    };
})(); 