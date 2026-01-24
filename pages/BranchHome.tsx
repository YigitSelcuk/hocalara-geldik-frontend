
import React, { useState, useEffect } from 'react';
import { Branch, SliderItem, NewsItem } from '../types';
import { MapPin, MessageCircle, Calendar, Users, Phone, GraduationCap, Zap, Cpu, ChevronRight, FileText, TrendingUp, Mail } from 'lucide-react';
import { sliderService, pageService } from '../services/cms.service';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Alert from '../components/Alert';
import { useAlert } from '../hooks/useAlert';

interface BranchHomeProps {
  branch: Branch;
}

const BranchHome: React.FC<BranchHomeProps> = ({ branch }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [sliders, setSliders] = useState<SliderItem[]>([]);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '',
    email: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsRes, slidersRes] = await Promise.all([
          axios.get(`/api/blog-posts?branchId=${branch.id}&isActive=true`),
          sliderService.getAll({ target: branch.id, isActive: true })
        ]);
        setNews(newsRes.data.data || []);
        setSliders(slidersRes.data.sliders);
      } catch (error) {
        console.error('Error fetching branch specific data:', error);
      }
    };
    fetchData();
  }, [branch.id]);

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.surname || !formData.phone) {
      showAlert('error', 'Lütfen zorunlu alanları doldurun');
      return;
    }

    setSubmitting(true);
    
    try {
      const response = await axios.post('/api/leads', {
        ...formData,
        branchId: branch.id
      });
      
      if (response.data.success) {
        showAlert('success', response.data.message || 'Ön kaydınız başarıyla alındı! En kısa sürede sizinle iletişime geçeceğiz.');
        setShowRegistrationForm(false);
        setFormData({ name: '', surname: '', phone: '', email: '' });
      }
    } catch (error: any) {
      console.error('Lead submission error:', error);
      showAlert('error', error.response?.data?.error || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  };

  const slidersToDisplay = sliders.length > 0 ? sliders : [
    {
      id: 'default',
      title: branch.name,
      subtitle: branch.description,
      image: branch.customBanner || branch.image || '',
      link: '#',
      target: branch.id,
      order: 1,
      isActive: true
    }
  ];

  useEffect(() => {
    if (slidersToDisplay.length > 1) {
      const timer = setInterval(() => {
        setActiveSlide(prev => (prev + 1) % slidersToDisplay.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [slidersToDisplay.length]);


  return (
    <div className="mesh-bg min-h-screen">
      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={hideAlert}
        />
      )}
      
      {/* Registration Form Modal */}
      {showRegistrationForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-brand-blue" />
                </div>
                <h3 className="text-2xl font-black text-brand-dark mb-2">Ön Kayıt Formu</h3>
                <p className="text-slate-600">{branch.name} şubemize ön kayıt yapın</p>
              </div>

              <form onSubmit={handleSubmitRegistration} className="space-y-4">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Ad *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue"
                    placeholder="Adınız"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Soyad *</label>
                  <input
                    type="text"
                    value={formData.surname}
                    onChange={e => setFormData({ ...formData, surname: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue"
                    placeholder="Soyadınız"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Telefon *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue"
                    placeholder="0555 555 55 55"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase mb-2 block">E-posta</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue"
                    placeholder="ornek@email.com"
                  />
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowRegistrationForm(false)}
                    className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-6 py-3 bg-brand-blue text-white rounded-xl font-bold hover:bg-brand-dark transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Gönderiliyor...' : 'Kayıt Ol'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Hero Slider - Enhanced */}
      <section className="relative h-[700px] bg-brand-dark overflow-hidden">
        {slidersToDisplay.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-[2000ms] ease-out ${index === activeSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent"></div>

            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
                <div className="max-w-3xl space-y-10">
                  <div className={`inline-flex items-center space-x-4 px-6 py-3 bg-brand-blue/20 backdrop-blur-xl text-brand-blue border border-brand-blue/30 rounded-2xl text-[13px] font-black tracking-widest shadow-2xl transition-all duration-1000 delay-300 ${index === activeSlide ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}>
                    <Zap className="w-5 h-5" />
                    <span>Hocalara Geldik {branch.name}</span>
                  </div>

                  <h1 className={`text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] transition-all duration-1000 delay-500 ${index === activeSlide ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                    {slide.title.split(' ').map((word, i) => (
                      <span key={i} className={i >= 1 ? 'text-brand-blue italic' : ''}>{word} </span>
                    ))}
                  </h1>

                  <p className={`text-2xl text-slate-300 font-medium max-w-2xl leading-relaxed transition-all duration-1000 delay-700 ${index === activeSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    {slide.subtitle}
                  </p>

                  <div className={`flex flex-wrap gap-6 pt-6 transition-all duration-1000 delay-900 ${index === activeSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <a
                      href={`tel:${branch.phone}`}
                      className="px-12 py-5 bg-brand-blue text-white font-black rounded-2xl flex items-center space-x-3 hover:bg-white hover:text-brand-dark transition-all shadow-2xl hover:scale-105 hover:-translate-y-1 text-[14px] tracking-wide group"
                    >
                      <Phone className="w-5 h-5 group-hover:animate-bounce" />
                      <span>Hemen Ara</span>
                    </a>
                    <a
                      href={`https://wa.me/${branch.whatsapp}`}
                      target="_blank" rel="noreferrer"
                      className="px-12 py-5 bg-green-500 text-white font-black rounded-2xl flex items-center space-x-3 hover:bg-green-600 transition-all shadow-2xl hover:scale-105 hover:-translate-y-1 text-[14px] tracking-wide"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Navigation */}
        {
          slidersToDisplay.length > 1 && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
              {slidersToDisplay.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`h-2 rounded-full transition-all duration-500 hover:h-3 ${i === activeSlide ? 'w-12 bg-brand-blue shadow-lg shadow-brand-blue/50' : 'w-4 bg-white/30 hover:bg-white/50'}`}
                />
              ))}
            </div>
          )
        }
      </section >

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">

          {/* Genel Bakış - Minimal */}
          <section id="overview" className="scroll-mt-32">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-brand-dark mb-2">Genel Bakış</h2>
                  <div className="h-1 w-16 bg-brand-blue rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-brand-dark">Eğitim Vizyonumuz</h3>
                    <p className="text-slate-600 leading-relaxed">
                      {branch.name} olarak, her öğrencinin potansiyelini en üst düzeye çıkarmayı hedefliyoruz.
                      Modern dersliklerimiz ve uzman kadromuzla başarıya ulaşmanızı sağlıyoruz.
                    </p>
                  </div>
                  <div className="space-y-3">
                    {[
                      { text: 'Kişiye Özel Ders Programı', icon: Calendar },
                      { text: 'Sınırsız Birebir Etüt', icon: Users },
                      { text: 'Yapay Zeka Takip Sistemi', icon: Cpu },
                      { text: 'Profesyonel Rehberlik', icon: GraduationCap }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl hover:bg-brand-blue/5 transition-colors">
                        <item.icon className="w-5 h-5 text-brand-blue" />
                        <span className="text-slate-700 font-medium text-sm">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Eğitmen Kadrosu - Minimal */}
          <section id="team" className="scroll-mt-32">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-brand-dark mb-2">Eğitmen Kadromuz</h2>
                  <div className="h-1 w-16 bg-brand-blue rounded-full"></div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {branch.teachers && branch.teachers.length > 0 ? branch.teachers.map((t, i) => (
                    <div key={i} className="group text-center space-y-3">
                      <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-slate-200 group-hover:border-brand-blue transition-colors">
                        <img src={t.image} className="w-full h-full object-cover" alt={t.name} />
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-dark text-sm">{t.name}</h4>
                        <p className="text-xs text-slate-500 mt-1">{t.subject}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-full p-12 bg-slate-50 rounded-xl text-center">
                      <p className="text-slate-400 font-medium">Eğitmen bilgileri yükleniyor...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Şubeden Haberler - Minimal */}
          <section id="news" className="scroll-mt-32">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-brand-dark mb-2">Şubeden Haberler</h2>
                    <div className="h-1 w-16 bg-brand-blue rounded-full"></div>
                  </div>
                  {news.length > 0 && (
                    <Link to="/haberler" className="text-brand-blue font-bold text-sm hover:underline flex items-center space-x-1">
                      <span>Tümünü Gör</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {news.length > 0 ? news.slice(0, 3).map(n => (
                    <Link key={n.id} to={`/haberler/${n.id}`} className="group bg-slate-50 rounded-xl overflow-hidden hover:shadow-lg transition-all">
                      <div className="aspect-video w-full overflow-hidden bg-slate-100">
                        <img src={n.image || '/uploads/placeholder.jpg'} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" alt={n.title} />
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-slate-400 font-medium mb-2">{n.publishedAt ? new Date(n.publishedAt).toLocaleDateString('tr-TR') : ''}</p>
                        <h3 className="text-base font-bold text-brand-dark group-hover:text-brand-blue transition-colors line-clamp-2 mb-2">{n.title}</h3>
                        <p className="text-sm text-slate-600 line-clamp-2">{n.excerpt}</p>
                      </div>
                    </Link>
                  )) : (
                    <div className="col-span-full p-12 bg-slate-50 rounded-xl text-center">
                      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-400 font-medium">Henüz duyuru bulunmamaktadır.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Gurur Tablosu - Minimal */}
          <section id="success" className="scroll-mt-32">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-brand-dark mb-2">Gurur Tablomuz</h2>
                    <div className="h-1 w-16 bg-brand-blue rounded-full"></div>
                  </div>
                  <Link
                    to={`/subeler/${branch.slug}/basarilar`}
                    className="text-brand-blue font-bold text-sm hover:underline flex items-center space-x-1"
                  >
                    <span>Tüm Başarılar</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <Link
                  to={`/subeler/${branch.slug}/basarilar`}
                  className="block relative group rounded-xl overflow-hidden aspect-[21/9]"
                >
                  {branch.successBanner ? (
                    <>
                      <img
                        src={branch.successBanner}
                        alt="Gurur Tablosu"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <p className="text-white font-bold text-lg">Başarı derecelerimizi görüntüle →</p>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center text-center space-y-4 group-hover:bg-slate-100 transition-colors">
                      <TrendingUp className="w-16 h-16 text-slate-300" />
                      <div>
                        <p className="text-brand-dark font-bold text-lg">Başarılarımız Çok Yakında!</p>
                        <p className="text-slate-500 text-sm mt-1">Detayları görmek için tıklayın →</p>
                      </div>
                    </div>
                  )}
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar - Minimal */}
        <div className="lg:col-span-4 space-y-6">
          {/* İletişim & Konum */}
          <div id="contact" className="scroll-mt-32 bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-brand-dark mb-2">İletişim & Konum</h3>
                <div className="h-1 w-12 bg-brand-blue rounded-full"></div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 font-bold mb-2 uppercase tracking-wide">Adres</p>
                  <p className="text-brand-dark font-medium text-sm leading-relaxed">{branch.address}</p>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-xs text-brand-blue font-bold mb-2 uppercase tracking-wide">Telefon</p>
                  <p className="text-brand-dark font-bold text-lg">{branch.phone}</p>
                </div>

                <div className="p-4 bg-purple-50 rounded-xl">
                  <p className="text-xs text-purple-600 font-bold mb-2 uppercase tracking-wide">Çalışma Saatleri</p>
                  <p className="text-brand-dark font-medium text-sm">Hafta içi: 08:30 - 19:30</p>
                  <p className="text-slate-600 text-sm">Hafta sonu: 09:00 - 18:00</p>
                </div>

                <a
                  href={`https://www.google.com/maps?q=${branch.lat},${branch.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block aspect-[4/3] bg-slate-100 rounded-xl overflow-hidden relative group cursor-pointer"
                >
                  <iframe
                    src={`https://www.google.com/maps?q=${branch.lat},${branch.lng}&output=embed`}
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                  <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/20 transition-colors flex items-center justify-center pointer-events-none">
                    <MapPin className="w-10 h-10 text-brand-blue drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </a>

                <button
                  onClick={() => setShowRegistrationForm(true)}
                  className="w-full py-4 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-dark transition-colors text-sm"
                >
                  Şubemize Ön Kayıt Yap
                </button>
              </div>
            </div>
          </div>

          {/* WhatsApp Card - Minimal */}
          <div className="bg-brand-dark p-6 rounded-2xl text-white shadow-lg">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold mb-1">Hızlı Destek</h3>
                <p className="text-slate-400 text-sm">WhatsApp üzerinden bize ulaşın</p>
              </div>

              <a
                href={`https://wa.me/${branch.whatsapp}`}
                target="_blank" rel="noreferrer"
                className="flex items-center justify-between p-4 bg-white/10 rounded-xl hover:bg-green-600 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-5 h-5 text-green-400 group-hover:text-white" />
                  <span className="font-bold text-sm">WhatsApp Hattı</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white" />
              </a>

              <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl">
                <Mail className="w-5 h-5 text-brand-blue" />
                <span className="font-medium text-xs">bilgi@hocalarageldik.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default BranchHome;
