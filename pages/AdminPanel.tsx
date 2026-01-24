import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  Building2, FileText, Video, Package, Settings, Sparkles, X, Play
} from 'lucide-react';
import {
  sliderService, newsService, branchService,
  videoService, packageService, userService,
  menuService, pageService, categoryService,
  mediaService
} from '../services/cms.service';
import {
  bannerCardService, statisticService, featureService,
  blogPostService, examDateService, socialMediaService,
  youtubeChannelService, yearlySuccessService, homeSectionService,
  teacherService
} from '../services/homepage.service';
import {
  SliderItem, AdminUser, UserRole, NewsItem, Branch,
  EducationPackage, VideoCategory, PackageType, VideoLesson,
  Menu, Page, Category, Media, Lead,
  BannerCard, Statistic, Feature, BlogPost, ExamDate, SocialMedia,
  YouTubeChannel, YearlySuccess, TopStudent, HomeSection, Teacher
} from '../types';
import { SettingsManager } from '../components/admin/SettingsManager';
import { NewsManager } from '../components/admin/NewsManager';
import { BranchManager } from '../components/admin/BranchManager';
import { SliderManager } from '../components/admin/SliderManager';
import { UserManager } from '../components/admin/UserManager';
import { VideoManager } from '../components/admin/VideoManager';
import { PackageManager } from '../components/admin/PackageManager';
import { MenuManager } from '../components/admin/MenuManager';
import { PageManager } from '../components/admin/PageManager';
import { CategoryManager } from '../components/admin/CategoryManager';
import { MediaManager } from '../components/admin/MediaManager';
import LeadManager from '../components/admin/LeadManager';
import FranchiseManager from '../components/admin/FranchiseManager';
import { BlogManager } from '../components/admin/BlogManager';
import { BannerCardManager } from '../components/admin/BannerCardManager';
import { StatisticsManager } from '../components/admin/StatisticsManager';
import { FeaturesManager } from '../components/admin/FeaturesManager';
import { ExamDatesManager } from '../components/admin/ExamDatesManager';
import { SocialMediaManager } from '../components/admin/SocialMediaManager';
import { YouTubeManager } from '../components/admin/YouTubeManager';
import { YearlySuccessManager } from '../components/admin/YearlySuccessManager';
import { HomeSectionManager } from '../components/admin/HomeSectionManager';
import { TeacherManager } from '../components/admin/TeacherManager';
import { ContentSectionsManager } from '../components/admin/ContentSectionsManager';
import { BranchAdminPanel } from '../components/admin/BranchAdminPanel';
import { ApprovalsManager } from '../components/admin/ApprovalsManager';
import BranchPackages from './BranchPackages';
import BranchNews from './BranchNews';
import BranchSuccesses from './BranchSuccesses';
import BranchLeads from './BranchLeads';
import Alert from '../components/Alert';
import { useAlert } from '../hooks/useAlert';

