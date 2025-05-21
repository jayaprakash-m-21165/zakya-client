import ApiService from './ApiService';
import { BACKEND_DOMAIN } from '../constants/app.constant';

/**
 * Authorize user by checking HTTP-only cookies
 * @returns {Promise<Object>} Authorization data with isAuthorized flag and userInfo
 */
export async function apiAuthorize() {
    try {
        const response = await ApiService.fetchData({
            url: `https://${BACKEND_DOMAIN}/auth/authorize`,
            method: 'get',
            withCredentials: true, // Important to send cookies
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function apiSignIn(data) {
    try {
        const response = await ApiService.fetchData({
            url: `https://${BACKEND_DOMAIN}/auth/sign-in`,
            method: 'post',
            data,
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function apiSignUp(data) {
    return ApiService.fetchDataWithAxios({
        url: `https://${BACKEND_DOMAIN}/auth/sign-up`,
        method: 'post',
        data,
    });
}

export async function apiForgotPassword(data) {
    return ApiService.fetchDataWithAxios({
        url: `https://${BACKEND_DOMAIN}/auth/forgot-password`,
        method: 'post',
        data,
    });
}

export async function apiResetPassword(data) {
    return ApiService.fetchDataWithAxios({
        url: `https://${BACKEND_DOMAIN}/auth/reset-password`,
        method: 'post',
        data,
    });
}

/**
 * Sign out the user by clearing cookies
 * @returns {Promise<Object>} Response from sign-out endpoint
 */
export async function apiSignOut() {
    console.log('AuthService: Starting sign-out process');
    try {
        const response = await ApiService.fetchData({
            url: `https://${BACKEND_DOMAIN}/auth/sign-out`,
            method: 'post',
            withCredentials: true,
        });
        console.log('AuthService: Sign-out successful', response);
        return response;
    } catch (error) {
        console.error('AuthService: Sign-out failed', error);
        throw error;
    }
}
