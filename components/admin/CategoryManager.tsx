import React from 'react';
import { Plus, Settings2, Trash, Tag } from 'lucide-react';
import { Category } from '../../types';

interface CategoryManagerProps {
    categories: Category[];
    handleAdd: (type: 'category') => void;
    handleEdit: (type: 'category', item: Category) => void;
    handleDelete: (type: 'category', id: string) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
    categories,
    handleAdd,
    handleEdit,
    handleDelete
}) => (
    <div className="space-y-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-black text-brand-dark tracking-tight leading-none">
                    Kategori <span className="text-brand-blue italic">Sistemi</span>
                </h1>
                <p className="text-slate-500 font-medium text-sm mt-1">
                    Video ve haber kategorilerini hiyarerşik olarak yönetin.
                </p>
            </div>
            <button
                onClick={() => handleAdd('category')}
                className="px-6 py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-dark transition-all flex items-center space-x-2 shadow-lg shadow-brand-blue/20"
            >
                <Plus className="w-4 h-4" />
                <span>Yeni Kategori</span>
            </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {(categories || []).map((cat: any) => (
                <div
                    key={cat.id}
                    className="group bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Tag className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-brand-dark">{cat.name}</h3>
                                <span className="text-xs font-medium text-slate-400 capitalize">{cat.type}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-3 border-t border-slate-50">
                        <button
                            onClick={() => handleEdit('category', cat)}
                            className="flex-1 p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-brand-blue hover:text-white transition-all text-xs font-bold"
                        >
                            <Settings2 className="w-3.5 h-3.5 mx-auto" />
                        </button>
                        <button
                            onClick={() => handleDelete('category', cat.id)}
                            className="flex-1 p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
                        >
                            <Trash className="w-3.5 h-3.5 mx-auto" />
                        </button>
                    </div>
                </div>
            ))}
        </div>

        {/* Empty State */}
        {(!categories || categories.length === 0) && (
            <div className="text-center py-20">
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Tag className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-black text-slate-400 mb-2">Henüz kategori yok</h3>
                <p className="text-sm text-slate-400 mb-6">Yeni kategori ekleyerek başlayın</p>
                <button
                    onClick={() => handleAdd('category')}
                    className="px-6 py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-dark transition-all inline-flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>İlk Kategoriyi Ekle</span>
                </button>
            </div>
        )}
    </div>
);
