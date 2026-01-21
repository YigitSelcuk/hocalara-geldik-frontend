import apiClient, { handleApiError } from './api';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
    role: string;
    branchId?: string;
}

export interface AuthResponse {
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
        avatar?: string;
        branchId?: string;
        branch?: any;
    };
    accessToken: string;
    refreshToken: string;
}

class AuthService {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            const response = await apiClient.post('/auth/login', credentials);
            const { user, accessToken, refreshToken } = response.data;

            // Store tokens and user
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));

            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    async register(data: RegisterData): Promise<{ user: any }> {
        try {
            const response = await apiClient.post('/auth/register', data);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    async logout(): Promise<void> {
        try {
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        }
    }

    async getCurrentUser(): Promise<{ user: any }> {
        try {
            const response = await apiClient.get('/auth/me');
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    getStoredUser(): any {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('accessToken');
    }

    hasRole(...roles: string[]): boolean {
        const user = this.getStoredUser();
        return user && roles.includes(user.role);
    }
}

export default new AuthService();
