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
}) => {
    // YouTube thumbnail URL'ini al
    const getYouTubeThumbnail = (url: string) => {
        if (!url) return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="640" height="360"%3E%3Crect fill="%23ddd" width="640" height="360"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="24" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Thumbnail%3C/text%3E%3C/svg%3E';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        const videoId = (match && match[2].length === 11) ? match[2] : null;
        return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : url;
    };

    return (
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

            {videos.length === 0 ? (
                <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-16 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Play className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-black text-brand-dark mb-2">Henüz Video Yok</h3>
                    <p className="text-slate-500 font-medium">İlk videonuzu ekleyerek başlayın.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video) => (
                        <div key={video.id} className="bg-white rounded-[24px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                            <div className="aspect-video relative">
                                <img 
                                    src={video.thumbnail || getYouTubeThumbnail(video.videoUrl)} 
                                    className="w-full h-full object-cover" 
                                    alt={video.title}
                                    onError={(e) => {
                                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="640" height="360"%3E%3Crect fill="%23ddd" width="640" height="360"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="24" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EVideo%3C/text%3E%3C/svg%3E';
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-white/90 p-4 rounded-full"><Play className="w-6 h-6 text-brand-blue" /></div>
                                </div>
                            </div>
                            <div className="p-5 space-y-3">
                                <div className="flex items-center gap-2">
                                    <span key="subject" className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black capitalize tracking-widest">{video.subject}</span>
                                    <span key="category" className="px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-lg text-[9px] font-black capitalize tracking-widest">{video.category?.replace(/_/g, ' ')}</span>
                                </div>
                                <h3 className="font-black text-brand-dark text-sm line-clamp-2 capitalize tracking-tight">{video.title}</h3>
                                {video.description && (
                                    <p className="text-xs text-slate-500 line-clamp-2">{video.description}</p>
                                )}
                                <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                                    <div className="space-y-1">
                                        {video.teacher && <span className="text-xs font-bold text-slate-400 block">👨‍🏫 {video.teacher}</span>}
                                        <span className="text-xs font-bold text-slate-400 block">⏱️ {video.duration || 'N/A'}</span>
                                    </div>
                                    <div className="flex space-x-1">
                                        <button
                                            onClick={() => handleEdit('video', video)}
                                            className="p-2 text-slate-400 hover:text-brand-blue transition-colors"
                                            title="Düzenle"
                                        >
                                            <Settings2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete('video', video.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                            title="Sil"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
