import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Target, BookOpen, GraduationCap, CheckCircle2, Award, Plane, FileText, Users, TrendingUp } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

const InternationalPage: React.FC = () => {
    // SEO Hook
    useSEO('international');
    
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[600px] bg-gradient-to-br from-green-600 via-teal-600 to-blue-700 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
                </div>

                <div className="relative z-10 max-w-[1600px] mx-auto px-12 h-full flex flex-col justify-center">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center space-x-3 bg-white/20 border-white/30 font-black capitalize text-xs tracking-widest backdrop-blur-xl px-6 py-3 rounded-xl border text-white mb-6">
                            <Globe className="w-5 h-5" />
                            <span>Yurt Dışı Eğitim</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6">
                            Uluslararası <span className="text-amber-400 italic">Danışmanlık</span>
                        </h1>
                        <p className="text-2xl text-white/90 font-medium leading-relaxed max-w-3xl">
                            Dünya'nın en prestijli üniversitelerine yerleşme hayalinizi gerçeğe dönüştürüyoruz. ABD, İngiltere, Kanada ve Avrupa üniversitelerine başarılı yerleştirme.
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
                        <span className="text-brand-dark font-bold">Yurt Dışı Eğitim</span>
                    </div>
                </div>
            </div>

            {/* Hizmetlerimiz */}
            <section className="py-32 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-[1600px] mx-auto px-12">
                    <div className="text-center mb-16">
                        <span className="text-brand-blue font-black tracking-[0.4em] text-[12px] uppercase">Hizmetlerimiz</span>
                        <h2 className="text-5xl md:text-6xl font-black text-brand-dark tracking-tighter leading-none mt-4">
                            Yurt Dışı <span className="text-brand-blue">Eğitim Danışmanlığı</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: Target,
                                title: 'Üniversite Danışmanlığı',
                                desc: 'Üniversite seçiminden vize sürecine kadar tüm aşamalarda profesyonel destek',
                                features: ['Üniversite Seçimi', 'Başvuru Süreci', 'Vize Danışmanlığı', 'Burs İmkanları', 'Konaklama Desteği']
                            },
                            {
                                icon: BookOpen,
                                title: 'Dil Eğitimi',
                                desc: 'TOEFL, IELTS, SAT ve diğer uluslararası sınavlara hazırlık programları',
                                features: ['TOEFL Hazırlık', 'IELTS Kursu', 'SAT Eğitimi', 'Akademik İngilizce', 'Speaking Club']
                            },
                            {
                                icon: GraduationCap,
                                title: 'Üniversite Yerleştirme',
                                desc: 'ABD, İngiltere, Kanada ve Avrupa üniversitelerine başarılı yerleştirme',
                                features: ['Profil Oluşturma', 'Essay Desteği', 'Mülakat Hazırlığı', 'Takip Sistemi', 'Kabul Garantisi']
                            }
                        ].map((service, i) => (
                            <div key={i} className="bg-white rounded-[20px] p-10 shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                                <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                                    <service.icon className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-brand-dark mb-4">{service.title}</h3>
                                <p className="text-slate-600 font-medium mb-6 leading-relaxed">{service.desc}</p>
                                <div className="space-y-3">
                                    {service.features.map((feature, j) => (
                                        <div key={j} className="flex items-center space-x-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                                            <span className="text-sm font-bold text-slate-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Hedef Ülkeler */}
            <section className="py-32 bg-white">
                <div className="max-w-[1600px] mx-auto px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tighter leading-none mb-6">
                            Hedef <span className="text-brand-blue">Ülkeler</span>
                        </h2>
                        <p className="text-xl text-slate-600 font-medium max-w-3xl mx-auto">
                            Dünyanın en iyi üniversitelerine yerleştirme konusunda uzmanız
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { country: 'ABD', universities: '150+', flag: '🇺🇸' },
                            { country: 'İngiltere', universities: '80+', flag: '🇬🇧' },
                            { country: 'Kanada', universities: '60+', flag: '🇨🇦' },
                            { country: 'Almanya', universities: '50+', flag: '🇩🇪' },
                            { country: 'Hollanda', universities: '40+', flag: '🇳🇱' },
                            { country: 'Avustralya', universities: '35+', flag: '🇦🇺' },
                            { country: 'Fransa', universities: '30+', flag: '🇫🇷' },
                            { country: 'İtalya', universities: '25+', flag: '🇮🇹' }
                        ].map((country, i) => (
                            <div key={i} className="bg-gradient-to-br from-slate-50 to-white rounded-[20px] p-8 shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group text-center">
                                <div className="text-6xl mb-4">{country.flag}</div>
                                <h3 className="text-xl font-black text-brand-dark mb-2">{country.country}</h3>
                                <p className="text-sm font-bold text-slate-500">{country.universities} Üniversite</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Başarı Hikayeleri */}
            <section className="py-32 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-[1600px] mx-auto px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tighter leading-none mb-6">
                            Başarı <span className="text-brand-blue">Hikayeleri</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: 'Ahmet Y.', university: 'Harvard University', country: 'ABD', program: 'Computer Science' },
                            { name: 'Zeynep K.', university: 'Oxford University', country: 'İngiltere', program: 'Medicine' },
                            { name: 'Mehmet S.', university: 'MIT', country: 'ABD', program: 'Engineering' }
                        ].map((student, i) => (
                            <div key={i} className="bg-white rounded-[20px] p-8 shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-black">
                                        {student.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-brand-dark">{student.name}</h4>
                                        <p className="text-sm font-bold text-green-600">{student.country}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Award className="w-5 h-5 text-brand-blue" />
                                        <span className="text-sm font-bold text-slate-700">{student.university}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <BookOpen className="w-5 h-5 text-brand-blue" />
                                        <span className="text-sm font-bold text-slate-700">{student.program}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Süreç */}
            <section className="py-32 bg-white">
                <div className="max-w-[1600px] mx-auto px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tighter leading-none mb-6">
                            Başvuru <span className="text-brand-blue">Süreci</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        {[
                            { step: '1', title: 'İlk Görüşme', icon: Users },
                            { step: '2', title: 'Profil Analizi', icon: FileText },
                            { step: '3', title: 'Üniversite Seçimi', icon: Target },
                            { step: '4', title: 'Başvuru Hazırlığı', icon: BookOpen },
                            { step: '5', title: 'Kabul & Vize', icon: Plane }
                        ].map((item, i) => (
                            <div key={i} className="relative">
                                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-[20px] p-8 shadow-xl border border-green-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group text-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-black group-hover:scale-110 transition-transform">
                                        {item.step}
                                    </div>
                                    <item.icon className="w-8 h-8 text-green-600 mx-auto mb-3" />
                                    <h4 className="text-sm font-black text-brand-dark">{item.title}</h4>
                                </div>
                                {i < 4 && (
                                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-green-300"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 bg-gradient-to-br from-green-600 via-teal-600 to-blue-700 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
                </div>

                <div className="max-w-[1600px] mx-auto px-12 relative z-10 text-center">
                    <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none mb-8">
                        Hayalinizdeki Üniversiteye <span className="text-amber-400 italic">Birlikte Ulaşalım</span>
                    </h2>
                    <p className="text-xl text-white/90 font-medium max-w-3xl mx-auto mb-12">
                        Ücretsiz danışmanlık için hemen iletişime geçin ve yurt dışı eğitim sürecinizi başlatın.
                    </p>
                    <div className="flex flex-wrap gap-6 justify-center">
                        <Link to="/iletisim" className="px-12 py-5 bg-white text-brand-dark font-black rounded-2xl hover:bg-amber-400 hover:text-white transition-all duration-300 shadow-xl hover:scale-105">
                            Ücretsiz Danışmanlık Al
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

export default InternationalPage;
