import React from 'react';
import { Plus, Trash } from 'lucide-react';
import { Media } from '../../types';

interface MediaManagerProps {
    mediaItems: Media[];
    handleAdd: (type: 'media') => void;
    handleDelete: (type: 'media', id: string) => void;
}

export const MediaManager: React.FC<MediaManagerProps> = ({
    mediaItems,
    handleAdd,
    handleDelete
}) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm">
            <div>
                <h1 className="text-3xl font-black text-brand-dark capitalize tracking-tight leading-none">Medya <span className="text-brand-blue italic">Kütüphanesi</span></h1>
                <p className="text-slate-500 font-bold text-[13px] mt-2 tracking-wide">Tüm görselleri ve dökümanları buradan yönetin.</p>
            </div>
            <button onClick={() => handleAdd('media')} className="px-8 py-4 bg-brand-blue text-white font-black rounded-2xl flex items-center space-x-2"><Plus className="w-5 h-5" /><span>Dosya Yükle</span></button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {(mediaItems || []).map((item: any) => (
                <div key={item.id} className="bg-white p-2 rounded-2xl border border-slate-100 group relative">
                    <img src={item.url ? (item.url.startsWith('http') ? item.url : (item.url.startsWith('/assets') ? item.url : `${API_BASE_URL}${item.url}`)) : ''} className="w-full aspect-square object-cover rounded-xl" alt="" />
                    <div className="absolute inset-0 bg-brand-dark/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center space-x-2">
                        <button onClick={() => handleDelete('media', item.id)} className="p-2 bg-red-500 text-white rounded-lg"><Trash className="w-4 h-4" /></button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
