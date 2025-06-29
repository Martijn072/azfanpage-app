
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from "node:crypto";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Twitter API credentials
const API_KEY = Deno.env.get("TWITTER_CONSUMER_KEY")?.trim();
const API_SECRET = Deno.env.get("TWITTER_CONSUMER_SECRET")?.trim();
const ACCESS_TOKEN = Deno.env.get("TWITTER_ACCESS_TOKEN")?.trim();
const ACCESS_TOKEN_SECRET = Deno.env.get("TWITTER_ACCESS_TOKEN_SECRET")?.trim();

function validateEnvironmentVariables() {
  if (!API_KEY) {
    throw new Error("Missing TWITTER_CONSUMER_KEY environment variable");
  }
  if (!API_SECRET) {
    throw new Error("Missing TWITTER_CONSUMER_SECRET environment variable");
  }
  if (!ACCESS_TOKEN) {
    throw new Error("Missing TWITTER_ACCESS_TOKEN environment variable");
  }
  if (!ACCESS_TOKEN_SECRET) {
    throw new Error("Missing TWITTER_ACCESS_TOKEN_SECRET environment variable");
  }
}

function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string
): string {
  const signatureBaseString = `${method}&${encodeURIComponent(
    url
  )}&${encodeURIComponent(
    Object.entries(params)
      .sort()
      .map(([k, v]) => `${k}=${v}`)
      .join("&")
  )}`;
  const signingKey = `${encodeURIComponent(
    consumerSecret
  )}&${encodeURIComponent(tokenSecret)}`;
  const hmacSha1 = createHmac("sha1", signingKey);
  const signature = hmacSha1.update(signatureBaseString).digest("base64");

  return signature;
}

function generateOAuthHeader(method: string, url: string, queryParams: Record<string, string> = {}): string {
  const oauthParams = {
    oauth_consumer_key: API_KEY!,
    oauth_nonce: Math.random().toString(36).substring(2),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: ACCESS_TOKEN!,
    oauth_version: "1.0",
  };

  // Combine OAuth params with query params for signature generation
  const allParams = { ...oauthParams, ...queryParams };

  const signature = generateOAuthSignature(
    method,
    url.split('?')[0], // Remove query string from URL for signature
    allParams,
    API_SECRET!,
    ACCESS_TOKEN_SECRET!
  );

  const signedOAuthParams = {
    ...oauthParams,
    oauth_signature: signature,
  };

  const entries = Object.entries(signedOAuthParams).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  return (
    "OAuth " +
    entries
      .map(([k, v]) => `${encodeURIComponent(k)}="${encodeURIComponent(v)}"`)
      .join(", ")
  );
}

async function getUserTimeline(): Promise<any[]> {
  try {
    console.log('🐦 Fetching user timeline from Twitter API...');
    
    // First, get user ID for azfanpage
    const userUrl = `https://api.x.com/2/users/by/username/azfanpage`;
    const userOauthHeader = generateOAuthHeader("GET", userUrl);
    
    const userResponse = await fetch(userUrl, {
      method: "GET",
      headers: {
        Authorization: userOauthHeader,
        "Content-Type": "application/json",
      },
    });

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error('❌ Error fetching user info:', errorText);
      throw new Error(`Failed to fetch user info: ${userResponse.status}`);
    }

    const userData = await userResponse.json();
    const userId = userData.data?.id;

    if (!userId) {
      console.error('❌ User azfanpage not found');
      return [];
    }

    console.log('✅ Found user ID:', userId);

    // Now get the user's recent tweets
    const tweetsUrl = `https://api.x.com/2/users/${userId}/tweets`;
    const queryParams = {
      'max_results': '10',
      'tweet.fields': 'created_at,text,public_metrics'
    };
    
    const tweetsUrlWithParams = `${tweetsUrl}?${new URLSearchParams(queryParams).toString()}`;
    const tweetsOauthHeader = generateOAuthHeader("GET", tweetsUrl, queryParams);

    const tweetsResponse = await fetch(tweetsUrlWithParams, {
      method: "GET",
      headers: {
        Authorization: tweetsOauthHeader,
        "Content-Type": "application/json",
      },
    });

    if (!tweetsResponse.ok) {
      const errorText = await tweetsResponse.text();
      console.error('❌ Error fetching tweets:', errorText);
      throw new Error(`Failed to fetch tweets: ${tweetsResponse.status}`);
    }

    const tweetsData = await tweetsResponse.json();
    console.log('✅ Fetched tweets data:', tweetsData);

    return tweetsData.data || [];
  } catch (error) {
    console.error('❌ Error in getUserTimeline:', error);
    return [];
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    validateEnvironmentVariables();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('🔍 Starting social media fetch...')

    // Fetch real tweets from Twitter API
    const twitterPosts = await getUserTimeline();
    console.log(`🐦 Found ${twitterPosts.length} tweets from Twitter API`);

    // Mock Instagram posts (Instagram API requires business verification)
    const mockInstagramPosts = [
      {
        id: 'insta_' + Date.now(),
        title: 'Nieuwe Instagram post',
        description: 'Training vandaag was intensief! De spelers zijn klaar voor de volgende wedstrijd. 💪⚽',
        url: 'https://instagram.com/p/mockpost1',
        thumbnail: 'https://picsum.photos/300/300?random=' + Math.floor(Math.random() * 1000),
        timestamp: new Date().toISOString()
      }
    ]

    // Check for existing notifications to avoid duplicates
    const { data: existingNotifications } = await supabaseClient
      .from('notifications')
      .select('social_media_url')
      .in('type', ['instagram', 'twitter'])
      .order('created_at', { ascending: false })
      .limit(50)

    const existingUrls = new Set(existingNotifications?.map(n => n.social_media_url) || [])

    // Insert new Twitter posts
    let newTwitterPosts = 0;
    for (const tweet of twitterPosts) {
      const tweetUrl = `https://twitter.com/azfanpage/status/${tweet.id}`;
      
      if (!existingUrls.has(tweetUrl)) {
        console.log('🐦 Adding new tweet:', tweet.text?.substring(0, 50) + '...');
        
        const { error } = await supabaseClient
          .from('notifications')
          .insert({
            type: 'twitter',
            title: 'Nieuwe Tweet van AZ Fanpage',
            description: tweet.text?.length > 150 
              ? tweet.text.substring(0, 147) + '...'
              : tweet.text,
            icon: '🐦',
            social_media_url: tweetUrl,
            thumbnail_url: null,
            read: false
          })

        if (error) {
          console.error('❌ Error inserting tweet:', error)
        } else {
          console.log('✅ Tweet added successfully')
          newTwitterPosts++;
        }
      }
    }

    // Insert new Instagram posts (mock data for now)
    let newInstagramPosts = 0;
    for (const post of mockInstagramPosts) {
      if (!existingUrls.has(post.url)) {
        console.log('📷 Adding new Instagram post:', post.title)
        
        const { error } = await supabaseClient
          .from('notifications')
          .insert({
            type: 'instagram',
            title: post.title,
            description: post.description,
            icon: '📷',
            social_media_url: post.url,
            thumbnail_url: post.thumbnail,
            read: false
          })

        if (error) {
          console.error('❌ Error inserting Instagram post:', error)
        } else {
          console.log('✅ Instagram post added successfully')
          newInstagramPosts++;
        }
      }
    }

    console.log('✅ Social media fetch completed')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Social media posts fetched successfully',
        new_twitter_posts: newTwitterPosts,
        new_instagram_posts: newInstagramPosts,
        total_twitter_checked: twitterPosts.length,
        total_instagram_checked: mockInstagramPosts.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('❌ Error in social media fetcher:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
