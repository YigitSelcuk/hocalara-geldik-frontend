import api from './api';
import {
    BannerCard,
    Statistic,
    Feature,
    BlogPost,
    ExamDate,
    SocialMedia,
    YouTubeChannel,
    YearlySuccess,
    TopStudent,
    HomeSection,
    Teacher
} from '../types';

// Banner Cards Service
export const bannerCardService = {
    getAll: () => api.get('/banner-cards'),
    getById: (id: string) => api.get(`/banner-cards/${id}`),
    create: (data: any) => api.post('/banner-cards', data),
    update: (id: string, data: any) => api.put(`/banner-cards/${id}`, data),
    delete: (id: string) => api.delete(`/banner-cards/${id}`),
};

// Statistics Service
export const statisticService = {
    getAll: () => api.get('/statistics'),
    getById: (id: string) => api.get(`/statistics/${id}`),
    create: (data: any) => api.post('/statistics', data),
    update: (id: string, data: any) => api.put(`/statistics/${id}`, data),
    delete: (id: string) => api.delete(`/statistics/${id}`),
};

// Features Service
export const featureService = {
    getAll: (section?: string) => api.get('/features', { params: { section } }),
    getById: (id: string) => api.get(`/features/${id}`),
    create: (data: any) => api.post('/features', data),
    update: (id: string, data: any) => api.put(`/features/${id}`, data),
    delete: (id: string) => api.delete(`/features/${id}`),
};

// Blog Posts Service
export const blogPostService = {
    getAll: (category?: string) => api.get('/blog-posts', { params: { category } }),
    getById: (id: string) => api.get(`/blog-posts/${id}`),
    create: (data: any) => api.post('/blog-posts', data),
    update: (id: string, data: any) => api.put(`/blog-posts/${id}`, data),
    delete: (id: string) => api.delete(`/blog-posts/${id}`),
};

// Exam Dates Service
export const examDateService = {
    getAll: () => api.get('/exam-dates'),
    getById: (id: string) => api.get(`/exam-dates/${id}`),
    create: (data: any) => api.post('/exam-dates', data),
    update: (id: string, data: any) => api.put(`/exam-dates/${id}`, data),
    delete: (id: string) => api.delete(`/exam-dates/${id}`),
};

// Social Media Service
export const socialMediaService = {
    getAll: () => api.get('/social-media'),
    getById: (id: string) => api.get(`/social-media/${id}`),
    create: (data: any) => api.post('/social-media', data),
    update: (id: string, data: any) => api.put(`/social-media/${id}`, data),
    delete: (id: string) => api.delete(`/social-media/${id}`),
};

export const youtubeChannelService = {
    getAll: () => api.get('/youtube-channels'),
    getById: (id: string) => api.get(`/youtube-channels/${id}`),
    create: (data: any) => api.post('/youtube-channels', data),
    update: (id: string, data: any) => api.put(`/youtube-channels/${id}`, data),
    delete: (id: string) => api.delete(`/youtube-channels/${id}`),
};

export const yearlySuccessService = {
    getAll: () => api.get<YearlySuccess[]>('/yearly-successes'),
    getByYear: (year: string) => api.get<YearlySuccess>(`/yearly-successes/year/${year}`),
    create: (data: Partial<YearlySuccess>) => api.post<YearlySuccess>('/yearly-successes', data),
    update: (id: string, data: Partial<YearlySuccess>) => api.put<YearlySuccess>(`/yearly-successes/${id}`, data),
    delete: (id: string) => api.delete(`/yearly-successes/${id}`),
    addStudent: (yearlySuccessId: string, data: Partial<TopStudent>) => api.post(`/yearly-successes/${yearlySuccessId}/students`, data),
    deleteStudent: (yearlySuccessId: string, studentId: string) => api.delete(`/yearly-successes/${yearlySuccessId}/students/${studentId}`)
};

export const homeSectionService = {
    getAll: () => api.get<HomeSection[]>('/home-sections'),
    getByKey: (key: string) => api.get<HomeSection>(`/home-sections/${key}`),
    create: (data: Partial<HomeSection>) => api.post<HomeSection>('/home-sections', data),
    update: (id: string, data: Partial<HomeSection>) => api.put<HomeSection>(`/home-sections/${id}`, data),
    delete: (id: string) => api.delete(`/home-sections/${id}`)
};

export const teacherService = {
    getAll: () => api.get<Teacher[]>('/teachers'),
    create: (data: Partial<Teacher>) => api.post<Teacher>('/teachers', data),
    update: (id: string, data: Partial<Teacher>) => api.put<Teacher>(`/teachers/${id}`, data),
    delete: (id: string) => api.delete(`/teachers/${id}`)
};
