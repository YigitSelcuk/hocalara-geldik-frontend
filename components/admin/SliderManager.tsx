import React from 'react';
import { Plus, Settings2, Trash, Link as LinkIcon } from 'lucide-react';
import { SliderItem } from '../../types';
import { API_BASE_URL } from '../../services/api';

interface SliderManagerProps {
    sliders: SliderItem[];
    handleAdd: (type: 'slider') => void;
    handleEdit: (type: 'slider', item: SliderItem) => void;
    handleDelete: (type: 'slider', id: string) => void;
}

export const SliderManager: React.FC<SliderManagerProps> = ({
    sliders,
    handleAdd,
    handleEdit,
    handleDelete
}) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm">
            <div>
                <h1 className="text-3xl font-black text-brand-dark capitalize tracking-tight leading-none">Vitrin <span className="text-brand-blue italic">Yönetimi</span></h1>
                <p className="text-slate-500 font-bold text-[13px] mt-2 tracking-wide">Ana sayfa slider ve özel şube bannerlarını düzenleyin.</p>
            </div>
            <button
                onClick={() => handleAdd('slider')}
                className="px-8 py-4 bg-brand-blue text-white font-black rounded-2xl hover:bg-brand-dark shadow-xl shadow-brand-blue/20 transition-all flex items-center space-x-2"
            >
                <Plus className="w-5 h-5" />
                <span>Yeni Slayt Ekle</span>
            </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {sliders.map((slider) => (
                <div key={slider.id} className="bg-white rounded-[28px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group">
                    <div className="aspect-[21/9] relative overflow-hidden">
                        <img src={slider.image?.startsWith('http') ? slider.image : (slider.image?.startsWith('/assets') ? slider.image : `${API_BASE_URL}${slider.image}`)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={slider.title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/20 to-transparent"></div>
                        <div className="absolute bottom-6 left-8 right-8">
                            <div className="flex items-center space-x-3 mb-3">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black capitalize tracking-widest shadow-lg ${slider.target === 'main' ? 'bg-brand-blue text-white' : 'bg-amber-500 text-white'
                                    }`}>
                                    {slider.target === 'main' ? 'Global Vitrin' : 'Şube Özel'}
                                </span>
                                <span className="px-4 py-1.5 bg-green-500 text-white rounded-full text-[10px] font-black capitalize tracking-widest">Aktif</span>
                            </div>
                            <h3 className="text-2xl font-black text-white leading-tight capitalize tracking-tight">{slider.title}</h3>
                        </div>
                    </div>
                    <div className="p-6 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center space-x-3">
                            <div className="p-2.5 bg-white rounded-xl shadow-sm">
                                <LinkIcon className="w-4 h-4 text-slate-400" />
                            </div>
                            <span className="text-xs font-bold text-slate-500 truncate max-w-[200px]">{slider.link}</span>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleEdit('slider', slider)}
                                className="p-3 bg-white rounded-xl shadow-sm hover:bg-brand-blue hover:text-white text-slate-400 transition-all"
                            >
                                <Settings2 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleDelete('slider', slider.id)}
                                className="p-3 bg-white rounded-xl shadow-sm hover:bg-red-500 hover:text-white text-slate-400 transition-all"
                            >
                                <Trash className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
