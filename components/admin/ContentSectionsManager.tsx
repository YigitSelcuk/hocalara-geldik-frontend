import { useState } from 'react';
import { PageContentManager } from './PageContentManager';
import { HomePageManager } from './HomePageManager';
import { 
  Home, Building2, GraduationCap, Package, Video, 
  Users, Trophy, Globe, Briefcase, Phone, 
  Calculator, BookOpen, Newspaper, MapPin
} from 'lucide-react';

// Sayfa yapılandırmaları
const PAGE_CONFIGS = {
  home: {
    name: 'home',
    title: 'Anasayfa',
    icon: Home,
    sections: [
      { section: 'hero-subtitle', title: 'Hero - Alt Başlık', fields: ['subtitle'] },
      { section: 'hero-button-primary', title: 'Hero - Ana Buton', fields: ['buttonText', 'buttonLink'] },
      { section: 'hero-button-secondary', title: 'Hero - İkinci Buton', fields: ['buttonText', 'buttonLink'] },
      
      { section: 'banner-card-1', title: 'Banner Kart 1 - Franchise', fields: ['title', 'description'] },
      { section: 'banner-card-2', title: 'Banner Kart 2 - Kayıt', fields: ['title', 'description'] },
      { section: 'banner-card-3', title: 'Banner Kart 3 - Başarı Merkezleri', fields: ['title', 'description'] },
      { section: 'banner-card-4', title: 'Banner Kart 4 - Dijital Platform', fields: ['title', 'description'] },
      { section: 'banner-card-5', title: 'Banner Kart 5 - YouTube', fields: ['title', 'description', 'subtitle'] },
      
      { section: 'centers-top-title', title: 'Başarı Merkezleri - Üst Başlık', fields: ['title'] },
      { section: 'centers-title', title: 'Başarı Merkezleri - Ana Başlık', fields: ['title'] },
      { section: 'centers-subtitle', title: 'Başarı Merkezleri - Alt Başlık', fields: ['subtitle'] },
      { section: 'centers-button', title: 'Başarı Merkezleri - Buton', fields: ['buttonText', 'buttonLink'] },
      { section: 'centers-feature-1', title: 'Başarı Merkezleri - Özellik 1', fields: ['title'] },
      { section: 'centers-feature-2', title: 'Başarı Merkezleri - Özellik 2', fields: ['title'] },
      { section: 'centers-feature-3', title: 'Başarı Merkezleri - Özellik 3', fields: ['title'] },
      { section: 'centers-feature-4', title: 'Başarı Merkezleri - Özellik 4', fields: ['title'] },
      { section: 'centers-feature-5', title: 'Başarı Merkezleri - Özellik 5', fields: ['title'] },
      
      { section: 'digital-top-title', title: 'Dijital Platform - Üst Başlık', fields: ['title'] },
      { section: 'digital-title', title: 'Dijital Platform - Ana Başlık', fields: ['title'] },
      { section: 'digital-subtitle', title: 'Dijital Platform - Alt Başlık', fields: ['subtitle'] },
      
      { section: 'youtube-top-title', title: 'YouTube - Üst Başlık', fields: ['title'] },
      { section: 'youtube-title', title: 'YouTube - Ana Başlık', fields: ['title'] },
      { section: 'youtube-subtitle', title: 'YouTube - Alt Başlık', fields: ['subtitle'] },
      
      { section: 'blog-top-title', title: 'Blog - Üst Başlık', fields: ['title'] },
      { section: 'blog-title', title: 'Blog - Ana Başlık', fields: ['title'] },
      { section: 'blog-subtitle', title: 'Blog - Alt Başlık', fields: ['subtitle'] },
      
      { section: 'calculator-badge', title: 'Hesaplama - Badge', fields: ['title'] },
      { section: 'calculator-title', title: 'Hesaplama - Ana Başlık', fields: ['title'] },
      { section: 'calculator-subtitle', title: 'Hesaplama - Alt Başlık', fields: ['subtitle'] },
      { section: 'calculator-button', title: 'Hesaplama - Buton', fields: ['buttonText', 'buttonLink'] },
      
      { section: 'tools-top-title', title: 'Çalışma Araçları - Üst Başlık', fields: ['title'] },
      { section: 'tools-title', title: 'Çalışma Araçları - Ana Başlık', fields: ['title'] },
      { section: 'tools-subtitle', title: 'Çalışma Araçları - Alt Başlık', fields: ['subtitle'] },
      
      { section: 'packages-top-title', title: 'Paketler - Üst Başlık', fields: ['title'] },
      { section: 'packages-title', title: 'Paketler - Ana Başlık', fields: ['title'] },
      { section: 'packages-subtitle', title: 'Paketler - Alt Başlık', fields: ['subtitle'] },
      { section: 'packages-button', title: 'Paketler - Buton', fields: ['buttonText', 'buttonLink'] },
      
      { section: 'cta-badge', title: 'CTA - Badge', fields: ['title'] },
      { section: 'cta-question', title: 'CTA - Soru', fields: ['title'] },
      { section: 'cta-main-title', title: 'CTA - Ana Başlık', fields: ['title'] },
      { section: 'cta-description', title: 'CTA - Açıklama', fields: ['description'] },
      { section: 'cta-button-primary', title: 'CTA - Ana Buton', fields: ['buttonText', 'buttonLink'] },
      { section: 'cta-button-secondary', title: 'CTA - İkinci Buton', fields: ['buttonText', 'buttonLink'] },
      { section: 'cta-testimonial', title: 'CTA - Testimonial', fields: ['description'] },
    ]
  },
  about: {
    name: 'about',
    title: 'Hakkımızda',
    icon: BookOpen,
    sections: [
      // Hero Section
      { section: 'about-hero-badge', title: 'Badge', fields: ['title'], group: '🎯 Hero Bölümü' },
      { section: 'about-hero-title', title: 'Başlık', fields: ['title'], group: '🎯 Hero Bölümü' },
      { section: 'about-hero-subtitle', title: 'Alt Başlık', fields: ['subtitle'], group: '🎯 Hero Bölümü' },
      
      // Misyon
      { section: 'about-mission-title', title: 'Başlık', fields: ['title'], group: '🎯 Misyon' },
      { section: 'about-mission-description', title: 'Açıklama', fields: ['description'], group: '🎯 Misyon' },
      { section: 'about-mission-item1', title: 'Madde 1', fields: ['title'], group: '🎯 Misyon' },
      { section: 'about-mission-item2', title: 'Madde 2', fields: ['title'], group: '🎯 Misyon' },
      { section: 'about-mission-item3', title: 'Madde 3', fields: ['title'], group: '🎯 Misyon' },
      { section: 'about-mission-item4', title: 'Madde 4', fields: ['title'], group: '🎯 Misyon' },
      
      // Vizyon
      { section: 'about-vision-title', title: 'Başlık', fields: ['title'], group: '⚡ Vizyon' },
      { section: 'about-vision-description', title: 'Açıklama', fields: ['description'], group: '⚡ Vizyon' },
      { section: 'about-vision-item1', title: 'Madde 1', fields: ['title'], group: '⚡ Vizyon' },
      { section: 'about-vision-item2', title: 'Madde 2', fields: ['title'], group: '⚡ Vizyon' },
      { section: 'about-vision-item3', title: 'Madde 3', fields: ['title'], group: '⚡ Vizyon' },
      { section: 'about-vision-item4', title: 'Madde 4', fields: ['title'], group: '⚡ Vizyon' },
      
      // Değerler
      { section: 'about-values-badge', title: 'Badge', fields: ['title'], group: '💎 Değerlerimiz' },
      { section: 'about-values-title', title: 'Ana Başlık', fields: ['title'], group: '💎 Değerlerimiz' },
      { section: 'about-value1-title', title: 'Değer 1 - Başlık', fields: ['title'], group: '💎 Değerlerimiz' },
      { section: 'about-value1-desc', title: 'Değer 1 - Açıklama', fields: ['description'], group: '💎 Değerlerimiz' },
      { section: 'about-value2-title', title: 'Değer 2 - Başlık', fields: ['title'], group: '💎 Değerlerimiz' },
      { section: 'about-value2-desc', title: 'Değer 2 - Açıklama', fields: ['description'], group: '💎 Değerlerimiz' },
      { section: 'about-value3-title', title: 'Değer 3 - Başlık', fields: ['title'], group: '💎 Değerlerimiz' },
      { section: 'about-value3-desc', title: 'Değer 3 - Açıklama', fields: ['description'], group: '💎 Değerlerimiz' },
      { section: 'about-value4-title', title: 'Değer 4 - Başlık', fields: ['title'], group: '💎 Değerlerimiz' },
      { section: 'about-value4-desc', title: 'Değer 4 - Açıklama', fields: ['description'], group: '💎 Değerlerimiz' },
      
      // İstatistikler
      { section: 'about-stat1-value', title: 'İstatistik 1 - Değer', fields: ['title'], group: '📊 İstatistikler' },
      { section: 'about-stat1-label', title: 'İstatistik 1 - Etiket', fields: ['subtitle'], group: '📊 İstatistikler' },
      { section: 'about-stat2-value', title: 'İstatistik 2 - Değer', fields: ['title'], group: '📊 İstatistikler' },
      { section: 'about-stat2-label', title: 'İstatistik 2 - Etiket', fields: ['subtitle'], group: '📊 İstatistikler' },
      { section: 'about-stat3-value', title: 'İstatistik 3 - Değer', fields: ['title'], group: '📊 İstatistikler' },
      { section: 'about-stat3-label', title: 'İstatistik 3 - Etiket', fields: ['subtitle'], group: '📊 İstatistikler' },
      { section: 'about-stat4-value', title: 'İstatistik 4 - Değer', fields: ['title'], group: '📊 İstatistikler' },
      { section: 'about-stat4-label', title: 'İstatistik 4 - Etiket', fields: ['subtitle'], group: '📊 İstatistikler' },
      
      // CTA
      { section: 'about-cta-title', title: 'Ana Başlık', fields: ['title'], group: '🚀 CTA Bölümü' },
      { section: 'about-cta-subtitle', title: 'Alt Başlık', fields: ['subtitle'], group: '🚀 CTA Bölümü' },
      { section: 'about-cta-button1', title: 'Buton 1', fields: ['buttonText', 'buttonLink'], group: '🚀 CTA Bölümü' },
      { section: 'about-cta-button2', title: 'Buton 2', fields: ['buttonText', 'buttonLink'], group: '🚀 CTA Bölümü' },
    ]
  },
  branches: {
    name: 'branches',
    title: 'Şubeler',
    icon: Building2,
    sections: [
      // Hero Section
      { section: 'branches-hero-title', title: 'Ana Başlık', fields: ['title'], group: '🎯 Hero Bölümü' },
      { section: 'branches-hero-subtitle', title: 'Alt Başlık', fields: ['subtitle'], group: '🎯 Hero Bölümü' },
      { section: 'branches-hero-search-label', title: 'Arama Kutusu Başlığı', fields: ['title'], group: '🎯 Hero Bölümü' },
      { section: 'branches-hero-search-placeholder', title: 'Arama Placeholder', fields: ['subtitle'], group: '🎯 Hero Bölümü' },
      
      // View Toggle
      { section: 'branches-view-list', title: 'Liste Görünümü Metni', fields: ['title'], group: '👁️ Görünüm Seçenekleri' },
      { section: 'branches-view-map', title: 'Harita Görünümü Metni', fields: ['title'], group: '👁️ Görünüm Seçenekleri' },
      
      // Branch Card
      { section: 'branches-card-badge', title: 'Kart Badge Metni', fields: ['title'], group: '📍 Şube Kartları' },
      { section: 'branches-card-button', title: 'Detay Butonu Metni', fields: ['title'], group: '📍 Şube Kartları' },
      { section: 'branches-card-empty', title: 'Sonuç Bulunamadı Mesajı', fields: ['title'], group: '📍 Şube Kartları' },
      { section: 'branches-card-empty-button', title: 'Tümünü Göster Butonu', fields: ['title'], group: '📍 Şube Kartları' },
      
      // Map Info
      { section: 'branches-map-info-title', title: 'Harita Bilgi Başlığı', fields: ['title'], group: '🗺️ Harita Bilgileri' },
      { section: 'branches-map-info-desc', title: 'Harita Bilgi Açıklaması', fields: ['description'], group: '🗺️ Harita Bilgileri' },
      { section: 'branches-map-total-label', title: 'Toplam Şube Etiketi', fields: ['title'], group: '🗺️ Harita Bilgileri' },
      { section: 'branches-map-detail-button', title: 'Şube Detayları Butonu', fields: ['title'], group: '🗺️ Harita Bilgileri' },
    ]
  },
  teachers: {
    name: 'teachers',
    title: 'Öğretmenler',
    icon: Users,
    sections: [
      { section: 'hero', title: 'Sayfa Başlığı', fields: ['title', 'subtitle'] },
      { section: 'intro', title: 'Giriş', fields: ['title', 'description'] },
      { section: 'quality', title: 'Kalite', fields: ['title', 'description'] },
    ]
  },
  success: {
    name: 'success',
    title: 'Başarılar',
    icon: Trophy,
    sections: [
      // Hero Section
      { section: 'success-hero-badge', title: 'Badge Metni', fields: ['title'], group: '🎯 Hero Bölümü' },
      { section: 'success-hero-title', title: 'Ana Başlık', fields: ['title'], group: '🎯 Hero Bölümü' },
      { section: 'success-hero-subtitle', title: 'Alt Başlık', fields: ['subtitle'], group: '🎯 Hero Bölümü' },
      
      // Filter Tabs
      { section: 'success-filter-all', title: 'Tüm Sınavlar', fields: ['title'], group: '🔍 Filtre Sekmeleri' },
      { section: 'success-filter-yks', title: 'YKS Başarıları', fields: ['title'], group: '🔍 Filtre Sekmeleri' },
      { section: 'success-filter-lgs', title: 'LGS Başarıları', fields: ['title'], group: '🔍 Filtre Sekmeleri' },
      
      // CTA Section
      { section: 'success-cta-title', title: 'CTA Başlık', fields: ['title'], group: '📢 Çağrı Bölümü' },
      { section: 'success-cta-subtitle', title: 'CTA Alt Başlık', fields: ['subtitle'], group: '📢 Çağrı Bölümü' },
      { section: 'success-cta-button', title: 'CTA Buton', fields: ['buttonText', 'buttonLink'], group: '📢 Çağrı Bölümü' },
    ]
  },
  packages: {
    name: 'packages',
    title: 'Paketler',
    icon: Package,
    sections: [
      // Hero Section
      { section: 'packages-hero-badge', title: 'Badge Metni', fields: ['title'], group: '🎯 Hero Bölümü' },
      { section: 'packages-hero-title', title: 'Ana Başlık', fields: ['title'], group: '🎯 Hero Bölümü' },
      { section: 'packages-hero-subtitle', title: 'Alt Başlık', fields: ['subtitle'], group: '🎯 Hero Bölümü' },
      
      // Filter Tabs
      { section: 'packages-filter-all', title: 'Tüm Paketler', fields: ['title'], group: '🔍 Filtre Sekmeleri' },
      { section: 'packages-filter-yks2026', title: 'YKS 2026', fields: ['title'], group: '🔍 Filtre Sekmeleri' },
      { section: 'packages-filter-lgs2026', title: 'LGS 2026', fields: ['title'], group: '🔍 Filtre Sekmeleri' },
      { section: 'packages-filter-yks2027', title: 'YKS 2027', fields: ['title'], group: '🔍 Filtre Sekmeleri' },
      { section: 'packages-filter-9-10-11', title: '9-10-11. Sınıf', fields: ['title'], group: '🔍 Filtre Sekmeleri' },
      { section: 'packages-filter-kpss', title: 'KPSS', fields: ['title'], group: '🔍 Filtre Sekmeleri' },
      { section: 'packages-filter-dgs', title: 'DGS', fields: ['title'], group: '🔍 Filtre Sekmeleri' },
      
      // Package Card Labels
      { section: 'packages-card-popular', title: 'Popüler Badge', fields: ['title'], group: '📦 Paket Kartları' },
      { section: 'packages-card-new', title: 'Yeni Badge', fields: ['title'], group: '📦 Paket Kartları' },
      { section: 'packages-card-discount', title: 'İndirim Badge', fields: ['title'], group: '📦 Paket Kartları' },
      { section: 'packages-card-video-label', title: 'Video Etiketi', fields: ['title'], group: '📦 Paket Kartları' },
      { section: 'packages-card-duration-label', title: 'Süre Etiketi', fields: ['title'], group: '📦 Paket Kartları' },
      { section: 'packages-card-subject-label', title: 'Ders Etiketi', fields: ['title'], group: '📦 Paket Kartları' },
      { section: 'packages-card-content-label', title: 'Paket İçeriği Başlığı', fields: ['title'], group: '📦 Paket Kartları' },
      { section: 'packages-card-more-features', title: 'Daha Fazla Özellik Metni', fields: ['title'], group: '📦 Paket Kartları' },
      { section: 'packages-card-button', title: 'Detay Butonu', fields: ['title'], group: '📦 Paket Kartları' },
      
      // Empty State
      { section: 'packages-empty-message', title: 'Sonuç Bulunamadı Mesajı', fields: ['title'], group: '❌ Boş Durum' },
      
      // Loading State
      { section: 'packages-loading-message', title: 'Yükleniyor Mesajı', fields: ['title'], group: '⏳ Yükleme Durumu' },
    ]
  },
  digital: {
    name: 'digital',
    title: 'Dijital Platform',
    icon: Globe,
    sections: [
      { section: 'hero', title: 'Sayfa Başlığı', fields: ['title', 'subtitle', 'buttonText', 'buttonLink'] },
      { section: 'features', title: 'Özellikler', fields: ['title', 'description'] },
      { section: 'benefits', title: 'Avantajlar', fields: ['title', 'description'] },
      { section: 'cta', title: 'Çağrı', fields: ['title', 'buttonText', 'buttonLink'] },
    ]
  },
  international: {
    name: 'international',
    title: 'Yurtdışı Eğitim',
    icon: Globe,
    sections: [
      { section: 'hero', title: 'Sayfa Başlığı', fields: ['title', 'subtitle'] },
      { section: 'intro', title: 'Giriş', fields: ['title', 'description'] },
      { section: 'services', title: 'Hizmetler', fields: ['title', 'description'] },
      { section: 'cta', title: 'Çağrı', fields: ['title', 'buttonText', 'buttonLink'] },
    ]
  },
  guidance: {
    name: 'guidance',
    title: 'Rehberlik',
    icon: GraduationCap,
    sections: [
      { section: 'hero', title: 'Sayfa Başlığı', fields: ['title', 'subtitle'] },
      { section: 'intro', title: 'Giriş', fields: ['title', 'description'] },
      { section: 'services', title: 'Hizmetler', fields: ['title', 'description'] },
    ]
  },
  calculator: {
    name: 'calculator',
    title: 'Hesaplama Araçları',
    icon: Calculator,
    sections: [
      { section: 'hero', title: 'Sayfa Başlığı', fields: ['title', 'subtitle'] },
      { section: 'intro', title: 'Giriş', fields: ['title', 'description'] },
    ]
  },
  news: {
    name: 'news',
    title: 'Haberler',
    icon: Newspaper,
    sections: [
      // Hero Section
      { section: 'news-hero-badge', title: 'Badge Metni', fields: ['title'], group: '🎯 Hero Bölümü' },
      { section: 'news-hero-title', title: 'Ana Başlık', fields: ['title'], group: '🎯 Hero Bölümü' },
      { section: 'news-hero-subtitle', title: 'Alt Başlık', fields: ['subtitle'], group: '🎯 Hero Bölümü' },
      { section: 'news-search-placeholder', title: 'Arama Placeholder', fields: ['title'], group: '🎯 Hero Bölümü' },
      
      // Filter Section
      { section: 'news-filter-all', title: 'Tüm Şubeler', fields: ['title'], group: '🔍 Filtre' },
      { section: 'news-card-general', title: 'Genel Haber Etiketi', fields: ['title'], group: '📰 Haber Kartı' },
      { section: 'news-card-today', title: 'Bugün Metni', fields: ['title'], group: '📰 Haber Kartı' },
      { section: 'news-card-read-more', title: 'Detaylı Oku Butonu', fields: ['title'], group: '📰 Haber Kartı' },
      
      // Empty State
      { section: 'news-empty-title', title: 'Boş Durum Başlık', fields: ['title'], group: '📭 Boş Durum' },
      { section: 'news-empty-subtitle', title: 'Boş Durum Alt Başlık', fields: ['subtitle'], group: '📭 Boş Durum' },
      { section: 'news-empty-button', title: 'Filtreleri Temizle Butonu', fields: ['buttonText'], group: '📭 Boş Durum' },
    ]
  },
  franchise: {
    name: 'franchise',
    title: 'Franchise',
    icon: Briefcase,
    sections: [
      // Hero Section
      { section: 'franchise-hero-badge', title: 'Badge Metni', fields: ['title'], group: '🎯 Hero Bölümü' },
      { section: 'franchise-hero-title', title: 'Ana Başlık', fields: ['title'], group: '🎯 Hero Bölümü' },
      { section: 'franchise-hero-subtitle', title: 'Alt Başlık', fields: ['subtitle'], group: '🎯 Hero Bölümü' },
      { section: 'franchise-hero-button-primary', title: 'Birincil Buton', fields: ['buttonText', 'buttonLink'], group: '🎯 Hero Bölümü' },
      { section: 'franchise-hero-button-secondary', title: 'İkincil Buton', fields: ['buttonText', 'buttonLink'], group: '🎯 Hero Bölümü' },
      
      // Why Us Cards
      { section: 'franchise-why-card1-title', title: 'Kart 1 Başlık', fields: ['title'], group: '💡 Neden Biz?' },
      { section: 'franchise-why-card1-desc', title: 'Kart 1 Açıklama', fields: ['subtitle'], group: '💡 Neden Biz?' },
      { section: 'franchise-why-card2-title', title: 'Kart 2 Başlık', fields: ['title'], group: '💡 Neden Biz?' },
      { section: 'franchise-why-card2-desc', title: 'Kart 2 Açıklama', fields: ['subtitle'], group: '💡 Neden Biz?' },
      { section: 'franchise-why-card3-title', title: 'Kart 3 Başlık', fields: ['title'], group: '💡 Neden Biz?' },
      { section: 'franchise-why-card3-desc', title: 'Kart 3 Açıklama', fields: ['subtitle'], group: '💡 Neden Biz?' },
      
      // Process Section
      { section: 'franchise-process-title', title: 'Süreç Başlığı', fields: ['title'], group: '📋 Franchise Süreci' },
      { section: 'franchise-process-step1-title', title: 'Adım 1 Başlık', fields: ['title'], group: '📋 Franchise Süreci' },
      { section: 'franchise-process-step1-desc', title: 'Adım 1 Açıklama', fields: ['subtitle'], group: '📋 Franchise Süreci' },
      { section: 'franchise-process-step2-title', title: 'Adım 2 Başlık', fields: ['title'], group: '📋 Franchise Süreci' },
      { section: 'franchise-process-step2-desc', title: 'Adım 2 Açıklama', fields: ['subtitle'], group: '📋 Franchise Süreci' },
      { section: 'franchise-process-step3-title', title: 'Adım 3 Başlık', fields: ['title'], group: '📋 Franchise Süreci' },
      { section: 'franchise-process-step3-desc', title: 'Adım 3 Açıklama', fields: ['subtitle'], group: '📋 Franchise Süreci' },
      
      // Contact Section
      { section: 'franchise-contact-title', title: 'İletişim Başlığı', fields: ['title'], group: '📞 Hızlı İletişim' },
      { section: 'franchise-contact-phone', title: 'Telefon', fields: ['title'], group: '📞 Hızlı İletişim' },
      { section: 'franchise-contact-email', title: 'E-posta', fields: ['title'], group: '📞 Hızlı İletişim' },
      
      // Form Section
      { section: 'franchise-form-title', title: 'Form Başlığı', fields: ['title'], group: '📝 Başvuru Formu' },
      { section: 'franchise-form-button', title: 'Form Butonu', fields: ['buttonText'], group: '📝 Başvuru Formu' },
      { section: 'franchise-form-privacy', title: 'Gizlilik Metni', fields: ['subtitle'], group: '📝 Başvuru Formu' },
    ]
  },
  contact: {
    name: 'contact',
    title: 'İletişim',
    icon: Phone,
    sections: [
      // Hero
      { section: 'contact-hero-badge', title: 'Badge Metni', fields: ['title'], group: '🎯 Hero Bölümü' },
      { section: 'contact-hero-title', title: 'Ana Başlık', fields: ['title'], group: '🎯 Hero Bölümü' },
      { section: 'contact-hero-subtitle', title: 'Alt Başlık', fields: ['subtitle'], group: '🎯 Hero Bölümü' },
      
      // Info
      { section: 'contact-info-title', title: 'Bilgi Başlığı', fields: ['title'], group: '📋 İletişim Bilgileri' },
      { section: 'contact-info-desc', title: 'Bilgi Açıklaması', fields: ['subtitle'], group: '📋 İletişim Bilgileri' },
      
      // Address
      { section: 'contact-address-title', title: 'Adres Başlığı', fields: ['title'], group: '📍 Adres' },
      { section: 'contact-address-line1', title: 'Adres Satır 1', fields: ['subtitle'], group: '📍 Adres' },
      { section: 'contact-address-line2', title: 'Adres Satır 2', fields: ['subtitle'], group: '📍 Adres' },
      { section: 'contact-address-line3', title: 'Adres Satır 3', fields: ['subtitle'], group: '📍 Adres' },
      
      // Phone
      { section: 'contact-phone-title', title: 'Telefon Başlığı', fields: ['title'], group: '📞 Telefon' },
      { section: 'contact-phone-line1', title: 'Telefon 1', fields: ['subtitle'], group: '📞 Telefon' },
      { section: 'contact-phone-line2', title: 'Telefon 2', fields: ['subtitle'], group: '📞 Telefon' },
      
      // Email
      { section: 'contact-email-title', title: 'E-posta Başlığı', fields: ['title'], group: '📧 E-posta' },
      { section: 'contact-email-line1', title: 'E-posta 1', fields: ['subtitle'], group: '📧 E-posta' },
      { section: 'contact-email-line2', title: 'E-posta 2', fields: ['subtitle'], group: '📧 E-posta' },
      
      // Hours
      { section: 'contact-hours-title', title: 'Çalışma Saatleri Başlığı', fields: ['title'], group: '🕐 Çalışma Saatleri' },
      { section: 'contact-hours-line1', title: 'Saat 1', fields: ['subtitle'], group: '🕐 Çalışma Saatleri' },
      { section: 'contact-hours-line2', title: 'Saat 2', fields: ['subtitle'], group: '🕐 Çalışma Saatleri' },
      { section: 'contact-hours-line3', title: 'Saat 3', fields: ['subtitle'], group: '🕐 Çalışma Saatleri' },
      
      // Social & Form
      { section: 'contact-social-title', title: 'Sosyal Medya Başlığı', fields: ['title'], group: '📱 Sosyal Medya' },
      { section: 'contact-form-title', title: 'Form Başlığı', fields: ['title'], group: '📝 İletişim Formu' },
      { section: 'contact-form-button', title: 'Form Butonu', fields: ['buttonText'], group: '📝 İletişim Formu' },
    ]
  },
  'video-library': {
    name: 'video-library',
    title: 'Video Kütüphanesi',
    icon: Video,
    sections: [
      // Hero
      { section: 'video-hero-badge', title: 'Badge Metni', fields: ['title'], group: '🎯 Hero Bölümü' },
      { section: 'video-hero-title', title: 'Ana Başlık', fields: ['title'], group: '🎯 Hero Bölümü' },
      { section: 'video-hero-title-highlight', title: 'Vurgulu Başlık', fields: ['title'], group: '🎯 Hero Bölümü' },
      { section: 'video-hero-subtitle', title: 'Alt Başlık', fields: ['subtitle'], group: '🎯 Hero Bölümü' },
      
      // İstatistikler
      { section: 'video-stats-badge', title: 'Badge Metni', fields: ['title'], group: '📊 İstatistikler' },
      { section: 'video-stats-title', title: 'Ana Başlık', fields: ['title'], group: '📊 İstatistikler' },
      { section: 'video-stats-title-highlight', title: 'Vurgulu Başlık', fields: ['title'], group: '📊 İstatistikler' },
      
      { section: 'video-stat1-value', title: 'İstatistik 1 - Değer', fields: ['title'], group: '📊 İstatistikler' },
      { section: 'video-stat1-label', title: 'İstatistik 1 - Etiket', fields: ['title'], group: '📊 İstatistikler' },
      { section: 'video-stat2-value', title: 'İstatistik 2 - Değer', fields: ['title'], group: '📊 İstatistikler' },
      { section: 'video-stat2-label', title: 'İstatistik 2 - Etiket', fields: ['title'], group: '📊 İstatistikler' },
      { section: 'video-stat3-value', title: 'İstatistik 3 - Değer', fields: ['title'], group: '📊 İstatistikler' },
      { section: 'video-stat3-label', title: 'İstatistik 3 - Etiket', fields: ['title'], group: '📊 İstatistikler' },
      { section: 'video-stat4-value', title: 'İstatistik 4 - Değer', fields: ['title'], group: '📊 İstatistikler' },
      { section: 'video-stat4-label', title: 'İstatistik 4 - Etiket', fields: ['title'], group: '📊 İstatistikler' },
      
      // Kategoriler
      { section: 'video-categories-title', title: 'Ana Başlık', fields: ['title'], group: '📚 Kategoriler' },
      { section: 'video-categories-title-highlight', title: 'Vurgulu Başlık', fields: ['title'], group: '📚 Kategoriler' },
      { section: 'video-categories-subtitle', title: 'Alt Başlık', fields: ['subtitle'], group: '📚 Kategoriler' },
      
      // Özellikler
      { section: 'video-features-title', title: 'Ana Başlık', fields: ['title'], group: '⭐ Özellikler' },
      { section: 'video-features-title-highlight', title: 'Vurgulu Başlık', fields: ['title'], group: '⭐ Özellikler' },
      
      { section: 'video-feature1-title', title: 'Özellik 1 - Başlık', fields: ['title'], group: '⭐ Özellikler' },
      { section: 'video-feature1-desc', title: 'Özellik 1 - Açıklama', fields: ['subtitle'], group: '⭐ Özellikler' },
      { section: 'video-feature2-title', title: 'Özellik 2 - Başlık', fields: ['title'], group: '⭐ Özellikler' },
      { section: 'video-feature2-desc', title: 'Özellik 2 - Açıklama', fields: ['subtitle'], group: '⭐ Özellikler' },
      { section: 'video-feature3-title', title: 'Özellik 3 - Başlık', fields: ['title'], group: '⭐ Özellikler' },
      { section: 'video-feature3-desc', title: 'Özellik 3 - Açıklama', fields: ['subtitle'], group: '⭐ Özellikler' },
      { section: 'video-feature4-title', title: 'Özellik 4 - Başlık', fields: ['title'], group: '⭐ Özellikler' },
      { section: 'video-feature4-desc', title: 'Özellik 4 - Açıklama', fields: ['subtitle'], group: '⭐ Özellikler' },
      { section: 'video-feature5-title', title: 'Özellik 5 - Başlık', fields: ['title'], group: '⭐ Özellikler' },
      { section: 'video-feature5-desc', title: 'Özellik 5 - Açıklama', fields: ['subtitle'], group: '⭐ Özellikler' },
      { section: 'video-feature6-title', title: 'Özellik 6 - Başlık', fields: ['title'], group: '⭐ Özellikler' },
      { section: 'video-feature6-desc', title: 'Özellik 6 - Açıklama', fields: ['subtitle'], group: '⭐ Özellikler' },
      
      // CTA
      { section: 'video-cta-title', title: 'Ana Başlık', fields: ['title'], group: '🎯 CTA Bölümü' },
      { section: 'video-cta-title-highlight', title: 'Vurgulu Başlık', fields: ['title'], group: '🎯 CTA Bölümü' },
      { section: 'video-cta-subtitle', title: 'Alt Başlık', fields: ['subtitle'], group: '🎯 CTA Bölümü' },
      { section: 'video-cta-button1', title: 'Buton 1 Metni', fields: ['buttonText'], group: '🎯 CTA Bölümü' },
      { section: 'video-cta-button2', title: 'Buton 2 Metni', fields: ['buttonText'], group: '🎯 CTA Bölümü' },
    ]
  },
  'video-gallery': {
    name: 'video-gallery',
    title: 'Video Galerisi',
    icon: Video,
    sections: [
      // Hero
      { section: 'video-gallery-hero-badge', title: 'Badge Metni', fields: ['title'], group: '🎯 Hero Bölümü' },
      { section: 'video-gallery-hero-title', title: 'Ana Başlık', fields: ['title'], group: '🎯 Hero Bölümü' },
      { section: 'video-gallery-hero-title-highlight', title: 'Vurgulu Başlık', fields: ['title'], group: '🎯 Hero Bölümü' },
      { section: 'video-gallery-hero-subtitle', title: 'Alt Başlık', fields: ['subtitle'], group: '🎯 Hero Bölümü' },
      
      // Search & Filters
      { section: 'video-gallery-search-placeholder', title: 'Arama Placeholder', fields: ['title'], group: '🔍 Arama & Filtre' },
      { section: 'video-gallery-tab-all', title: 'Tüm Videolar Tab', fields: ['title'], group: '🔍 Arama & Filtre' },
      { section: 'video-gallery-tab-yks-tyt', title: 'YKS TYT Tab', fields: ['title'], group: '🔍 Arama & Filtre' },
      { section: 'video-gallery-tab-yks-ayt', title: 'YKS AYT Tab', fields: ['title'], group: '🔍 Arama & Filtre' },
      { section: 'video-gallery-tab-lgs', title: 'LGS Tab', fields: ['title'], group: '🔍 Arama & Filtre' },
      { section: 'video-gallery-tab-kpss', title: 'KPSS Tab', fields: ['title'], group: '🔍 Arama & Filtre' },
      
      // Empty State
      { section: 'video-gallery-empty-message', title: 'Boş Durum Mesajı', fields: ['title'], group: '📭 Boş Durum' },
    ]
  },
};

export const ContentSectionsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  const pages = Object.values(PAGE_CONFIGS);
  const activePage = PAGE_CONFIGS[activeTab as keyof typeof PAGE_CONFIGS];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-brand-blue to-blue-400 rounded-2xl shadow-xl">
            <activePage.icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-brand-dark capitalize tracking-tight">Sayfa İçerikleri</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Tüm sayfa içeriklerini tek yerden yönetin</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {pages.map((page) => (
            <button
              key={page.name}
              onClick={() => setActiveTab(page.name)}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === page.name
                  ? 'bg-brand-blue text-white shadow-lg'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <page.icon className="w-4 h-4" />
              <span>{page.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        {activeTab === 'home' ? (
          <HomePageManager />
        ) : (
          <PageContentManager
            pageName={activePage.name}
            pageTitle={activePage.title}
            sections={activePage.sections}
          />
        )}
      </div>
    </div>
  );
};
