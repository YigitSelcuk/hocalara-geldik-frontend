import React from 'react';
import { Plus, Settings2, Trash } from 'lucide-react';
import { NewsItem, AdminUser, UserRole } from '../../types';

interface NewsManagerProps {
    user: AdminUser | null;
    news: NewsItem[];
    handleAdd: (type: 'news') => void;
    handleEdit: (type: 'news', item: NewsItem) => void;
    handleDelete: (type: 'news', id: string) => void;
}

export const NewsManager: React.FC<NewsManagerProps> = ({
    user,
    news,
    handleAdd,
    handleEdit,
    handleDelete
}) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm">
            <div>
                <h1 className="text-3xl font-black text-brand-dark capitalize tracking-tight leading-none">Haber <span className="text-brand-blue italic">Yönetimi</span></h1>
                <p className="text-slate-500 font-bold text-[13px] mt-2 tracking-wide">
                    {user?.role === UserRole.BRANCH_ADMIN ? 'Şubenize özel haberleri yönetin.' : 'Genel ve şube özel tüm haberleri yönetin.'}
                </p>
            </div>
            <button
                onClick={() => handleAdd('news')}
                className="px-8 py-4 bg-brand-blue text-white font-black rounded-2xl hover:bg-brand-dark shadow-xl shadow-brand-blue/20 transition-all flex items-center space-x-2"
            >
                <Plus className="w-5 h-5" />
                <span>Yeni Haber Ekle</span>
            </button>
        </div>

        <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-8 py-5 text-[11px] font-black capitalize tracking-widest text-slate-400">Görsel</th>
                            <th className="px-8 py-5 text-[11px] font-black capitalize tracking-widest text-slate-400">Başlık & Özet</th>
                            <th className="px-8 py-5 text-[11px] font-black capitalize tracking-widest text-slate-400">Kapsam</th>
                            <th className="px-8 py-5 text-[11px] font-black capitalize tracking-widest text-slate-400 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {news.filter(n => user?.role !== UserRole.BRANCH_ADMIN || n.branchId === user?.assignedBranchId).map((newsItem) => (
                            <tr key={newsItem.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-5">
                                    <div className="w-20 h-14 rounded-xl overflow-hidden shadow-sm">
                                        <img src={newsItem.image} className="w-full h-full object-cover" alt="" />
                                    </div>
                                </td>
                                <td className="px-8 py-5 max-w-md">
                                    <p className="font-black text-brand-dark text-sm truncate capitalize tracking-tight">{newsItem.title}</p>
                                    <p className="text-xs text-slate-400 mt-1 font-bold">{newsItem.date}</p>
                                </td>
                                <td className="px-8 py-5">
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black capitalize tracking-widest ${newsItem.isMain ? 'bg-brand-blue/10 text-brand-blue' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {newsItem.isMain ? 'Genel' : 'Şube Özel'}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit('news', newsItem)}
                                            className="p-2.5 bg-white text-brand-blue rounded-xl shadow-sm hover:bg-brand-blue hover:text-white transition-all"
                                        >
                                            <Settings2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete('news', newsItem.id)}
                                            className="p-2.5 bg-white text-red-500 rounded-xl shadow-sm hover:bg-red-500 hover:text-white transition-all"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);
