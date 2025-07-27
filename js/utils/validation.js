/**
 * Form validation utility functions
 */
const ValidationUtils = (function() {
    'use strict';
    
    /**
     * Validate phone number format
     */
    function validatePhone(phone) {
        if (!phone) return { valid: false, message: 'Phone number is required' };
        
        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length !== 10) {
            return { valid: false, message: Config.VALIDATION.phone.message };
        }
        
        return { valid: true, formatted: `(${cleanPhone.slice(0,3)}) ${cleanPhone.slice(3,6)}-${cleanPhone.slice(6)}` };
    }
    
    /**
     * Validate email format
     */
    function validateEmail(email) {
        if (!email) return { valid: false, message: 'Email is required' };
        
        if (!Config.VALIDATION.email.pattern.test(email)) {
            return { valid: false, message: Config.VALIDATION.email.message };
        }
        
        return { valid: true };
    }
    
    /**
     * Validate SSN format
     */
    function validateSSN(ssn) {
        if (!ssn) return { valid: false, message: 'SSN is required' };
        
        if (!Config.VALIDATION.ssn.pattern.test(ssn)) {
            return { valid: false, message: Config.VALIDATION.ssn.message };
        }
        
        return { valid: true };
    }
    
    /**
     * Validate required field
     */
    function validateRequired(value, fieldName) {
        if (!value || value.trim() === '') {
            return { valid: false, message: `${fieldName} is required` };
        }
        return { valid: true };
    }
    
    /**
     * Validate date of birth and calculate age
     */
    function validateDateOfBirth(dateString) {
        if (!dateString) return { valid: false, message: 'Date of birth is required' };
        
        const date = new Date(dateString);
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        const monthDiff = today.getMonth() - date.getMonth();
        
        let calculatedAge = age;
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
            calculatedAge--;
        }
        
        if (calculatedAge < 18) {
            return { valid: false, message: 'You must be at least 18 years old' };
        }
        
        if (calculatedAge > 85) {
            return { valid: false, message: 'Age must be 85 or younger' };
        }
        
        return { valid: true, age: calculatedAge };
    }
    
    /**
     * Validate form data object
     */
    function validateFormData(data, requiredFields = []) {
        const errors = [];
        
        // Check required fields
        requiredFields.forEach(field => {
            const result = validateRequired(data[field], field);
            if (!result.valid) {
                errors.push(result.message);
            }
        });
        
        // Validate specific field types
        if (data.phone) {
            const phoneResult = validatePhone(data.phone);
            if (!phoneResult.valid) {
                errors.push(phoneResult.message);
            }
        }
        
        if (data.email) {
            const emailResult = validateEmail(data.email);
            if (!emailResult.valid) {
                errors.push(emailResult.message);
            }
        }
        
        if (data.dateOfBirth) {
            const dobResult = validateDateOfBirth(data.dateOfBirth);
            if (!dobResult.valid) {
                errors.push(dobResult.message);
            }
        }
        
        if (data.ssn) {
            const ssnResult = validateSSN(data.ssn);
            if (!ssnResult.valid) {
                errors.push(ssnResult.message);
            }
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    }
    
    /**
     * Show field error
     */
    function showFieldError(field, message) {
        if (!field) return;
        
        // Remove existing error
        clearFieldError(field);
        
        // Add error class
        field.classList.add('error');
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = 'color: #dc2626; font-size: 0.875rem; margin-top: 0.25rem;';
        
        // Insert after field
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
    
    /**
     * Clear field error
     */
    function clearFieldError(field) {
        if (!field) return;
        
        field.classList.remove('error');
        
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    /**
     * Validate and format phone number on input
     */
    function formatPhoneNumber(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.length >= 6) {
            value = `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6,10)}`;
        } else if (value.length >= 3) {
            value = `(${value.slice(0,3)}) ${value.slice(3)}`;
        }
        
        input.value = value;
    }
    
    /**
     * Validate and format SSN on input
     */
    function formatSSN(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.length >= 5) {
            value = `${value.slice(0,3)}-${value.slice(3,5)}-${value.slice(5,9)}`;
        } else if (value.length >= 3) {
            value = `${value.slice(0,3)}-${value.slice(3)}`;
        }
        
        input.value = value;
    }
    
    // Public API
    return {
        validatePhone,
        validateEmail,
        validateSSN,
        validateRequired,
        validateDateOfBirth,
        validateFormData,
        showFieldError,
        clearFieldError,
        formatPhoneNumber,
        formatSSN
    };
})(); 