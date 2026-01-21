
import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, ChevronLeft, Share2, Facebook, Twitter, Link as LinkIcon, User } from 'lucide-react';
import { pageService, branchService } from '../services/cms.service';
import { Branch, NewsItem } from '../types';

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [newsRes, branchesRes] = await Promise.all([
          pageService.getById(id),
          branchService.getAll()
        ]);
        setNews(newsRes.data.page);
        setBranches(branchesRes.data.branches);
      } catch (error) {
        console.error('Error fetching news detail data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  if (!news) {
    return <Navigate to="/haberler" replace />;
  }

  const branch = branches.find(b => b.id === news.branchId);

  return (
    <div className="mesh-bg min-h-screen pb-24">
      {/* Article Header */}
      <div className="max-w-5xl mx-auto px-6 pt-12">
        <Link to="/haberler" className="inline-flex items-center space-x-2 text-slate-500 hover:text-brand-red font-black text-xs capitalize tracking-widest mb-12 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <span>Haberlere Dön</span>
        </Link>

        <div className="space-y-8 mb-12">
          <div className="flex flex-wrap items-center gap-4">
            <span className="bg-brand-red/10 text-brand-red px-4 py-1.5 rounded-custom text-xs font-black capitalize tracking-widest">
              {news.isMain ? 'Kurumsal Duyuru' : 'Şube Duyurusu'}
            </span>
            {branch && (
              <Link to={`/subeler/${branch.slug}`} className="bg-brand-dark text-white px-4 py-1.5 rounded-custom text-xs font-black capitalize tracking-widest hover:bg-brand-red transition-all">
                {branch.name}
              </Link>
            )}
            <div className="flex items-center space-x-2 text-slate-400 font-bold text-sm">
              <Calendar className="w-4 h-4" />
              <span>{news.publishedAt ? new Date(news.publishedAt).toLocaleDateString('tr-TR') : ''}</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-brand-dark leading-tight tracking-tighter">
            {news.title}
          </h1>

          <div className="flex items-center justify-between pt-8 border-t border-slate-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="text-brand-dark font-black text-sm">Hocalara Geldik Editör</p>
                <p className="text-slate-400 text-xs font-bold capitalize tracking-widest">Medya Birimi</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-3 bg-slate-50 text-slate-400 rounded-custom hover:bg-brand-red hover:text-white transition-all"><Facebook className="w-5 h-5" /></button>
              <button className="p-3 bg-slate-50 text-slate-400 rounded-custom hover:bg-brand-red hover:text-white transition-all"><Twitter className="w-5 h-5" /></button>
              <button className="p-3 bg-slate-50 text-slate-400 rounded-custom hover:bg-brand-red hover:text-white transition-all"><LinkIcon className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="aspect-video w-full rounded-custom overflow-hidden shadow-2xl">
          <img src={news.featuredImage || news.image} className="w-full h-full object-cover" alt={news.title} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="prose prose-lg max-w-none prose-slate">
          <p className="text-xl text-slate-600 font-medium leading-relaxed mb-8">
            {news.content}
          </p>
          <p className="text-lg text-slate-500 leading-relaxed">
            Kurumumuzun vizyonu doğrultusunda öğrencilerimizin her türlü akademik ihtiyacını karşılamak ve onlara sınav yolculuğunda rehberlik etmek temel önceliğimizdir. Bu haberde yer alan gelişmeler de bu hedefe giden yolda atılan önemli bir adımdır.
          </p>
          <div className="my-12 p-8 bg-slate-50 border-l-4 border-brand-red rounded-custom">
            <p className="italic text-lg text-brand-dark font-bold leading-relaxed">
              "Eğitimde fırsat eşitliği ve kaliteyi herkes için ulaşılabilir kılmak adına var gücümüzle çalışmaya devam ediyoruz."
            </p>
          </div>
        </div>

        {/* Navigation / Footer */}
        <div className="mt-20 pt-12 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-slate-400 font-black text-xs capitalize tracking-widest">Paylaş:</span>
            <Share2 className="w-5 h-5 text-slate-300" />
          </div>
          <Link to="/haberler" className="text-brand-red font-black text-sm capitalize tracking-widest hover:underline">
            Tüm Haberleri Gör
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
