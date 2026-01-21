import React from 'react';
import { Plus, Settings2, Trash, Sparkles } from 'lucide-react';

interface Feature {
    id: string;
    title: string;
    description?: string;
    icon: string;
    section: string;
    features?: string[];
    order: number;
}

interface FeaturesManagerProps {
    features: Feature[];
    handleAdd: (type: 'feature') => void;
    handleEdit: (type: 'feature', item: Feature) => void;
    handleDelete: (type: 'feature', id: string) => void;
}

export const FeaturesManager: React.FC<FeaturesManagerProps> = ({
    features,
    handleAdd,
    handleEdit,
    handleDelete
}) => {
    const sections = ['success-centers', 'digital-platform', 'abroad-education'];
    const [selectedSection, setSelectedSection] = React.useState<string>('all');

    const filteredFeatures = selectedSection === 'all'
        ? features
        : features?.filter(f => f.section === selectedSection);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-brand-dark tracking-tight leading-none">
                        Özellik <span className="text-brand-blue italic">Yönetimi</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-sm mt-1">
                        Ana sayfa bölümlerindeki özellikleri yönetin.
                    </p>
                </div>
                <button
                    onClick={() => handleAdd('feature')}
                    className="px-6 py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-dark transition-all flex items-center space-x-2 shadow-lg shadow-brand-blue/20"
                >
                    <Plus className="w-4 h-4" />
                    <span>Yeni Özellik</span>
                </button>
            </div>

            {/* Section Filter */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setSelectedSection('all')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${selectedSection === 'all'
                        ? 'bg-brand-blue text-white shadow-lg'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                >
                    Tümü
                </button>
                {sections.map(section => (
                    <button
                        key={section}
                        onClick={() => setSelectedSection(section)}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all capitalize ${selectedSection === section
                            ? 'bg-brand-blue text-white shadow-lg'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        {section.replace('-', ' ')}
                    </button>
                ))}
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {(filteredFeatures || []).sort((a, b) => a.order - b.order).map((feature) => (
                    <div
                        key={feature.id}
                        className="group bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-brand-blue to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="text-2xl">{feature.icon}</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-black text-brand-dark line-clamp-1">
                                        {feature.title}
                                    </h3>
                                    <span className="text-xs font-medium text-slate-400 capitalize">
                                        {feature.section.replace('-', ' ')}
                                    </span>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">
                                #{feature.order}
                            </span>
                        </div>

                        {feature.description && (
                            <p className="text-xs text-slate-600 font-medium mb-3 line-clamp-2">
                                {feature.description}
                            </p>
                        )}

                        {feature.features && feature.features.length > 0 && (
                            <div className="mb-3 space-y-1">
                                {feature.features.slice(0, 3).map((item, idx) => (
                                    <div key={idx} className="flex items-center space-x-2 text-xs text-slate-500">
                                        <div className="w-1 h-1 rounded-full bg-brand-blue"></div>
                                        <span className="line-clamp-1">{item}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center space-x-2 pt-3 border-t border-slate-50">
                            <button
                                onClick={() => handleEdit('feature', feature)}
                                className="flex-1 p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-brand-blue hover:text-white transition-all text-xs font-bold"
                            >
                                <Settings2 className="w-3.5 h-3.5 mx-auto" />
                            </button>
                            <button
                                onClick={() => handleDelete('feature', feature.id)}
                                className="flex-1 p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
                            >
                                <Trash className="w-3.5 h-3.5 mx-auto" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {
                (!filteredFeatures || filteredFeatures.length === 0) && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-black text-slate-400 mb-2">Henüz özellik yok</h3>
                        <p className="text-sm text-slate-400 mb-6">İlk özelliğinizi ekleyerek başlayın</p>
                        <button
                            onClick={() => handleAdd('feature')}
                            className="px-6 py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-dark transition-all inline-flex items-center space-x-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>İlk Özelliği Ekle</span>
                        </button>
                    </div>
                )
            }
        </div >
    );
};
