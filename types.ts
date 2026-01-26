
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  CENTER_ADMIN = 'CENTER_ADMIN',
  BRANCH_ADMIN = 'BRANCH_ADMIN',
  EDITOR = 'EDITOR'
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branchId?: string; // Branch assignment (for BRANCH_ADMIN)
  avatar?: string;
}

export interface Branch {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  phone: string;
  whatsapp: string;
  email?: string;
  weekdayHours?: string;
  weekendHours?: string;
  features?: Array<{ text: string; icon: string }>;
  lat: number;
  lng: number;
  image: string;
  teachers: Teacher[];
  customBanner?: string;
  successBanner?: string;
  logo?: string;
  primaryColor?: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  image?: string;
  branchId?: string;
  branch?: Branch;
  isActive: boolean;
  order: number;
  isPending?: boolean;
  pendingType?: 'CREATE' | 'UPDATE' | 'DELETE';
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  publishedAt?: string;
  isMain: boolean;
  branchId?: string;
  isFeatured: boolean;
  image: string;
}

export interface SliderItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  target: 'main' | string; // 'main' or branchId
  order: number;
  isActive: boolean;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

export interface YearlySuccess {
  id: string;
  year: string;
  totalDegrees: number;
  placementCount: number;
  successRate: number;
  cityCount: number;
  top100Count: number;
  top1000Count: number;
  yksAverage: number;
  lgsAverage: number;
  isActive: boolean;
  banner?: SuccessBanner;
  students?: TopStudent[];
}

export interface SuccessBanner {
  id: string;
  yearlySuccessId: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  highlightText?: string;
  gradientFrom: string;
  gradientTo: string;
}

export interface TopStudent {
  id: string;
  yearlySuccessId: string;
  name: string;
  rank: string;
  exam: string;
  image?: string;
  branch?: string;
  university?: string;
  score?: number;
  order: number;
}

export enum VideoCategory {
  YKS_TYT = 'YKS_TYT',
  YKS_AYT = 'YKS_AYT',
  YKS_YDT = 'YKS_YDT',
  LGS = 'LGS',
  KPSS = 'KPSS',
  DGS = 'DGS',
  ALES = 'ALES',
  SINIF_9 = 'SINIF_9',
  SINIF_10 = 'SINIF_10',
  SINIF_11 = 'SINIF_11',
  SINIF_12 = 'SINIF_12'
}

export interface VideoLesson {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string; // YouTube URL or video embed URL
  category: VideoCategory;
  subject: string; // Matematik, Fizik, Kimya, etc.
  duration: string; // "45:30" format
  views?: number;
  uploadDate: string;
  teacher?: string;
  difficulty?: 'Başlangıç' | 'Orta' | 'İleri';
}

export enum PackageType {
  YKS_2026 = 'YKS_2026',
  YKS_2027 = 'YKS_2027',
  LGS_2026 = 'LGS_2026',
  SINIF_9_10_11 = 'SINIF_9_10_11',
  SINIF_5_6_7 = 'SINIF_5_6_7',
  SINIF_1_2_3_4 = 'SINIF_1_2_3_4',
  KPSS = 'KPSS',
  DGS = 'DGS',
  ALES = 'ALES'
}

export interface EducationPackage {
  id: string;
  name: string;
  type: PackageType;
  description: string;
  shortDescription: string;
  price?: number;
  originalPrice?: number;
  image: string;
  features: string[];
  videoCount?: number;
  subjectCount?: number;
  duration?: string;
  isPopular?: boolean;
  isNew?: boolean;
  discount?: number;
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  order: number;
  parentId?: string;
  items?: MenuItem[];
}

export interface Menu {
  id: string;
  title: string;
  location: string;
  items: MenuItem[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  description?: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  template?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Media {
  id: string;
  url: string;
  thumbnail?: string;
  alt?: string;
  caption?: string;
  type: string;
  size?: number;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  type: string;
  status: 'PENDING' | 'CONTACTED' | 'REJECTED';
  createdAt: string;
}

// ============================================
// HOMEPAGE CONTENT TYPES
// ============================================

export interface BannerCard {
  id: string;
  icon: string;
  title: string;
  description: string;
  bgColor: string;
  hoverColor: string;
  link: string;
  buttonText?: string;
  order: number;
  isActive: boolean;
}

export interface Statistic {
  id: string;
  value: string;
  label: string;
  icon: string;
  order: number;
  isActive: boolean;
}

export interface Feature {
  id: string;
  title: string;
  description?: string;
  icon: string;
  section: string;
  features?: string[];
  order: number;
  isActive: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  image: string;
  readTime: string;
  isActive: boolean;
}

export interface ExamDate {
  id: string;
  examName: string;
  examDate: string;
  description?: string;
  order: number;
  isActive: boolean;
}

export interface SocialMedia {
  id: string;
  platform: string;
  url: string;
  order: number;
  isActive: boolean;
}

export interface YouTubeChannel {
  id: string;
  name: string;
  url: string;
  thumbnail: string;
  subscribers: string;
  videoCount: string;
  description: string;
  order: number;
  isActive: boolean;
}

export interface HomeSection {
  id: string;
  key: string;
  title: string;
  subtitle?: string;
  topTitle?: string;
  image?: string;
  bgImage?: string;
  link?: string;
  linkText?: string;
  order: number;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}
