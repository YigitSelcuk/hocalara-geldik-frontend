import React from 'react';
import { Plus, Settings2, Trash } from 'lucide-react';
import { Page } from '../../types';

interface PageManagerProps {
    pages: Page[];
    handleAdd: (type: 'page') => void;
    handleEdit: (type: 'page', item: Page) => void;
    handleDelete: (type: 'page', id: string) => void;
}

export const PageManager: React.FC<PageManagerProps> = ({
    pages,
    handleAdd,
    handleEdit,
    handleDelete
}) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm">
            <div>
                <h1 className="text-3xl font-black text-brand-dark capitalize tracking-tight leading-none">Sayfa <span className="text-brand-blue italic">Yönetimi</span></h1>
                <p className="text-slate-500 font-bold text-[13px] mt-2 tracking-wide">Kurumsal sayfaları ve şube özel sayfalarını düzenleyin.</p>
            </div>
            <button
                onClick={() => handleAdd('page')}
                className="px-8 py-4 bg-brand-blue text-white font-black rounded-2xl hover:bg-brand-dark shadow-xl shadow-brand-blue/20 transition-all flex items-center space-x-2"
            >
                <Plus className="w-5 h-5" />
                <span>Yeni Sayfa Ekle</span>
            </button>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50/50">
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Sayfa Başlığı</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">URL Slug</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Durum</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 text-right">İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    {(pages || []).map((page: any) => (
                        <tr key={page.id} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-5">
                                <p className="font-black text-brand-dark text-sm capitalize tracking-tight">{page.title}</p>
                            </td>
                            <td className="px-8 py-5 text-xs font-bold text-slate-500">/{page.slug}</td>
                            <td className="px-8 py-5">
                                <span className="px-4 py-1.5 bg-green-500/10 text-green-600 rounded-full text-[9px] font-black capitalize tracking-widest">Yayında</span>
                            </td>
                            <td className="px-8 py-5 text-right">
                                <div className="flex justify-end space-x-2">
                                    <button onClick={() => handleEdit('page', page)} className="p-2.5 bg-white text-brand-blue rounded-xl shadow-sm hover:bg-brand-blue hover:text-white transition-all"><Settings2 className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete('page', page.id)} className="p-2.5 bg-white text-red-500 rounded-xl shadow-sm hover:bg-red-500 hover:text-white transition-all"><Trash className="w-4 h-4" /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);
