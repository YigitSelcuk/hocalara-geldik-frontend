import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Video, Play, Users, TrendingUp, CheckCircle2, BookOpen, Award, Target, Clock, Star } from 'lucide-react';
import { homeSectionService } from '../services/homepage.service';

const VideoLibraryPage: React.FC = () => {
    const [pageContent, setPageContent] = useState<any>({});
    const [loading, setLoading] = useState(true);

    const getContent = (section: string, field: 'title' | 'subtitle' | 'buttonText' = 'title', defaultValue: string = '') => {
        const content = pageContent[section];
        return content?.[field] || defaultValue;
    };

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const contentRes = await homeSectionService.getAll();
                const contentData = contentRes.data?.data || contentRes.data;
                
                if (Array.isArray(contentData)) {
                    const sections = contentData.filter((s: any) => s.page === 'video-library');
                    const contentMap: any = {};
                    sections.forEach((s: any) => {
                        contentMap[s.section] = s;
                    });
                    setPageContent(contentMap);
                }
            } catch (error) {
                console.error('Error fetching video library content:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    const categories = [
        { name: 'Matematik', count: '1200+', color: 'from-blue-500 to-indigo-500' },
        { name: 'Fizik', count: '800+', color: 'from-purple-500 to-pink-500' },
        { name: 'Kimya', count: '750+', color: 'from-green-500 to-emerald-500' },
        { name: 'Biyoloji', count: '650+', color: 'from-orange-500 to-red-500' },
        { name: 'Türkçe', count: '900+', color: 'from-cyan-500 to-blue-500' },
        { name: 'Tarih', count: '500+', color: 'from-amber-500 to-orange-500' },
        { name: 'Coğrafya', count: '450+', color: 'from-teal-500 to-green-500' },
        { name: 'İngilizce', count: '700+', color: 'from-pink-500 to-rose-500' }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[600px] bg-gradient-to-br from-red-600 via-pink-600 to-purple-700 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
                </div>

                <div className="relative z-10 max-w-[1600px] mx-auto px-12 h-full flex flex-col justify-center">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center space-x-3 bg-white/20 border-white/30 font-black capitalize text-xs tracking-widest backdrop-blur-xl px-6 py-3 rounded-xl border text-white mb-6">
                            <Video className="w-5 h-5" />
                            <span>{getContent('video-hero-badge', 'title', 'Video Kütüphanesi')}</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6">
                            {getContent('video-hero-title', 'title', '5000+ Saat')} <span className="text-amber-400 italic">{getContent('video-hero-title-highlight', 'title', 'Ders İçeriği')}</span>
                        </h1>
                        <p className="text-2xl text-white/90 font-medium leading-relaxed max-w-3xl">
                            {getContent('video-hero-subtitle', 'subtitle', 'Tüm derslere ait binlerce video ders, konu anlatımı ve soru çözümü ile sınırsız erişim. İstediğiniz zaman, istediğiniz yerden öğrenin.')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Breadcrumb */}
            <div className="bg-slate-50 border-b border-slate-200">
                <div className="max-w-[1600px] mx-auto px-12 py-4">
                    <div className="flex items-center space-x-2 text-sm font-medium text-slate-600">
                        <Link to="/" className="hover:text-brand-blue transition-colors">Ana Sayfa</Link>
                        <span>/</span>
                        <span className="text-brand-dark font-bold">Video Kütüphanesi</span>
                    </div>
                </div>
            </div>

            {/* İstatistikler */}
            <section className="py-32 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-[1600px] mx-auto px-12">
                    <div className="text-center mb-16">
                        <span className="text-brand-blue font-black tracking-[0.4em] text-[12px] uppercase">{getContent('video-stats-badge', 'title', 'Rakamlarla Video Kütüphanemiz')}</span>
                        <h2 className="text-5xl md:text-6xl font-black text-brand-dark tracking-tighter leading-none mt-4">
                            {getContent('video-stats-title', 'title', 'Sınırsız')} <span className="text-brand-blue">{getContent('video-stats-title-highlight', 'title', 'Eğitim İçeriği')}</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { value: getContent('video-stat1-value', 'title', '5000+'), label: getContent('video-stat1-label', 'title', 'Saat Video'), icon: Clock },
                            { value: getContent('video-stat2-value', 'title', '15K+'), label: getContent('video-stat2-label', 'title', 'Video Ders'), icon: Video },
                            { value: getContent('video-stat3-value', 'title', '50+'), label: getContent('video-stat3-label', 'title', 'Öğretmen'), icon: Users },
                            { value: getContent('video-stat4-value', 'title', '100K+'), label: getContent('video-stat4-label', 'title', 'İzlenme'), icon: TrendingUp }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white rounded-[20px] p-10 shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                                    <stat.icon className="w-10 h-10 text-white" />
                                </div>
                                <div className="text-5xl font-black text-brand-dark mb-2">{stat.value}</div>
                                <div className="text-sm font-bold text-slate-600 uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Kategoriler */}
            <section className="py-32 bg-white">
                <div className="max-w-[1600px] mx-auto px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tighter leading-none mb-6">
                            {getContent('video-categories-title', 'title', 'Ders')} <span className="text-brand-blue">{getContent('video-categories-title-highlight', 'title', 'Kategorileri')}</span>
                        </h2>
                        <p className="text-xl text-slate-600 font-medium max-w-3xl mx-auto">
                            {getContent('video-categories-subtitle', 'subtitle', 'Tüm derslere ait kapsamlı video içerikleri')}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {categories.map((category, i) => (
                            <Link
                                key={i}
                                to="/videolar"
                                className="group bg-gradient-to-br from-slate-50 to-white rounded-[20px] p-8 shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 text-center"
                            >
                                <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg`}>
                                    <BookOpen className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-black text-brand-dark mb-2">{category.name}</h3>
                                <p className="text-sm font-bold text-slate-500">{category.count} Video</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Özellikler */}
            <section className="py-32 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-[1600px] mx-auto px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tighter leading-none mb-6">
                            {getContent('video-features-title', 'title', 'Video Kütüphanesi')} <span className="text-brand-blue">{getContent('video-features-title-highlight', 'title', 'Özellikleri')}</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[
                            {
                                icon: Play,
                                title: getContent('video-feature1-title', 'title', 'HD Kalite'),
                                desc: getContent('video-feature1-desc', 'subtitle', 'Tüm videolar Full HD kalitede, net görüntü ve ses ile hazırlanmıştır.'),
                                features: ['1080p Çözünürlük', 'Net Ses Kalitesi', 'Hızlı Yükleme']
                            },
                            {
                                icon: Target,
                                title: getContent('video-feature2-title', 'title', 'Konu Bazlı'),
                                desc: getContent('video-feature2-desc', 'subtitle', 'Her konu detaylı şekilde işlenmiş, adım adım anlatım ile öğrenin.'),
                                features: ['Konu Anlatımı', 'Örnek Sorular', 'Çözüm Videoları']
                            },
                            {
                                icon: CheckCircle2,
                                title: getContent('video-feature3-title', 'title', 'Sınırsız Erişim'),
                                desc: getContent('video-feature3-desc', 'subtitle', '7/24 erişim, istediğiniz zaman istediğiniz yerden izleyebilirsiniz.'),
                                features: ['Mobil Uyumlu', 'Offline İzleme', 'Hız Kontrolü']
                            },
                            {
                                icon: Award,
                                title: getContent('video-feature4-title', 'title', 'Uzman Öğretmenler'),
                                desc: getContent('video-feature4-desc', 'subtitle', 'Alanında uzman öğretmenler tarafından hazırlanmış içerikler.'),
                                features: ['Deneyimli Kadro', 'Güncel Müfredat', 'Sınav Odaklı']
                            },
                            {
                                icon: Star,
                                title: getContent('video-feature5-title', 'title', 'İnteraktif'),
                                desc: getContent('video-feature5-desc', 'subtitle', 'Videolar üzerinde not alma, işaretleme ve tekrar izleme özellikleri.'),
                                features: ['Not Alma', 'Bookmark', 'İzleme Geçmişi']
                            },
                            {
                                icon: TrendingUp,
                                title: getContent('video-feature6-title', 'title', 'Sürekli Güncelleme'),
                                desc: getContent('video-feature6-desc', 'subtitle', 'Her hafta yeni videolar ekleniyor, içerik sürekli genişliyor.'),
                                features: ['Haftalık Ekleme', 'Güncel Sorular', 'Trend Konular']
                            }
                        ].map((feature, i) => (
                            <div key={i} className="bg-white rounded-[20px] p-8 shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                                    <feature.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-brand-dark mb-3">{feature.title}</h3>
                                <p className="text-slate-600 font-medium leading-relaxed mb-6">{feature.desc}</p>
                                <div className="space-y-2">
                                    {feature.features.map((item, j) => (
                                        <div key={j} className="flex items-center space-x-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-brand-blue"></div>
                                            <span className="text-xs font-bold text-slate-500">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 bg-gradient-to-br from-red-600 via-pink-600 to-purple-700 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
                </div>

                <div className="max-w-[1600px] mx-auto px-12 relative z-10 text-center">
                    <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none mb-8">
                        {getContent('video-cta-title', 'title', 'Binlerce Video Derse')} <span className="text-amber-400 italic">{getContent('video-cta-title-highlight', 'title', 'Hemen Erişin')}</span>
                    </h2>
                    <p className="text-xl text-white/90 font-medium max-w-3xl mx-auto mb-12">
                        {getContent('video-cta-subtitle', 'subtitle', 'Kayıt olun ve 5000+ saat video içeriğe sınırsız erişim kazanın.')}
                    </p>
                    <div className="flex flex-wrap gap-6 justify-center">
                        <Link to="/videolar" className="px-12 py-5 bg-white text-brand-dark font-black rounded-2xl hover:bg-amber-400 hover:text-white transition-all duration-300 shadow-xl hover:scale-105">
                            {getContent('video-cta-button1', 'buttonText', 'Video Galerisine Git')}
                        </Link>
                        <Link to="/subeler" className="px-12 py-5 bg-white/10 backdrop-blur-md text-white border-2 border-white/20 font-black rounded-2xl hover:bg-white hover:text-brand-dark transition-all duration-300 hover:scale-105">
                            {getContent('video-cta-button2', 'buttonText', 'Hemen Kayıt Ol')}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default VideoLibraryPage;
