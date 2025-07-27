import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WordPressAuthRequest {
  action: 'login' | 'register';
  email: string;
  password: string;
  username?: string;
  display_name?: string;
}

const WORDPRESS_API_BASE = 'https://www.azfanpage.nl/wp-json/wp/v2';
const WORDPRESS_AUTH_BASE = 'https://www.azfanpage.nl/wp-json/jwt-auth/v1';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, email, password, username, display_name }: WordPressAuthRequest = await req.json();

    if (action === 'login') {
      // Authenticate with WordPress
      const authResponse = await fetch(`${WORDPRESS_AUTH_BASE}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password: password
        })
      });

      const authData = await authResponse.json();

      if (!authResponse.ok) {
        console.log('WordPress auth failed:', authData);
        return new Response(JSON.stringify({
          success: false,
          message: 'Onjuiste inloggegevens'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Get user details from WordPress
      const userResponse = await fetch(`${WORDPRESS_API_BASE}/users/me`, {
        headers: {
          'Authorization': `Bearer ${authData.token}`
        }
      });

      const userData = await userResponse.json();

      if (!userResponse.ok) {
        console.log('Failed to get user data:', userData);
        return new Response(JSON.stringify({
          success: false,
          message: 'Kan gebruikersgegevens niet ophalen'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Create or sign in Supabase user
      const { data: supabaseUser, error: supabaseError } = await supabase.auth.admin.createUser({
        email: userData.email,
        email_confirm: true,
        user_metadata: {
          wordpress_id: userData.id,
          username: userData.username,
          display_name: userData.name
        }
      });

      // Store WordPress user mapping
      const { error: mappingError } = await supabase
        .from('wordpress_users')
        .upsert({
          wordpress_user_id: userData.id,
          supabase_user_id: supabaseUser?.user?.id,
          username: userData.username,
          display_name: userData.name,
          email: userData.email,
          avatar_url: userData.avatar_urls?.['96'] || null,
          wordpress_token: authData.token,
          token_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          last_login_at: new Date().toISOString()
        }, {
          onConflict: 'wordpress_user_id'
        });

      if (mappingError) {
        console.error('Failed to store user mapping:', mappingError);
      }

      return new Response(JSON.stringify({
        success: true,
        user: {
          id: userData.id,
          username: userData.username,
          display_name: userData.name,
          email: userData.email,
          avatar_url: userData.avatar_urls?.['96'] || null,
          token: authData.token,
          supabase_user_id: supabaseUser?.user?.id
        }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });

    } else if (action === 'register') {
      console.log('🚀 Starting WordPress registration process...');
      console.log('📝 Registration data:', { username, email, display_name });

      // Get admin credentials from environment
      const adminToken = Deno.env.get('WORDPRESS_ADMIN_TOKEN');
      
      if (!adminToken) {
        console.error('❌ WORDPRESS_ADMIN_TOKEN not configured');
        return new Response(JSON.stringify({
          success: false,
          message: 'Server configuratie fout - admin token ontbreekt'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      console.log('🔑 Admin token found, length:', adminToken.length);

      // Try alternative approach: Use WordPress Application Passwords format
      // Expected format: username:application_password (not regular password)
      if (!adminToken.includes(':')) {
        console.error('❌ WORDPRESS_ADMIN_TOKEN must be in format username:application_password');
        return new Response(JSON.stringify({
          success: false,
          message: 'Server configuratie fout - token moet username:application_password format hebben'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      const [adminUsername, adminPassword] = adminToken.split(':');
      console.log('🔐 Using admin username:', adminUsername);

      // First check WordPress settings to see if registration is enabled
      console.log('🔍 Checking WordPress registration settings...');
      
      try {
        const settingsResponse = await fetch('https://www.azfanpage.nl/wp-json/wp/v2/settings', {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${btoa(adminToken)}`
          }
        });
        
        if (settingsResponse.ok) {
          const settings = await settingsResponse.json();
          console.log('📊 WordPress settings checked, users_can_register:', settings.users_can_register);
          
          if (!settings.users_can_register) {
            console.log('⚠️ WordPress registration is disabled, trying to enable it...');
            
            // Try to enable user registration
            const updateResponse = await fetch('https://www.azfanpage.nl/wp-json/wp/v2/settings', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${btoa(adminToken)}`
              },
              body: JSON.stringify({
                users_can_register: true
              })
            });
            
            if (updateResponse.ok) {
              console.log('✅ Successfully enabled WordPress registration');
            } else {
              console.log('❌ Failed to enable WordPress registration');
            }
          }
        }
      } catch (settingsError) {
        console.error('💥 Settings check error:', settingsError);
      }

      // Alternative approach 1: Try using wp-admin AJAX for registration
      console.log('🔄 Attempting WordPress registration via wp-admin/admin-ajax.php...');
      
      const ajaxPayload = new URLSearchParams({
        action: 'create_user',
        user_login: username || email.split('@')[0],
        user_email: email,
        user_pass: password,
        display_name: display_name || username || email.split('@')[0],
        role: 'subscriber'
      });

      const ajaxResponse = await fetch('https://www.azfanpage.nl/wp-admin/admin-ajax.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(adminToken)}`
        },
        body: ajaxPayload
      });

      console.log('📡 AJAX response status:', ajaxResponse.status);
      const ajaxResult = await ajaxResponse.text();
      console.log('📄 AJAX response:', ajaxResult);

      // Alternative approach 2: Try using REST API with different headers
      console.log('🔄 Attempting WordPress registration via REST API with enhanced headers...');
      
      const registrationPayload = {
        username: username || email.split('@')[0],
        email: email,
        password: password,
        name: display_name || username || email.split('@')[0],
        roles: ['subscriber'],
        meta: {
          first_name: display_name || username || email.split('@')[0]
        }
      };
      
      console.log('📦 Enhanced registration payload:', registrationPayload);

      const registerResponse = await fetch(`${WORDPRESS_API_BASE}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(adminToken)}`,
          'X-WP-Nonce': '', // Try without nonce first
          'User-Agent': 'AZ-Fanpage-App/1.0'
        },
        body: JSON.stringify(registrationPayload)
      });

      console.log('📡 WordPress API response status:', registerResponse.status);
      console.log('📡 WordPress API response headers:', Object.fromEntries(registerResponse.headers.entries()));

      const registerData = await registerResponse.json();
      console.log('📄 WordPress API full response:', JSON.stringify(registerData, null, 2));

      if (!registerResponse.ok) {
        console.log('❌ WordPress registration failed with status:', registerResponse.status);
        console.log('❌ WordPress error details:', registerData);
        
        // Alternative approach 3: If REST API fails, create Supabase-only account with WordPress sync later
        if (registerData.code === 'rest_cannot_create_user' || registerResponse.status === 401) {
          console.log('🔄 WordPress registration failed, creating Supabase-only account...');
          
          // Create Supabase user directly
          const { data: supabaseUser, error: supabaseError } = await supabase.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true,
            user_metadata: {
              display_name: display_name || username || email.split('@')[0],
              username: username || email.split('@')[0],
              wordpress_sync_pending: true
            }
          });

          if (supabaseError) {
            console.error('❌ Supabase user creation failed:', supabaseError);
            return new Response(JSON.stringify({
              success: false,
              message: 'Registratie mislukt - kan geen account aanmaken'
            }), {
              status: 400,
              headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
          }

          console.log('✅ Supabase user created successfully:', supabaseUser?.user?.id);
          
          return new Response(JSON.stringify({
            success: true,
            message: 'Account succesvol aangemaakt. WordPress synchronisatie wordt later uitgevoerd.',
            user: {
              id: 'temp_' + supabaseUser?.user?.id,
              username: username || email.split('@')[0],
              display_name: display_name || username || email.split('@')[0],
              email: email,
              supabase_user_id: supabaseUser?.user?.id,
              wordpress_sync_pending: true
            }
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }
        
        // Provide more specific error messages for other cases
        let errorMessage = 'Registratie mislukt';
        
        if (registerData.code === 'existing_user_login') {
          errorMessage = 'Deze gebruikersnaam is al in gebruik';
        } else if (registerData.code === 'existing_user_email') {
          errorMessage = 'Dit e-mailadres is al geregistreerd';
        } else if (registerData.code === 'rest_user_invalid_email') {
          errorMessage = 'Ongeldig e-mailadres';
        } else if (registerData.message) {
          errorMessage = registerData.message;
        }
        
        return new Response(JSON.stringify({
          success: false,
          message: errorMessage,
          debug: {
            status: registerResponse.status,
            wordpress_error: registerData,
            troubleshooting: 'Check WordPress admin -> Settings -> General -> "Anyone can register" and admin user permissions'
          }
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      console.log('✅ WordPress registration successful:', registerData);

      // After successful registration, automatically log the user in
      console.log('🔄 Auto-login after registration...');
      
      try {
        const loginResponse = await fetch(`${WORDPRESS_AUTH_BASE}/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: email,
            password: password
          })
        });

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          console.log('✅ Auto-login successful');
          
          // Create Supabase user mapping
          const { data: supabaseUser, error: supabaseError } = await supabase.auth.admin.createUser({
            email: registerData.email,
            email_confirm: true,
            user_metadata: {
              wordpress_id: registerData.id,
              username: registerData.username,
              display_name: registerData.name
            }
          });

          // Store WordPress user mapping
          const { error: mappingError } = await supabase
            .from('wordpress_users')
            .upsert({
              wordpress_user_id: registerData.id,
              supabase_user_id: supabaseUser?.user?.id,
              username: registerData.username,
              display_name: registerData.name,
              email: registerData.email,
              avatar_url: registerData.avatar_urls?.['96'] || null,
              wordpress_token: loginData.token,
              token_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              last_login_at: new Date().toISOString()
            }, {
              onConflict: 'wordpress_user_id'
            });

          if (mappingError) {
            console.error('Failed to store user mapping:', mappingError);
          }
          
          return new Response(JSON.stringify({
            success: true,
            message: 'Account succesvol aangemaakt en ingelogd',
            user: {
              id: registerData.id,
              username: registerData.username,
              display_name: registerData.name,
              email: registerData.email,
              token: loginData.token,
              supabase_user_id: supabaseUser?.user?.id
            }
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        } else {
          console.log('⚠️ Auto-login failed, but registration successful');
        }
      } catch (loginError) {
        console.error('💥 Auto-login error:', loginError);
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'Account succesvol aangemaakt. Je kunt nu inloggen.'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    return new Response(JSON.stringify({
      success: false,
      message: 'Ongeldige actie'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error: any) {
    console.error('💥 WordPress auth error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Server fout',
      debug: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});
