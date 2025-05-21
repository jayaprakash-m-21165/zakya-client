import ApiService from './ApiService';
import { 
    APP_DOMAIN, 
    BACKEND_DOMAIN, 
    AUTH_DOMAIN,
    ZOHO_OAUTH_CLIENT_ID,
    ZOHO_OAUTH_REDIRECT_PATH,
    ZOHO_OAUTH_AUTHORIZE_URL,
    ZOHO_OAUTH_SCOPE,
    ZOHO_OAUTH_RESPONSE_TYPE,
    ZOHO_ACCOUNTS_BASE_URL
} from '../constants/app.constant';
import appConfig from '../configs/app.config';

const AuthenticationService = {
  /**
   * Check if user is authenticated by checking HTTP-only cookies
   * @returns {Promise} User data if authenticated, throws error if not
   */
  // checkServerAuthentication: async () => {
  //   try {
  //     const response = await ApiService.fetchData({
  //       url: `https://${BACKEND_DOMAIN}/auth/authorize`,
  //       method: 'get',
  //       withCredentials: true, // Important to send cookies
  //     });
  //     return response.data;
  //   } catch (error) {
  //     throw error;
  //   }
  // },
  
  /**
   * Redirect to Zoho OAuth for authentication
   */
  redirectToZohoAuth: () => {
    if (typeof window !== 'undefined') {
      try {
        // Calculate the redirect URI based on current origin
        const redirectUri = `${window.location.origin}${ZOHO_OAUTH_REDIRECT_PATH}`;
        
        // Create state parameter for security (optional but recommended)
        const state = Math.random().toString(36).substring(2, 15);
        localStorage.setItem('zoho_auth_state', state);
        
        // Build the authorization URL
        const authUrl = `${ZOHO_OAUTH_AUTHORIZE_URL}?` + 
          `scope=${encodeURIComponent(ZOHO_OAUTH_SCOPE)}` +
          `&client_id=${ZOHO_OAUTH_CLIENT_ID}` +
          `&response_type=${ZOHO_OAUTH_RESPONSE_TYPE}` +
          `&redirect_uri=${encodeURIComponent(redirectUri)}` +
          `&state=${state}` +
          `&access_type=online`;
        
        console.log('Redirecting to Zoho OAuth:', authUrl);
        window.location.href = authUrl;
      } catch (error) {
        console.error('Error redirecting to Zoho OAuth:', error);
        // Fallback to a generic error page or login page
        window.location.href = appConfig.unAuthenticatedEntryPath || '/login';
      }
    }
  },

  /**
   * Fetch user profile information from Zoho using the access token
   * @param {string} accessToken - The Zoho OAuth access token
   * @returns {Promise<Object>} User profile information
   */
  fetchZohoUserProfile: async (accessToken) => {
    try {
      console.log('Fetching Zoho user profile with token');
      
      const options = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };
      
      // Try to fetch with our CORS handling helper that now uses proxy
      const profileData = await AuthenticationService.fetchWithCORSHandling(
        'https://accounts.zoho.com/oauth/user/info', 
        options
      );
      
      console.log('Zoho user profile data:', profileData);
      
      // If we got a limited response from the no-cors fallback
      if (profileData.limited) {
        console.log('Working with limited profile data due to CORS restrictions');
        return {
          provider: 'zoho',
          accessToken: accessToken, // Store the token so we can use it later
          limited: true
        };
      }
      
      // Return standardized user info
      return {
        firstName: profileData.First_Name,
        lastName: profileData.Last_Name,
        email: profileData.Email,
        displayName: profileData.Display_Name,
        zohoId: profileData.ZUID,
        provider: 'zoho',
        profileData: profileData // Include the full profile data for reference
      };
    } catch (error) {
      console.error('Error in fetchZohoUserProfile:', error);
      // Return a minimal profile rather than failing completely
      return {
        provider: 'zoho',
        accessToken: accessToken,
        error: error.message
      };
    }
  },
  
  /**
   * Handle the OAuth redirect from Zoho, parse the token from URL hash,
   * and fetch user profile information
   * @returns {Promise<Object|null>} Authentication data with user profile if successful
   */
  handleZohoOAuthCallback: async () => {
    if (typeof window !== 'undefined' && window.location.hash) {
      try {
        console.log('Processing OAuth hash:', window.location.hash);
        const params = new URLSearchParams(window.location.hash.substring(1)); // Remove '#'
        const accessToken = params.get('access_token');
        const expiresIn = params.get('expires_in');
        const tokenType = params.get('token_type');
        const scope = params.get('scope');
        
        if (!accessToken) {
          console.error('No access_token found in URL hash');
          return null;
        }
        
        console.log('Token extracted successfully');
        
        // Fetch complete user profile information using the token
        let userInfo = { provider: 'zoho' }; // Default minimal user info
        
        try {
          // Use the new complete profile fetching method that includes org info
          userInfo = await AuthenticationService.fetchZohoCompleteProfile(accessToken);
          console.log('Complete user profile fetched successfully:', userInfo);
        } catch (profileError) {
          console.error('Error fetching complete profile, proceeding with limited user info:', profileError);
          // Continue with limited user info rather than failing completely
        }
        
        // Create auth data with token and user info
        const authData = {
          accessToken,
          expiresIn: parseInt(expiresIn, 10) || 3600, // Default to 1 hour if not provided
          tokenType: tokenType || 'Bearer',
          scope,
          isAuthorized: true,
          tokenReceivedAt: Date.now(),
          userInfo
        };
        
        // Save the auth data
        AuthenticationService.saveAuthData(authData);
        
        return authData;
      } catch (error) {
        console.error('Error processing OAuth callback:', error);
        return null;
      }
    } else {
      console.error('No hash fragment in URL');
      return null;
    }
  },

  /**
   * Save authentication data to localStorage with a cleaner structure
   * @param {Object} authData Authentication data to save
   */
  saveAuthData: (authData) => {
    if (typeof window !== 'undefined') {
      // Store Zoho token along with other auth data
      const cleanedData = {
        userInfo: authData.userInfo,
        isAuthorized: authData.isAuthorized,
        expires: authData.expires, // Standard JWT expiry
        accessToken: authData.accessToken, // Zoho access token
        tokenExpiresIn: authData.expiresIn, // Zoho token expiry (seconds)
        tokenReceivedAt: Date.now() // Store when the token was received
      };
      localStorage.setItem('auth_data', JSON.stringify(cleanedData));
    }
  },
  
  /**
   * Get authentication data from localStorage
   * @returns {Object|null} Authentication data if exists
   */
  getAuthData: () => {
    if (typeof window !== 'undefined') {
      const authDataString = localStorage.getItem('auth_data');
      if (!authDataString) return null;
      
      const authData = JSON.parse(authDataString);
      
      // Check if Zoho token has expired
      if (authData.accessToken && authData.tokenReceivedAt && authData.tokenExpiresIn) {
        const tokenAge = (Date.now() - authData.tokenReceivedAt) / 1000; // in seconds
        if (tokenAge >= authData.tokenExpiresIn) {
          console.log('Zoho access token has expired.');
          // Optionally, you could try to refresh the token here if using a refresh token
          // For implicit grant, usually means re-authentication
          AuthenticationService.clearAuthData(); // Clear expired data
          return null;
        }
      }
      // Handle legacy nested structure if it exists (if applicable to your old structure)
      if (authData.userInfo && authData.userInfo.userInfo) {
        return {
          ...authData, // spread other properties like accessToken
          userInfo: authData.userInfo.userInfo,
          isAuthorized: authData.isAuthorized || authData.userInfo.isAuthorized,
        };
      }
      return authData;
    }
    return null;
  },
  
  /**
   * Clear authentication data from localStorage
   */
  clearAuthData: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_data');
      console.log('Authentication data cleared from localStorage');
      // Redirect to home page after logout
      window.location.href = "/"; 
    }
  },
  
  /**
   * Redirect to authentication domain (original function, might need adjustment)
   */
  redirectToAuth: () => {
    if (typeof window !== 'undefined') {
      // This now might mean redirecting to Zoho or your own auth page that then decides
      // For now, let's assume it means redirecting to Zoho if not authenticated
      AuthenticationService.redirectToZohoAuth();
      // Original line:
      // window.location.href = `https://${AUTH_DOMAIN}?referrer=${APP_DOMAIN}`;
    }
  },
  
  /**
   * Fetch the user's organization and product information from Zoho
   * @param {string} accessToken - The Zoho OAuth access token
   * @returns {Promise<Object>} Organization and product information
   */
  fetchZohoOrgInfo: async (accessToken) => {
    try {
      console.log('Fetching Zoho organization information');
      
      const options = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };
      
      // Try to fetch with our CORS handling helper that now uses proxy
      const orgData = await AuthenticationService.fetchWithCORSHandling(
        "https://api.zakya.com/v1/organizations",
        options
      );
      
      console.log('Zoho org data:', orgData);
      
      // If we got a limited response due to CORS fallback
      if (orgData.limited) {
        console.log('Working with limited org data due to CORS restrictions');
        return {
          limited: true
        };
      }
      
      return orgData;
    } catch (error) {
      console.error('Error in fetchZohoOrgInfo:', error);
      // Return a minimal object rather than failing completely
      return {
        error: error.message
      };
    }
  },
  
  /**
   * Fetch all user profile information - combines basic profile and org info
   * @param {string} accessToken - The Zoho OAuth access token
   * @returns {Promise<Object>} Complete user profile with basic info and org details
   */
  fetchZohoCompleteProfile: async (accessToken) => {
    try {
      console.log('Fetching complete Zoho profile with token:', accessToken);
      
      // Fetch basic user profile - this won't throw errors anymore
      const basicProfile = await AuthenticationService.fetchZohoUserProfile(accessToken);
      console.log('Basic profile fetched:', basicProfile);
      
      // Then fetch organization information - this won't throw errors anymore
      const orgInfo = await AuthenticationService.fetchZohoOrgInfo(accessToken);
      console.log('Organization info fetched:', orgInfo);
      
      // Combine the data, handling possible missing or limited data
      const completeProfile = {
        ...basicProfile, // Include all basic profile properties first
        organizations: orgInfo || null,
        // Extract useful fields from org data for easier access
        customerId: orgInfo?.customerId,
        emailId: orgInfo?.emailId || basicProfile?.email,
        shopInfo: orgInfo?.productList?.[0]?.storeUrl?.[0] || null,
        shopName: orgInfo?.productList?.[0]?.storeUrl?.[0]?.shopName || null,
        shopLocation: orgInfo?.productList?.[0]?.storeUrl?.[0]?.shopLocation || null,
        helpAndSupport: orgInfo?.helpAndSupport || null,
        
        // Include additional fields that might be helpful
        provider: 'zoho',
        accessToken, // Store token for potential later use
        
        // Note limitations in profile data
        limitedProfile: basicProfile?.limited || false,
        limitedOrgInfo: orgInfo?.limited || false
      };
      
      return completeProfile;
    } catch (error) {
      console.error('Error in complete profile flow:', error);
      // Still return a minimal profile rather than failing completely
      return {
        provider: 'zoho',
        accessToken,
        error: error.message,
        errorInCompleteProfile: true
      };
    }
  },
  
  /**
   * Helper function to handle CORS issues by trying both direct and proxied approaches
   * @param {string} url - The API URL to fetch
   * @param {Object} options - Fetch options including headers, method, etc.
   * @returns {Promise<Object>} The JSON response
   */
  fetchWithCORSHandling: async (url, options) => {
    try {
      // First attempt: Try with proxy URL
      const proxyUrl = url.replace('https://accounts.zoho.com', '/zoho-accounts')
                          .replace('https://api.zakya.com', '/zoho-api');
      
      console.log(`Attempting API call with proxy: ${proxyUrl}`);
      const proxyResponse = await fetch(proxyUrl, options);
      
      if (proxyResponse.ok) {
        return await proxyResponse.json();
      }
      
      // If proxy fails, try direct call as fallback
      console.log(`Proxy call failed, status: ${proxyResponse.status}. Trying direct API call to ${url}`);
      const response = await fetch(url, options);
      
      if (response.ok) {
        return await response.json();
      }
      
      console.log(`Direct API call failed, status: ${response.status}`);
      const errorText = await response.text();
      console.log(`Error text: ${errorText}`);
      
      if (response.status === 0 || response.status === 403 || errorText.includes('CORS')) {
        console.log('CORS issue detected, trying alternative approach');
        
        // Try with different CORS settings
        const corsOptions = {
          ...options,
          mode: 'no-cors', // This might help in some cases but will limit response access
          credentials: 'omit' // Try without credentials
        };
        console.log('Attempting with no-cors mode');
        const noCorsResponse = await fetch(url, corsOptions);
        
        // Note: With no-cors mode, we can't read the response
        if (noCorsResponse.type === 'opaque') {
          console.log('Received opaque response with no-cors mode');
          // We can't read the response content, but we can assume it worked
          // and try to proceed with minimal information
          return { success: true, limited: true };
        }
      }
      
      // If all attempts fail, throw an error
      throw new Error(`API call failed with status: ${response.status}`);
    } catch (error) {
      console.error(`Error in fetchWithCORSHandling for ${url}:`, error);
      throw error;
    }
  },
};

export default AuthenticationService;
