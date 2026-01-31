import axios from 'axios';

// Backend API base URL
export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// For handling multiple concurrent requests during refresh
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Helper for logout
const handleLogout = () => {
    // Only redirect to login if we're already on an admin page
    const currentPath = window.location.hash.replace('#', '');
    if (currentPath.startsWith('/admin') && currentPath !== '/admin/login') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.hash = '/admin/login';
    }
};

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function(resolve, reject) {
                    failedQueue.push({resolve, reject});
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    // Call refresh endpoint directly using axios to avoid interceptor loop
                    const response = await axios.post('/api/auth/refresh', {
                        refreshToken: refreshToken
                    });

                    if (response.data.accessToken) {
                        const { accessToken, refreshToken: newRefreshToken } = response.data;
                        
                        localStorage.setItem('accessToken', accessToken);
                        // Also update adminToken for compatibility
                        localStorage.setItem('adminToken', accessToken);
                        
                        if (newRefreshToken) {
                            localStorage.setItem('refreshToken', newRefreshToken);
                        }

                        api.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
                        originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;

                        processQueue(null, accessToken);
                        isRefreshing = false;

                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    isRefreshing = false;
                    
                    // If refresh fails, logout
                    handleLogout();
                    return Promise.reject(refreshError);
                }
            } else {
                // No refresh token, logout
                isRefreshing = false;
                handleLogout();
            }
        }

        return Promise.reject(error);
    }
);

export const handleApiError = (error: any): string => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    if (error.message) {
        return error.message;
    }
    return 'An unexpected error occurred';
};

export default api;
