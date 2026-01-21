import React from 'react';
import { Plus, Settings2, Trash, LayoutGrid } from 'lucide-react';

interface BannerCard {
    id: string;
    icon: string;
    title: string;
    description: string;
    bgColor: string;
    hoverColor: string;
    link: string;
    order: number;
}

interface BannerCardManagerProps {
    bannerCards: BannerCard[];
    handleAdd: (type: 'bannerCard') => void;
    handleEdit: (type: 'bannerCard', item: BannerCard) => void;
    handleDelete: (type: 'bannerCard', id: string) => void;
}

export const BannerCardManager: React.FC<BannerCardManagerProps> = ({
    bannerCards,
    handleAdd,
    handleEdit,
    handleDelete
}) => (
    <div className="space-y-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-black text-brand-dark tracking-tight leading-none">
                    Banner <span className="text-brand-blue italic">Kartları</span>
                </h1>
                <p className="text-slate-500 font-medium text-sm mt-1">
                    Ana sayfada görünen hızlı erişim kartlarını yönetin.
                </p>
            </div>
            <button
                onClick={() => handleAdd('bannerCard')}
                className="px-6 py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-dark transition-all flex items-center space-x-2 shadow-lg shadow-brand-blue/20"
            >
                <Plus className="w-4 h-4" />
                <span>Yeni Kart</span>
            </button>
        </div>

        {/* Banner Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {(bannerCards || []).sort((a, b) => a.order - b.order).map((card) => (
                <div
                    key={card.id}
                    className="group bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <span className="text-2xl">{card.icon}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">
                            #{card.order}
                        </span>
                    </div>

                    <h3 className="text-sm font-black text-brand-dark mb-1">
                        {card.title}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium mb-3 line-clamp-2">
                        {card.description}
                    </p>

                    <div className="flex items-center space-x-2 pt-3 border-t border-slate-50">
                        <button
                            onClick={() => handleEdit('bannerCard', card)}
                            className="flex-1 p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-brand-blue hover:text-white transition-all text-xs font-bold"
                        >
                            <Settings2 className="w-3.5 h-3.5 mx-auto" />
                        </button>
                        <button
                            onClick={() => handleDelete('bannerCard', card.id)}
                            className="flex-1 p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
                        >
                            <Trash className="w-3.5 h-3.5 mx-auto" />
                        </button>
                    </div>
                </div>
            ))}
        </div>

        {/* Empty State */}
        {(!bannerCards || bannerCards.length === 0) && (
            <div className="text-center py-20">
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <LayoutGrid className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-black text-slate-400 mb-2">Henüz banner kartı yok</h3>
                <p className="text-sm text-slate-400 mb-6">İlk kartınızı ekleyerek başlayın</p>
                <button
                    onClick={() => handleAdd('bannerCard')}
                    className="px-6 py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-dark transition-all inline-flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>İlk Kartı Ekle</span>
                </button>
            </div>
        )}
    </div>
);
