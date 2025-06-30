
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
    console.log('🔄 Starting RSS feed parsing (Instagram only)...');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const posts: SocialMediaPost[] = [];

    // Parse Instagram RSS via RSS Bridge - zoek naar AZ Alkmaar + #AZFanpage
    try {
      console.log('📷 Fetching Instagram posts for AZ Alkmaar...');
      
      // Probeer verschillende Instagram zoekopdrachten
      const instagramQueries = [
        {
          url: 'https://rss-bridge.org/bridge01/?action=display&bridge=InstagramBridge&context=Username&u=az&format=Json',
          name: 'AZ Official Account'
        },
        {
          url: 'https://rss-bridge.org/bridge01/?action=display&bridge=InstagramBridge&context=Hashtag&h=azfanpage&format=Json',
          name: 'AZFanpage Hashtag'
        },
        {
          url: 'https://rss-bridge.org/bridge01/?action=display&bridge=InstagramBridge&context=Hashtag&h=azalkmaar&format=Json',
          name: 'AZ Alkmaar Hashtag'
        }
      ];
      
      for (const query of instagramQueries) {
        try {
          console.log(`📷 Trying Instagram: ${query.name}...`);
          
          const instagramResponse = await fetch(query.url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; AZ-Fanpage-Bot/1.0)',
              'Accept': 'application/json'
            },
            signal: AbortSignal.timeout(15000) // 15 second timeout
          });
          
          console.log(`📷 Instagram response status for ${query.name}: ${instagramResponse.status}`);
          
          if (instagramResponse.ok) {
            const instagramData = await instagramResponse.json();
            console.log(`📷 Instagram data keys:`, Object.keys(instagramData));
            
            if (instagramData.items && Array.isArray(instagramData.items)) {
              console.log(`📷 Found ${instagramData.items.length} items for ${query.name}`);
              
              for (const item of instagramData.items.slice(0, 5)) {
                console.log('📷 Processing item:', {
                  id: item.id,
                  author: item.author,
                  hasImage: !!item.image,
                  hasUrl: !!item.url
                });
                
                posts.push({
                  id: `instagram_${item.id || item.uri || Math.random().toString(36)}`,
                  platform: 'instagram',
                  username: item.author || 'az_official',
                  content: (item.content_text || item.title || 'Instagram post').substring(0, 150),
                  image_url: item.image,
                  post_url: item.url,
                  published_at: item.date_published || new Date().toISOString(),
                  cached_at: new Date().toISOString()
                });
              }
            } else {
              console.log(`📷 No items found for ${query.name}`);
            }
          } else {
            console.log(`📷 Instagram request failed for ${query.name}: ${instagramResponse.status}`);
          }
        } catch (error) {
          console.error(`❌ Instagram RSS error for ${query.name}:`, error.message);
        }
      }
    } catch (error) {
      console.error('❌ Instagram RSS error:', error);
    }

    console.log(`📊 Total Instagram posts found: ${posts.length}`);

    // Add some test data if no posts found (voor development/testing)
    if (posts.length === 0) {
      console.log('⚠️ No Instagram posts found, adding test data...');
      posts.push(
        {
          id: 'test_instagram_1',
          platform: 'instagram',
          username: 'az_official',
          content: 'Test Instagram post over AZ Alkmaar - onze geweldige club! #AZFanpage',
          image_url: 'https://via.placeholder.com/400x300/FF0000/FFFFFF?text=AZ+Instagram',
          post_url: 'https://instagram.com/p/test1',
          published_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
          cached_at: new Date().toISOString()
        },
        {
          id: 'test_instagram_2',
          platform: 'instagram',
          username: 'azfanpage',
          content: 'Fantastische wedstrijd van AZ vandaag! Trots op onze club.',
          image_url: 'https://via.placeholder.com/400x300/CC0000/FFFFFF?text=AZ+Wedstrijd',
          post_url: 'https://instagram.com/p/test2',
          published_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
          cached_at: new Date().toISOString()
        },
        {
          id: 'test_instagram_3',
          platform: 'instagram',
          username: 'alkmaar_fan',
          content: 'AZ Alkmaar speelt geweldig dit seizoen! Hoop op meer mooie wedstrijden. #azalkmaar',
          post_url: 'https://instagram.com/p/test3',
          published_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
          cached_at: new Date().toISOString()
        }
      );
    }

    // Remove duplicates based on content similarity
    const uniquePosts = posts.filter((post, index, self) => 
      index === self.findIndex(p => 
        p.platform === post.platform && 
        p.username === post.username && 
        p.content.substring(0, 50) === post.content.substring(0, 50)
      )
    );

    // Sort by published date (newest first)
    uniquePosts.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

    console.log(`💾 Returning ${uniquePosts.length} unique Instagram posts...`);
    
    return new Response(
      JSON.stringify({
        success: true,
        posts: uniquePosts.slice(0, 10), // Limit to latest 10 posts
        cached_at: new Date().toISOString(),
        debug: {
          total_found: posts.length,
          unique_count: uniquePosts.length,
          platform: 'instagram_only'
        }
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
        success: false,
        error: 'Failed to parse RSS feeds',
        details: error.message,
        debug: {
          platform: 'instagram_only',
          timestamp: new Date().toISOString()
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
