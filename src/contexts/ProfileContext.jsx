import { createContext, useContext, useState, useEffect } from 'react';
import LoadingSpinner from '../components/loading-spinner';
import AuthenticationService from '../services/AuthenticationService';
import { useAuth } from './AuthContext';

// Create Profile Context
const ProfileContext = createContext({
    profile: null,
    loading: true,
    refreshProfile: () => {},
    setProfile: () => {},
});

// Profile Context Provider
export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, userInfo, accessToken } = useAuth();

    const fetchProfile = async () => {
        setLoading(true);
        try {
            // If we already have userInfo from Zoho in auth context, use it first
            if (isAuthenticated && userInfo) {
                console.log('Using profile data from auth context:', userInfo);
                setProfile(userInfo);
                setLoading(false);
                return;
            }
            
            // If authenticated with a token but no profile, try to fetch it
            if (isAuthenticated && accessToken) {
                try {
                    console.log('Fetching complete profile from Zoho with token');
                    const zohoProfile = await AuthenticationService.fetchZohoCompleteProfile(accessToken);
                    if (zohoProfile) {
                        console.log('Successfully fetched complete profile from Zoho:', zohoProfile);
                        setProfile(zohoProfile);
                        // Update the stored auth data with this profile
                        const authData = AuthenticationService.getAuthData();
                        if (authData) {
                            authData.userInfo = zohoProfile;
                            AuthenticationService.saveAuthData(authData);
                        }
                        setLoading(false);
                        return;
                    }
                } catch (zohoError) {
                    console.error('Error fetching Zoho profile:', zohoError);
                    // Continue to try other methods
                }
            }
            
            // Fallback to original profile fetching method (if you have a backend endpoint)
            // const response = {};
            // if (response && response.data && response.data.data) {
            //     setProfile(response.data.data);
            // } else {
            //     console.warn('Profile data not found in expected structure');
            //     setProfile(null);
            // }
            
            // If we get here, we couldn't get a profile
            if (!profile) {
                console.warn('No profile data available');
                setProfile(null);
            }
        } catch (error) {
            console.error('Error in profile fetching flow:', error);
            setProfile(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Only fetch profile if authenticated
        if (isAuthenticated) {
            fetchProfile();
        } else {
            // If not authenticated, clear profile and set loading to false
            setProfile(null);
            setLoading(false);
        }
    }, [isAuthenticated, accessToken]);

    // If auth state changes (e.g., user logs in), update profile
    useEffect(() => {
        if (isAuthenticated && userInfo && !profile) {
            setProfile(userInfo);
        }
    }, [isAuthenticated, userInfo]);

    return (
        <ProfileContext.Provider value={{ 
            profile, 
            loading, 
            refreshProfile: fetchProfile, 
            setProfile,
            // Add computed properties for easier access
            name: profile?.displayName || profile?.firstName || null,
            email: profile?.email || profile?.emailId || null,
            firstName: profile?.firstName || null,
            lastName: profile?.lastName || null,
            zohoId: profile?.zohoId || null,
            // Organization information
            customerId: profile?.customerId || null,
            shopName: profile?.shopName || null,
            shopLocation: profile?.shopLocation || null,
            shopInfo: profile?.shopInfo || null,
            helpAndSupport: profile?.helpAndSupport || null,
            organizations: profile?.organizations || null,
            // For direct access to the first store
            store: profile?.productList?.[0]?.storeUrl?.[0] || profile?.shopInfo || null
        }}>
            {loading ? <LoadingSpinner /> : children}
        </ProfileContext.Provider>
    );
};

// Hook to use the profile context
export const useProfile = () => useContext(ProfileContext);

export default ProfileContext;
