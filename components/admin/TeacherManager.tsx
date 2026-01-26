import React from 'react';
import { Plus, Settings2, Trash, GraduationCap, Building2 } from 'lucide-react';
import { Teacher } from '../../types';

interface TeacherManagerProps {
    teachers: Teacher[];
    handleAdd: (type: 'teacher') => void;
    handleEdit: (type: 'teacher', item: Teacher) => void;
    handleDelete: (type: 'teacher', id: string) => void;
}

export const TeacherManager: React.FC<TeacherManagerProps> = ({
    teachers,
    handleAdd,
    handleEdit,
    handleDelete
}) => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-black text-brand-dark tracking-tight leading-none">
                    Eğitim <span className="text-brand-blue italic">Kadrosu</span>
                </h1>
                <p className="text-slate-500 font-medium text-sm mt-1">
                    Öğretmenlerimizi ve şube atamalarını buradan yönetin.
                </p>
            </div>
            <button
                onClick={() => handleAdd('teacher')}
                className="px-6 py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-dark transition-all flex items-center space-x-2 shadow-lg shadow-brand-blue/20"
            >
                <Plus className="w-4 h-4" />
                <span>Yeni Öğretmen</span>
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {(teachers || []).map((teacher) => (
                <div
                    key={teacher.id}
                    className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                    <div className="relative aspect-square bg-slate-100 overflow-hidden">
                        {teacher.image ? (
                            <img
                                src={teacher.image?.startsWith('http') ? teacher.image : (teacher.image?.startsWith('/assets') ? teacher.image : `${API_BASE_URL}${teacher.image}`)}
                                alt={teacher.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <GraduationCap className="w-16 h-16" />
                            </div>
                        )}
                        <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                            <button
                                onClick={() => handleEdit('teacher', teacher)}
                                className="p-2 bg-white/90 backdrop-blur-sm text-brand-dark rounded-xl shadow-lg hover:bg-brand-blue hover:text-white transition-all"
                            >
                                <Settings2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDelete('teacher', teacher.id)}
                                className="p-2 bg-white/90 backdrop-blur-sm text-red-500 rounded-xl shadow-lg hover:bg-red-500 hover:text-white transition-all"
                            >
                                <Trash className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                        <div className="mb-3">
                            <h3 className="text-sm font-black text-brand-dark group-hover:text-brand-blue transition-colors">{teacher.name}</h3>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{teacher.subject}</span>
                        </div>

                        <div className="mt-auto pt-3 border-t border-slate-50">
                            <div className="flex items-center space-x-2 text-slate-500">
                                <Building2 className="w-3.5 h-3.5" />
                                <span className="text-xs font-bold">{teacher.branch?.name || 'Tüm Şubeler'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {(!teachers || teachers.length === 0) && (
            <div className="text-center py-20">
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-black text-slate-400 mb-2">Henüz öğretmen yok</h3>
                <p className="text-sm text-slate-400 mb-6">İlk öğretmeni ekleyerek başlayın</p>
                <button
                    onClick={() => handleAdd('teacher')}
                    className="px-6 py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-dark transition-all inline-flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>İlk Öğretmeni Ekle</span>
                </button>
            </div>
        )}
    </div>
);
