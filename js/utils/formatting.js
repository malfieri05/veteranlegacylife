/**
 * Formatting utility functions
 */
const FormattingUtils = (function() {
    'use strict';
    
    /**
     * Format phone number for display
     */
    function formatPhoneDisplay(phone) {
        if (!phone) return '';
        
        const clean = phone.replace(/\D/g, '');
        if (clean.length !== 10) return phone;
        
        return `(${clean.slice(0,3)}) ${clean.slice(3,6)}-${clean.slice(6)}`;
    }
    
    /**
     * Format currency for display
     */
    function formatCurrency(amount, currency = 'USD') {
        if (typeof amount !== 'number') return '$0';
        
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }
    
    /**
     * Format number with commas
     */
    function formatNumber(num) {
        if (typeof num !== 'number') return '0';
        
        return new Intl.NumberFormat('en-US').format(num);
    }
    
    /**
     * Format date for display
     */
    function formatDate(date, options = {}) {
        if (!date) return '';
        
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        const formatOptions = { ...defaultOptions, ...options };
        
        try {
            return new Intl.DateTimeFormat('en-US', formatOptions).format(new Date(date));
        } catch (error) {
            Config.log('error', `Failed to format date: ${error.message}`);
            return date;
        }
    }
    
    /**
     * Format age with proper suffix
     */
    function formatAge(age) {
        if (typeof age !== 'number') return '0';
        
        const lastDigit = age % 10;
        const lastTwoDigits = age % 100;
        
        if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
            return `${age}th`;
        }
        
        switch (lastDigit) {
            case 1: return `${age}st`;
            case 2: return `${age}nd`;
            case 3: return `${age}rd`;
            default: return `${age}th`;
        }
    }
    
    /**
     * Format coverage amount for display
     */
    function formatCoverageAmount(amount) {
        if (!amount) return '$0';
        
        const num = parseInt(amount);
        if (isNaN(num)) return '$0';
        
        if (num >= 1000000) {
            return `$${(num / 1000000).toFixed(1)}M`;
        } else if (num >= 1000) {
            return `$${(num / 1000).toFixed(0)}K`;
        } else {
            return formatCurrency(num);
        }
    }
    
    /**
     * Format quote amount for display
     */
    function formatQuoteAmount(amount) {
        if (!amount) return '$0/month';
        
        const num = parseInt(amount);
        if (isNaN(num)) return '$0/month';
        
        return `${formatCurrency(num)}/month`;
    }
    
    /**
     * Format name for display
     */
    function formatName(firstName, lastName) {
        if (!firstName && !lastName) return '';
        if (!firstName) return lastName;
        if (!lastName) return firstName;
        
        return `${firstName} ${lastName}`;
    }
    
    /**
     * Format address for display
     */
    function formatAddress(address) {
        if (!address) return '';
        
        const parts = [];
        if (address.street) parts.push(address.street);
        if (address.city) parts.push(address.city);
        if (address.state) parts.push(address.state);
        if (address.zip) parts.push(address.zip);
        
        return parts.join(', ');
    }
    
    /**
     * Format time for display
     */
    function formatTime(date) {
        if (!date) return '';
        
        try {
            return new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }).format(new Date(date));
        } catch (error) {
            Config.log('error', `Failed to format time: ${error.message}`);
            return date;
        }
    }
    
    /**
     * Format duration in seconds to human readable
     */
    function formatDuration(seconds) {
        if (typeof seconds !== 'number') return '0s';
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    }
    
    /**
     * Truncate text with ellipsis
     */
    function truncateText(text, maxLength = 50) {
        if (!text || text.length <= maxLength) return text;
        
        return text.substring(0, maxLength) + '...';
    }
    
    /**
     * Capitalize first letter of each word
     */
    function capitalizeWords(text) {
        if (!text) return '';
        
        return text.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
    
    // Public API
    return {
        formatPhoneDisplay,
        formatCurrency,
        formatNumber,
        formatDate,
        formatAge,
        formatCoverageAmount,
        formatQuoteAmount,
        formatName,
        formatAddress,
        formatTime,
        formatDuration,
        truncateText,
        capitalizeWords
    };
})(); 