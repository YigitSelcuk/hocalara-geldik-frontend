
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Play, GraduationCap } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-indigo text-white pt-40 pb-20 relative overflow-hidden">
      {/* Decorative BG element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1920px] h-full opacity-5 pointer-events-none">
        <div className="absolute top-40 left-20 w-96 h-96 bg-brand-blue rounded-full blur-[150px]"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-brand-secondary rounded-full blur-[150px]"></div>
      </div>

      <div className="max-w-[1600px] mx-auto px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-24 mb-32">
          <div className="space-y-12">
            <Link to="/" className="flex items-center group">
              <img src="/assets/images/logoblue.svg" alt="Hocalara Geldik" className="h-10 w-auto brightness-0 invert transition-transform group-hover:scale-105" />
            </Link>
            <p className="text-slate-400 font-medium text-lg leading-relaxed">
              Türkiye'nin Öncü Eğitim Markası Olarak, Akademik Başarınızı En Modern Teknolojiler Ve Uzman Kadromuzla Destekliyoruz.
            </p>
            <div className="flex space-x-5">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all border border-white/10 shadow-2xl">
                  <Icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-black text-xl mb-12 tracking-wide capitalize">Hızlı Menü Linkleri</h3>
            <ul className="space-y-5 text-slate-400 font-bold text-md">
              <li><Link to="/" className="hover:text-brand-blue transition-colors capitalize">Akademi Ana Sayfası</Link></li>
              <li><Link to="/subeler" className="hover:text-brand-blue transition-colors capitalize">Tüm Akademik Şubelerimiz</Link></li>
              <li><Link to="/basarilarimiz" className="hover:text-brand-blue transition-colors capitalize">Öğrenci Gurur Tablomuz</Link></li>
              <li><Link to="/franchise" className="hover:text-brand-blue transition-colors capitalize">Franchise Başvuru Formu</Link></li>
              <li><Link to="/haberler" className="hover:text-brand-blue transition-colors capitalize">Güncel Haberler Ve Duyurular</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-black text-xl mb-12 tracking-wide capitalize">Eğitim Programları</h3>
            <ul className="space-y-5 text-slate-400 font-bold text-md">
              <li><a href="#" className="hover:text-brand-blue transition-colors capitalize">Üniversite Hazırlık (YKS)</a></li>
              <li><a href="#" className="hover:text-brand-blue transition-colors capitalize">Lise Giriş Sınavı (LGS)</a></li>
              <li><a href="#" className="hover:text-brand-blue transition-colors capitalize">Dijital Soru Çözüm Arşivi</a></li>
              <li><a href="#" className="hover:text-brand-blue transition-colors capitalize">Uzman Rehberlik Hizmetleri</a></li>
              <li><a href="#" className="hover:text-brand-blue transition-colors capitalize">Haftalık Deneme Sınavları</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-black text-xl mb-12 tracking-wide capitalize">Genel İletişim Hattı</h3>
            <div className="space-y-10">
              <div className="flex items-start space-x-5">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-brand-blue border border-white/10 shrink-0 shadow-xl">
                  <MapPin className="w-6 h-6" />
                </div>
                <p className="text-slate-400 text-md font-medium leading-relaxed">İstanbul Genel Merkez Ofisi, <br /> Beşiktaş Plaza, İstanbul</p>
              </div>
              <div className="flex items-center space-x-5">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-brand-blue border border-white/10 shrink-0 shadow-xl">
                  <Phone className="w-6 h-6" />
                </div>
                <p className="text-white font-black text-lg">0212 000 00 00</p>
              </div>
              <div className="flex items-center space-x-5">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-brand-blue border border-white/10 shrink-0 shadow-xl">
                  <Mail className="w-6 h-6" />
                </div>
                <p className="text-slate-400 font-bold">bilgi@hocalarageldik.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm font-medium">© {new Date().getFullYear()} Hocalara Geldik Akademi Grubu. Tüm hakları saklıdır.</p>
          <div className="flex space-x-8 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-brand-blue transition-colors capitalize">gizlilik sözleşmesi</a>
            <a href="#" className="hover:text-brand-blue transition-colors capitalize">kullanım şartları</a>
            <a href="#" className="hover:text-brand-blue transition-colors capitalize">kvkk aydınlatma metni</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
