import React from 'react';
import { Plus, Settings2, Trash, FileText, Calendar, Clock } from 'lucide-react';
import { API_BASE_URL } from '../../services/api';

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content?: string;
    category: string;
    author: string;
    date: string;
    image: string;
    readTime: string;
}

interface BlogManagerProps {
    blogPosts: BlogPost[];
    handleAdd: (type: 'blog') => void;
    handleEdit: (type: 'blog', item: BlogPost) => void;
    handleDelete: (type: 'blog', id: string) => void;
}

export const BlogManager: React.FC<BlogManagerProps> = ({
    blogPosts,
    handleAdd,
    handleEdit,
    handleDelete
}) => (
    <div className="space-y-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-black text-brand-dark tracking-tight leading-none">
                    Blog ve <span className="text-brand-blue italic">Rehberlik</span>
                </h1>
                <p className="text-slate-500 font-medium text-sm mt-1">
                    Rehberlik yazıları ve blog içeriklerini yönetin.
                </p>
            </div>
            <button
                onClick={() => handleAdd('blog')}
                className="px-6 py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-dark transition-all flex items-center space-x-2 shadow-lg shadow-brand-blue/20"
            >
                <Plus className="w-4 h-4" />
                <span>Yeni Yazı</span>
            </button>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(blogPosts || []).map((post) => (
                <div
                    key={post.id}
                    className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                    {/* Image */}
                    <div className="relative aspect-video overflow-hidden bg-slate-100">
                        <img
                            src={post.image?.startsWith('http') ? post.image : (post.image?.startsWith('/assets') ? post.image : `${API_BASE_URL}${post.image}`)}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                            <span className="px-3 py-1 bg-brand-blue text-white rounded-lg text-xs font-bold">
                                {post.category}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                        <div className="flex items-center space-x-3 text-xs font-medium text-slate-400 mb-3">
                            <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>{post.date}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{post.readTime}</span>
                            </div>
                        </div>

                        <h3 className="text-sm font-black text-brand-dark mb-2 line-clamp-2 group-hover:text-brand-blue transition-colors">
                            {post.title}
                        </h3>

                        <p className="text-xs text-slate-600 font-medium line-clamp-2 mb-3">
                            {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                            <span className="text-xs font-bold text-slate-500">{post.author}</span>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleEdit('blog', post)}
                                    className="p-1.5 bg-slate-50 text-slate-600 rounded-lg hover:bg-brand-blue hover:text-white transition-all"
                                >
                                    <Settings2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => handleDelete('blog', post.id)}
                                    className="p-1.5 bg-slate-50 text-slate-600 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                >
                                    <Trash className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Empty State */}
        {(!blogPosts || blogPosts.length === 0) && (
            <div className="text-center py-20">
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-black text-slate-400 mb-2">Henüz blog yazısı yok</h3>
                <p className="text-sm text-slate-400 mb-6">İlk yazınızı ekleyerek başlayın</p>
                <button
                    onClick={() => handleAdd('blog')}
                    className="px-6 py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-dark transition-all inline-flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>İlk Yazıyı Ekle</span>
                </button>
            </div>
        )}
    </div>
);
