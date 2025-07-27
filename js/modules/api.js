/**
 * API module for Google Apps Script communication
 */
const APIModule = (function() {
    'use strict';
    
    // Private variables
    let isInitialized = false;
    
    /**
     * Test Google Apps Script connection
     */
    async function testConnection() {
        try {
            Config.log('info', 'Testing Google Apps Script connection...');
            
            const response = await fetch(Config.GOOGLE_APPS_SCRIPT_URL, {
                method: 'GET',
                mode: 'no-cors'
            });
            
            Config.log('info', 'Connection test successful');
            return { success: true, message: 'Connection successful' };
        } catch (error) {
            Config.log('error', `Connection test failed: ${error.message}`);
            return { success: false, message: error.message };
        }
    }
    
    /**
     * Submit form data to Google Apps Script
     */
    async function submitFormData(data) {
        try {
            Config.log('info', '=== START: submitFormData ===');
            Config.log('info', 'Input data:', data);
            
            // Validate data
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid data format');
            }
            
            // Convert data to URL-encoded string
            const params = new URLSearchParams();
            Object.keys(data).forEach(key => {
                const value = data[key];
                if (value !== null && value !== undefined) {
                    if (Array.isArray(value)) {
                        params.append(key, value.join(','));
                    } else {
                        params.append(key, String(value));
                    }
                }
            });
            
            const requestBody = params.toString();
            Config.log('info', 'Request body length:', requestBody.length);
            Config.log('info', 'Request body preview:', requestBody.substring(0, 100) + '...');
            Config.log('info', 'Target URL:', Config.GOOGLE_APPS_SCRIPT_URL);
            
            // Make the request
            Config.log('info', 'Making fetch request...');
            const response = await fetch(Config.GOOGLE_APPS_SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: requestBody
            });
            
            Config.log('info', 'Response received');
            Config.log('info', 'Response status:', response.status);
            Config.log('info', 'Response status text:', response.statusText);
            Config.log('info', 'Response URL:', response.url);
            
            // Parse response
            const responseText = await response.text();
            Config.log('info', 'Response headers:', Object.fromEntries(response.headers.entries()));
            
            let result;
            try {
                result = JSON.parse(responseText);
                Config.log('info', 'Response is OK, parsing JSON...');
            } catch (parseError) {
                Config.log('warn', 'Failed to parse JSON response:', parseError.message);
                result = { result: 'success', message: responseText };
            }
            
            Config.log('info', 'Parsed result:', result);
            Config.log('info', '=== END: submitFormData (SUCCESS) ===');
            
            return result;
        } catch (error) {
            Config.log('error', `=== END: submitFormData (ERROR) ===`);
            Config.log('error', `Error submitting form data: ${error.message}`);
            return { result: 'error', error: error.message };
        }
    }
    
    /**
     * Send session start email
     */
    async function sendSessionStartEmail(sessionId) {
        try {
            Config.log('info', '=== SENDING SESSION START EMAIL ===');
            
            const sessionData = {
                sessionId: sessionId,
                formType: 'SessionStart',
                funnelProgress: 'Started',
                timestamp: new Date().toISOString()
            };
            
            Config.log('info', 'Session start data:', sessionData);
            
            const result = await submitFormData(sessionData);
            
            if (result.result === 'success') {
                Config.log('info', '=== SESSION START EMAIL SENT ===');
            } else {
                Config.log('error', 'Failed to send session start email:', result.error);
            }
            
            return result;
        } catch (error) {
            Config.log('error', `Error sending session start email: ${error.message}`);
            return { result: 'error', error: error.message };
        }
    }
    
    /**
     * Send abandonment email
     */
    async function sendAbandonmentEmail(sessionId, stepNumber) {
        try {
            Config.log('info', '=== SENDING ABANDONMENT EMAIL ===');
            
            const abandonmentData = {
                sessionId: sessionId,
                formType: 'Abandoned',
                funnelProgress: `Abandoned at step ${stepNumber}`,
                timestamp: new Date().toISOString()
            };
            
            Config.log('info', 'Abandonment data:', abandonmentData);
            
            const result = await submitFormData(abandonmentData);
            
            if (result.result === 'success') {
                Config.log('info', '=== ABANDONMENT EMAIL SENT ===');
            } else {
                Config.log('error', 'Failed to send abandonment email:', result.error);
            }
            
            return result;
        } catch (error) {
            Config.log('error', `Error sending abandonment email: ${error.message}`);
            return { result: 'error', error: error.message };
        }
    }
    
    /**
     * Send complete funnel data
     */
    async function sendCompleteFunnelData(funnelData, medicalAnswers) {
        try {
            Config.log('info', '=== START: sendCompleteFunnelData ===');
            Config.log('info', 'funnelData:', funnelData);
            Config.log('info', 'medicalAnswers:', medicalAnswers);
            
            // Combine all data
            const completeData = {
                ...funnelData,
                ...medicalAnswers,
                formType: 'Funnel',
                funnelProgress: 'Completed',
                timestamp: new Date().toISOString()
            };
            
            Config.log('info', 'Complete data being sent:', completeData);
            
            // Validate required fields
            const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
            const missingFields = requiredFields.filter(field => !completeData[field]);
            
            if (missingFields.length > 0) {
                Config.log('warn', 'Missing required fields:', missingFields);
            }
            
            Config.log('info', 'Data validation - Required fields:');
            requiredFields.forEach(field => {
                Config.log('info', `- ${field}: ${!!completeData[field]}`);
            });
            
            Config.log('info', 'Calling submitFormData...');
            const result = await submitFormData(completeData);
            
            Config.log('info', 'submitFormData result:', result);
            
            if (result.result === 'success') {
                Config.log('info', '=== END: sendCompleteFunnelData (SUCCESS) ===');
            } else {
                Config.log('error', '=== END: sendCompleteFunnelData (ERROR) ===');
                Config.log('error', 'Failed to send complete funnel data:', result.error);
            }
            
            return result;
        } catch (error) {
            Config.log('error', `=== END: sendCompleteFunnelData (ERROR) ===`);
            Config.log('error', `Error sending complete funnel data: ${error.message}`);
            return { result: 'error', error: error.message };
        }
    }
    
    /**
     * Send partial funnel data for hybrid collection
     */
    async function sendPartialFunnelData(funnelData, stepNumber) {
        try {
            Config.log('info', '=== SENDING PARTIAL FUNNEL DATA ===');
            
            const partialData = {
                ...funnelData,
                formType: 'Partial',
                funnelProgress: `Step ${stepNumber}`,
                timestamp: new Date().toISOString()
            };
            
            Config.log('info', 'Partial data being sent:', partialData);
            
            const result = await submitFormData(partialData);
            
            if (result.result === 'success') {
                Config.log('info', '=== PARTIAL DATA SENT SUCCESSFULLY ===');
            } else {
                Config.log('error', 'Failed to send partial data:', result.error);
            }
            
            return result;
        } catch (error) {
            Config.log('error', `Error sending partial funnel data: ${error.message}`);
            return { result: 'error', error: error.message };
        }
    }
    
    /**
     * Initialize the API module
     */
    function init() {
        if (isInitialized) {
            Config.log('warn', 'API module already initialized');
            return;
        }
        
        Config.log('info', 'Initializing API module...');
        
        // Test connection on initialization
        testConnection().then(result => {
            if (result.success) {
                Config.log('info', '✅ Google Apps Script connection verified');
            } else {
                Config.log('error', '❌ Google Apps Script connection failed');
            }
        });
        
        isInitialized = true;
        Config.log('info', '✅ API module initialized');
    }
    
    // Public API
    return {
        init,
        testConnection,
        submitFormData,
        sendSessionStartEmail,
        sendAbandonmentEmail,
        sendCompleteFunnelData,
        sendPartialFunnelData
    };
})(); 