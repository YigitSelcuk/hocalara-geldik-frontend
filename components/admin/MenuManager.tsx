import React from 'react';
import { Plus, Settings2, Trash } from 'lucide-react';
import { Menu } from '../../types';

interface MenuManagerProps {
    menus: Menu[];
    handleAdd: (type: 'menu') => void;
    handleEdit: (type: 'menu', item: Menu) => void;
    handleDelete: (type: 'menu', id: string) => void;
}

export const MenuManager: React.FC<MenuManagerProps> = ({
    menus,
    handleAdd,
    handleEdit,
    handleDelete
}) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm">
            <div>
                <h1 className="text-3xl font-black text-brand-dark capitalize tracking-tight leading-none">Menü <span className="text-brand-blue italic">Yönetimi</span></h1>
                <p className="text-slate-500 font-bold text-[13px] mt-2 tracking-wide">Site genelindeki navigasyon ve footer menülerini düzenleyin.</p>
            </div>
            <button
                onClick={() => handleAdd('menu')}
                className="px-8 py-4 bg-brand-blue text-white font-black rounded-2xl hover:bg-brand-dark shadow-xl shadow-brand-blue/20 transition-all flex items-center space-x-2"
            >
                <Plus className="w-5 h-5" />
                <span>Yeni Menü Ekle</span>
            </button>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50/50">
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Menü Adı</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Konum</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Öğe Sayısı</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 text-right">İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    {(menus || []).map((menu: any) => (
                        <tr key={menu.id} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-5">
                                <p className="font-black text-brand-dark text-sm capitalize tracking-tight">{menu.name}</p>
                            </td>
                            <td className="px-8 py-5">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{menu.location}</span>
                            </td>
                            <td className="px-8 py-5">
                                <span className="text-xs font-black text-brand-blue">{menu.items?.length || 0} Öğe</span>
                            </td>
                            <td className="px-8 py-5 text-right">
                                <div className="flex justify-end space-x-2">
                                    <button onClick={() => handleEdit('menu', menu)} className="p-2.5 bg-white text-brand-blue rounded-xl shadow-sm hover:bg-brand-blue hover:text-white transition-all"><Settings2 className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete('menu', menu.id)} className="p-2.5 bg-white text-red-500 rounded-xl shadow-sm hover:bg-red-500 hover:text-white transition-all"><Trash className="w-4 h-4" /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);
