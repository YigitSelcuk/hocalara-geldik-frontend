import { useState, useEffect } from 'react';
import { Save, RefreshCw, Home, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { homeSectionService } from '../../services/homepage.service';

interface HomeContent {
  id?: string;
  page: string;
  section: string;
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  order?: number;
}

interface SectionGroup {
  name: string;
  label: string;
  sections: {
    section: string;
    label: string;
    fields: string[];
  }[];
}

export const HomeSectionManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contents, setContents] = useState<HomeContent[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['hero']);

  const sectionGroups: SectionGroup[] = [
    {
      name: 'hero',
      label: '🎯 Hero / Ana Banner',
      sections: [
        { section: 'hero-subtitle', label: 'Alt Başlık', fields: ['subtitle'] },
        { section: 'hero-button-primary', label: 'Ana Buton', fields: ['buttonText', 'buttonLink'] },
        { section: 'hero-button-secondary', label: 'İkinci Buton', fields: ['buttonText', 'buttonLink'] },
      ]
    },
    {
      name: 'banner-cards',
      label: '🎴 Banner Kartları',
      sections: [
        { section: 'banner-card-1', label: 'Kart 1 - Franchise', fields: ['title', 'description'] },
        { section: 'banner-card-2', label: 'Kart 2 - Kayıt', fields: ['title', 'description'] },
        { section: 'banner-card-3', label: 'Kart 3 - Başarı Merkezleri', fields: ['title', 'description'] },
        { section: 'banner-card-4', label: 'Kart 4 - Dijital Platform', fields: ['title', 'description'] },
        { section: 'banner-card-5', label: 'Kart 5 - YouTube', fields: ['title', 'subtitle', 'description'] },
      ]
    },
    {
      name: 'centers',
      label: '🏫 Başarı Merkezleri',
      sections: [
        { section: 'centers-top-title', label: 'Üst Başlık', fields: ['title'] },
        { section: 'centers-title', label: 'Ana Başlık', fields: ['title'] },
        { section: 'centers-subtitle', label: 'Alt Başlık', fields: ['subtitle'] },
        { section: 'centers-button', label: 'Buton', fields: ['buttonText', 'buttonLink'] },
        { section: 'centers-feature-1', label: 'Özellik 1', fields: ['title'] },
        { section: 'centers-feature-2', label: 'Özellik 2', fields: ['title'] },
        { section: 'centers-feature-3', label: 'Özellik 3', fields: ['title'] },
        { section: 'centers-feature-4', label: 'Özellik 4', fields: ['title'] },
        { section: 'centers-feature-5', label: 'Özellik 5', fields: ['title'] },
      ]
    },
    {
      name: 'digital',
      label: '💻 Dijital Platform',
      sections: [
        { section: 'digital-top-title', label: 'Üst Başlık', fields: ['title'] },
        { section: 'digital-title', label: 'Ana Başlık', fields: ['title'] },
        { section: 'digital-subtitle', label: 'Alt Başlık', fields: ['subtitle'] },
      ]
    },
    {
      name: 'global',
      label: '🌍 Yurt Dışı Eğitim',
      sections: [
        { section: 'global-title', label: 'Ana Başlık', fields: ['title'] },
        { section: 'global-subtitle', label: 'Alt Başlık', fields: ['subtitle'] },
      ]
    },
    {
      name: 'youtube',
      label: '📺 YouTube & Sosyal Medya',
      sections: [
        { section: 'youtube-top-title', label: 'Üst Başlık', fields: ['title'] },
        { section: 'youtube-title', label: 'Ana Başlık', fields: ['title'] },
        { section: 'youtube-subtitle', label: 'Alt Başlık', fields: ['subtitle'] },
        { section: 'youtube-social-title', label: 'Sosyal Medya Başlık', fields: ['title'] },
        { section: 'youtube-social-subtitle', label: 'Sosyal Medya Alt Başlık', fields: ['subtitle'] },
      ]
    },
    {
      name: 'blog',
      label: '📝 Blog & Rehberlik',
      sections: [
        { section: 'blog-top-title', label: 'Üst Başlık', fields: ['title'] },
        { section: 'blog-title', label: 'Ana Başlık', fields: ['title'] },
        { section: 'blog-subtitle', label: 'Alt Başlık', fields: ['subtitle'] },
      ]
    },
    {
      name: 'calculator',
      label: '🧮 Puan Hesaplama',
      sections: [
        { section: 'calculator-badge', label: 'Badge', fields: ['title'] },
        { section: 'calculator-title', label: 'Ana Başlık', fields: ['title'] },
        { section: 'calculator-subtitle', label: 'Alt Başlık', fields: ['subtitle'] },
        { section: 'calculator-button', label: 'Buton', fields: ['buttonText', 'buttonLink'] },
      ]
    },
    {
      name: 'tools',
      label: '⏱️ Çalışma Araçları',
      sections: [
        { section: 'tools-top-title', label: 'Üst Başlık', fields: ['title'] },
        { section: 'tools-title', label: 'Ana Başlık', fields: ['title'] },
        { section: 'tools-subtitle', label: 'Alt Başlık', fields: ['subtitle'] },
        { section: 'tools-countdown-title', label: 'Geri Sayım Başlık', fields: ['title'] },
        { section: 'tools-pomodoro-title', label: 'Pomodoro Başlık', fields: ['title'] },
      ]
    },
    {
      name: 'packages',
      label: '📦 Eğitim Paketleri',
      sections: [
        { section: 'packages-top-title', label: 'Üst Başlık', fields: ['title'] },
        { section: 'packages-title', label: 'Ana Başlık', fields: ['title'] },
        { section: 'packages-subtitle', label: 'Alt Başlık', fields: ['subtitle'] },
        { section: 'packages-button', label: 'Buton', fields: ['buttonText', 'buttonLink'] },
      ]
    },
    {
      name: 'cta',
      label: '🎯 CTA (Call to Action)',
      sections: [
        { section: 'cta-badge', label: 'Badge', fields: ['title'] },
        { section: 'cta-question', label: 'Soru', fields: ['title'] },
        { section: 'cta-main-title', label: 'Ana Başlık', fields: ['title'] },
        { section: 'cta-description', label: 'Açıklama', fields: ['description'] },
        { section: 'cta-button-primary', label: 'Ana Buton', fields: ['buttonText', 'buttonLink'] },
        { section: 'cta-button-secondary', label: 'İkinci Buton', fields: ['buttonText', 'buttonLink'] },
        { section: 'cta-testimonial', label: 'Testimonial', fields: ['description'] },
      ]
    },
  ];

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const res = await homeSectionService.getAll();
      const data = (res.data as any)?.data || (res.data as any)?.homeSections || [];
      setContents(data);
    } catch (error) {
      console.error('Error fetching home contents:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupName)
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  const handleChange = (section: string, field: string, value: string) => {
    setContents(prev => {
      const existing = prev.find(c => c.section === section);
      if (existing) {
        return prev.map(c => c.section === section ? { ...c, [field]: value } : c);
      } else {
        return [...prev, { page: 'home', section, [field]: value } as HomeContent];
      }
    });
  };

  const getValue = (section: string, field: string): string => {
    const content = contents.find(c => c.section === section);
    return (content?.[field as keyof HomeContent] as string) || '';
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const content of contents) {
        if (content.id) {
          await homeSectionService.update(content.id, content);
        } else {
          await homeSectionService.create(content);
        }
      }
      alert('İçerikler başarıyla kaydedildi!');
      await fetchContents();
    } catch (error) {
      alert('Kaydetme sırasında hata oluştu.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="w-8 h-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-brand-blue to-blue-400 rounded-2xl shadow-xl">
            <Home className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-brand-dark capitalize tracking-tight">Anasayfa İçerik Yönetimi</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Anasayfadaki tüm metin içeriklerini buradan düzenleyin</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 px-6 py-3 bg-brand-blue text-white rounded-xl font-bold hover:bg-blue-600 transition-all disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span>{saving ? 'Kaydediliyor...' : 'Tümünü Kaydet'}</span>
        </button>
      </div>

      {/* Content Sections */}
      <div className="grid gap-4">
        {sectionGroups.map((group) => {
          const isExpanded = expandedGroups.includes(group.name);
          
          return (
            <div key={group.name} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.name)}
                className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-black text-brand-dark">{group.label}</h2>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-lg">
                    {group.sections.length} bölüm
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {/* Group Content */}
              {isExpanded && (
                <div className="border-t border-slate-100 p-6 space-y-6 bg-slate-50/50">
                  {group.sections.map((sectionConfig) => (
                    <div key={sectionConfig.section} className="bg-white rounded-xl p-5 border border-slate-100">
                      <div className="flex items-center space-x-2 mb-4">
                        <Sparkles className="w-4 h-4 text-brand-blue" />
                        <h3 className="text-sm font-black text-brand-dark">{sectionConfig.label}</h3>
                        <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                          {sectionConfig.section}
                        </span>
                      </div>

                      <div className="grid gap-3">
                        {sectionConfig.fields.includes('title') && (
                          <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Başlık</label>
                            <input
                              type="text"
                              value={getValue(sectionConfig.section, 'title')}
                              onChange={(e) => handleChange(sectionConfig.section, 'title', e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-blue font-medium"
                              placeholder="Başlık giriniz..."
                            />
                          </div>
                        )}

                        {sectionConfig.fields.includes('subtitle') && (
                          <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Alt Başlık</label>
                            <input
                              type="text"
                              value={getValue(sectionConfig.section, 'subtitle')}
                              onChange={(e) => handleChange(sectionConfig.section, 'subtitle', e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-blue font-medium"
                              placeholder="Alt başlık giriniz..."
                            />
                          </div>
                        )}

                        {sectionConfig.fields.includes('description') && (
                          <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Açıklama</label>
                            <textarea
                              value={getValue(sectionConfig.section, 'description')}
                              onChange={(e) => handleChange(sectionConfig.section, 'description', e.target.value)}
                              rows={3}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-blue font-medium resize-none"
                              placeholder="Açıklama giriniz..."
                            />
                          </div>
                        )}

                        {sectionConfig.fields.includes('buttonText') && (
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Buton Metni</label>
                              <input
                                type="text"
                                value={getValue(sectionConfig.section, 'buttonText')}
                                onChange={(e) => handleChange(sectionConfig.section, 'buttonText', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-blue font-medium"
                                placeholder="Buton metni..."
                              />
                            </div>
                            {sectionConfig.fields.includes('buttonLink') && (
                              <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Buton Linki</label>
                                <input
                                  type="text"
                                  value={getValue(sectionConfig.section, 'buttonLink')}
                                  onChange={(e) => handleChange(sectionConfig.section, 'buttonLink', e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-blue font-medium"
                                  placeholder="/link"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
