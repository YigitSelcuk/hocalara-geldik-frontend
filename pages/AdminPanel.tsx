import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import {
  Building2, FileText, Video, Package, Settings, Sparkles, X
} from 'lucide-react';
import {
  sliderService, branchService,
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
  EducationPackage, VideoLesson,
  Menu, Page, Category, Media,
  BannerCard, Statistic, Feature, BlogPost, ExamDate, SocialMedia,
  YouTubeChannel, YearlySuccess, TopStudent, HomeSection, Teacher
} from '../types';
import { SettingsManager } from '../components/admin/SettingsManager';
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
import { SliderForm } from '../components/admin/forms/SliderForm';
import { NewsForm } from '../components/admin/forms/NewsForm';
import { BranchForm } from '../components/admin/forms/BranchForm';
import { VideoForm } from '../components/admin/forms/VideoForm';
import { PackageForm } from '../components/admin/forms/PackageForm';
import { UserForm } from '../components/admin/forms/UserForm';
import { BannerCardForm } from '../components/admin/forms/BannerCardForm';
import { StatisticForm } from '../components/admin/forms/StatisticForm';
import { FeatureForm } from '../components/admin/forms/FeatureForm';
import { BlogForm } from '../components/admin/forms/BlogForm';
import { ExamDateForm } from '../components/admin/forms/ExamDateForm';
import { SocialMediaForm } from '../components/admin/forms/SocialMediaForm';
import { YouTubeForm } from '../components/admin/forms/YouTubeForm';
import { YearlySuccessForm } from '../components/admin/forms/YearlySuccessForm';
import { StudentForm } from '../components/admin/forms/StudentForm';
import { HomeSectionForm } from '../components/admin/forms/HomeSectionForm';
import { TeacherForm } from '../components/admin/forms/TeacherForm';
import { CategoryForm } from '../components/admin/forms/CategoryForm';

