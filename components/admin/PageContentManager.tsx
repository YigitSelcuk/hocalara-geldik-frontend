import { useState, useEffect } from 'react';
import { Save, RefreshCw, FileText, Sparkles } from 'lucide-react';
import { homeSectionService } from '../../services/homepage.service';
import { useAlert } from '../../hooks/useAlert';
import Alert from '../Alert';

interface PageContent {
  id?: string;
  page: string;
  section: string;
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  content?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

interface PageContentManagerProps {
  pageName: string;
  pageTitle: string;
  sections: {
    section: string;
    title: string;
    fields: string[];
    group?: string;
  }[];
}

export const PageContentManager: React.FC<PageContentManagerProps> = ({ pageName, pageTitle, sections }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contents, setContents] = useState<PageContent[]>([]);
  const { alert, showAlert } = useAlert();

  useEffect(() => {
    fetchContents();
  }, [pageName]);

  const fetchContents = async () => {
    try {
      const res = await homeSectionService.getAll();
      console.log('API Response:', res.data); // Debug için
      const data = (res.data as any)?.data || res.data || [];
      console.log('Parsed data:', data); // Debug için
      // Filter by page
      const pageContents = Array.isArray(data) ? data.filter((c: PageContent) => c.page === pageName) : [];
      console.log('Filtered contents for', pageName, ':', pageContents); // Debug için
      setContents(pageContents);
    } catch (error) {
      console.error('Error fetching page contents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (section: string, field: string, value: string) => {
    setContents(prev => {
      const existing = prev.find(c => c.section === section);
      if (existing) {
        return prev.map(c => c.section === section ? { ...c, [field]: value } : c);
      } else {
        return [...prev, { page: pageName, section, [field]: value } as PageContent];
      }
    });
  };

  const getValue = (section: string, field: string): string => {
    const content = contents.find(c => c.section === section);
    return (content?.[field as keyof PageContent] as string) || '';
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const content of contents) {
        const dataToSave = { ...content, page: pageName };
        if (content.id) {
          await homeSectionService.update(content.id, dataToSave);
        } else {
          await homeSectionService.create(dataToSave);
        }
      }
      showAlert('success', 'İçerikler başarıyla kaydedildi!');
      await fetchContents();
    } catch (error) {
      showAlert('error', 'Kaydetme sırasında hata oluştu.');
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
    <div className="space-y-6">
      {/* Alert */}
      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => {}}
        />
      )}
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="w-6 h-6 text-brand-blue" />
          <div>
            <h2 className="text-2xl font-black text-brand-dark capitalize tracking-tight">{pageTitle}</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">Bu sayfadaki tüm metin içeriklerini düzenleyin</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 px-6 py-3 bg-brand-blue text-white rounded-xl font-bold hover:bg-blue-600 transition-all disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Kaydediliyor...' : 'Kaydet'}</span>
        </button>
      </div>

      {/* SEO Section */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200 p-6 shadow-md">
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-black text-brand-dark">SEO Ayarları</h3>
            <p className="text-xs text-slate-600 font-medium">Arama motorları için sayfa optimizasyonu</p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <label className="text-sm font-black text-slate-700 flex items-center space-x-2">
              <span>SEO Başlık</span>
              <span className="text-xs font-normal text-slate-500">(Arama sonuçlarında görünecek başlık)</span>
            </label>
            <input
              type="text"
              value={getValue('seo', 'seoTitle')}
              onChange={(e) => handleChange('seo', 'seoTitle', e.target.value)}
              className="w-full bg-white border-2 border-purple-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 font-medium transition-all"
              placeholder="Örn: Hocalara Geldik - En İyi Eğitim Merkezi"
              maxLength={60}
            />
            <p className="text-xs text-slate-500 font-medium">
              {getValue('seo', 'seoTitle').length}/60 karakter (Önerilen: 50-60)
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-slate-700 flex items-center space-x-2">
              <span>SEO Açıklama</span>
              <span className="text-xs font-normal text-slate-500">(Arama sonuçlarında görünecek açıklama)</span>
            </label>
            <textarea
              value={getValue('seo', 'seoDescription')}
              onChange={(e) => handleChange('seo', 'seoDescription', e.target.value)}
              rows={3}
              className="w-full bg-white border-2 border-purple-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 font-medium resize-none transition-all"
              placeholder="Örn: Türkiye'nin en başarılı eğitim merkezi. YKS, LGS ve tüm sınavlarda başarı garantisi..."
              maxLength={160}
            />
            <p className="text-xs text-slate-500 font-medium">
              {getValue('seo', 'seoDescription').length}/160 karakter (Önerilen: 150-160)
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-slate-700 flex items-center space-x-2">
              <span>SEO Anahtar Kelimeler</span>
              <span className="text-xs font-normal text-slate-500">(Virgülle ayırın)</span>
            </label>
            <input
              type="text"
              value={getValue('seo', 'seoKeywords')}
              onChange={(e) => handleChange('seo', 'seoKeywords', e.target.value)}
              className="w-full bg-white border-2 border-purple-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 font-medium transition-all"
              placeholder="Örn: eğitim merkezi, dershane, YKS, LGS, özel ders"
            />
            <p className="text-xs text-slate-500 font-medium">
              Anahtar kelimeleri virgülle ayırarak yazın
            </p>
          </div>
        </div>
      </div>

      {/* Content Sections - Grouped */}
      <div className="space-y-6">
        {(() => {
          // Group sections by group property
          const grouped = sections.reduce((acc, section) => {
            const group = section.group || 'Diğer';
            if (!acc[group]) acc[group] = [];
            acc[group].push(section);
            return acc;
          }, {} as Record<string, typeof sections>);

          return Object.entries(grouped).map(([groupName, groupSections]) => (
            <div key={groupName} className="space-y-4">
              {/* Group Header */}
              <div className="flex items-center space-x-3 pb-3 border-b-2 border-brand-blue">
                <div className="w-2 h-8 bg-brand-blue rounded-full"></div>
                <h3 className="text-2xl font-black text-brand-dark">{groupName}</h3>
                <span className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                  {groupSections.length} alan
                </span>
              </div>

              {/* Group Sections */}
              <div className="grid gap-4">
                {groupSections.map((section) => (
                  <div key={section.section} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-2 mb-5">
                      <Sparkles className="w-5 h-5 text-brand-blue" />
                      <h4 className="text-lg font-black text-brand-dark">{section.title}</h4>
                      <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full">{section.section}</span>
                    </div>

                    <div className="grid gap-4">
                      {section.fields.includes('title') && (
                        <div className="space-y-2">
                          <label className="text-sm font-black text-slate-700">Başlık</label>
                          <input
                            type="text"
                            value={getValue(section.section, 'title')}
                            onChange={(e) => handleChange(section.section, 'title', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-blue focus:bg-white font-medium transition-all"
                            placeholder="Başlık giriniz..."
                          />
                        </div>
                      )}

                      {section.fields.includes('subtitle') && (
                        <div className="space-y-2">
                          <label className="text-sm font-black text-slate-700">Alt Başlık</label>
                          <input
                            type="text"
                            value={getValue(section.section, 'subtitle')}
                            onChange={(e) => handleChange(section.section, 'subtitle', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-blue focus:bg-white font-medium transition-all"
                            placeholder="Alt başlık giriniz..."
                          />
                        </div>
                      )}

                      {section.fields.includes('description') && (
                        <div className="space-y-2">
                          <label className="text-sm font-black text-slate-700">Açıklama</label>
                          <textarea
                            value={getValue(section.section, 'description')}
                            onChange={(e) => handleChange(section.section, 'description', e.target.value)}
                            rows={3}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-blue focus:bg-white font-medium resize-none transition-all"
                            placeholder="Açıklama giriniz..."
                          />
                        </div>
                      )}

                      {section.fields.includes('content') && (
                        <div className="space-y-2">
                          <label className="text-sm font-black text-slate-700">İçerik</label>
                          <textarea
                            value={getValue(section.section, 'content')}
                            onChange={(e) => handleChange(section.section, 'content', e.target.value)}
                            rows={5}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-blue focus:bg-white font-medium resize-none transition-all"
                            placeholder="İçerik giriniz..."
                          />
                        </div>
                      )}

                      {section.fields.includes('buttonText') && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-black text-slate-700">Buton Metni</label>
                            <input
                              type="text"
                              value={getValue(section.section, 'buttonText')}
                              onChange={(e) => handleChange(section.section, 'buttonText', e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-blue focus:bg-white font-medium transition-all"
                              placeholder="Buton metni..."
                            />
                          </div>
                          {section.fields.includes('buttonLink') && (
                            <div className="space-y-2">
                              <label className="text-sm font-black text-slate-700">Buton Linki</label>
                              <input
                                type="text"
                                value={getValue(section.section, 'buttonLink')}
                                onChange={(e) => handleChange(section.section, 'buttonLink', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-blue focus:bg-white font-medium transition-all"
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
            </div>
          ));
        })()}
      </div>
    </div>
  );
};
