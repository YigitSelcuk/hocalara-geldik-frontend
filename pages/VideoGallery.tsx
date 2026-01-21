
import React, { useState } from 'react';
import { Play, Clock, Eye, Search, X, BookOpen } from 'lucide-react';
import { VIDEO_LESSONS } from '../constants';
import { VideoCategory } from '../types';

const VideoGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<VideoCategory | 'ALL'>('ALL');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'ALL' as const, label: 'Tüm Videolar', count: VIDEO_LESSONS.length },
    { id: VideoCategory.YKS_TYT, label: 'YKS TYT', count: VIDEO_LESSONS.filter(v => v.category === VideoCategory.YKS_TYT).length },
    { id: VideoCategory.YKS_AYT, label: 'YKS AYT', count: VIDEO_LESSONS.filter(v => v.category === VideoCategory.YKS_AYT).length },
    { id: VideoCategory.LGS, label: 'LGS', count: VIDEO_LESSONS.filter(v => v.category === VideoCategory.LGS).length },
    { id: VideoCategory.KPSS, label: 'KPSS', count: VIDEO_LESSONS.filter(v => v.category === VideoCategory.KPSS).length }
  ];

  const filteredVideos = VIDEO_LESSONS.filter(video => {
    const matchesCategory = activeCategory === 'ALL' || video.category === activeCategory;
    const matchesSearch = searchQuery === '' ||
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getVideoEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/embed')) return url;
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  return (
    <div className="min-h-screen mesh-bg pb-24">
      {/* Header */}
      <section className="bg-brand-dark py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/assets/sliders/zemin.png" className="w-full h-full object-cover opacity-60" alt="" />
          <div className="absolute inset-0 bg-brand-dark/40"></div>
        </div>

        <div className="max-w-[1600px] mx-auto px-12 relative z-10 text-center">
          <div className="inline-flex items-center space-x-3 text-brand-blue font-black capitalize text-xs tracking-widest bg-brand-blue/20 backdrop-blur-xl px-8 py-4 rounded-2xl mb-10 border border-brand-blue/30">
            <Play className="w-6 h-6" />
            <span>Örnek Ders Videoları</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none mb-8 capitalize">
            Video <span className="text-brand-blue italic">Kütüphanemiz</span>
          </h1>
          <p className="text-slate-200 text-2xl max-w-full mx-auto font-medium leading-relaxed">
            5000+ saatlik profesyonel ders videoları ile akademik başarınızı artırın.
          </p>
        </div>
      </section>

      <div className="max-w-[1600px] mx-auto px-12 -mt-20 relative z-20">
        {/* Search Bar */}
        <div className="bg-white rounded-[20px] shadow-2xl border border-slate-100 p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
            <input
              type="text"
              placeholder="Video, ders veya konu ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-brand-gray rounded-2xl text-brand-dark font-bold text-lg border-2 border-transparent focus:border-brand-blue focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-white rounded-[20px] shadow-2xl border border-slate-100 p-6 mb-12 overflow-x-auto">
          <div className="flex items-center justify-center space-x-4 min-w-max">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`relative px-8 py-4 rounded-xl text-sm font-black tracking-wide transition-all duration-300 ${activeCategory === category.id
                  ? 'bg-brand-blue text-white shadow-xl shadow-brand-blue/30 scale-105'
                  : 'bg-brand-gray text-slate-600 hover:bg-slate-100 hover:text-brand-dark'
                  }`}
              >
                <span className="flex items-center space-x-2">
                  <span>{category.label}</span>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] ${activeCategory === category.id
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 text-slate-600'
                    }`}>
                    {category.count}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="group bg-white rounded-[20px] overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
              onClick={() => setSelectedVideo(video.id)}
            >
              <div className="relative aspect-video bg-brand-dark overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent"></div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-brand-blue/90 backdrop-blur-xl rounded-full flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-brand-blue transition-all shadow-2xl">
                    <Play className="w-10 h-10 ml-1" fill="white" />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-brand-dark/90 backdrop-blur-xl text-white rounded-lg text-xs font-black flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{video.duration}</span>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4 px-4 py-2 bg-brand-blue text-white rounded-xl text-[10px] font-black capitalize tracking-widest shadow-xl">
                  {video.category.replace('_', ' ')}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-2 text-slate-400 text-xs font-bold">
                  <BookOpen className="w-4 h-4 text-brand-blue" />
                  <span>{video.subject}</span>
                  {video.difficulty && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px]">{video.difficulty}</span>
                    </>
                  )}
                </div>

                <h3 className="text-lg font-black text-brand-dark leading-tight line-clamp-2 group-hover:text-brand-blue transition-colors">
                  {video.title}
                </h3>

                <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed">
                  {video.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  {video.teacher && (
                    <div className="text-xs font-bold text-slate-400">
                      <span className="text-brand-blue">{video.teacher}</span>
                    </div>
                  )}
                  {video.views && (
                    <div className="flex items-center space-x-1 text-xs font-bold text-slate-400">
                      <Eye className="w-4 h-4" />
                      <span>{video.views.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl font-black text-slate-400">Aradığınız kriterlere uygun video bulunamadı.</p>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-brand-dark/95 backdrop-blur-xl z-[200] flex items-center justify-center p-6"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-5xl bg-brand-dark rounded-[20px] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/10 backdrop-blur-xl text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="aspect-video bg-brand-dark">
              <iframe
                src={getVideoEmbedUrl(VIDEO_LESSONS.find(v => v.id === selectedVideo)?.videoUrl || '')}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {VIDEO_LESSONS.find(v => v.id === selectedVideo) && (
              <div className="p-8 bg-brand-dark text-white">
                <h2 className="text-3xl font-black mb-4">
                  {VIDEO_LESSONS.find(v => v.id === selectedVideo)?.title}
                </h2>
                <p className="text-slate-300 font-medium leading-relaxed">
                  {VIDEO_LESSONS.find(v => v.id === selectedVideo)?.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGallery;
