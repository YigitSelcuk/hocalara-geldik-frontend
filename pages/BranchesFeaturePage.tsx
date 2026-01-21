import React from 'react';
import { Link } from 'react-router-dom';
import { School, MapPin, Users, CheckCircle2, TrendingUp, Award, Target, Sparkles, Phone, Mail } from 'lucide-react';

const BranchesPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[600px] bg-gradient-to-br from-brand-blue via-indigo-600 to-purple-700 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
                </div>

                <div className="relative z-10 max-w-[1600px] mx-auto px-12 h-full flex flex-col justify-center">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center space-x-3 bg-white/20 border-white/30 font-black capitalize text-xs tracking-widest backdrop-blur-xl px-6 py-3 rounded-xl border text-white mb-6">
                            <School className="w-5 h-5" />
                            <span>Başarı Merkezlerimiz</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6">
                            81 İlde Güçlü <span className="text-amber-400 italic">Şube Ağı</span>
                        </h1>
                        <p className="text-2xl text-white/90 font-medium leading-relaxed max-w-3xl">
                            Türkiye'nin her köşesinde, modern eğitim altyapısı ve uzman kadromuzla öğrencilerimize en kaliteli eğitimi sunuyoruz.
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
                        <span className="text-brand-dark font-bold">Başarı Merkezleri</span>
                    </div>
                </div>
            </div>

            {/* İstatistikler */}
            <section className="py-32 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-[1600px] mx-auto px-12">
                    <div className="text-center mb-16">
                        <span className="text-brand-blue font-black tracking-[0.4em] text-[12px] uppercase">Rakamlarla Biz</span>
                        <h2 className="text-5xl md:text-6xl font-black text-brand-dark tracking-tighter leading-none mt-4">
                            Türkiye'nin <span className="text-brand-blue">En Büyük</span> Eğitim Ağı
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { value: '81', label: 'İl', icon: MapPin, color: 'from-blue-500 to-indigo-500' },
                            { value: '250+', label: 'Şube', icon: School, color: 'from-purple-500 to-pink-500' },
                            { value: '1500+', label: 'Öğretmen', icon: Users, color: 'from-green-500 to-emerald-500' },
                            { value: '50K+', label: 'Öğrenci', icon: TrendingUp, color: 'from-orange-500 to-red-500' }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white rounded-[20px] p-10 shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group text-center">
                                <div className={`w-20 h-20 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg`}>
                                    <stat.icon className="w-10 h-10 text-white" />
                                </div>
                                <div className="text-5xl font-black text-brand-dark mb-2">{stat.value}</div>
                                <div className="text-sm font-bold text-slate-600 uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Şube Ağımızın Avantajları */}
            <section className="py-32 bg-white">
                <div className="max-w-[1600px] mx-auto px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tighter leading-none mb-6">
                            Neden <span className="text-brand-blue">Başarı Merkezlerimiz?</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[
                            {
                                icon: School,
                                title: 'Merkezi Eğitim Sistemi',
                                desc: 'Tüm şubelerimizde standart kalite ve aynı eğitim müfredatı ile tutarlı başarı garantisi.',
                                features: ['Standart Müfredat', 'Kalite Kontrolü', 'Merkezi Yönetim']
                            },
                            {
                                icon: Users,
                                title: 'Uzman Öğretmen Kadrosu',
                                desc: 'Her şubemizde alanında uzman, deneyimli ve öğrenci odaklı öğretmen kadrosu.',
                                features: ['Deneyimli Kadro', 'Sürekli Eğitim', 'Performans Takibi']
                            },
                            {
                                icon: Target,
                                title: 'Modern Altyapı',
                                desc: 'Teknolojik donanım, modern derslikler ve dijital eğitim araçları ile donatılmış şubeler.',
                                features: ['Akıllı Tahta', 'Laboratuvar', 'Kütüphane']
                            },
                            {
                                icon: Award,
                                title: 'Kanıtlanmış Başarı',
                                desc: 'Binlerce öğrencinin üniversite hayallerine ulaşmasını sağlayan başarı geçmişi.',
                                features: ['Yüksek Başarı Oranı', 'Derece Yapan Öğrenciler', 'Referanslar']
                            },
                            {
                                icon: CheckCircle2,
                                title: 'Veli Bilgilendirme',
                                desc: 'Düzenli veli toplantıları ve dijital takip sistemi ile şeffaf iletişim.',
                                features: ['Veli Paneli', 'SMS Bildirimleri', 'Düzenli Raporlama']
                            },
                            {
                                icon: Sparkles,
                                title: 'Sosyal Aktiviteler',
                                desc: 'Eğitimin yanı sıra sosyal ve kültürel aktivitelerle öğrenci gelişimi.',
                                features: ['Etkinlikler', 'Geziler', 'Seminerler']
                            }
                        ].map((feature, i) => (
                            <div key={i} className="bg-gradient-to-br from-slate-50 to-white rounded-[20px] p-8 shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                                <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
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

            {/* Şubelerimizi Keşfedin CTA */}
            <section className="py-32 bg-gradient-to-br from-brand-blue via-purple-600 to-indigo-700 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
                </div>

                <div className="max-w-[1600px] mx-auto px-12 relative z-10 text-center">
                    <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none mb-8">
                        Size En Yakın <span className="text-amber-400 italic">Şubemizi</span> Bulun
                    </h2>
                    <p className="text-xl text-white/90 font-medium max-w-3xl mx-auto mb-12">
                        81 ilde 250'den fazla şubemizle size en yakın eğitim merkezini keşfedin ve hemen kayıt olun.
                    </p>
                    <div className="flex flex-wrap gap-6 justify-center">
                        <Link to="/subeler" className="px-12 py-5 bg-white text-brand-dark font-black rounded-2xl hover:bg-amber-400 hover:text-white transition-all duration-300 shadow-xl hover:scale-105">
                            Tüm Şubelerimizi Görüntüle
                        </Link>
                        <Link to="/iletisim" className="px-12 py-5 bg-white/10 backdrop-blur-md text-white border-2 border-white/20 font-black rounded-2xl hover:bg-white hover:text-brand-dark transition-all duration-300 hover:scale-105">
                            Bize Ulaşın
                        </Link>
                    </div>
                </div>
            </section>

            {/* İletişim Bilgileri */}
            <section className="py-20 bg-white">
                <div className="max-w-[1600px] mx-auto px-12">
                    <div className="bg-gradient-to-br from-slate-50 to-white rounded-[20px] p-12 shadow-xl border border-slate-100">
                        <div className="grid md:grid-cols-2 gap-12">
                            <div>
                                <h3 className="text-3xl font-black text-brand-dark mb-6">Genel Merkez İletişim</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-brand-blue rounded-xl flex items-center justify-center">
                                            <Phone className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-500">Telefon</p>
                                            <p className="text-lg font-black text-brand-dark">0212 000 00 00</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                                            <Mail className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-500">E-posta</p>
                                            <p className="text-lg font-black text-brand-dark">bilgi@hocalarageldik.com</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-brand-dark mb-6">Franchise Başvurusu</h3>
                                <p className="text-slate-600 font-medium mb-6">
                                    Başarı merkezlerimiz ailesine katılmak ve kendi şubenizi açmak için franchise başvurusunda bulunabilirsiniz.
                                </p>
                                <Link to="/franchise" className="inline-flex px-8 py-4 bg-brand-blue text-white font-black rounded-xl hover:bg-brand-indigo transition-all duration-300 shadow-lg hover:scale-105">
                                    Franchise Başvurusu Yap
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BranchesPage;
