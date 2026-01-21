import React from 'react';
import { Plus, Settings2, Trash, Youtube, ExternalLink } from 'lucide-react';
import { YouTubeChannel } from '../../types';

interface YouTubeManagerProps {
    channels: YouTubeChannel[];
    handleAdd: (type: 'youtube') => void;
    handleEdit: (type: 'youtube', item: YouTubeChannel) => void;
    handleDelete: (type: 'youtube', id: string) => void;
}

export const YouTubeManager: React.FC<YouTubeManagerProps> = ({
    channels,
    handleAdd,
    handleEdit,
    handleDelete
}) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm">
            <div>
                <h1 className="text-3xl font-black text-brand-dark capitalize tracking-tight leading-none">YouTube <span className="text-brand-blue italic">Kanalları</span></h1>
                <p className="text-slate-500 font-bold text-[13px] mt-2 tracking-wide">YouTube kanallarınızı ve abone bilgilerini yönetin.</p>
            </div>
            <button
                onClick={() => handleAdd('youtube')}
                className="px-8 py-4 bg-brand-blue text-white font-black rounded-2xl hover:bg-brand-dark shadow-xl shadow-brand-blue/20 transition-all flex items-center space-x-2"
            >
                <Plus className="w-5 h-5" />
                <span>Yeni Kanal Ekle</span>
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {channels.map((channel) => (
                <div key={channel.id} className="bg-white rounded-[32px] border border-slate-100 p-6 flex flex-col items-center text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a href={channel.url} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 text-slate-400 hover:text-brand-blue rounded-full transition-colors">
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>

                    <div className="w-20 h-20 bg-brand-blue/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                        <Youtube className="w-10 h-10 text-brand-blue" />
                    </div>

                    <h3 className="font-black text-brand-dark text-lg mb-1 leading-tight group-hover:text-brand-blue transition-colors">{channel.name}</h3>
                    <p className="text-xs text-slate-400 font-bold mb-4 line-clamp-2 px-4">{channel.description}</p>

                    <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-slate-50">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Abone</p>
                            <p className="text-sm font-black text-brand-dark">{channel.subscribers || '0'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Video</p>
                            <p className="text-sm font-black text-brand-dark">{channel.videoCount || '0'}</p>
                        </div>
                    </div>

                    <div className="flex space-x-2 mt-6 w-full">
                        <button
                            onClick={() => handleEdit('youtube', channel)}
                            className="flex-1 py-3 bg-slate-50 text-slate-400 font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-brand-blue hover:text-white transition-all flex items-center justify-center space-x-2"
                        >
                            <Settings2 className="w-3.5 h-3.5" />
                            <span>Düzenle</span>
                        </button>
                        <button
                            onClick={() => handleDelete('youtube', channel.id)}
                            className="w-12 py-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                        >
                            <Trash className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}

            {channels.length === 0 && (
                <div className="col-span-full py-20 bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-4">
                        <Youtube className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-black text-brand-dark opacity-40">Henüz Kanal Eklenmemiş</h3>
                    <p className="text-slate-400 font-bold text-sm mt-1">Yeni bir YouTube kanalı ekleyerek başlayın.</p>
                </div>
            )}
        </div>
    </div>
);
