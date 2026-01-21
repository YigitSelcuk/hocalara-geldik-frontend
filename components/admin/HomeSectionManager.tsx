import React from 'react';
import { Plus, Settings2, Trash, Layout, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { HomeSection } from '../../types';

interface HomeSectionManagerProps {
    homeSections: HomeSection[];
    handleAdd: (type: 'homeSection') => void;
    handleEdit: (type: 'homeSection', item: HomeSection) => void;
    handleDelete: (type: 'homeSection', id: string) => void;
}

export const HomeSectionManager: React.FC<HomeSectionManagerProps> = ({
    homeSections,
    handleAdd,
    handleEdit,
    handleDelete
}) => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-black text-brand-dark tracking-tight leading-none">
                    Sayfa <span className="text-brand-blue italic">Bölümleri</span>
                </h1>
                <p className="text-slate-500 font-medium text-sm mt-1">
                    Ana sayfa bölümlerinin başlık, alt başlık ve görsellerini yönetin.
                </p>
            </div>
            <button
                onClick={() => handleAdd('homeSection')}
                className="px-6 py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-dark transition-all flex items-center space-x-2 shadow-lg shadow-brand-blue/20"
            >
                <Plus className="w-4 h-4" />
                <span>Yeni Bölüm</span>
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(homeSections || []).map((section) => (
                <div
                    key={section.id}
                    className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                                    <Layout className="w-5 h-5 text-brand-blue" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Anahtar</span>
                                    <h3 className="text-sm font-black text-brand-dark leading-none">{section.key}</h3>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleEdit('homeSection', section)}
                                    className="p-1.5 bg-slate-50 text-slate-600 rounded-lg hover:bg-brand-blue hover:text-white transition-all"
                                >
                                    <Settings2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => handleDelete('homeSection', section.id)}
                                    className="p-1.5 bg-slate-50 text-slate-600 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                >
                                    <Trash className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Üst Başlık (Badge)</span>
                                <p className="text-xs font-bold text-slate-600">{section.topTitle || '-'}</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ana Başlık</span>
                                <p className="text-sm font-black text-brand-dark line-clamp-2">{section.title}</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Alt Başlık</span>
                                <p className="text-xs font-medium text-slate-500 line-clamp-2">{section.subtitle || '-'}</p>
                            </div>
                        </div>

                        {(section.image || section.bgImage) && (
                            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center space-x-4">
                                {section.image && (
                                    <div className="flex items-center space-x-1 text-xs font-bold text-slate-400">
                                        <ImageIcon className="w-3 h-3" />
                                        <span>Görsel</span>
                                    </div>
                                )}
                                {section.bgImage && (
                                    <div className="flex items-center space-x-1 text-xs font-bold text-slate-400">
                                        <ImageIcon className="w-3 h-3" />
                                        <span>Arkaplan</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {section.link && (
                            <div className="mt-3 flex items-center space-x-2 text-[10px] font-black text-brand-blue uppercase tracking-wider">
                                <span>{section.linkText || 'Detaylı Bilgi'}</span>
                                <ChevronRight className="w-3 h-3" />
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>

        {(!homeSections || homeSections.length === 0) && (
            <div className="text-center py-20">
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Layout className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-black text-slate-400 mb-2">Henüz bölüm yok</h3>
                <p className="text-sm text-slate-400 mb-6">İlk bölümü ekleyerek başlayın</p>
                <button
                    onClick={() => handleAdd('homeSection')}
                    className="px-6 py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-dark transition-all inline-flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>İlk Bölümü Ekle</span>
                </button>
            </div>
        )}
    </div>
);