export const AdminPanel = ({ user }: { user: AdminUser | null }) => {
  // Debug: Log user info
  console.log('👤 AdminPanel User:', user);
  console.log('👤 User Role:', user?.role);
  console.log('👤 Is BRANCH_ADMIN?', user?.role === UserRole.BRANCH_ADMIN);
  
  // If user is BRANCH_ADMIN, show branch-specific routes
  if (user?.role === UserRole.BRANCH_ADMIN) {
    console.log('🏢 Showing BranchAdmin Routes');
    return (
      <Routes>
        <Route path="/branch/:id" element={<BranchAdminPanel user={user} />} />
        <Route path="/branch-packages" element={<BranchPackages user={user} />} />
        <Route path="/branch-news" element={<BranchNews />} />
        <Route path="/branch-successes" element={<BranchSuccesses user={user} />} />
        <Route path="/branch-leads" element={<BranchLeads user={user} />} />
        <Route path="*" element={<Navigate to={`/admin/branch/${user.branchId}`} replace />} />
      </Routes>
    );
  }
  
  console.log('⚙️ Showing full AdminPanel');
  
  // Alert hook
  const { alert, showAlert, hideAlert } = useAlert();
  
  // Confirmation modal state
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string } | null>(null);
  
  // --- PERSISTENT STATE ---
  const [sliders, setSliders] = useState<SliderItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [videos, setVideos] = useState<VideoLesson[]>([]);
  const [packages, setPackages] = useState<EducationPackage[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mediaItems, setMediaItems] = useState<Media[]>([]);
  const [bannerCards, setBannerCards] = useState<BannerCard[]>([]);
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [examDates, setExamDates] = useState<ExamDate[]>([]);
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
  const [youtubeChannels, setYoutubeChannels] = useState<YouTubeChannel[]>([]);
  const [yearlySuccesses, setYearlySuccesses] = useState<YearlySuccess[]>([]);
  const [homeSections, setHomeSections] = useState<HomeSection[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  // Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          slidersRes, newsRes, branchesRes,
          videosRes, packagesRes, usersRes,
          menusRes, pagesRes, categoriesRes,
          mediaRes,
          bannerCardsRes, statisticsRes, featuresRes,
          blogPostsRes, examDatesRes, socialMediaRes,
          youtubeChannelsRes, yearlySuccessRes, homeSectionsRes,
          teachersRes
        ] = await Promise.allSettled([
          sliderService.getAll(),
          pageService.getAll({ type: 'NEWS' }),
          branchService.getAll(),
          videoService.getAll(),
          packageService.getAll(),
          userService.getAll(),
          menuService.getAll(),
          pageService.getAll(),
          categoryService.getAll(),
          mediaService.getAll(),
          bannerCardService.getAll(),
          statisticService.getAll(),
          featureService.getAll(),
          blogPostService.getAll(),
          examDateService.getAll(),
          socialMediaService.getAll(),
          youtubeChannelService.getAll(),
          yearlySuccessService.getAll(),
          homeSectionService.getAll(),
          teacherService.getAll()
        ]);

        setSliders(slidersRes.status === 'fulfilled' ? (slidersRes.value.data.sliders || []) : []);
        setNews(newsRes.status === 'fulfilled' ? (newsRes.value.data.pages || []) : []);
        setBranches(branchesRes.status === 'fulfilled' ? (branchesRes.value.data.branches || []) : []);
        
        // Debug video response
        if (videosRes.status === 'fulfilled') {
          console.log('🎬 Videos Response:', videosRes.value);
          console.log('🎬 Videos Data:', videosRes.value.data);
          const videoData = videosRes.value.data.data || videosRes.value.data.videos || videosRes.value.data || [];
          console.log('🎬 Extracted Videos:', videoData);
          setVideos(Array.isArray(videoData) ? videoData : []);
        } else {
          console.error('❌ Videos fetch failed:', videosRes);
          setVideos([]);
        }
        setPackages(packagesRes.status === 'fulfilled' ? (packagesRes.value.data.data || packagesRes.value.data.packages || []) : []);
        setAdminUsers(usersRes.status === 'fulfilled' ? (usersRes.value.data.users || []) : []);
        setMenus(menusRes.status === 'fulfilled' ? (menusRes.value.data.menus || []) : []);
        setPages(pagesRes.status === 'fulfilled' ? (pagesRes.value.data.pages || []) : []);
        setCategories(categoriesRes.status === 'fulfilled' ? (categoriesRes.value.data.categories || []) : []);
        setMediaItems(mediaRes.status === 'fulfilled' ? (mediaRes.value.data.media || []) : []);
        setBannerCards(bannerCardsRes.status === 'fulfilled' ? ((bannerCardsRes.value.data as any).bannerCards || (bannerCardsRes.value.data as any).data || []) : []);
        setStatistics(statisticsRes.status === 'fulfilled' ? ((statisticsRes.value.data as any).statistics || (statisticsRes.value.data as any).data || []) : []);
        setFeatures(featuresRes.status === 'fulfilled' ? ((featuresRes.value.data as any).features || (featuresRes.value.data as any).data || []) : []);
        
        // Blog posts response format: { success: true, data: [...] }
        if (blogPostsRes.status === 'fulfilled') {
          console.log('📰 Blog Posts Response:', blogPostsRes.value);
          const blogData = (blogPostsRes.value.data as any).data || (blogPostsRes.value.data as any).blogPosts || [];
          console.log('📰 Extracted Blog Posts:', blogData);
          setBlogPosts(Array.isArray(blogData) ? blogData : []);
        } else {
          console.error('❌ Blog posts fetch failed:', blogPostsRes);
          setBlogPosts([]);
        }
        
        setExamDates(examDatesRes.status === 'fulfilled' ? ((examDatesRes.value.data as any).examDates || (examDatesRes.value.data as any).data || []) : []);
        setSocialMedia(socialMediaRes.status === 'fulfilled' ? ((socialMediaRes.value.data as any).socialMedia || (socialMediaRes.value.data as any).data || []) : []);
        setYoutubeChannels(youtubeChannelsRes.status === 'fulfilled' ? ((youtubeChannelsRes.value.data as any).youtubeChannels || (youtubeChannelsRes.value.data as any).data || []) : []);
        setYearlySuccesses(yearlySuccessRes.status === 'fulfilled' ? ((yearlySuccessRes.value.data as any).data || (yearlySuccessRes.value.data as any).yearlySuccesses || []) : []);
        setHomeSections(homeSectionsRes.status === 'fulfilled' ? ((homeSectionsRes.value.data as any).data || (homeSectionsRes.value.data as any).homeSections || []) : []);
        setTeachers(teachersRes.status === 'fulfilled' ? ((teachersRes.value.data as any).data || (teachersRes.value.data as any).teachers || []) : []);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchData();
  }, []);

  // --- MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'slider' | 'news' | 'branch' | 'video' | 'package' | 'user' | 'menu' | 'page' | 'category' | 'media' | 'lead' | 'bannerCard' | 'statistic' | 'feature' | 'blog' | 'examDate' | 'socialMedia' | 'youtube' | 'yearlySuccess' | 'student' | 'homeSection' | 'teacher'>('slider');
  const [editingItem, setEditingItem] = useState<any>(null);

  // Permission helper
  const hasAccess = (requiredRoles: UserRole[]) => !!user && requiredRoles.includes(user.role);

  // --- CRUD ACTIONS ---
  const handleDelete = async (type: string, id: string) => {
    console.log('🗑️ handleDelete called:', { type, id });
    setDeleteConfirm({ type, id });
  };
  
  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    
    const { type, id } = deleteConfirm;
    console.log('🗑️ Confirming delete:', { type, id });

    try {
      switch (type) {
        case 'slider':
          await sliderService.delete(id);
          setSliders((prev: SliderItem[]) => prev.filter((item: SliderItem) => item.id !== id));
          break;
        case 'news':
          await pageService.delete(id);
          setNews((prev: NewsItem[]) => prev.filter((item: NewsItem) => item.id !== id));
          break;
        case 'blog':
          await blogPostService.delete(id);
          setBlogPosts((prev: BlogPost[]) => prev.filter((item: BlogPost) => item.id !== id));
          break;
        case 'branch':
          await branchService.delete(id);
          setBranches((prev: Branch[]) => prev.filter((item: Branch) => item.id !== id));
          break;
        case 'video':
          await videoService.delete(id);
          setVideos((prev: VideoLesson[]) => prev.filter((item: VideoLesson) => item.id !== id));
          break;
        case 'package':
          await packageService.delete(id);
          setPackages((prev: EducationPackage[]) => prev.filter((item: EducationPackage) => item.id !== id));
          break;
        case 'user':
          await userService.delete(id);
          setAdminUsers((prev: AdminUser[]) => prev.filter((item: AdminUser) => item.id !== id));
          break;
        case 'menu':
          await menuService.delete(id);
          setMenus((prev: Menu[]) => prev.filter((item: Menu) => item.id !== id));
          break;
        case 'page':
          await pageService.delete(id);
          setPages((prev: Page[]) => prev.filter((item: Page) => item.id !== id));
          break;
        case 'category':
          await categoryService.delete(id);
          setCategories((prev: Category[]) => prev.filter((item: Category) => item.id !== id));
          break;
        case 'media':
          await mediaService.delete(id);
          setMediaItems((prev: Media[]) => prev.filter((item: Media) => item.id !== id));
          break;
        case 'bannerCard':
          await bannerCardService.delete(id);
          setBannerCards((prev: BannerCard[]) => prev.filter((item: BannerCard) => item.id !== id));
          break;
        case 'statistic':
          await statisticService.delete(id);
          setStatistics((prev: Statistic[]) => prev.filter((item: Statistic) => item.id !== id));
          break;
        case 'feature':
          await featureService.delete(id);
          setFeatures((prev: Feature[]) => prev.filter((item: Feature) => item.id !== id));
          break;
        case 'blog':
          await blogPostService.delete(id);
          setBlogPosts((prev: BlogPost[]) => prev.filter((item: BlogPost) => item.id !== id));
          break;
        case 'examDate':
          await examDateService.delete(id);
          setExamDates((prev: ExamDate[]) => prev.filter((item: ExamDate) => item.id !== id));
          break;
        case 'socialMedia':
          await socialMediaService.delete(id);
          setSocialMedia((prev: SocialMedia[]) => prev.filter((item: SocialMedia) => item.id !== id));
          break;
        case 'youtube':
          await youtubeChannelService.delete(id);
          setYoutubeChannels((prev: YouTubeChannel[]) => prev.filter((item: YouTubeChannel) => item.id !== id));
          break;
        case 'yearlySuccess':
          await yearlySuccessService.delete(id);
          setYearlySuccesses((prev: YearlySuccess[]) => prev.filter((item: YearlySuccess) => item.id !== id));
          break;
        case 'homeSection':
          await homeSectionService.delete(id);
          setHomeSections((prev: HomeSection[]) => prev.filter((item: HomeSection) => item.id !== id));
          break;
        case 'teacher':
          await teacherService.delete(id);
          setTeachers((prev: Teacher[]) => prev.filter((item: Teacher) => item.id !== id));
          break;
      }
      showAlert('success', 'İçerik başarıyla silindi.');
      setDeleteConfirm(null);
    } catch (error) {
      showAlert('error', 'Silme işlemi başarısız oldu.');
      setDeleteConfirm(null);
    }
  };

  const handleAddStudent = (successId: string) => {
    setModalType('student');
    setEditingItem({ yearlySuccessId: successId, isNewStudent: true });
    setIsModalOpen(true);
  };

  const handleDeleteStudent = async (successId: string, studentId: string) => {
    setDeleteConfirm({ type: 'student', id: `${successId}:${studentId}` });
  };
  
  const confirmDeleteStudent = async () => {
    if (!deleteConfirm || deleteConfirm.type !== 'student') return;
    
    const [successId, studentId] = deleteConfirm.id.split(':');
    
    try {
      await yearlySuccessService.deleteStudent(successId, studentId);
      setYearlySuccesses((prev: YearlySuccess[]) => prev.map((s: YearlySuccess) => {
        if (s.id === successId) {
          return { ...s, students: s.students?.filter((st: TopStudent) => st.id !== studentId) };
        }
        return s;
      }));
      showAlert('success', 'Öğrenci başarıyla silindi.');
      setDeleteConfirm(null);
    } catch (error) {
      showAlert('error', 'Öğrenci silinemedi.');
      setDeleteConfirm(null);
    }
  };

  const handleEdit = (type: typeof modalType, item: any) => {
    setModalType(type);
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAdd = (type: typeof modalType) => {
    setModalType(type);
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const response = await mediaService.upload(file);
      // Response yapısını kontrol et
      const url = response.data?.data?.url || response.data?.url || response.data?.media?.url;
      if (!url) {
        console.error('No URL in response:', response);
        throw new Error('Görsel URL alınamadı');
      }
      return url;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  };

  const handleSave = async (data: any) => {
    const type = modalType;
    console.log('💾 Saving:', type, 'with data:', data);
    console.log('📝 Editing item:', editingItem);
    try {
      // Special case for student - always CREATE
      if (type === 'student' && editingItem?.isNewStudent) {
        console.log('➕ CREATE student mode');
        const { yearlySuccessId, features, isNewStudent, ...studentData } = data;
        console.log('🔵 Cleaned student data:', studentData);
        console.log('🔵 YearlySuccessId:', editingItem.yearlySuccessId);
        console.log('🔵 Student image:', studentData.image);
        
        const newItem = await yearlySuccessService.addStudent(editingItem.yearlySuccessId, studentData);
        console.log('✅ Student added:', newItem);
        console.log('✅ Student data from backend:', newItem.data);
        
        setYearlySuccesses((prev: YearlySuccess[]) => prev.map((s: YearlySuccess) => {
          if (s.id === editingItem.yearlySuccessId) {
            return { ...s, students: [newItem.data, ...(s.students || [])] };
          }
          return s;
        }));
        
        setIsModalOpen(false);
        return;
      }

      // Clean data for video type
      let cleanedData = data;
      if (type === 'video') {
        const { features, ...videoData } = data;
        cleanedData = videoData;
        console.log('🎥 Cleaned video data:', cleanedData);
      }
      
      if (editingItem) {
        console.log('🔄 UPDATE mode');
        // Update
        let updatedItem: any;
        switch (type) {
          case 'slider':
            updatedItem = await sliderService.update(editingItem.id, data);
            setSliders((prev: SliderItem[]) => prev.map((item: SliderItem) => item.id === editingItem.id ? updatedItem.data : item));
            break;
          case 'news':
            updatedItem = await pageService.update(editingItem.id, data);
            setNews((prev: NewsItem[]) => prev.map((item: NewsItem) => item.id === editingItem.id ? updatedItem.data.page : item));
            break;
          case 'branch':
            updatedItem = await branchService.update(editingItem.id, data);
            setBranches((prev: Branch[]) => prev.map((item: Branch) => item.id === editingItem.id ? updatedItem.data : item));
            break;
          case 'video':
            updatedItem = await videoService.update(editingItem.id, cleanedData);
            const updatedVideo = updatedItem.data.data || updatedItem.data;
            setVideos((prev: VideoLesson[]) => prev.map((item: VideoLesson) => item.id === editingItem.id ? updatedVideo : item));
            break;
          case 'package':
            updatedItem = await packageService.update(editingItem.id, data);
            setPackages((prev: EducationPackage[]) => prev.map((item: EducationPackage) => item.id === editingItem.id ? (updatedItem.data.data || updatedItem.data) : item));
            break;
          case 'user':
            updatedItem = await userService.update(editingItem.id, data);
            setAdminUsers((prev: AdminUser[]) => prev.map((item: AdminUser) => item.id === editingItem.id ? updatedItem.data : item));
            break;
          case 'menu':
            updatedItem = await menuService.update(editingItem.id, data);
            setMenus((prev: Menu[]) => prev.map((item: Menu) => item.id === editingItem.id ? updatedItem.data : item));
            break;
          case 'page':
            updatedItem = await pageService.update(editingItem.id, data);
            setPages((prev: Page[]) => prev.map((item: Page) => item.id === editingItem.id ? updatedItem.data : item));
            break;
          case 'category':
            updatedItem = await categoryService.update(editingItem.id, data);
            setCategories((prev: Category[]) => prev.map((item: Category) => item.id === editingItem.id ? updatedItem.data : item));
            break;
          case 'socialMedia':
            updatedItem = await socialMediaService.update(editingItem.id, data);
            setSocialMedia((prev: SocialMedia[]) => prev.map((item: SocialMedia) => item.id === editingItem.id ? updatedItem.data : item));
            break;
          case 'youtube':
            updatedItem = await youtubeChannelService.update(editingItem.id, data);
            setYoutubeChannels((prev: YouTubeChannel[]) => prev.map((item: YouTubeChannel) => item.id === editingItem.id ? updatedItem.data : item));
            break;
          case 'yearlySuccess':
            updatedItem = await yearlySuccessService.update(editingItem.id, data);
            setYearlySuccesses((prev: YearlySuccess[]) => prev.map((item: YearlySuccess) => item.id === editingItem.id ? updatedItem.data : item));
            break;
          case 'homeSection':
            updatedItem = await homeSectionService.update(editingItem.id, data);
            setHomeSections((prev: HomeSection[]) => prev.map((item: HomeSection) => item.id === editingItem.id ? updatedItem.data : item));
            break;
          case 'teacher':
            updatedItem = await teacherService.update(editingItem.id, data);
            setTeachers((prev: Teacher[]) => prev.map((item: Teacher) => item.id === editingItem.id ? updatedItem.data : item));
            break;
        }
      } else {
        console.log('➕ CREATE mode');
        // Create
        let newItem: any;
        switch (type) {
          case 'slider':
            newItem = await sliderService.create(data);
            setSliders((prev: SliderItem[]) => [newItem.data, ...prev]);
            break;
          case 'news':
            newItem = await pageService.create({ ...data, type: 'NEWS' });
            setNews((prev: NewsItem[]) => [newItem.data.page, ...prev]);
            break;
          case 'branch':
            // Şube oluştur
            newItem = await branchService.create(data);
            const createdBranch = newItem.data.branch || newItem.data;
            
            console.log('✅ Branch created:', createdBranch);
            console.log('✅ Branch ID:', createdBranch.id);
            
            // Eğer admin bilgileri varsa, şube yöneticisi hesabı oluştur
            if (data.adminName && data.adminEmail && data.adminPassword) {
              try {
                const userPayload = {
                  name: data.adminName,
                  email: data.adminEmail,
                  password: data.adminPassword,
                  role: 'BRANCH_ADMIN',
                  branchId: createdBranch.id
                };
                
                console.log('📤 Creating user with payload:', userPayload);
                
                const userResponse = await userService.create(userPayload);
                console.log('✅ Şube yöneticisi hesabı oluşturuldu:', userResponse.data);
                showAlert('success', `Şube ve yönetici hesabı başarıyla oluşturuldu!\n\nGiriş Bilgileri:\nE-posta: ${data.adminEmail}\nŞifre: ${data.adminPassword}\n\nBu bilgileri şube yöneticisine iletin.`);
              } catch (userError: any) {
                console.error('❌ Kullanıcı oluşturma hatası:', userError);
                console.error('❌ Error response:', userError.response?.data);
                showAlert('warning', 'Şube oluşturuldu ancak yönetici hesabı oluşturulamadı. Lütfen manuel olarak kullanıcı ekleyin.');
              }
            }
            
            setBranches((prev: Branch[]) => [createdBranch, ...prev]);
            break;
          case 'video':
            newItem = await videoService.create(cleanedData);
            console.log('✅ Video created response:', newItem);
            console.log('✅ Video data:', newItem.data);
            const createdVideo = newItem.data.data || newItem.data;
            console.log('✅ Extracted video:', createdVideo);
            setVideos((prev: VideoLesson[]) => [createdVideo, ...prev]);
            break;
          case 'package':
            newItem = await packageService.create(data);
            setPackages((prev: EducationPackage[]) => [(newItem.data.data || newItem.data), ...prev]);
            break;
          case 'user':
            // Users usually handled via specialized auth/admin endpoints
            // but for now following the pattern
            setAdminUsers((prev: AdminUser[]) => [{ ...data, id: Math.random().toString() }, ...prev]);
            break;
          case 'menu':
            newItem = await menuService.create(data);
            setMenus((prev: Menu[]) => [newItem.data, ...prev]);
            break;
          case 'page':
            newItem = await pageService.create(data);
            setPages((prev: Page[]) => [newItem.data, ...prev]);
            break;
          case 'category':
            newItem = await categoryService.create(data);
            setCategories((prev: Category[]) => [newItem.data, ...prev]);
            break;
          case 'media':
            // Media creation usually happens via upload
            if (data.file) {
              newItem = await mediaService.upload(data.file);
              setMediaItems((prev: Media[]) => [newItem.data, ...prev]);
            }
            break;
          case 'bannerCard':
            newItem = await bannerCardService.create(data);
            setBannerCards((prev: BannerCard[]) => [newItem.data, ...prev]);
            break;
          case 'statistic':
            newItem = await statisticService.create(data);
            setStatistics((prev: Statistic[]) => [newItem.data, ...prev]);
            break;
          case 'feature':
            newItem = await featureService.create(data);
            setFeatures((prev: Feature[]) => [newItem.data, ...prev]);
            break;
          case 'blog':
            newItem = await blogPostService.create(data);
            setBlogPosts((prev: BlogPost[]) => [newItem.data, ...prev]);
            break;
          case 'examDate':
            newItem = await examDateService.create(data);
            setExamDates((prev: ExamDate[]) => [newItem.data, ...prev]);
            break;
          case 'socialMedia':
            newItem = await socialMediaService.create(data);
            setSocialMedia((prev: SocialMedia[]) => [newItem.data, ...prev]);
            break;
          case 'youtube':
            newItem = await youtubeChannelService.create(data);
            setYoutubeChannels((prev: YouTubeChannel[]) => [newItem.data, ...prev]);
            break;
          case 'yearlySuccess':
            newItem = await yearlySuccessService.create(data);
            setYearlySuccesses((prev: YearlySuccess[]) => [newItem.data, ...prev]);
            break;
          case 'homeSection':
            newItem = await homeSectionService.create(data);
            setHomeSections((prev: HomeSection[]) => [newItem.data, ...prev]);
            break;
          case 'teacher':
            newItem = await teacherService.create(data);
            setTeachers((prev: Teacher[]) => [newItem.data, ...prev]);
            break;
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      showAlert('error', 'Kaydetme işlemi başarısız oldu.');
    }
  };

  // --- SUB-COMPONENTS ---
  // Note: Sidebar and Topbar are now handled by AdminLayout


  // --- MODAL & FORM COMPONENT ---
  const EditModal = () => {
    if (!isModalOpen) return null;

    const [formData, setFormData] = useState<any>(() => {
      const data = editingItem || {};
      // Initialize features array if it doesn't exist or is not an array
      if (!Array.isArray(data.features)) {
        data.features = [];
      }
      // For student modal, preserve yearlySuccessId but clear other fields
      if (modalType === 'student' && data.isNewStudent) {
        return {
          yearlySuccessId: data.yearlySuccessId,
          isNewStudent: true,
          features: [],
          name: '',
          exam: '',
          rank: '',
          image: '',
          branch: '',
          university: '',
          score: ''
        };
      }
      return data;
    });

    const renderForm = () => {
      switch (modalType) {
        case 'slider':
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Başlık</label>
                  <input type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Alt Başlık</label>
                  <input type="text" value={formData.subtitle || ''} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Görsel URL</label>
                <input type="text" value={formData.image || ''} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Yönlendirme Linki</label>
                  <input type="text" value={formData.link || ''} onChange={e => setFormData({ ...formData, link: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Hedef</label>
                  <select value={formData.target || 'main'} onChange={e => setFormData({ ...formData, target: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold">
                    <option value="main">Ana Sayfa</option>
                    {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
          );
        case 'news':
          return (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Haber Başlığı *</label>
                <input 
                  type="text" 
                  value={formData.title || ''} 
                  onChange={e => setFormData({ ...formData, title: e.target.value })} 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" 
                  placeholder="Örn: 2024 YKS Sonuçları Açıklandı"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">URL Slug</label>
                <input 
                  type="text" 
                  value={formData.slug || ''} 
                  onChange={e => setFormData({ ...formData, slug: e.target.value })} 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" 
                  placeholder="Otomatik oluşturulacak"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Özet (Excerpt)</label>
                <textarea 
                  rows={2} 
                  value={formData.excerpt || ''} 
                  onChange={e => setFormData({ ...formData, excerpt: e.target.value })} 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold resize-none" 
                  placeholder="Kısa özet (liste görünümünde gösterilir)"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Haber İçeriği *</label>
                <textarea 
                  rows={8} 
                  value={formData.content || ''} 
                  onChange={e => setFormData({ ...formData, content: e.target.value })} 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold resize-none" 
                  placeholder="HTML içerik desteklenir"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Kapak Görseli *</label>
                <div className="flex gap-4 items-end">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const url = await handleImageUpload(file);
                          setFormData({ ...formData, featuredImage: url });
                        } catch (error) {
                          showAlert('error', 'Görsel yüklenemedi');
                        }
                      }
                    }}
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
                  />
                  {formData.featuredImage && (
                    <img src={formData.featuredImage} alt="Preview" className="w-24 h-16 object-cover border border-slate-200 rounded-lg" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Kategori</label>
                  <select 
                    value={formData.categoryId || ''} 
                    onChange={e => setFormData({ ...formData, categoryId: e.target.value || null })} 
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
                  >
                    <option value="">Kategori Seçin</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Kapsam</label>
                  <select 
                    value={formData.branchId || ''} 
                    onChange={e => setFormData({ ...formData, branchId: e.target.value || null })} 
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
                  >
                    <option value="">Genel / Kurumsal</option>
                    {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Durum</label>
                <select 
                  value={formData.status || 'DRAFT'} 
                  onChange={e => setFormData({ ...formData, status: e.target.value })} 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
                >
                  <option value="DRAFT">Taslak</option>
                  <option value="PUBLISHED">Yayında</option>
                  <option value="ARCHIVED">Arşivlendi</option>
                </select>
              </div>

              <div className="flex items-center space-x-4 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.isFeatured || false} 
                    onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })} 
                    className="w-4 h-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                  />
                  <span className="text-xs font-bold text-slate-600">Öne Çıkan Haber</span>
                </label>
              </div>

              {/* SEO Section */}
              <div className="border-t border-slate-200 pt-4 mt-4">
                <h3 className="text-sm font-black text-slate-700 mb-3">SEO Ayarları</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">SEO Başlık</label>
                    <input 
                      type="text" 
                      value={formData.seoTitle || ''} 
                      onChange={e => setFormData({ ...formData, seoTitle: e.target.value })} 
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" 
                      placeholder="Boş bırakılırsa haber başlığı kullanılır"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">SEO Açıklama</label>
                    <textarea 
                      rows={2} 
                      value={formData.seoDescription || ''} 
                      onChange={e => setFormData({ ...formData, seoDescription: e.target.value })} 
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold resize-none" 
                      placeholder="Arama motorları için açıklama"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">SEO Anahtar Kelimeler</label>
                    <input 
                      type="text" 
                      value={formData.seoKeywords || ''} 
                      onChange={e => setFormData({ ...formData, seoKeywords: e.target.value })} 
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" 
                      placeholder="Virgülle ayırın: yks, üniversite, başarı"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        case 'branch':
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Şube Adı</label>
                  <input type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">URL Slug</label>
                  <input type="text" value={formData.slug || ''} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Açıklama</label>
                <textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={2} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold resize-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Adres</label>
                <input type="text" value={formData.address || ''} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Telefon</label>
                  <input type="text" value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">WhatsApp</label>
                  <input type="text" value={formData.whatsapp || ''} onChange={e => setFormData({ ...formData, whatsapp: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">E-posta</label>
                  <input type="email" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Enlem (Lat)</label>
                  <input type="number" step="0.000001" value={formData.lat || ''} onChange={e => setFormData({ ...formData, lat: parseFloat(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Boylam (Lng)</label>
                  <input type="number" step="0.000001" value={formData.lng || ''} onChange={e => setFormData({ ...formData, lng: parseFloat(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
              </div>
              
              {/* Logo Upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Logo</label>
                <div className="flex gap-4 items-end">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const url = await handleImageUpload(file);
                          setFormData({ ...formData, logo: url });
                        } catch (error) {
                          showAlert('error', 'Görsel yüklenemedi');
                        }
                      }
                    }}
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
                  />
                  {formData.logo && (
                    <img src={formData.logo} alt="Logo" className="w-16 h-16 object-contain border border-slate-200 rounded-lg" />
                  )}
                </div>
              </div>

              {/* Kapak Görseli Upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Kapak Görseli</label>
                <div className="flex gap-4 items-end">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const url = await handleImageUpload(file);
                          setFormData({ ...formData, image: url });
                        } catch (error) {
                          showAlert('error', 'Görsel yüklenemedi');
                        }
                      }
                    }}
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
                  />
                  {formData.image && (
                    <img src={formData.image} alt="Kapak" className="w-24 h-16 object-cover border border-slate-200 rounded-lg" />
                  )}
                </div>
              </div>

              {/* Başarı Banner Upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Başarı Banner</label>
                <div className="flex gap-4 items-end">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const url = await handleImageUpload(file);
                          setFormData({ ...formData, successBanner: url });
                        } catch (error) {
                          showAlert('error', 'Görsel yüklenemedi');
                        }
                      }
                    }}
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
                  />
                  {formData.successBanner && (
                    <img src={formData.successBanner} alt="Banner" className="w-24 h-16 object-cover border border-slate-200 rounded-lg" />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Kurumsal Renk</label>
                <input type="color" value={formData.primaryColor || '#0052FF'} onChange={e => setFormData({ ...formData, primaryColor: e.target.value })} className="w-full h-[46px] bg-slate-50 border border-slate-100 rounded-xl px-2 py-1 focus:outline-none focus:border-brand-blue cursor-pointer" />
              </div>

              {/* Şube Yöneticisi Hesap Bilgileri - Sadece yeni şube eklerken */}
              {!editingItem && (
                <div className="border-t border-slate-200 pt-6 mt-6">
                  <h3 className="text-sm font-black text-brand-dark mb-4 flex items-center">
                    <div className="w-8 h-8 bg-brand-blue/10 rounded-lg flex items-center justify-center mr-3">
                      <Settings className="w-4 h-4 text-brand-blue" />
                    </div>
                    Şube Yöneticisi Hesap Bilgileri
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">Bu bilgilerle şube yöneticisi admin panele giriş yapabilecek.</p>
                  
                  <div className="space-y-4 bg-slate-50 p-4 rounded-xl">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Yönetici Adı *</label>
                        <input 
                          type="text" 
                          value={formData.adminName || ''} 
                          onChange={e => setFormData({ ...formData, adminName: e.target.value })} 
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" 
                          placeholder="Örn: Ahmet Yılmaz"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">E-posta (Giriş) *</label>
                        <input 
                          type="email" 
                          value={formData.adminEmail || ''} 
                          onChange={e => setFormData({ ...formData, adminEmail: e.target.value })} 
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" 
                          placeholder="sube@hocalarageldik.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Şifre *</label>
                      <input 
                        type="password" 
                        value={formData.adminPassword || ''} 
                        onChange={e => setFormData({ ...formData, adminPassword: e.target.value })} 
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" 
                        placeholder="Minimum 6 karakter"
                        minLength={6}
                        required
                      />
                      <p className="text-xs text-slate-400 mt-1">⚠️ Bu şifreyi not edin, şube yöneticisine iletmeniz gerekecek.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        case 'video':
          // YouTube video ID'sini çıkar
          const getYouTubeVideoId = (url: string) => {
            if (!url) return null;
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            return (match && match[2].length === 11) ? match[2] : null;
          };

          const getYouTubeThumbnail = (url: string) => {
            const videoId = getYouTubeVideoId(url);
            return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
          };

          const videoId = getYouTubeVideoId(formData.videoUrl || '');
          const thumbnailUrl = getYouTubeThumbnail(formData.videoUrl || '');

          return (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Video Başlığı *</label>
                <input 
                  type="text" 
                  value={formData.title || ''} 
                  onChange={e => setFormData({ ...formData, title: e.target.value })} 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" 
                  placeholder="Örn: Matematik - Türev Konusu"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">YouTube Video URL *</label>
                <input 
                  type="text" 
                  value={formData.videoUrl || ''} 
                  onChange={e => {
                    const url = e.target.value;
                    setFormData({ 
                      ...formData, 
                      videoUrl: url,
                      thumbnail: getYouTubeThumbnail(url) || formData.thumbnail
                    });
                  }} 
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" 
                />
                {thumbnailUrl && (
                  <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 mb-2">Video Önizleme:</p>
                    <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                      <img src={thumbnailUrl} alt="Video thumbnail" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                          <Play className="w-8 h-8 text-white ml-1" fill="white" />
                        </div>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-slate-500 mt-2">Video ID: {videoId}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Kategori *</label>
                  <select 
                    value={formData.category || ''} 
                    onChange={e => setFormData({ ...formData, category: e.target.value })} 
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
                    required
                  >
                    <option value="">Kategori Seçin</option>
                    {Object.values(VideoCategory).map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Ders / Branş *</label>
                  <input 
                    type="text" 
                    value={formData.subject || ''} 
                    onChange={e => setFormData({ ...formData, subject: e.target.value })} 
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" 
                    placeholder="Örn: Matematik"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Süre</label>
                  <input type="text" placeholder="Örn: 45:00" value={formData.duration || ''} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Öğretmen</label>
                  <input type="text" value={formData.teacher || ''} onChange={e => setFormData({ ...formData, teacher: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Açıklama</label>
                <textarea 
                  rows={3} 
                  value={formData.description || ''} 
                  onChange={e => setFormData({ ...formData, description: e.target.value })} 
                  placeholder="Video hakkında kısa açıklama..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold resize-none" 
                />
              </div>
            </div>
          );
        case 'package':
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Paket Adı</label>
                  <input type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Tür</label>
                  <input 
                    type="text" 
                    value={formData.type || ''} 
                    onChange={e => setFormData({ ...formData, type: e.target.value })} 
                    placeholder="Örn: YKS 2026, LGS 2026, KPSS"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Kısa Açıklama</label>
                <textarea rows={2} value={formData.shortDescription || ''} onChange={e => setFormData({ ...formData, shortDescription: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold resize-none" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Detaylı Açıklama</label>
                <textarea rows={4} value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold resize-none" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Fiyat (₺)</label>
                  <input type="number" value={formData.price || 0} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Orijinal Fiyat (₺)</label>
                  <input type="number" value={formData.originalPrice || 0} onChange={e => setFormData({ ...formData, originalPrice: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">İndirim Oranı (%)</label>
                  <input type="number" value={formData.discount || 0} onChange={e => setFormData({ ...formData, discount: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Video Sayısı</label>
                  <input type="number" value={formData.videoCount || 0} onChange={e => setFormData({ ...formData, videoCount: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Ders Sayısı</label>
                  <input type="number" value={formData.subjectCount || 0} onChange={e => setFormData({ ...formData, subjectCount: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Süre</label>
                  <input type="text" placeholder="Örn: 12 Ay" value={formData.duration || ''} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Özellikler</label>
                <div className="space-y-2">
                  {(Array.isArray(formData.features) ? formData.features : []).map((feature: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <input 
                        type="text" 
                        value={feature} 
                        onChange={e => {
                          const newFeatures = [...(Array.isArray(formData.features) ? formData.features : [])];
                          newFeatures[index] = e.target.value;
                          setFormData({ ...formData, features: newFeatures });
                        }}
                        placeholder={`Özellik ${index + 1}`}
                        className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" 
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newFeatures = (Array.isArray(formData.features) ? formData.features : []).filter((_: any, i: number) => i !== index);
                          setFormData({ ...formData, features: newFeatures });
                        }}
                        className="px-4 py-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all font-black text-xs"
                      >
                        Sil
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newFeatures = [...(Array.isArray(formData.features) ? formData.features : []), ''];
                      setFormData({ ...formData, features: newFeatures });
                    }}
                    className="w-full px-4 py-3 bg-brand-blue/10 text-brand-blue rounded-xl hover:bg-brand-blue hover:text-white transition-all font-black text-xs"
                  >
                    + Özellik Ekle
                  </button>
                </div>
              </div>

              {/* Paket Görseli Upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Paket Görseli</label>
                <div className="flex gap-4 items-end">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const url = await handleImageUpload(file);
                          setFormData({ ...formData, image: url });
                        } catch (error) {
                          showAlert('error', 'Görsel yüklenemedi');
                        }
                      }
                    }}
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
                  />
                  {formData.image && (
                    <img src={formData.image} alt="Paket" className="w-32 h-20 object-cover border border-slate-200 rounded-lg" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="isPopular"
                    checked={formData.isPopular || false} 
                    onChange={e => setFormData({ ...formData, isPopular: e.target.checked })} 
                    className="w-4 h-4 text-brand-blue rounded focus:ring-brand-blue"
                  />
                  <label htmlFor="isPopular" className="text-xs font-black text-slate-600">Popüler</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="isNew"
                    checked={formData.isNew || false} 
                    onChange={e => setFormData({ ...formData, isNew: e.target.checked })} 
                    className="w-4 h-4 text-brand-blue rounded focus:ring-brand-blue"
                  />
                  <label htmlFor="isNew" className="text-xs font-black text-slate-600">Yeni</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="isActive"
                    checked={formData.isActive !== false} 
                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })} 
                    className="w-4 h-4 text-brand-blue rounded focus:ring-brand-blue"
                  />
                  <label htmlFor="isActive" className="text-xs font-black text-slate-600">Aktif</label>
                </div>
              </div>
            </div>
          );
        case 'user':
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Ad Soyad</label>
                  <input type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">E-posta</label>
                  <input type="email" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Rol</label>
                  <select value={formData.role || UserRole.EDITOR} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold">
                    {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Atanan Şube (Opsiyonel)</label>
                  <select value={formData.branchId || ''} onChange={e => setFormData({ ...formData, branchId: e.target.value || undefined })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold">
                    <option value="">Yok (Genel)</option>
                    {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Profil Görseli URL</label>
                <input type="text" value={formData.avatar || ''} onChange={e => setFormData({ ...formData, avatar: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
              </div>
            </div>
          );

        case 'bannerCard':
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Icon (Emoji)</label>
                  <input type="text" value={formData.icon || ''} onChange={e => setFormData({ ...formData, icon: e.target.value })} placeholder="📄" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Sıra</label>
                  <input type="number" value={formData.order || 0} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Başlık</label>
                <input type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Açıklama</label>
                <textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={2} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Arkaplan Rengi</label>
                  <input type="text" value={formData.bgColor || ''} onChange={e => setFormData({ ...formData, bgColor: e.target.value })} placeholder="bg-blue-500" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Hover Rengi</label>
                  <input type="text" value={formData.hoverColor || ''} onChange={e => setFormData({ ...formData, hoverColor: e.target.value })} placeholder="hover:bg-blue-600" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Link</label>
                <input type="text" value={formData.link || ''} onChange={e => setFormData({ ...formData, link: e.target.value })} placeholder="/franchise" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
              </div>
            </div>
          );

        case 'statistic':
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Değer</label>
                  <input type="text" value={formData.value || ''} onChange={e => setFormData({ ...formData, value: e.target.value })} placeholder="81" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Etiket</label>
                  <input type="text" value={formData.label || ''} onChange={e => setFormData({ ...formData, label: e.target.value })} placeholder="İl" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Icon (Emoji)</label>
                  <input type="text" value={formData.icon || ''} onChange={e => setFormData({ ...formData, icon: e.target.value })} placeholder="🏛️" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Sıra</label>
                  <input type="number" value={formData.order || 0} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
              </div>
            </div>
          );

        case 'feature':
          return (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Başlık</label>
                <input type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Açıklama</label>
                <textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={2} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Icon</label>
                  <input type="text" value={formData.icon || ''} onChange={e => setFormData({ ...formData, icon: e.target.value })} placeholder="🎯" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Bölüm</label>
                  <select value={formData.section || ''} onChange={e => setFormData({ ...formData, section: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold">
                    <option value="">Seçin</option>
                    <option value="success-centers">Success Centers</option>
                    <option value="digital-platform">Digital Platform</option>
                    <option value="abroad-education">Abroad Education</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Sıra</label>
                  <input type="number" value={formData.order || 0} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
              </div>
            </div>
          );

        case 'blog':
          return (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Başlık *</label>
                <input type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">URL Slug</label>
                <input type="text" value={formData.slug || ''} onChange={e => setFormData({ ...formData, slug: e.target.value })} placeholder="otomatik-olusturulacak" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Özet *</label>
                <textarea value={formData.excerpt || ''} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} rows={2} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">İçerik *</label>
                <textarea value={formData.content || ''} onChange={e => setFormData({ ...formData, content: e.target.value })} rows={4} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Kategori</label>
                  <input type="text" value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="Rehberlik" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Yazar</label>
                  <input type="text" value={formData.author || ''} onChange={e => setFormData({ ...formData, author: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Tarih</label>
                  <input type="text" value={formData.date || ''} onChange={e => setFormData({ ...formData, date: e.target.value })} placeholder="15 Ocak 2024" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Okuma Süresi</label>
                  <input type="text" value={formData.readTime || ''} onChange={e => setFormData({ ...formData, readTime: e.target.value })} placeholder="5 dk" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Görsel URL</label>
                  <input type="text" value={formData.image || ''} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
              </div>
              
              {/* SEO Fields */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-black text-slate-600 mb-3">SEO Ayarları</h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">SEO Başlık</label>
                    <input type="text" value={formData.seoTitle || ''} onChange={e => setFormData({ ...formData, seoTitle: e.target.value })} placeholder="Arama motorları için başlık" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">SEO Açıklama</label>
                    <textarea value={formData.seoDescription || ''} onChange={e => setFormData({ ...formData, seoDescription: e.target.value })} rows={2} placeholder="Arama motorları için açıklama" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">SEO Anahtar Kelimeler</label>
                    <input type="text" value={formData.seoKeywords || ''} onChange={e => setFormData({ ...formData, seoKeywords: e.target.value })} placeholder="kelime1, kelime2, kelime3" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                  </div>
                </div>
              </div>
              
              {/* Checkboxes */}
              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={formData.isFeatured || false} onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })} className="w-4 h-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue" />
                  <span className="text-xs font-bold text-slate-600">Öne Çıkan</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={formData.isActive !== false} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue" />
                  <span className="text-xs font-bold text-slate-600">Aktif</span>
                </label>
              </div>
            </div>
          );

        case 'examDate':
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Sınav Adı</label>
                  <input type="text" value={formData.examName || ''} onChange={e => setFormData({ ...formData, examName: e.target.value })} placeholder="TYT" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Tarih</label>
                  <input type="date" value={formData.examDate || ''} onChange={e => setFormData({ ...formData, examDate: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Açıklama</label>
                <textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={2} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Sıra</label>
                <input type="number" value={formData.order || 0} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
              </div>
            </div>
          );

        case 'socialMedia':
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Platform</label>
                  <select value={formData.platform || ''} onChange={e => setFormData({ ...formData, platform: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold">
                    <option value="">Seçin</option>
                    <option value="youtube">YouTube</option>
                    <option value="instagram">Instagram</option>
                    <option value="twitter">Twitter</option>
                    <option value="facebook">Facebook</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Sıra</label>
                  <input type="number" value={formData.order || 0} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">URL</label>
                <input type="url" value={formData.url || ''} onChange={e => setFormData({ ...formData, url: e.target.value })} placeholder="https://youtube.com/@channel" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
              </div>
            </div>
          );

        case 'youtube':
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Kanal Adı</label>
                  <input type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Kanal Adı" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Sıra</label>
                  <input type="number" value={formData.order || 0} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Kanal URL</label>
                <input type="url" value={formData.url || ''} onChange={e => setFormData({ ...formData, url: e.target.value })} placeholder="https://youtube.com/@channel" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
              </div>
            </div>
          );

        case 'yearlySuccess':
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Yıl</label>
                  <input type="text" value={formData.year || ''} onChange={e => setFormData({ ...formData, year: e.target.value })} placeholder="2024" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" disabled={!!editingItem} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Toplam Derece</label>
                  <input type="number" value={formData.totalDegrees || 0} onChange={e => setFormData({ ...formData, totalDegrees: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Yerleşme Sayısı</label>
                  <input type="number" value={formData.placementCount || 0} onChange={e => setFormData({ ...formData, placementCount: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Başarı Oranı (%)</label>
                  <input type="number" value={formData.successRate || 0} onChange={e => setFormData({ ...formData, successRate: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">İl Sayısı</label>
                  <input type="number" value={formData.cityCount || 0} onChange={e => setFormData({ ...formData, cityCount: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
              </div>

              <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 space-y-4">
                <h4 className="text-[10px] font-black text-brand-blue uppercase tracking-widest">Banner Bilgileri</h4>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Banner Başlığı</label>
                  <input type="text" value={formData.banner?.title || ''} onChange={e => setFormData({ ...formData, banner: { ...formData.banner, title: e.target.value } })} className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Banner Alt Başlık</label>
                  <input type="text" value={formData.banner?.subtitle || ''} onChange={e => setFormData({ ...formData, banner: { ...formData.banner, subtitle: e.target.value } })} className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Banner Açıklama</label>
                  <textarea value={formData.banner?.description || ''} onChange={e => setFormData({ ...formData, banner: { ...formData.banner, description: e.target.value } })} rows={3} className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold resize-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Banner Görseli</label>
                  <div className="flex gap-4 items-end">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const url = await handleImageUpload(file);
                            setFormData({ ...formData, banner: { ...formData.banner, image: url } });
                          } catch (error) {
                            showAlert('error', 'Görsel yüklenemedi');
                          }
                        }
                      }}
                      className="flex-1 bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
                    />
                    {formData.banner?.image && (
                      <img src={formData.banner.image} alt="Banner" className="w-32 h-20 object-cover border border-slate-200 rounded-lg" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );

        case 'student':
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Öğrenci Adı</label>
                  <input type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Sınav Türü</label>
                  <input type="text" value={formData.exam || ''} onChange={e => setFormData({ ...formData, exam: e.target.value })} placeholder="YKS, LGS" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Derece/Sıralama</label>
                  <input type="text" value={formData.rank || ''} onChange={e => setFormData({ ...formData, rank: e.target.value })} placeholder="1" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Puan (Opsiyonel)</label>
                  <input type="number" step="0.01" value={formData.score || ''} onChange={e => setFormData({ ...formData, score: e.target.value })} placeholder="548.5" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Üniversite/Bölüm</label>
                <input type="text" value={formData.university || ''} onChange={e => setFormData({ ...formData, university: e.target.value })} placeholder="İTÜ Bilgisayar Mühendisliği" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Şube</label>
                <select 
                  value={formData.branch || ''} 
                  onChange={e => {
                    const selectedBranch = branches.find(b => b.name === e.target.value);
                    setFormData({ ...formData, branch: selectedBranch?.name || '' });
                  }} 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
                >
                  <option value="">Şube Seçiniz</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Öğrenci Fotoğrafı</label>
                <div className="flex gap-4 items-end">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const url = await handleImageUpload(file);
                          setFormData({ ...formData, image: url });
                        } catch (error) {
                          showAlert('error', 'Görsel yüklenemedi');
                        }
                      }
                    }}
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
                  />
                  {formData.image && (
                    <img src={formData.image} alt="Öğrenci" className="w-20 h-20 object-cover border border-slate-200 rounded-lg" />
                  )}
                </div>
              </div>
            </div>
          );

        case 'homeSection':
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Bölüm Anahtarı (Hero, Centers vb.)</label>
                  <input type="text" value={formData.key || ''} onChange={e => setFormData({ ...formData, key: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Üst Başlık (Badge)</label>
                  <input type="text" value={formData.topTitle || ''} onChange={e => setFormData({ ...formData, topTitle: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Ana Başlık</label>
                <input type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Alt Başlık</label>
                <textarea value={formData.subtitle || ''} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} rows={2} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Görsel URL</label>
                  <input type="text" value={formData.image || ''} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Arkaplan URL</label>
                  <input type="text" value={formData.bgImage || ''} onChange={e => setFormData({ ...formData, bgImage: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Link URL</label>
                  <input type="text" value={formData.link || ''} onChange={e => setFormData({ ...formData, link: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Link Metni</label>
                  <input type="text" value={formData.linkText || ''} onChange={e => setFormData({ ...formData, linkText: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Sıra</label>
                <input type="number" value={formData.order || 0} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
              </div>
            </div>
          );

        case 'teacher':
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Öğretmen Adı</label>
                  <input type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Branş</label>
                  <input type="text" value={formData.subject || ''} onChange={e => setFormData({ ...formData, subject: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Şube Ataması</label>
                <select value={formData.branchId || ''} onChange={e => setFormData({ ...formData, branchId: e.target.value || null })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold">
                  <option value="">Tüm Şubeler</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Fotoğraf URL</label>
                <input type="text" value={formData.image || ''} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Sıra</label>
                <input type="number" value={formData.order || 0} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
              </div>
            </div>
          );

        default: return <p>Form henüz hazır değil...</p>;
      }
    };

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
        <div className="bg-white rounded-[32px] w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0">
            <div>
              <h2 className="text-2xl font-black text-brand-dark capitalize tracking-tight">{editingItem ? 'Düzenle' : 'Yeni Ekle'} <span className="text-brand-blue">{modalType}</span></h2>
              <p className="text-xs text-slate-400 font-bold mt-1">Lütfen tüm alanları profesyonel bir dille doldurun.</p>
            </div>
            <button onClick={() => setIsModalOpen(false)} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-brand-gray transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-10 max-h-[70vh] overflow-y-auto">
            {renderForm()}
          </div>

          <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-50 flex items-center justify-end space-x-3">
            <button onClick={() => setIsModalOpen(false)} className="px-6 py-4 text-slate-400 font-black text-sm capitalize tracking-widest hover:text-brand-dark transition-colors">İptal</button>
            <button onClick={() => handleSave(formData)} className="px-10 py-4 bg-brand-blue text-white font-black text-sm capitalize tracking-widest rounded-2xl shadow-xl shadow-brand-blue/20 hover:bg-brand-dark transition-all">Değişiklikleri Kaydet</button>
          </div>
        </div>
      </div>
    );
  };

  const Dashboard = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Toplam Şube', value: branches.length, icon: Building2, color: 'text-brand-blue', bg: 'bg-blue-50' },
          { label: 'Aktif Haberler', value: news.length, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Video Sayısı', value: videos.length, icon: Video, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Paket Sayısı', value: packages.length, icon: Package, color: 'text-green-600', bg: 'bg-green-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-7 rounded-[24px] shadow-sm border border-slate-100 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-slate-400 text-[11px] font-black capitalize tracking-[0.15em] mb-1">{stat.label}</p>
            <div className="text-3xl font-black text-brand-dark tracking-tighter">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-brand-dark rounded-[32px] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2.5 px-4 py-2 bg-brand-blue/10 rounded-full text-brand-blue text-[11px] font-black capitalize tracking-widest border border-brand-blue/20">
              <Sparkles className="w-4 h-4" />
              <span>Gemini AI Lab</span>
            </div>
            <h2 className="text-4xl font-black capitalize tracking-tight leading-tight">İçerik Üretimini <br /><span className="text-brand-blue italic">Otomatize Edin</span></h2>
            <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-lg">Profesyonel haber metinleri, video açıklamaları ve sosyal medya duyurularını saniyeler içinde hazırlayın.</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[24px] p-8 space-y-6 shadow-2xl">
            <div className="space-y-2">
              <label className="text-xs font-black capitalize tracking-widest text-brand-blue">Konu Başlığı</label>
              <input
                type="text"
                placeholder="Örn: 2026 Erken Kayıt Dönemi..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 ring-brand-blue/20 transition-all font-bold"
              />
            </div>
            <button className="w-full py-5 bg-brand-blue text-white font-black rounded-2xl hover:bg-white hover:text-brand-dark shadow-2xl shadow-brand-blue/20 transition-all flex items-center justify-center space-x-3 group">
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>Sihirli Taslak Oluştur</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );





  return (
    <div className="p-8">
      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={hideAlert}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-black text-brand-dark mb-4">Silme Onayı</h3>
            <p className="text-slate-600 mb-8">
              {deleteConfirm.type === 'student' 
                ? 'Bu öğrenciyi silmek istediğinize emin misiniz?' 
                : 'Bu içeriği silmek istediğinize emin misiniz?'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
              >
                İptal
              </button>
              <button
                onClick={deleteConfirm.type === 'student' ? confirmDeleteStudent : confirmDelete}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/approvals" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <ApprovalsManager /> : <Navigate to="/admin" />} />
        <Route path="/content-sections" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <ContentSectionsManager /> : <Navigate to="/admin" />} />
        <Route path="/menus" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <MenuManager menus={menus} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete} /> : <Navigate to="/admin" />} />
        <Route path="/pages" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <PageManager pages={pages} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete} /> : <Navigate to="/admin" />} />
        <Route path="/categories" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <CategoryManager categories={categories} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete} /> : <Navigate to="/admin" />} />
        <Route path="/sliders" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <SliderManager sliders={sliders} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete} /> : <Navigate to="/admin" />} />
        <Route path="/news" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN, UserRole.BRANCH_ADMIN]) ? <BlogManager blogPosts={blogPosts} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete} /> : <Navigate to="/admin" />} />
        <Route path="/branches" element={hasAccess([UserRole.SUPER_ADMIN]) ? <BranchManager branches={branches} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete} /> : <Navigate to="/admin" />} />
        <Route path="/videos" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <VideoManager videos={videos} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete} /> : <Navigate to="/admin" />} />
        <Route path="/packages" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <PackageManager packages={packages} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete} /> : <Navigate to="/admin" />} />
        <Route path="/successes" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <YearlySuccessManager successes={yearlySuccesses} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete} handleAddStudent={handleAddStudent} handleDeleteStudent={handleDeleteStudent} /> : <Navigate to="/admin" />} />
        <Route path="/media" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <MediaManager mediaItems={mediaItems} handleAdd={handleAdd} handleDelete={handleDelete} /> : <Navigate to="/admin" />} />
        <Route path="/leads" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <LeadManager /> : <Navigate to="/admin" />} />
        <Route path="/franchise" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <FranchiseManager /> : <Navigate to="/admin" />} />
        <Route path="/users" element={hasAccess([UserRole.SUPER_ADMIN]) ? <UserManager adminUsers={adminUsers} branches={branches} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete} /> : <Navigate to="/admin" />} />
        <Route path="/settings" element={hasAccess([UserRole.SUPER_ADMIN]) ? <SettingsManager /> : <Navigate to="/admin" />} />
        <Route path="/banner-cards" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <BannerCardManager bannerCards={bannerCards} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete} /> : <Navigate to="/admin" />} />
        <Route path="/statistics" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <StatisticsManager statistics={statistics} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete} /> : <Navigate to="/admin" />} />
        <Route path="/features" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <FeaturesManager features={features} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete} /> : <Navigate to="/admin" />} />
        <Route path="/blog-posts" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <BlogManager blogPosts={blogPosts} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete} /> : <Navigate to="/admin" />} />
        <Route path="/exam-dates" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <ExamDatesManager examDates={examDates} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete} /> : <Navigate to="/admin" />} />
        <Route path="/social-media" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <SocialMediaManager socialMedia={socialMedia} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete} /> : <Navigate to="/admin" />} />
        <Route path="/youtube" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <YouTubeManager channels={youtubeChannels} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete} /> : <Navigate to="/admin" />} />
        <Route path="/success" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <YearlySuccessManager successes={yearlySuccesses} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete} handleAddStudent={handleAddStudent} handleDeleteStudent={handleDeleteStudent} /> : <Navigate to="/admin" />} />
        <Route path="/home-sections" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <HomeSectionManager homeSections={homeSections} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete} /> : <Navigate to="/admin" />} />
        <Route path="/teachers" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <TeacherManager teachers={teachers} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete} /> : <Navigate to="/admin" />} />
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-20 h-20 bg-slate-200 rounded-3xl flex items-center justify-center animate-pulse">
              <Settings className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-xl font-black text-brand-dark capitalize tracking-widest opacity-20">Bu Modül Yapım Aşamasında</h2>
          </div>
        } />
      </Routes>
      <EditModal />
    </div>
  );
};

export default AdminPanel;
