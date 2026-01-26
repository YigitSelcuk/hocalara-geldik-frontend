import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, Phone, Facebook, Instagram, Twitter } from 'lucide-react';

import { branchService, settingsService } from '../services/cms.service';
import { homeSectionService } from '../services/homepage.service';
import { Branch } from '../types';
import { API_BASE_URL } from '../services/api';

const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`text-[13px] font-bold transition-all px-5 py-2 relative group tracking-wide ${isActive ? 'text-brand-blue' : 'text-brand-dark hover:text-brand-blue'}`}
    >
      {children}
      <span className={`absolute bottom-0 left-5 right-5 h-[3px] bg-brand-blue rounded-full transition-all duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
    </Link>
  );
};

const Header: React.FC = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [homeSections, setHomeSections] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});

  const getSection = (section: string, field: 'title' | 'buttonLink', defaultValue: string = '') => {
    const content = homeSections.find(s => s.section === section);
    return content?.[field] || defaultValue;
  };

  const getLogoUrl = () => {
    const logoPath = getSection('header-logo', 'buttonLink', '/assets/images/logoblue.svg');
    if (logoPath.startsWith('http') || logoPath.startsWith('/assets')) {
      return logoPath;
    }
    return `${API_BASE_URL}${logoPath}`;
  };

  const getTopbarLinks = () => {
    return homeSections
      .filter(s => s.section.startsWith('header-topbar-link'))
      .sort((a, b) => a.order - b.order);
  };

  const getMenuLinks = () => {
    return homeSections
      .filter(s => s.section.startsWith('header-menu-link'))
      .sort((a, b) => a.order - b.order);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [branchesRes, sectionsRes, settingsRes] = await Promise.all([
          branchService.getAll(),
          homeSectionService.getAll(),
          settingsService.get()
        ]);
        
        setBranches(branchesRes.data.branches);
        
        if (sectionsRes.data?.data) {
          setHomeSections(sectionsRes.data.data.filter((s: any) => s.page === 'home'));
        }

        if (settingsRes.data) {
          if (Array.isArray(settingsRes.data)) {
            const normalized: any = {};
            settingsRes.data.forEach((item: any) => {
              normalized[item.key] = item.value;
            });
            setSettings(normalized);
          } else {
            setSettings(settingsRes.data);
          }
        }
      } catch (error) {
        console.error('Error fetching header data:', error);
      }
    };
    fetchData();
  }, []);

  // Detect branch slug
  const branchSlug = location.pathname.startsWith('/subeler/')
    ? location.pathname.split('/')[2]
    : (location.pathname !== '/' && !location.pathname.startsWith('/haberler') && !location.pathname.startsWith('/videolar') && !location.pathname.startsWith('/paketler') && !location.pathname.startsWith('/basarilarimiz') && !location.pathname.startsWith('/franchise') && !location.pathname.startsWith('/admin') && !location.pathname.startsWith('/subeler') && !location.pathname.startsWith('/hesaplama')
      ? location.pathname.split('/')[1]
      : null);

  const currentBranch = branchSlug ? branches.find(b => b.slug === branchSlug) : null;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Scrolled durumunu kontrol et (40px'den fazla scroll)
      setIsScrolled(currentScrollY > 40);
      
      // Scroll yönünü kontrol et
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        // Yukarı scroll veya sayfanın üstündeyse göster
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Aşağı scroll ve 100px'den fazla aşağıdaysa gizle
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);



  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      {/* Top Bar */}
      <div className={`bg-brand-dark text-white/70 transition-all duration-500 ${isScrolled ? 'py-1.5' : 'py-2'}`}>
        <div className="max-w-[1600px] mx-auto px-4 lg:px-12 flex flex-wrap justify-between items-center text-[9px] md:text-[11px] font-bold tracking-wider gap-y-2">
          {/* Left: Quick Links */}
          <div className="flex items-center space-x-3 md:space-x-6 flex-wrap">
            {getTopbarLinks().length > 0 ? (
              getTopbarLinks().map((link, idx, arr) => (
                <React.Fragment key={link.id}>
                  <Link to={link.buttonLink} className="hover:text-brand-blue transition-colors">{link.title}</Link>
                  {idx < arr.length - 1 && <span className="text-white/20">|</span>}
                </React.Fragment>
              ))
            ) : (
              <>
                <Link to="/hakkimizda" className="hover:text-brand-blue transition-colors">Hakkımızda</Link>
                <span className="text-white/20">|</span>
                <Link to="/subeler" className="hover:text-brand-blue transition-colors">Şubeler</Link>
                <span className="text-white/20">|</span>
                <Link to="/iletisim" className="hover:text-brand-blue transition-colors">İletişim</Link>
              </>
            )}
            <span className="text-white/20 hidden md:inline">|</span>
            <div className={`hidden md:flex items-center space-x-2.5 transition-all duration-500 ${isScrolled ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
              <Phone className="w-3.5 h-3.5 text-brand-blue" />
              <span>{getSection('header-phone', 'title', '0212 000 00 00')}</span>
            </div>
          </div>

          {/* Right: Social Media Icons */}
          <div className="flex items-center space-x-4">
            {settings.facebook && (
              <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {settings.twitter && (
              <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className={`transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-2xl py-1.5' : 'bg-white/90 backdrop-blur-md py-3 border-b border-black/5'}`}>
        <div className="max-w-[1600px] mx-auto px-4 lg:px-12 flex justify-between items-center h-14">

          <Link to="/" className="flex items-center shrink-0 group">
            <div className="flex flex-col">
              <img src={getLogoUrl()} alt="Hocalara Geldik" className="h-7 md:h-8 w-auto transition-transform group-hover:scale-105" />
              {currentBranch && (
                <span className="text-[10px] font-black text-brand-blue capitalize tracking-[0.2em] mt-1 pl-1">{currentBranch.name}</span>
              )}
            </div>
          </Link>

          <nav className="hidden xl:flex items-center space-x-2">
            {currentBranch ? (
              // Branch-specific navigation
              <>
                <NavLink to={`/`}>Ana Sayfa</NavLink>
                <NavLink to={`/subeler/${currentBranch.slug}`}>Genel Bakış</NavLink>
                <NavLink to="/haberler">Haberler</NavLink>
                <NavLink to={`/subeler/${currentBranch.slug}/basarilar`}>Başarılar</NavLink>
                <NavLink to="/iletisim">İletişim</NavLink>
              </>
            ) : (
              // Main site navigation - use dynamic menu if available
              <>
                {getMenuLinks().length > 0 ? (
                  getMenuLinks().map(link => (
                    <NavLink key={link.id} to={link.buttonLink}>{link.title}</NavLink>
                  ))
                ) : (
                  <>
                    <NavLink to="/">Ana Sayfa</NavLink>
                    <NavLink to="/videolar">Videolar</NavLink>
                    <NavLink to="/paketler">Paketler</NavLink>
                    <NavLink to="/subeler">Şubeler</NavLink>
                    <NavLink to="/basarilarimiz">Başarılar</NavLink>
                    <NavLink to="/haberler">Haberler</NavLink>
                    <NavLink to="/franchise">Franchise</NavLink>
                  </>
                )}
              </>
            )}
          </nav>

          <div className="flex items-center space-x-6">
            <button className="hidden lg:flex p-3.5 text-brand-dark hover:text-brand-blue transition-colors bg-brand-gray rounded-[20px]">
              <Search className="w-5 h-5" />
            </button>
            <Link
              to="/admin"
              className="hidden sm:flex items-center space-x-3 px-10 py-3 bg-brand-dark text-white rounded-[20px] text-[12px] font-black tracking-wide hover:bg-brand-blue hover:shadow-2xl transition-all"
            >
              <User className="w-4 h-4" />
              <span>Üyelik</span>
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="xl:hidden p-3 bg-brand-gray rounded-[20px] text-brand-dark"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-brand-dark/95 backdrop-blur-xl z-50 transition-all duration-500 xl:hidden ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <div className="flex flex-col h-full p-8 relative">
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="flex flex-col items-center justify-center flex-1 space-y-6">
            {currentBranch ? (
              <>
                <Link to="/" className="text-2xl font-black text-white hover:text-brand-blue transition-colors" onClick={() => setIsMenuOpen(false)}>Ana Sayfa</Link>
                <Link to={`/subeler/${currentBranch.slug}`} className="text-2xl font-black text-white hover:text-brand-blue transition-colors" onClick={() => setIsMenuOpen(false)}>Genel Bakış</Link>
                <Link to="/haberler" className="text-2xl font-black text-white hover:text-brand-blue transition-colors" onClick={() => setIsMenuOpen(false)}>Haberler</Link>
                <Link to={`/subeler/${currentBranch.slug}/basarilar`} className="text-2xl font-black text-white hover:text-brand-blue transition-colors" onClick={() => setIsMenuOpen(false)}>Başarılar</Link>
                <Link to="/iletisim" className="text-2xl font-black text-white hover:text-brand-blue transition-colors" onClick={() => setIsMenuOpen(false)}>İletişim</Link>
              </>
            ) : (
              <>
                {getMenuLinks().length > 0 ? (
                  getMenuLinks().map(link => (
                    <Link key={link.id} to={link.buttonLink} className="text-2xl font-black text-white hover:text-brand-blue transition-colors" onClick={() => setIsMenuOpen(false)}>{link.title}</Link>
                  ))
                ) : (
                  <>
                    <Link to="/" className="text-2xl font-black text-white hover:text-brand-blue transition-colors" onClick={() => setIsMenuOpen(false)}>Ana Sayfa</Link>
                    <Link to="/videolar" className="text-2xl font-black text-white hover:text-brand-blue transition-colors" onClick={() => setIsMenuOpen(false)}>Videolar</Link>
                    <Link to="/paketler" className="text-2xl font-black text-white hover:text-brand-blue transition-colors" onClick={() => setIsMenuOpen(false)}>Paketler</Link>
                    <Link to="/subeler" className="text-2xl font-black text-white hover:text-brand-blue transition-colors" onClick={() => setIsMenuOpen(false)}>Şubeler</Link>
                    <Link to="/basarilarimiz" className="text-2xl font-black text-white hover:text-brand-blue transition-colors" onClick={() => setIsMenuOpen(false)}>Başarılar</Link>
                    <Link to="/haberler" className="text-2xl font-black text-white hover:text-brand-blue transition-colors" onClick={() => setIsMenuOpen(false)}>Haberler</Link>
                    <Link to="/franchise" className="text-2xl font-black text-white hover:text-brand-blue transition-colors" onClick={() => setIsMenuOpen(false)}>Franchise</Link>
                  </>
                )}
              </>
            )}
            <Link to="/admin" className="px-8 py-3 bg-brand-blue text-white rounded-xl font-black tracking-wide hover:bg-white hover:text-brand-blue transition-all mt-8" onClick={() => setIsMenuOpen(false)}>
              ÜYE GİRİŞİ
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
