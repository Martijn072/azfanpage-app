
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
      
      try {
        const { data, error } = await supabase.functions.invoke('social-media-rss');
        
        console.log('Raw response from edge function:', { data, error });
        
        if (error) {
          console.error('❌ Error from Supabase function:', error);
          throw new Error(`Supabase function error: ${error.message || 'Unknown error'}`);
        }
        
        if (!data) {
          console.error('❌ No data received from function');
          throw new Error('No data received from social media function');
        }
        
        if (!data.success) {
          console.error('❌ Function returned unsuccessful response:', data);
          throw new Error(data.error || 'Function returned unsuccessful response');
        }
        
        const posts = data.posts || [];
        console.log(`✅ Successfully received ${posts.length} social media posts:`, posts);
        
        return posts;
      } catch (error) {
        console.error('❌ Full error in useSocialMediaPosts:', error);
        throw error;
      }
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    retry: 1, // Reduce retries to avoid long loading times
  });
};
