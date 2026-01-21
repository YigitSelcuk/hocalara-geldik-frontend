import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Users, Award, Sparkles, CheckCircle2, TrendingUp, Heart, Zap } from 'lucide-react';

const AboutPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[500px] bg-gradient-to-br from-brand-blue via-purple-600 to-indigo-700 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
                </div>

                <div className="relative z-10 max-w-[1600px] mx-auto px-12 h-full flex flex-col justify-center">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center space-x-3 bg-white/20 border-white/30 font-black capitalize text-xs tracking-widest backdrop-blur-xl px-6 py-3 rounded-xl border text-white mb-6">
                            <Sparkles className="w-5 h-5" />
                            <span>Kurumsal</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6">
                            Hakkımızda
                        </h1>
                        <p className="text-2xl text-white/90 font-medium leading-relaxed">
                            Türkiye'nin öncü eğitim markası olarak, binlerce öğrencinin hayallerine ulaşmasına yardımcı oluyoruz.
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
                        <span className="text-brand-dark font-bold">Hakkımızda</span>
                    </div>
                </div>
            </div>

            {/* Misyon & Vizyon */}
            <section className="py-32 bg-white">
                <div className="max-w-[1600px] mx-auto px-12">
                    <div className="grid lg:grid-cols-2 gap-16">
                        <div className="space-y-8">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-purple-600 rounded-xl flex items-center justify-center">
                                    <Target className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-4xl font-black text-brand-dark">Misyonumuz</h2>
                            </div>
                            <p className="text-xl text-slate-600 font-medium leading-relaxed">
                                Öğrencilerimize en kaliteli eğitimi sunarak, akademik hedeflerine ulaşmalarını sağlamak ve geleceğin lider bireylerini yetiştirmek.
                            </p>
                            <div className="space-y-4">
                                {[
                                    'Kaliteli ve erişilebilir eğitim',
                                    'Öğrenci odaklı yaklaşım',
                                    'Sürekli gelişim ve yenilik',
                                    'Toplumsal sorumluluk bilinci'
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center space-x-3">
                                        <CheckCircle2 className="w-6 h-6 text-brand-blue" />
                                        <span className="text-brand-dark font-bold">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                                    <Zap className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-4xl font-black text-brand-dark">Vizyonumuz</h2>
                            </div>
                            <p className="text-xl text-slate-600 font-medium leading-relaxed">
                                Türkiye'nin en güvenilir ve tercih edilen eğitim kurumu olmak, dijital dönüşümde öncü rol oynamak ve uluslararası standartlarda eğitim hizmeti sunmak.
                            </p>
                            <div className="space-y-4">
                                {[
                                    'Teknoloji destekli eğitim',
                                    'Uluslararası standartlar',
                                    'Sektörde liderlik',
                                    'Sürdürülebilir başarı'
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center space-x-3">
                                        <CheckCircle2 className="w-6 h-6 text-purple-600" />
                                        <span className="text-brand-dark font-bold">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Değerlerimiz */}
            <section className="py-32 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-[1600px] mx-auto px-12">
                    <div className="text-center mb-16">
                        <span className="text-brand-blue font-black tracking-[0.4em] text-[12px] uppercase">Değerlerimiz</span>
                        <h2 className="text-5xl md:text-6xl font-black text-brand-dark tracking-tighter leading-none mt-4">
                            Temel <span className="text-brand-blue">Değerlerimiz</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Heart, title: 'Öğrenci Odaklılık', desc: 'Her öğrencimizin ihtiyaçlarına özel çözümler üretiyoruz' },
                            { icon: Award, title: 'Kalite', desc: 'En yüksek eğitim standartlarını koruyoruz' },
                            { icon: Users, title: 'Takım Çalışması', desc: 'Güçlü ekip ruhuyla hareket ediyoruz' },
                            { icon: TrendingUp, title: 'Sürekli Gelişim', desc: 'Kendimizi ve sistemlerimizi sürekli geliştiriyoruz' }
                        ].map((value, i) => (
                            <div key={i} className="bg-white rounded-[20px] p-8 shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                                <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all">
                                    <value.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-black text-brand-dark mb-3">{value.title}</h3>
                                <p className="text-slate-600 font-medium leading-relaxed">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* İstatistikler */}
            <section className="py-32 bg-brand-indigo text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
                </div>

                <div className="max-w-[1600px] mx-auto px-12 relative z-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-16">
                        {[
                            { value: '15+', label: 'Yıllık Deneyim' },
                            { value: '81', label: 'İlde Şube' },
                            { value: '50K+', label: 'Mezun Öğrenci' },
                            { value: '%98', label: 'Başarı Oranı' }
                        ].map((stat, i) => (
                            <div key={i} className="text-center space-y-4">
                                <div className="text-6xl font-black tracking-tighter">{stat.value}</div>
                                <div className="text-sm font-bold tracking-widest text-white/70 uppercase">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 bg-white">
                <div className="max-w-[1600px] mx-auto px-12 text-center">
                    <h2 className="text-5xl md:text-6xl font-black text-brand-dark tracking-tighter leading-none mb-8">
                        Başarı Hikayenizin <span className="text-brand-blue">Parçası Olun</span>
                    </h2>
                    <p className="text-xl text-slate-600 font-medium max-w-3xl mx-auto mb-12">
                        Binlerce öğrencinin tercih ettiği Hocalara Geldik ailesine katılın ve hayallerinize ulaşın.
                    </p>
                    <div className="flex flex-wrap gap-6 justify-center">
                        <Link to="/subeler" className="px-12 py-5 bg-brand-blue text-white font-black rounded-2xl hover:bg-brand-indigo transition-all duration-300 shadow-xl hover:scale-105">
                            Şubelerimizi Keşfedin
                        </Link>
                        <Link to="/iletisim" className="px-12 py-5 border-2 border-brand-dark text-brand-dark font-black rounded-2xl hover:bg-brand-dark hover:text-white transition-all duration-300 hover:scale-105">
                            Bize Ulaşın
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
