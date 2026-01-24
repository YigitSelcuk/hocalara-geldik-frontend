
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, Star, Clock, Video, BookOpen, TrendingUp, Zap, ChevronRight, Award } from 'lucide-react';
import { PackageType, EducationPackage } from '../types';
import { packageService } from '../services/cms.service';
import { homeSectionService } from '../services/homepage.service';
import { API_BASE_URL } from '../services/api';

const PackagesPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<PackageType | 'ALL'>('ALL');
  const [packages, setPackages] = useState<EducationPackage[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [packagesRes, sectionsRes] = await Promise.allSettled([
          packageService.getAll(),
          homeSectionService.getAll()
        ]);
        
        if (packagesRes.status === 'fulfilled') {
          const packagesData = packagesRes.value.data.data || packagesRes.value.data.packages || [];
          setPackages(packagesData);
        }
        
        if (sectionsRes.status === 'fulfilled') {
          const data = (sectionsRes.value.data as any)?.data || sectionsRes.value.data || [];
          const packageSections = Array.isArray(data) ? data.filter((s: any) => s.page === 'packages') : [];
          setSections(packageSections);
        }
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

  const filters = [
    { id: 'ALL' as const, label: getSection('packages-filter-all', 'title', 'Tüm Paketler') },
    { id: PackageType.YKS_2026, label: getSection('packages-filter-yks2026', 'title', 'YKS 2026') },
    { id: PackageType.LGS_2026, label: getSection('packages-filter-lgs2026', 'title', 'LGS 2026') },
    { id: PackageType.YKS_2027, label: getSection('packages-filter-yks2027', 'title', 'YKS 2027') },
    { id: PackageType.SINIF_9_10_11, label: getSection('packages-filter-9-10-11', 'title', '9-10-11. Sınıf') },
    { id: PackageType.KPSS, label: getSection('packages-filter-kpss', 'title', 'KPSS') },
    { id: PackageType.DGS, label: getSection('packages-filter-dgs', 'title', 'DGS') }
  ];

  const filteredPackages = activeFilter === 'ALL'
    ? packages
    : packages.filter(pkg => pkg.type === activeFilter);

  const formatPrice = (price?: number) => {
    if (!price) return 'Ücretsiz';
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-bold">{getSection('packages-loading-message', 'title', 'Paketler yükleniyor...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg pb-24">
      {/* Header */}
      <section className="bg-brand-dark py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/assets/sliders/zemin.png" className="w-full h-full object-cover opacity-60" alt="" />
          <div className="absolute inset-0 bg-brand-dark/40"></div>
        </div>

        <div className="max-w-[1600px] mx-auto px-12 relative z-10 text-center">
          <div className="inline-flex items-center space-x-3 text-brand-blue font-black capitalize text-xs tracking-widest bg-brand-blue/20 backdrop-blur-xl px-6 py-3 rounded-xl mb-8 border border-brand-blue/30">
            <BookOpen className="w-5 h-5" />
            <span>{getSection('packages-hero-badge', 'title', 'Eğitim Paketlerimiz')}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-6 capitalize">
            {getSection('packages-hero-title', 'title', 'Başarıya Giden Yol')}
          </h1>
          <p className="text-slate-200 text-lg max-w-3xl mx-auto font-medium leading-relaxed">
            {getSection('packages-hero-subtitle', 'subtitle', 'İhtiyacınıza uygun paketi seçin ve akademik hedeflerinize ulaşın.')}
          </p>
        </div>
      </section>

      <div className="max-w-[1600px] mx-auto px-12 -mt-16 relative z-20">
        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4 mb-8 overflow-x-auto">
          <div className="flex items-center justify-center space-x-3 min-w-max">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-3 rounded-lg text-xs font-black tracking-wide transition-all duration-300 capitalize ${activeFilter === filter.id
                    ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30 scale-105'
                    : 'bg-brand-gray text-slate-600 hover:bg-slate-100 hover:text-brand-dark'
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`group bg-white rounded-2xl overflow-hidden shadow-lg border-2 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${pkg.isPopular
                  ? 'border-brand-blue'
                  : 'border-slate-100'
                }`}
            >
              {/* Badges */}
              <div className="relative">
                {pkg.isPopular && (
                  <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-brand-blue text-white rounded-lg text-[10px] font-black capitalize tracking-widest shadow-lg flex items-center space-x-1.5">
                    <Star className="w-3 h-3 fill-white" />
                    <span>{getSection('packages-card-popular', 'title', 'Popüler')}</span>
                  </div>
                )}
                {pkg.isNew && (
                  <div className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-green-500 text-white rounded-lg text-[10px] font-black capitalize tracking-widest shadow-lg">
                    {getSection('packages-card-new', 'title', 'Yeni')}
                  </div>
                )}
                {pkg.discount && (
                  <div className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-red-500 text-white rounded-lg text-[10px] font-black capitalize tracking-widest shadow-lg">
                    %{pkg.discount} {getSection('packages-card-discount', 'title', 'İndirim')}
                  </div>
                )}

                <div className="aspect-[16/9] overflow-hidden bg-brand-gray">
                  <img
                    src={pkg.image?.startsWith('http') ? pkg.image : `${API_BASE_URL}${pkg.image}`}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Header */}
                <div>
                  <h3 className="text-xl font-black text-brand-dark mb-1.5 leading-tight">
                    {pkg.name}
                  </h3>
                  <p className="text-slate-500 font-medium text-xs leading-relaxed">
                    {pkg.shortDescription}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-baseline space-x-2">
                  {pkg.price && (
                    <>
                      <span className="text-2xl font-black text-brand-dark">
                        {formatPrice(pkg.price)}
                      </span>
                      {pkg.originalPrice && (
                        <span className="text-base font-bold text-slate-400 line-through">
                          {formatPrice(pkg.originalPrice)}
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 py-3 border-y border-slate-100">
                  {pkg.videoCount && (
                    <div className="flex flex-col items-center text-center">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-brand-blue mb-1.5">
                        <Video className="w-4 h-4" />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 capitalize tracking-widest">{getSection('packages-card-video-label', 'title', 'Video')}</p>
                      <p className="text-sm font-black text-brand-dark">{pkg.videoCount.toLocaleString()}+</p>
                    </div>
                  )}
                  {pkg.duration && (
                    <div className="flex flex-col items-center text-center">
                      <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 mb-1.5">
                        <Clock className="w-4 h-4" />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 capitalize tracking-widest">{getSection('packages-card-duration-label', 'title', 'Süre')}</p>
                      <p className="text-sm font-black text-brand-dark">{pkg.duration}</p>
                    </div>
                  )}
                  {pkg.subjectCount && (
                    <div className="flex flex-col items-center text-center">
                      <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 mb-1.5">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 capitalize tracking-widest">{getSection('packages-card-subject-label', 'title', 'Ders')}</p>
                      <p className="text-sm font-black text-brand-dark">{pkg.subjectCount}</p>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 capitalize tracking-widest">{getSection('packages-card-content-label', 'title', 'Paket İçeriği')}</p>
                  <ul className="space-y-1.5">
                    {pkg.features && Array.isArray(pkg.features) && pkg.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-xs font-bold text-slate-600">{feature}</span>
                      </li>
                    ))}
                    {pkg.features && Array.isArray(pkg.features) && pkg.features.length > 4 && (
                      <li className="text-[10px] font-black text-brand-blue">
                        +{pkg.features.length - 4} {getSection('packages-card-more-features', 'title', 'özellik daha')}
                      </li>
                    )}
                  </ul>
                </div>

                {/* CTA Button */}
                <Link
                  to="#"
                  className="block w-full px-6 py-3.5 bg-brand-blue text-white font-black rounded-lg hover:bg-brand-dark hover:shadow-lg hover:shadow-brand-blue/30 transition-all duration-300 text-center text-xs group"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>{getSection('packages-card-button', 'title', 'Detaylı İncele')}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl font-black text-slate-400">{getSection('packages-empty-message', 'title', 'Bu kategoriye ait paket bulunamadı.')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackagesPage;