export const AdminPanel = ({ user }: { user: AdminUser | null }) => {
  // Debug: Log user info
  console.log('👤 AdminPanel User:', user);
  console.log('👤 User Role:', user?.role);
  console.log('👤 Is BRANCH_ADMIN?', user?.role === UserRole.BRANCH_ADMIN);

  // Helper component to extract branchId from params
  const BranchAdminPanelWrapper = () => {
    const { id } = useParams();
    if (!user) return null;
    return <BranchAdminPanel user={user} branchId={id} />;
  };

  const BranchPackagesWrapper = () => {
    const { branchId } = useParams();
    return <BranchPackages user={user || undefined} branchId={branchId} />;
  };

  const BranchNewsWrapper = () => {
    const { branchId } = useParams();
    return <BranchNews branchId={branchId} />;
  };

  const BranchSuccessesWrapper = () => {
    const { branchId } = useParams();
    return <BranchSuccesses user={user || undefined} branchId={branchId} />;
  };

  const BranchLeadsWrapper = () => {
    const { branchId } = useParams();
    return <BranchLeads user={user || undefined} branchId={branchId} />;
  };

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

  // Form States (Moved from EditModal)
  const [formData, setFormData] = useState<any>({});
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Initialize form data when modal opens or editing item changes
  useEffect(() => {
    if (isModalOpen) {
      const data = editingItem || {};
      
      // Initialize features array if it doesn't exist or is not an array
      if (!Array.isArray(data.features)) {
        data.features = [];
      }
      
      // For student modal, preserve yearlySuccessId but clear other fields
      if (modalType === 'student' && data.isNewStudent) {
        setFormData({
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
        });
      } else {
        setFormData(data);
      }
      
      // Set preview url
      setPreviewUrl(data.image || '');
      setSelectedFile(null);
    } else {
      // Reset form when modal closes
      setFormData({});
      setPreviewUrl('');
      setSelectedFile(null);
    }
  }, [isModalOpen, editingItem, modalType]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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

  const handleAdd = (type: typeof modalType, initialData?: any) => {
    setModalType(type);
    setEditingItem(initialData || null);
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
    } catch (error: any) {
      console.error('Image upload failed:', error);
      if (error.response?.status === 413) {
        throw new Error('Dosya boyutu çok büyük (Maksimum 5MB)');
      }
      throw error;
    }
  };

  const handleToggleStatus = async (type: string, item: any) => {
    if (type === 'branch') {
        try {
            const updatedBranch = { ...item, isActive: !(item.isActive !== false) };
            await branchService.update(item.id, updatedBranch);
            setBranches((prev) => prev.map((b) => (b.id === item.id ? { ...b, isActive: updatedBranch.isActive } : b)));
            showAlert('success', `Şube durumu ${updatedBranch.isActive ? 'aktif' : 'pasif'} olarak güncellendi.`);
        } catch (error) {
            console.error('Status update failed:', error);
            showAlert('error', 'Durum güncellenemedi.');
        }
    }
    
    if (type === 'yearlySuccess') {
        try {
            console.log('🔄 Toggling status for yearlySuccess:', item);
            const updatedSuccess = { ...item, isActive: !item.isActive };
            console.log('📤 Sending update to backend:', updatedSuccess);
            
            await yearlySuccessService.update(item.id, updatedSuccess);
            console.log('✅ Backend update successful');
            
            setYearlySuccesses((prev) => {
                const updatedList = prev.map((s) => (s.id === item.id ? { ...s, isActive: updatedSuccess.isActive } : s));
                console.log('📋 Updated yearlySuccesses list:', updatedList);
                return updatedList;
            });
            
            showAlert('success', `Yıl durumu ${updatedSuccess.isActive ? 'aktif' : 'pasif'} olarak güncellendi.`);
        } catch (error) {
            console.error('❌ Status update failed:', error);
            showAlert('error', 'Durum güncellenemedi.');
        }
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
            return { ...s, students: [newItem.data.data || newItem.data, ...(s.students || [])] };
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

      if (editingItem && editingItem.id) {
        console.log('🔄 UPDATE mode');
        // Update
        let updatedItem: any;
        switch (type) {
          case 'slider':
            updatedItem = await sliderService.update(editingItem.id, data);
            const updatedSlider = updatedItem.data.slider || updatedItem.data.data || updatedItem.data;
            setSliders((prev: SliderItem[]) => prev.map((item: SliderItem) => item.id === editingItem.id ? updatedSlider : item));
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
            setCategories((prev: Category[]) => prev.map((item: Category) => item.id === editingItem.id ? (updatedItem.data.category || updatedItem.data) : item));
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
            setYearlySuccesses((prev: YearlySuccess[]) => prev.map((item: YearlySuccess) => item.id === editingItem.id ? (updatedItem.data.data || updatedItem.data) : item));
            break;
          case 'homeSection':
            updatedItem = await homeSectionService.update(editingItem.id, data);
            setHomeSections((prev: HomeSection[]) => prev.map((item: HomeSection) => item.id === editingItem.id ? updatedItem.data : item));
            break;
          case 'teacher':
            updatedItem = await teacherService.update(editingItem.id, data);
            setTeachers((prev: Teacher[]) => prev.map((item: Teacher) => item.id === editingItem.id ? updatedItem.data : item));
            break;
          case 'blog':
            updatedItem = await blogPostService.update(editingItem.id, data);
            // Refetch blog posts to get complete data with image
            const blogPostsRes = await blogPostService.getAll();
            const blogData = (blogPostsRes.data as any).data || (blogPostsRes.data as any).blogPosts || [];
            setBlogPosts(Array.isArray(blogData) ? blogData : []);
            break;
        }
      } else {
        console.log('➕ CREATE mode');
        // Create
        let newItem: any;
        switch (type) {
          case 'slider':
            newItem = await sliderService.create(data);
            const createdSlider = newItem.data.slider || newItem.data;
            setSliders((prev: SliderItem[]) => [createdSlider, ...prev]);
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
            setCategories((prev: Category[]) => [(newItem.data.category || newItem.data), ...prev]);
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
            // Refetch blog posts to get complete data with image
            const blogPostsRes = await blogPostService.getAll();
            const blogData = (blogPostsRes.data as any).data || (blogPostsRes.data as any).blogPosts || [];
            setBlogPosts(Array.isArray(blogData) ? blogData : []);
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
            setYearlySuccesses((prev: YearlySuccess[]) => [newItem.data.data || newItem.data, ...prev]);
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
      showAlert('success', editingItem ? 'Başarıyla güncellendi!' : 'Başarıyla eklendi!');
    } catch (error: any) {
      console.error('Save error:', error);
      
      let errorMessage = 'Kaydetme işlemi başarısız oldu.';
      
      if (error.response) {
        if (error.response.data && error.response.data.errors && Array.isArray(error.response.data.errors)) {
          errorMessage = error.response.data.errors.map((err: any) => err.msg).join('\n');
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showAlert('error', errorMessage);
    }
  };

  // --- SUB-COMPONENTS ---
  // Note: Sidebar and Topbar are now handled by AdminLayout


  // --- MODAL FORM RENDERER ---
  const renderForm = () => {
    switch (modalType) {
      case 'slider':
        return (
          <SliderForm
            formData={formData}
            setFormData={setFormData}
            previewUrl={previewUrl}
            setPreviewUrl={setPreviewUrl}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            handleFileSelect={handleFileSelect}
          />
        );
      case 'news':
        return (
          <NewsForm
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            branches={branches}
            handleImageUpload={handleImageUpload}
            showAlert={showAlert}
          />
        );
      case 'branch':
        return (
          <BranchForm
            formData={formData}
            setFormData={setFormData}
            handleImageUpload={handleImageUpload}
            showAlert={showAlert}
            editingItem={editingItem}
          />
        );
      case 'video':
        return <VideoForm formData={formData} setFormData={setFormData} />;
      case 'package':
        return (
          <PackageForm
            formData={formData}
            setFormData={setFormData}
            handleImageUpload={handleImageUpload}
            showAlert={showAlert}
            categories={categories.filter(c => c.type === 'PACKAGE')}
          />
        );
      case 'user':
        return (
          <UserForm
            formData={formData}
            setFormData={setFormData}
            branches={branches}
          />
        );
      case 'category':
        return (
          <CategoryForm
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 'bannerCard':
        return <BannerCardForm formData={formData} setFormData={setFormData} />;
      case 'statistic':
        return <StatisticForm formData={formData} setFormData={setFormData} />;
      case 'feature':
        return <FeatureForm formData={formData} setFormData={setFormData} />;
      case 'blog':
        return (
          <BlogForm
            formData={formData}
            setFormData={setFormData}
            handleImageUpload={handleImageUpload}
            showAlert={showAlert}
            categories={categories}
          />
        );
      case 'examDate':
        return <ExamDateForm formData={formData} setFormData={setFormData} />;
      case 'socialMedia':
        return <SocialMediaForm formData={formData} setFormData={setFormData} />;
      case 'youtube':
        return <YouTubeForm formData={formData} setFormData={setFormData} />;
      case 'yearlySuccess':
        return (
          <YearlySuccessForm
            formData={formData}
            setFormData={setFormData}
            handleImageUpload={handleImageUpload}
            showAlert={showAlert}
            editingItem={editingItem}
          />
        );
      case 'student':
        return (
          <StudentForm
            formData={formData}
            setFormData={setFormData}
            branches={branches}
            handleImageUpload={handleImageUpload}
            showAlert={showAlert}
          />
        );
      case 'homeSection':
        return <HomeSectionForm formData={formData} setFormData={setFormData} />;
      case 'teacher':
        return (
          <TeacherForm
            formData={formData}
            setFormData={setFormData}
            branches={branches}
          />
        );
      default:
        return <p>Form henüz hazır değil...</p>;
    }
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
        <Route path="/branches" element={hasAccess([UserRole.SUPER_ADMIN]) ? <BranchManager branches={branches} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete} handleToggleStatus={handleToggleStatus} /> : <Navigate to="/admin" />} />
        <Route path="/branch/:id" element={hasAccess([UserRole.SUPER_ADMIN]) ? <BranchAdminPanelWrapper /> : <Navigate to="/admin" />} />
        <Route path="/branch/:branchId/packages" element={hasAccess([UserRole.SUPER_ADMIN]) ? <BranchPackagesWrapper /> : <Navigate to="/admin" />} />
        <Route path="/branch/:branchId/news" element={hasAccess([UserRole.SUPER_ADMIN]) ? <BranchNewsWrapper /> : <Navigate to="/admin" />} />
        <Route path="/branch/:branchId/successes" element={hasAccess([UserRole.SUPER_ADMIN]) ? <BranchSuccessesWrapper /> : <Navigate to="/admin" />} />
        <Route path="/branch/:branchId/leads" element={hasAccess([UserRole.SUPER_ADMIN]) ? <BranchLeadsWrapper /> : <Navigate to="/admin" />} />
        <Route path="/videos" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <VideoManager videos={videos} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete} /> : <Navigate to="/admin" />} />
        <Route path="/packages" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <PackageManager packages={packages} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete} onReorder={async () => {
          const packagesRes = await packageService.getAll();
          setPackages(packagesRes.data.data || packagesRes.data.packages || []);
        }} /> : <Navigate to="/admin" />} />
        <Route path="/successes" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <YearlySuccessManager successes={yearlySuccesses} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete} handleAddStudent={handleAddStudent} handleDeleteStudent={handleDeleteStudent} handleToggleStatus={handleToggleStatus} /> : <Navigate to="/admin" />} />
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
        <Route path="/success" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <YearlySuccessManager successes={yearlySuccesses} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete} handleAddStudent={handleAddStudent} handleDeleteStudent={handleDeleteStudent} handleToggleStatus={handleToggleStatus} /> : <Navigate to="/admin" />} />
        <Route path="/home-sections" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <HomeSectionManager /> : <Navigate to="/admin" />} />
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
      
      {/* Edit Modal */}
      {isModalOpen && (
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
              <button onClick={async () => {
                let finalData = { ...formData };
                if (modalType === 'slider' && selectedFile) {
                  try {
                    const url = await handleImageUpload(selectedFile);
                    finalData.image = url;
                  } catch (e) {
                    return;
                  }
                }
                
                // Validate slider fields
                if (modalType === 'slider') {
                  if (!finalData.image) {
                    showAlert('error', 'Lütfen görsel yükleyiniz');
                    return;
                  }
                  
                  // Button validation
                  if (finalData.primaryButtonText && !finalData.primaryButtonLink) {
                    showAlert('error', 'Birinci buton için link girmelisiniz');
                    return;
                  }
                  if (finalData.secondaryButtonText && !finalData.secondaryButtonLink) {
                    showAlert('error', 'İkinci buton için link girmelisiniz');
                    return;
                  }
                }

                // Validate blog fields
                if (modalType === 'blog') {
                  if (!finalData.title) {
                    showAlert('error', 'Lütfen başlık giriniz');
                    return;
                  }
                  if (!finalData.slug) {
                     // Slug is usually optional/auto-generated, but if user wants ALL fields, maybe warn? 
                     // But placeholder says auto-generated. Let's keep it optional or auto-generate if missing before send.
                     // Actually, let's leave slug as is (optional) because it's technical.
                  }
                  if (!finalData.excerpt) {
                    showAlert('error', 'Lütfen özet giriniz');
                    return;
                  }
                  if (!finalData.content) {
                    showAlert('error', 'Lütfen içerik giriniz');
                    return;
                  }
                  if (!finalData.category) {
                    showAlert('error', 'Lütfen kategori giriniz');
                    return;
                  }
                  if (!finalData.image) {
                    showAlert('error', 'Lütfen kapak görseli yükleyiniz');
                    return;
                  }
                  
                  // SEO Fields Validation
                  if (!finalData.seoTitle) {
                    showAlert('error', 'Lütfen SEO başlığı giriniz');
                    return;
                  }
                  if (!finalData.seoDescription) {
                    showAlert('error', 'Lütfen SEO açıklaması giriniz');
                    return;
                  }
                  if (!finalData.seoKeywords) {
                    showAlert('error', 'Lütfen SEO anahtar kelimeleri giriniz');
                    return;
                  }

                  if (!finalData.author) {
                    // Otomatik yazar atama
                    if (user && user.name) {
                      finalData.author = user.name;
                    } else {
                      showAlert('error', 'Lütfen yazar giriniz');
                      return;
                    }
                  }
                  if (!finalData.date) {
                    // Otomatik tarih atama
                    finalData.date = new Date().toISOString().split('T')[0];
                  }
                  if (!finalData.readTime) {
                    // Otomatik okuma süresi hesaplama (dakikada ortalama 200 kelime)
                    const wordCount = finalData.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
                    const readTime = Math.ceil(wordCount / 200);
                    finalData.readTime = `${readTime} dk`;
                  }
                }

                // Validate branch fields
                if (modalType === 'branch') {
                  // Auto-generate slug if missing but name exists
                  if (!finalData.slug && finalData.name) {
                     finalData.slug = finalData.name
                       .toLowerCase()
                       .replace(/ğ/g, 'g')
                       .replace(/ü/g, 'u')
                       .replace(/ş/g, 's')
                       .replace(/ı/g, 'i')
                       .replace(/ö/g, 'o')
                       .replace(/ç/g, 'c')
                       .replace(/[^a-z0-9\s-]/g, '')
                       .trim()
                       .replace(/\s+/g, '-');
                   }

                   // Check for unique slug
                   const existingBranch = branches.find(b => b.slug === finalData.slug);
                   if (existingBranch) {
                     // If creating new branch OR editing a branch but slug belongs to ANOTHER branch
                     if (!editingItem || (editingItem && existingBranch.id !== editingItem.id)) {
                        showAlert('error', 'Bu URL Slug zaten başka bir şube tarafından kullanılıyor. Lütfen benzersiz bir slug giriniz veya otomatik oluşturulmasını sağlayınız.');
                        return;
                     }
                   }
 
                    const requiredFields = [
                    { key: 'name', label: 'Şube Adı' },
                    { key: 'slug', label: 'URL Slug' },
                    { key: 'description', label: 'Açıklama' },
                    { key: 'address', label: 'Adres' },
                    { key: 'phone', label: 'Telefon' },
                    { key: 'whatsapp', label: 'WhatsApp' },
                    { key: 'email', label: 'E-posta' },
                    { key: 'lat', label: 'Enlem' },
                    { key: 'lng', label: 'Boylam' },
                    { key: 'logo', label: 'Logo' },
                    { key: 'image', label: 'Kapak Görseli' },
                    { key: 'successBanner', label: 'Başarı Banner' }
                  ];

                  for (const field of requiredFields) {
                    if (!finalData[field.key]) {
                      showAlert('error', `Lütfen ${field.label} alanını doldurunuz`);
                      return;
                    }
                  }

                  // Validate admin fields for new branches
                  if (!editingItem) {
                     if (!finalData.adminName) {
                        showAlert('error', 'Lütfen Yönetici Adı giriniz');
                        return;
                     }
                     if (!finalData.adminEmail) {
                        showAlert('error', 'Lütfen Yönetici E-posta giriniz');
                        return;
                     }
                     if (!finalData.adminPassword) {
                        showAlert('error', 'Lütfen Yönetici Şifresi giriniz');
                        return;
                     }
                  }
                }

                // Validate package fields
                if (modalType === 'package') {
                  const requiredFields = [
                    { key: 'name', label: 'Paket Adı' },
                    { key: 'type', label: 'Tür' },
                    { key: 'shortDescription', label: 'Kısa Açıklama' },
                    { key: 'description', label: 'Detaylı Açıklama' },
                    { key: 'price', label: 'Fiyat' },
                    { key: 'image', label: 'Paket Görseli' }
                  ];

                  for (const field of requiredFields) {
                    if (!finalData[field.key]) {
                      showAlert('error', `Lütfen ${field.label} alanını doldurunuz`);
                      return;
                    }
                  }
                }

                // Validate yearly success fields
                if (modalType === 'yearlySuccess') {
                  const requiredFields = [
                    { key: 'year', label: 'Yıl' },
                    { key: 'totalDegrees', label: 'Toplam Derece' },
                    { key: 'placementCount', label: 'Yerleşme Sayısı' },
                    { key: 'successRate', label: 'Başarı Oranı' },
                    { key: 'cityCount', label: 'İl Sayısı' }
                  ];

                  for (const field of requiredFields) {
                    if (!finalData[field.key]) {
                      showAlert('error', `Lütfen ${field.label} alanını doldurunuz`);
                      return;
                    }
                  }

                  if (!finalData.banner?.title) {
                    showAlert('error', 'Lütfen Banner Başlığı alanını doldurunuz');
                    return;
                  }
                  if (!finalData.banner?.subtitle) {
                    showAlert('error', 'Lütfen Banner Alt Başlık alanını doldurunuz');
                    return;
                  }
                  if (!finalData.banner?.description) {
                    showAlert('error', 'Lütfen Banner Açıklama alanını doldurunuz');
                    return;
                  }
                  if (!finalData.banner?.image) {
                    showAlert('error', 'Lütfen Banner Görseli yükleyiniz');
                    return;
                  }
                }

                handleSave(finalData);
              }} className="px-10 py-4 bg-brand-blue text-white font-black text-sm capitalize tracking-widest rounded-2xl shadow-xl shadow-brand-blue/20 hover:bg-brand-dark transition-all">Değişiklikleri Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
