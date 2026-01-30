import React, { useState, useEffect } from 'react';
import { Plus, Settings2, Trash, Trophy, Users, Layout, ChevronRight, GraduationCap } from 'lucide-react';
import { YearlySuccess, TopStudent } from '../../types';
import { API_BASE_URL } from '../../services/api';

interface YearlySuccessManagerProps {
    successes: YearlySuccess[];
    handleAdd: (type: 'yearlySuccess') => void;
    handleEdit: (type: 'yearlySuccess', item: YearlySuccess) => void;
    handleDelete: (type: 'yearlySuccess', id: string) => void;
    handleAddStudent: (successId: string) => void;
    handleDeleteStudent: (successId: string, studentId: string) => void;
    handleToggleStatus: (type: 'yearlySuccess', item: YearlySuccess) => void;
}

export const YearlySuccessManager: React.FC<YearlySuccessManagerProps> = ({
    successes,
    handleAdd,
    handleEdit,
    handleDelete,
    handleAddStudent,
    handleDeleteStudent,
    handleToggleStatus
}) => {
    const [selectedYear, setSelectedYear] = useState<string | null>(successes[0]?.id || null);
    
    // Automatically select the new year when successes list changes (e.g. new year added)
    // If we have a new item at the beginning of the list that wasn't there before, select it
    useEffect(() => {
        if (successes.length > 0) {
            // If currently selected year is not in the list anymore (deleted), select the first one
            const currentExists = successes.find(s => s.id === selectedYear);
            if (!currentExists) {
                setSelectedYear(successes[0].id);
            } 
            // If a new year was added (it usually appears at the top), we might want to switch to it
            // However, simply switching to the first item on every change might be annoying if just editing
            // So we rely on the fact that newly added items are prepended in AdminPanel.tsx: 
            // setYearlySuccesses((prev: YearlySuccess[]) => [newItem.data, ...prev]);
            // If the first item in the list is different from what we had before, it might be a new item
        }
    }, [successes.length]); // Only react to length changes (add/delete)

    // Better approach: when list length increases, select the first item (newest)
    const [prevLength, setPrevLength] = useState(successes.length);
    useEffect(() => {
        if (successes.length > prevLength) {
            // Item added - select the first one (assuming it's prepended)
            setSelectedYear(successes[0].id);
        }
        setPrevLength(successes.length);
    }, [successes.length, prevLength]);

    const activeSuccess = successes.find(s => s.id === selectedYear) || successes[0];

    // Debug logs
    console.log('YearlySuccessManager Render:', {
        totalSuccesses: successes.length,
        selectedYear,
        successes: successes.map(s => ({ id: s.id, year: s.year, isActive: s.isActive }))
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-3xl font-black text-brand-dark capitalize tracking-tight leading-none">Yıllık <span className="text-brand-blue italic">Başarılar</span></h1>
                    <p className="text-slate-500 font-bold text-[13px] mt-2 tracking-wide">Yıllara göre öğrenci başarılarını ve istatistikleri yönetin.</p>
                </div>
                <button
                    onClick={() => handleAdd('yearlySuccess')}
                    className="px-8 py-4 bg-brand-blue text-white font-black rounded-2xl hover:bg-brand-dark shadow-xl shadow-brand-blue/20 transition-all flex items-center space-x-2"
                >
                    <Plus className="w-5 h-5" />
                    <span>Yeni Yıl Ekle</span>
                </button>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Year Selection Sidebar */}
                <div className="col-span-12 lg:col-span-3 space-y-4">
                    <div className="bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-4">Seçili Yıl</p>
                        <div className="space-y-2">
                            {successes.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => setSelectedYear(s.id)}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${selectedYear === s.id ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                >
                                    <span className="font-black text-sm">{s.year} Başarıları</span>
                                    <div className="flex items-center space-x-3">
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleStatus('yearlySuccess', s);
                                            }}
                                            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer hover:scale-105 ${
                                                s.isActive 
                                                    ? (selectedYear === s.id ? 'bg-white/20 text-white' : 'bg-green-100 text-green-600')
                                                    : (selectedYear === s.id ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600')
                                            }`}
                                        >
                                            <div className={`w-1.5 h-1.5 rounded-full ${
                                                s.isActive 
                                                    ? (selectedYear === s.id ? 'bg-white' : 'bg-green-500')
                                                    : (selectedYear === s.id ? 'bg-white' : 'bg-red-500')
                                            }`} />
                                            <span className="text-[10px] font-black uppercase tracking-wider">{s.isActive ? 'Aktif' : 'Pasif'}</span>
                                        </div>
                                        <ChevronRight className={`w-4 h-4 transition-transform ${selectedYear === s.id ? 'rotate-90' : ''}`} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="col-span-12 lg:col-span-9 space-y-8">
                    {!activeSuccess ? (
                        <div className="bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-200 py-32 flex flex-col items-center text-center">
                            <Trophy className="w-16 h-16 text-slate-200 mb-4" />
                            <h3 className="text-xl font-black text-brand-dark opacity-30">Lütfen Bir Yıl Seçin veya Yeni Ekleyin</h3>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-black text-brand-dark tracking-tight">{activeSuccess.year} Yılı Genel Bakış</h2>
                                <button 
                                    onClick={() => handleDelete('yearlySuccess', activeSuccess.id)} 
                                    className="px-4 py-2 bg-red-50 text-red-500 font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 text-xs"
                                >
                                    <Trash className="w-4 h-4" />
                                    <span>Bu Yılı Sil</span>
                                </button>
                            </div>

                            {/* Stats Summary */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Derece', value: activeSuccess.totalDegrees, icon: Trophy },
                                    { label: 'Yerleşme', value: activeSuccess.placementCount, icon: GraduationCap },
                                    { label: 'İl Sayısı', value: activeSuccess.cityCount, icon: Layout },
                                    { label: 'Başarı %', value: `%${activeSuccess.successRate}`, icon: Trophy },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
                                        <stat.icon className="w-5 h-5 text-brand-blue mb-2" />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                                        <p className="text-xl font-black text-brand-dark">{stat.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Banner & Banner Management */}
                            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-black text-brand-dark flex items-center gap-2">
                                        <Layout className="w-5 h-5 text-brand-blue" />
                                        Banner ve Bilgiler
                                    </h3>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit('yearlySuccess', activeSuccess)} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-brand-blue hover:text-white transition-all">
                                            <Settings2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {activeSuccess.banner ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="aspect-video rounded-2xl overflow-hidden border border-slate-100 shadow-inner md:col-span-1">
                                            <img src={activeSuccess.banner.image?.startsWith('http') ? activeSuccess.banner.image : (activeSuccess.banner.image?.startsWith('/assets') ? activeSuccess.banner.image : `${API_BASE_URL}${activeSuccess.banner.image}`)} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <h4 className="font-black text-brand-dark text-lg">{activeSuccess.banner.title}</h4>
                                            <p className="text-sm font-bold text-slate-400">{activeSuccess.banner.subtitle}</p>
                                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{activeSuccess.banner.description}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-10 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 text-center">
                                        <p className="text-slate-400 font-bold">Banner bilgisi bulunamadı. Lütfen düzenleyerek ekleyin.</p>
                                    </div>
                                )}
                            </div>

                            {/* Students Management */}
                            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-black text-brand-dark flex items-center gap-2">
                                        <Users className="w-5 h-5 text-brand-blue" />
                                        Başarılı Öğrenciler
                                    </h3>
                                    <button
                                        onClick={() => handleAddStudent(activeSuccess.id)}
                                        className="px-6 py-3 bg-slate-50 text-slate-400 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-brand-blue hover:text-white transition-all flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Öğrenci Ekle
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {activeSuccess.students?.map((student, index) => (
                                        <div key={student.id || index} className="bg-slate-50 p-6 rounded-[24px] border border-transparent hover:border-brand-blue/20 transition-all group relative">
                                            <button
                                                onClick={() => handleDeleteStudent(activeSuccess.id, student.id)}
                                                className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </button>

                                            <div className="flex items-center space-x-4">
                                                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm bg-slate-200">
                                                    {student.image ? (
                                                        <img src={student.image?.startsWith('http') ? student.image : (student.image?.startsWith('/assets') ? student.image : `${API_BASE_URL}${student.image}`)} className="w-full h-full object-cover" alt={student.name} />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-black text-2xl">
                                                            {student.name?.charAt(0)?.toUpperCase() || '?'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-brand-dark text-sm">{student.name}</h4>
                                                    <p className="text-[11px] font-black text-brand-blue uppercase">{student.rank}. Derece</p>
                                                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{student.exam} • {student.university || student.branch}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {(!activeSuccess.students || activeSuccess.students.length === 0) && (
                                        <div className="col-span-full py-10 text-center">
                                            <p className="text-slate-400 font-bold italic">Henüz öğrenci eklenmemiş.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
