import apiClient, { handleApiError } from './api';

export interface Page {
    id: string;
    type: 'REGULAR' | 'NEWS' | 'BLOG' | 'PHOTO_GALLERY' | 'VIDEO_GALLERY';
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    featuredImage?: string;
    categoryId?: string;
    branchId?: string;
    isApproved: boolean;
    isFeatured: boolean;
    publishedAt?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    createdAt: string;
    updatedAt: string;
}

class PageService {
    async getAll(params?: {
        type?: string;
        status?: string;
        categoryId?: string;
        branchId?: string;
        isApproved?: boolean;
        isFeatured?: boolean;
        page?: number;
        limit?: number;
    }): Promise<{ pages: Page[]; pagination: any }> {
        try {
            const response = await apiClient.get('/pages', { params });
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    async getById(id: string): Promise<Page> {
        try {
            const response = await apiClient.get(`/pages/${id}`);
            return response.data.page;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    async getBySlug(slug: string): Promise<Page> {
        try {
            const response = await apiClient.get(`/pages/slug/${slug}`);
            return response.data.page;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    async create(data: Partial<Page>): Promise<Page> {
        try {
            const response = await apiClient.post('/pages', data);
            return response.data.page;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    async update(id: string, data: Partial<Page>): Promise<Page> {
        try {
            const response = await apiClient.put(`/pages/${id}`, data);
            return response.data.page;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await apiClient.delete(`/pages/${id}`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    async publish(id: string): Promise<Page> {
        try {
            const response = await apiClient.post(`/pages/${id}/publish`);
            return response.data.page;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    async approve(id: string, isFeatured?: boolean): Promise<Page> {
        try {
            const response = await apiClient.post(`/pages/${id}/approve`, { isFeatured });
            return response.data.page;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
}

export default new PageService();
