import React from 'react';
import { Plus, Settings2, Trash, Calendar } from 'lucide-react';

interface ExamDate {
    id: string;
    examName: string;
    examDate: string;
    description?: string;
    order: number;
}

interface ExamDatesManagerProps {
    examDates: ExamDate[];
    handleAdd: (type: 'examDate') => void;
    handleEdit: (type: 'examDate', item: ExamDate) => void;
    handleDelete: (type: 'examDate', id: string) => void;
}

export const ExamDatesManager: React.FC<ExamDatesManagerProps> = ({
    examDates,
    handleAdd,
    handleEdit,
    handleDelete
}) => (
    <div className="space-y-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-black text-brand-dark tracking-tight leading-none">
                    Sınav <span className="text-brand-blue italic">Tarihleri</span>
                </h1>
                <p className="text-slate-500 font-medium text-sm mt-1">
                    Geri sayım için sınav tarihlerini yönetin.
                </p>
            </div>
            <button
                onClick={() => handleAdd('examDate')}
                className="px-6 py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-dark transition-all flex items-center space-x-2 shadow-lg shadow-brand-blue/20"
            >
                <Plus className="w-4 h-4" />
                <span>Yeni Sınav</span>
            </button>
        </div>

        {/* Exam Dates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(examDates || []).sort((a, b) => a.order - b.order).map((exam) => (
                <div
                    key={exam.id}
                    className="group bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-14 h-14 bg-gradient-to-br from-brand-blue to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Calendar className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-brand-dark">
                                    {exam.examName}
                                </h3>
                                <span className="text-xs font-medium text-slate-400">
                                    {new Date(exam.examDate).toLocaleDateString('tr-TR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                        <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">
                            #{exam.order}
                        </span>
                    </div>

                    {exam.description && (
                        <p className="text-sm text-slate-600 font-medium mb-4">
                            {exam.description}
                        </p>
                    )}

                    <div className="flex items-center space-x-2 pt-4 border-t border-slate-50">
                        <button
                            onClick={() => handleEdit('examDate', exam)}
                            className="flex-1 p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-brand-blue hover:text-white transition-all text-xs font-bold"
                        >
                            <Settings2 className="w-3.5 h-3.5 mx-auto" />
                        </button>
                        <button
                            onClick={() => handleDelete('examDate', exam.id)}
                            className="flex-1 p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
                        >
                            <Trash className="w-3.5 h-3.5 mx-auto" />
                        </button>
                    </div>
                </div>
            ))}
        </div>

        {/* Empty State */}
        {(!examDates || examDates.length === 0) && (
            <div className="text-center py-20">
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-black text-slate-400 mb-2">Henüz sınav tarihi yok</h3>
                <p className="text-sm text-slate-400 mb-6">İlk sınav tarihini ekleyerek başlayın</p>
                <button
                    onClick={() => handleAdd('examDate')}
                    className="px-6 py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-dark transition-all inline-flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>İlk Sınavı Ekle</span>
                </button>
            </div>
        )}
    </div>
);
