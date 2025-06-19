// Veteran Legacy Life - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeFormHandling();
    initializeSmoothScrolling();
    initializeAnimations();
    initializePhoneNumberFormatting();
    initializeFormValidation();

    // Funnel state management
    let funnelData = {};
    const funnelSteps = [
        'funnel-state-form',
        'funnel-military-form',
        'funnel-branch-form',
        'funnel-marital-form',
        'funnel-coverage-form',
        'funnel-contact-form'
    ];

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
            goToNextStep('funnel-state-form');
        }
    });

    // Military status selection
    document.querySelectorAll('#funnel-military-form input[name="militaryStatus"]').forEach(input => {
        input.addEventListener('change', () => {
            funnelData.militaryStatus = input.value;
            setTimeout(() => goToNextStep('funnel-military-form'), 300);
        });
    });

    // Branch selection
    document.querySelectorAll('#funnel-branch-form input[name="branchOfService"]').forEach(input => {
        input.addEventListener('change', () => {
            funnelData.branchOfService = input.value;
            setTimeout(() => goToNextStep('funnel-branch-form'), 300);
        });
    });

    // Marital status selection
    document.querySelectorAll('#funnel-marital-form input[name="maritalStatus"]').forEach(input => {
        input.addEventListener('change', () => {
            funnelData.maritalStatus = input.value;
            setTimeout(() => goToNextStep('funnel-marital-form'), 300);
        });
    });

    // Coverage amount selection
    document.querySelectorAll('#funnel-coverage-form input[name="coverageAmount"]').forEach(input => {
        input.addEventListener('change', () => {
            funnelData.coverageAmount = input.value;
            setTimeout(() => goToNextStep('funnel-coverage-form'), 300);
        });
    });

    // Contact form submission - handle with Netlify Forms
    document.getElementById('funnel-contact-form').addEventListener('submit', function(e) {
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
            e.preventDefault();
        }

        if (!isValid) {
            e.preventDefault();
        } else {
            // Let Netlify handle the form submission
            // Show success message after a brief delay
            setTimeout(() => {
                showSuccessModal();
                // Reset the form
                this.reset();
                resetFunnel();
            }, 1000);
        }
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
        const successModal = document.querySelector('.success-modal');
        successModal.style.display = 'flex';
        
        // Auto close after 3 seconds
        setTimeout(() => {
            successModal.style.display = 'none';
            // Reset the funnel form
            resetFunnel();
        }, 3000);
    }

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

        // Simulate API call (replace with actual endpoint)
        await simulateApiCall(data);
        
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

// Simulate API call
function simulateApiCall(data) {
    return new Promise((resolve) => {
        // Simulate network delay
        setTimeout(() => {
            console.log('Form data submitted:', data);
            resolve({ success: true });
        }, 2000);
    });
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