import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Heart, Brain, Target, CheckCircle2, MessageCircle, TrendingUp, Award, BookOpen, Sparkles, Phone, Mail } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

const GuidancePage: React.FC = () => {
    // SEO Hook
    useSEO('guidance');
    
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[600px] bg-gradient-to-br from-amber-600 via-orange-600 to-red-700 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
                </div>

                <div className="relative z-10 max-w-[1600px] mx-auto px-12 h-full flex flex-col justify-center">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center space-x-3 bg-white/20 border-white/30 font-black capitalize text-xs tracking-widest backdrop-blur-xl px-6 py-3 rounded-xl border text-white mb-6">
                            <Users className="w-5 h-5" />
                            <span>Rehberlik Hizmetleri</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6">
                            Uzman Kadro <span className="text-amber-300 italic">Desteği</span>
                        </h1>
                        <p className="text-2xl text-white/90 font-medium leading-relaxed max-w-3xl">
                            Psikolojik destek, akademik rehberlik ve kariyer danışmanlığı ile öğrencilerimizin her adımında yanındayız.
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
                        <span className="text-brand-dark font-bold">Rehberlik Hizmetleri</span>
                    </div>
                </div>
            </div>

            {/* Rehberlik Alanları */}
            <section className="py-32 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-[1600px] mx-auto px-12">
                    <div className="text-center mb-16">
                        <span className="text-brand-blue font-black tracking-[0.4em] text-[12px] uppercase">Rehberlik Alanlarımız</span>
                        <h2 className="text-5xl md:text-6xl font-black text-brand-dark tracking-tighter leading-none mt-4">
                            Kapsamlı <span className="text-brand-blue">Destek Sistemi</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[
                            {
                                icon: Heart,
                                title: 'Psikolojik Destek',
                                desc: 'Sınav kaygısı, motivasyon ve stres yönetimi konularında uzman psikolog desteği',
                                features: ['Bireysel Görüşme', 'Grup Terapisi', 'Aile Danışmanlığı', 'Stres Yönetimi']
                            },
                            {
                                icon: Brain,
                                title: 'Akademik Rehberlik',
                                desc: 'Ders çalışma teknikleri, zaman yönetimi ve verimlilik artırma stratejileri',
                                features: ['Çalışma Planı', 'Ders Teknikleri', 'Verimlilik', 'Hedef Belirleme']
                            },
                            {
                                icon: Target,
                                title: 'Kariyer Danışmanlığı',
                                desc: 'Meslek seçimi, üniversite tercihleri ve gelecek planlaması konusunda rehberlik',
                                features: ['Meslek Testi', 'Üniversite Seçimi', 'Bölüm Analizi', 'Gelecek Planı']
                            },
                            {
                                icon: TrendingUp,
                                title: 'Performans Takibi',
                                desc: 'Düzenli performans değerlendirmesi ve gelişim raporları',
                                features: ['Sınav Analizi', 'İlerleme Raporu', 'Güçlü Yönler', 'Gelişim Alanları']
                            },
                            {
                                icon: MessageCircle,
                                title: 'Veli İletişimi',
                                desc: 'Düzenli veli görüşmeleri ve bilgilendirme toplantıları',
                                features: ['Veli Toplantıları', 'Bireysel Görüşme', 'Raporlama', 'İletişim Kanalı']
                            },
                            {
                                icon: Award,
                                title: 'Motivasyon Programları',
                                desc: 'Öğrenci motivasyonunu artırmaya yönelik özel programlar ve etkinlikler',
                                features: ['Seminerler', 'Atölyeler', 'Etkinlikler', 'Ödül Sistemi']
                            }
                        ].map((service, i) => (
                            <div key={i} className="bg-white rounded-[20px] p-8 shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                                    <service.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-brand-dark mb-3">{service.title}</h3>
                                <p className="text-slate-600 font-medium leading-relaxed mb-6">{service.desc}</p>
                                <div className="space-y-2">
                                    {service.features.map((feature, j) => (
                                        <div key={j} className="flex items-center space-x-2">
                                            <CheckCircle2 className="w-4 h-4 text-amber-600" />
                                            <span className="text-xs font-bold text-slate-500">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Uzman Kadro */}
            <section className="py-32 bg-white">
                <div className="max-w-[1600px] mx-auto px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tighter leading-none mb-6">
                            Uzman <span className="text-brand-blue">Rehberlik Kadromuz</span>
                        </h2>
                        <p className="text-xl text-slate-600 font-medium max-w-3xl mx-auto">
                            Alanında uzman psikolog, pedagog ve kariyer danışmanlarımız
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: 'Psk. Dr. Ayşe Yılmaz', title: 'Klinik Psikolog', exp: '15 Yıl Deneyim' },
                            { name: 'Uzm. Mehmet Kaya', title: 'Eğitim Psikoloğu', exp: '12 Yıl Deneyim' },
                            { name: 'Uzm. Zeynep Demir', title: 'Kariyer Danışmanı', exp: '10 Yıl Deneyim' }
                        ].map((expert, i) => (
                            <div key={i} className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-[20px] p-8 shadow-xl border border-amber-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group text-center">
                                <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-black group-hover:scale-110 transition-transform">
                                    {expert.name.charAt(expert.name.indexOf('.') + 2)}
                                </div>
                                <h3 className="text-xl font-black text-brand-dark mb-2">{expert.name}</h3>
                                <p className="text-sm font-bold text-amber-600 mb-1">{expert.title}</p>
                                <p className="text-xs font-bold text-slate-500">{expert.exp}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Süreç */}
            <section className="py-32 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-[1600px] mx-auto px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tighter leading-none mb-6">
                            Rehberlik <span className="text-brand-blue">Süreci</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { step: '1', title: 'İlk Değerlendirme', icon: Users },
                            { step: '2', title: 'Bireysel Plan', icon: Target },
                            { step: '3', title: 'Düzenli Takip', icon: TrendingUp },
                            { step: '4', title: 'Sonuç Analizi', icon: Award }
                        ].map((item, i) => (
                            <div key={i} className="relative">
                                <div className="bg-white rounded-[20px] p-8 shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group text-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-black group-hover:scale-110 transition-transform">
                                        {item.step}
                                    </div>
                                    <item.icon className="w-8 h-8 text-amber-600 mx-auto mb-3" />
                                    <h4 className="text-sm font-black text-brand-dark">{item.title}</h4>
                                </div>
                                {i < 3 && (
                                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-amber-300"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blog & Kaynaklar */}
            <section className="py-32 bg-white">
                <div className="max-w-[1600px] mx-auto px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tighter leading-none mb-6">
                            Rehberlik <span className="text-brand-blue">Blog & Kaynaklar</span>
                        </h2>
                        <p className="text-xl text-slate-600 font-medium max-w-3xl mx-auto">
                            Öğrenciler ve veliler için hazırladığımız rehberlik içerikleri
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Sınav Kaygısı ile Başa Çıkma', category: 'Psikolojik Destek', icon: Heart },
                            { title: 'Etkili Ders Çalışma Teknikleri', category: 'Akademik Rehberlik', icon: BookOpen },
                            { title: 'Meslek Seçiminde Dikkat Edilmesi Gerekenler', category: 'Kariyer Danışmanlığı', icon: Target }
                        ].map((article, i) => (
                            <Link
                                key={i}
                                to="/"
                                className="group bg-gradient-to-br from-slate-50 to-white rounded-[20px] p-8 shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <article.icon className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-xs font-bold text-amber-600 mb-2 uppercase tracking-wider">{article.category}</p>
                                <h3 className="text-lg font-black text-brand-dark group-hover:text-brand-blue transition-colors">{article.title}</h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 bg-gradient-to-br from-amber-600 via-orange-600 to-red-700 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
                </div>

                <div className="max-w-[1600px] mx-auto px-12 relative z-10 text-center">
                    <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none mb-8">
                        Uzman Rehberlik <span className="text-amber-300 italic">Desteği Alın</span>
                    </h2>
                    <p className="text-xl text-white/90 font-medium max-w-3xl mx-auto mb-12">
                        Psikolojik destek, akademik rehberlik ve kariyer danışmanlığı için hemen iletişime geçin.
                    </p>
                    <div className="flex flex-wrap gap-6 justify-center">
                        <Link to="/iletisim" className="px-12 py-5 bg-white text-brand-dark font-black rounded-2xl hover:bg-amber-300 hover:text-white transition-all duration-300 shadow-xl hover:scale-105">
                            Randevu Al
                        </Link>
                        <Link to="/subeler" className="px-12 py-5 bg-white/10 backdrop-blur-md text-white border-2 border-white/20 font-black rounded-2xl hover:bg-white hover:text-brand-dark transition-all duration-300 hover:scale-105">
                            Şubelerimiz
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GuidancePage;
