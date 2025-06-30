
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
          'User-Agent': 'Mozilla/5.0 (compatible; AZ-Fanpage-Bot/1.0)',
          'Accept': 'application/json'
        }
      });
      
      console.log(`📷 Instagram response status: ${instagramResponse.status}`);
      
      if (instagramResponse.ok) {
        const instagramData = await instagramResponse.json();
        console.log(`📷 Instagram data received:`, Object.keys(instagramData));
        
        if (instagramData.items && Array.isArray(instagramData.items)) {
          for (const item of instagramData.items.slice(0, 10)) {
            posts.push({
              id: `instagram_${item.id || item.uri || Math.random().toString(36)}`,
              platform: 'instagram',
              username: item.author || 'Unknown',
              content: (item.content_text || item.title || 'Instagram post').substring(0, 150),
              image_url: item.image,
              post_url: item.url,
              published_at: item.date_published || new Date().toISOString(),
              cached_at: new Date().toISOString()
            });
          }
        }
        
        console.log(`✅ Found ${instagramData.items?.length || 0} Instagram posts`);
      } else {
        console.error(`❌ Instagram RSS failed with status: ${instagramResponse.status}`);
      }
    } catch (error) {
      console.error('❌ Instagram RSS error:', error);
    }

    // Parse Twitter RSS via Nitter (multiple instances for reliability)
    const nitterInstances = [
      'https://nitter.net',
      'https://nitter.it', 
      'https://nitter.privacydev.net'
    ];

    for (const nitterBase of nitterInstances) {
      try {
        console.log(`🐦 Fetching Twitter posts from ${nitterBase}...`);
        const twitterUrl = `${nitterBase}/search/rss?q=%23azalkmaar`;
        
        const twitterResponse = await fetch(twitterUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; AZ-Fanpage-Bot/1.0)',
            'Accept': 'application/rss+xml, application/xml, text/xml'
          },
          timeout: 10000 // 10 second timeout
        });
        
        console.log(`🐦 Twitter response status from ${nitterBase}: ${twitterResponse.status}`);
        
        if (twitterResponse.ok) {
          const twitterXml = await twitterResponse.text();
          console.log(`🐦 Twitter XML length: ${twitterXml.length}`);
          
          // Parse XML manually for Twitter RSS
          const itemRegex = /<item>(.*?)<\/item>/gs;
          const items = [...twitterXml.matchAll(itemRegex)];
          
          for (const match of items.slice(0, 10)) {
            const itemContent = match[1];
            
            const titleMatch = itemContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
            const linkMatch = itemContent.match(/<link>(.*?)<\/link>/);
            const pubDateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/);
            const descriptionMatch = itemContent.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/);
            const guidMatch = itemContent.match(/<guid.*?>(.*?)<\/guid>/);
            
            if (titleMatch && linkMatch) {
              const username = titleMatch[1].split(':')[0] || 'Unknown';
              const content = (descriptionMatch?.[1] || titleMatch[1]).substring(0, 150);
              
              posts.push({
                id: `twitter_${guidMatch?.[1] || linkMatch[1]}`,
                platform: 'twitter',
                username: username.replace('@', ''),
                content: content.replace(/<[^>]*>/g, ''), // Strip HTML tags
                post_url: linkMatch[1],
                published_at: pubDateMatch?.[1] ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString(),
                cached_at: new Date().toISOString()
              });
            }
          }
          
          console.log(`✅ Found ${items.length} Twitter posts from ${nitterBase}`);
          break; // Successfully got Twitter posts, break out of loop
        }
      } catch (error) {
        console.error(`❌ Twitter RSS error from ${nitterBase}:`, error);
        continue; // Try next Nitter instance
      }
    }

    // Add some test data if no posts found (for development/testing)
    if (posts.length === 0) {
      console.log('⚠️ No posts found, adding test data...');
      posts.push(
        {
          id: 'test_instagram_1',
          platform: 'instagram',
          username: 'az_supporter',
          content: 'Test Instagram post over AZ Alkmaar #azalkmaar',
          image_url: 'https://via.placeholder.com/400x300?text=AZ+Instagram',
          post_url: 'https://instagram.com/p/test',
          published_at: new Date().toISOString(),
          cached_at: new Date().toISOString()
        },
        {
          id: 'test_twitter_1',
          platform: 'twitter',
          username: 'az_fan',
          content: 'Test Twitter post over onze geweldige club AZ! #azalkmaar',
          post_url: 'https://twitter.com/az_fan/status/test',
          published_at: new Date().toISOString(),
          cached_at: new Date().toISOString()
        }
      );
    }

    console.log(`💾 Returning ${posts.length} total posts...`);
    
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
