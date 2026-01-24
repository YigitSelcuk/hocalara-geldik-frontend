import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';
import { homeSectionService } from '../services/homepage.service';
import { useSEO } from '../hooks/useSEO';

const ContactPage: React.FC = () => {
    // SEO Hook
    useSEO('contact');
    
    const [pageContent, setPageContent] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

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
                    const sections = contentData.filter((s: any) => s.page === 'contact');
                    const contentMap: any = {};
                    sections.forEach((s: any) => {
                        contentMap[s.section] = s;
                    });
                    setPageContent(contentMap);
                }
            } catch (error) {
                console.error('Error fetching contact content:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3003/api/contact/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
                setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            } else {
                alert('Mesaj gönderilemedi. Lütfen tekrar deneyin.');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            alert('Bir hata oluştu. Lütfen tekrar deneyin.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[500px] bg-gradient-to-br from-green-600 via-teal-600 to-blue-600 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
                </div>

                <div className="relative z-10 max-w-[1600px] mx-auto px-12 h-full flex flex-col justify-center">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center space-x-3 bg-white/20 border-white/30 font-black capitalize text-xs tracking-widest backdrop-blur-xl px-6 py-3 rounded-xl border text-white mb-6">
                            <MessageCircle className="w-5 h-5" />
                            <span>{getContent('contact-hero-badge', 'title', 'Bize Ulaşın')}</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6">
                            {getContent('contact-hero-title', 'title', 'İletişim')}
                        </h1>
                        <p className="text-2xl text-white/90 font-medium leading-relaxed">
                            {getContent('contact-hero-subtitle', 'subtitle', 'Sorularınız için bize ulaşın. Size yardımcı olmaktan mutluluk duyarız.')}
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
                        <span className="text-brand-dark font-bold">İletişim</span>
                    </div>
                </div>
            </div>

            {/* İletişim Bilgileri ve Form */}
            <section className="py-32 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-[1600px] mx-auto px-12">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Sol - İletişim Bilgileri */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-black text-brand-dark mb-6">{getContent('contact-info-title', 'title', 'İletişim Bilgileri')}</h2>
                                <p className="text-slate-600 font-medium leading-relaxed">
                                    {getContent('contact-info-desc', 'subtitle', 'Sorularınız, önerileriniz veya kayıt başvurunuz için bizimle iletişime geçebilirsiniz.')}
                                </p>
                            </div>

                            <div className="space-y-6">
                                {/* Adres */}
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-brand-blue to-purple-600 rounded-xl flex items-center justify-center shrink-0">
                                        <MapPin className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-brand-dark mb-1">{getContent('contact-address-title', 'title', 'Adres')}</h3>
                                        <p className="text-slate-600 font-medium">
                                            {getContent('contact-address-line1', 'subtitle', 'İstanbul Genel Merkez Ofisi')}<br />
                                            {getContent('contact-address-line2', 'subtitle', 'Beşiktaş Plaza, Kat: 5')}<br />
                                            {getContent('contact-address-line3', 'subtitle', 'Beşiktaş / İstanbul')}
                                        </p>
                                    </div>
                                </div>

                                {/* Telefon */}
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-teal-600 rounded-xl flex items-center justify-center shrink-0">
                                        <Phone className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-brand-dark mb-1">{getContent('contact-phone-title', 'title', 'Telefon')}</h3>
                                        <p className="text-slate-600 font-medium">
                                            {getContent('contact-phone-line1', 'subtitle', '0212 000 00 00')}<br />
                                            {getContent('contact-phone-line2', 'subtitle', '0850 000 00 00 (Ücretsiz)')}
                                        </p>
                                    </div>
                                </div>

                                {/* E-posta */}
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shrink-0">
                                        <Mail className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-brand-dark mb-1">{getContent('contact-email-title', 'title', 'E-posta')}</h3>
                                        <p className="text-slate-600 font-medium">
                                            {getContent('contact-email-line1', 'subtitle', 'bilgi@hocalarageldik.com')}<br />
                                            {getContent('contact-email-line2', 'subtitle', 'destek@hocalarageldik.com')}
                                        </p>
                                    </div>
                                </div>

                                {/* Çalışma Saatleri */}
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center shrink-0">
                                        <Clock className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-brand-dark mb-1">{getContent('contact-hours-title', 'title', 'Çalışma Saatleri')}</h3>
                                        <p className="text-slate-600 font-medium">
                                            {getContent('contact-hours-line1', 'subtitle', 'Pazartesi - Cuma: 09:00 - 18:00')}<br />
                                            {getContent('contact-hours-line2', 'subtitle', 'Cumartesi: 10:00 - 16:00')}<br />
                                            {getContent('contact-hours-line3', 'subtitle', 'Pazar: Kapalı')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Sosyal Medya */}
                            <div>
                                <h3 className="font-black text-brand-dark mb-4">{getContent('contact-social-title', 'title', 'Sosyal Medya')}</h3>
                                <div className="flex space-x-3">
                                    {[
                                        { icon: Instagram, color: 'hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600' },
                                        { icon: Facebook, color: 'hover:bg-blue-600' },
                                        { icon: Twitter, color: 'hover:bg-blue-400' },
                                        { icon: Linkedin, color: 'hover:bg-blue-700' }
                                    ].map((social, i) => (
                                        <a
                                            key={i}
                                            href="#"
                                            className={`w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center ${social.color} hover:text-white transition-all duration-300 hover:scale-110`}
                                        >
                                            <social.icon className="w-5 h-5" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sağ - İletişim Formu */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-[20px] p-10 shadow-2xl border border-slate-100">
                                <h2 className="text-3xl font-black text-brand-dark mb-8">{getContent('contact-form-title', 'title', 'Bize Mesaj Gönderin')}</h2>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-brand-dark mb-2">
                                                Ad Soyad <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-blue focus:outline-none transition-colors font-medium"
                                                placeholder="Adınız ve soyadınız"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-brand-dark mb-2">
                                                E-posta <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-blue focus:outline-none transition-colors font-medium"
                                                placeholder="ornek@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-brand-dark mb-2">
                                                Telefon <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-blue focus:outline-none transition-colors font-medium"
                                                placeholder="0500 000 00 00"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-brand-dark mb-2">
                                                Konu <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-blue focus:outline-none transition-colors font-medium"
                                            >
                                                <option value="">Konu seçiniz</option>
                                                <option value="kayit">Kayıt Başvurusu</option>
                                                <option value="bilgi">Genel Bilgi</option>
                                                <option value="franchise">Franchise Başvurusu</option>
                                                <option value="sikayet">Şikayet ve Öneri</option>
                                                <option value="diger">Diğer</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-brand-dark mb-2">
                                            Mesajınız <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={6}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-blue focus:outline-none transition-colors font-medium resize-none"
                                            placeholder="Mesajınızı buraya yazın..."
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-brand-blue to-purple-600 text-white font-black rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3"
                                    >
                                        <span>{getContent('contact-form-button', 'buttonText', 'Mesajı Gönder')}</span>
                                        <Send className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Harita */}
            <section className="py-20 bg-white">
                <div className="max-w-[1600px] mx-auto px-12">
                    <div className="rounded-[20px] overflow-hidden shadow-2xl border border-slate-100 h-[500px]">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.8267168352373!2d29.00784931571915!3d41.04243597929697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7650656bd63%3A0x8e0d7d1d8d8d8d8d!2zQmXFn2lrdGHFnywgxLBzdGFuYnVs!5e0!3m2!1str!2str!4v1234567890123!5m2!1str!2str"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
