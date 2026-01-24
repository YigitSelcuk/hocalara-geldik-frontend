
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, ArrowRight, Search, Map as MapIcon, List as ListIcon, Navigation, ExternalLink } from 'lucide-react';
import { branchService } from '../services/cms.service';
import { homeSectionService } from '../services/homepage.service';
import { Branch } from '../types';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet default icon issue with webpack/vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom branded marker icon
const createCustomIcon = (color: string = '#2563eb') => {
  const svgIcon = `
    <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16C0 28 16 42 16 42C16 42 32 28 32 16C32 7.163 24.837 0 16 0Z" fill="${color}"/>
      <circle cx="16" cy="16" r="8" fill="white"/>
      <circle cx="16" cy="16" r="5" fill="${color}"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker',
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  });
};

const customIcon = createCustomIcon('#2563eb');

const BranchList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [branchesRes, sectionsRes] = await Promise.all([
          branchService.getAll(),
          homeSectionService.getAll()
        ]);
        
        setBranches(branchesRes.data.branches);
        
        const data = (sectionsRes.data as any)?.data || sectionsRes.data || [];
        const branchSections = Array.isArray(data) ? data.filter((s: any) => s.page === 'branches') : [];
        setSections(branchSections);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getSection = (section: string, field: 'title' | 'subtitle' | 'description', defaultValue: string = '') => {
    const content = sections.find(s => s.section === section);
    return content?.[field] || defaultValue;
  };

  const filteredBranches = branches.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Center of Turkey for initial map view
  const mapCenter: [number, number] = [39.0, 35.0];

  return (
    <div className="min-h-screen bg-brand-gray/50 pb-24">
      {/* Hero */}
      <section className="bg-brand-dark py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/assets/sliders/zemin.png" className="w-full h-full object-cover opacity-60" alt="" />
          <div className="absolute inset-0 bg-brand-dark/40"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="max-w-2xl space-y-6">
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic capitalize">
                {getSection('branches-hero-title', 'title', 'Türkiye Şubelerimiz')}
              </h1>
              <p className="text-slate-200 text-lg font-medium leading-relaxed">
                {getSection('branches-hero-subtitle', 'subtitle', '81 şubemiz ve binlerce öğrencimizle kocaman bir aileyiz. Size en yakın şubeyi bulup hemen başlayın.')}
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[20px] border border-white/10 w-full lg:w-96 shadow-2xl">
              <p className="text-white/60 font-black capitalize text-[10px] tracking-widest mb-4">
                {getSection('branches-hero-search-label', 'title', 'Şube bul')}
              </p>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={getSection('branches-hero-search-placeholder', 'subtitle', 'İl veya ilçe ara...')}
                  className="w-full pl-12 pr-4 py-4 bg-white rounded-[16px] text-brand-dark text-sm font-bold shadow-lg focus:ring-4 focus:ring-brand-blue/20 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-8 relative z-30">
        {/* View Toggle */}
        <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-[20px] shadow-2xl border border-slate-100 flex items-center justify-center w-fit mx-auto mb-12">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center space-x-3 px-8 py-3.5 rounded-[16px] text-[11px] font-black capitalize tracking-widest transition-all ${viewMode === 'list' ? 'bg-brand-blue text-white shadow-xl' : 'text-slate-500 hover:text-brand-blue'}`}
          >
            <ListIcon className="w-4 h-4" />
            <span>{getSection('branches-view-list', 'title', 'Liste görünümü')}</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center space-x-3 px-8 py-3.5 rounded-[16px] text-[11px] font-black capitalize tracking-widest transition-all ${viewMode === 'map' ? 'bg-brand-blue text-white shadow-xl' : 'text-slate-500 hover:text-brand-blue'}`}
          >
            <MapIcon className="w-4 h-4" />
            <span>{getSection('branches-view-map', 'title', 'Harita görünümü')}</span>
          </button>
        </div>

        {loading ? (
          <div className="py-24 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
          </div>
        ) : viewMode === 'list' ? (
          /* List View Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {filteredBranches.length > 0 ? filteredBranches.map(branch => (
              <div key={branch.id} className="group bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 flex flex-col">
                <div className="h-56 relative overflow-hidden">
                  <img src={branch.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={branch.name} />
                  <div className="absolute top-4 left-4 bg-brand-blue text-white px-3 py-1 rounded-[12px] text-[9px] font-black capitalize tracking-widest shadow-lg">
                    {getSection('branches-card-badge', 'title', 'Yeni dönem kayıtları')}
                  </div>
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <h3 className="text-xl font-black text-brand-dark group-hover:text-brand-blue transition-colors mb-4">{branch.name}</h3>
                  <div className="space-y-3 mb-8 flex-grow">
                    <div className="flex items-start space-x-3 text-slate-500">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-brand-blue" />
                      <span className="text-xs font-semibold leading-relaxed line-clamp-2">{branch.address}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-800 font-black">
                      <Phone className="w-4 h-4 shrink-0 text-brand-blue" />
                      <span className="text-sm">{branch.phone}</span>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                    <Link
                      to={`/subeler/${branch.slug}`}
                      className="flex items-center space-x-2 text-[10px] font-black capitalize tracking-widest text-slate-400 group-hover:text-brand-blue transition-all"
                    >
                      <span>{getSection('branches-card-button', 'title', 'Şubeyi incele')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <a
                      href={`https://www.google.com/maps?q=${branch.lat},${branch.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 bg-brand-gray text-slate-400 rounded-[12px] group-hover:bg-brand-blue group-hover:text-white transition-all"
                      title="Google Maps'te Aç"
                    >
                      <MapIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-20 text-center bg-white rounded-[20px] border-2 border-dashed border-slate-200">
                <h3 className="text-xl font-black text-brand-dark">{getSection('branches-card-empty', 'title', 'Aradığınız kriterde şube bulunamadı.')}</h3>
                <button onClick={() => setSearchQuery('')} className="mt-4 text-brand-blue font-black underline capitalize tracking-widest text-xs">{getSection('branches-card-empty-button', 'title', 'Tüm listeyi gör')}</button>
              </div>
            )}
          </div>
        ) : (
          /* Map View */
          <div className="animate-in fade-in zoom-in-95 duration-700">
            <div className="rounded-[20px] overflow-hidden shadow-2xl border-4 border-white">
              <MapContainer
                key={`map-${viewMode}-${filteredBranches.length}`}
                center={mapCenter}
                zoom={6}
                scrollWheelZoom={true}
                style={{ height: '700px' }}
                className="z-10"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredBranches.map(branch => (
                  <Marker
                    key={branch.id}
                    position={[branch.lat, branch.lng]}
                    icon={customIcon}
                    eventHandlers={{
                      click: () => setSelectedBranch(branch.id),
                    }}
                  >
                    <Popup className="custom-popup" maxWidth={300}>
                      <div className="flex flex-col overflow-hidden">
                        <div className="relative h-32 overflow-hidden rounded-t-lg">
                          <img src={branch.image} alt={branch.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          <div className="absolute bottom-3 left-3 right-3">
                            <h4 className="font-black text-white text-sm drop-shadow-lg">{branch.name}</h4>
                          </div>
                        </div>
                        <div className="p-4 space-y-4 bg-white">
                          <div className="flex items-start space-x-2 text-xs text-slate-600">
                            <MapPin className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                            <span className="line-clamp-2 leading-relaxed">{branch.address}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs font-bold text-brand-dark">
                            <Phone className="w-4 h-4 text-brand-blue shrink-0" />
                            <span>{branch.phone}</span>
                          </div>
                          <div className="flex gap-2 pt-2 border-t border-slate-100">
                            <Link
                              to={`/subeler/${branch.slug}`}
                              className="flex-1 py-2.5 bg-brand-blue text-white text-center text-[10px] font-black capitalize tracking-widest rounded-lg hover:bg-brand-dark transition-all"
                            >
                              {getSection('branches-map-detail-button', 'title', 'Şube Detayları')}
                            </Link>
                            <a
                              href={`https://www.google.com/maps?q=${branch.lat},${branch.lng}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2.5 bg-slate-100 text-brand-blue rounded-lg hover:bg-brand-blue hover:text-white transition-all"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* Map Info Card */}
            <div className="mt-8 bg-white p-6 rounded-[20px] shadow-xl border border-slate-100">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-blue to-purple-600 rounded-xl flex items-center justify-center text-white shrink-0">
                    <Navigation className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-brand-dark text-base mb-1">{getSection('branches-map-info-title', 'title', 'Harita Navigasyonu')}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{getSection('branches-map-info-desc', 'description', 'Şube pinlerine tıklayarak detaylı bilgilere ulaşabilir ve Google Maps\'te açabilirsiniz.')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-brand-blue/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-brand-blue" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">{getSection('branches-map-total-label', 'title', 'Toplam Şube')}</p>
                      <p className="text-xl font-black text-brand-blue">{filteredBranches.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BranchList;
