import apiClient, { handleApiError } from './api';

export interface Slider {
    id: string;
    title: string;
    subtitle?: string;
    image: string;
    mobileImage?: string;
    link?: string;
    target: string;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

class SliderService {
    async getAll(params?: { target?: string; isActive?: boolean }): Promise<Slider[]> {
        try {
            const response = await apiClient.get('/sliders', { params });
            return response.data.sliders;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    async getById(id: string): Promise<Slider> {
        try {
            const response = await apiClient.get(`/sliders/${id}`);
            return response.data.slider;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    async create(data: Partial<Slider>): Promise<Slider> {
        try {
            const response = await apiClient.post('/sliders', data);
            return response.data.slider;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    async update(id: string, data: Partial<Slider>): Promise<Slider> {
        try {
            const response = await apiClient.put(`/sliders/${id}`, data);
            return response.data.slider;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await apiClient.delete(`/sliders/${id}`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    async reorder(sliders: Array<{ id: string; order: number }>): Promise<void> {
        try {
            await apiClient.post('/sliders/reorder', { sliders });
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
}

export default new SliderService();
