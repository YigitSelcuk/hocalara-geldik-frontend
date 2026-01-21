import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  Building2, FileText, Video, Package, Settings, Sparkles, X
} from 'lucide-react';
import {
  sliderService, newsService, branchService,
  videoService, packageService, userService,
  menuService, pageService, categoryService,
  mediaService, leadService
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
import { LeadManager } from '../components/admin/LeadManager';
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

export const AdminPanel = ({ user }: { user: AdminUser | null }) => {
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
  const [leads, setLeads] = useState<Lead[]>([]);
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
          mediaRes, leadsRes,
          bannerCardsRes, statisticsRes, featuresRes,
          blogPostsRes, examDatesRes, socialMediaRes,
          youtubeChannelsRes, yearlySuccessRes, homeSectionsRes,
          teachersRes
        ] = await Promise.allSettled([
          sliderService.getAll(),
          newsService.getAll(),
          branchService.getAll(),
          videoService.getAll(),
          packageService.getAll(),
          userService.getAll(),
          menuService.getAll(),
          pageService.getAll(),
          categoryService.getAll(),
          mediaService.getAll(),
          leadService.getAll(),
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
        setNews(newsRes.status === 'fulfilled' ? (newsRes.value.data.news || []) : []);
        setBranches(branchesRes.status === 'fulfilled' ? (branchesRes.value.data.branches || []) : []);
        setVideos(videosRes.status === 'fulfilled' ? (videosRes.value.data.videos || []) : []);
        setPackages(packagesRes.status === 'fulfilled' ? (packagesRes.value.data.packages || []) : []);
        setAdminUsers(usersRes.status === 'fulfilled' ? (usersRes.value.data.users || []) : []);
        setMenus(menusRes.status === 'fulfilled' ? (menusRes.value.data.menus || []) : []);
        setPages(pagesRes.status === 'fulfilled' ? (pagesRes.value.data.pages || []) : []);
        setCategories(categoriesRes.status === 'fulfilled' ? (categoriesRes.value.data.categories || []) : []);
        setMediaItems(mediaRes.status === 'fulfilled' ? (mediaRes.value.data.media || []) : []);
        setLeads(leadsRes.status === 'fulfilled' ? (leadsRes.value.data.leads || []) : []);
        setBannerCards(bannerCardsRes.status === 'fulfilled' ? ((bannerCardsRes.value.data as any).bannerCards || (bannerCardsRes.value.data as any).data || []) : []);
        setStatistics(statisticsRes.status === 'fulfilled' ? ((statisticsRes.value.data as any).statistics || (statisticsRes.value.data as any).data || []) : []);
        setFeatures(featuresRes.status === 'fulfilled' ? ((featuresRes.value.data as any).features || (featuresRes.value.data as any).data || []) : []);
        setBlogPosts(blogPostsRes.status === 'fulfilled' ? ((blogPostsRes.value.data as any).blogPosts || (blogPostsRes.value.data as any).data || []) : []);
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
    if (!window.confirm('Bu içeriği silmek istediğinize emin misiniz?')) return;

    try {
      switch (type) {
        case 'slider':
          await sliderService.delete(id);
          setSliders((prev: SliderItem[]) => prev.filter((item: SliderItem) => item.id !== id));
          break;
        case 'news':
          await newsService.delete(id);
          setNews((prev: NewsItem[]) => prev.filter((item: NewsItem) => item.id !== id));
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
        case 'lead':
          await leadService.delete(id);
          setLeads((prev: Lead[]) => prev.filter((item: Lead) => item.id !== id));
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
    } catch (error) {
      alert('Silme işlemi başarısız oldu.');
    }
  };

  const handleAddStudent = (successId: string) => {
    setModalType('student');
    setEditingItem({ yearlySuccessId: successId });
    setIsModalOpen(true);
  };

  const handleDeleteStudent = async (successId: string, studentId: string) => {
    if (!window.confirm('Bu öğrenciyi silmek istediğinize emin misiniz?')) return;
    try {
      await yearlySuccessService.deleteStudent(successId, studentId);
      setYearlySuccesses((prev: YearlySuccess[]) => prev.map((s: YearlySuccess) => {
        if (s.id === successId) {
          return { ...s, students: s.students?.filter((st: TopStudent) => st.id !== studentId) };
        }
        return s;
      }));
    } catch (error) {
      alert('Öğrenci silinemedi.');
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

  const handleSave = async (data: any) => {
    const type = modalType;
    try {
      if (editingItem) {
        // Update
        let updatedItem: any;
        switch (type) {
          case 'slider':
            updatedItem = await sliderService.update(editingItem.id, data);
            setSliders((prev: SliderItem[]) => prev.map((item: SliderItem) => item.id === editingItem.id ? updatedItem.data : item));
            break;
          case 'news':
            updatedItem = await newsService.update(editingItem.id, data);
            setNews((prev: NewsItem[]) => prev.map((item: NewsItem) => item.id === editingItem.id ? updatedItem.data : item));
            break;
          case 'branch':
            updatedItem = await branchService.update(editingItem.id, data);
            setBranches((prev: Branch[]) => prev.map((item: Branch) => item.id === editingItem.id ? updatedItem.data : item));
            break;
          case 'video':
            updatedItem = await videoService.update(editingItem.id, data);
            setVideos((prev: VideoLesson[]) => prev.map((item: VideoLesson) => item.id === editingItem.id ? updatedItem.data : item));
            break;
          case 'package':
            updatedItem = await packageService.update(editingItem.id, data);
            setPackages((prev: EducationPackage[]) => prev.map((item: EducationPackage) => item.id === editingItem.id ? updatedItem.data : item));
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
        // Create
        let newItem: any;
        switch (type) {
          case 'slider':
            newItem = await sliderService.create(data);
            setSliders((prev: SliderItem[]) => [newItem.data, ...prev]);
            break;
          case 'news':
            newItem = await newsService.create(data);
            setNews((prev: NewsItem[]) => [newItem.data, ...prev]);
            break;
          case 'branch':
            newItem = await branchService.create(data);
            setBranches((prev: Branch[]) => [newItem.data, ...prev]);
            break;
          case 'video':
            newItem = await videoService.create(data);
            setVideos((prev: VideoLesson[]) => [newItem.data, ...prev]);
            break;
          case 'package':
            newItem = await packageService.create(data);
            setPackages((prev: EducationPackage[]) => [newItem.data, ...prev]);
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
          case 'student':
            newItem = await yearlySuccessService.addStudent(editingItem.yearlySuccessId, data);
            setYearlySuccesses((prev: YearlySuccess[]) => prev.map((s: YearlySuccess) => {
              if (s.id === editingItem.yearlySuccessId) {
                return { ...s, students: [newItem.data, ...(s.students || [])] };
              }
              return s;
            }));
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
      alert('Kaydetme işlemi başarısız oldu.');
    }
  };

  // --- SUB-COMPONENTS ---
  // Note: Sidebar and Topbar are now handled by AdminLayout


  // --- MODAL & FORM COMPONENT ---
  const EditModal = () => {
    if (!isModalOpen) return null;

    const [formData, setFormData] = useState<any>(editingItem || {});

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
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Haber Başlığı</label>
                <input type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Haber İçeriği</label>
                <textarea rows={4} value={formData.content || ''} onChange={e => setFormData({ ...formData, content: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Tarih</label>
                  <input type="text" value={formData.date || ''} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Kapsam</label>
                  <select value={formData.isMain ? 'main' : (formData.branchId || '')} onChange={e => setFormData({ ...formData, isMain: e.target.value === 'main', branchId: e.target.value === 'main' ? undefined : e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold">
                    <option value="main">Genel / Kurumsal</option>
                    {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Görsel URL</label>
                <input type="text" value={formData.image || ''} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
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
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Adres</label>
                <input type="text" value={formData.address || ''} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Telefon</label>
                  <input type="text" value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">WhatsApp</label>
                  <input type="text" value={formData.whatsapp || ''} onChange={e => setFormData({ ...formData, whatsapp: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Enlem (Lat)</label>
                  <input type="number" step="0.000001" value={formData.latitude || ''} onChange={e => setFormData({ ...formData, latitude: parseFloat(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Boylam (Lng)</label>
                  <input type="number" step="0.000001" value={formData.longitude || ''} onChange={e => setFormData({ ...formData, longitude: parseFloat(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Logo URL</label>
                  <input type="text" value={formData.logo || ''} onChange={e => setFormData({ ...formData, logo: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Kurumsal Renk</label>
                  <input type="color" value={formData.primaryColor || '#0052FF'} onChange={e => setFormData({ ...formData, primaryColor: e.target.value })} className="w-full h-[46px] bg-slate-50 border border-slate-100 rounded-xl px-2 py-1 focus:outline-none focus:border-brand-blue cursor-pointer" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Kapak Görseli URL</label>
                  <input type="text" value={formData.image || ''} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Başarı Banner URL</label>
                  <input type="text" value={formData.successBanner || ''} onChange={e => setFormData({ ...formData, successBanner: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
              </div>
            </div>
          );
        case 'video':
          return (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Video Başlığı</label>
                <input type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Kategori</label>
                  <select value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold">
                    {Object.values(VideoCategory).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Ders / Branş</label>
                  <input type="text" value={formData.subject || ''} onChange={e => setFormData({ ...formData, subject: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
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
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Thumbnail URL</label>
                <input type="text" value={formData.thumbnail || ''} onChange={e => setFormData({ ...formData, thumbnail: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Video URL (Embed)</label>
                <input type="text" value={formData.videoUrl || ''} onChange={e => setFormData({ ...formData, videoUrl: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
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
                  <select value={formData.type || ''} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold">
                    {Object.values(PackageType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Kısa Açıklama</label>
                <input type="text" value={formData.shortDescription || ''} onChange={e => setFormData({ ...formData, shortDescription: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Fiyat</label>
                  <input type="number" value={formData.price || 0} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">İndirim Oranı (%)</label>
                  <input type="number" value={formData.discount || 0} onChange={e => setFormData({ ...formData, discount: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Görsel URL</label>
                <input type="text" value={formData.image || ''} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
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
                  <select value={formData.assignedBranchId || ''} onChange={e => setFormData({ ...formData, assignedBranchId: e.target.value || undefined })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold">
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
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Başlık</label>
                <input type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Özet</label>
                <textarea value={formData.excerpt || ''} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} rows={2} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">İçerik</label>
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
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Derece Sayısı</label>
                  <input type="number" value={formData.stats?.totalDegrees || 0} onChange={e => setFormData({ ...formData, stats: { ...formData.stats, totalDegrees: parseInt(e.target.value) } })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
              </div>

              <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 space-y-4">
                <h4 className="text-[10px] font-black text-brand-blue uppercase tracking-widest">Banner Bilgileri</h4>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Banner Başlığı</label>
                  <input type="text" value={formData.banner?.title || ''} onChange={e => setFormData({ ...formData, banner: { ...formData.banner, title: e.target.value } })} className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Banner Açıklama</label>
                  <textarea value={formData.banner?.description || ''} onChange={e => setFormData({ ...formData, banner: { ...formData.banner, description: e.target.value } })} rows={3} className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Görsel URL</label>
                  <input type="text" value={formData.banner?.image || ''} onChange={e => setFormData({ ...formData, banner: { ...formData.banner, image: e.target.value } })} className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Fotoğraf URL</label>
                  <input type="text" value={formData.image || ''} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
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
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/menus" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <MenuManager menus={menus} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete} /> : <Navigate to="/admin" />} />
        <Route path="/pages" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <PageManager pages={pages} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete} /> : <Navigate to="/admin" />} />
        <Route path="/categories" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <CategoryManager categories={categories} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete} /> : <Navigate to="/admin" />} />
        <Route path="/sliders" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <SliderManager sliders={sliders} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete} /> : <Navigate to="/admin" />} />
        <Route path="/news" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN, UserRole.BRANCH_ADMIN]) ? <NewsManager user={user} news={news} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete} /> : <Navigate to="/admin" />} />
        <Route path="/branches" element={hasAccess([UserRole.SUPER_ADMIN]) ? <BranchManager branches={branches} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete} /> : <Navigate to="/admin" />} />
        <Route path="/videos" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <VideoManager videos={videos} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete} /> : <Navigate to="/admin" />} />
        <Route path="/packages" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <PackageManager packages={packages} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete} /> : <Navigate to="/admin" />} />
        <Route path="/media" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]) ? <MediaManager mediaItems={mediaItems} handleAdd={handleAdd} handleDelete={handleDelete} /> : <Navigate to="/admin" />} />
        <Route path="/leads" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN, UserRole.BRANCH_ADMIN]) ? <LeadManager leads={leads} handleEdit={handleEdit} /> : <Navigate to="/admin" />} />
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
