/**
 * Feature detection utilities
 */
const FeatureUtils = (function() {
    'use strict';
    
    // Feature detection cache
    const featureCache = new Map();
    
    /**
     * Check if Promise is supported
     */
    function hasPromiseSupport() {
        if (featureCache.has('promise')) {
            return featureCache.get('promise');
        }
        
        const hasPromise = typeof Promise !== 'undefined';
        featureCache.set('promise', hasPromise);
        return hasPromise;
    }
    
    /**
     * Check if Fetch API is supported
     */
    function hasFetchSupport() {
        if (featureCache.has('fetch')) {
            return featureCache.get('fetch');
        }
        
        const hasFetch = typeof fetch !== 'undefined';
        featureCache.set('fetch', hasFetch);
        return hasFetch;
    }
    
    /**
     * Check if Intersection Observer is supported
     */
    function hasIntersectionObserver() {
        if (featureCache.has('intersectionObserver')) {
            return featureCache.get('intersectionObserver');
        }
        
        const hasIntersectionObserver = typeof IntersectionObserver !== 'undefined';
        featureCache.set('intersectionObserver', hasIntersectionObserver);
        return hasIntersectionObserver;
    }
    
    /**
     * Check if CSS custom properties are supported
     */
    function hasCSSCustomProperties() {
        if (featureCache.has('cssCustomProperties')) {
            return featureCache.get('cssCustomProperties');
        }
        
        const hasCSSCustomProperties = CSS.supports('color', 'var(--test)');
        featureCache.set('cssCustomProperties', hasCSSCustomProperties);
        return hasCSSCustomProperties;
    }
    
    /**
     * Check if Service Worker is supported
     */
    function hasServiceWorker() {
        if (featureCache.has('serviceWorker')) {
            return featureCache.get('serviceWorker');
        }
        
        const hasServiceWorker = 'serviceWorker' in navigator;
        featureCache.set('serviceWorker', hasServiceWorker);
        return hasServiceWorker;
    }
    
    /**
     * Check if localStorage is supported
     */
    function hasLocalStorage() {
        if (featureCache.has('localStorage')) {
            return featureCache.get('localStorage');
        }
        
        let hasLocalStorage = false;
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            hasLocalStorage = true;
        } catch (e) {
            hasLocalStorage = false;
        }
        
        featureCache.set('localStorage', hasLocalStorage);
        return hasLocalStorage;
    }
    
    /**
     * Check if sessionStorage is supported
     */
    function hasSessionStorage() {
        if (featureCache.has('sessionStorage')) {
            return featureCache.get('sessionStorage');
        }
        
        let hasSessionStorage = false;
        try {
            const test = 'test';
            sessionStorage.setItem(test, test);
            sessionStorage.removeItem(test);
            hasSessionStorage = true;
        } catch (e) {
            hasSessionStorage = false;
        }
        
        featureCache.set('sessionStorage', hasSessionStorage);
        return hasSessionStorage;
    }
    
    /**
     * Check if requestAnimationFrame is supported
     */
    function hasRequestAnimationFrame() {
        if (featureCache.has('requestAnimationFrame')) {
            return featureCache.get('requestAnimationFrame');
        }
        
        const hasRequestAnimationFrame = typeof requestAnimationFrame !== 'undefined';
        featureCache.set('requestAnimationFrame', hasRequestAnimationFrame);
        return hasRequestAnimationFrame;
    }
    
    /**
     * Check if performance API is supported
     */
    function hasPerformanceAPI() {
        if (featureCache.has('performance')) {
            return featureCache.get('performance');
        }
        
        const hasPerformance = typeof performance !== 'undefined' && performance.now;
        featureCache.set('performance', hasPerformance);
        return hasPerformance;
    }
    
    /**
     * Check if modern JavaScript features are supported
     */
    function hasModernJSFeatures() {
        if (featureCache.has('modernJS')) {
            return featureCache.get('modernJS');
        }
        
        const features = {
            arrowFunctions: (() => true)(),
            templateLiterals: `test` === 'test',
            destructuring: (() => { const {a} = {a: 1}; return a === 1; })(),
            spreadOperator: (() => { const arr = [...[1,2,3]]; return arr.length === 3; })(),
            asyncAwait: (() => { try { eval('async function test() {}'); return true; } catch(e) { return false; } })()
        };
        
        const hasModernJS = Object.values(features).every(Boolean);
        featureCache.set('modernJS', hasModernJS);
        return hasModernJS;
    }
    
    /**
     * Get browser information
     */
    function getBrowserInfo() {
        const userAgent = navigator.userAgent;
        const browserInfo = {
            userAgent: userAgent,
            isChrome: /Chrome/.test(userAgent) && !/Edge/.test(userAgent),
            isFirefox: /Firefox/.test(userAgent),
            isSafari: /Safari/.test(userAgent) && !/Chrome/.test(userAgent),
            isEdge: /Edge/.test(userAgent),
            isIE: /MSIE|Trident/.test(userAgent),
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
        };
        
        return browserInfo;
    }
    
    /**
     * Check if all required features are available
     */
    function checkRequiredFeatures() {
        const requiredFeatures = {
            promise: hasPromiseSupport(),
            fetch: hasFetchSupport(),
            localStorage: hasLocalStorage(),
            requestAnimationFrame: hasRequestAnimationFrame(),
            modernJS: hasModernJSFeatures()
        };
        
        const missingFeatures = Object.entries(requiredFeatures)
            .filter(([name, supported]) => !supported)
            .map(([name]) => name);
        
        if (missingFeatures.length > 0) {
            Config.log('error', `Missing required features: ${missingFeatures.join(', ')}`);
            return false;
        }
        
        Config.log('info', '✅ All required features are supported');
        return true;
    }
    
    /**
     * Get feature support report
     */
    function getFeatureReport() {
        return {
            required: {
                promise: hasPromiseSupport(),
                fetch: hasFetchSupport(),
                localStorage: hasLocalStorage(),
                requestAnimationFrame: hasRequestAnimationFrame(),
                modernJS: hasModernJSFeatures()
            },
            optional: {
                intersectionObserver: hasIntersectionObserver(),
                cssCustomProperties: hasCSSCustomProperties(),
                serviceWorker: hasServiceWorker(),
                sessionStorage: hasSessionStorage(),
                performance: hasPerformanceAPI()
            },
            browser: getBrowserInfo()
        };
    }
    
    // Public API
    return {
        hasPromiseSupport,
        hasFetchSupport,
        hasIntersectionObserver,
        hasCSSCustomProperties,
        hasServiceWorker,
        hasLocalStorage,
        hasSessionStorage,
        hasRequestAnimationFrame,
        hasPerformanceAPI,
        hasModernJSFeatures,
        getBrowserInfo,
        checkRequiredFeatures,
        getFeatureReport
    };
})(); 