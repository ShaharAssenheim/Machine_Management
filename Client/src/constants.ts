/**
 * Application Constants
 * Centralized configuration and constants for the client application
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
} as const;

// Authentication
export const AUTH_CONFIG = {
  TOKEN_KEY: 'auth_token',
  USER_KEY: 'auth_user',
  TOKEN_EXPIRY_HOURS: 24,
} as const;

// Polling Intervals
export const POLLING_INTERVALS = {
  MACHINES_REFRESH: 30000, // 30 seconds
  STATUS_CHECK: 60000, // 1 minute
} as const;

// UI Constants
export const UI_CONSTANTS = {
  SIDEBAR_WIDTH: 288, // 72 * 4 = 288px (w-72)
  SIDEBAR_COLLAPSED_WIDTH: 80, // w-20
  MOBILE_BREAKPOINT: 1024, // lg breakpoint
  DEFAULT_MACHINE_IMAGE: '/ONYX-3000.png',
} as const;

// Status Colors
export const STATUS_COLORS = {
  RUNNING: '#10B981', // Emerald Green
  IDLE: '#EAB308', // Amber Yellow
  MAINTENANCE: '#3B82F6', // Sky Blue
  ERROR: '#EF4444', // Red
} as const;

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_CENTER: [20, 0] as [number, number],
  DEFAULT_ZOOM: 2,
  MAX_ZOOM: 18,
  MIN_ZOOM: 2,
  CLUSTER_MAX_RADIUS: 60,
} as const;

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  EMAIL_PATTERN: /^[a-zA-Z0-9._%+-]+@rigaku\.com$/,
  PASSWORD_PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  AUTH_FAILED: 'Authentication failed. Please login again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  NOT_FOUND: 'Resource not found.',
  PERMISSION_DENIED: 'Permission denied.',
} as const;

// Routes
export const ROUTES = {
  DASHBOARD: 'dashboard',
  MAP: 'map',
  MACHINES: 'machines',
  SETTINGS: 'settings',
} as const;
