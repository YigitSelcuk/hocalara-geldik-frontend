import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  MapPin,
  Star,
  School,
  Globe,
  GraduationCap,
  MessageCircle,
  Laptop,
  Video,
  Database,
  ChevronRight,
  Phone,
  Zap,
  Award,
  Clock,
  BookOpen,
  TrendingUp,
  Target,
  Brain,
  Sparkles,
  CheckCircle2,
  Youtube,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  FileText,
  Calendar,
  Timer
} from 'lucide-react';

import {
  sliderService, packageService
} from '../services/cms.service';
import {
  bannerCardService, statisticService, featureService,
  blogPostService, socialMediaService,
  youtubeChannelService, homeSectionService
} from '../services/homepage.service';
import {
  SliderItem, BannerCard, Statistic, Feature, BlogPost,
  SocialMedia, YouTubeChannel, HomeSection,
  EducationPackage
} from '../types';
import CountdownTimer from '../components/CountdownTimer';
import PomodoroTimer from '../components/PomodoroTimer';
import { API_BASE_URL } from '../services/api';

const MainHome: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');

  // --- DYNAMIC DATA STATE ---
  const [sliders, setSliders] = useState<SliderItem[]>([]);
  const [bannerCards, setBannerCards] = useState<BannerCard[]>([]);
  const [homeSections, setHomeSections] = useState<HomeSection[]>([]);
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [youtubeChannels, setYoutubeChannels] = useState<YouTubeChannel[]>([]);
  const [socialMedia, setSocialMedia] = useState<Record<string, string>>({});
  const [packages, setPackages] = useState<EducationPackage[]>([]);

  // Get style parameter from URL (HashRouter)
  const getStyle = () => {
    const hash = window.location.hash;
    const urlParams = new URLSearchParams(hash.split('?')[1] || '');
    return urlParams.get('style') || '1';
  };

  const style = getStyle();
  const isStyle2 = style === '2';

  const IconMap: { [key: string]: any } = {
    FileText, GraduationCap, School, Laptop, Video, Users, MapPin, Target, BookOpen, Brain, Phone, Youtube, Instagram, Twitter, Facebook, Linkedin, Zap, TrendingUp, Sparkles, Award, Clock, Star, MessageCircle, Database
  };

  // Helper function to get section content
  const getSection = (section: string, field: 'title' | 'subtitle' | 'description' | 'buttonText' | 'buttonLink', defaultValue: string = '') => {
    const content = homeSections.find(s => s.section === section);
    return content?.[field] || defaultValue;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          slidersRes, bannerCardsRes, homeSectionsRes,
          statisticsRes, featuresRes, blogPostsRes,
          youtubeRes, socialRes, packagesRes
        ] = await Promise.allSettled([
          sliderService.getAll(),
          bannerCardService.getAll(),
          homeSectionService.getAll(),
          statisticService.getAll(),
          featureService.getAll(),
          blogPostService.getAll(),
          youtubeChannelService.getAll(),
          socialMediaService.getAll(),
          packageService.getAll()
        ]);

        setSliders(slidersRes.status === 'fulfilled' ? (slidersRes.value.data.sliders || []) : []);
        setBannerCards(bannerCardsRes.status === 'fulfilled' ? (bannerCardsRes.value.data.data || []) : []);
        setHomeSections(homeSectionsRes.status === 'fulfilled' ? (homeSectionsRes.value.data.data || []) : []);
        setStatistics(statisticsRes.status === 'fulfilled' ? (statisticsRes.value.data.data || []) : []);
        setFeatures(featuresRes.status === 'fulfilled' ? (featuresRes.value.data.data || []) : []);
        setBlogPosts(blogPostsRes.status === 'fulfilled' ? (blogPostsRes.value.data.data || []) : []);
        setYoutubeChannels(youtubeRes.status === 'fulfilled' ? (youtubeRes.value.data.data || []) : []);

        // Convert social media array to object for easier access
        if (socialRes.status === 'fulfilled' && socialRes.value.data.data) {
          const socialArray = socialRes.value.data.data;
          const socialObj = socialArray.reduce((acc: Record<string, string>, curr: SocialMedia) => {
            acc[curr.platform.toLowerCase()] = curr.url;
            return acc;
          }, {});
          setSocialMedia(socialObj);
        }

        setPackages(packagesRes.status === 'fulfilled' ? (packagesRes.value.data.packages || []) : []);
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (sliders.length > 0) {
      const sliderTimer = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % sliders.length);
      }, 8000);
      return () => clearInterval(sliderTimer);
    }
  }, [sliders]);

  const mainSliders = sliders.length > 0 ? sliders.filter(s => s.target === 'main') : [];


  // Style 2: Warm colors
  const primaryColor = isStyle2 ? 'bg-brand-warm-orange' : 'bg-brand-blue';
  const primaryColorText = isStyle2 ? 'text-brand-warm-orange' : 'text-brand-blue';
  const primaryColorBorder = isStyle2 ? 'border-brand-warm-orange' : 'border-brand-blue';
  const primaryColorHover = isStyle2 ? 'hover:bg-brand-warm-orange' : 'hover:bg-brand-blue';

  return (
    <div className="mesh-bg overflow-x-hidden">

      {/* 1. Hero Slider Section */}
      <section className="relative h-[600px] w-full overflow-hidden bg-brand-dark mx-auto" style={{ maxWidth: '1920px' }}>
        {mainSliders.map((slide, index) => {
          const Icon = (slide as any).key === 'hero' ? IconMap['Zap'] : null;
          const imageUrl = slide.image?.startsWith('http') ? slide.image : `${API_BASE_URL}${slide.image}`;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-[2000ms] ease-out ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}
            >
              <div className="absolute inset-0 z-0">
                <img src={imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent"></div>
              </div>

              <div className="relative z-10 h-full max-w-[1600px] mx-auto px-12 flex flex-col justify-center">
                <div className="max-w-4xl space-y-6">
                  <div className={`inline-flex items-center space-x-4 px-6 py-2.5 ${isStyle2 ? 'bg-brand-warm-orange/20 border-brand-warm-orange/30 text-brand-warm-orange' : 'bg-brand-blue/20 border-brand-blue/30 text-brand-blue'} backdrop-blur-xl rounded-2xl border text-[12px] font-black tracking-widest transition-all duration-1000 delay-300 ${index === currentSlide ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}>
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{slide.subtitle || getSection('hero-subtitle', 'subtitle', 'Geleceğin Eğitim Vizyonu Burada')}</span>
                  </div>

                  <h1 className={`text-6xl md:text-[90px] font-black text-white leading-[0.9] tracking-tighter transition-all duration-1000 delay-500 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                    {slide.title.split(' ').map((word, i) => (
                      <span key={i} className={i >= 2 ? `${isStyle2 ? 'text-brand-warm-orange' : 'text-brand-blue'} italic` : ''}>{word} </span>
                    ))}
                  </h1>

                  <div className={`flex flex-wrap gap-5 pt-6 transition-all duration-1000 delay-900 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    {(slide.primaryButtonText || slide.primaryButtonLink) && (
                      <Link 
                        to={slide.primaryButtonLink || slide.link || '#'} 
                        className={`px-12 py-5 ${isStyle2 ? 'bg-brand-warm-orange shadow-brand-warm-orange/40 hover:shadow-brand-warm-orange/60' : 'bg-brand-blue shadow-brand-blue/40 hover:shadow-brand-blue/60'} text-white font-black rounded-2xl transition-all duration-300 shadow-2xl hover:scale-105 hover:-translate-y-1 text-[13px] tracking-wide group`}
                      >
                        <span className="flex items-center space-x-2">
                          <span>{slide.primaryButtonText || 'Hemen Eğitime Başla'}</span>
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Link>
                    )}
                    {(slide.secondaryButtonText || slide.secondaryButtonLink) && (
                      <Link 
                        to={slide.secondaryButtonLink || '/franchise'} 
                        className="px-12 py-5 bg-white/10 backdrop-blur-md text-white border border-white/20 font-black rounded-2xl hover:bg-white hover:text-brand-dark hover:border-white transition-all duration-300 hover:scale-105 hover:-translate-y-1 text-[13px] tracking-wide group"
                      >
                        <span className="flex items-center space-x-2">
                          <span>{slide.secondaryButtonText || 'Yeni Şubemiz Olun'}</span>
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Controls - Vertical Dots on Right */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-[40] flex flex-col items-center space-y-4">
          {mainSliders.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 transition-all duration-500 rounded-full hover:w-2.5 ${i === currentSlide ? `h-10 ${isStyle2 ? 'bg-brand-warm-orange shadow-brand-warm-orange/50' : 'bg-brand-blue shadow-brand-blue/50'} shadow-lg` : 'h-3 bg-white/30 hover:bg-white/50'}`}
            />
          ))}
        </div>
      </section>

      {/* 2. Banner Kartları - Slider Üstüne Binme */}
      <section className="relative z-30 -mt-20 pb-16">
        <div className="max-w-[1600px] mx-auto px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
            {bannerCards.sort((a, b) => a.order - b.order).map((item) => {
              const bgColorClass = item.bgColor || 'bg-brand-blue';
              const buttonText = item.buttonText || 'DETAYLI BİLGİ';

              return (
                <Link
                  key={item.id}
                  to={item.link}
                  className={`group ${bgColorClass} rounded-[20px] p-6 shadow-2xl hover:-translate-y-3 transition-all duration-500 flex flex-col text-white relative overflow-hidden h-full min-h-[160px]`}
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 text-2xl">
                      {item.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-[17px] font-black mb-1 leading-tight tracking-tight">{item.title}</h3>
                      <p className="text-[11px] font-bold text-white/90 leading-tight">{item.description}</p>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-wider text-white/80 group-hover:text-white transition-colors">
                    <span>{buttonText}</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      {/* 3. Başarı Merkezleri Sistemi Tanıtımı */}
      {(() => {
        const section = homeSections.find(s => s.section === 'centers-title') || {};
        const sectionFeatures = features.filter(f => f.section === 'centers').length > 0
          ? features.filter(f => f.section === 'centers')
          : [
            { id: '1', title: getSection('centers-feature-1', 'title', 'Merkezi Eğitim Sistemi ile Standart Kalite') },
            { id: '2', title: getSection('centers-feature-2', 'title', 'Her Şubede Uzman Öğretmen Kadrosu') },
            { id: '3', title: getSection('centers-feature-3', 'title', 'Modern Derslik ve Laboratuvar İmkanları') },
            { id: '4', title: getSection('centers-feature-4', 'title', 'Dijital Platform Entegrasyonu') },
            { id: '5', title: getSection('centers-feature-5', 'title', 'Veli Bilgilendirme ve Takip Sistemi') }
          ];

        return (
          <section className="py-32 bg-white relative overflow-hidden">
            <div className="max-w-[1600px] mx-auto px-12">
              <div className="grid lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-8">
                  <div className={`inline-flex items-center space-x-4 ${isStyle2 ? 'text-brand-warm-orange' : 'text-brand-blue'} font-black tracking-[0.4em] text-[12px]`}>
                    <School className="w-6 h-6" />
                    <span>{getSection('centers-top-title', 'title', 'BAŞARI MERKEZLERİMİZ')}</span>
                  </div>
                  <h2 className="text-6xl md:text-7xl font-black text-brand-dark tracking-tighter leading-none">
                    {getSection('centers-title', 'title', "Türkiye'nin En Büyük Eğitim Ağı").split('En Büyük').map((part, index) => (
                      <React.Fragment key={index}>
                        {part}
                        {index === 0 && <span className={isStyle2 ? 'text-brand-warm-orange' : 'text-brand-blue'}>En Büyük</span>}
                      </React.Fragment>
                    ))}
                  </h2>
                  <p className="text-xl text-slate-600 font-medium leading-relaxed">
                    {getSection('centers-subtitle', 'subtitle', '81 ilde güçlü şube ağımız, modern eğitim altyapımız ve uzman kadromuzla öğrencilerimize en kaliteli eğitimi sunuyoruz.')}
                  </p>

                  <div className="space-y-4">
                    {sectionFeatures.map((f) => (
                      <div key={f.id} className="flex items-center space-x-4 group">
                        <div className={`w-8 h-8 ${primaryColor} rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-brand-dark font-bold">{f.title}</span>
                      </div>
                    ))}
                  </div>

                  <Link to={getSection('centers-button', 'buttonLink', '/subeler')} className={`inline-flex items-center space-x-3 px-10 py-5 ${primaryColor} text-white font-black rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300`}>
                    <span>{getSection('centers-button', 'buttonText', 'Şubelerimizi Keşfedin')}</span>
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {statistics.sort((a, b) => a.order - b.order).map((stat) => {
                    return (
                      <div key={stat.id} className={`bg-gradient-to-br ${isStyle2 ? 'from-orange-50 to-amber-50' : 'from-blue-50 to-purple-50'} rounded-[20px] p-8 text-center shadow-xl border border-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group`}>
                        <div className={`w-16 h-16 ${primaryColor} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all text-3xl`}>
                          {stat.icon}
                        </div>
                        <div className={`text-5xl font-black ${primaryColorText} mb-2`}>{stat.value}</div>
                        <div className="text-sm font-bold text-slate-600 uppercase tracking-wider">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* 4. Dijital Sistem Tanıtımı */}
      {(() => {
        const sectionFeatures = features.filter(f => f.section === 'digital').length > 0
          ? features.filter(f => f.section === 'digital')
          : [
            { id: 'd1', title: 'Öğrenci Paneli', description: 'Kişiye özel ders programı, performans takibi ve yapay zeka destekli analiz raporları', icon: 'Laptop', features: ['Ders Programı', 'Sınav Sonuçları', 'İlerleme Grafikleri'] },
            { id: 'd2', title: 'Veli Takip Sistemi', description: 'Çocuğunuzun akademik gelişimini anlık olarak takip edin ve raporlara erişin', icon: 'Users', features: ['Devam Takibi', 'Not Bildirimleri', 'Öğretmen Görüşmeleri'] },
            { id: 'd3', title: 'Mobil Uygulama', description: 'iOS ve Android uygulamalarımızla her yerden eğitime erişim imkanı', icon: 'Phone', features: ['Canlı Dersler', 'Video Arşivi', 'Soru Çözüm'] },
            { id: 'd4', title: 'Yapay Zeka Analizi', description: 'Öğrenme stilinize göre kişiselleştirilmiş içerik önerileri ve çalışma planı', icon: 'Brain', features: ['Eksik Analizi', 'Öneri Sistemi', 'Hedef Belirleme'] }
          ];

        return (
          <section className={`py-32 ${isStyle2 ? 'bg-gradient-to-b from-orange-50/50 to-white' : 'bg-gradient-to-b from-slate-50 to-white'}`}>
            <div className="max-w-[1600px] mx-auto px-12">
              <div className="text-center mb-16 space-y-6">
                <span className={`${primaryColorText} font-black tracking-[0.4em] text-[12px] uppercase`}>{getSection('digital-top-title', 'title', 'DİJİTAL EĞİTİM SİSTEMİ')}</span>
                <h2 className="text-5xl md:text-6xl font-black text-brand-dark tracking-tighter leading-none">
                  {getSection('digital-title', 'title', 'Yapay Zeka Destekli Eğitim Platformu').split('Eğitim Platformu').map((part, index) => (
                    <React.Fragment key={index}>
                      {part}
                      {index === 0 && <span className={isStyle2 ? 'text-brand-warm-orange' : 'text-brand-blue'}>Eğitim Platformu</span>}
                    </React.Fragment>
                  ))}
                </h2>
                <p className="text-xl text-slate-600 font-medium max-w-3xl mx-auto">
                  {getSection('digital-subtitle', 'subtitle', 'Öğrenciler ve veliler için geliştirdiğimiz dijital altyapı ile eğitim sürecini her adımda takip edin ve kişiselleştirilmiş öğrenme deneyimi yaşayın.')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {sectionFeatures.map((item) => {
                  const Icon = IconMap[item.icon] || Laptop;
                  return (
                    <div key={item.id} className="group bg-white rounded-[20px] p-8 shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                      <div className={`w-16 h-16 bg-gradient-to-br ${isStyle2 ? 'from-brand-warm-orange to-brand-warm-amber' : 'from-brand-blue to-purple-600'} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-black text-brand-dark mb-3">{item.title}</h3>
                      <p className="text-sm text-slate-600 font-medium mb-4 leading-relaxed">{item.description}</p>
                      <div className="space-y-2">
                        {item.features?.map((feature, j) => (
                          <div key={j} className="flex items-center space-x-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${primaryColor}`}></div>
                            <span className="text-xs font-bold text-slate-500">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })()}

      {/* 5. Hocalara Geldik Yurt Dışı */}
      {(() => {
        const sectionFeatures = features.filter(f => f.section === 'global').length > 0
          ? features.filter(f => f.section === 'global')
          : [
            { id: 'g1', title: 'Yurt Dışı Danışmanlık', description: 'Üniversite seçiminden vize sürecine kadar tüm aşamalarda profesyonel destek', icon: 'Target', features: ['Üniversite Seçimi', 'Başvuru Süreci', 'Vize Danışmanlığı', 'Burs İmkanları'] },
            { id: 'g2', title: 'Dil Eğititi', description: 'TOEFL, IELTS, SAT ve diğer uluslararası sınavlara hazırlık programları', icon: 'BookOpen', features: ['TOEFL Hazırlık', 'IELTS Kursu', 'SAT Eğitimi', 'Akademik İngilizce'] },
            { id: 'g3', title: 'Üniversite Yerleştirme', description: 'ABD, İngiltere, Kanada ve Avrupa üniversitelerine başarılı yerleştirme', icon: 'GraduationCap', features: ['Profil Oluşturma', 'Essay Desteği', 'Mülakat Hazırlığı', 'Takip Sistemi'] }
          ];

        return (
          <section className="py-32 bg-white relative overflow-hidden">
            <div className="max-w-[1600px] mx-auto px-12">
              <div className="relative rounded-[20px] overflow-hidden mb-16 h-[400px]">
                <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1920" alt={getSection('global-title', 'title', 'Hocalara Geldik Yurt Dışı')} className="w-full h-full object-cover" />
                <div className={`absolute inset-0 bg-gradient-to-r ${isStyle2 ? 'from-brand-warm-orange/90 to-brand-warm-amber/90' : 'from-brand-blue/90 to-purple-600/90'}`}></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center space-y-6 px-12">
                  <Globe className="w-20 h-20" />
                  <h2 className="text-6xl font-black tracking-tighter">{getSection('global-title', 'title', 'Hocalara Geldik Yurt Dışı')}</h2>
                  <p className="text-2xl font-medium max-w-3xl">
                    {getSection('global-subtitle', 'subtitle', "Dünya'nın en prestijli üniversitelerine yerleşme hayalinizi gerçeğe dönüştürüyoruz")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {sectionFeatures.map((item) => {
                  const Icon = IconMap[item.icon] || Target;
                  return (
                    <div key={item.id} className={`bg-gradient-to-br ${isStyle2 ? 'from-orange-50 to-amber-50' : 'from-blue-50 to-purple-50'} rounded-[20px] p-10 shadow-xl border border-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group`}>
                      <div className={`w-20 h-20 ${primaryColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-black text-brand-dark mb-4">{item.title}</h3>
                      <p className="text-slate-600 font-medium mb-6 leading-relaxed">{item.description}</p>
                      <div className="space-y-3">
                        {item.features?.map((feature, j) => (
                          <div key={j} className="flex items-center space-x-3">
                            <CheckCircle2 className={`w-5 h-5 ${primaryColorText}`} />
                            <span className="text-sm font-bold text-slate-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })()}

      {/* 6. YouTube Kanalları ve Sosyal Medya */}
      <section className={`py-32 ${isStyle2 ? 'bg-gradient-to-b from-orange-50/50 to-white' : 'bg-gradient-to-b from-slate-50 to-white'}`}>
        <div className="max-w-[1600px] mx-auto px-12">
          <div className="text-center mb-16 space-y-6">
            <span className={`${primaryColorText} font-black tracking-[0.4em] text-[12px] uppercase`}>{getSection('youtube-top-title', 'title', 'DİJİTAL İÇERİKLERİMİZ')}</span>
            <h2 className="text-5xl md:text-6xl font-black text-brand-dark tracking-tighter leading-none">
              {getSection('youtube-title', 'title', 'YouTube Kanallarımız ve Sosyal Medya').split('Sosyal Medya').map((part, index) => (
                <React.Fragment key={index}>
                  {part}
                  {index === 0 && <span className={isStyle2 ? 'text-brand-warm-orange' : 'text-brand-blue'}>Sosyal Medya</span>}
                </React.Fragment>
              ))}
            </h2>
            <p className="text-xl text-slate-600 font-medium max-w-3xl mx-auto">
              {getSection('youtube-subtitle', 'subtitle', 'Binlerce ücretsiz ders videosu ve güncel içeriklerimiz için kanallarımıza abone olun, sosyal medyada bizi takip edin!')}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* YouTube Kanalları */}
            {(youtubeChannels.length > 0 ? youtubeChannels : [
              { id: 'y1', name: 'Hocalara Geldik', description: 'Ana kanalımızda tüm derslerin konu anlatımları ve soru çözümleri yer alıyor.', thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800', url: 'https://youtube.com/hocalarageldik', subscribers: '1M+', videoCount: '5000+' },
              { id: 'y2', name: 'Hocalara Geldik Rehberlik', description: 'Sınav stratejileri, motivasyon ve rehberlik videoları ile yanınızdayız.', thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800', url: 'https://youtube.com/hocalarageldikrehberlik', subscribers: '200K+', videoCount: '500+' },
              { id: 'y3', name: 'Hocalara Geldik Ortaokul', description: 'LGS hazırlık ve ortaokul ders içerikleri için özel kanalımız.', thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800', url: 'https://youtube.com/hocalarageldikortaokul', subscribers: '300K+', videoCount: '1000+' }
            ]).map((channel) => (
              <a
                key={channel.id}
                href={channel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-[20px] overflow-hidden shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={channel.thumbnail}
                    alt={channel.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Youtube className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-brand-dark mb-2 group-hover:text-red-600 transition-colors">{channel.name}</h3>
                  <p className="text-sm text-slate-600 font-medium mb-4">{channel.description}</p>
                  <div className="flex items-center justify-between text-sm font-bold text-slate-500">
                    <span>{channel.subscribers} Abone</span>
                    <span>{channel.videoCount} Video</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Sosyal Medya */}
          <div className="mt-16 bg-white rounded-[20px] p-12 shadow-xl border border-slate-100">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-black text-brand-dark mb-3">{getSection('youtube-social-title', 'title', 'Sosyal Medyada Bizi Takip Edin')}</h3>
              <p className="text-slate-600 font-medium">{getSection('youtube-social-subtitle', 'subtitle', 'Güncel duyurular, motivasyon içerikleri ve daha fazlası için sosyal medya hesaplarımızı takip edin!')}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {[
                { name: 'YouTube', icon: Youtube, url: socialMedia.youtube || 'https://youtube.com', color: 'hover:bg-red-600' },
                { name: 'Instagram', icon: Instagram, url: socialMedia.instagram || 'https://instagram.com', color: 'hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600' },
                { name: 'Twitter', icon: Twitter, url: socialMedia.twitter || 'https://twitter.com', color: 'hover:bg-blue-400' },
                { name: 'Facebook', icon: Facebook, url: socialMedia.facebook || 'https://facebook.com', color: 'hover:bg-blue-600' },
                { name: 'LinkedIn', icon: Linkedin, url: socialMedia.linkedin || 'https://linkedin.com', color: 'hover:bg-blue-700' }
              ].map((socialCode) => {
                const Icon = socialCode.icon;
                return (
                  <a
                    key={socialCode.name}
                    href={socialCode.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex flex-col items-center space-y-3 p-6 bg-slate-50 rounded-[20px] ${socialCode.color} hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                  >
                    <Icon className="w-12 h-12" />
                    <span className="font-black text-sm">{socialCode.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Rehberlik ve Blog Notları */}
      <section className="py-32 bg-white">
        <div className="max-w-[1600px] mx-auto px-12">
          <div className="text-center mb-16 space-y-6">
            <span className={`${primaryColorText} font-black tracking-[0.4em] text-[12px] uppercase`}>{getSection('blog-top-title', 'title', 'REHBERLİK VE İÇERİKLER')}</span>
            <h2 className="text-5xl md:text-6xl font-black text-brand-dark tracking-tighter leading-none">
              {getSection('blog-title', 'title', 'Rehberlik ve Blog Notları').split('Blog Notları').map((part, index) => (
                <React.Fragment key={index}>
                  {part}
                  {index === 0 && <span className={isStyle2 ? 'text-brand-warm-orange' : 'text-brand-blue'}>Blog Notları</span>}
                </React.Fragment>
              ))}
            </h2>
            <p className="text-xl text-slate-600 font-medium max-w-3xl mx-auto">
              {getSection('blog-subtitle', 'subtitle', 'Akademik ve psikolojik destek yazıları, sınav stratejileri ve motivasyon içerikleri ile başarıya giden yolda yanınızdayız.')}
            </p>
          </div>

          {/* Kategori Filtreleme */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <button
              onClick={() => setSelectedCategory('Tümü')}
              className={`px-6 py-3 rounded-xl font-black text-sm transition-all duration-300 ${selectedCategory === 'Tümü'
                ? `${primaryColor} text-white shadow-xl scale-105`
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              Tümü
            </button>
            {Array.from(new Set(blogPosts.map(p => p.category))).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-black text-sm transition-all duration-300 ${selectedCategory === category
                  ? `${primaryColor} text-white shadow-xl scale-105`
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(selectedCategory === 'Tümü' ? blogPosts : blogPosts.filter(p => p.category === selectedCategory)).slice(0, 6).map((post) => (
              <div key={post.id} className="group bg-white rounded-[20px] overflow-hidden shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-4 py-2 ${primaryColor} text-white rounded-xl text-xs font-black tracking-wider shadow-lg`}>
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-xs font-bold text-slate-400 mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <h3 className={`text-lg font-black text-brand-dark mb-3 line-clamp-2 ${isStyle2 ? 'group-hover:text-brand-warm-orange' : 'group-hover:text-brand-blue'} transition-colors`}>
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-600 font-medium line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-500">{post.author}</span>
                    <button className={`flex items-center space-x-2 text-xs font-black ${primaryColorText} group-hover:translate-x-2 transition-transform`}>
                      <span>Devamını Oku</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. TYT – AYT – LGS Puan Hesaplama Modülü */}
      <section className={`py-32 ${isStyle2 ? 'bg-gradient-to-br from-brand-warm-orange via-brand-warm-amber to-orange-600' : 'bg-gradient-to-br from-brand-blue via-purple-600 to-indigo-700'} relative overflow-hidden`}>
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
        </div>

        <div className="max-w-[1600px] mx-auto px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 text-white">
              <div className="inline-flex items-center space-x-3 bg-white/20 border-white/30 font-black capitalize text-xs tracking-widest backdrop-blur-xl px-6 py-3 rounded-xl border">
                <TrendingUp className="w-5 h-5" />
                <span>{getSection('calculator-badge', 'title', 'Puan Hesaplama Araçları')}</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">
                {getSection('calculator-title', 'title', 'Sınav Puanınızı Hesaplayın').split('Hesaplayın').map((part, index) => (
                  <React.Fragment key={index}>
                    {part}
                    {index === 0 && <span className="text-white/80 italic">Hesaplayın</span>}
                  </React.Fragment>
                ))}
              </h2>
              <p className="text-xl font-medium leading-relaxed text-white/90">
                {getSection('calculator-subtitle', 'subtitle', 'Net sayılarınızı girerek yaklaşık sınav puanınızı hesaplayabilir ve hedeflerinize ne kadar yakın olduğunuzu görebilirsiniz.')}
              </p>
              <Link
                to={getSection('calculator-button', 'buttonLink', '/hesaplama')}
                className="inline-flex items-center space-x-3 px-10 py-6 bg-white text-brand-dark hover:bg-white/90 font-black rounded-2xl transition-all duration-300 shadow-2xl hover:scale-105 group"
              >
                <span>{getSection('calculator-button', 'buttonText', 'Hesaplama Araçlarına Git')}</span>
                <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {[
                { type: 'TYT', section: 'calculator-tyt' },
                { type: 'AYT', section: 'calculator-ayt' },
                { type: 'LGS', section: 'calculator-lgs' }
              ].map((item) => (
                <Link
                  key={item.type}
                  to="/hesaplama"
                  className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 text-center hover:bg-white/20 hover:scale-105 transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-xl">
                    <TrendingUp className={`w-8 h-8 ${primaryColorText}`} />
                  </div>
                  <p className="text-2xl font-black text-white mb-2">{item.type}</p>
                  <p className="text-xs font-bold text-white/70 mt-2">{getSection(item.section, 'title', 'Puan Hesapla')}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. Sonraki Sınava Kalan Süre ve Pomodoro Modülü */}
      <section className={`py-32 ${isStyle2 ? 'bg-gradient-to-b from-orange-50/50 to-white' : 'bg-gradient-to-b from-slate-50 to-white'}`}>
        <div className="max-w-[1600px] mx-auto px-12">
          <div className="text-center mb-16 space-y-6">
            <span className={`${primaryColorText} font-black tracking-[0.4em] text-[12px] uppercase`}>{getSection('tools-top-title', 'title', 'ÇALIŞMA ARAÇLARI')}</span>
            <h2 className="text-5xl md:text-6xl font-black text-brand-dark tracking-tighter leading-none">
              {getSection('tools-title', 'title', 'Sınav Geri Sayımı ve Pomodoro').split('Pomodoro').map((part, index) => (
                <React.Fragment key={index}>
                  {part}
                  {index === 0 && <span className={isStyle2 ? 'text-brand-warm-orange' : 'text-brand-blue'}>Pomodoro</span>}
                </React.Fragment>
              ))}
            </h2>
            <p className="text-xl text-slate-600 font-medium max-w-3xl mx-auto">
              {getSection('tools-subtitle', 'subtitle', 'Sınavınıza kalan süreyi takip edin ve Pomodoro tekniği ile verimli çalışma seansları oluşturun.')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Geri Sayım */}
            <div className="bg-white rounded-[20px] p-12 shadow-2xl border border-slate-100">
              <div className="flex items-center space-x-3 mb-8">
                <Timer className={`w-8 h-8 ${primaryColorText}`} />
                <h3 className="text-2xl font-black text-brand-dark">{getSection('tools-countdown-title', 'title', 'Sınava Kalan Süre')}</h3>
              </div>
              <CountdownTimer isStyle2={isStyle2} />
            </div>

            {/* Pomodoro */}
            <div className="bg-white rounded-[20px] p-12 shadow-2xl border border-slate-100">
              <div className="flex items-center space-x-3 mb-8">
                <Clock className={`w-8 h-8 ${primaryColorText}`} />
                <h3 className="text-2xl font-black text-brand-dark">{getSection('tools-pomodoro-title', 'title', 'Pomodoro Zamanlayıcı')}</h3>
              </div>
              <PomodoroTimer isStyle2={isStyle2} />
            </div>
          </div>
        </div>
      </section>

      {/* 10. Paketlerimiz Modülü */}
      <section className="py-32 bg-white">
        <div className="max-w-[1600px] mx-auto px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-12">
            <div className="space-y-6">
              <span className={`${primaryColorText} font-black tracking-[0.4em] text-[12px]`}>{getSection('packages-top-title', 'title', 'EĞİTİM PAKETLERİMİZ')}</span>
              <h2 className="text-5xl md:text-6xl font-black text-brand-dark tracking-tighter leading-none">
                {getSection('packages-title', 'title', 'Size Uygun Paketi Seçin').split('Paketi Seçin').map((part, index) => (
                  <React.Fragment key={index}>
                    {part}
                    {index === 0 && <span className={isStyle2 ? 'text-brand-warm-orange' : 'text-brand-blue'}>Paketi Seçin</span>}
                  </React.Fragment>
                ))}
              </h2>
              <p className="text-xl text-slate-600 font-medium max-w-2xl">
                {getSection('packages-subtitle', 'subtitle', 'İhtiyacınıza uygun eğitim paketi ile akademik hedeflerinize ulaşın.')}
              </p>
            </div>
            <Link to={getSection('packages-button', 'buttonLink', '/paketler')} className={`group flex items-center space-x-3 text-brand-dark font-black tracking-widest text-[13px] bg-slate-100 px-10 py-5 rounded-2xl ${primaryColorHover} hover:text-white hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300`}>
              <span>{getSection('packages-button', 'buttonText', 'Tüm Paketleri İncele')}</span>
              <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.filter(p => (p as any).isPopular || true).slice(0, 3).map((pkg) => (
              <Link
                key={pkg.id}
                to="/paketler"
                className={`group bg-white rounded-[20px] overflow-hidden shadow-xl border-2 ${primaryColorBorder} hover:shadow-2xl hover:-translate-y-2 transition-all duration-500`}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute top-6 left-6 px-5 py-2 ${primaryColor} text-white rounded-xl text-xs font-black capitalize tracking-widest shadow-xl`}>
                    Popüler
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-black text-brand-dark mb-3">{pkg.name}</h3>
                  <p className="text-slate-600 font-medium text-sm mb-4 line-clamp-2">{pkg.shortDescription}</p>
                  <div className="flex items-baseline space-x-3 mb-4">
                    {pkg.price && (
                      <>
                        <span className="text-3xl font-black text-brand-dark">
                          {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(pkg.price)}
                        </span>
                        {pkg.originalPrice && (
                          <span className="text-lg font-bold text-slate-400 line-through">
                            {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(pkg.originalPrice)}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm font-bold text-slate-600 pt-4 border-t border-slate-100">
                    <Video className={`w-4 h-4 ${primaryColorText}`} />
                    <span>{pkg.videoCount?.toLocaleString()}+ Video</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 11. CTA Section (Mevcut - Korundu) */}
      <section className="py-48 px-12 bg-white overflow-hidden relative">
        <div className="max-w-[1600px] mx-auto grid lg:grid-cols-2 gap-32 items-center">
          <div className="relative">
            <div className={`absolute -left-32 -top-32 w-[600px] h-[600px] ${isStyle2 ? 'bg-brand-warm-orange/10' : 'bg-brand-blue/5'} rounded-full blur-[120px]`}></div>
            {(() => {
              const imageUrl = getSection('cta-image', 'buttonLink', '');
              const finalUrl = imageUrl 
                ? (imageUrl.startsWith('http') ? imageUrl : `${API_BASE_URL}${imageUrl}`)
                : "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop";
              return <img src={finalUrl} className="rounded-[20px] shadow-2xl relative z-10" alt="CTA" />;
            })()}
            <div className={`absolute -bottom-16 -right-16 glass-panel p-12 rounded-[20px] shadow-2xl z-20 border ${isStyle2 ? 'border-orange-200' : 'border-brand-blue/20'}`}>
              <p className="text-slate-400 text-[11px] font-black tracking-widest mb-6 capitalize">{getSection('cta-badge', 'title', 'Sıradaki Başarı Öyküsü...')}</p>
              <h4 className="text-4xl font-black text-brand-dark tracking-tighter leading-tight italic">{getSection('cta-question', 'title', 'Neden Sizin Başarı Hikayeniz Olmasın?').split('Başarı Hikayeniz').map((part, index) => (
                <React.Fragment key={index}>
                  {part}
                  {index === 0 && <><br /> <span className={isStyle2 ? 'text-brand-warm-orange' : 'text-brand-blue'}>Başarı Hikayeniz</span></>}
                </React.Fragment>
              ))}</h4>
            </div>
          </div>

          <div className="space-y-16">
            <div className="space-y-10">
              <h2 className="text-7xl font-black text-brand-dark tracking-tighter leading-none italic">{getSection('cta-main-title', 'title', 'Geleceği El Birliğiyle İnşa Edelim.').split('İnşa Edelim.').map((part, index) => (
                <React.Fragment key={index}>
                  {part}
                  {index === 0 && <><br /> El Birliğiyle <span className={isStyle2 ? 'text-brand-warm-orange' : 'text-brand-blue'}>İnşa Edelim.</span></>}
                </React.Fragment>
              ))}</h2>
              <p className="text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl">
                {getSection('cta-description', 'description', 'Akademik Hedeflerinize Ulaşmanız İçin Uzman Kadromuz, Modern Eğitim Materyallerimiz Ve Dijital Çözümlerimizle Yanınızdayız.')}
              </p>
            </div>
            <div className="flex flex-wrap gap-8 pt-6">
              <Link to={getSection('cta-button-primary', 'buttonLink', '/subeler')} className={`px-16 py-7 bg-brand-dark text-white font-black rounded-2xl ${isStyle2 ? 'hover:bg-brand-warm-orange hover:shadow-brand-warm-orange/40' : 'hover:bg-brand-blue hover:shadow-brand-blue/40'} transition-all duration-300 shadow-2xl hover:scale-105 hover:-translate-y-1 text-[14px] group`}>
                <span className="flex items-center space-x-3">
                  <span>{getSection('cta-button-primary', 'buttonText', 'Hemen Kayıt Başvurusu')}</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link to={getSection('cta-button-secondary', 'buttonLink', '/franchise')} className="px-16 py-7 border-2 border-brand-dark text-brand-dark font-black rounded-2xl hover:bg-brand-dark hover:text-white hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 text-[14px] group">
                <span className="flex items-center space-x-3">
                  <span>{getSection('cta-button-secondary', 'buttonText', 'Akademik Şubemiz Olun')}</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-8 pt-12 border-t border-slate-100">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4, 5].map(i => <img key={i} src={`https://i.pravatar.cc/100?u=${i + 30}`} className="w-14 h-14 rounded-full border-4 border-white shadow-lg" alt="Student" />)}
              </div>
              <p className="text-sm font-bold text-slate-400 italic">{getSection('cta-testimonial', 'description', '81 Şehirde Binlerce Öğrenci Geleceğine Güvenle Hazırlanıyor.')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainHome;
