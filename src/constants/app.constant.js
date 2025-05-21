// Application constants
export const APP_DOMAIN = window.location.hostname;
export const AUTH_DOMAIN = 'auth.zakya-pos.com';
export const BACKEND_DOMAIN = 'api.zakya-pos.com';
// export const BACKEND_DOMAIN = 'backend.development.com:8000';
// export const AUTH_DOMAIN = 'auth.development.com:3001';
export const API_BASE_URL = `https://${BACKEND_DOMAIN}/api`;

// Authentication paths
export const AUTH_PREFIX_PATH = '/auth';
export const PUBLIC_PREFIX_PATH = '/public';

// Route constants
export const APP_NAME = 'Zakya POS';

export const BUSINESS_ROLE = "Business Owner";
export const CASHIER_ROLE = "Cashier";
export const MANAGER_ROLE = "Manager";
export const INVENTORY_ROLE = "Inventory Manager";
export const ADMIN_ROLE = "Admin";
export const STAFF_ROLE = "Staff";

export const USER_ROLES = {
    BUSINESS: "business",
    CASHIER: "cashier",
    MANAGER: "manager",
    INVENTORY: "inventory",
    ADMIN: "admin",
    STAFF: "staff",
}
export const USER_ROLES_LIST = {
    [USER_ROLES.BUSINESS]: BUSINESS_ROLE,
    [USER_ROLES.CASHIER]: CASHIER_ROLE,
    [USER_ROLES.MANAGER]: MANAGER_ROLE,
    [USER_ROLES.INVENTORY]: INVENTORY_ROLE,
    [USER_ROLES.ADMIN]: ADMIN_ROLE,
    [USER_ROLES.STAFF]: STAFF_ROLE,
};
export const POS_DASHBOARD_URL = "https://dashboard.zakya-pos.com";

// Map of app card keys to their availability by user role
export const APP_CARD_AVAILABILITY = {
    POS_DASHBOARD:   [USER_ROLES.BUSINESS, USER_ROLES.CASHIER, USER_ROLES.MANAGER, USER_ROLES.ADMIN, USER_ROLES.STAFF],
    INVENTORY:       [USER_ROLES.BUSINESS, USER_ROLES.INVENTORY, USER_ROLES.MANAGER, USER_ROLES.ADMIN],
    REPORTS:         [USER_ROLES.BUSINESS, USER_ROLES.MANAGER, USER_ROLES.ADMIN],
    CUSTOMER_CRM:    [USER_ROLES.BUSINESS, USER_ROLES.MANAGER, USER_ROLES.CASHIER, USER_ROLES.ADMIN, USER_ROLES.STAFF],
    SETTINGS:        [USER_ROLES.BUSINESS, USER_ROLES.ADMIN],
};

// Load Zoho OAuth credentials from environment variables
export const ZOHO_OAUTH_CLIENT_ID = import.meta.env.VITE_ZOHO_OAUTH_CLIENT_ID;
export const ZOHO_OAUTH_CLIENT_SECRET = import.meta.env.VITE_ZOHO_OAUTH_CLIENT_SECRET; // Note: Secret is not typically used by client in implicit flow

// Zoho OAuth Constants
export const ZOHO_OAUTH_REDIRECT_PATH = '/collectToken'; // Your redirect path
export const ZOHO_OAUTH_AUTHORIZE_URL = 'https://accounts.zoho.com/oauth/v2/auth';
// Adjust scopes as per your application's requirements from Zoho APIs
export const ZOHO_OAUTH_SCOPE = import.meta.env.VITE_ZOHO_SCOPE;
export const ZOHO_OAUTH_RESPONSE_TYPE = 'token'; // For implicit grant flow
export const ZOHO_ACCOUNTS_BASE_URL = 'https://accounts.zoho.com'; // Or your specific Zoho domain if different