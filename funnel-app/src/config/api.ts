// API Configuration
import { GLOBAL_CONFIG } from './globalConfig'

export const API_CONFIG = {
  GOOGLE_APPS_SCRIPT_URL: GLOBAL_CONFIG.GOOGLE_APPS_SCRIPT_URL
}

// Helper function to get the API URL
export const getApiUrl = () => API_CONFIG.GOOGLE_APPS_SCRIPT_URL 