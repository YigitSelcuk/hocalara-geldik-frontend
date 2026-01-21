import React from 'react';
import { Plus, Settings2, Trash, TrendingUp } from 'lucide-react';

interface Statistic {
    id: string;
    value: string;
    label: string;
    icon: string;
    order: number;
}

interface StatisticsManagerProps {
    statistics: Statistic[];
    handleAdd: (type: 'statistic') => void;
    handleEdit: (type: 'statistic', item: Statistic) => void;
    handleDelete: (type: 'statistic', id: string) => void;
}

export const StatisticsManager: React.FC<StatisticsManagerProps> = ({
    statistics,
    handleAdd,
    handleEdit,
    handleDelete
}) => (
    <div className="space-y-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-black text-brand-dark tracking-tight leading-none">
                    İstatistik <span className="text-brand-blue italic">Kartları</span>
                </h1>
                <p className="text-slate-500 font-medium text-sm mt-1">
                    Ana sayfada görünen başarı istatistiklerini yönetin.
                </p>
            </div>
            <button
                onClick={() => handleAdd('statistic')}
                className="px-6 py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-dark transition-all flex items-center space-x-2 shadow-lg shadow-brand-blue/20"
            >
                <Plus className="w-4 h-4" />
                <span>Yeni İstatistik</span>
            </button>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {(statistics || []).sort((a, b) => a.order - b.order).map((stat) => (
                <div
                    key={stat.id}
                    className="group bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-slate-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 bg-brand-blue rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all">
                            <span className="text-3xl">{stat.icon}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded">
                            #{stat.order}
                        </span>
                    </div>

                    <div className="text-4xl font-black text-brand-blue mb-2">
                        {stat.value}
                    </div>
                    <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4">
                        {stat.label}
                    </div>

                    <div className="flex items-center space-x-2 pt-3 border-t border-white/50">
                        <button
                            onClick={() => handleEdit('statistic', stat)}
                            className="flex-1 p-2 bg-white text-slate-600 rounded-lg hover:bg-brand-blue hover:text-white transition-all text-xs font-bold"
                        >
                            <Settings2 className="w-3.5 h-3.5 mx-auto" />
                        </button>
                        <button
                            onClick={() => handleDelete('statistic', stat.id)}
                            className="flex-1 p-2 bg-white text-slate-600 rounded-lg hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
                        >
                            <Trash className="w-3.5 h-3.5 mx-auto" />
                        </button>
                    </div>
                </div>
            ))}
        </div>

        {/* Empty State */}
        {(!statistics || statistics.length === 0) && (
            <div className="text-center py-20">
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-black text-slate-400 mb-2">Henüz istatistik yok</h3>
                <p className="text-sm text-slate-400 mb-6">İlk istatistiğinizi ekleyerek başlayın</p>
                <button
                    onClick={() => handleAdd('statistic')}
                    className="px-6 py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-dark transition-all inline-flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>İlk İstatistiği Ekle</span>
                </button>
            </div>
        )}
    </div>
);
