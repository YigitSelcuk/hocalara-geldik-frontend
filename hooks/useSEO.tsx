import { useEffect, useState } from 'react';
import { homeSectionService } from '../services/homepage.service';

interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
}

export const useSEO = (pageName: string) => {
  const [seo, setSeo] = useState<SEOData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSEO = async () => {
      try {
        const res = await homeSectionService.getAll();
        const data = (res.data as any)?.data || res.data || [];
        
        // Find SEO section for this page
        const seoSection = Array.isArray(data) 
          ? data.find((c: any) => c.page === pageName && c.section === 'seo')
          : null;

        if (seoSection) {
          setSeo({
            title: seoSection.seoTitle,
            description: seoSection.seoDescription,
            keywords: seoSection.seoKeywords,
          });
        }
      } catch (error) {
        console.error('Error fetching SEO data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSEO();
  }, [pageName]);

  // Update document meta tags
  useEffect(() => {
    if (!loading && seo.title) {
      document.title = seo.title;
    }
    
    if (!loading && seo.description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', seo.description);
    }

    if (!loading && seo.keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', seo.keywords);
    }
  }, [seo, loading]);

  return { seo, loading };
};
