import { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, Save, X, Image as ImageIcon, 
  LayoutGrid, BarChart3, Sparkles, Youtube, RefreshCw, Upload, Laptop, Globe, BookOpen, Calculator, Timer, Package, Megaphone, FileText
} from 'lucide-react';
import { 
  sliderService, mediaService, packageService
} from '../../services/cms.service';
import {
  bannerCardService, statisticService, featureService,
  youtubeChannelService, homeSectionService, socialMediaService, examDateService
} from '../../services/homepage.service';
import { SliderItem, BannerCard, Statistic, Feature, YouTubeChannel, HomeSection, EducationPackage } from '../../types';
import { API_BASE_URL } from '../../services/api';
import { useAlert } from '../../hooks/useAlert';
import Alert from '../Alert';

type TabType = 'sliders' | 'bannerCards' | 'statistics' | 'features' | 'youtube' | 'digital' | 'global' | 'blog' | 'calculator' | 'tools' | 'packages' | 'cta' | 'header' | 'footer';

export const HomePageManager = () => {
  const [activeTab, setActiveTab] = useState<TabType>('sliders');
  const [loading, setLoading] = useState(true);
  const { alert, showAlert } = useAlert();
  
  // Data states
  const [sliders, setSliders] = useState<SliderItem[]>([]);
  const [bannerCards, setBannerCards] = useState<BannerCard[]>([]);
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [youtubeChannels, setYoutubeChannels] = useState<YouTubeChannel[]>([]);
  const [homeSections, setHomeSections] = useState<HomeSection[]>([]);
  const [socialMedia, setSocialMedia] = useState<any[]>([]);
  const [examDates, setExamDates] = useState<any[]>([]);
  const [packages, setPackages] = useState<EducationPackage[]>([]);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Helper to get section content
  const getSection = (section: string, field: 'title' | 'subtitle' | 'buttonText' | 'buttonLink', defaultValue: string = '') => {
    const content = homeSections.find(s => s.section === section);
    return content?.[field] || defaultValue;
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [slidersRes, bannerCardsRes, statisticsRes, featuresRes, youtubeRes, homeSectionsRes, socialRes, examDatesRes, packagesRes] = 
        await Promise.allSettled([
          sliderService.getAll(),
          bannerCardService.getAll(),
          statisticService.getAll(),
          featureService.getAll(),
          youtubeChannelService.getAll(),
          homeSectionService.getAll(),
          socialMediaService.getAll(),
          examDateService.getAll(),
          packageService.getAll()
        ]);

      setSliders(slidersRes.status === 'fulfilled' ? (slidersRes.value.data.sliders || []) : []);
      setBannerCards(bannerCardsRes.status === 'fulfilled' ? ((bannerCardsRes.value.data as any).data || []) : []);
      setStatistics(statisticsRes.status === 'fulfilled' ? ((statisticsRes.value.data as any).data || []) : []);
      setFeatures(featuresRes.status === 'fulfilled' ? ((featuresRes.value.data as any).data || []) : []);
      setYoutubeChannels(youtubeRes.status === 'fulfilled' ? ((youtubeRes.value.data as any).data || []) : []);
      setHomeSections(homeSectionsRes.status === 'fulfilled' ? ((homeSectionsRes.value.data as any).data || []).filter((s: HomeSection) => s.page === 'home') : []);
      setSocialMedia(socialRes.status === 'fulfilled' ? ((socialRes.value.data as any).data || []) : []);
      
      // Fix packages parsing - API returns { success: true, data: [...] }
      if (packagesRes.status === 'fulfilled') {
        const packagesData = packagesRes.value.data;
        const parsedPackages = packagesData?.data && Array.isArray(packagesData.data) ? packagesData.data : (Array.isArray(packagesData) ? packagesData : []);
        console.log('📦 fetchAllData - packages:', parsedPackages);
        setPackages(parsedPackages);
      } else {
        setPackages([]);
      }
      
      // Fix examDates parsing - API returns { success: true, data: [...] }
      if (examDatesRes.status === 'fulfilled') {
        const examData = examDatesRes.value.data;
        const parsedExamDates = examData?.data && Array.isArray(examData.data) ? examData.data : (Array.isArray(examData) ? examData : []);
        console.log('📦 fetchAllData - examDates:', parsedExamDates);
        setExamDates(parsedExamDates);
      } else {
        setExamDates([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (type: TabType) => {
    setEditingItem(null);
    setFormData({});
    setSelectedFile(null);
    setPreviewUrl('');
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    console.log('📝 Editing item:', item);
    setEditingItem(item);
    
    // Special handling for features array
    const editData = { ...item };
    if (item.features && Array.isArray(item.features)) {
      // Features is already an array, keep it as is
      editData.features = item.features;
      console.log('✅ Features array:', editData.features);
    }
    
    console.log('📋 Form data:', editData);
    setFormData(editData);
    setSelectedFile(null);
    // Fix image URL for preview
    const imageUrl = item.image || item.thumbnail || '';
    const fullImageUrl = imageUrl && !imageUrl.startsWith('http') ? (imageUrl.startsWith('/assets') ? imageUrl : `${API_BASE_URL}${imageUrl}`) : imageUrl;
    setPreviewUrl(fullImageUrl);
    setShowModal(true);
  };

  const handleDelete = async (type: TabType, id: string) => {
    if (!confirm('Silmek istediğinizden emin misiniz?')) return;

    try {
      switch (type) {
        case 'sliders':
          await sliderService.delete(id);
          setSliders(prev => prev.filter(s => s.id !== id));
          break;
        case 'bannerCards':
          await bannerCardService.delete(id);
          setBannerCards(prev => prev.filter(b => b.id !== id));
          break;
        case 'statistics':
          await statisticService.delete(id);
          setStatistics(prev => prev.filter(s => s.id !== id));
          break;
        case 'packages':
          await packageService.delete(id);
          setPackages(prev => prev.filter(p => p.id !== id));
          break;
        case 'digital':
        case 'global':
        case 'features':
          await featureService.delete(id);
          setFeatures(prev => prev.filter(f => f.id !== id));
          break;
        case 'youtube':
          await youtubeChannelService.delete(id);
          setYoutubeChannels(prev => prev.filter(y => y.id !== id));
          break;
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setUploading(true);
      
      // Special handling for section headers
      if (editingItem?.type === 'section-header') {
        // Update multiple home sections
        const updates = [
          { section: 'centers-top-title', title: formData.topTitle },
          { section: 'centers-title', title: formData.mainTitle },
          { section: 'centers-subtitle', subtitle: formData.subtitle },
          { section: 'centers-button', buttonText: formData.buttonText, buttonLink: formData.buttonLink }
        ];

        for (const update of updates) {
          const existing = homeSections.find(s => s.section === update.section);
          if (existing) {
            await homeSectionService.update(existing.id!, update);
          } else {
            await homeSectionService.create({ ...update, page: 'home' });
          }
        }

        // Refresh home sections
        const homeSectionsRes = await homeSectionService.getAll();
        setHomeSections(homeSectionsRes.data.data || []);
        
        setShowModal(false);
        return;
      }

      if (editingItem?.type === 'digital-header') {
        // Update digital section headers
        const updates = [
          { section: 'digital-top-title', title: formData.topTitle },
          { section: 'digital-title', title: formData.mainTitle },
          { section: 'digital-subtitle', subtitle: formData.subtitle }
        ];

        for (const update of updates) {
          const existing = homeSections.find(s => s.section === update.section);
          if (existing) {
            await homeSectionService.update(existing.id!, update);
          } else {
            await homeSectionService.create({ ...update, page: 'home' });
          }
        }

        // Refresh home sections
        const homeSectionsRes = await homeSectionService.getAll();
        setHomeSections(homeSectionsRes.data.data || []);
        
        setShowModal(false);
        return;
      }

      if (editingItem?.type === 'global-header') {
        // Update global section headers
        const updates = [
          { section: 'global-title', title: formData.mainTitle },
          { section: 'global-subtitle', subtitle: formData.subtitle }
        ];

        for (const update of updates) {
          const existing = homeSections.find(s => s.section === update.section);
          if (existing) {
            await homeSectionService.update(existing.id!, update);
          } else {
            await homeSectionService.create({ ...update, page: 'home' });
          }
        }

        // Refresh home sections
        const homeSectionsRes = await homeSectionService.getAll();
        setHomeSections(homeSectionsRes.data.data || []);
        
        setShowModal(false);
        return;
      }

      if (editingItem?.type === 'youtube-header') {
        // Update youtube section headers
        const updates = [
          { section: 'youtube-top-title', title: formData.topTitle },
          { section: 'youtube-title', title: formData.mainTitle },
          { section: 'youtube-subtitle', subtitle: formData.subtitle },
          { section: 'youtube-social-title', title: formData.socialTitle },
          { section: 'youtube-social-subtitle', subtitle: formData.socialSubtitle }
        ];

        for (const update of updates) {
          const existing = homeSections.find(s => s.section === update.section);
          if (existing) {
            await homeSectionService.update(existing.id!, update);
          } else {
            await homeSectionService.create({ ...update, page: 'home' });
          }
        }

        // Refresh home sections
        const homeSectionsRes = await homeSectionService.getAll();
        setHomeSections(homeSectionsRes.data.data || []);
        
        setShowModal(false);
        return;
      }

      if (editingItem?.type === 'social-media') {
        // Handle social media save
        try {
          if (editingItem.id) {
            // Update existing
            const result = await socialMediaService.update(editingItem.id, formData);
            setSocialMedia(prev => prev.map(s => s.id === editingItem.id ? result.data : s));
          } else {
            // Create new
            const result = await socialMediaService.create(formData);
            setSocialMedia(prev => [...prev, result.data]);
          }
          setShowModal(false);
          return;
        } catch (error) {
          console.error('Social media save error:', error);
          return;
        }
      }

      if (editingItem?.type === 'blog-header') {
        // Update blog section headers
        const updates = [
          { section: 'blog-top-title', title: formData.topTitle },
          { section: 'blog-title', title: formData.mainTitle },
          { section: 'blog-subtitle', subtitle: formData.subtitle }
        ];

        for (const update of updates) {
          const existing = homeSections.find(s => s.section === update.section);
          if (existing) {
            await homeSectionService.update(existing.id!, update);
          } else {
            await homeSectionService.create({ ...update, page: 'home' });
          }
        }

        // Refresh home sections
        const homeSectionsRes = await homeSectionService.getAll();
        setHomeSections(homeSectionsRes.data.data || []);
        
        setShowModal(false);
        return;
      }

      if (editingItem?.type === 'calculator-header') {
        // Update calculator section headers
        const updates = [
          { section: 'calculator-badge', title: formData.badge },
          { section: 'calculator-title', title: formData.mainTitle },
          { section: 'calculator-subtitle', subtitle: formData.subtitle },
          { section: 'calculator-button', buttonText: formData.buttonText, buttonLink: formData.buttonLink },
          { section: 'calculator-tyt', title: formData.tytText },
          { section: 'calculator-ayt', title: formData.aytText },
          { section: 'calculator-lgs', title: formData.lgsText }
        ];

        for (const update of updates) {
          const existing = homeSections.find(s => s.section === update.section);
          if (existing) {
            await homeSectionService.update(existing.id!, update);
          } else {
            await homeSectionService.create({ ...update, page: 'home' });
          }
        }

        // Refresh home sections
        const homeSectionsRes = await homeSectionService.getAll();
        setHomeSections(homeSectionsRes.data.data || []);
        
        setShowModal(false);
        return;
      }

      if (editingItem?.type === 'header-logo') {
        // Upload logo if selected
        let logoUrl = formData.logo;
        if (selectedFile) {
          const uploadRes = await mediaService.upload(selectedFile);
          logoUrl = uploadRes.data.url || uploadRes.data.data?.url || uploadRes.data.media?.url;
        }

        // Update header logo
        const existing = homeSections.find(s => s.section === 'header-logo');
        if (existing) {
          await homeSectionService.update(existing.id!, { section: 'header-logo', buttonLink: logoUrl });
        } else {
          await homeSectionService.create({ section: 'header-logo', page: 'home', buttonLink: logoUrl });
        }

        // Refresh home sections
        const homeSectionsRes = await homeSectionService.getAll();
        setHomeSections(homeSectionsRes.data.data || []);
        
        setShowModal(false);
        return;
      }

      if (editingItem?.type === 'header-topbar-link') {
        // Save header topbar link
        const itemData: any = {
          page: 'home',
          title: formData.label,
          buttonLink: formData.url
        };

        if (editingItem.id) {
          // Update existing
          itemData.section = editingItem.section;
          itemData.order = editingItem.order;
          await homeSectionService.update(editingItem.id, itemData);
        } else {
          // Create new
          const topbarLinks = homeSections.filter(s => s.section.startsWith('header-topbar-link'));
          const maxOrder = topbarLinks.length > 0 ? Math.max(...topbarLinks.map(i => i.order || 0)) : -1;
          
          itemData.section = `header-topbar-link-${Date.now()}`;
          itemData.order = maxOrder + 1;
          await homeSectionService.create(itemData);
        }

        // Refresh home sections
        const homeSectionsRes = await homeSectionService.getAll();
        setHomeSections(homeSectionsRes.data.data || []);
        
        setShowModal(false);
        return;
      }

      if (editingItem?.type === 'header-contact') {
        // Update header contact info
        const existing = homeSections.find(s => s.section === 'header-phone');
        if (existing) {
          await homeSectionService.update(existing.id!, { section: 'header-phone', title: formData.phone });
        } else {
          await homeSectionService.create({ section: 'header-phone', page: 'home', title: formData.phone });
        }

        // Refresh home sections
        const homeSectionsRes = await homeSectionService.getAll();
        setHomeSections(homeSectionsRes.data.data || []);
        
        setShowModal(false);
        return;
      }

      if (editingItem?.type === 'header-menu-link') {
        // Save header menu link
        const itemData: any = {
          page: 'home',
          title: formData.label,
          buttonLink: formData.url
        };

        if (editingItem.id) {
          // Update existing
          itemData.section = editingItem.section;
          itemData.order = editingItem.order;
          await homeSectionService.update(editingItem.id, itemData);
        } else {
          // Create new
          const menuLinks = homeSections.filter(s => s.section.startsWith('header-menu-link'));
          const maxOrder = menuLinks.length > 0 ? Math.max(...menuLinks.map(i => i.order || 0)) : -1;
          
          itemData.section = `header-menu-link-${Date.now()}`;
          itemData.order = maxOrder + 1;
          await homeSectionService.create(itemData);
        }

        // Refresh home sections
        const homeSectionsRes = await homeSectionService.getAll();
        setHomeSections(homeSectionsRes.data.data || []);
        
        setShowModal(false);
        return;
      }

      if (editingItem?.type === 'footer-logo') {
        // Upload logo if selected
        let logoUrl = formData.logo;
        if (selectedFile) {
          const uploadRes = await mediaService.upload(selectedFile);
          logoUrl = uploadRes.data.url || uploadRes.data.data?.url || uploadRes.data.media?.url;
        }

        // Update footer logo
        const existing = homeSections.find(s => s.section === 'footer-logo');
        if (existing) {
          await homeSectionService.update(existing.id!, { section: 'footer-logo', buttonLink: logoUrl });
        } else {
          await homeSectionService.create({ section: 'footer-logo', page: 'home', buttonLink: logoUrl });
        }

        // Refresh home sections
        const homeSectionsRes = await homeSectionService.getAll();
        setHomeSections(homeSectionsRes.data.data || []);
        
        setShowModal(false);
        return;
      }

      if (editingItem?.type === 'footer-menu-columns') {
        // Update footer menu column titles
        const updates = [
          { section: 'footer-menu-column1', title: formData.column1Title },
          { section: 'footer-menu-column2', title: formData.column2Title },
          { section: 'footer-menu-column3', title: formData.column3Title }
        ];

        for (const update of updates) {
          const existing = homeSections.find(s => s.section === update.section);
          if (existing) {
            await homeSectionService.update(existing.id!, update);
          } else {
            await homeSectionService.create({ ...update, page: 'home' });
          }
        }

        // Refresh home sections
        const homeSectionsRes = await homeSectionService.getAll();
        setHomeSections(homeSectionsRes.data.data || []);
        
        setShowModal(false);
        return;
      }

      if (editingItem?.type === 'footer-bottom-link') {
        // Save footer bottom link
        const itemData: any = {
          page: 'home',
          title: formData.label,
          buttonLink: formData.url
        };

        if (editingItem.id) {
          // Update existing
          itemData.section = editingItem.section;
          itemData.order = editingItem.order;
          await homeSectionService.update(editingItem.id, itemData);
        } else {
          // Create new
          const bottomLinks = homeSections.filter(s => s.section.startsWith('footer-bottom-link'));
          const maxOrder = bottomLinks.length > 0 ? Math.max(...bottomLinks.map(i => i.order || 0)) : -1;
          
          itemData.section = `footer-bottom-link-${Date.now()}`;
          itemData.order = maxOrder + 1;
          await homeSectionService.create(itemData);
        }

        // Refresh home sections
        const homeSectionsRes = await homeSectionService.getAll();
        setHomeSections(homeSectionsRes.data.data || []);
        
        setShowModal(false);
        return;
      }

      if (editingItem?.type === 'footer-menu-item') {
        // Save footer menu item
        const itemData: any = {
          page: 'home',
          title: formData.label,
          buttonLink: formData.url
        };

        if (editingItem.id) {
          // Update existing - keep the same section and order
          itemData.section = editingItem.section;
          itemData.order = editingItem.order;
          await homeSectionService.update(editingItem.id, itemData);
        } else {
          // Create new - assign next order number
          const columnItems = homeSections.filter(s => s.section.startsWith(`footer-menu-${formData.column}-item`));
          const maxOrder = columnItems.length > 0 ? Math.max(...columnItems.map(i => i.order || 0)) : -1;
          
          itemData.section = `footer-menu-${formData.column}-item-${Date.now()}`;
          itemData.order = maxOrder + 1;
          await homeSectionService.create(itemData);
        }

        // Refresh home sections
        const homeSectionsRes = await homeSectionService.getAll();
        setHomeSections(homeSectionsRes.data.data || []);
        
        setShowModal(false);
        return;
      }

      if (editingItem?.type === 'footer-section') {
        // Update Footer section
        const updates = [
          { section: 'footer-description', description: formData.description },
          { section: 'footer-copyright', title: formData.copyright }
        ];

        for (const update of updates) {
          const existing = homeSections.find(s => s.section === update.section);
          if (existing) {
            await homeSectionService.update(existing.id!, update);
          } else {
            await homeSectionService.create({ ...update, page: 'home' });
          }
        }

        // Refresh home sections
        const homeSectionsRes = await homeSectionService.getAll();
        setHomeSections(homeSectionsRes.data.data || []);
        
        setShowModal(false);
        return;
      }

      if (editingItem?.type === 'cta-section') {
        // Upload image if selected
        let imageUrl = formData.image;
        if (selectedFile) {
          const uploadRes = await mediaService.upload(selectedFile);
          imageUrl = uploadRes.data.url || uploadRes.data.data?.url || uploadRes.data.media?.url;
        }

        // Update CTA section
        const updates = [
          { section: 'cta-main-title', title: formData.mainTitle },
          { section: 'cta-subtitle', subtitle: formData.subtitle },
          { section: 'cta-button-primary', buttonText: formData.button1Text, buttonLink: formData.button1Link },
          { section: 'cta-button-secondary', buttonText: formData.button2Text, buttonLink: formData.button2Link },
          { section: 'cta-badge', title: formData.badge },
          { section: 'cta-question', title: formData.question },
          { section: 'cta-testimonial', description: formData.testimonial },
          { section: 'cta-image', buttonLink: imageUrl }
        ];

        for (const update of updates) {
          const existing = homeSections.find(s => s.section === update.section);
          if (existing) {
            await homeSectionService.update(existing.id!, update);
          } else {
            await homeSectionService.create({ ...update, page: 'home' });
          }
        }

        // Refresh home sections
        const homeSectionsRes = await homeSectionService.getAll();
        setHomeSections(homeSectionsRes.data.data || []);
        
        setShowModal(false);
        return;
      }

      if (editingItem?.type === 'packages-header') {
        // Update packages section headers
        const updates = [
          { section: 'packages-top-title', title: formData.topTitle },
          { section: 'packages-title', title: formData.mainTitle },
          { section: 'packages-subtitle', subtitle: formData.subtitle },
          { section: 'packages-button', buttonText: formData.buttonText, buttonLink: formData.buttonLink }
        ];

        for (const update of updates) {
          const existing = homeSections.find(s => s.section === update.section);
          if (existing) {
            await homeSectionService.update(existing.id!, update);
          } else {
            await homeSectionService.create({ ...update, page: 'home' });
          }
        }

        // Refresh home sections
        const homeSectionsRes = await homeSectionService.getAll();
        setHomeSections(homeSectionsRes.data.data || []);
        
        setShowModal(false);
        return;
      }

      if (editingItem?.type === 'tools-header') {
        // Update tools section headers
        const updates = [
          { section: 'tools-top-title', title: formData.topTitle },
          { section: 'tools-title', title: formData.mainTitle },
          { section: 'tools-subtitle', subtitle: formData.subtitle },
          { section: 'tools-countdown-title', title: formData.countdownTitle },
          { section: 'tools-pomodoro-title', title: formData.pomodoroTitle }
        ];

        for (const update of updates) {
          const existing = homeSections.find(s => s.section === update.section);
          if (existing) {
            await homeSectionService.update(existing.id!, update);
          } else {
            await homeSectionService.create({ ...update, page: 'home' });
          }
        }

        // Refresh home sections
        const homeSectionsRes = await homeSectionService.getAll();
        setHomeSections(homeSectionsRes.data.data || []);
        
        setShowModal(false);
        return;
      }

      if (editingItem?.type === 'exam-date') {
        // Handle exam date save
        try {
          console.log('🔵 BAŞLANGIÇ - formData:', formData);
          
          // Ensure the date is in proper ISO format
          const dateValue = formData.examDate;
          console.log('🔵 dateValue:', dateValue);
          
          let isoDate;
          
          if (dateValue) {
            // datetime-local gives us "YYYY-MM-DDTHH:mm" format
            // We need to save this as UTC but preserve the date/time values
            // So if user enters 21.06.2025 09:00, it should be saved as 2025-06-21T09:00:00.000Z
            const [datePart, timePart] = dateValue.split('T');
            const [year, month, day] = datePart.split('-');
            const [hours, minutes] = timePart.split(':');
            
            console.log('🔵 Parsed:', { year, month, day, hours, minutes });
            
            // Create ISO string directly without timezone conversion
            isoDate = `${year}-${month}-${day}T${hours}:${minutes}:00.000Z`;
            console.log('🔵 isoDate oluşturuldu:', isoDate);
          } else {
            isoDate = new Date().toISOString();
          }

          const saveData = {
            examName: formData.examName,
            examDate: isoDate,
            description: formData.description || '',
            isActive: true,
            order: formData.order || 0
          };

          console.log('🔵 saveData:', saveData);

          // Check if this exam already exists in the database
          const existingExam = examDates.find(e => e.examName === formData.examName);
          console.log('🔵 existingExam:', existingExam);
          
          if (existingExam && existingExam.id) {
            console.log('🔵 UPDATE yapılıyor, ID:', existingExam.id);
            const result = await examDateService.update(existingExam.id, saveData);
            console.log('🔵 UPDATE sonucu:', result);
          } else {
            console.log('🔵 CREATE yapılıyor');
            const result = await examDateService.create(saveData);
            console.log('🔵 CREATE sonucu:', result);
          }

          // Refresh exam dates
          console.log('🔵 Veriler yenileniyor...');
          const examDatesRes = await examDateService.getAll();
          console.log('🔵 Yeni veriler RAW:', examDatesRes);
          console.log('🔵 Yeni veriler data:', examDatesRes.data);
          
          // API response structure: { success: true, data: [...] }
          let newExamDates = [];
          if (examDatesRes.data?.data && Array.isArray(examDatesRes.data.data)) {
            newExamDates = examDatesRes.data.data;
          } else if (Array.isArray(examDatesRes.data)) {
            newExamDates = examDatesRes.data;
          }
          
          console.log('🔵 newExamDates:', newExamDates);
          setExamDates(newExamDates);
          console.log('🔵 setExamDates çağrıldı');
          
          // Also refresh all data to ensure consistency
          await fetchAllData();
          
          console.log('✅ BAŞARILI - Modal kapatılıyor');
          showAlert('success', 'Başarıyla kaydedildi!');
          setShowModal(false);
          return;
        } catch (error) {
          console.error('❌ HATA:', error);
          showAlert('error', 'Kaydetme hatası: ' + (error as any).message);
          return;
        }
      }

      // Upload file if selected
      let imageUrl = formData.image || formData.thumbnail;
      if (selectedFile) {
        console.log('📤 Uploading file:', selectedFile.name);
        const uploadRes = await mediaService.upload(selectedFile);
        console.log('✅ Upload response:', uploadRes);
        // Backend returns { success: true, url: '...', data: { ... } }
        imageUrl = uploadRes.data.url || uploadRes.data.data?.url || uploadRes.data.media?.url;
        console.log('🖼️ Image URL:', imageUrl);
      }

      const dataToSave = { ...formData };
      if (activeTab === 'sliders') {
        dataToSave.image = imageUrl;
        // Ensure required fields for slider
        if (!dataToSave.target) dataToSave.target = 'main';
        if (dataToSave.isActive === undefined) dataToSave.isActive = true;
      } else if (activeTab === 'youtube') {
        dataToSave.thumbnail = imageUrl;
      } else if (activeTab === 'packages') {
        dataToSave.image = imageUrl;
      }

      console.log('💾 Saving data:', dataToSave);

      let result;
      if (editingItem) {
        // Update
        switch (activeTab) {
          case 'sliders':
            result = await sliderService.update(editingItem.id, dataToSave);
            console.log('✅ Update result:', result);
            console.log('📦 Result data:', result.data);
            const updatedSlider = result.data.slider || result.data;
            console.log('🔄 Updated slider:', updatedSlider);
            setSliders(prev => {
              const updated = prev.map(s => s.id === editingItem.id ? updatedSlider : s);
              console.log('📋 New sliders array:', updated);
              return updated;
            });
            break;
          case 'bannerCards':
            result = await bannerCardService.update(editingItem.id, formData);
            setBannerCards(prev => prev.map(b => b.id === editingItem.id ? result.data : b));
            break;
          case 'statistics':
            result = await statisticService.update(editingItem.id, formData);
            setStatistics(prev => prev.map(s => s.id === editingItem.id ? result.data : s));
            break;
          case 'packages':
            result = await packageService.update(editingItem.id, dataToSave);
            const updatedPackage = result.data.data || result.data;
            setPackages(prev => prev.map(p => p.id === editingItem.id ? updatedPackage : p));
            break;
          case 'digital':
          case 'global':
          case 'features':
            result = await featureService.update(editingItem.id, formData);
            setFeatures(prev => prev.map(f => f.id === editingItem.id ? result.data : f));
            break;
          case 'youtube':
            result = await youtubeChannelService.update(editingItem.id, formData);
            setYoutubeChannels(prev => prev.map(y => y.id === editingItem.id ? result.data : y));
            break;
        }
      } else {
        // Create
        switch (activeTab) {
          case 'sliders':
            result = await sliderService.create(dataToSave);
            console.log('✅ Create result:', result);
            const newSlider = result.data.slider || result.data;
            setSliders(prev => [newSlider, ...prev]);
            break;
          case 'bannerCards':
            result = await bannerCardService.create(formData);
            setBannerCards(prev => [result.data, ...prev]);
            break;
          case 'statistics':
            result = await statisticService.create(formData);
            setStatistics(prev => [result.data, ...prev]);
            break;
          case 'packages':
            result = await packageService.create(dataToSave);
            const newPackage = result.data.data || result.data;
            setPackages(prev => [newPackage, ...prev]);
            break;
          case 'digital':
          case 'global':
          case 'features':
            result = await featureService.create(formData);
            setFeatures(prev => [result.data, ...prev]);
            break;
          case 'youtube':
            result = await youtubeChannelService.create(formData);
            setYoutubeChannels(prev => [result.data, ...prev]);
            break;
        }
      }
      console.log('✅ Save successful!');
      
      // Refresh data from server
      await fetchAllData();
      
      setShowModal(false);
      setSelectedFile(null);
      setPreviewUrl('');
    } catch (error) {
      console.error('❌ Save error:', error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="w-8 h-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  const tabs = [
    { id: 'sliders' as TabType, label: 'Slider', icon: ImageIcon, count: sliders.length },
    { id: 'bannerCards' as TabType, label: 'Banner Kartları', icon: LayoutGrid, count: bannerCards.length },
    { id: 'statistics' as TabType, label: 'İstatistikler', icon: BarChart3, count: statistics.length },
    { id: 'packages' as TabType, label: 'Eğitim Paketleri', icon: Package, count: packages.length },
    { id: 'cta' as TabType, label: 'CTA Bölümü', icon: Megaphone, count: 0 },
    { id: 'header' as TabType, label: 'Header', icon: FileText, count: 0 },
    { id: 'footer' as TabType, label: 'Footer', icon: FileText, count: 0 },
    { id: 'digital' as TabType, label: 'Dijital Platform', icon: Laptop, count: features.filter(f => f.section === 'digital').length },
    { id: 'global' as TabType, label: 'Yurt Dışı', icon: Globe, count: features.filter(f => f.section === 'global').length },
    { id: 'youtube' as TabType, label: 'YouTube & Sosyal Medya', icon: Youtube, count: youtubeChannels.length },
    { id: 'blog' as TabType, label: 'Rehberlik & Blog', icon: BookOpen, count: 0 },
    { id: 'calculator' as TabType, label: 'Puan Hesaplama', icon: Calculator, count: 0 },
    { id: 'tools' as TabType, label: 'Çalışma Araçları', icon: Timer, count: 0 },
    { id: 'features' as TabType, label: 'Özellikler', icon: Sparkles, count: features.length },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'sliders':
        return (
          <div className="space-y-4">
            {sliders.map(slider => {
              const imageUrl = slider.image?.startsWith('http') ? slider.image : (slider.image?.startsWith('/assets') ? slider.image : `${API_BASE_URL}${slider.image}`);
              return (
                <div key={slider.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex">
                    <img src={imageUrl} alt={slider.title} className="w-48 h-32 object-cover" />
                    <div className="flex-1 p-4">
                      <h3 className="font-bold text-lg mb-1">{slider.title}</h3>
                      <p className="text-sm text-slate-600 mb-2">{slider.subtitle}</p>
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <span className="px-2 py-1 bg-slate-100 rounded">{slider.target === 'main' ? 'Ana Sayfa' : 'Şube'}</span>
                        {slider.link && <span>→ {slider.link}</span>}
                      </div>
                    </div>
                    <div className="p-4 flex items-center space-x-2">
                      <button onClick={() => handleEdit(slider)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete('sliders', slider.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'bannerCards':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bannerCards.sort((a, b) => a.order - b.order).map(card => (
              <div key={card.id} className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{card.icon}</span>
                  <span className="text-xs font-bold text-slate-400">#{card.order}</span>
                </div>
                <h3 className="font-bold mb-1">{card.title}</h3>
                <p className="text-sm text-slate-600 mb-3">{card.description}</p>
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleEdit(card)} className="flex-1 p-2 hover:bg-blue-50 rounded-lg text-blue-600 text-sm">
                    <Edit2 className="w-4 h-4 mx-auto" />
                  </button>
                  <button onClick={() => handleDelete('bannerCards', card.id)} className="flex-1 p-2 hover:bg-red-50 rounded-lg text-red-600 text-sm">
                    <Trash2 className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      case 'statistics':
        return (
          <div className="space-y-6">
            {/* Section Header Editor */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-black text-brand-dark mb-2">Bölüm Başlıkları</h3>
                  <p className="text-sm text-slate-600">Başarı Merkezleri bölümünün başlık ve açıklamalarını düzenleyin</p>
                </div>
                <button
                  onClick={() => {
                    setEditingItem({ type: 'section-header' });
                    setFormData({
                      topTitle: getSection('centers-top-title', 'title', 'BAŞARI MERKEZLERİMİZ'),
                      mainTitle: getSection('centers-title', 'title', "Türkiye'nin En Büyük Eğitim Ağı"),
                      subtitle: getSection('centers-subtitle', 'subtitle', '81 ilde güçlü şube ağımız...'),
                      buttonText: getSection('centers-button', 'buttonText', 'Şubelerimizi Keşfedin'),
                      buttonLink: getSection('centers-button', 'buttonLink', '/subeler')
                    });
                    setShowModal(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-brand-blue text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Düzenle</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-bold text-slate-700">Üst Başlık:</span>
                  <p className="text-slate-600">{getSection('centers-top-title', 'title', 'BAŞARI MERKEZLERİMİZ')}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Ana Başlık:</span>
                  <p className="text-slate-600">{getSection('centers-title', 'title', "Türkiye'nin En Büyük Eğitim Ağı")}</p>
                </div>
                <div className="col-span-2">
                  <span className="font-bold text-slate-700">Açıklama:</span>
                  <p className="text-slate-600">{getSection('centers-subtitle', 'subtitle', '81 ilde güçlü şube ağımız...')}</p>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-3">İstatistik Kartları</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statistics.sort((a, b) => a.order - b.order).map(stat => (
                  <div key={stat.id} className="bg-white rounded-xl border border-slate-100 p-6 text-center hover:shadow-lg transition-shadow">
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-3xl font-black text-brand-blue mb-1">{stat.value}</div>
                    <div className="text-sm font-bold text-slate-600">{stat.label}</div>
                    <div className="flex items-center justify-center space-x-2 mt-4">
                      <button onClick={() => handleEdit(stat)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete('statistics', stat.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'digital':
        return (
          <div className="space-y-6">
            {/* Section Header Editor */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-black text-brand-dark mb-2">Bölüm Başlıkları</h3>
                  <p className="text-sm text-slate-600">Dijital Platform bölümünün başlık ve açıklamalarını düzenleyin</p>
                </div>
                <button
                  onClick={() => {
                    setEditingItem({ type: 'digital-header' });
                    setFormData({
                      topTitle: getSection('digital-top-title', 'title', 'DİJİTAL EĞİTİM SİSTEMİ'),
                      mainTitle: getSection('digital-title', 'title', 'Yapay Zeka Destekli Eğitim Platformu'),
                      subtitle: getSection('digital-subtitle', 'subtitle', 'Öğrenciler ve veliler için geliştirdiğimiz dijital altyapı...')
                    });
                    setShowModal(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-brand-blue text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Düzenle</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-bold text-slate-700">Üst Başlık:</span>
                  <p className="text-slate-600">{getSection('digital-top-title', 'title', 'DİJİTAL EĞİTİM SİSTEMİ')}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Ana Başlık:</span>
                  <p className="text-slate-600">{getSection('digital-title', 'title', 'Yapay Zeka Destekli Eğitim Platformu')}</p>
                </div>
                <div className="col-span-2">
                  <span className="font-bold text-slate-700">Açıklama:</span>
                  <p className="text-slate-600">{getSection('digital-subtitle', 'subtitle', 'Öğrenciler ve veliler için...')}</p>
                </div>
              </div>
            </div>

            {/* Digital Features */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-700">Dijital Platform Özellikleri</h3>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setFormData({ section: 'digital', icon: '💻' });
                    setShowModal(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yeni Özellik Ekle</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.filter(f => f.section === 'digital').sort((a, b) => a.order - b.order).map(feature => (
                  <div key={feature.id} className="bg-white rounded-xl border border-slate-100 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3 flex-1">
                        <span className="text-3xl">{feature.icon}</span>
                        <h3 className="font-bold text-lg">{feature.title}</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => handleEdit(feature)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete('features', feature.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">{feature.description}</p>
                    {feature.features && feature.features.length > 0 && (
                      <div className="space-y-2 pt-3 border-t border-slate-100">
                        {feature.features.map((item, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-xs">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-blue"></div>
                            <span className="text-slate-600 font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'global':
        return (
          <div className="space-y-6">
            {/* Section Header Editor */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-black text-brand-dark mb-2">Bölüm Başlıkları</h3>
                  <p className="text-sm text-slate-600">Yurt Dışı bölümünün başlık ve açıklamalarını düzenleyin</p>
                </div>
                <button
                  onClick={() => {
                    setEditingItem({ type: 'global-header' });
                    setFormData({
                      mainTitle: getSection('global-title', 'title', 'Hocalara Geldik Yurt Dışı'),
                      subtitle: getSection('global-subtitle', 'subtitle', "Dünya'nın en prestijli üniversitelerine yerleşme hayalinizi gerçeğe dönüştürüyoruz")
                    });
                    setShowModal(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-brand-blue text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Düzenle</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-bold text-slate-700">Ana Başlık:</span>
                  <p className="text-slate-600">{getSection('global-title', 'title', 'Hocalara Geldik Yurt Dışı')}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Açıklama:</span>
                  <p className="text-slate-600">{getSection('global-subtitle', 'subtitle', "Dünya'nın en prestijli üniversitelerine...")}</p>
                </div>
              </div>
            </div>

            {/* Global Features */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-700">Yurt Dışı Hizmetleri</h3>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setFormData({ section: 'global', icon: '🎯' });
                    setShowModal(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yeni Hizmet Ekle</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {features.filter(f => f.section === 'global').sort((a, b) => a.order - b.order).map(feature => (
                  <div key={feature.id} className="bg-white rounded-xl border border-slate-100 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3 flex-1">
                        <span className="text-3xl">{feature.icon}</span>
                        <h3 className="font-bold text-lg">{feature.title}</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => handleEdit(feature)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete('features', feature.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">{feature.description}</p>
                    {feature.features && feature.features.length > 0 && (
                      <div className="space-y-2 pt-3 border-t border-slate-100">
                        {feature.features.map((item, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-xs">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-blue"></div>
                            <span className="text-slate-600 font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-4">
            {features.sort((a, b) => a.order - b.order).map(feature => (
              <div key={feature.id} className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{feature.icon}</span>
                      <h3 className="font-bold text-lg">{feature.title}</h3>
                      <span className="text-xs px-2 py-1 bg-slate-100 rounded">{feature.section}</span>
                    </div>
                    <p className="text-sm text-slate-600">{feature.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleEdit(feature)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete('features', feature.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'youtube':
        return (
          <div className="space-y-6">
            {/* Section Header Editor */}
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-black text-brand-dark mb-2">Bölüm Başlıkları</h3>
                  <p className="text-sm text-slate-600">YouTube ve Sosyal Medya bölümünün başlık ve açıklamalarını düzenleyin</p>
                </div>
                <button
                  onClick={() => {
                    setEditingItem({ type: 'youtube-header' });
                    setFormData({
                      topTitle: getSection('youtube-top-title', 'title', 'DİJİTAL İÇERİKLERİMİZ'),
                      mainTitle: getSection('youtube-title', 'title', 'YouTube Kanallarımız ve Sosyal Medya'),
                      subtitle: getSection('youtube-subtitle', 'subtitle', 'Binlerce ücretsiz ders videosu ve güncel içeriklerimiz için kanallarımıza abone olun, sosyal medyada bizi takip edin!'),
                      socialTitle: getSection('youtube-social-title', 'title', 'Sosyal Medyada Bizi Takip Edin'),
                      socialSubtitle: getSection('youtube-social-subtitle', 'subtitle', 'Güncel duyurular, motivasyon içerikleri ve daha fazlası için sosyal medya hesaplarımızı takip edin!')
                    });
                    setShowModal(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-brand-blue text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Düzenle</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-bold text-slate-700">Üst Başlık:</span>
                  <p className="text-slate-600">{getSection('youtube-top-title', 'title', 'DİJİTAL İÇERİKLERİMİZ')}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Ana Başlık:</span>
                  <p className="text-slate-600">{getSection('youtube-title', 'title', 'YouTube Kanallarımız ve Sosyal Medya')}</p>
                </div>
                <div className="col-span-2">
                  <span className="font-bold text-slate-700">Açıklama:</span>
                  <p className="text-slate-600">{getSection('youtube-subtitle', 'subtitle', 'Binlerce ücretsiz ders videosu...')}</p>
                </div>
              </div>
            </div>

            {/* YouTube Channels */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-700">YouTube Kanalları</h3>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setFormData({ order: youtubeChannels.length });
                    setShowModal(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yeni Kanal Ekle</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {youtubeChannels.sort((a, b) => a.order - b.order).map(channel => {
                  const thumbnailUrl = channel.thumbnail?.startsWith('http') ? channel.thumbnail : `${API_BASE_URL}${channel.thumbnail}`;
                  return (
                    <div key={channel.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
                      {channel.thumbnail && (
                        <div className="relative aspect-video overflow-hidden">
                          <img src={thumbnailUrl} alt={channel.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                              <Youtube className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-bold mb-2">{channel.name}</h3>
                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{channel.description}</p>
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                          <span>{channel.subscribers} Abone</span>
                          <span>{channel.videoCount} Video</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => handleEdit(channel)} className="flex-1 p-2 hover:bg-blue-50 rounded-lg text-blue-600">
                            <Edit2 className="w-4 h-4 mx-auto" />
                          </button>
                          <button onClick={() => handleDelete('youtube', channel.id)} className="flex-1 p-2 hover:bg-red-50 rounded-lg text-red-600">
                            <Trash2 className="w-4 h-4 mx-auto" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Social Media Links */}
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-3">Sosyal Medya Linkleri</h3>
              <p className="text-xs text-slate-600 mb-4">Her platform için URL'leri girin. Başlık ve açıklama yukarıdaki "Bölüm Başlıkları" kısmından düzenlenir.</p>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {['youtube', 'instagram', 'twitter', 'facebook', 'linkedin'].map(platform => {
                  const existing = socialMedia.find(s => s.platform === platform);
                  const platformIcons: any = {
                    youtube: '🎥',
                    instagram: '📷',
                    twitter: '🐦',
                    facebook: '👥',
                    linkedin: '💼'
                  };
                  const platformColors: any = {
                    youtube: 'bg-red-50 border-red-200',
                    instagram: 'bg-pink-50 border-pink-200',
                    twitter: 'bg-blue-50 border-blue-200',
                    facebook: 'bg-blue-50 border-blue-300',
                    linkedin: 'bg-blue-50 border-blue-400'
                  };
                  const platformNames: any = {
                    youtube: 'YouTube',
                    instagram: 'Instagram',
                    twitter: 'Twitter',
                    facebook: 'Facebook',
                    linkedin: 'LinkedIn'
                  };
                  
                  return (
                    <div 
                      key={platform} 
                      className={`${platformColors[platform]} rounded-xl border-2 p-4 text-center`}
                    >
                      <div className="text-3xl mb-2">{platformIcons[platform]}</div>
                      <h4 className="font-bold text-sm mb-3">{platformNames[platform]}</h4>
                      {existing ? (
                        <>
                          <p className="text-xs text-slate-600 mb-3 truncate" title={existing.url}>
                            {existing.url.replace('https://', '').substring(0, 20)}...
                          </p>
                          <button 
                            onClick={() => {
                              setEditingItem({ ...existing, type: 'social-media' });
                              setFormData(existing);
                              setShowModal(true);
                            }} 
                            className="w-full px-3 py-2 bg-white hover:bg-slate-50 rounded-lg text-blue-600 font-bold text-xs transition-colors"
                          >
                            Düzenle
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => {
                            setEditingItem({ type: 'social-media' });
                            setFormData({ platform, url: '', order: socialMedia.length, isActive: true });
                            setShowModal(true);
                          }} 
                          className="w-full px-3 py-2 bg-white hover:bg-slate-50 rounded-lg text-green-600 font-bold text-xs transition-colors"
                        >
                          + Ekle
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'blog':
        return (
          <div className="space-y-6">
            {/* Section Header Editor */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-black text-brand-dark mb-2">Bölüm Başlıkları</h3>
                  <p className="text-sm text-slate-600">Rehberlik ve Blog bölümünün başlık ve açıklamalarını düzenleyin</p>
                </div>
                <button
                  onClick={() => {
                    setEditingItem({ type: 'blog-header' });
                    setFormData({
                      topTitle: getSection('blog-top-title', 'title', 'REHBERLİK VE İÇERİKLER'),
                      mainTitle: getSection('blog-title', 'title', 'Rehberlik ve Blog Notları'),
                      subtitle: getSection('blog-subtitle', 'subtitle', 'Akademik ve psikolojik destek yazıları, sınav stratejileri ve motivasyon içerikleri ile başarıya giden yolda yanınızdayız.')
                    });
                    setShowModal(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-brand-blue text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Düzenle</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-bold text-slate-700">Üst Başlık:</span>
                  <p className="text-slate-600">{getSection('blog-top-title', 'title', 'REHBERLİK VE İÇERİKLER')}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Ana Başlık:</span>
                  <p className="text-slate-600">{getSection('blog-title', 'title', 'Rehberlik ve Blog Notları')}</p>
                </div>
                <div className="col-span-2">
                  <span className="font-bold text-slate-700">Açıklama:</span>
                  <p className="text-slate-600">{getSection('blog-subtitle', 'subtitle', 'Akademik ve psikolojik destek yazıları...')}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
              <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-brand-dark mb-2">Blog Yönetimi</h3>
              <p className="text-sm text-slate-600">Blog yazıları ayrı bir modülde yönetilmektedir.</p>
            </div>
          </div>
        );

      case 'calculator':
        return (
          <div className="space-y-6">
            {/* Section Header Editor */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-black text-brand-dark mb-2">Bölüm Başlıkları</h3>
                  <p className="text-sm text-slate-600">Puan Hesaplama bölümünün başlık ve açıklamalarını düzenleyin</p>
                </div>
                <button
                  onClick={() => {
                    setEditingItem({ type: 'calculator-header' });
                    setFormData({
                      badge: getSection('calculator-badge', 'title', 'Puan Hesaplama Araçları'),
                      mainTitle: getSection('calculator-title', 'title', 'Sınav Puanınızı Hesaplayın'),
                      subtitle: getSection('calculator-subtitle', 'subtitle', 'Net sayılarınızı girerek yaklaşık sınav puanınızı hesaplayabilir ve hedeflerinize ne kadar yakın olduğunuzu görebilirsiniz.'),
                      buttonText: getSection('calculator-button', 'buttonText', 'Hesaplama Araçlarına Git'),
                      buttonLink: getSection('calculator-button', 'buttonLink', '/hesaplama'),
                      tytText: getSection('calculator-tyt', 'title', 'Puan Hesapla'),
                      aytText: getSection('calculator-ayt', 'title', 'Puan Hesapla'),
                      lgsText: getSection('calculator-lgs', 'title', 'Puan Hesapla')
                    });
                    setShowModal(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-brand-blue text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Düzenle</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-bold text-slate-700">Badge:</span>
                  <p className="text-slate-600">{getSection('calculator-badge', 'title', 'Puan Hesaplama Araçları')}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Ana Başlık:</span>
                  <p className="text-slate-600">{getSection('calculator-title', 'title', 'Sınav Puanınızı Hesaplayın')}</p>
                </div>
                <div className="col-span-2">
                  <span className="font-bold text-slate-700">Açıklama:</span>
                  <p className="text-slate-600">{getSection('calculator-subtitle', 'subtitle', 'Net sayılarınızı girerek...')}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Buton Metni:</span>
                  <p className="text-slate-600">{getSection('calculator-button', 'buttonText', 'Hesaplama Araçlarına Git')}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Buton Linki:</span>
                  <p className="text-slate-600">{getSection('calculator-button', 'buttonLink', '/hesaplama')}</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center">
              <Calculator className="w-12 h-12 text-orange-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-brand-dark mb-2">Hesaplama Araçları</h3>
              <p className="text-sm text-slate-600 mb-4">TYT, AYT ve LGS puan hesaplama araçları sayfası ayrı bir modülde yönetilmektedir.</p>
              <div className="grid grid-cols-3 gap-4 mt-6">
                {['TYT', 'AYT', 'LGS'].map(type => (
                  <div key={type} className="bg-white rounded-xl p-4 border border-orange-200">
                    <div className="text-2xl font-black text-orange-600 mb-1">{type}</div>
                    <div className="text-xs text-slate-600">Puan Hesapla</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'packages':
        return (
          <div className="space-y-6">
            {/* Section Header Editor */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-black text-brand-dark mb-2">Bölüm Başlıkları</h3>
                  <p className="text-sm text-slate-600">Eğitim Paketleri bölümünün başlık ve açıklamalarını düzenleyin</p>
                </div>
                <button
                  onClick={() => {
                    setEditingItem({ type: 'packages-header' });
                    setFormData({
                      topTitle: getSection('packages-top-title', 'title', 'EĞİTİM PAKETLERİMİZ'),
                      mainTitle: getSection('packages-title', 'title', 'Size Uygun Paketi Seçin'),
                      subtitle: getSection('packages-subtitle', 'subtitle', 'İhtiyacınıza uygun eğitim paketi ile akademik hedeflerinize ulaşın.'),
                      buttonText: getSection('packages-button', 'buttonText', 'Tüm Paketleri İncele'),
                      buttonLink: getSection('packages-button', 'buttonLink', '/paketler')
                    });
                    setShowModal(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-brand-blue text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Düzenle</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-bold text-slate-700">Üst Başlık:</span>
                  <p className="text-slate-600">{getSection('packages-top-title', 'title', 'EĞİTİM PAKETLERİMİZ')}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Ana Başlık:</span>
                  <p className="text-slate-600">{getSection('packages-title', 'title', 'Size Uygun Paketi Seçin')}</p>
                </div>
                <div className="col-span-2">
                  <span className="font-bold text-slate-700">Açıklama:</span>
                  <p className="text-slate-600">{getSection('packages-subtitle', 'subtitle', 'İhtiyacınıza uygun eğitim paketi ile akademik hedeflerinize ulaşın.')}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Buton Metni:</span>
                  <p className="text-slate-600">{getSection('packages-button', 'buttonText', 'Tüm Paketleri İncele')}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Buton Linki:</span>
                  <p className="text-slate-600">{getSection('packages-button', 'buttonLink', '/paketler')}</p>
                </div>
              </div>
            </div>

            {/* Packages List */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-brand-dark">Paketler</h3>
              <button
                onClick={() => handleAdd('packages')}
                className="flex items-center space-x-2 px-4 py-2 bg-brand-blue text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Paket</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                  {pkg.image && (
                    <div className="aspect-video bg-slate-100">
                      <img
                        src={pkg.image.startsWith('http') ? pkg.image : `${API_BASE_URL}${pkg.image}`}
                        alt={pkg.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="font-black text-brand-dark mb-2">{pkg.name}</h4>
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">{pkg.shortDescription}</p>
                    {pkg.price && (
                      <div className="flex items-baseline space-x-2 mb-3">
                        <span className="text-lg font-black text-brand-blue">
                          {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(pkg.price)}
                        </span>
                        {pkg.originalPrice && (
                          <span className="text-sm text-slate-400 line-through">
                            {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(pkg.originalPrice)}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center space-x-2 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => handleEdit(pkg)}
                        className="flex-1 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-brand-blue hover:text-white transition-colors text-sm font-bold"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete('packages', pkg.id!)}
                        className="flex-1 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-red-500 hover:text-white transition-colors text-sm font-bold"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {packages.length === 0 && (
              <div className="text-center py-12 bg-slate-50 rounded-xl">
                <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">Henüz paket eklenmemiş</p>
                <button
                  onClick={() => handleAdd('packages')}
                  className="mt-4 px-6 py-2 bg-brand-blue text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
                >
                  İlk Paketi Ekle
                </button>
              </div>
            )}
          </div>
        );

      case 'cta':
        return (
          <div className="space-y-6">
            {/* Section Editor */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-black text-brand-dark mb-2">CTA Bölümü</h3>
                  <p className="text-sm text-slate-600">Call-to-Action bölümünün tüm metinlerini düzenleyin</p>
                </div>
                <button
                  onClick={() => {
                    setEditingItem({ type: 'cta-section' });
                    setFormData({
                      mainTitle: getSection('cta-main-title', 'title', 'Geleceği El Birliğiyle İnşa Edelim.'),
                      subtitle: getSection('cta-subtitle', 'subtitle', 'Akademik Hedeflerinize Ulaşmanız İçin Uzman Kadromuz, Modern Eğitim Materyallerimiz Ve Dijital Çözümlerimizle Yanınızdayız.'),
                      button1Text: getSection('cta-button-primary', 'buttonText', 'Hemen Kayıt Başvurusu'),
                      button1Link: getSection('cta-button-primary', 'buttonLink', '/iletisim'),
                      button2Text: getSection('cta-button-secondary', 'buttonText', 'Akademik Şubemiz Olun'),
                      button2Link: getSection('cta-button-secondary', 'buttonLink', '/franchise'),
                      badge: getSection('cta-badge', 'title', 'Sıradaki Başarı Öyküsü...'),
                      question: getSection('cta-question', 'title', 'Neden Sizin Başarı Hikayeniz Olmasın?'),
                      testimonial: getSection('cta-testimonial', 'description', '81 Şehirde Binlerce Öğrenci Geleceğine Güvenle Hazırlanıyor.'),
                      image: getSection('cta-image', 'buttonLink', '')
                    });
                    const imageUrl = getSection('cta-image', 'buttonLink', '');
                    if (imageUrl) {
                      setPreviewUrl(imageUrl.startsWith('http') ? imageUrl : `${API_BASE_URL}${imageUrl}`);
                    }
                    setShowModal(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-brand-blue text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Düzenle</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="col-span-2">
                  <span className="font-bold text-slate-700">Ana Başlık:</span>
                  <p className="text-slate-600">{getSection('cta-main-title', 'title', 'Geleceği El Birliğiyle İnşa Edelim.')}</p>
                </div>
                <div className="col-span-2">
                  <span className="font-bold text-slate-700">Alt Başlık:</span>
                  <p className="text-slate-600">{getSection('cta-subtitle', 'subtitle', 'Akademik Hedeflerinize Ulaşmanız İçin...')}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Buton 1:</span>
                  <p className="text-slate-600">{getSection('cta-button-primary', 'buttonText', 'Hemen Kayıt Başvurusu')}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Buton 2:</span>
                  <p className="text-slate-600">{getSection('cta-button-secondary', 'buttonText', 'Akademik Şubemiz Olun')}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Badge:</span>
                  <p className="text-slate-600">{getSection('cta-badge', 'title', 'Sıradaki Başarı Öyküsü...')}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Soru:</span>
                  <p className="text-slate-600">{getSection('cta-question', 'title', 'Neden Sizin Başarı Hikayeniz Olmasın?')}</p>
                </div>
                <div className="col-span-2">
                  <span className="font-bold text-slate-700">Testimonial:</span>
                  <p className="text-slate-600">{getSection('cta-testimonial', 'description', '81 Şehirde Binlerce Öğrenci...')}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'header':
        return (
          <div className="space-y-6">
            {/* Header Logo Management */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-black text-brand-dark mb-2">Header Logo</h3>
                  <p className="text-sm text-slate-600">Header'da görünecek logoyu yükleyin</p>
                </div>
                <button
                  onClick={() => {
                    setEditingItem({ type: 'header-logo' });
                    const logoPath = getSection('header-logo', 'buttonLink', '/assets/images/logoblue.svg');
                    const fullLogoUrl = logoPath.startsWith('http') || logoPath.startsWith('/assets') 
                      ? logoPath 
                      : `${API_BASE_URL}${logoPath}`;
                    setFormData({
                      logo: logoPath
                    });
                    setPreviewUrl(fullLogoUrl);
                    setShowModal(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-brand-blue text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Logo Değiştir</span>
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <img 
                  src={(() => {
                    const logoPath = getSection('header-logo', 'buttonLink', '/assets/images/logoblue.svg');
                    if (logoPath.startsWith('http') || logoPath.startsWith('/assets')) {
                      return logoPath;
                    }
                    return `${API_BASE_URL}${logoPath}`;
                  })()} 
                  alt="Header Logo" 
                  className="h-12 w-auto bg-white p-2 rounded-lg border border-slate-200"
                />
              </div>
            </div>

            {/* Top Bar Links */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-black text-brand-dark mb-2">Üst Bar Linkleri</h3>
                  <p className="text-sm text-slate-600">Header üst kısmındaki hızlı erişim linklerini yönetin</p>
                </div>
                <button
                  onClick={() => {
                    setEditingItem({ type: 'header-topbar-link' });
                    setFormData({ label: '', url: '', order: 0 });
                    setShowModal(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-brand-blue text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Link Ekle</span>
                </button>
              </div>
              
              <div className="space-y-2">
                {homeSections
                  .filter(s => s.section.startsWith('header-topbar-link'))
                  .sort((a, b) => a.order - b.order)
                  .map((item, itemIdx, arr) => {
                    const moveTopbarLink = async (item: any, direction: 'up' | 'down') => {
                      const currentIndex = arr.findIndex(i => i.id === item.id);
                      if (direction === 'up' && currentIndex === 0) return;
                      if (direction === 'down' && currentIndex === arr.length - 1) return;
                      
                      const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
                      const swapItem = arr[swapIndex];
                      
                      await homeSectionService.update(item.id!, { ...item, order: swapItem.order });
                      await homeSectionService.update(swapItem.id!, { ...swapItem, order: item.order });
                      
                      const res = await homeSectionService.getAll();
                      setHomeSections(res.data.data || []);
                    };

                    return (
                      <div key={item.id} className="bg-slate-50 rounded-lg p-3 text-sm group hover:bg-slate-100 transition-colors">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-700">{item.title}</p>
                            <p className="text-slate-500 text-xs truncate">{item.buttonLink}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="flex flex-col gap-0.5">
                              <button
                                onClick={() => moveTopbarLink(item, 'up')}
                                disabled={itemIdx === 0}
                                className={`p-0.5 rounded ${itemIdx === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-200'}`}
                                title="Yukarı taşı"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => moveTopbarLink(item, 'down')}
                                disabled={itemIdx === arr.length - 1}
                                className={`p-0.5 rounded ${itemIdx === arr.length - 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-200'}`}
                                title="Aşağı taşı"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                            </div>
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => {
                                  setEditingItem({ ...item, type: 'header-topbar-link' });
                                  setFormData({
                                    label: item.title,
                                    url: item.buttonLink,
                                    order: item.order
                                  });
                                  setShowModal(true);
                                }}
                                className="p-1 hover:bg-blue-100 rounded text-blue-600"
                                title="Düzenle"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm('Bu linki silmek istediğinizden emin misiniz?')) {
                                    await homeSectionService.delete(item.id!);
                                    const res = await homeSectionService.getAll();
                                    setHomeSections(res.data.data || []);
                                  }
                                }}
                                className="p-1 hover:bg-red-100 rounded text-red-600"
                                title="Sil"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {homeSections.filter(s => s.section.startsWith('header-topbar-link')).length === 0 && (
                  <p className="text-xs text-slate-400 italic">Henüz link eklenmemiş</p>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-black text-brand-dark mb-2">İletişim Bilgileri</h3>
                  <p className="text-sm text-slate-600">Header üst barında görünen telefon numarasını düzenleyin</p>
                </div>
                <button
                  onClick={() => {
                    setEditingItem({ type: 'header-contact' });
                    setFormData({
                      phone: getSection('header-phone', 'title', '0212 000 00 00')
                    });
                    setShowModal(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-brand-blue text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Düzenle</span>
                </button>
              </div>
              <div className="text-sm">
                <span className="font-bold text-slate-700">Telefon:</span>
                <p className="text-slate-600">{getSection('header-phone', 'title', '0212 000 00 00')}</p>
              </div>
            </div>

            {/* Main Menu Links */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-black text-brand-dark mb-2">Ana Menü Linkleri</h3>
                  <p className="text-sm text-slate-600">Header ana menüsündeki linkleri yönetin (Ana Sayfa, Videolar, Paketler vb.)</p>
                </div>
                <button
                  onClick={() => {
                    setEditingItem({ type: 'header-menu-link' });
                    setFormData({ label: '', url: '', order: 0 });
                    setShowModal(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-brand-blue text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Link Ekle</span>
                </button>
              </div>
              
              <div className="space-y-2">
                {homeSections
                  .filter(s => s.section.startsWith('header-menu-link'))
                  .sort((a, b) => a.order - b.order)
                  .map((item, itemIdx, arr) => {
                    const moveMenuLink = async (item: any, direction: 'up' | 'down') => {
                      const currentIndex = arr.findIndex(i => i.id === item.id);
                      if (direction === 'up' && currentIndex === 0) return;
                      if (direction === 'down' && currentIndex === arr.length - 1) return;
                      
                      const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
                      const swapItem = arr[swapIndex];
                      
                      await homeSectionService.update(item.id!, { ...item, order: swapItem.order });
                      await homeSectionService.update(swapItem.id!, { ...swapItem, order: item.order });
                      
                      const res = await homeSectionService.getAll();
                      setHomeSections(res.data.data || []);
                    };

                    return (
                      <div key={item.id} className="bg-slate-50 rounded-lg p-3 text-sm group hover:bg-slate-100 transition-colors">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-700">{item.title}</p>
                            <p className="text-slate-500 text-xs truncate">{item.buttonLink}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="flex flex-col gap-0.5">
                              <button
                                onClick={() => moveMenuLink(item, 'up')}
                                disabled={itemIdx === 0}
                                className={`p-0.5 rounded ${itemIdx === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-200'}`}
                                title="Yukarı taşı"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => moveMenuLink(item, 'down')}
                                disabled={itemIdx === arr.length - 1}
                                className={`p-0.5 rounded ${itemIdx === arr.length - 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-200'}`}
                                title="Aşağı taşı"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                            </div>
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => {
                                  setEditingItem({ ...item, type: 'header-menu-link' });
                                  setFormData({
                                    label: item.title,
                                    url: item.buttonLink,
                                    order: item.order
                                  });
                                  setShowModal(true);
                                }}
                                className="p-1 hover:bg-blue-100 rounded text-blue-600"
                                title="Düzenle"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm('Bu linki silmek istediğinizden emin misiniz?')) {
                                    await homeSectionService.delete(item.id!);
                                    const res = await homeSectionService.getAll();
                                    setHomeSections(res.data.data || []);
                                  }
                                }}
                                className="p-1 hover:bg-red-100 rounded text-red-600"
                                title="Sil"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {homeSections.filter(s => s.section.startsWith('header-menu-link')).length === 0 && (
                  <p className="text-xs text-slate-400 italic">Henüz link eklenmemiş</p>
                )}
              </div>
            </div>

            {/* Social Media Links */}
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-3">Sosyal Medya Linkleri</h3>
              <p className="text-xs text-slate-600 mb-4">Header'da görünecek sosyal medya ikonlarını yönetin.</p>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {['youtube', 'instagram', 'twitter', 'facebook', 'linkedin'].map(platform => {
                  const existing = socialMedia.find(s => s.platform === platform);
                  const platformIcons: any = {
                    youtube: '🎥',
                    instagram: '📷',
                    twitter: '🐦',
                    facebook: '👥',
                    linkedin: '💼'
                  };
                  const platformColors: any = {
                    youtube: 'bg-red-50 border-red-200',
                    instagram: 'bg-pink-50 border-pink-200',
                    twitter: 'bg-blue-50 border-blue-200',
                    facebook: 'bg-blue-50 border-blue-300',
                    linkedin: 'bg-blue-50 border-blue-400'
                  };
                  const platformNames: any = {
                    youtube: 'YouTube',
                    instagram: 'Instagram',
                    twitter: 'Twitter',
                    facebook: 'Facebook',
                    linkedin: 'LinkedIn'
                  };
                  
                  return (
                    <div 
                      key={platform} 
                      className={`${platformColors[platform]} rounded-xl border-2 p-4 text-center`}
                    >
                      <div className="text-3xl mb-2">{platformIcons[platform]}</div>
                      <h4 className="font-bold text-sm mb-3">{platformNames[platform]}</h4>
                      {existing ? (
                        <>
                          <p className="text-xs text-slate-600 mb-3 truncate" title={existing.url}>
                            {existing.url.replace('https://', '').substring(0, 20)}...
                          </p>
                          <button 
                            onClick={() => {
                              setEditingItem({ ...existing, type: 'social-media' });
                              setFormData(existing);
                              setShowModal(true);
                            }} 
                            className="w-full px-3 py-2 bg-white hover:bg-slate-50 rounded-lg text-blue-600 font-bold text-xs transition-colors"
                          >
                            Düzenle
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => {
                            setEditingItem({ type: 'social-media' });
                            setFormData({ platform, url: '', order: socialMedia.length, isActive: true });
                            setShowModal(true);
                          }} 
                          className="w-full px-3 py-2 bg-white hover:bg-slate-50 rounded-lg text-green-600 font-bold text-xs transition-colors"
                        >
                          + Ekle
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'footer':
        return (
          <div className="space-y-6">
            {/* Logo Management */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-black text-brand-dark mb-2">Footer Logo</h3>
                  <p className="text-sm text-slate-600">Footer'da görünecek logoyu yükleyin</p>
                </div>
                <button
                  onClick={() => {
                    setEditingItem({ type: 'footer-logo' });
                    const logoPath = getSection('footer-logo', 'buttonLink', '/assets/images/logoblue.svg');
                    const fullLogoUrl = logoPath.startsWith('http') || logoPath.startsWith('/assets') 
                      ? logoPath 
                      : `${API_BASE_URL}${logoPath}`;
                    setFormData({
                      logo: logoPath
                    });
                    setPreviewUrl(fullLogoUrl);
                    setShowModal(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-brand-blue text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Logo Değiştir</span>
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <img 
                  src={(() => {
                    const logoPath = getSection('footer-logo', 'buttonLink', '/assets/images/logoblue.svg');
                    if (logoPath.startsWith('http') || logoPath.startsWith('/assets')) {
                      return logoPath;
                    }
                    return `${API_BASE_URL}${logoPath}`;
                  })()} 
                  alt="Footer Logo" 
                  className="h-12 w-auto bg-brand-indigo p-2 rounded-lg"
                />
              </div>
            </div>

            {/* Footer Text Content */}
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-black text-brand-dark mb-2">Footer Metinleri</h3>
                  <p className="text-sm text-slate-600">Footer açıklama ve copyright metinlerini düzenleyin</p>
                </div>
                <button
                  onClick={() => {
                    setEditingItem({ type: 'footer-section' });
                    setFormData({
                      description: getSection('footer-description', 'description', 'Türkiye\'nin Öncü Eğitim Markası Olarak, Akademik Başarınızı En Modern Teknolojiler Ve Uzman Kadromuzla Destekliyoruz.'),
                      copyright: getSection('footer-copyright', 'title', 'Hocalara Geldik Akademi Grubu. Tüm hakları saklıdır.')
                    });
                    setShowModal(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-brand-blue text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Düzenle</span>
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div>
                  <span className="font-bold text-slate-700">Açıklama:</span>
                  <p className="text-slate-600">{getSection('footer-description', 'description', 'Türkiye\'nin Öncü Eğitim Markası...')}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Copyright:</span>
                  <p className="text-slate-600">{getSection('footer-copyright', 'title', 'Hocalara Geldik Akademi Grubu. Tüm hakları saklıdır.')}</p>
                </div>
              </div>
            </div>

            {/* Footer Menu Columns */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-black text-brand-dark mb-2">Menü Sütunları</h3>
                  <p className="text-sm text-slate-600">Footer menü sütunlarının başlıklarını düzenleyin</p>
                </div>
                <button
                  onClick={() => {
                    setEditingItem({ type: 'footer-menu-columns' });
                    setFormData({
                      column1Title: getSection('footer-menu-column1', 'title', 'Hızlı Menü Linkleri'),
                      column2Title: getSection('footer-menu-column2', 'title', 'Eğitim Programları'),
                      column3Title: getSection('footer-menu-column3', 'title', 'Genel İletişim Hattı')
                    });
                    setShowModal(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-brand-blue text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Düzenle</span>
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-bold text-slate-700">Sütun 1:</span>
                  <p className="text-slate-600">{getSection('footer-menu-column1', 'title', 'Hızlı Menü Linkleri')}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Sütun 2:</span>
                  <p className="text-slate-600">{getSection('footer-menu-column2', 'title', 'Eğitim Programları')}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Sütun 3:</span>
                  <p className="text-slate-600">{getSection('footer-menu-column3', 'title', 'Genel İletişim Hattı')}</p>
                </div>
              </div>
            </div>

            {/* Footer Menu Items */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-black text-brand-dark mb-2">Menü Linkleri</h3>
                  <p className="text-sm text-slate-600">Footer menü linklerini yönetin</p>
                </div>
                <button
                  onClick={() => {
                    setEditingItem({ type: 'footer-menu-item' });
                    setFormData({ column: 'column1', label: '', url: '', order: 0 });
                    setShowModal(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-brand-blue text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Link Ekle</span>
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-6">
                {['column1', 'column2', 'column3'].map((column, idx) => {
                  const columnItems = homeSections.filter(s => s.section.startsWith(`footer-menu-${column}-item`))
                    .sort((a, b) => a.order - b.order);
                  
                  const moveItem = async (item: any, direction: 'up' | 'down') => {
                    const currentIndex = columnItems.findIndex(i => i.id === item.id);
                    if (direction === 'up' && currentIndex === 0) return;
                    if (direction === 'down' && currentIndex === columnItems.length - 1) return;
                    
                    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
                    const swapItem = columnItems[swapIndex];
                    
                    // Swap orders
                    await homeSectionService.update(item.id!, { ...item, order: swapItem.order });
                    await homeSectionService.update(swapItem.id!, { ...swapItem, order: item.order });
                    
                    // Refresh
                    const res = await homeSectionService.getAll();
                    setHomeSections(res.data.data || []);
                  };
                  
                  return (
                    <div key={column} className="space-y-2">
                      <h4 className="font-bold text-sm text-slate-700 mb-3">
                        {getSection(`footer-menu-${column}`, 'title', `Sütun ${idx + 1}`)}
                      </h4>
                      {columnItems.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">Henüz link eklenmemiş</p>
                      ) : (
                        columnItems.map((item, itemIdx) => (
                          <div key={item.id} className="bg-slate-50 rounded-lg p-2 text-xs group hover:bg-slate-100 transition-colors">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-700 truncate">{item.title}</p>
                                <p className="text-slate-500 truncate text-[10px]">{item.buttonLink}</p>
                              </div>
                              <div className="flex items-center space-x-1">
                                {/* Move Up/Down buttons - always visible */}
                                <div className="flex flex-col gap-0.5">
                                  <button
                                    onClick={() => moveItem(item, 'up')}
                                    disabled={itemIdx === 0}
                                    className={`p-0.5 rounded ${itemIdx === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-200'}`}
                                    title="Yukarı taşı"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => moveItem(item, 'down')}
                                    disabled={itemIdx === columnItems.length - 1}
                                    className={`p-0.5 rounded ${itemIdx === columnItems.length - 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-200'}`}
                                    title="Aşağı taşı"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </button>
                                </div>
                                {/* Edit/Delete buttons - show on hover */}
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => {
                                      setEditingItem({ ...item, type: 'footer-menu-item', column });
                                      setFormData({
                                        column,
                                        label: item.title,
                                        url: item.buttonLink,
                                        order: item.order
                                      });
                                      setShowModal(true);
                                    }}
                                    className="p-1 hover:bg-blue-100 rounded text-blue-600"
                                    title="Düzenle"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={async () => {
                                      if (confirm('Bu linki silmek istediğinizden emin misiniz?')) {
                                        await homeSectionService.delete(item.id!);
                                        const res = await homeSectionService.getAll();
                                        setHomeSections(res.data.data || []);
                                      }
                                    }}
                                    className="p-1 hover:bg-red-100 rounded text-red-600"
                                    title="Sil"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Bottom Links */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-black text-brand-dark mb-2">Alt Menü Linkleri</h3>
                  <p className="text-sm text-slate-600">Footer alt kısmındaki linkleri yönetin (Gizlilik, Kullanım Şartları vb.)</p>
                </div>
                <button
                  onClick={() => {
                    setEditingItem({ type: 'footer-bottom-link' });
                    setFormData({ label: '', url: '', order: 0 });
                    setShowModal(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-brand-blue text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Link Ekle</span>
                </button>
              </div>
              
              <div className="space-y-2">
                {homeSections
                  .filter(s => s.section.startsWith('footer-bottom-link'))
                  .sort((a, b) => a.order - b.order)
                  .map((item, itemIdx, arr) => {
                    const moveBottomLink = async (item: any, direction: 'up' | 'down') => {
                      const currentIndex = arr.findIndex(i => i.id === item.id);
                      if (direction === 'up' && currentIndex === 0) return;
                      if (direction === 'down' && currentIndex === arr.length - 1) return;
                      
                      const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
                      const swapItem = arr[swapIndex];
                      
                      await homeSectionService.update(item.id!, { ...item, order: swapItem.order });
                      await homeSectionService.update(swapItem.id!, { ...swapItem, order: item.order });
                      
                      const res = await homeSectionService.getAll();
                      setHomeSections(res.data.data || []);
                    };

                    return (
                      <div key={item.id} className="bg-slate-50 rounded-lg p-3 text-sm group hover:bg-slate-100 transition-colors">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-700">{item.title}</p>
                            <p className="text-slate-500 text-xs truncate">{item.buttonLink}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="flex flex-col gap-0.5">
                              <button
                                onClick={() => moveBottomLink(item, 'up')}
                                disabled={itemIdx === 0}
                                className={`p-0.5 rounded ${itemIdx === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-200'}`}
                                title="Yukarı taşı"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => moveBottomLink(item, 'down')}
                                disabled={itemIdx === arr.length - 1}
                                className={`p-0.5 rounded ${itemIdx === arr.length - 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-200'}`}
                                title="Aşağı taşı"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                            </div>
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => {
                                  setEditingItem({ ...item, type: 'footer-bottom-link' });
                                  setFormData({
                                    label: item.title,
                                    url: item.buttonLink,
                                    order: item.order
                                  });
                                  setShowModal(true);
                                }}
                                className="p-1 hover:bg-blue-100 rounded text-blue-600"
                                title="Düzenle"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm('Bu linki silmek istediğinizden emin misiniz?')) {
                                    await homeSectionService.delete(item.id!);
                                    const res = await homeSectionService.getAll();
                                    setHomeSections(res.data.data || []);
                                  }
                                }}
                                className="p-1 hover:bg-red-100 rounded text-red-600"
                                title="Sil"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {homeSections.filter(s => s.section.startsWith('footer-bottom-link')).length === 0 && (
                  <p className="text-xs text-slate-400 italic">Henüz link eklenmemiş</p>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <FileText className="w-12 h-12 text-blue-600 mb-3" />
              <h3 className="text-lg font-bold text-brand-dark mb-2">İletişim ve Sosyal Medya</h3>
              <p className="text-sm text-slate-600 mb-4">
                Footer'daki iletişim bilgileri ve sosyal medya linkleri <strong>Ayarlar</strong> bölümünden yönetilir.
              </p>
              <p className="text-xs text-slate-500">
                Telefon, email, adres ve sosyal medya hesaplarını güncellemek için Admin Panel &gt; Ayarlar sayfasına gidin.
              </p>
            </div>
          </div>
        );

      case 'tools':
        return (
          <div className="space-y-6">
            {/* Section Header Editor */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border border-green-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-black text-brand-dark mb-2">Bölüm Başlıkları</h3>
                  <p className="text-sm text-slate-600">Çalışma Araçları bölümünün başlık ve açıklamalarını düzenleyin</p>
                </div>
                <button
                  onClick={() => {
                    setEditingItem({ type: 'tools-header' });
                    setFormData({
                      topTitle: getSection('tools-top-title', 'title', 'ÇALIŞMA ARAÇLARI'),
                      mainTitle: getSection('tools-title', 'title', 'Sınav Geri Sayımı ve Pomodoro'),
                      subtitle: getSection('tools-subtitle', 'subtitle', 'Sınavınıza kalan süreyi takip edin ve Pomodoro tekniği ile verimli çalışma seansları oluşturun.'),
                      countdownTitle: getSection('tools-countdown-title', 'title', 'Sınava Kalan Süre'),
                      pomodoroTitle: getSection('tools-pomodoro-title', 'title', 'Pomodoro Zamanlayıcı')
                    });
                    setShowModal(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-brand-blue text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Düzenle</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-bold text-slate-700">Üst Başlık:</span>
                  <p className="text-slate-600">{getSection('tools-top-title', 'title', 'ÇALIŞMA ARAÇLARI')}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Ana Başlık:</span>
                  <p className="text-slate-600">{getSection('tools-title', 'title', 'Sınav Geri Sayımı ve Pomodoro')}</p>
                </div>
                <div className="col-span-2">
                  <span className="font-bold text-slate-700">Açıklama:</span>
                  <p className="text-slate-600">{getSection('tools-subtitle', 'subtitle', 'Sınavınıza kalan süreyi takip edin...')}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Geri Sayım Başlığı:</span>
                  <p className="text-slate-600">{getSection('tools-countdown-title', 'title', 'Sınava Kalan Süre')}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Pomodoro Başlığı:</span>
                  <p className="text-slate-600">{getSection('tools-pomodoro-title', 'title', 'Pomodoro Zamanlayıcı')}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Countdown Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <Timer className="w-12 h-12 text-blue-600 mb-3" />
                <h3 className="text-lg font-bold text-brand-dark mb-2">Geri Sayım Zamanlayıcı</h3>
                <p className="text-sm text-slate-600 mb-4">Sınav tarihleri ve saatlerini düzenleyin.</p>
                <div className="space-y-3">
                  {console.log('🟡 examDates:', examDates)}
                  {['TYT', 'AYT', 'LGS'].map(examName => {
                    const exam = examDates.find(e => e.examName === examName);
                    console.log(`🟡 ${examName} için exam:`, exam);
                    const examDate = exam ? new Date(exam.examDate) : null;
                    return (
                      <div key={examName} className="bg-white rounded-lg p-3 border border-blue-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-sm">{examName}</span>
                          <button
                            onClick={() => {
                              let formattedDate = '';
                              if (exam) {
                                console.log('🟢 AÇILIYOR - exam:', exam);
                                console.log('🟢 exam.examDate:', exam.examDate);
                                
                                // exam.examDate is in format "YYYY-MM-DDTHH:mm:ss.sssZ"
                                // We need to extract just the date and time parts without timezone conversion
                                const isoString = exam.examDate;
                                // Extract YYYY-MM-DDTHH:mm directly from ISO string
                                formattedDate = isoString.substring(0, 16); // Gets "YYYY-MM-DDTHH:mm"
                                
                                console.log('🟢 formattedDate:', formattedDate);
                              } else {
                                console.log('🟢 YENİ SINAV - exam yok');
                                // Default to 09:00 for new exams
                                const now = new Date();
                                const year = now.getFullYear();
                                const month = String(now.getMonth() + 1).padStart(2, '0');
                                const day = String(now.getDate()).padStart(2, '0');
                                formattedDate = `${year}-${month}-${day}T09:00`;
                              }
                              
                              console.log('🟢 setFormData çağrılıyor:', {
                                examName,
                                examDate: formattedDate,
                                description: exam?.description || '',
                                order: exam?.order || (['TYT', 'AYT', 'LGS'].indexOf(examName))
                              });
                              
                              setEditingItem({ 
                                id: exam?.id,
                                type: 'exam-date', 
                                examName 
                              });
                              setFormData({
                                examName,
                                examDate: formattedDate,
                                description: exam?.description || '',
                                order: exam?.order || (['TYT', 'AYT', 'LGS'].indexOf(examName))
                              });
                              setShowModal(true);
                            }}
                            className="text-xs px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded font-bold transition-colors"
                          >
                            {exam ? 'Düzenle' : 'Ekle'}
                          </button>
                        </div>
                        {examDate ? (
                          <div className="text-xs text-slate-600">
                            <div>{examDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                            <div className="text-slate-500">Saat: {examDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</div>
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400">Tarih belirlenmemiş</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pomodoro Info */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <Timer className="w-12 h-12 text-green-600 mb-3" />
                <h3 className="text-lg font-bold text-brand-dark mb-2">Pomodoro Tekniği</h3>
                <p className="text-sm text-slate-600 mb-4">25 dakika çalışma, 5 dakika mola ile verimli çalışma.</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Çalışma:</span>
                    <span className="font-bold">25 dakika</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Kısa Mola:</span>
                    <span className="font-bold">5 dakika</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Uzun Mola:</span>
                    <span className="font-bold">15 dakika</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderForm = () => {
    // Section header form
    if (editingItem?.type === 'section-header') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Üst Başlık</label>
            <input
              type="text"
              value={formData.topTitle || ''}
              onChange={e => setFormData({ ...formData, topTitle: e.target.value })}
              placeholder="BAŞARI MERKEZLERİMİZ"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Ana Başlık</label>
            <input
              type="text"
              value={formData.mainTitle || ''}
              onChange={e => setFormData({ ...formData, mainTitle: e.target.value })}
              placeholder="Türkiye'nin En Büyük Eğitim Ağı"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Açıklama</label>
            <textarea
              value={formData.subtitle || ''}
              onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
              rows={3}
              placeholder="81 ilde güçlü şube ağımız, modern eğitim altyapımız..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">Buton Metni</label>
              <input
                type="text"
                value={formData.buttonText || ''}
                onChange={e => setFormData({ ...formData, buttonText: e.target.value })}
                placeholder="Şubelerimizi Keşfedin"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Buton Linki</label>
              <input
                type="text"
                value={formData.buttonLink || ''}
                onChange={e => setFormData({ ...formData, buttonLink: e.target.value })}
                placeholder="/subeler"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>
        </div>
      );
    }

    // Digital header form
    if (editingItem?.type === 'digital-header') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Üst Başlık</label>
            <input
              type="text"
              value={formData.topTitle || ''}
              onChange={e => setFormData({ ...formData, topTitle: e.target.value })}
              placeholder="DİJİTAL EĞİTİM SİSTEMİ"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Ana Başlık</label>
            <input
              type="text"
              value={formData.mainTitle || ''}
              onChange={e => setFormData({ ...formData, mainTitle: e.target.value })}
              placeholder="Yapay Zeka Destekli Eğitim Platformu"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Açıklama</label>
            <textarea
              value={formData.subtitle || ''}
              onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
              rows={3}
              placeholder="Öğrenciler ve veliler için geliştirdiğimiz dijital altyapı..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
        </div>
      );
    }

    // Global header form
    if (editingItem?.type === 'global-header') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Ana Başlık</label>
            <input
              type="text"
              value={formData.mainTitle || ''}
              onChange={e => setFormData({ ...formData, mainTitle: e.target.value })}
              placeholder="Hocalara Geldik Yurt Dışı"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Açıklama</label>
            <textarea
              value={formData.subtitle || ''}
              onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
              rows={3}
              placeholder="Dünya'nın en prestijli üniversitelerine yerleşme hayalinizi gerçeğe dönüştürüyoruz"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
        </div>
      );
    }

    // YouTube header form
    if (editingItem?.type === 'youtube-header') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Üst Başlık</label>
            <input
              type="text"
              value={formData.topTitle || ''}
              onChange={e => setFormData({ ...formData, topTitle: e.target.value })}
              placeholder="DİJİTAL İÇERİKLERİMİZ"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Ana Başlık</label>
            <input
              type="text"
              value={formData.mainTitle || ''}
              onChange={e => setFormData({ ...formData, mainTitle: e.target.value })}
              placeholder="YouTube Kanallarımız ve Sosyal Medya"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Açıklama</label>
            <textarea
              value={formData.subtitle || ''}
              onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
              rows={3}
              placeholder="Binlerce ücretsiz ders videosu ve güncel içeriklerimiz için kanallarımıza abone olun..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div className="border-t pt-4">
            <h3 className="text-sm font-bold mb-3 text-slate-700">Sosyal Medya Bölümü</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Sosyal Medya Başlığı</label>
                <input
                  type="text"
                  value={formData.socialTitle || ''}
                  onChange={e => setFormData({ ...formData, socialTitle: e.target.value })}
                  placeholder="Sosyal Medyada Bizi Takip Edin"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Sosyal Medya Açıklaması</label>
                <textarea
                  value={formData.socialSubtitle || ''}
                  onChange={e => setFormData({ ...formData, socialSubtitle: e.target.value })}
                  rows={2}
                  placeholder="Güncel duyurular, motivasyon içerikleri ve daha fazlası için sosyal medya hesaplarımızı takip edin!"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Social Media form
    if (editingItem?.type === 'social-media') {
      const platformNames: any = {
        youtube: 'YouTube',
        instagram: 'Instagram',
        twitter: 'Twitter',
        facebook: 'Facebook',
        linkedin: 'LinkedIn'
      };
      
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Platform</label>
            <input
              type="text"
              value={platformNames[formData.platform] || formData.platform}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-slate-50 text-slate-600 font-bold"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">URL</label>
            <input
              type="text"
              value={formData.url || ''}
              onChange={e => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://youtube.com/@hocalarageldik"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
            <p className="text-xs text-slate-500 mt-1">Tam URL'yi girin (https:// ile başlayan)</p>
          </div>
        </div>
      );
    }

    // Blog header form
    if (editingItem?.type === 'blog-header') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Üst Başlık</label>
            <input
              type="text"
              value={formData.topTitle || ''}
              onChange={e => setFormData({ ...formData, topTitle: e.target.value })}
              placeholder="REHBERLİK VE İÇERİKLER"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Ana Başlık</label>
            <input
              type="text"
              value={formData.mainTitle || ''}
              onChange={e => setFormData({ ...formData, mainTitle: e.target.value })}
              placeholder="Rehberlik ve Blog Notları"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Açıklama</label>
            <textarea
              value={formData.subtitle || ''}
              onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
              rows={3}
              placeholder="Akademik ve psikolojik destek yazıları, sınav stratejileri ve motivasyon içerikleri..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
        </div>
      );
    }

    // Calculator header form
    if (editingItem?.type === 'calculator-header') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Badge Metni</label>
            <input
              type="text"
              value={formData.badge || ''}
              onChange={e => setFormData({ ...formData, badge: e.target.value })}
              placeholder="Puan Hesaplama Araçları"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Ana Başlık</label>
            <input
              type="text"
              value={formData.mainTitle || ''}
              onChange={e => setFormData({ ...formData, mainTitle: e.target.value })}
              placeholder="Sınav Puanınızı Hesaplayın"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Açıklama</label>
            <textarea
              value={formData.subtitle || ''}
              onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
              rows={3}
              placeholder="Net sayılarınızı girerek yaklaşık sınav puanınızı hesaplayabilir..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">Buton Metni</label>
              <input
                type="text"
                value={formData.buttonText || ''}
                onChange={e => setFormData({ ...formData, buttonText: e.target.value })}
                placeholder="Hesaplama Araçlarına Git"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Buton Linki</label>
              <input
                type="text"
                value={formData.buttonLink || ''}
                onChange={e => setFormData({ ...formData, buttonLink: e.target.value })}
                placeholder="/hesaplama"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>
          <div className="border-t pt-4">
            <h3 className="text-sm font-bold mb-3 text-slate-700">Hesaplama Kartları Metinleri</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold mb-2 text-slate-600">TYT Metni</label>
                <input
                  type="text"
                  value={formData.tytText || ''}
                  onChange={e => setFormData({ ...formData, tytText: e.target.value })}
                  placeholder="Puan Hesapla"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-2 text-slate-600">AYT Metni</label>
                <input
                  type="text"
                  value={formData.aytText || ''}
                  onChange={e => setFormData({ ...formData, aytText: e.target.value })}
                  placeholder="Puan Hesapla"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-2 text-slate-600">LGS Metni</label>
                <input
                  type="text"
                  value={formData.lgsText || ''}
                  onChange={e => setFormData({ ...formData, lgsText: e.target.value })}
                  placeholder="Puan Hesapla"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Header logo form
    if (editingItem?.type === 'header-logo') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Header Logo</label>
            <div className="space-y-3">
              {previewUrl && (
                <div className="relative w-full h-32 rounded-lg overflow-hidden border border-slate-200 bg-white flex items-center justify-center p-4">
                  <img src={previewUrl} alt="Logo Preview" className="max-h-full w-auto object-contain" />
                </div>
              )}
              <div className="flex items-center space-x-3">
                <label className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors border-2 border-dashed border-slate-300">
                  <Upload className="w-5 h-5 text-slate-600" />
                  <span className="text-sm font-bold text-slate-600">
                    {selectedFile ? selectedFile.name : 'Logo Seç'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Header topbar link form
    if (editingItem?.type === 'header-topbar-link') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Link Metni</label>
            <input
              type="text"
              value={formData.label || ''}
              onChange={e => setFormData({ ...formData, label: e.target.value })}
              placeholder="Hakkımızda"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Link URL</label>
            <input
              type="text"
              value={formData.url || ''}
              onChange={e => setFormData({ ...formData, url: e.target.value })}
              placeholder="/hakkimizda"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs font-bold text-blue-600 mb-2">💡 İpucu</p>
            <p className="text-xs text-slate-600">
              Bu linkler header'ın en üst kısmında görünür. Sıralamayı yukarı/aşağı ok butonlarıyla değiştirebilirsiniz.
            </p>
          </div>
        </div>
      );
    }

    // Header contact form
    if (editingItem?.type === 'header-contact') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Telefon Numarası</label>
            <input
              type="text"
              value={formData.phone || ''}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              placeholder="0212 000 00 00"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs font-bold text-blue-600 mb-2">ℹ️ Bilgi</p>
            <p className="text-xs text-slate-600">
              Bu telefon numarası header'ın üst barında görünür.
            </p>
          </div>
        </div>
      );
    }

    // Header menu link form
    if (editingItem?.type === 'header-menu-link') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Menü Metni</label>
            <input
              type="text"
              value={formData.label || ''}
              onChange={e => setFormData({ ...formData, label: e.target.value })}
              placeholder="Ana Sayfa"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Link URL</label>
            <input
              type="text"
              value={formData.url || ''}
              onChange={e => setFormData({ ...formData, url: e.target.value })}
              placeholder="/"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs font-bold text-blue-600 mb-2">💡 İpucu</p>
            <p className="text-xs text-slate-600">
              Bu linkler header'ın ana menüsünde görünür. Sıralamayı yukarı/aşağı ok butonlarıyla değiştirebilirsiniz.
            </p>
          </div>
        </div>
      );
    }

    // Footer logo form
    if (editingItem?.type === 'footer-logo') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Footer Logo</label>
            <div className="space-y-3">
              {previewUrl && (
                <div className="relative w-full h-32 rounded-lg overflow-hidden border border-slate-200 bg-brand-indigo flex items-center justify-center p-4">
                  <img src={previewUrl} alt="Logo Preview" className="max-h-full w-auto object-contain" />
                </div>
              )}
              <div className="flex items-center space-x-3">
                <label className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors border-2 border-dashed border-slate-300">
                  <Upload className="w-5 h-5 text-slate-600" />
                  <span className="text-sm font-bold text-slate-600">
                    {selectedFile ? selectedFile.name : 'Logo Seç'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Footer menu columns form
    if (editingItem?.type === 'footer-menu-columns') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Sütun 1 Başlığı</label>
            <input
              type="text"
              value={formData.column1Title || ''}
              onChange={e => setFormData({ ...formData, column1Title: e.target.value })}
              placeholder="Hızlı Menü Linkleri"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Sütun 2 Başlığı</label>
            <input
              type="text"
              value={formData.column2Title || ''}
              onChange={e => setFormData({ ...formData, column2Title: e.target.value })}
              placeholder="Eğitim Programları"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Sütun 3 Başlığı</label>
            <input
              type="text"
              value={formData.column3Title || ''}
              onChange={e => setFormData({ ...formData, column3Title: e.target.value })}
              placeholder="Genel İletişim Hattı"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
        </div>
      );
    }

    // Footer bottom link form
    if (editingItem?.type === 'footer-bottom-link') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Link Metni</label>
            <input
              type="text"
              value={formData.label || ''}
              onChange={e => setFormData({ ...formData, label: e.target.value })}
              placeholder="Gizlilik Sözleşmesi"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Link URL</label>
            <input
              type="text"
              value={formData.url || ''}
              onChange={e => setFormData({ ...formData, url: e.target.value })}
              placeholder="/gizlilik"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs font-bold text-blue-600 mb-2">💡 İpucu</p>
            <p className="text-xs text-slate-600">
              Bu linkler footer'ın en alt kısmında copyright metninin yanında görünür. Sıralamayı yukarı/aşağı ok butonlarıyla değiştirebilirsiniz.
            </p>
          </div>
        </div>
      );
    }

    // Footer menu item form
    if (editingItem?.type === 'footer-menu-item') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Sütun</label>
            <select
              value={formData.column || 'column1'}
              onChange={e => setFormData({ ...formData, column: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            >
              <option value="column1">{getSection('footer-menu-column1', 'title', 'Sütun 1')}</option>
              <option value="column2">{getSection('footer-menu-column2', 'title', 'Sütun 2')}</option>
              <option value="column3">{getSection('footer-menu-column3', 'title', 'Sütun 3')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Link Metni</label>
            <input
              type="text"
              value={formData.label || ''}
              onChange={e => setFormData({ ...formData, label: e.target.value })}
              placeholder="Akademi Ana Sayfası"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Link URL</label>
            <input
              type="text"
              value={formData.url || ''}
              onChange={e => setFormData({ ...formData, url: e.target.value })}
              placeholder="/"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs font-bold text-blue-600 mb-2">💡 İpucu</p>
            <p className="text-xs text-slate-600">
              Link sıralamasını değiştirmek için liste üzerindeki yukarı/aşağı ok butonlarını kullanın.
            </p>
          </div>
        </div>
      );
    }

    // Footer section form
    if (editingItem?.type === 'footer-section') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Footer Açıklaması</label>
            <textarea
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Türkiye'nin Öncü Eğitim Markası Olarak..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Copyright Metni</label>
            <input
              type="text"
              value={formData.copyright || ''}
              onChange={e => setFormData({ ...formData, copyright: e.target.value })}
              placeholder="Hocalara Geldik Akademi Grubu. Tüm hakları saklıdır."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs font-bold text-blue-600 mb-2">Bilgi</p>
            <p className="text-xs text-slate-600">
              İletişim bilgileri (telefon, email, adres) ve sosyal medya linkleri Ayarlar bölümünden düzenlenir.
            </p>
          </div>
        </div>
      );
    }

    // CTA section form
    if (editingItem?.type === 'cta-section') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Ana Başlık</label>
            <input
              type="text"
              value={formData.mainTitle || ''}
              onChange={e => setFormData({ ...formData, mainTitle: e.target.value })}
              placeholder="Geleceği El Birliğiyle İnşa Edelim."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Alt Başlık</label>
            <textarea
              value={formData.subtitle || ''}
              onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
              rows={3}
              placeholder="Akademik Hedeflerinize Ulaşmanız İçin..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-bold mb-2">Ana Görsel</label>
            <div className="space-y-3">
              {previewUrl && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-slate-200">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex items-center space-x-3">
                <label className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors border-2 border-dashed border-slate-300">
                  <Upload className="w-5 h-5 text-slate-600" />
                  <span className="text-sm font-bold text-slate-600">
                    {selectedFile ? selectedFile.name : 'Görsel Seç'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
                {previewUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl('');
                      setFormData({ ...formData, image: '' });
                    }}
                    className="px-4 py-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">Buton 1 Metni</label>
              <input
                type="text"
                value={formData.button1Text || ''}
                onChange={e => setFormData({ ...formData, button1Text: e.target.value })}
                placeholder="Hemen Kayıt Başvurusu"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Buton 1 Linki</label>
              <input
                type="text"
                value={formData.button1Link || ''}
                onChange={e => setFormData({ ...formData, button1Link: e.target.value })}
                placeholder="/iletisim"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">Buton 2 Metni</label>
              <input
                type="text"
                value={formData.button2Text || ''}
                onChange={e => setFormData({ ...formData, button2Text: e.target.value })}
                placeholder="Akademik Şubemiz Olun"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Buton 2 Linki</label>
              <input
                type="text"
                value={formData.button2Link || ''}
                onChange={e => setFormData({ ...formData, button2Link: e.target.value })}
                placeholder="/franchise"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Badge Metni</label>
            <input
              type="text"
              value={formData.badge || ''}
              onChange={e => setFormData({ ...formData, badge: e.target.value })}
              placeholder="Sıradaki Başarı Öyküsü..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Soru</label>
            <input
              type="text"
              value={formData.question || ''}
              onChange={e => setFormData({ ...formData, question: e.target.value })}
              placeholder="Neden Sizin Başarı Hikayeniz Olmasın?"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Testimonial</label>
            <input
              type="text"
              value={formData.testimonial || ''}
              onChange={e => setFormData({ ...formData, testimonial: e.target.value })}
              placeholder="81 Şehirde Binlerce Öğrenci Geleceğine Güvenle Hazırlanıyor."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
        </div>
      );
    }

    // Packages header form
    if (editingItem?.type === 'packages-header') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Üst Başlık</label>
            <input
              type="text"
              value={formData.topTitle || ''}
              onChange={e => setFormData({ ...formData, topTitle: e.target.value })}
              placeholder="EĞİTİM PAKETLERİMİZ"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Ana Başlık</label>
            <input
              type="text"
              value={formData.mainTitle || ''}
              onChange={e => setFormData({ ...formData, mainTitle: e.target.value })}
              placeholder="Size Uygun Paketi Seçin"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Açıklama</label>
            <textarea
              value={formData.subtitle || ''}
              onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
              rows={3}
              placeholder="İhtiyacınıza uygun eğitim paketi ile akademik hedeflerinize ulaşın."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">Buton Metni</label>
              <input
                type="text"
                value={formData.buttonText || ''}
                onChange={e => setFormData({ ...formData, buttonText: e.target.value })}
                placeholder="Tüm Paketleri İncele"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Buton Linki</label>
              <input
                type="text"
                value={formData.buttonLink || ''}
                onChange={e => setFormData({ ...formData, buttonLink: e.target.value })}
                placeholder="/paketler"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>
        </div>
      );
    }

    // Tools header form
    if (editingItem?.type === 'tools-header') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Üst Başlık</label>
            <input
              type="text"
              value={formData.topTitle || ''}
              onChange={e => setFormData({ ...formData, topTitle: e.target.value })}
              placeholder="ÇALIŞMA ARAÇLARI"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Ana Başlık</label>
            <input
              type="text"
              value={formData.mainTitle || ''}
              onChange={e => setFormData({ ...formData, mainTitle: e.target.value })}
              placeholder="Sınav Geri Sayımı ve Pomodoro"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Açıklama</label>
            <textarea
              value={formData.subtitle || ''}
              onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
              rows={3}
              placeholder="Sınavınıza kalan süreyi takip edin ve Pomodoro tekniği ile verimli çalışma seansları oluşturun."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div className="border-t pt-4">
            <h3 className="text-sm font-bold mb-3 text-slate-700">Alt Başlıklar</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-2 text-slate-600">Geri Sayım Başlığı</label>
                <input
                  type="text"
                  value={formData.countdownTitle || ''}
                  onChange={e => setFormData({ ...formData, countdownTitle: e.target.value })}
                  placeholder="Sınava Kalan Süre"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-2 text-slate-600">Pomodoro Başlığı</label>
                <input
                  type="text"
                  value={formData.pomodoroTitle || ''}
                  onChange={e => setFormData({ ...formData, pomodoroTitle: e.target.value })}
                  placeholder="Pomodoro Zamanlayıcı"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Exam Date form
    if (editingItem?.type === 'exam-date') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Sınav</label>
            <input
              type="text"
              value={formData.examName || ''}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-slate-50 text-slate-600 font-bold"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Tarih ve Saat</label>
            <input
              type="datetime-local"
              value={formData.examDate || ''}
              onChange={e => setFormData({ ...formData, examDate: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
            <p className="text-xs text-slate-500 mt-1">Sınav tarihini ve saatini seçin</p>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Açıklama (Opsiyonel)</label>
            <textarea
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              placeholder="Sınav hakkında ek bilgi..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'sliders':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Başlık</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Alt Başlık</label>
              <input
                type="text"
                value={formData.subtitle || ''}
                onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
              />
            </div>
            
            {/* File Upload */}
            <div>
              <label className="block text-sm font-bold mb-2">Görsel</label>
              <div className="space-y-3">
                {previewUrl && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-slate-200">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <label className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors border-2 border-dashed border-slate-300">
                    <Upload className="w-5 h-5 text-slate-600" />
                    <span className="text-sm font-bold text-slate-600">
                      {selectedFile ? selectedFile.name : 'Dosya Seç'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                  {previewUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl('');
                        setFormData({ ...formData, image: '' });
                      }}
                      className="px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-bold transition-colors"
                    >
                      Temizle
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-500">veya URL girin:</p>
                <input
                  type="text"
                  value={formData.image || ''}
                  onChange={e => {
                    setFormData({ ...formData, image: e.target.value });
                    setPreviewUrl(e.target.value);
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue text-sm"
                />
              </div>
            </div>

            {/* Primary Button */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-bold mb-3 text-slate-700">Birinci Buton</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-2 text-slate-600">Buton Metni</label>
                  <input
                    type="text"
                    value={formData.primaryButtonText || ''}
                    onChange={e => setFormData({ ...formData, primaryButtonText: e.target.value })}
                    placeholder="Hemen Eğitime Başla"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2 text-slate-600">Buton Linki</label>
                  <input
                    type="text"
                    value={formData.primaryButtonLink || ''}
                    onChange={e => setFormData({ ...formData, primaryButtonLink: e.target.value })}
                    placeholder="/hakkimizda"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>
            </div>

            {/* Secondary Button */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-bold mb-3 text-slate-700">İkinci Buton</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-2 text-slate-600">Buton Metni</label>
                  <input
                    type="text"
                    value={formData.secondaryButtonText || ''}
                    onChange={e => setFormData({ ...formData, secondaryButtonText: e.target.value })}
                    placeholder="Yeni Şubemiz Olun"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2 text-slate-600">Buton Linki</label>
                  <input
                    type="text"
                    value={formData.secondaryButtonLink || ''}
                    onChange={e => setFormData({ ...formData, secondaryButtonLink: e.target.value })}
                    placeholder="/franchise"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div>
                <label className="block text-sm font-bold mb-2">Hedef</label>
                <select
                  value={formData.target || 'main'}
                  onChange={e => setFormData({ ...formData, target: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                >
                  <option value="main">Ana Sayfa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Sıra</label>
                <input
                  type="number"
                  value={formData.order || 0}
                  onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>
          </div>
        );

      case 'bannerCards':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Emoji</label>
                <input
                  type="text"
                  value={formData.icon || ''}
                  onChange={e => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="📄 (Emoji yapıştırın)"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue text-2xl text-center"
                  maxLength={2}
                />
                <p className="text-xs text-slate-500 mt-1">Windows: Win + . | Mac: Cmd + Ctrl + Space</p>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Sıra</label>
                <input
                  type="number"
                  value={formData.order || 0}
                  onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Başlık</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="Franchise Başvuru"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Açıklama</label>
              <textarea
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                placeholder="Hocalara Geldik Ailesine Katılın"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Link</label>
                <input
                  type="text"
                  value={formData.link || ''}
                  onChange={e => setFormData({ ...formData, link: e.target.value })}
                  placeholder="/franchise"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Buton Metni</label>
                <input
                  type="text"
                  value={formData.buttonText || ''}
                  onChange={e => setFormData({ ...formData, buttonText: e.target.value })}
                  placeholder="DETAYLI BİLGİ"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>
            
            {/* Color Palette */}
            <div>
              <label className="block text-sm font-bold mb-3">Renk Seçin</label>
              <div className="grid grid-cols-6 gap-3">
                {[
                  { name: 'Mavi', bg: 'bg-[#3b82f6]', hover: 'hover:bg-[#2563eb]', preview: '#3b82f6' },
                  { name: 'Mor', bg: 'bg-[#a855f7]', hover: 'hover:bg-[#9333ea]', preview: '#a855f7' },
                  { name: 'Pembe', bg: 'bg-[#ec4899]', hover: 'hover:bg-[#db2777]', preview: '#ec4899' },
                  { name: 'Turuncu', bg: 'bg-[#f97316]', hover: 'hover:bg-[#ea580c]', preview: '#f97316' },
                  { name: 'Kırmızı', bg: 'bg-red-600', hover: 'hover:bg-red-700', preview: '#dc2626' },
                  { name: 'Yeşil', bg: 'bg-[#10b981]', hover: 'hover:bg-[#059669]', preview: '#10b981' },
                  { name: 'Cyan', bg: 'bg-[#06b6d4]', hover: 'hover:bg-[#0891b2]', preview: '#06b6d4' },
                  { name: 'İndigo', bg: 'bg-[#6366f1]', hover: 'hover:bg-[#4f46e5]', preview: '#6366f1' },
                  { name: 'Sarı', bg: 'bg-[#eab308]', hover: 'hover:bg-[#ca8a04]', preview: '#eab308' },
                  { name: 'Teal', bg: 'bg-[#14b8a6]', hover: 'hover:bg-[#0d9488]', preview: '#14b8a6' },
                  { name: 'Gri', bg: 'bg-[#6b7280]', hover: 'hover:bg-[#4b5563]', preview: '#6b7280' },
                  { name: 'Lacivert', bg: 'bg-[#1e40af]', hover: 'hover:bg-[#1e3a8a]', preview: '#1e40af' },
                ].map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, bgColor: color.bg, hoverColor: color.hover })}
                    className={`relative h-16 rounded-lg ${color.bg} hover:scale-110 transition-all shadow-lg ${
                      formData.bgColor === color.bg ? 'ring-4 ring-brand-blue ring-offset-2' : ''
                    }`}
                    title={color.name}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold opacity-0 hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
              {formData.bgColor && (
                <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600">
                    <span className="font-bold">Seçili:</span> {formData.bgColor}
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 'statistics':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Değer</label>
                <input
                  type="text"
                  value={formData.value || ''}
                  onChange={e => setFormData({ ...formData, value: e.target.value })}
                  placeholder="81"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Etiket</label>
                <input
                  type="text"
                  value={formData.label || ''}
                  onChange={e => setFormData({ ...formData, label: e.target.value })}
                  placeholder="İl"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Emoji</label>
                <input
                  type="text"
                  value={formData.icon || ''}
                  onChange={e => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="🏛️"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue text-2xl text-center"
                  maxLength={2}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Sıra</label>
                <input
                  type="number"
                  value={formData.order || 0}
                  onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>
          </div>
        );

      case 'packages':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Paket Adı</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="TYT Hazırlık Paketi"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Kısa Açıklama</label>
              <textarea
                value={formData.shortDescription || ''}
                onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
                rows={2}
                placeholder="TYT sınavına hazırlık için kapsamlı eğitim paketi"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Fiyat (₺)</label>
                <input
                  type="number"
                  value={formData.price || ''}
                  onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  placeholder="2500"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Eski Fiyat (₺)</label>
                <input
                  type="number"
                  value={formData.originalPrice || ''}
                  onChange={e => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) })}
                  placeholder="3500"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Video Sayısı</label>
              <input
                type="number"
                value={formData.videoCount || ''}
                onChange={e => setFormData({ ...formData, videoCount: parseInt(e.target.value) })}
                placeholder="150"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
              />
            </div>
            
            {/* File Upload */}
            <div>
              <label className="block text-sm font-bold mb-2">Görsel</label>
              <div className="space-y-3">
                {previewUrl && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-slate-200">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <label className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors border-2 border-dashed border-slate-300">
                    <Upload className="w-5 h-5 text-slate-600" />
                    <span className="text-sm font-bold text-slate-600">
                      {selectedFile ? selectedFile.name : 'Dosya Seç'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                  {previewUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl('');
                        setFormData({ ...formData, image: '' });
                      }}
                      className="px-4 py-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'digital':
      case 'global':
      case 'features':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Başlık</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="Öğrenci Paneli"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Açıklama</label>
              <textarea
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                placeholder="Kişiye özel ders programı, performans takibi..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Emoji</label>
              <input
                type="text"
                value={formData.icon || ''}
                onChange={e => setFormData({ ...formData, icon: e.target.value })}
                placeholder="💻"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue text-2xl text-center"
                maxLength={2}
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Alt Özellikler (Her satıra bir özellik)</label>
              <textarea
                value={Array.isArray(formData.features) ? formData.features.join('\n') : (formData.features || '')}
                onChange={e => {
                  const lines = e.target.value.split('\n').filter(f => f.trim());
                  setFormData({ ...formData, features: lines });
                }}
                rows={4}
                placeholder="Ders Programı&#10;Sınav Sonuçları&#10;İlerleme Grafikleri"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue font-mono text-sm"
              />
              <p className="text-xs text-slate-500 mt-1">Her satıra bir özellik yazın</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Bölüm</label>
                <select
                  value={formData.section || ''}
                  onChange={e => setFormData({ ...formData, section: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                >
                  <option value="">Seçin</option>
                  <option value="centers">Başarı Merkezleri</option>
                  <option value="digital">Dijital Platform</option>
                  <option value="global">Yurt Dışı</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Sıra</label>
                <input
                  type="number"
                  value={formData.order || 0}
                  onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>
          </div>
        );

      case 'youtube':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Kanal Adı</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Hocalara Geldik"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Açıklama</label>
              <textarea
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                placeholder="Ana kanalımızda tüm derslerin konu anlatımları ve soru çözümleri yer alıyor."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Kanal URL</label>
              <input
                type="text"
                value={formData.url || ''}
                onChange={e => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://youtube.com/@hocalarageldik"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
              />
            </div>
            
            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-bold mb-2">Thumbnail Görseli</label>
              <div className="space-y-3">
                {previewUrl && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-slate-200">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <label className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors border-2 border-dashed border-slate-300">
                    <Upload className="w-5 h-5 text-slate-600" />
                    <span className="text-sm font-bold text-slate-600">
                      {selectedFile ? selectedFile.name : 'Dosya Seç'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                  {previewUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl('');
                        setFormData({ ...formData, thumbnail: '' });
                      }}
                      className="px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-bold transition-colors"
                    >
                      Temizle
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-500">veya URL girin:</p>
                <input
                  type="text"
                  value={formData.thumbnail || ''}
                  onChange={e => {
                    setFormData({ ...formData, thumbnail: e.target.value });
                    setPreviewUrl(e.target.value);
                  }}
                  placeholder="https://example.com/thumbnail.jpg"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Abone Sayısı</label>
                <input
                  type="text"
                  value={formData.subscribers || ''}
                  onChange={e => setFormData({ ...formData, subscribers: e.target.value })}
                  placeholder="1M+"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Video Sayısı</label>
                <input
                  type="text"
                  value={formData.videoCount || ''}
                  onChange={e => setFormData({ ...formData, videoCount: e.target.value })}
                  placeholder="5000+"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Sıra</label>
                <input
                  type="number"
                  value={formData.order || 0}
                  onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert */}
      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => {}}
        />
      )}
      
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-brand-blue text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              activeTab === tab.id ? 'bg-white/20' : 'bg-slate-100'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Add Button */}
      <div className="flex justify-end">
        <button
          onClick={() => handleAdd(activeTab)}
          className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Yeni Ekle</span>
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        {renderContent()}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-black text-brand-dark">
                {editingItem ? 'Düzenle' : 'Yeni Ekle'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {renderForm()}
            </div>

            <div className="p-6 border-t border-slate-100 flex items-center justify-end space-x-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-slate-200 text-slate-600 rounded-lg font-bold hover:bg-slate-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                disabled={uploading}
                className="flex items-center space-x-2 px-6 py-2 bg-brand-blue text-white rounded-lg font-bold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Yükleniyor...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Kaydet</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
