import React from 'react';
import { Link } from 'react-router-dom';
import { Laptop, Brain, Users, Phone, Cpu, TrendingUp, CheckCircle2, Sparkles, BarChart3, Bell, Shield, Zap, Target } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

const DigitalPlatformPage: React.FC = () => {
    // SEO Hook
    useSEO('digital');
    
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[600px] bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
                </div>

                <div className="relative z-10 max-w-[1600px] mx-auto px-12 h-full flex flex-col justify-center">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center space-x-3 bg-white/20 border-white/30 font-black capitalize text-xs tracking-widest backdrop-blur-xl px-6 py-3 rounded-xl border text-white mb-6">
                            <Laptop className="w-5 h-5" />
                            <span>Dijital Eğitim Platformu</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6">
                            Yapay Zeka Destekli <span className="text-cyan-400 italic">Eğitim</span>
                        </h1>
                        <p className="text-2xl text-white/90 font-medium leading-relaxed max-w-3xl">
                            Öğrenciler ve veliler için geliştirdiğimiz dijital altyapı ile eğitim sürecini her adımda takip edin ve kişiselleştirilmiş öğrenme deneyimi yaşayın.
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
                        <span className="text-brand-dark font-bold">Dijital Platform</span>
                    </div>
                </div>
            </div>

            {/* Platform Özellikleri */}
            <section className="py-32 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-[1600px] mx-auto px-12">
                    <div className="text-center mb-16">
                        <span className="text-brand-blue font-black tracking-[0.4em] text-[12px] uppercase">Platform Özellikleri</span>
                        <h2 className="text-5xl md:text-6xl font-black text-brand-dark tracking-tighter leading-none mt-4">
                            Dijital <span className="text-brand-blue">Eğitim Ekosistemi</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Laptop,
                                title: 'Öğrenci Paneli',
                                desc: 'Kişiye özel ders programı, performans takibi ve yapay zeka destekli analiz raporları',
                                features: ['Ders Programı', 'Sınav Sonuçları', 'İlerleme Grafikleri', 'Hedef Belirleme']
                            },
                            {
                                icon: Users,
                                title: 'Veli Takip Sistemi',
                                desc: 'Çocuğunuzun akademik gelişimini anlık olarak takip edin ve raporlara erişin',
                                features: ['Devam Takibi', 'Not Bildirimleri', 'Öğretmen Görüşmeleri', 'Performans Raporları']
                            },
                            {
                                icon: Phone,
                                title: 'Mobil Uygulama',
                                desc: 'iOS ve Android uygulamalarımızla her yerden eğitime erişim imkanı',
                                features: ['Canlı Dersler', 'Video Arşivi', 'Soru Çözüm', 'Offline Mod']
                            },
                            {
                                icon: Brain,
                                title: 'Yapay Zeka Analizi',
                                desc: 'Öğrenme stilinize göre kişiselleştirilmiş içerik önerileri ve çalışma planı',
                                features: ['Eksik Analizi', 'Öneri Sistemi', 'Akıllı Planlama', 'Tahmin Modeli']
                            }
                        ].map((feature, i) => (
                            <div key={i} className="bg-white rounded-[20px] p-8 shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                                <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                                    <feature.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-black text-brand-dark mb-3">{feature.title}</h3>
                                <p className="text-sm text-slate-600 font-medium mb-4 leading-relaxed">{feature.desc}</p>
                                <div className="space-y-2">
                                    {feature.features.map((item, j) => (
                                        <div key={j} className="flex items-center space-x-2">
                                            <CheckCircle2 className="w-4 h-4 text-brand-blue" />
                                            <span className="text-xs font-bold text-slate-500">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Yapay Zeka Özellikleri */}
            <section className="py-32 bg-white">
                <div className="max-w-[1600px] mx-auto px-12">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div>
                                <span className="text-brand-blue font-black tracking-[0.4em] text-[12px] uppercase">Yapay Zeka</span>
                                <h2 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tighter leading-none mt-4">
                                    Kişiselleştirilmiş <span className="text-brand-blue">Öğrenme</span>
                                </h2>
                            </div>
                            <p className="text-xl text-slate-600 font-medium leading-relaxed">
                                Yapay zeka destekli sistemimiz, her öğrencinin öğrenme stilini analiz ederek kişiye özel çalışma programı ve içerik önerileri sunar.
                            </p>
                            <div className="space-y-4">
                                {[
                                    { icon: BarChart3, title: 'Performans Analizi', desc: 'Güçlü ve zayıf yönlerinizi tespit eder' },
                                    { icon: Target, title: 'Akıllı Hedefleme', desc: 'Gerçekçi hedefler belirler ve yol haritası çizer' },
                                    { icon: Zap, title: 'Hızlı Geri Bildirim', desc: 'Anlık performans değerlendirmesi ve öneriler' },
                                    { icon: TrendingUp, title: 'İlerleme Takibi', desc: 'Detaylı grafikler ile gelişiminizi görün' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-xl hover:bg-brand-blue/5 transition-colors group">
                                        <div className="w-12 h-12 bg-gradient-to-br from-brand-blue to-purple-600 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                            <item.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-brand-dark mb-1">{item.title}</h4>
                                            <p className="text-sm text-slate-600 font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="aspect-square bg-gradient-to-br from-brand-blue/10 to-purple-600/10 rounded-[20px] p-8">
                                <img
                                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800"
                                    alt="Yapay Zeka Dashboard"
                                    className="w-full h-full object-cover rounded-xl shadow-2xl"
                                />
                            </div>
                            <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-[20px] shadow-2xl border border-slate-100 max-w-xs">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                                        <Sparkles className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-brand-dark">%98</p>
                                        <p className="text-xs font-bold text-slate-500">Kullanıcı Memnuniyeti</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ek Özellikler */}
            <section className="py-32 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-[1600px] mx-auto px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tighter leading-none mb-6">
                            Daha Fazla <span className="text-brand-blue">Özellik</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Bell, title: 'Anlık Bildirimler', desc: 'Sınav, ödev ve duyurular için SMS ve e-posta bildirimleri' },
                            { icon: Shield, title: 'Güvenli Altyapı', desc: 'SSL sertifikası ve veri şifreleme ile güvenli platform' },
                            { icon: Cpu, title: 'Bulut Teknolojisi', desc: 'Her yerden erişim ve otomatik yedekleme sistemi' }
                        ].map((feature, i) => (
                            <div key={i} className="bg-white rounded-[20px] p-8 shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                                    <feature.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-black text-brand-dark mb-3">{feature.title}</h3>
                                <p className="text-slate-600 font-medium leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 bg-gradient-to-br from-brand-blue via-purple-600 to-indigo-700 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
                </div>

                <div className="max-w-[1600px] mx-auto px-12 relative z-10 text-center">
                    <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none mb-8">
                        Dijital Platformumuzu <span className="text-cyan-400 italic">Keşfedin</span>
                    </h2>
                    <p className="text-xl text-white/90 font-medium max-w-3xl mx-auto mb-12">
                        Hemen kayıt olun ve yapay zeka destekli eğitim platformumuzun tüm özelliklerinden yararlanın.
                    </p>
                    <div className="flex flex-wrap gap-6 justify-center">
                        <Link to="/subeler" className="px-12 py-5 bg-white text-brand-dark font-black rounded-2xl hover:bg-cyan-400 hover:text-white transition-all duration-300 shadow-xl hover:scale-105">
                            Hemen Kayıt Ol
                        </Link>
                        <Link to="/iletisim" className="px-12 py-5 bg-white/10 backdrop-blur-md text-white border-2 border-white/20 font-black rounded-2xl hover:bg-white hover:text-brand-dark transition-all duration-300 hover:scale-105">
                            Demo Talep Et
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DigitalPlatformPage;
