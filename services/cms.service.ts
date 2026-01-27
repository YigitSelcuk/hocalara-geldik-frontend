import api from './api';

// Menu Service
export const menuService = {
    getAll: () => api.get('/menus'),
    getById: (id: string) => api.get(`/menus/${id}`),
    create: (data: any) => api.post('/menus', data),
    update: (id: string, data: any) => api.put(`/menus/${id}`, data),
    delete: (id: string) => api.delete(`/menus/${id}`),
};

// Page Service
export const pageService = {
    getAll: (params?: any) => api.get('/pages', { params }),
    getById: (id: string) => api.get(`/pages/${id}`),
    getBySlug: (slug: string) => api.get(`/pages/slug/${slug}`),
    create: (data: any) => api.post('/pages', data),
    update: (id: string, data: any) => api.put(`/pages/${id}`, data),
    delete: (id: string) => api.delete(`/pages/${id}`),
};

// News Service
export const newsService = {
    getAll: () => api.get('/news'),
    getById: (id: string) => api.get(`/news/${id}`),
    create: (data: any) => api.post('/news', data),
    update: (id: string, data: any) => api.put(`/news/${id}`, data),
    delete: (id: string) => api.delete(`/news/${id}`),
};

// Slider Service
export const sliderService = {
    getAll: (params?: any) => api.get('/sliders', { params }),
    getById: (id: string) => api.get(`/sliders/${id}`),
    create: (data: any) => api.post('/sliders', data),
    update: (id: string, data: any) => api.put(`/sliders/${id}`, data),
    delete: (id: string) => api.delete(`/sliders/${id}`),
};

// Category Service
export const categoryService = {
    getAll: () => api.get('/categories'),
    getById: (id: string) => api.get(`/categories/${id}`),
    create: (data: any) => api.post('/categories', data),
    update: (id: string, data: any) => api.put(`/categories/${id}`, data),
    delete: (id: string) => api.delete(`/categories/${id}`),
};

// User Service
export const userService = {
    getAll: () => api.get('/users'),
    getMe: () => api.get('/auth/me'),
    create: (data: any) => api.post('/users', data),
    update: (id: string, data: any) => api.put(`/users/${id}`, data),
    delete: (id: string) => api.delete(`/users/${id}`),
};

// Branch Service
export const branchService = {
    getAll: () => api.get('/branches'),
    getById: (id: string) => api.get(`/branches/${id}`),
    getBySlug: (slug: string) => api.get(`/branches/slug/${slug}`),
    create: (data: any) => api.post('/branches', data),
    update: (id: string, data: any) => api.put(`/branches/${id}`, data),
    delete: (id: string) => api.delete(`/branches/${id}`),
};

// Settings Service
export const settingsService = {
    get: () => api.get('/settings'),
    update: (data: any) => api.post('/settings/bulk', { settings: data }),
};

// Lead Service
export const leadService = {
    getAll: () => api.get('/contact'),
    getById: (id: string) => api.get(`/contact/${id}`),
    delete: (id: string) => api.delete(`/contact/${id}`),
};

// Media Service
export const mediaService = {
    getAll: () => api.get('/media'),
    upload: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/media/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    delete: (id: string) => api.delete(`/media/${id}`),
};

// Video/Lesson Service (assuming routes follow general pattern)
export const videoService = {
    getAll: () => api.get('/videos'),
    create: (data: any) => api.post('/videos', data),
    update: (id: string, data: any) => api.put(`/videos/${id}`, data),
    delete: (id: string) => api.delete(`/videos/${id}`),
};

// Education Package Service
export const packageService = {
    getAll: () => api.get('/packages'),
    create: (data: any) => api.post('/packages', data),
    update: (id: string, data: any) => api.put(`/packages/${id}`, data),
    delete: (id: string) => api.delete(`/packages/${id}`),
};
