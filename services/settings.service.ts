import apiClient, { handleApiError } from './api';

export interface Settings {
    [key: string]: string;
}

class SettingsService {
    async getAll(): Promise<Settings> {
        try {
            const response = await apiClient.get('/settings');
            return response.data.settings;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    async getByKey(key: string): Promise<string> {
        try {
            const response = await apiClient.get(`/settings/key/${key}`);
            return response.data.setting.value;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    async getByGroup(group: string): Promise<Settings> {
        try {
            const response = await apiClient.get(`/settings/group/${group}`);
            return response.data.settings;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    async update(key: string, value: string): Promise<void> {
        try {
            await apiClient.put(`/settings/${key}`, { value });
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    async updateMultiple(settings: Settings): Promise<void> {
        try {
            await apiClient.post('/settings/bulk', { settings });
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
}

export default new SettingsService();
