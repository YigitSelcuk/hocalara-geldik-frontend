import React from 'react';
import { Plus, Settings2, Trash, Play } from 'lucide-react';
import { VideoLesson } from '../../types';

interface VideoManagerProps {
    videos: VideoLesson[];
    handleAdd: (type: 'video') => void;
    handleEdit: (type: 'video', item: VideoLesson) => void;
    handleDelete: (type: 'video', id: string) => void;
}

export const VideoManager: React.FC<VideoManagerProps> = ({
    videos,
    handleAdd,
    handleEdit,
    handleDelete
}) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm">
            <div>
                <h1 className="text-3xl font-black text-brand-dark capitalize tracking-tight leading-none">Video <span className="text-brand-blue italic">Kütüphanesi</span></h1>
                <p className="text-slate-500 font-bold text-[13px] mt-2 tracking-wide">Eğitim videolarını ve kategorileri yönetin.</p>
            </div>
            <button
                onClick={() => handleAdd('video')}
                className="px-8 py-4 bg-brand-blue text-white font-black rounded-2xl hover:bg-brand-dark shadow-xl shadow-brand-blue/20 transition-all flex items-center space-x-2"
            >
                <Plus className="w-5 h-5" />
                <span>Yeni Video Yükle</span>
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
                <div key={video.id} className="bg-white rounded-[24px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                    <div className="aspect-video relative">
                        <img src={video.thumbnail} className="w-full h-full object-cover" alt="" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-white/90 p-4 rounded-full"><Play className="w-6 h-6 text-brand-blue" /></div>
                        </div>
                    </div>
                    <div className="p-5 space-y-3">
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black capitalize tracking-widest">{video.subject}</span>
                        <h3 className="font-black text-brand-dark text-sm truncate capitalize tracking-tight">{video.title}</h3>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                            <span className="text-xs font-bold text-slate-400">{video.duration} • {video.views || 0} İzlenme</span>
                            <div className="flex space-x-1">
                                <button
                                    onClick={() => handleEdit('video', video)}
                                    className="p-2 text-slate-400 hover:text-brand-blue transition-colors"
                                >
                                    <Settings2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete('video', video.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
