
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Star, Clock, Video, BookOpen, TrendingUp, Zap, ChevronRight, Award } from 'lucide-react';
import { EDUCATION_PACKAGES } from '../constants';
import { PackageType } from '../types';

const PackagesPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<PackageType | 'ALL'>('ALL');

  const filters = [
    { id: 'ALL' as const, label: 'Tüm Paketler' },
    { id: PackageType.YKS_2026, label: 'YKS 2026' },
    { id: PackageType.LGS_2026, label: 'LGS 2026' },
    { id: PackageType.YKS_2027, label: 'YKS 2027' },
    { id: PackageType.SINIF_9_10_11, label: '9-10-11. Sınıf' },
    { id: PackageType.KPSS, label: 'KPSS' },
    { id: PackageType.DGS, label: 'DGS' }
  ];

  const filteredPackages = activeFilter === 'ALL'
    ? EDUCATION_PACKAGES
    : EDUCATION_PACKAGES.filter(pkg => pkg.type === activeFilter);

  const formatPrice = (price?: number) => {
    if (!price) return 'Ücretsiz';
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price);
  };

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
            <span>Eğitim Paketlerimiz</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-6 capitalize">
            Başarıya <span className="text-brand-blue italic">Giden Yol</span>
          </h1>
          <p className="text-slate-200 text-lg max-w-3xl mx-auto font-medium leading-relaxed">
            İhtiyacınıza uygun paketi seçin ve akademik hedeflerinize ulaşın.
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
                    <span>Popüler</span>
                  </div>
                )}
                {pkg.isNew && (
                  <div className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-green-500 text-white rounded-lg text-[10px] font-black capitalize tracking-widest shadow-lg">
                    Yeni
                  </div>
                )}
                {pkg.discount && (
                  <div className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-red-500 text-white rounded-lg text-[10px] font-black capitalize tracking-widest shadow-lg">
                    %{pkg.discount} İndirim
                  </div>
                )}

                <div className="aspect-[16/9] overflow-hidden bg-brand-gray">
                  <img
                    src={pkg.image}
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
                      <p className="text-[10px] font-black text-slate-400 capitalize tracking-widest">Video</p>
                      <p className="text-sm font-black text-brand-dark">{pkg.videoCount.toLocaleString()}+</p>
                    </div>
                  )}
                  {pkg.duration && (
                    <div className="flex flex-col items-center text-center">
                      <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 mb-1.5">
                        <Clock className="w-4 h-4" />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 capitalize tracking-widest">Süre</p>
                      <p className="text-sm font-black text-brand-dark">{pkg.duration}</p>
                    </div>
                  )}
                  {pkg.subjectCount && (
                    <div className="flex flex-col items-center text-center">
                      <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 mb-1.5">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 capitalize tracking-widest">Ders</p>
                      <p className="text-sm font-black text-brand-dark">{pkg.subjectCount}</p>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 capitalize tracking-widest">Paket İçeriği</p>
                  <ul className="space-y-1.5">
                    {pkg.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-xs font-bold text-slate-600">{feature}</span>
                      </li>
                    ))}
                    {pkg.features.length > 4 && (
                      <li className="text-[10px] font-black text-brand-blue">
                        +{pkg.features.length - 4} özellik daha
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
                    <span>Detaylı İncele</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl font-black text-slate-400">Bu kategoriye ait paket bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackagesPage;
