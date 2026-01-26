import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, ChevronRight } from 'lucide-react';
import { pageService, branchService } from '../services/cms.service';
import { homeSectionService } from '../services/homepage.service';
import { Branch, NewsItem } from '../types';
import { API_BASE_URL } from '../services/api';
import { useSEO } from '../hooks/useSEO';

const NewsList: React.FC = () => {
  // SEO Hook
  useSEO('news');
  
  const [news, setNews] = useState<NewsItem[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [pageContent, setPageContent] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');

  const getContent = (section: string, field: 'title' | 'subtitle' | 'buttonText' | 'buttonLink' = 'title', defaultValue: string = '') => {
    const content = pageContent[section];
    return content?.[field] || defaultValue;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch news from BlogPost API
        console.log('🔍 Fetching news from /api/blog-posts...');
        const newsRes = await fetch('/api/blog-posts');
        const newsJson = await newsRes.json();
        console.log('📰 News Response:', newsJson);
        console.log('📰 News count:', newsJson.data?.length || 0);
        
        const newsData = newsJson.data || [];
        console.log('📰 Setting news state with:', newsData.length, 'items');
        setNews(Array.isArray(newsData) ? newsData : []);
        
        // Fetch branches
        const branchesRes = await branchService.getAll();
        setBranches(branchesRes.data.branches);
        
        // Fetch content
        const contentRes = await homeSectionService.getAll();
        
        // Process page content - backend returns { success: true, data: [...] }
        const contentData = contentRes.data?.data || contentRes.data;
        
        if (Array.isArray(contentData)) {
          const sections = contentData.filter((s: any) => s.page === 'news');
          const contentMap: any = {};
          sections.forEach((s: any) => {
            contentMap[s.section] = s;
          });
          setPageContent(contentMap);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === 'all' || item.branchId === selectedBranch;
    return matchesSearch && matchesBranch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-gray pt-32 pb-20">
      <div className="max-w-[1600px] mx-auto px-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="space-y-6">
            <span className="text-brand-blue font-black tracking-[0.4em] text-[12px]">
              {getContent('news-hero-badge', 'title', 'HABERLER VE DUYURULAR')}
            </span>
            <h1 className="text-6xl md:text-7xl font-black text-brand-dark tracking-tighter leading-none italic">
              {getContent('news-hero-title', 'title', 'Hocalara Geldik Dünyasından Haberler').split(' ').slice(0, 2).join(' ')} <br /> 
              <span className="text-brand-blue">{getContent('news-hero-title', 'title', 'Hocalara Geldik Dünyasından Haberler').split(' ').slice(2).join(' ')}</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-2xl">
              {getContent('news-hero-subtitle', 'subtitle', 'Tüm şubelerimizden en güncel başarı hikayeleri, duyurular ve etkinliklerden haberdar olun.')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
              <input
                type="text"
                placeholder={getContent('news-search-placeholder', 'title', 'Haberlerde ara...')}
                className="pl-14 pr-8 py-4 bg-white rounded-2xl border border-slate-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all outline-none font-bold text-sm min-w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="px-8 py-4 bg-white rounded-2xl border border-slate-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all outline-none font-bold text-sm appearance-none cursor-pointer min-w-[200px]"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value="all">{getContent('news-filter-all', 'title', 'Tüm Şubeler')}</option>
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* News Grid */}
        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((item) => {
              const branch = branches.find(b => b.id === item.branchId);
              return (
                <Link
                  key={item.id}
                  to={`/haberler/${item.slug || item.id}`}
                  className="group bg-white rounded-[20px] overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col border border-slate-100"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 flex items-center justify-center">
                    <img
                      src={item.image ? (item.image.startsWith('http') ? item.image : (item.image.startsWith('/assets') ? item.image : `${API_BASE_URL}${item.image}`)) : '/uploads/placeholder.jpg'}
                      alt={item.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-2 bg-brand-blue text-white rounded-xl text-[10px] font-black tracking-widest uppercase shadow-lg">
                        {branch ? branch.name : getContent('news-card-general', 'title', 'Genel Haber')}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center space-x-2 text-[11px] font-black text-slate-400 mb-4 uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('tr-TR') : getContent('news-card-today', 'title', 'Bugün')}</span>
                    </div>

                    <h3 className="text-xl font-black text-brand-dark mb-4 group-hover:text-brand-blue transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-sm font-medium text-slate-500 line-clamp-3 mb-8 leading-relaxed">
                      {item.excerpt || item.content.substring(0, 150) + '...'}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100">
                      <span className="text-[11px] font-black text-brand-blue uppercase tracking-widest group-hover:translate-x-2 transition-transform inline-flex items-center space-x-2">
                        <span>{getContent('news-card-read-more', 'title', 'DETAYLI OKU')}</span>
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-40 bg-white rounded-[40px] shadow-xl border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-brand-dark mb-2">
              {getContent('news-empty-title', 'title', 'Haber Bulunamadı')}
            </h3>
            <p className="text-slate-500 font-medium">
              {getContent('news-empty-subtitle', 'subtitle', 'Arama kriterlerinize uygun haber bulunmamaktadır.')}
            </p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedBranch('all'); }}
              className="mt-8 px-10 py-4 bg-brand-blue text-white font-black rounded-2xl hover:shadow-xl transition-all"
            >
              {getContent('news-empty-button', 'buttonText', 'Filtreleri Temizle')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsList;
