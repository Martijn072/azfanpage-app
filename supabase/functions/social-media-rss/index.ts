
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔄 Starting RSS feed parsing...');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const posts: SocialMediaPost[] = [];

    // Parse Instagram RSS via RSS Bridge
    try {
      console.log('📷 Fetching Instagram posts...');
      const instagramUrl = 'https://rss-bridge.org/bridge01/?action=display&bridge=InstagramBridge&context=Hashtag&h=azalkmaar&format=Json';
      
      const instagramResponse = await fetch(instagramUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AZ-Fanpage-Bot/1.0)'
        }
      });
      
      if (instagramResponse.ok) {
        const instagramData = await instagramResponse.json();
        
        for (const item of instagramData.items || []) {
          posts.push({
            id: `instagram_${item.id || item.uri}`,
            platform: 'instagram',
            username: item.author || 'Unknown',
            content: (item.content_text || item.title || '').substring(0, 150),
            image_url: item.image,
            post_url: item.url,
            published_at: item.date_published || new Date().toISOString(),
            cached_at: new Date().toISOString()
          });
        }
        
        console.log(`✅ Found ${instagramData.items?.length || 0} Instagram posts`);
      }
    } catch (error) {
      console.error('❌ Instagram RSS error:', error);
    }

    // Parse Twitter RSS via Nitter
    try {
      console.log('🐦 Fetching Twitter posts...');
      const twitterUrl = 'https://nitter.net/search/rss?q=%23azalkmaar';
      
      const twitterResponse = await fetch(twitterUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AZ-Fanpage-Bot/1.0)'
        }
      });
      
      if (twitterResponse.ok) {
        const twitterXml = await twitterResponse.text();
        
        // Parse XML manually for Twitter RSS
        const itemRegex = /<item>(.*?)<\/item>/gs;
        const items = [...twitterXml.matchAll(itemRegex)];
        
        for (const match of items) {
          const itemContent = match[1];
          
          const titleMatch = itemContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
          const linkMatch = itemContent.match(/<link>(.*?)<\/link>/);
          const pubDateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/);
          const descriptionMatch = itemContent.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/);
          
          if (titleMatch && linkMatch) {
            const username = titleMatch[1].split(':')[0] || 'Unknown';
            const content = (descriptionMatch?.[1] || titleMatch[1]).substring(0, 150);
            
            posts.push({
              id: `twitter_${linkMatch[1]}`,
              platform: 'twitter',
              username: username,
              content: content,
              post_url: linkMatch[1],
              published_at: pubDateMatch?.[1] ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString(),
              cached_at: new Date().toISOString()
            });
          }
        }
        
        console.log(`✅ Found ${items.length} Twitter posts`);
      }
    } catch (error) {
      console.error('❌ Twitter RSS error:', error);
    }

    // Store posts in Supabase (we'll create the table structure)
    if (posts.length > 0) {
      console.log(`💾 Caching ${posts.length} total posts...`);
      
      // For now, return the posts directly since we need to create the table first
      return new Response(
        JSON.stringify({
          success: true,
          posts: posts.slice(0, 20), // Limit to latest 20 posts
          cached_at: new Date().toISOString()
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        posts: [],
        message: 'No posts found'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ RSS parsing error:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Failed to parse RSS feeds',
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
