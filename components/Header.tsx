import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, Phone, Facebook, Instagram, Twitter, ChevronDown } from 'lucide-react';

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
  const [isHomeDropdownOpen, setIsHomeDropdownOpen] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [homeSections, setHomeSections] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsHomeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      {/* Top Bar */}
      <div className={`bg-brand-dark text-white/70 transition-all duration-500 ${isScrolled ? 'py-1.5' : 'py-2'}`}>
        <div className="max-w-[1600px] mx-auto px-12 flex justify-between items-center text-[11px] font-bold tracking-wider">
          {/* Left: Quick Links */}
          <div className="flex items-center space-x-6">
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
        <div className="max-w-[1600px] mx-auto px-12 flex justify-between items-center h-14">

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
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setIsHomeDropdownOpen(!isHomeDropdownOpen)}
                        className={`text-[13px] font-bold transition-all px-5 py-2 relative group tracking-wide flex items-center space-x-1 ${location.pathname === '/' ? 'text-brand-blue' : 'text-brand-dark hover:text-brand-blue'}`}
                      >
                        <span>Ana Sayfa</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isHomeDropdownOpen ? 'rotate-180' : ''}`} />
                        <span className={`absolute bottom-0 left-5 right-5 h-[3px] bg-brand-blue rounded-full transition-all duration-300 ${location.pathname === '/' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                      </button>

                      {isHomeDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 bg-white rounded-[20px] shadow-2xl border border-slate-100 py-2 min-w-[160px] z-50 overflow-hidden">
                          <Link to="/?style=1" onClick={() => setIsHomeDropdownOpen(false)} className="block px-6 py-3 text-[13px] font-bold text-brand-dark hover:bg-brand-gray hover:text-brand-blue transition-colors">Style 1</Link>
                          <Link to="/?style=2" onClick={() => setIsHomeDropdownOpen(false)} className="block px-6 py-3 text-[13px] font-bold text-brand-dark hover:bg-brand-gray hover:text-brand-blue transition-colors">Style 2</Link>
                        </div>
                      )}
                    </div>
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
    </header>
  );
};

export default Header;
