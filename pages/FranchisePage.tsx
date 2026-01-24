
import React, { useState, useEffect } from 'react';
import { Target, CheckCircle2, ShieldCheck, Zap, ArrowRight, Phone, Mail } from 'lucide-react';
import { homeSectionService } from '../services/homepage.service';

const FranchisePage: React.FC = () => {
  const [pageContent, setPageContent] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const getContent = (section: string, field: 'title' | 'subtitle' | 'buttonText' | 'buttonLink' = 'title', defaultValue: string = '') => {
    const content = pageContent[section];
    return content?.[field] || defaultValue;
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const contentRes = await homeSectionService.getAll();
        const contentData = contentRes.data?.data || contentRes.data;
        
        if (Array.isArray(contentData)) {
          const sections = contentData.filter((s: any) => s.page === 'franchise');
          const contentMap: any = {};
          sections.forEach((s: any) => {
            contentMap[s.section] = s;
          });
          setPageContent(contentMap);
        }
      } catch (error) {
        console.error('Error fetching franchise content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg pb-24">
      {/* Hero */}
      <section className="bg-brand-dark py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/assets/sliders/zemin.png" className="w-full h-full object-cover opacity-60" alt="" />
          <div className="absolute inset-0 bg-brand-dark/40"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="md:w-1/2 space-y-8">
            <div className={`inline-flex items-center space-x-2 text-brand-blue font-black uppercase text-xs tracking-widest bg-brand-blue/10 px-4 py-2 rounded-full border border-brand-blue/20 backdrop-blur-xl transition-all duration-300`}>
              <Target className="w-5 h-5" />
              <span>{getContent('franchise-hero-badge', 'title', 'Geleceğin Eğitim Yatırımı')}</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter capitalize leading-none italic">
              {getContent('franchise-hero-title', 'title', 'Şubemiz Olun').split(' ').slice(0, -1).join(' ')} <span className="text-brand-blue">{getContent('franchise-hero-title', 'title', 'Şubemiz Olun').split(' ').slice(-1)}</span>
            </h1>
            <p className="text-slate-200 text-xl font-medium leading-relaxed">
              {getContent('franchise-hero-subtitle', 'subtitle', 'Hocalara Geldik ekosistemine katılarak Türkiye\'nin en dinamik eğitim ağıyla başarıya ortak olun.')}
            </p>
            <div className="flex flex-wrap gap-4">
              <a href={getContent('franchise-hero-button-primary', 'buttonLink', '#apply')} className="px-10 py-5 bg-brand-blue text-white font-black rounded-custom hover:bg-white hover:text-brand-dark transition-all shadow-2xl shadow-brand-blue/20 capitalize tracking-widest text-sm flex items-center space-x-2">
                <span>{getContent('franchise-hero-button-primary', 'buttonText', 'Başvuru Yap')}</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <button className="px-10 py-5 bg-white/10 backdrop-blur-md text-white border border-white/20 font-black rounded-custom hover:bg-white/20 transition-all capitalize tracking-widest text-sm">
                {getContent('franchise-hero-button-secondary', 'buttonText', 'Sunum Dosyası (PDF)')}
              </button>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="aspect-square bg-brand-blue/20 rounded-full blur-[100px] absolute inset-0"></div>
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800" className="rounded-custom shadow-2xl relative z-10 border border-white/10" alt="Franchise" />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Why Us */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
          {[
            { 
              title: getContent('franchise-why-card1-title', 'title', 'Güçlü İçerik Altyapısı'), 
              desc: getContent('franchise-why-card1-desc', 'subtitle', 'Binlerce video ders, PDF yayınlar ve deneme sınavlarıyla içerik derdiniz olmasın.'), 
              icon: Zap 
            },
            { 
              title: getContent('franchise-why-card2-title', 'title', 'Dijital Yönetim'), 
              desc: getContent('franchise-why-card2-desc', 'subtitle', 'Öğrenci takip, devamsızlık ve sınav analiz yazılımlarımızla şubenizi kolayca yönetin.'), 
              icon: ShieldCheck 
            },
            { 
              title: getContent('franchise-why-card3-title', 'title', 'Bölge Güvencesi'), 
              desc: getContent('franchise-why-card3-desc', 'subtitle', 'Haksız rekabeti önlemek adına bölgenizde tek şube olma garantisi sağlıyoruz.'), 
              icon: Target 
            },
          ].map((item, i) => (
            <div key={i} className="bg-white p-12 rounded-custom shadow-sm border border-slate-100 space-y-6 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-brand-gray rounded-custom flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all">
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-brand-dark capitalize tracking-tight">{item.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Form & Info */}
        <div id="apply" className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <h2 className="text-4xl font-black text-brand-dark capitalize tracking-tighter leading-none italic">
                {getContent('franchise-process-title', 'title', 'Franchise Süreci Nasıl İşler?').split(' ').slice(0, 2).join(' ')} <br />
                <span className="text-brand-blue">{getContent('franchise-process-title', 'title', 'Franchise Süreci Nasıl İşler?').split(' ').slice(2).join(' ')}</span>
              </h2>
              <div className="space-y-8">
                {[
                  { 
                    step: "01", 
                    title: getContent('franchise-process-step1-title', 'title', 'Başvuru & Ön Görüşme'), 
                    desc: getContent('franchise-process-step1-desc', 'subtitle', 'Aşağıdaki formu doldurarak ilk adımı atın, temsilcilerimiz sizi arasın.') 
                  },
                  { 
                    step: "02", 
                    title: getContent('franchise-process-step2-title', 'title', 'Bölge Analizi'), 
                    desc: getContent('franchise-process-step2-desc', 'subtitle', 'Kurulması planlanan şube için pazar ve potansiyel analizi yapılır.') 
                  },
                  { 
                    step: "03", 
                    title: getContent('franchise-process-step3-title', 'title', 'Sözleşme & Kurulum'), 
                    desc: getContent('franchise-process-step3-desc', 'subtitle', 'Karşılıklı onay sonrası kurumsal kimliğimize uygun şube kurulumu başlar.') 
                  }
                ].map((item, i) => (
                  <div key={i} className="flex space-x-6 group">
                    <span className="text-5xl font-black text-slate-100 group-hover:text-brand-blue/20 transition-colors leading-none">{item.step}</span>
                    <div className="space-y-2">
                      <h4 className="text-lg font-black text-brand-dark capitalize">{item.title}</h4>
                      <p className="text-slate-500 font-medium text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-10 bg-brand-dark rounded-custom text-white space-y-6 shadow-2xl">
              <h3 className="text-xl font-black uppercase italic tracking-tight">
                {getContent('franchise-contact-title', 'title', 'Hızlı İletişim')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/5 rounded-custom flex items-center justify-center text-brand-blue"><Phone className="w-5 h-5" /></div>
                  <p className="font-black text-lg">{getContent('franchise-contact-phone', 'title', '0212 555 00 00')}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/5 rounded-custom flex items-center justify-center text-brand-blue"><Mail className="w-5 h-5" /></div>
                  <p className="font-bold text-slate-400">{getContent('franchise-contact-email', 'title', 'kurumsal@hocalarageldik.com')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white p-12 rounded-custom shadow-2xl border border-slate-100 space-y-8">
              <h3 className="text-3xl font-black text-brand-dark capitalize tracking-tight">
                {getContent('franchise-form-title', 'title', 'Ön Başvuru Formu')}
              </h3>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Ad Soyad</label>
                  <input type="text" className="w-full p-4 bg-brand-gray border border-slate-100 rounded-custom focus:border-brand-blue outline-none transition-all font-bold" placeholder="Giriş yapın..." />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Telefon</label>
                  <input type="tel" className="w-full p-4 bg-brand-gray border border-slate-100 rounded-custom focus:border-brand-blue outline-none transition-all font-bold" placeholder="05xx..." />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">E-Posta</label>
                  <input type="email" className="w-full p-4 bg-brand-gray border border-slate-100 rounded-custom focus:border-brand-blue outline-none transition-all font-bold" placeholder="eposta@adres.com" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Hedeflenen Şehir</label>
                  <select className="w-full p-4 bg-brand-gray border border-slate-100 rounded-custom focus:border-brand-blue outline-none transition-all font-bold cursor-pointer">
                    <option>Şehir Seçiniz</option>
                    <option>İstanbul</option>
                    <option>Ankara</option>
                    <option>İzmir</option>
                    <option>Bursa</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Kısa Mesajınız</label>
                  <textarea className="w-full p-4 bg-brand-gray border border-slate-100 rounded-custom focus:border-brand-blue outline-none transition-all font-bold" rows={4} placeholder="Eklemek istedikleriniz..."></textarea>
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="w-full py-5 bg-brand-blue text-white font-black rounded-custom hover:bg-brand-dark transition-all shadow-xl shadow-brand-blue/20 capitalize tracking-widest text-sm">
                    {getContent('franchise-form-button', 'buttonText', 'Başvuruyu Tamamla')}
                  </button>
                  <p className="mt-4 text-[10px] text-slate-400 text-center font-medium">
                    {getContent('franchise-form-privacy', 'subtitle', 'Verdiğiniz bilgiler KVKK kapsamında güvence altındadır.')}
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FranchisePage;
