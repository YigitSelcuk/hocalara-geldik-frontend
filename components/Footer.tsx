
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Play, GraduationCap } from 'lucide-react';
import { settingsService } from '../services/cms.service';
import { homeSectionService } from '../services/homepage.service';
import { API_BASE_URL } from '../services/api';

const Footer: React.FC = () => {
  const [settings, setSettings] = useState<any>({
    name: 'Hocalara Geldik',
    email: 'bilgi@hocalarageldik.com',
    phone: '0212 000 00 00',
    address: 'İstanbul Genel Merkez Ofisi, Beşiktaş Plaza, İstanbul',
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: ''
  });

  const [homeSections, setHomeSections] = useState<any[]>([]);

  const getSection = (section: string, field: 'title' | 'description' | 'buttonLink', defaultValue: string = '') => {
    const content = homeSections.find(s => s.section === section);
    return content?.[field] || defaultValue;
  };

  const getMenuItems = (column: string) => {
    return homeSections
      .filter(s => s.section.startsWith(`footer-menu-${column}-item`))
      .sort((a, b) => a.order - b.order);
  };

  const getLogoUrl = () => {
    const logoPath = getSection('footer-logo', 'buttonLink', '/assets/images/logoblue.svg');
    // If it's a full URL (http/https), use it as is
    if (logoPath.startsWith('http')) {
      return logoPath;
    }
    // If it's an uploaded file (starts with /uploads), prepend API_BASE_URL
    if (logoPath.startsWith('/uploads')) {
      return `${API_BASE_URL}${logoPath}`;
    }
    // For local assets (like /assets/...), use them directly from frontend
    // Do NOT prepend API_BASE_URL for local assets
    return logoPath;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch settings
        const settingsRes = await settingsService.get();
        if (settingsRes.data) {
          if (Array.isArray(settingsRes.data)) {
            const normalized: any = {};
            settingsRes.data.forEach((item: any) => {
              normalized[item.key] = item.value;
            });
            setSettings((prev: any) => ({ ...prev, ...normalized }));
          } else {
            setSettings((prev: any) => ({ ...prev, ...settingsRes.data }));
          }
        }

        // Fetch home sections
        const sectionsRes = await homeSectionService.getAll();
        if (sectionsRes.data?.data) {
          setHomeSections(sectionsRes.data.data.filter((s: any) => s.page === 'home'));
        }
      } catch (error) {
        console.error('Error fetching footer data:', error);
      }
    };
    fetchData();
  }, []);
  return (
    <footer className="bg-brand-indigo text-white pt-20 pb-10 lg:pt-40 lg:pb-20 relative overflow-hidden">
      {/* Decorative BG element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1920px] h-full opacity-5 pointer-events-none">
        <div className="absolute top-40 left-20 w-96 h-96 bg-brand-blue rounded-full blur-[150px]"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-brand-secondary rounded-full blur-[150px]"></div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mb-16 lg:mb-32">
          <div className="space-y-8 lg:space-y-12">
            <Link to="/" className="flex items-center group">
              <img 
                src={getLogoUrl()} 
                alt="Hocalara Geldik" 
                className="h-10 w-auto transition-transform group-hover:scale-105" 
              />
            </Link>
            <p className="text-slate-400 font-medium text-lg leading-relaxed">
              {getSection('footer-description', 'description', 'Türkiye\'nin Öncü Eğitim Markası Olarak, Akademik Başarınızı En Modern Teknolojiler Ve Uzman Kadromuzla Destekliyoruz.')}
            </p>
            <div className="flex space-x-5">
              {[
                { Icon: Facebook, url: settings.facebook },
                { Icon: Instagram, url: settings.instagram },
                { Icon: Twitter, url: settings.twitter },
                { Icon: Youtube, url: settings.youtube }
              ].filter(item => item.url).map(({ Icon, url }, i) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all border border-white/10 shadow-2xl">
                  <Icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-black text-xl mb-12 tracking-wide capitalize">
              {getSection('footer-menu-column1', 'title', 'Hızlı Menü Linkleri')}
            </h3>
            <ul className="space-y-5 text-slate-400 font-bold text-md">
              {getMenuItems('column1').length > 0 ? (
                getMenuItems('column1').map((item: any) => (
                  <li key={item.id}>
                    <Link to={item.buttonLink || '#'} className="hover:text-brand-blue transition-colors capitalize">
                      {item.title}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link to="/" className="hover:text-brand-blue transition-colors capitalize">Akademi Ana Sayfası</Link></li>
                  <li><Link to="/subeler" className="hover:text-brand-blue transition-colors capitalize">Tüm Akademik Şubelerimiz</Link></li>
                  <li><Link to="/basarilarimiz" className="hover:text-brand-blue transition-colors capitalize">Öğrenci Gurur Tablomuz</Link></li>
                  <li><Link to="/franchise" className="hover:text-brand-blue transition-colors capitalize">Franchise Başvuru Formu</Link></li>
                  <li><Link to="/haberler" className="hover:text-brand-blue transition-colors capitalize">Güncel Haberler Ve Duyurular</Link></li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-black text-xl mb-12 tracking-wide capitalize">
              {getSection('footer-menu-column2', 'title', 'Eğitim Programları')}
            </h3>
            <ul className="space-y-5 text-slate-400 font-bold text-md">
              {getMenuItems('column2').length > 0 ? (
                getMenuItems('column2').map((item: any) => (
                  <li key={item.id}>
                    {item.buttonLink?.startsWith('http') ? (
                      <a href={item.buttonLink} className="hover:text-brand-blue transition-colors capitalize">
                        {item.title}
                      </a>
                    ) : (
                      <Link to={item.buttonLink || '#'} className="hover:text-brand-blue transition-colors capitalize">
                        {item.title}
                      </Link>
                    )}
                  </li>
                ))
              ) : (
                <>
                  <li><a href="#" className="hover:text-brand-blue transition-colors capitalize">Üniversite Hazırlık (YKS)</a></li>
                  <li><a href="#" className="hover:text-brand-blue transition-colors capitalize">Lise Giriş Sınavı (LGS)</a></li>
                  <li><a href="#" className="hover:text-brand-blue transition-colors capitalize">Dijital Soru Çözüm Arşivi</a></li>
                  <li><a href="#" className="hover:text-brand-blue transition-colors capitalize">Uzman Rehberlik Hizmetleri</a></li>
                  <li><a href="#" className="hover:text-brand-blue transition-colors capitalize">Haftalık Deneme Sınavları</a></li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-black text-xl mb-12 tracking-wide capitalize">
              {getSection('footer-menu-column3', 'title', 'Genel İletişim Hattı')}
            </h3>
            {getMenuItems('column3').length > 0 ? (
              <ul className="space-y-5 text-slate-400 font-bold text-md">
                {getMenuItems('column3').map((item: any) => (
                  <li key={item.id}>
                    {item.buttonLink?.startsWith('http') ? (
                      <a href={item.buttonLink} className="hover:text-brand-blue transition-colors capitalize">
                        {item.title}
                      </a>
                    ) : (
                      <Link to={item.buttonLink || '#'} className="hover:text-brand-blue transition-colors capitalize">
                        {item.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="space-y-10">
                <div className="flex items-start space-x-5">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-brand-blue border border-white/10 shrink-0 shadow-xl">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <p className="text-slate-400 text-md font-medium leading-relaxed">{settings.address}</p>
                </div>
                <div className="flex items-center space-x-5">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-brand-blue border border-white/10 shrink-0 shadow-xl">
                    <Phone className="w-6 h-6" />
                  </div>
                  <p className="text-white font-black text-lg">{settings.phone}</p>
                </div>
                <div className="flex items-center space-x-5">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-brand-blue border border-white/10 shrink-0 shadow-xl">
                    <Mail className="w-6 h-6" />
                  </div>
                  <p className="text-slate-400 font-bold">{settings.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm font-medium">© {new Date().getFullYear()} {getSection('footer-copyright', 'title', 'Hocalara Geldik Akademi Grubu. Tüm hakları saklıdır.')}</p>
          <div className="flex space-x-8 text-sm font-medium text-slate-500">
            {homeSections
              .filter(s => s.section.startsWith('footer-bottom-link'))
              .sort((a, b) => a.order - b.order)
              .map((link: any) => (
                <Link key={link.id} to={link.buttonLink || '#'} className="hover:text-brand-blue transition-colors capitalize">
                  {link.title}
                </Link>
              ))}
            {homeSections.filter(s => s.section.startsWith('footer-bottom-link')).length === 0 && (
              <>
                <Link to="/gizlilik" className="hover:text-brand-blue transition-colors capitalize">gizlilik sözleşmesi</Link>
                <Link to="/kullanim-sartlari" className="hover:text-brand-blue transition-colors capitalize">kullanım şartları</Link>
                <Link to="/kvkk" className="hover:text-brand-blue transition-colors capitalize">kvkk aydınlatma metni</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
