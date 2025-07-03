
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ArticleDetail {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  category: string;
  isBreaking: boolean;
  readTime: string;
}

export const useArticleDetail = (identifier: string) => {
  return useQuery({
    queryKey: ['article-detail', identifier],
    queryFn: async (): Promise<ArticleDetail> => {
      console.log(`Fetching article detail for identifier: ${identifier}`);
      
      // Check if identifier is numeric (ID) or text (slug)
      const isNumericId = /^\d+$/.test(identifier);
      const body = isNumericId 
        ? { articleId: identifier }
        : { articleSlug: identifier };
      
      const { data, error } = await supabase.functions.invoke('fetch-articles', {
        body
      });
      
      if (error) {
        console.error('Error calling Edge Function for article detail:', error);
        throw new Error('Failed to fetch article detail');
      }
      
      if (!data || !data.article) {
        console.error('Invalid response format for article detail:', data);
        throw new Error('Article not found');
      }
      
      console.log('Successfully fetched article detail');
      return data.article;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
  });
};
