import api from './api';

export const systemService = {
    seedDatabase: (reset: boolean = false) => api.post('/system/seed', { reset })
};
