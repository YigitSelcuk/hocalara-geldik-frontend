
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Star, Users, Award, ChevronRight, TrendingUp, Calendar, GraduationCap, Target, Zap, MapPin } from 'lucide-react';
import { yearlySuccessService, homeSectionService } from '../services/homepage.service';
import { API_BASE_URL } from '../services/api';
import { YearlySuccess } from '../types';
import { useSEO } from '../hooks/useSEO';

const SuccessPage: React.FC = () => {
  // SEO Hook
  useSEO('success');
  
  const [activeYear, setActiveYear] = useState<string>('2024');
  const [activeExam, setActiveExam] = useState<'YKS' | 'LGS' | 'ALL'>('ALL');
  const [isAnimating, setIsAnimating] = useState(false);
  const [yearlySuccesses, setYearlySuccesses] = useState<YearlySuccess[]>([]);
  const [pageContent, setPageContent] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  const getContent = (section: string, field: 'title' | 'subtitle' | 'buttonText' | 'buttonLink' = 'title', defaultValue: string = '') => {
    const content = pageContent[section];
    return content?.[field] || defaultValue;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [successRes, contentRes] = await Promise.all([
          yearlySuccessService.getAll(),
          homeSectionService.getAll()
        ]);
        
        // Backend returns { success: true, data: [...] }
        const successes = successRes.data.data || successRes.data;

        if (Array.isArray(successes) && successes.length > 0) {
          // Filter active successes only (isActive defaults to true if undefined)
          const activeSuccesses = successes.filter((s: any) => s.isActive !== false);
          
          if (activeSuccesses.length > 0) {
            setYearlySuccesses(activeSuccesses);
            setActiveYear(activeSuccesses[0].year);
            setDataLoaded(true);
          } else {
            setYearlySuccesses([]);
          }
        }
        
        // Process page content
        if (contentRes.data?.data) {
          const sections = contentRes.data.data.filter((s: any) => s.page === 'success');
          const contentMap: any = {};
          sections.forEach((s: any) => {
            contentMap[s.section] = s;
          });
          setPageContent(contentMap);
        }
      } catch (error) {
        console.error('❌ Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [activeYear]);

  const currentYearData = yearlySuccesses.find(y => y.year === activeYear);

  const filteredStudents = currentYearData && activeExam === 'ALL'
    ? currentYearData.students || []
    : currentYearData?.students?.filter(s => s.exam === activeExam) || [];

  const availableYears = yearlySuccesses.map(y => y.year).sort((a, b) => b.localeCompare(a));

  if (loading) {
    return (
      <div className="min-h-screen mesh-bg">
        {/* Hero Skeleton */}
        <section className="bg-brand-dark py-32 relative overflow-hidden">
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-brand-dark to-brand-indigo opacity-50"></div>
          <div className="max-w-[1600px] mx-auto px-12 relative z-10 text-center space-y-8">
            <div className="inline-block h-10 w-64 bg-white/10 rounded-2xl animate-pulse"></div>
            <div className="h-24 w-3/4 mx-auto bg-white/10 rounded-3xl animate-pulse"></div>
            <div className="h-16 w-2/3 mx-auto bg-white/10 rounded-2xl animate-pulse"></div>
          </div>
        </section>

        <div className="max-w-[1600px] mx-auto px-12 -mt-20 relative z-20">
          {/* Year Tabs Skeleton */}
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 mb-16">
            <div className="flex justify-center space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-16 w-32 bg-slate-100 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white p-10 rounded-3xl border-2 border-slate-100">
                <div className="h-16 w-16 bg-slate-100 rounded-2xl mx-auto mb-6 animate-pulse"></div>
                <div className="h-12 w-24 bg-slate-100 rounded-xl mx-auto mb-3 animate-pulse"></div>
                <div className="h-4 w-32 bg-slate-100 rounded mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Students Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 p-6">
                <div className="flex space-x-4">
                  <div className="w-24 h-32 bg-slate-100 rounded-2xl animate-pulse"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-20 bg-slate-100 rounded animate-pulse"></div>
                    <div className="h-6 w-full bg-slate-100 rounded animate-pulse"></div>
                    <div className="h-8 w-24 bg-slate-100 rounded-xl animate-pulse"></div>
                    <div className="h-4 w-32 bg-slate-100 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (yearlySuccesses.length === 0) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center">
        <div className="text-center space-y-6 p-12">
          <Trophy className="w-24 h-24 text-slate-300 mx-auto" />
          <h2 className="text-3xl font-black text-brand-dark">Henüz Başarı Verisi Yok</h2>
          <p className="text-slate-600 font-medium">Başarı verileri yönetim panelinden eklenebilir.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg pb-24">
      {/* Header */}
      <section className="bg-brand-dark py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/assets/sliders/zemin.png" className="w-full h-full object-cover opacity-60" alt="" />
          <div className="absolute inset-0 bg-brand-dark/40"></div>
        </div>

        <div className="max-w-[1600px] mx-auto px-12 relative z-10 text-center">
          <div className="inline-flex items-center space-x-3 text-brand-blue font-black capitalize text-xs tracking-widest bg-brand-blue/20 backdrop-blur-xl px-8 py-4 rounded-2xl mb-10 border border-brand-blue/30">
            <Trophy className="w-6 h-6" />
            <span>{getContent('success-hero-badge', 'title', 'Akademik Başarı Geçmişimiz')}</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none mb-8 capitalize">
            {getContent('success-hero-title', 'title', 'Gurur Tablomuz').split(' ').map((word, i, arr) => 
              i === arr.length - 1 ? <span key={i} className="text-brand-blue italic">{word}</span> : <span key={i}>{word} </span>
            )}
          </h1>
          <p className="text-slate-200 text-2xl max-w-3xl mx-auto font-medium leading-relaxed">
            {getContent('success-hero-subtitle', 'subtitle', 'Her yıl binlerce öğrencimiz hayallerine ulaşıyor. Yıllar içindeki başarı hikayelerimizi keşfedin.')}
          </p>
        </div>
      </section>

      <div className="max-w-[1600px] mx-auto px-12 -mt-20 relative z-20">
        {/* Year Timeline Tabs */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 mb-16 overflow-x-auto">
          <div className="flex items-center justify-center space-x-4 min-w-max">
            {availableYears.map((year, index) => (
              <button
                key={year}
                onClick={() => setActiveYear(year)}
                className={`relative px-10 py-6 rounded-2xl text-lg font-black tracking-wide transition-all duration-500 ${activeYear === year
                    ? 'bg-brand-blue text-white shadow-xl shadow-brand-blue/30 scale-105'
                    : 'bg-brand-gray text-slate-600 hover:bg-slate-100 hover:text-brand-dark'
                  }`}
              >
                {year}
                {activeYear === year && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-brand-blue"></div>
                )}
                {index < availableYears.length - 1 && (
                  <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-8 h-0.5 bg-slate-200"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Year Banner */}
        {currentYearData && currentYearData.banner && (
          <div
            className={`mb-16 rounded-[40px] overflow-hidden shadow-2xl relative ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} transition-all duration-300`}
            style={{
              background: `linear-gradient(135deg, ${currentYearData.banner.gradientFrom || '#1e40af'} 0%, ${currentYearData.banner.gradientTo || '#7c3aed'} 100%)`
            }}
          >
            <div className="relative h-[500px] flex items-center">
            <div className="absolute inset-0">
              <img
                src={currentYearData.banner.image}
                alt={currentYearData.banner.title}
                className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 via-brand-dark/60 to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-[1600px] mx-auto px-12 w-full grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-10">
                <div className="inline-flex items-center space-x-3 text-white/90 font-black capitalize text-xs tracking-widest bg-white/10 backdrop-blur-xl px-6 py-3 rounded-xl border border-white/20">
                  <Calendar className="w-5 h-5" />
                  <span>{currentYearData.year} Yılı Başarıları</span>
                </div>

                <h2 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter">
                  {currentYearData.banner.title}
                </h2>

                <p className="text-xl text-white/80 font-medium leading-relaxed max-w-2xl">
                  {currentYearData.banner.description}
                </p>

                {currentYearData.banner.highlightText && (
                  <div className="flex items-center space-x-6 pt-4">
                    <div className="bg-white/20 backdrop-blur-xl px-8 py-4 rounded-2xl border border-white/30">
                      <p className="text-sm font-black text-white/70 capitalize tracking-widest mb-2">Öne Çıkan</p>
                      <p className="text-4xl font-black text-white">{currentYearData.banner.highlightText}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/20 space-y-6">
                  <h3 className="text-white font-black text-xl capitalize tracking-widest mb-6">Yılın İstatistikleri</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md px-5 py-4 rounded-xl border border-white/20">
                      <Trophy className="w-5 h-5 text-yellow-300 shrink-0" />
                      <div>
                        <p className="text-white font-black text-lg">{currentYearData.totalDegrees}</p>
                        <p className="text-white/60 text-xs font-bold">Derece</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md px-5 py-4 rounded-xl border border-white/20">
                      <Users className="w-5 h-5 text-blue-300 shrink-0" />
                      <div>
                        <p className="text-white font-black text-lg">{currentYearData.placementCount}</p>
                        <p className="text-white/60 text-xs font-bold">Yerleşme</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md px-5 py-4 rounded-xl border border-white/20">
                      <TrendingUp className="w-5 h-5 text-green-300 shrink-0" />
                      <div>
                        <p className="text-white font-black text-lg">%{currentYearData.successRate}</p>
                        <p className="text-white/60 text-xs font-bold">Başarı</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md px-5 py-4 rounded-xl border border-white/20">
                      <Star className="w-5 h-5 text-purple-300 shrink-0" />
                      <div>
                        <p className="text-white font-black text-lg">{currentYearData.cityCount}</p>
                        <p className="text-white/60 text-xs font-bold">İl</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        )}

        {/* Statistics Grid */}
        {currentYearData && (
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 ${isAnimating ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'} transition-all duration-300 delay-100`}>
            {[
              {
                label: 'Toplam Derece',
                value: currentYearData.totalDegrees.toString(),
                icon: Trophy,
                color: 'text-brand-blue',
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200'
              },
              {
                label: 'Yerleşen Öğrenci',
                value: currentYearData.placementCount.toString(),
                icon: Users,
                color: 'text-brand-secondary',
                bgColor: 'bg-amber-50',
                borderColor: 'border-amber-200'
              },
              {
                label: 'Başarı Oranı',
                value: '%' + currentYearData.successRate,
                icon: TrendingUp,
                color: 'text-green-600',
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200'
              },
              {
                label: 'Şehir Sayısı',
                value: currentYearData.cityCount.toString(),
                icon: MapPin,
                color: 'text-purple-600',
                bgColor: 'bg-purple-50',
                borderColor: 'border-purple-200'
              }
            ].map((stat, i) => (
              <div
                key={i}
                className={`${stat.bgColor} ${stat.borderColor} border-2 p-10 rounded-3xl text-center group hover:scale-105 hover:shadow-2xl transition-all duration-500`}
              >
                <div className="flex justify-center mb-6">
                  <div className={`w-16 h-16 ${stat.bgColor} ${stat.color} rounded-2xl flex items-center justify-center border-2 ${stat.borderColor} group-hover:rotate-6 transition-transform`}>
                    <stat.icon className="w-8 h-8" />
                  </div>
                </div>
                <p className="text-5xl font-black text-brand-dark mb-3 tracking-tighter">{stat.value}</p>
                <p className="text-xs font-black capitalize tracking-widest text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Additional Statistics */}
        {currentYearData && (currentYearData.top100Count || currentYearData.top1000Count) && (
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 ${isAnimating ? 'opacity-0' : 'opacity-100'} transition-all duration-300 delay-150`}>
            {currentYearData.top100Count > 0 && (
              <div className="bg-gradient-to-br from-brand-blue to-brand-indigo text-white p-10 rounded-3xl shadow-xl">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                    <Star className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-4xl font-black">{currentYearData.top100Count}</p>
                    <p className="text-xs font-black capitalize tracking-widest text-white/70">İlk 100'de Öğrenci</p>
                  </div>
                </div>
              </div>
            )}
            {currentYearData.top1000Count > 0 && (
              <div className="bg-gradient-to-br from-brand-secondary to-amber-600 text-white p-10 rounded-3xl shadow-xl">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                    <Target className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-4xl font-black">{currentYearData.top1000Count}</p>
                    <p className="text-xs font-black capitalize tracking-widest text-white/70">İlk 1000'de Öğrenci</p>
                  </div>
                </div>
              </div>
            )}
            {(currentYearData.yksAverage > 0 || currentYearData.lgsAverage > 0) && (
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-10 rounded-3xl shadow-xl">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-4xl font-black">
                      {currentYearData.yksAverage || currentYearData.lgsAverage}
                    </p>
                    <p className="text-xs font-black capitalize tracking-widest text-white/70">Ortalama Puan</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Exam Filter Tabs */}
        <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex justify-center space-x-4 mb-12">
          {(['ALL', 'YKS', 'LGS'] as const).map((exam) => (
            <button
              key={exam}
              onClick={() => setActiveExam(exam)}
              className={`px-12 py-5 rounded-xl text-sm font-black capitalize tracking-widest transition-all ${activeExam === exam
                  ? 'bg-brand-blue text-white shadow-xl shadow-brand-blue/20 scale-105'
                  : 'text-slate-500 hover:text-brand-dark bg-slate-100 hover:bg-slate-200'
                }`}
            >
              {exam === 'ALL' 
                ? getContent('success-filter-all', 'title', 'Tüm Sınavlar')
                : exam === 'YKS'
                ? getContent('success-filter-yks', 'title', 'YKS Başarıları')
                : getContent('success-filter-lgs', 'title', 'LGS Başarıları')
              }
            </button>
          ))}
        </div>

        {/* Students Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 ${isAnimating ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'} transition-all duration-300 delay-200`}>
          {filteredStudents.map((student, i) => (
            <div
              key={student.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
            >
              <div className="flex">
                <div className="w-1/3 aspect-[3/4] overflow-hidden bg-brand-gray">
                  <img
                    src={student.image ? (student.image.startsWith('http') ? student.image : (student.image.startsWith('/assets') ? student.image : `${API_BASE_URL}${student.image}`)) : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={student.name}
                  />
                </div>
                <div className="w-2/3 p-8 flex flex-col justify-center space-y-4">
                  <div>
                    <p className="text-[10px] font-black capitalize tracking-widest text-brand-blue mb-2">
                      {student.exam}
                    </p>
                    <h3 className="text-xl font-black text-brand-dark capitalize mb-3 leading-tight">
                      {student.name}
                    </h3>
                  </div>

                  <div className="inline-flex items-center px-5 py-3 bg-blue-50 text-brand-blue rounded-xl text-sm font-black border-2 border-blue-100">
                    <Trophy className="w-4 h-4 mr-2" />
                    {student.rank}. Derece
                  </div>

                  {student.branch && (
                    <p className="text-xs font-bold text-slate-500 capitalize tracking-wide">
                      {student.branch}
                    </p>
                  )}

                  {student.university && (
                    <p className="text-xs font-black text-brand-dark">
                      {student.university}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-brand-dark via-brand-indigo to-brand-dark rounded-[40px] text-white p-16 flex flex-col md:flex-row items-center justify-between shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-96 h-96 bg-brand-blue/20 rounded-full blur-[150px] -ml-48 -mt-48"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-secondary/20 rounded-full blur-[150px] -mr-48 -mb-48"></div>

          <div className="relative z-10 space-y-6 text-center md:text-left mb-8 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-black capitalize tracking-tighter leading-tight">
              {getContent('success-cta-title', 'title', 'Sıradaki Başarı Hikayesi Neden Sen Olmayasın?').split(' ').slice(0, -3).join(' ')}{' '}
              <span className="text-brand-blue italic">{getContent('success-cta-title', 'title', 'Sıradaki Başarı Hikayesi Neden Sen Olmayasın?').split(' ').slice(-3).join(' ')}</span>
            </h2>
            <p className="text-slate-300 font-medium text-lg max-w-xl">
              {getContent('success-cta-subtitle', 'subtitle', 'Hemen sana en yakın şubemizi bul ve kaliteli eğitimle sınav hazırlığına başla.')}
            </p>
          </div>

          <Link
            to={getContent('success-cta-button', 'buttonLink', '/subeler')}
            className="relative z-10 px-12 py-6 bg-brand-blue text-white font-black rounded-2xl hover:bg-white hover:text-brand-dark transition-all shadow-2xl shadow-brand-blue/40 hover:scale-105 capitalize tracking-widest text-sm flex items-center space-x-3"
          >
            <span>{getContent('success-cta-button', 'buttonText', 'Hemen Başla')}</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
