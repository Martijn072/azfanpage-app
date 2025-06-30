
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

    // Parse Instagram RSS via RSS Bridge - zoek naar AZ Alkmaar + #AZFanpage
    try {
      console.log('📷 Fetching Instagram posts for AZ Alkmaar...');
      
      // Probeer verschillende zoekopdrachten
      const instagramQueries = [
        'https://rss-bridge.org/bridge01/?action=display&bridge=InstagramBridge&context=Username&u=az&format=Json',
        'https://rss-bridge.org/bridge01/?action=display&bridge=InstagramBridge&context=Hashtag&h=azfanpage&format=Json'
      ];
      
      for (const instagramUrl of instagramQueries) {
        try {
          const instagramResponse = await fetch(instagramUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; AZ-Fanpage-Bot/1.0)',
              'Accept': 'application/json'
            }
          });
          
          console.log(`📷 Instagram response status for ${instagramUrl}: ${instagramResponse.status}`);
          
          if (instagramResponse.ok) {
            const instagramData = await instagramResponse.json();
            console.log(`📷 Instagram data received:`, Object.keys(instagramData));
            
            if (instagramData.items && Array.isArray(instagramData.items)) {
              for (const item of instagramData.items.slice(0, 5)) {
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
          }
        } catch (error) {
          console.error(`❌ Instagram RSS error for ${instagramUrl}:`, error);
        }
      }
    } catch (error) {
      console.error('❌ Instagram RSS error:', error);
    }

    // Parse Twitter RSS via Nitter - zoek naar AZ Alkmaar + #AZFanpage
    const nitterInstances = [
      'https://nitter.net',
      'https://nitter.it', 
      'https://nitter.privacydev.net'
    ];

    const twitterQueries = [
      'AZ%20Alkmaar',
      '%23AZFanpage',
      '%23azalkmaar'
    ];

    for (const nitterBase of nitterInstances) {
      for (const query of twitterQueries) {
        try {
          console.log(`🐦 Fetching Twitter posts from ${nitterBase} for query: ${decodeURIComponent(query)}...`);
          const twitterUrl = `${nitterBase}/search/rss?q=${query}`;
          
          const twitterResponse = await fetch(twitterUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; AZ-Fanpage-Bot/1.0)',
              'Accept': 'application/rss+xml, application/xml, text/xml'
            },
            timeout: 10000 // 10 second timeout
          });
          
          console.log(`🐦 Twitter response status from ${nitterBase} for ${query}: ${twitterResponse.status}`);
          
          if (twitterResponse.ok) {
            const twitterXml = await twitterResponse.text();
            console.log(`🐦 Twitter XML length: ${twitterXml.length}`);
            
            // Parse XML manually for Twitter RSS
            const itemRegex = /<item>(.*?)<\/item>/gs;
            const items = [...twitterXml.matchAll(itemRegex)];
            
            for (const match of items.slice(0, 5)) {
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
                  id: `twitter_${guidMatch?.[1] || linkMatch[1]}_${query}`,
                  platform: 'twitter',
                  username: username.replace('@', ''),
                  content: content.replace(/<[^>]*>/g, ''), // Strip HTML tags
                  post_url: linkMatch[1],
                  published_at: pubDateMatch?.[1] ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString(),
                  cached_at: new Date().toISOString()
                });
              }
            }
            
            console.log(`✅ Found ${items.length} Twitter posts from ${nitterBase} for ${query}`);
            
            if (items.length > 0) {
              break; // Stop als we posts hebben gevonden voor deze query
            }
          }
        } catch (error) {
          console.error(`❌ Twitter RSS error from ${nitterBase} for ${query}:`, error);
          continue;
        }
      }
      
      if (posts.filter(p => p.platform === 'twitter').length > 0) {
        break; // Stop als we Twitter posts hebben van deze instance
      }
    }

    // Add some test data if no posts found (voor development/testing)
    if (posts.length === 0) {
      console.log('⚠️ No posts found, adding test data...');
      posts.push(
        {
          id: 'test_instagram_1',
          platform: 'instagram',
          username: 'az_official',
          content: 'Test Instagram post over AZ Alkmaar - onze geweldige club! #AZFanpage',
          image_url: 'https://via.placeholder.com/400x300?text=AZ+Instagram',
          post_url: 'https://instagram.com/p/test',
          published_at: new Date().toISOString(),
          cached_at: new Date().toISOString()
        },
        {
          id: 'test_twitter_1',
          platform: 'twitter',
          username: 'az_supporter',
          content: 'Fantastische wedstrijd van AZ vandaag! Trots op onze club. #AZFanpage',
          post_url: 'https://twitter.com/az_supporter/status/test',
          published_at: new Date().toISOString(),
          cached_at: new Date().toISOString()
        },
        {
          id: 'test_twitter_2',
          platform: 'twitter',
          username: 'alkmaar_fan',
          content: 'AZ Alkmaar speelt geweldig dit seizoen! Hoop op meer mooie wedstrijden.',
          post_url: 'https://twitter.com/alkmaar_fan/status/test2',
          published_at: new Date().toISOString(),
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

    console.log(`💾 Returning ${uniquePosts.length} unique posts (${posts.length} total before deduplication)...`);
    
    return new Response(
      JSON.stringify({
        success: true,
        posts: uniquePosts.slice(0, 20), // Limit to latest 20 posts
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
