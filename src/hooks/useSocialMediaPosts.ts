
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SocialMediaPost {
  id: string;
  platform: 'instagram' | 'twitter';
  username: string;
  profile_photo?: string;
  content: string;
  image_url?: string;
  post_url: string;
  published_at: string;
  cached_at: string;
}

interface SocialMediaResponse {
  success: boolean;
  posts: SocialMediaPost[];
  cached_at: string;
}

export const useSocialMediaPosts = () => {
  return useQuery({
    queryKey: ['social-media-posts'],
    queryFn: async (): Promise<SocialMediaPost[]> => {
      console.log('🔄 Fetching social media posts...');
      
      const { data, error } = await supabase.functions.invoke('social-media-rss');
      
      if (error) {
        console.error('❌ Error fetching social media posts:', error);
        throw new Error('Failed to fetch social media posts');
      }
      
      if (!data || !data.success) {
        console.error('❌ Invalid response format:', data);
        throw new Error('Invalid response format');
      }
      
      console.log(`✅ Successfully fetched ${data.posts.length} social media posts`);
      return data.posts || [];
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
