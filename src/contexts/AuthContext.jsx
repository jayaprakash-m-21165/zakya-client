import { createContext, useContext, useState, useEffect } from 'react';
import AuthenticationService from '../services/AuthenticationService';
import { apiAuthorize } from '../services/AuthService';
import { AUTH_DOMAIN } from '../constants/app.constant';
import appConfig from '../configs/app.config';
import LoadingSpinner from '../components/loading-spinner';

// Create Authentication Context
const AuthContext = createContext({
    isAuthenticated: false,
    userInfo: null,
    loading: true,
});

// Auth Context Provider
export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        userInfo: null,
        accessToken: null, // Store Zoho token
        loading: true,
    });

    // Fetch auth status on initial load
    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                // Skip auth check on the OAuth redirect path - let CollectToken component handle it
                if (window.location.pathname === appConfig.zohoOAuthRedirectPath) {
                    // Just set loading to false and return
                    // The CollectToken component will handle the token parsing
                    setAuthState(prevState => ({
                        ...prevState,
                        loading: false
                    }));
                    return;
                }

                // Try to get auth data from localStorage (which now includes Zoho token handling)
                const localAuthData = AuthenticationService.getAuthData();
                
                if (localAuthData && localAuthData.isAuthorized && localAuthData.accessToken) {
                    // User has valid Zoho token in localStorage
                    setAuthState({
                        isAuthenticated: true,
                        userInfo: localAuthData.userInfo,
                        accessToken: localAuthData.accessToken,
                        loading: false,
                    });
                    return;
                }
                
                // If no local auth data or it's invalid, check server authentication (your existing flow)
                // This part might need to be re-evaluated based on whether Zoho is the SOLE IdP
                // or if your backend still issues its own session/token after Zoho auth.
                // try {
                //     // const serverAuthData = await apiAuthorize(); // Your existing backend auth check
                    
                //     if (serverAuthData && serverAuthData.isAuthorized) {
                //         AuthenticationService.saveAuthData(serverAuthData); // This might need adjustment if it overwrites Zoho token
                        
                //         setAuthState({
                //             isAuthenticated: true,
                //             userInfo: serverAuthData.userInfo,
                //             accessToken: null, // Or serverAuthData.token if your backend issues one
                //             loading: false,
                //         });
                //         return;
                //     }
                // } catch (error) {
                //     console.log('Server authentication failed (apiAuthorize)', error);
                //     // Don't clear auth data here yet, as Zoho might be the primary source
                // }
                
                // If all checks fail, user is not authenticated
                setAuthState({
                    isAuthenticated: false,
                    userInfo: null,
                    accessToken: null,
                    loading: false,
                });
                
                // If not on the login page or the collectToken page, redirect to Zoho auth
                const isPublicPage = window.location.pathname === appConfig.unAuthenticatedEntryPath;
                const isCollectTokenPage = window.location.pathname === appConfig.zohoOAuthRedirectPath;
                
                if (!isPublicPage && !isCollectTokenPage) {
                    console.log('Redirecting to Zoho OAuth for authentication');
                    AuthenticationService.redirectToZohoAuth();
                }
            } catch (error) {
                console.error('Error checking authentication status in AuthProvider', error);
                setAuthState({
                    isAuthenticated: false,
                    userInfo: null,
                    accessToken: null,
                    loading: false,
                });
                
                // Don't redirect if on the login page or collectToken page
                const isPublicPage = window.location.pathname === appConfig.unAuthenticatedEntryPath;
                const isCollectTokenPage = window.location.pathname === appConfig.zohoOAuthRedirectPath;
                
                if (!isPublicPage && !isCollectTokenPage) {
                    console.log('Error occurred, redirecting to Zoho OAuth');
                    AuthenticationService.redirectToZohoAuth();
                }
            }
        };

        checkAuthentication();
    }, []);

    return (
        <AuthContext.Provider value={authState}>
            {authState.loading ? <LoadingSpinner /> : children}
        </AuthContext.Provider>
    );
};

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
