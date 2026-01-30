import React from 'react';
import { Play } from 'lucide-react';
import { VideoCategory } from '../../../types';

interface VideoFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const VideoForm: React.FC<VideoFormProps> = ({ formData, setFormData }) => {
  // YouTube video ID'sini çıkar
  const getYouTubeVideoId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getYouTubeThumbnail = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  };

  const videoId = getYouTubeVideoId(formData.videoUrl || '');
  const thumbnailUrl = getYouTubeThumbnail(formData.videoUrl || '');

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Video Başlığı *</label>
        <input
          type="text"
          value={formData.title || ''}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
          placeholder="Örn: Matematik - Türev Konusu"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">YouTube Video URL *</label>
        <input
          type="text"
          value={formData.videoUrl || ''}
          onChange={e => {
            const url = e.target.value;
            setFormData({
              ...formData,
              videoUrl: url,
              thumbnail: getYouTubeThumbnail(url) || formData.thumbnail
            });
          }}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
        />
        {thumbnailUrl && (
          <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs font-bold text-slate-500 mb-2">Video Önizleme:</p>
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
              <img src={thumbnailUrl} alt="Video thumbnail" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </div>
              </div>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-2">Video ID: {videoId}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Kategori *</label>
          <select
            value={formData.category || ''}
            onChange={e => setFormData({ ...formData, category: e.target.value })}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
            required
          >
            <option value="">Kategori Seçin</option>
            {Object.values(VideoCategory).map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Ders / Branş *</label>
          <input
            type="text"
            value={formData.subject || ''}
            onChange={e => setFormData({ ...formData, subject: e.target.value })}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
            placeholder="Örn: Matematik"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Süre</label>
          <input type="text" placeholder="Örn: 45:00" value={formData.duration || ''} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Öğretmen</label>
          <input type="text" value={formData.teacher || ''} onChange={e => setFormData({ ...formData, teacher: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Açıklama</label>
        <textarea
          rows={3}
          value={formData.description || ''}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          placeholder="Video hakkında kısa açıklama..."
          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold resize-none"
        />
      </div>
    </div>
  );
};
