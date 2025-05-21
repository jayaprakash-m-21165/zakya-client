import axios from 'axios';
import { BACKEND_DOMAIN } from '../../constants/app.constant';

const AxiosBase = axios.create({
  baseURL: `https://${BACKEND_DOMAIN}`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor
AxiosBase.interceptors.request.use(
  (config) => {
    // You can modify config here before sending the request
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Add response interceptor
AxiosBase.interceptors.response.use(
  (response) => {
    // Return successful response
    return response;
  },
  (error) => {
    // Handle response error, including 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Clear local authentication data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_data');
      }
    }
    return Promise.reject(error);
  }
);

export default AxiosBase;
