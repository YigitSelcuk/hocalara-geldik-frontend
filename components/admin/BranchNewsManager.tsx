import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Newspaper, Plus, Edit2, Trash2, Clock, X, Save, Upload, Image as ImageIcon } from 'lucide-react';
import api, { API_BASE_URL } from '../../services/api';
import { mediaService } from '../../services/cms.service';
import Alert from '../Alert';
import { useAlert } from '../../hooks/useAlert';

interface BranchNewsManagerProps {
  branchId: string;
}

const BranchNewsManager: React.FC<BranchNewsManagerProps> = ({ branchId }) => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { alert, showAlert, hideAlert } = useAlert();

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    categoryId: '',
    status: 'PUBLISHED',
    isFeatured: false,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  });

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  useEffect(() => {
    fetchNews();
  }, [branchId]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await api.get('/blog-posts');
      console.log('📰 Frontend - Blog posts response:', response.data);
      const newsData = response.data.data || [];
      console.log('📰 Frontend - News data:', newsData);
      console.log('📰 Frontend - First item:', newsData[0]);
      setNews(newsData);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const response = await mediaService.upload(file);

      console.log('Upload response:', response.data);
      const imageUrl = response.data.url || response.data.data?.url || response.data.path;
      console.log('Image URL:', imageUrl);

      if (imageUrl) {
        setForm(prev => ({ ...prev, featuredImage: imageUrl }));
      } else {
        showAlert('error', 'Resim URL\'si alınamadı');
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      if (error.response?.status === 413) {
        showAlert('error', 'Dosya boyutu çok büyük (Maksimum 5MB)');
      } else {
        showAlert('error', error.response?.data?.message || error.message || 'Resim yüklenemedi');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = () => {
    setEditingNews(null);
    setForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featuredImage: '',
      categoryId: '',
      status: 'PUBLISHED',
      isFeatured: false,
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (newsItem: any) => {
    setEditingNews(newsItem);
    setForm({
      title: newsItem.title || '',
      slug: newsItem.slug || '',
      excerpt: newsItem.excerpt || '',
      content: newsItem.content || '',
      featuredImage: newsItem.image || '',
      categoryId: newsItem.category || '',
      status: 'PUBLISHED',
      isFeatured: newsItem.isFeatured ?? false,
      seoTitle: newsItem.seoTitle || '',
      seoDescription: newsItem.seoDescription || '',
      seoKeywords: newsItem.seoKeywords || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/blog-posts/${id}`);
      showAlert('success', 'Haber silme talebi oluşturuldu!');
      setDeleteConfirm(null);
      fetchNews();
    } catch (error: any) {
      if (error.response?.data?.error === 'DUPLICATE_REQUEST') {
        showAlert('warning', 'Bu haber için zaten bekleyen bir silme talebi var.');
      } else {
        showAlert('error', 'Silme işlemi başarısız oldu.');
      }
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.excerpt) {
      showAlert('warning', 'Lütfen başlık ve özet girin');
      return;
    }

    try {
      setSaving(true);

      const data = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        content: form.content,
        image: form.featuredImage,
        category: form.categoryId || 'Genel',
        author: '',
        date: new Date().toISOString().split('T')[0],
        readTime: '5 dk',
        isActive: true,
        isFeatured: form.isFeatured,
        seoTitle: form.seoTitle,
        seoDescription: form.seoDescription,
        seoKeywords: form.seoKeywords,
      };

      console.log('📰 Saving blog post:', data);

      if (editingNews) {
        const response = await api.put(`/blog-posts/${editingNews.id}`, { ...data, branchId });
        console.log('✅ Update response:', response.data);
        showAlert('success', 'Haber güncelleme talebi oluşturuldu!');
      } else {
        const response = await api.post('/blog-posts', { ...data, branchId });
        console.log('✅ Create response:', response.data);
        showAlert('success', 'Haber ekleme talebi oluşturuldu!');
      }

      setIsModalOpen(false);
      fetchNews();
    } catch (error: any) {
      console.error('❌ Save error:', error);
      if (error.response?.data?.error === 'DUPLICATE_REQUEST') {
        showAlert('warning', 'Bu haber için zaten bekleyen bir güncelleme talebi var.');
      } else if (error.response?.data?.error === 'SLUG_EXISTS') {
        showAlert('error', 'Bu slug zaten kullanılıyor. Lütfen farklı bir slug seçin.');
      } else {
        showAlert('error', 'Kaydetme işlemi başarısız oldu.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Yükleniyor...</div>;
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={hideAlert}
        />
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-8 py-6 flex items-center justify-between z-10">
              <h3 className="text-2xl font-black text-brand-dark">
                {editingNews ? 'Haber Düzenle' : 'Yeni Haber Ekle'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Haber Başlığı *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
                  placeholder="Örn: 2024 YKS Sonuçları Açıklandı"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">URL Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={e => setForm({ ...form, slug: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
                  placeholder="Otomatik oluşturulacak"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Özet (Excerpt) *</label>
                <textarea
                  rows={2}
                  value={form.excerpt}
                  onChange={e => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
                  placeholder="Kısa özet (liste görünümünde gösterilir)"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Haber İçeriği *</label>
                <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={form.content}
                    onChange={(content) => setForm({ ...form, content })}
                    modules={modules}
                    formats={formats}
                    className="h-64 mb-12"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Kapak Görseli *</label>
                <div className="flex gap-4 items-end">
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                      <div className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 hover:text-brand-blue transition-colors flex items-center justify-between">
                        <span>{uploading ? 'Yükleniyor...' : 'Görsel Seç'}</span>
                        <Upload className="w-4 h-4" />
                      </div>
                    </label>
                  {form.featuredImage && (
                    <div className="relative">
                        <img
                            src={form.featuredImage.startsWith('http') ? form.featuredImage : (form.featuredImage.startsWith('/assets') ? form.featuredImage : `${API_BASE_URL}${form.featuredImage}`)}
                            alt="Preview"
                            className="w-24 h-16 object-cover border border-slate-200 rounded-lg"
                        />
                         <button
                            onClick={() => setForm({ ...form, featuredImage: '' })}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md"
                          >
                            <X className="w-3 h-3" />
                          </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFeatured || false}
                    onChange={e => setForm({ ...form, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                  />
                  <span className="text-xs font-bold text-slate-600">Öne Çıkan Haber</span>
                </label>
              </div>

              {/* SEO Section */}
              <div className="border-t border-slate-200 pt-4 mt-4">
                <h3 className="text-xs font-black text-slate-600 mb-3">SEO Ayarları</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">SEO Başlık</label>
                    <input
                      type="text"
                      value={form.seoTitle}
                      onChange={e => setForm({ ...form, seoTitle: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
                      placeholder="Arama motorları için başlık"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">SEO Açıklama</label>
                    <textarea
                      rows={2}
                      value={form.seoDescription}
                      onChange={e => setForm({ ...form, seoDescription: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
                      placeholder="Arama motorları için açıklama"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">SEO Anahtar Kelimeler</label>
                    <input
                      type="text"
                      value={form.seoKeywords}
                      onChange={e => setForm({ ...form, seoKeywords: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
                      placeholder="Virgülle ayırın (kelime1,kelime2)"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-50 flex items-center justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-4 text-slate-400 font-black text-sm capitalize tracking-widest hover:text-brand-dark transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-4 bg-brand-blue text-white font-black text-sm capitalize tracking-widest rounded-xl hover:bg-brand-dark disabled:opacity-50 transition-colors"
              >
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-brand-dark">Haberler</h2>
        <button
          onClick={handleAdd}
          className="px-6 py-3 bg-brand-blue text-white font-black rounded-xl hover:bg-brand-dark flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Haber Ekle</span>
        </button>
      </div>

      {/* News List */}
      {news.length === 0 ? (
        <div className="text-center py-12">
          <Newspaper className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Henüz haber eklenmemiş</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map(newsItem => (
            <div key={newsItem.id} className="bg-slate-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all group relative">
              {/* Pending Badge */}
              {newsItem.isPending && (
                <div className="absolute top-3 right-3 z-10">
                  <span className={`px-3 py-1 rounded-full text-xs font-black flex items-center space-x-1 ${newsItem.pendingType === 'CREATE'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    <Clock className="w-3 h-3" />
                    <span>
                      {newsItem.pendingType === 'CREATE' ? 'Ekleme Bekliyor' : 'Güncelleme Bekliyor'}
                    </span>
                  </span>
                </div>
              )}

              {/* News Image */}
              {newsItem.image ? (
                <div className="w-full h-48 bg-slate-100 flex items-center justify-center">
                  <img
                    src={newsItem.image.startsWith('http') ? newsItem.image : (newsItem.image.startsWith('/assets') ? newsItem.image : `${API_BASE_URL}${newsItem.image}`)}
                    alt={newsItem.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-brand-blue to-brand-dark flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-white/30" />
                </div>
              )}

              <div className="p-6">
                <div className="mb-4">
                  <span className="text-xs font-black text-brand-blue uppercase">{newsItem.category}</span>
                  <h3 className="text-lg font-black text-brand-dark mt-1">{newsItem.title}</h3>
                  <p className="text-sm text-slate-600 mt-2">{newsItem.excerpt}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  {newsItem.author && <span>✍️ {newsItem.author}</span>}
                  {newsItem.readTime && <span>⏱️ {newsItem.readTime}</span>}
                </div>

                {/* Action buttons */}
                {!newsItem.isPending && (
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(newsItem)}
                      className="flex-1 p-2 bg-brand-blue text-white rounded-lg hover:bg-brand-dark"
                    >
                      <Edit2 className="w-4 h-4 mx-auto" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(newsItem.id)}
                      className="flex-1 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                )}

                {newsItem.isPending && (
                  <div className="text-center">
                    <p className="text-xs text-slate-500 italic">Admin onayı bekleniyor</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-100 mx-auto mb-4 flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-black text-brand-dark mb-2">Haberi Sil</h3>
              <p className="text-slate-600">
                Bu haberi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 font-black rounded-xl hover:bg-slate-200 transition-all"
              >
                İptal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-6 py-3 bg-red-500 text-white font-black rounded-xl hover:bg-red-600 transition-all"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchNewsManager;
