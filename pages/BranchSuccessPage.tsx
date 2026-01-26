import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Award, TrendingUp, Users, Star, ChevronLeft, Calendar, Trophy, Medal, Target } from 'lucide-react';
import { branchService } from '../services/cms.service';
import { API_BASE_URL } from '../services/api';
import { yearlySuccessService } from '../services/homepage.service';
import { Branch, YearlySuccess } from '../types';

const BranchSuccessPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [branch, setBranch] = useState<Branch | null>(null);
    const [yearlySuccesses, setYearlySuccesses] = useState<YearlySuccess[]>([]);
    const [selectedYear, setSelectedYear] = useState('2024');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!slug) return;
            try {
                // First fetch branch to get branchId
                const branchRes = await branchService.getBySlug(slug);
                
                if (branchRes.data?.branch) {
                    const branchData = branchRes.data.branch;
                    setBranch(branchData);
                    
                    // Then fetch successes filtered by branchId
                    const successRes = await yearlySuccessService.getAll();
                    const allSuccesses = successRes.data?.data || successRes.data || [];
                    
                    // Filter by branchId
                    const branchSuccesses = Array.isArray(allSuccesses) 
                        ? allSuccesses.filter((s: any) => s.branchId === branchData.id)
                        : [];
                    
                    setYearlySuccesses(branchSuccesses);
                    
                    // Set initial selected year if available
                    if (branchSuccesses.length > 0) {
                        setSelectedYear(branchSuccesses[0].year);
                    }
                }
            } catch (error) {
                console.error('Error fetching branch success data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
            </div>
        );
    }

    if (!branch) {
        return <Navigate to="/subeler" replace />;
    }

    // Get students for selected year
    const selectedYearData = yearlySuccesses.find(y => y.year === selectedYear);
    const branchStudents = selectedYearData?.students || [];

    return (
        <div className="mesh-bg min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[400px] md:h-[500px] bg-brand-dark overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={(branch.successBanner || branch.image)?.startsWith('http') ? (branch.successBanner || branch.image) : ((branch.successBanner || branch.image)?.startsWith('/assets') ? (branch.successBanner || branch.image) : `${API_BASE_URL}${branch.successBanner || branch.image}`)}
                        alt={`${branch.name} Başarıları`}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/70 to-brand-dark/40"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-transparent"></div>
                </div>

                <div className="relative h-full flex items-center">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
                        <div className="max-w-3xl space-y-6 md:space-y-8">
                            <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9]">
                                <span className="text-amber-400 italic">Gurur</span> Tablomuz
                            </h1>

                            <p className="text-lg md:text-xl lg:text-2xl text-slate-300 font-medium max-w-2xl leading-relaxed">
                                {branch.name} öğrencilerinin yıllar içinde elde ettiği başarılar ve dereceler
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
                {/* Year Selector */}
                <div className="mb-16">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                        <div className="space-y-3">
                            <span className="text-brand-blue font-black tracking-[0.4em] text-[12px] uppercase">Yıllara Göre Başarılar</span>
                            <h2 className="text-5xl font-black text-brand-dark tracking-tighter italic">
                                {selectedYear} Yılı <span className="text-brand-blue">Dereceleri</span>
                            </h2>
                            <div className="h-1.5 w-24 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Calendar className="w-6 h-6 text-brand-blue" />
                            <div className="flex flex-wrap gap-3">
                                {yearlySuccesses.map(year => (
                                    <button
                                        key={year.year}
                                        onClick={() => setSelectedYear(year.year)}
                                        className={`px-8 py-4 font-black rounded-2xl transition-all duration-300 text-sm tracking-wide ${selectedYear === year.year
                                            ? 'bg-gradient-to-r from-brand-blue to-purple-600 text-white shadow-xl shadow-brand-blue/40 scale-105'
                                            : 'bg-white text-brand-dark border-2 border-slate-200 hover:border-brand-blue hover:shadow-lg'
                                            }`}
                                    >
                                        {year.year}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    {selectedYearData && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                            <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-[20px] p-8 border border-blue-100 overflow-hidden group hover:shadow-xl transition-all">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/10 rounded-full blur-[60px]"></div>
                                <div className="relative z-10 space-y-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-brand-blue to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <Trophy className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-4xl font-black text-brand-dark tracking-tight">{branchStudents.length}</p>
                                        <p className="text-slate-600 font-bold text-sm mt-1">Toplam Derece</p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-[20px] p-8 border border-amber-100 overflow-hidden group hover:shadow-xl transition-all">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-[60px]"></div>
                                <div className="relative z-10 space-y-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <Medal className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-4xl font-black text-brand-dark tracking-tight">
                                            {branchStudents.filter(s => s.rank.toLowerCase().includes('türkiye')).length}
                                        </p>
                                        <p className="text-slate-600 font-bold text-sm mt-1">Türkiye Derecesi</p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-[20px] p-8 border border-green-100 overflow-hidden group hover:shadow-xl transition-all">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-[60px]"></div>
                                <div className="relative z-10 space-y-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <Star className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-4xl font-black text-brand-dark tracking-tight">
                                            {branchStudents.filter(s => s.exam === 'YKS' || s.exam === 'TYT' || s.exam === 'AYT').length}
                                        </p>
                                        <p className="text-slate-600 font-bold text-sm mt-1">YKS Derecesi</p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative bg-gradient-to-br from-pink-50 to-rose-50 rounded-[20px] p-8 border border-pink-100 overflow-hidden group hover:shadow-xl transition-all">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-[60px]"></div>
                                <div className="relative z-10 space-y-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <Target className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-4xl font-black text-brand-dark tracking-tight">
                                            {branchStudents.filter(s => s.exam === 'LGS').length}
                                        </p>
                                        <p className="text-slate-600 font-bold text-sm mt-1">LGS Derecesi</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Students List */}
                {branchStudents.length > 0 ? (
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <h3 className="text-3xl font-black text-brand-dark">Başarılı Öğrencilerimiz</h3>
                            <p className="text-slate-600 font-medium">
                                {branch.name} şubemizden {selectedYear} yılında derece yapan {branchStudents.length} öğrencimiz
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {branchStudents.map((student, index) => (
                                <div
                                    key={student.id}
                                    className="academy-card group bg-white p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                                >
                                    <div className="flex items-start space-x-6">
                                        <div className="relative shrink-0">
                                            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-xl ring-4 ring-slate-100 group-hover:ring-brand-blue/20 transition-all">
                                                <img
                                                    src={student.image?.startsWith('http') ? student.image : (student.image?.startsWith('/assets') ? student.image : `${API_BASE_URL}${student.image}`)}
                                                    alt={student.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-black text-xs shadow-lg">
                                                #{index + 1}
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <h4 className="text-xl font-black text-brand-dark group-hover:text-brand-blue transition-colors">
                                                    {student.name}
                                                </h4>
                                                <p className="text-amber-600 font-black text-sm mt-1">{student.rank}</p>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-brand-blue to-purple-600 text-white text-[10px] font-black tracking-widest rounded-full">
                                                    {student.exam}
                                                </div>

                                                {student.university && (
                                                    <p className="text-slate-600 font-bold text-sm flex items-center space-x-2">
                                                        <Users className="w-4 h-4 text-brand-blue" />
                                                        <span>{student.university}</span>
                                                    </p>
                                                )}

                                                {student.score && (
                                                    <p className="text-slate-600 font-bold text-sm flex items-center space-x-2">
                                                        <TrendingUp className="w-4 h-4 text-green-600" />
                                                        <span>Puan: {student.score}</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="p-24 bg-gradient-to-br from-slate-50 to-slate-100 rounded-[20px] text-center border-2 border-dashed border-slate-200 space-y-8">
                        <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
                            <Award className="w-16 h-16 text-slate-300" />
                        </div>
                        <div className="space-y-3">
                            <p className="text-3xl font-black text-brand-dark">Henüz Veri Yok</p>
                            <p className="text-slate-500 font-medium text-lg max-w-md mx-auto">
                                {branch.name} şubemizden {selectedYear} yılına ait derece bilgisi bulunmamaktadır.
                            </p>
                        </div>
                    </div>
                )}

                {/* CTA Section */}
                <div className="mt-24 relative bg-gradient-to-br from-brand-blue via-purple-600 to-indigo-700 rounded-[20px] p-16 overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 z-0 opacity-20">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
                    </div>

                    <div className="relative z-10 text-center space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-5xl font-black text-white tracking-tighter italic">
                                Sıradaki Başarı <span className="text-amber-400">Sizin Olsun!</span>
                            </h3>
                            <p className="text-xl text-white/90 font-medium max-w-2xl mx-auto">
                                {branch.name} şubemizde siz de başarı hikayenizi yazmaya başlayın
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-6">
                            <a
                                href={`tel:${branch.phone}`}
                                className="px-12 py-5 bg-white text-brand-dark font-black rounded-2xl hover:bg-amber-400 hover:text-white transition-all shadow-2xl hover:scale-105 text-[14px] tracking-wide group"
                            >
                                <span className="flex items-center space-x-3">
                                    <span>Hemen Kayıt Ol</span>
                                    <ChevronLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </a>
                            <Link
                                to={`/subeler/${slug}`}
                                className="px-12 py-5 bg-white/10 backdrop-blur-md text-white border-2 border-white/20 font-black rounded-2xl hover:bg-white hover:text-brand-dark transition-all hover:scale-105 text-[14px] tracking-wide"
                            >
                                Şube Sayfasına Dön
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BranchSuccessPage;
