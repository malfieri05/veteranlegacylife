// API Configuration
import { GLOBAL_CONFIG } from './globalConfig';

export const API_CONFIG = {
  GOOGLE_APPS_SCRIPT_URL: GLOBAL_CONFIG.GOOGLE_APPS_SCRIPT.URL
} as const;

export const getApiUrl = () => API_CONFIG.GOOGLE_APPS_SCRIPT_URL 