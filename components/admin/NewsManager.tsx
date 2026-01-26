import React from 'react';
import { Plus, Settings2, Trash, Eye, Calendar, MapPin } from 'lucide-react';
import { NewsItem, AdminUser, UserRole } from '../../types';
import { API_BASE_URL } from '../../services/api';

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
}) => {
    // Filter news based on user role
    const filteredNews = news.filter(n => 
        user?.role !== UserRole.BRANCH_ADMIN || n.branchId === user?.branchId
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-3xl font-black text-brand-dark capitalize tracking-tight leading-none">
                        Haber <span className="text-brand-blue italic">Yönetimi</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-[13px] mt-2 tracking-wide">
                        {user?.role === UserRole.BRANCH_ADMIN 
                            ? 'Şubenize özel haberleri yönetin.' 
                            : 'Genel ve şube özel tüm haberleri yönetin.'}
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

            {filteredNews.length === 0 ? (
                <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-16 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Eye className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-black text-brand-dark mb-2">Henüz Haber Yok</h3>
                    <p className="text-slate-500 font-medium mb-6">İlk haberi ekleyerek başlayın.</p>
                    <button
                        onClick={() => handleAdd('news')}
                        className="px-8 py-4 bg-brand-blue text-white font-black rounded-2xl hover:bg-brand-dark shadow-xl shadow-brand-blue/20 transition-all inline-flex items-center space-x-2"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Haber Ekle</span>
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNews.map((newsItem) => (
                        <div
                            key={newsItem.id}
                            className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all group"
                        >
                            {/* Image */}
                            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                                {newsItem.featuredImage ? (
                                    <img 
                                        src={newsItem.featuredImage.startsWith('http') ? newsItem.featuredImage : (newsItem.featuredImage.startsWith('/assets') ? newsItem.featuredImage : `${API_BASE_URL}${newsItem.featuredImage}`)} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                        alt={newsItem.title} 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Eye className="w-12 h-12 text-slate-300" />
                                    </div>
                                )}
                                
                                {/* Status Badge */}
                                <div className="absolute top-3 left-3">
                                    <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black capitalize tracking-widest shadow-lg ${
                                        newsItem.status === 'PUBLISHED' 
                                            ? 'bg-green-500 text-white' 
                                            : newsItem.status === 'DRAFT'
                                            ? 'bg-amber-500 text-white'
                                            : 'bg-slate-500 text-white'
                                    }`}>
                                        {newsItem.status === 'PUBLISHED' ? 'Yayında' : newsItem.status === 'DRAFT' ? 'Taslak' : 'Arşiv'}
                                    </span>
                                </div>

                                {/* Featured Badge */}
                                {newsItem.isFeatured && (
                                    <div className="absolute top-3 right-3">
                                        <span className="px-3 py-1.5 bg-brand-blue text-white rounded-lg text-[9px] font-black capitalize tracking-widest shadow-lg">
                                            Öne Çıkan
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                {/* Title */}
                                <h3 className="font-black text-brand-dark text-base line-clamp-2 leading-tight">
                                    {newsItem.title}
                                </h3>

                                {/* Excerpt */}
                                {newsItem.excerpt && (
                                    <p className="text-xs text-slate-500 line-clamp-2 font-medium">
                                        {newsItem.excerpt}
                                    </p>
                                )}

                                {/* Meta Info */}
                                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
                                    {newsItem.publishedAt && (
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>{new Date(newsItem.publishedAt).toLocaleDateString('tr-TR')}</span>
                                        </div>
                                    )}
                                    {newsItem.branchId && (
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            <span>Şube Özel</span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-2 border-t border-slate-100">
                                    <button
                                        onClick={() => handleEdit('news', newsItem)}
                                        className="flex-1 px-4 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-black hover:bg-brand-dark transition-all flex items-center justify-center gap-2"
                                    >
                                        <Settings2 className="w-3.5 h-3.5" />
                                        <span>Düzenle</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete('news', newsItem.id)}
                                        className="px-4 py-2.5 bg-red-50 text-red-500 rounded-xl text-xs font-black hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        <Trash className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
