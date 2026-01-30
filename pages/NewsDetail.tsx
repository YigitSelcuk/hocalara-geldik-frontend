
import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, ChevronLeft, Share2, Facebook, Twitter, Link as LinkIcon, User, Clock, Tag, MapPin } from 'lucide-react';
import { pageService, branchService } from '../services/cms.service';
import { Branch, NewsItem } from '../types';
import { API_BASE_URL } from '../services/api';

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [newsRes, branchesRes, allNewsRes] = await Promise.all([
          fetch(`/api/blog-posts/${id}`).then(r => r.json()),
          branchService.getAll(),
          fetch('/api/blog-posts').then(r => r.json())
        ]);
        
        const currentNews = newsRes.data;
        setNews(currentNews);
        setBranches(branchesRes.data.branches);
        
        // Get related news (same branch or category, exclude current)
        const allNews = allNewsRes.data || [];
        const related = allNews
          .filter((n: NewsItem) => 
            n.id !== currentNews.id && 
            (n.branchId === currentNews.branchId || n.category === currentNews.category)
          )
          .slice(0, 3);
        setRelatedNews(related);
      } catch (error) {
        console.error('Error fetching news detail data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = news?.title || '';
    
    const shareUrls: { [key: string]: string } = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert('Link kopyalandı!');
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-gray">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-blue border-t-transparent"></div>
      </div>
    );
  }

  if (!news) {
    return <Navigate to="/haberler" replace />;
  }

  const branch = branches.find(b => b.id === news.branchId);
  const readTime = news.readTime || '5 dk';
  const publishDate = news.publishedAt ? new Date(news.publishedAt).toLocaleDateString('tr-TR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }) : '';

  return (
    <div className="min-h-screen bg-brand-gray pt-32 pb-20">
      {/* Back Button */}
      <div className="max-w-[1400px] mx-auto px-12 mb-8">
        <Link 
          to="/haberler" 
          className="inline-flex items-center space-x-2 text-slate-500 hover:text-brand-blue font-bold text-sm transition-all group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Tüm Haberlere Dön</span>
        </Link>
      </div>

      {/* Main Content Container */}
      <div className="max-w-[1400px] mx-auto px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Article */}
          <article className="lg:col-span-2">
            <div className="bg-white rounded-[30px] shadow-xl overflow-hidden">
              
              {/* Featured Image */}
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-100 flex items-center justify-center">
                <img 
                  src={news.image ? (news.image.startsWith('http') ? news.image : (news.image.startsWith('/assets') ? news.image : `${API_BASE_URL}${news.image}`)) : '/uploads/placeholder.jpg'} 
                  alt={news.title}
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Category Badge */}
                <div className="absolute top-6 left-6">
                  <span className="inline-flex items-center space-x-2 px-5 py-2.5 bg-brand-blue text-white rounded-2xl text-xs font-black tracking-widest uppercase shadow-2xl">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{news.category || 'Genel'}</span>
                  </span>
                </div>

                {/* Branch Badge */}
                {branch && (
                  <div className="absolute top-6 right-6">
                    <Link 
                      to={`/subeler/${branch.slug}`}
                      className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white/95 backdrop-blur-sm text-brand-dark rounded-2xl text-xs font-black tracking-widest uppercase shadow-2xl hover:bg-brand-blue hover:text-white transition-all"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{branch.name}</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Article Content */}
              <div className="p-12">
                
                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-slate-100">
                  <div className="flex items-center space-x-2 text-slate-500">
                    <Calendar className="w-4 h-4 text-brand-blue" />
                    <span className="text-sm font-bold">{publishDate}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-500">
                    <Clock className="w-4 h-4 text-brand-blue" />
                    <span className="text-sm font-bold">{readTime} okuma</span>
                  </div>
                  {news.author && (
                    <div className="flex items-center space-x-2 text-slate-500">
                      <User className="w-4 h-4 text-brand-blue" />
                      <span className="text-sm font-bold">{news.author}</span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-black text-brand-dark leading-tight tracking-tight mb-8">
                  {news.title}
                </h1>

                {/* Excerpt */}
                {news.excerpt && (
                  <div className="mb-10 pl-6 border-l-4 border-brand-blue">
                    <p className="text-xl text-slate-600 font-medium leading-relaxed">
                      {news.excerpt}
                    </p>
                  </div>
                )}

                {/* Content */}
                <div 
                  className="prose prose-lg max-w-none
                    prose-headings:font-bold prose-headings:text-brand-dark prose-headings:mb-4 prose-headings:mt-8
                    prose-h2:text-2xl prose-h3:text-xl
                    prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-5 prose-p:text-base
                    prose-a:text-brand-blue prose-a:underline hover:prose-a:no-underline
                    prose-strong:text-brand-dark prose-strong:font-bold
                    prose-ul:my-4 prose-ol:my-4 prose-ul:list-disc prose-ol:list-decimal prose-ul:pl-5 prose-ol:pl-5
                    prose-li:text-slate-700 prose-li:leading-relaxed prose-li:marker:text-brand-blue
                    prose-blockquote:border-l-4 prose-blockquote:border-slate-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-600
                    prose-img:rounded-xl prose-img:my-8"
                  dangerouslySetInnerHTML={{ __html: news.content }}
                />

                {/* Share Section */}
                <div className="mt-16 pt-10 border-t border-slate-100">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div>
                      <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Bu haberi paylaş</p>
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => handleShare('facebook')}
                          className="p-3.5 bg-[#1877F2] text-white rounded-2xl hover:shadow-xl hover:scale-110 transition-all"
                          aria-label="Facebook'ta paylaş"
                        >
                          <Facebook className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleShare('twitter')}
                          className="p-3.5 bg-[#1DA1F2] text-white rounded-2xl hover:shadow-xl hover:scale-110 transition-all"
                          aria-label="Twitter'da paylaş"
                        >
                          <Twitter className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleShare('copy')}
                          className="p-3.5 bg-slate-100 text-slate-600 rounded-2xl hover:bg-brand-blue hover:text-white hover:shadow-xl hover:scale-110 transition-all"
                          aria-label="Linki kopyala"
                        >
                          <LinkIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    <Link 
                      to="/haberler"
                      className="inline-flex items-center space-x-2 px-8 py-4 bg-brand-dark text-white rounded-2xl text-sm font-black tracking-wide hover:bg-brand-blue hover:shadow-xl transition-all"
                    >
                      <span>Tüm Haberleri Gör</span>
                      <ChevronLeft className="w-4 h-4 rotate-180" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-8">
            
            {/* Related News */}
            {relatedNews.length > 0 && (
              <div className="bg-white rounded-[30px] shadow-xl p-8">
                <h3 className="text-2xl font-black text-brand-dark mb-6 tracking-tight">İlgili Haberler</h3>
                <div className="space-y-6">
                  {relatedNews.map((item) => {
                    const relatedBranch = branches.find(b => b.id === item.branchId);
                    return (
                      <Link
                        key={item.id}
                        to={`/haberler/${item.slug || item.id}`}
                        className="group block"
                      >
                        <div className="flex gap-4">
                          <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 flex items-center justify-center">
                            <img 
                              src={item.image ? (item.image.startsWith('http') ? item.image : (item.image.startsWith('/assets') ? item.image : `${API_BASE_URL}${item.image}`)) : '/uploads/placeholder.jpg'} 
                              alt={item.title}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-black text-brand-dark group-hover:text-brand-blue transition-colors line-clamp-2 mb-2">
                              {item.title}
                            </h4>
                            <div className="flex items-center space-x-2 text-xs text-slate-400 font-bold">
                              <Calendar className="w-3 h-3" />
                              <span>{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('tr-TR') : ''}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CTA Box */}
            <div className="bg-gradient-to-br from-brand-blue to-brand-dark rounded-[30px] shadow-xl p-8 text-white">
              <h3 className="text-2xl font-black mb-4 tracking-tight">Başarı Hikayeniz Bizimle Başlasın</h3>
              <p className="text-white/80 font-medium mb-6 leading-relaxed">
                Size en yakın şubemizi keşfedin ve ücretsiz deneme dersine katılın.
              </p>
              <Link 
                to="/subeler"
                className="inline-flex items-center justify-center w-full px-6 py-4 bg-white text-brand-dark rounded-2xl text-sm font-black tracking-wide hover:shadow-2xl hover:scale-105 transition-all"
              >
                Şubeleri Keşfet
              </Link>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-[30px] shadow-xl p-8">
              <h3 className="text-xl font-black text-brand-dark mb-6 tracking-tight">Hızlı Erişim</h3>
              <div className="space-y-3">
                <Link to="/paketler" className="block px-5 py-3 bg-brand-gray rounded-2xl text-sm font-bold text-brand-dark hover:bg-brand-blue hover:text-white transition-all">
                  Eğitim Paketleri
                </Link>
                <Link to="/basarilarimiz" className="block px-5 py-3 bg-brand-gray rounded-2xl text-sm font-bold text-brand-dark hover:bg-brand-blue hover:text-white transition-all">
                  Başarı Hikayeleri
                </Link>
                <Link to="/videolar" className="block px-5 py-3 bg-brand-gray rounded-2xl text-sm font-bold text-brand-dark hover:bg-brand-blue hover:text-white transition-all">
                  Video Galeri
                </Link>
                <Link to="/iletisim" className="block px-5 py-3 bg-brand-gray rounded-2xl text-sm font-bold text-brand-dark hover:bg-brand-blue hover:text-white transition-all">
                  İletişim
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
