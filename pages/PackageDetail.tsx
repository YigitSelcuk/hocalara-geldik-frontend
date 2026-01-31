import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, Star, Clock, Video, BookOpen, ChevronRight, ArrowLeft, Zap, TrendingUp, Award } from 'lucide-react';
import { EducationPackage } from '../types';
import { packageService } from '../services/cms.service';
import { API_BASE_URL } from '../services/api';
import { useSEO } from '../hooks/useSEO';

const PackageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pkg, setPkg] = useState<EducationPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // SEO Hook will be updated when package is loaded
  useSEO('packages');

  useEffect(() => {
    const fetchPackage = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const res = await packageService.getById(id);
        
        // Handle different response structures
        const packageData = res.data.data || res.data;
        setPkg(packageData);
      } catch (err) {
        console.error('Error fetching package:', err);
        setError('Paket bulunamadı veya bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  const formatPrice = (price?: number) => {
    if (!price) return 'Ücretsiz';
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-bold">Paket yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-black text-brand-dark mb-4">Hata</h2>
          <p className="text-slate-600 mb-8">{error || 'Paket bulunamadı.'}</p>
          <Link to="/paketler" className="inline-flex items-center space-x-2 px-6 py-3 bg-brand-blue text-white rounded-xl font-bold hover:bg-brand-dark transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Paketlere Dön</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header Image Section */}
      <section className="bg-brand-dark relative h-[500px] overflow-hidden">
        <div className="absolute inset-0 z-0">
            <img 
                src={pkg.image?.startsWith('http') ? pkg.image : (pkg.image?.startsWith('/assets') ? pkg.image : `${API_BASE_URL}${pkg.image}`)} 
                className="w-full h-full object-cover opacity-50 scale-105" 
                alt={pkg.name} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-transparent to-brand-dark/90"></div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 h-full flex flex-col justify-end pb-20">
            <Link to="/paketler" className="inline-flex items-center space-x-2 text-white/70 hover:text-white transition-colors mb-8 font-bold text-sm bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full w-fit hover:bg-white/10">
                <ArrowLeft className="w-4 h-4" />
                <span>Tüm Paketler</span>
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-6">
                {pkg.isPopular && (
                    <div className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl text-[10px] font-black capitalize tracking-widest shadow-lg shadow-amber-500/20 flex items-center space-x-2">
                        <Star className="w-3.5 h-3.5 fill-white" />
                        <span>En Çok Tercih Edilen</span>
                    </div>
                )}
                {pkg.isNew && (
                    <div className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl text-[10px] font-black capitalize tracking-widest shadow-lg shadow-emerald-500/20 flex items-center space-x-2">
                        <Zap className="w-3.5 h-3.5 fill-white" />
                        <span>Yeni Sezon</span>
                    </div>
                )}
                {pkg.discount && (
                    <div className="px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl text-[10px] font-black capitalize tracking-widest shadow-lg shadow-rose-500/20 flex items-center space-x-2">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>%{pkg.discount} İndirim Fırsatı</span>
                    </div>
                )}
                <div className="px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-xl text-[10px] font-black capitalize tracking-widest border border-white/20">
                    {pkg.type === 'LGS' ? '🎓 LGS Hazırlık' : pkg.type === 'YKS' ? '🎓 YKS Hazırlık' : '📚 Ara Sınıf'}
                </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight mb-6 drop-shadow-2xl max-w-4xl">
                {pkg.name}
            </h1>
            <p className="text-slate-200 text-lg md:text-xl font-medium max-w-3xl leading-relaxed opacity-90">
                {pkg.shortDescription}
            </p>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
                {/* Stats Bar */}
                <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-brand-dark/5 border border-slate-100 flex flex-wrap gap-8 justify-between items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    
                    {pkg.videoCount && (
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px] relative z-10 group">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-brand-blue mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                <Video className="w-7 h-7" />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 capitalize tracking-widest mb-1">Video İçerik</p>
                            <p className="text-2xl font-black text-brand-dark">{pkg.videoCount.toLocaleString()}+</p>
                        </div>
                    )}
                    <div className="w-px h-16 bg-slate-100 hidden md:block"></div>
                    {pkg.duration && (
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px] relative z-10 group">
                            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                <Clock className="w-7 h-7" />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 capitalize tracking-widest mb-1">Toplam Süre</p>
                            <p className="text-2xl font-black text-brand-dark">{pkg.duration}</p>
                        </div>
                    )}
                    <div className="w-px h-16 bg-slate-100 hidden md:block"></div>
                    {pkg.subjectCount && (
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px] relative z-10 group">
                            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                <BookOpen className="w-7 h-7" />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 capitalize tracking-widest mb-1">Ders Sayısı</p>
                            <p className="text-2xl font-black text-brand-dark">{pkg.subjectCount}</p>
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="bg-white rounded-3xl p-10 shadow-xl shadow-brand-dark/5 border border-slate-100 relative overflow-hidden">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-brand-blue/10 rounded-xl flex items-center justify-center text-brand-blue">
                            <Award className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-black text-brand-dark">Paket Hakkında</h2>
                    </div>
                    <div className="prose prose-slate prose-lg max-w-none">
                        <p className="text-slate-600 leading-relaxed whitespace-pre-line">{pkg.description}</p>
                    </div>
                </div>

                {/* Features List */}
                <div className="bg-white rounded-3xl p-10 shadow-xl shadow-brand-dark/5 border border-slate-100">
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                            <Check className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-black text-brand-dark">Paket İçeriği ve Kazanımlar</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pkg.features && Array.isArray(pkg.features) && pkg.features.map((feature, index) => (
                            <div key={index} className="flex items-start space-x-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all duration-300 group">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                    <Check className="w-4 h-4 text-green-600" />
                                </div>
                                <span className="font-bold text-slate-700 text-sm pt-1.5 leading-relaxed">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-brand-dark/10 border border-slate-100 sticky top-28">
                    <div className="text-center mb-8">
                        <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest mb-2">Paket Özeti</h3>
                        <div className="w-12 h-1 bg-brand-blue mx-auto rounded-full"></div>
                    </div>
                    
                    <div className="space-y-6 mb-8 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-500">Kategori</span>
                            <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-black text-brand-dark shadow-sm">{pkg.type}</span>
                        </div>
                        {pkg.originalPrice && (
                             <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-500">Liste Fiyatı</span>
                                <span className="text-base font-bold text-slate-400 line-through decoration-2 decoration-red-400">{formatPrice(pkg.originalPrice)}</span>
                            </div>
                        )}
                         <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                            <span className="text-sm font-bold text-slate-500">Net Fiyat</span>
                            <div className="text-right">
                                <span className="block text-3xl font-black text-brand-blue tracking-tight">{formatPrice(pkg.price)}</span>
                                {pkg.discount && <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Kazancınız: %{pkg.discount}</span>}
                            </div>
                        </div>
                    </div>

                    <button className="w-full py-5 bg-brand-blue text-white font-black rounded-2xl hover:bg-brand-dark hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-brand-blue/30 transition-all duration-300 flex items-center justify-center space-x-3 group relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12"></div>
                        <span className="relative text-lg">Hemen Satın Al</span>
                        <ChevronRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <div className="mt-6 flex items-center justify-center space-x-2 text-slate-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-[11px] font-bold">Güvenli ödeme altyapısı ile korunmaktadır.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;
