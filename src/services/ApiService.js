import AxiosBase from './axios/AxiosBase';

const ApiService = {
    fetchDataWithAxios(param) {
        return new Promise((resolve, reject) => {
            AxiosBase(param)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((errors) => {
                    reject(errors);
                });
        });
    },
    
    /**
     * Enhanced fetch data method with better error handling and cookie support
     * @param {Object} options Request options
     * @returns {Promise} Promise with response data
     */
    fetchData(options) {
        return new Promise((resolve, reject) => {
            AxiosBase({
                ...options,
                withCredentials: options.withCredentials !== false, // Enable cookies by default
            })
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
        });
    }
};

export default ApiService;
