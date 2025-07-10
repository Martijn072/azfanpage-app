-- Create WordPress user mapping table
CREATE TABLE public.wordpress_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wordpress_user_id INTEGER NOT NULL UNIQUE,
  supabase_user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  username TEXT NOT NULL,
  display_name TEXT,
  email TEXT NOT NULL,
  avatar_url TEXT,
  wordpress_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.wordpress_users ENABLE ROW LEVEL SECURITY;

-- Create policies for WordPress users
CREATE POLICY "Users can view all WordPress user profiles" 
ON public.wordpress_users 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own WordPress profile" 
ON public.wordpress_users 
FOR UPDATE 
USING (auth.uid() = supabase_user_id);

-- Update user_profiles table to include WordPress integration
ALTER TABLE public.user_profiles 
ADD COLUMN wordpress_user_id INTEGER REFERENCES public.wordpress_users(wordpress_user_id);

-- Update secure_comments to use WordPress user data
ALTER TABLE public.secure_comments 
ADD COLUMN wordpress_user_id INTEGER REFERENCES public.wordpress_users(wordpress_user_id),
ADD COLUMN author_name TEXT,
ADD COLUMN author_email TEXT,
ADD COLUMN author_avatar_url TEXT;

-- Create index for better performance
CREATE INDEX idx_wordpress_users_wordpress_id ON public.wordpress_users(wordpress_user_id);
CREATE INDEX idx_wordpress_users_supabase_id ON public.wordpress_users(supabase_user_id);
CREATE INDEX idx_comments_wordpress_user ON public.secure_comments(wordpress_user_id);

-- Update timestamp trigger for wordpress_users
CREATE TRIGGER update_wordpress_users_updated_at
BEFORE UPDATE ON public.wordpress_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();