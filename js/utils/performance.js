/**
 * Performance utilities for debouncing and throttling
 */
const PerformanceUtils = (function() {
    'use strict';
    
    /**
     * Debounce function calls
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * Throttle function calls
     */
    function throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    /**
     * Debounce with immediate option
     */
    function debounceImmediate(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }
    
    /**
     * Throttle with leading/trailing options
     */
    function throttleAdvanced(func, limit, options = {}) {
        let inThrottle;
        let lastFunc;
        let lastRan;
        
        return function executedFunction(...args) {
            const context = this;
            
            if (!inThrottle) {
                if (options.leading !== false) {
                    func.apply(context, args);
                }
                lastRan = Date.now();
                inThrottle = true;
                
                setTimeout(() => {
                    inThrottle = false;
                    if (options.trailing !== false && lastFunc) {
                        func.apply(context, lastFunc);
                        lastFunc = null;
                    }
                }, limit);
            } else {
                lastFunc = args;
            }
        };
    }
    
    /**
     * Batch DOM updates
     */
    function batchDOMUpdates(updates) {
        return new Promise(resolve => {
            requestAnimationFrame(() => {
                updates.forEach(update => {
                    try {
                        update();
                    } catch (error) {
                        Config.log('error', `DOM update failed: ${error.message}`);
                    }
                });
                resolve();
            });
        });
    }
    
    /**
     * Measure function performance
     */
    function measurePerformance(func, name = 'Function') {
        return function(...args) {
            const start = performance.now();
            const result = func.apply(this, args);
            const end = performance.now();
            
            Config.log('info', `${name} took ${(end - start).toFixed(2)}ms`);
            return result;
        };
    }
    
    /**
     * Create a performance monitor
     */
    function createPerformanceMonitor() {
        const metrics = {
            calls: 0,
            totalTime: 0,
            averageTime: 0,
            minTime: Infinity,
            maxTime: 0
        };
        
        return {
            measure: function(func, name = 'Function') {
                return function(...args) {
                    const start = performance.now();
                    const result = func.apply(this, args);
                    const end = performance.now();
                    const duration = end - start;
                    
                    metrics.calls++;
                    metrics.totalTime += duration;
                    metrics.averageTime = metrics.totalTime / metrics.calls;
                    metrics.minTime = Math.min(metrics.minTime, duration);
                    metrics.maxTime = Math.max(metrics.maxTime, duration);
                    
                    Config.log('info', `${name} performance: ${duration.toFixed(2)}ms (avg: ${metrics.averageTime.toFixed(2)}ms)`);
                    return result;
                };
            },
            getMetrics: function() {
                return { ...metrics };
            },
            reset: function() {
                Object.assign(metrics, {
                    calls: 0,
                    totalTime: 0,
                    averageTime: 0,
                    minTime: Infinity,
                    maxTime: 0
                });
            }
        };
    }
    
    // Public API
    return {
        debounce,
        throttle,
        debounceImmediate,
        throttleAdvanced,
        batchDOMUpdates,
        measurePerformance,
        createPerformanceMonitor
    };
})(); 