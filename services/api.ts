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

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
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
        }
        return Promise.reject(error);
    }
);

export default api;
