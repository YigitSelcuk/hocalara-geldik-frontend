import React from 'react';
import { Plus, Settings2, Trash, Share2, Youtube, Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';

interface SocialMedia {
    id: string;
    platform: string;
    url: string;
    order: number;
}

interface SocialMediaManagerProps {
    socialMedia: SocialMedia[];
    handleAdd: (type: 'socialMedia') => void;
    handleEdit: (type: 'socialMedia', item: SocialMedia) => void;
    handleDelete: (type: 'socialMedia', id: string) => void;
}

const platformIcons: Record<string, any> = {
    youtube: Youtube,
    instagram: Instagram,
    twitter: Twitter,
    facebook: Facebook,
    linkedin: Linkedin,
};

const platformColors: Record<string, string> = {
    youtube: 'bg-red-600',
    instagram: 'bg-gradient-to-br from-purple-600 to-pink-600',
    twitter: 'bg-blue-400',
    facebook: 'bg-blue-600',
    linkedin: 'bg-blue-700',
};

export const SocialMediaManager: React.FC<SocialMediaManagerProps> = ({
    socialMedia,
    handleAdd,
    handleEdit,
    handleDelete
}) => (
    <div className="space-y-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-black text-brand-dark tracking-tight leading-none">
                    Sosyal <span className="text-brand-blue italic">Medya</span>
                </h1>
                <p className="text-slate-500 font-medium text-sm mt-1">
                    Sosyal medya hesaplarınızı yönetin.
                </p>
            </div>
            <button
                onClick={() => handleAdd('socialMedia')}
                className="px-6 py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-dark transition-all flex items-center space-x-2 shadow-lg shadow-brand-blue/20"
            >
                <Plus className="w-4 h-4" />
                <span>Yeni Platform</span>
            </button>
        </div>

        {/* Social Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {(socialMedia || []).sort((a, b) => a.order - b.order).map((social) => {
                const Icon = platformIcons[social.platform.toLowerCase()] || Share2;
                const colorClass = platformColors[social.platform.toLowerCase()] || 'bg-slate-600';

                return (
                    <div
                        key={social.id}
                        className="group bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="flex flex-col items-center text-center mb-4">
                            <div className={`w-16 h-16 ${colorClass} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                <Icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-sm font-black text-brand-dark capitalize">
                                {social.platform}
                            </h3>
                            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded mt-2">
                                #{social.order}
                            </span>
                        </div>

                        <div className="text-xs text-slate-500 font-medium mb-4 truncate text-center">
                            {social.url}
                        </div>

                        <div className="flex items-center space-x-2 pt-3 border-t border-slate-50">
                            <button
                                onClick={() => handleEdit('socialMedia', social)}
                                className="flex-1 p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-brand-blue hover:text-white transition-all text-xs font-bold"
                            >
                                <Settings2 className="w-3.5 h-3.5 mx-auto" />
                            </button>
                            <button
                                onClick={() => handleDelete('socialMedia', social.id)}
                                className="flex-1 p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
                            >
                                <Trash className="w-3.5 h-3.5 mx-auto" />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Empty State */}
        {(!socialMedia || socialMedia.length === 0) && (
            <div className="text-center py-20">
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Share2 className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-black text-slate-400 mb-2">Henüz sosyal medya hesabı yok</h3>
                <p className="text-sm text-slate-400 mb-6">İlk platformunuzu ekleyerek başlayın</p>
                <button
                    onClick={() => handleAdd('socialMedia')}
                    className="px-6 py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-dark transition-all inline-flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>İlk Platformu Ekle</span>
                </button>
            </div>
        )}
    </div>
);
