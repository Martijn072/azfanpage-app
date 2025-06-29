
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  category: string;
  isBreaking: boolean;
  readTime: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ArticlesResponse {
  articles: Article[];
  pagination: PaginationInfo;
}

export const useInfiniteArticles = (perPage = 8, search = '', category = '') => {
  return useInfiniteQuery({
    queryKey: ['infinite-articles', perPage, search, category],
    queryFn: async ({ pageParam = 1 }): Promise<ArticlesResponse> => {
      console.log(`Fetching articles from Edge Function... Page: ${pageParam}, Search: "${search}", Category: "${category}"`);
      
      const { data, error } = await supabase.functions.invoke('fetch-articles', {
        body: { page: pageParam, perPage, search, category }
      });
      
      if (error) {
        console.error('Error calling Edge Function:', error);
        throw new Error('Failed to fetch articles');
      }
      
      if (!data || !data.articles) {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response format');
      }
      
      console.log(`Successfully fetched ${data.articles.length} articles for page ${pageParam}`);
      return {
        articles: data.articles,
        pagination: data.pagination || {
          currentPage: pageParam,
          totalPages: 1,
          totalPosts: data.articles.length,
          hasNextPage: false,
          hasPreviousPage: false
        }
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNextPage 
        ? lastPage.pagination.currentPage + 1 
        : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
