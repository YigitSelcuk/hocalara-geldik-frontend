import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Award, Star, BookOpen, Users } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

const TeachersPage: React.FC = () => {
    // SEO Hook
    useSEO('teachers');
    
    const teachers = [
        {
            id: 1,
            name: 'Dr. Ahmet Yılmaz',
            subject: 'Matematik',
            experience: '15 Yıl',
            education: 'Boğaziçi Üniversitesi - Matematik Doktora',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
            achievements: ['TYT Matematik Uzmanı', '5000+ Öğrenci', 'Kitap Yazarı']
        },
        {
            id: 2,
            name: 'Prof. Ayşe Demir',
            subject: 'Fizik',
            experience: '12 Yıl',
            education: 'ODTÜ - Fizik Profesörü',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
            achievements: ['AYT Fizik Koordinatörü', '3000+ Öğrenci', 'Ödüllü Eğitmen']
        },
        {
            id: 3,
            name: 'Mehmet Öztürk',
            subject: 'Kimya',
            experience: '10 Yıl',
            education: 'İTÜ - Kimya Mühendisliği',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            achievements: ['Organik Kimya Uzmanı', '4000+ Öğrenci', 'Video İçerik Üreticisi']
        },
        {
            id: 4,
            name: 'Zeynep Kaya',
            subject: 'Türkçe & Edebiyat',
            experience: '14 Yıl',
            education: 'Ankara Üniversitesi - Türk Dili ve Edebiyatı',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
            achievements: ['TYT Türkçe Uzmanı', '6000+ Öğrenci', 'Deneme Yazarı']
        },
        {
            id: 5,
            name: 'Can Arslan',
            subject: 'Biyoloji',
            experience: '11 Yıl',
            education: 'Hacettepe Üniversitesi - Biyoloji',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
            achievements: ['AYT Biyoloji Uzmanı', '3500+ Öğrenci', 'Laboratuvar Koordinatörü']
        },
        {
            id: 6,
            name: 'Elif Yıldız',
            subject: 'Tarih',
            experience: '9 Yıl',
            education: 'İstanbul Üniversitesi - Tarih',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
            achievements: ['Sosyal Bilimler Uzmanı', '2800+ Öğrenci', 'Rehberlik Danışmanı']
        },
        {
            id: 7,
            name: 'Burak Şahin',
            subject: 'Geometri',
            experience: '13 Yıl',
            education: 'Bilkent Üniversitesi - Matematik',
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
            achievements: ['Geometri Koordinatörü', '4500+ Öğrenci', 'Soru Bankası Yazarı']
        },
        {
            id: 8,
            name: 'Selin Aydın',
            subject: 'İngilizce',
            experience: '8 Yıl',
            education: 'Boğaziçi Üniversitesi - İngiliz Dili ve Edebiyatı',
            image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
            achievements: ['TOEFL Eğitmeni', '3200+ Öğrenci', 'Yurt Dışı Danışmanı']
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[500px] bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
                </div>

                <div className="relative z-10 max-w-[1600px] mx-auto px-12 h-full flex flex-col justify-center">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center space-x-3 bg-white/20 border-white/30 font-black capitalize text-xs tracking-widest backdrop-blur-xl px-6 py-3 rounded-xl border text-white mb-6">
                            <Users className="w-5 h-5" />
                            <span>Eğitim Kadromuz</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6">
                            Eğitmenlerimiz
                        </h1>
                        <p className="text-2xl text-white/90 font-medium leading-relaxed">
                            Alanında uzman, deneyimli ve öğrenci odaklı eğitim kadromuzla tanışın.
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
                        <span className="text-brand-dark font-bold">Eğitmenler</span>
                    </div>
                </div>
            </div>

            {/* Intro */}
            <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-[1600px] mx-auto px-12 text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tighter leading-none mb-6">
                        Uzman <span className="text-brand-blue">Eğitim Kadromuz</span>
                    </h2>
                    <p className="text-xl text-slate-600 font-medium max-w-3xl mx-auto">
                        Her biri alanında uzman, deneyimli ve öğrenci başarısına odaklanmış eğitmenlerimizle tanışın. Binlerce öğrencinin hayallerine ulaşmasına yardımcı olan kadromuz, sizin de başarınız için burada.
                    </p>
                </div>
            </section>

            {/* Eğitmenler Grid */}
            <section className="py-20 bg-white">
                <div className="max-w-[1600px] mx-auto px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teachers.map((teacher) => (
                            <div key={teacher.id} className="group bg-white rounded-[20px] overflow-hidden shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                                {/* Fotoğraf */}
                                <div className="relative aspect-square overflow-hidden">
                                    <img
                                        src={teacher.image}
                                        alt={teacher.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="absolute top-4 right-4">
                                        <div className="w-12 h-12 bg-brand-blue rounded-full flex items-center justify-center shadow-xl">
                                            <GraduationCap className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </div>

                                {/* İçerik */}
                                <div className="p-6 space-y-4">
                                    <div>
                                        <h3 className="text-xl font-black text-brand-dark mb-1 group-hover:text-brand-blue transition-colors">
                                            {teacher.name}
                                        </h3>
                                        <p className="text-brand-blue font-bold text-sm">{teacher.subject}</p>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center space-x-2 text-slate-600">
                                            <Award className="w-4 h-4 text-brand-blue" />
                                            <span className="font-medium">{teacher.experience} Deneyim</span>
                                        </div>
                                        <div className="flex items-start space-x-2 text-slate-600">
                                            <BookOpen className="w-4 h-4 text-brand-blue mt-0.5 shrink-0" />
                                            <span className="font-medium text-xs leading-relaxed">{teacher.education}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 space-y-2">
                                        {teacher.achievements.map((achievement, i) => (
                                            <div key={i} className="flex items-center space-x-2">
                                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                <span className="text-xs font-bold text-slate-600">{achievement}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Özellikler */}
            <section className="py-32 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-[1600px] mx-auto px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tighter leading-none mb-6">
                            Neden <span className="text-brand-blue">Eğitmenlerimiz?</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            {
                                title: 'Alanında Uzman',
                                desc: 'Her eğitmenimiz kendi alanında yüksek lisans veya doktora derecesine sahip, deneyimli akademisyenlerdir.',
                                icon: GraduationCap
                            },
                            {
                                title: 'Öğrenci Odaklı',
                                desc: 'Her öğrencinin farklı öğrenme stiline uygun, kişiselleştirilmiş eğitim yaklaşımı uygularız.',
                                icon: Users
                            },
                            {
                                title: 'Kanıtlanmış Başarı',
                                desc: 'Binlerce öğrencinin üniversite hayallerine ulaşmasına yardımcı olan deneyimli kadromuz.',
                                icon: Award
                            }
                        ].map((feature, i) => (
                            <div key={i} className="bg-white rounded-[20px] p-10 shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-brand-blue to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all">
                                    <feature.icon className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-brand-dark mb-4">{feature.title}</h3>
                                <p className="text-slate-600 font-medium leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 bg-white">
                <div className="max-w-[1600px] mx-auto px-12 text-center">
                    <h2 className="text-5xl md:text-6xl font-black text-brand-dark tracking-tighter leading-none mb-8">
                        Uzman Kadromuzla <span className="text-brand-blue">Başarıya Ulaşın</span>
                    </h2>
                    <p className="text-xl text-slate-600 font-medium max-w-3xl mx-auto mb-12">
                        Deneyimli eğitmenlerimizle tanışmak ve kayıt olmak için hemen iletişime geçin.
                    </p>
                    <Link to="/iletisim" className="inline-flex px-12 py-5 bg-brand-blue text-white font-black rounded-2xl hover:bg-brand-indigo transition-all duration-300 shadow-xl hover:scale-105">
                        Hemen İletişime Geçin
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default TeachersPage;
