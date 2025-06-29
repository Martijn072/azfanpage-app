
-- Create comments table for test data
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users,
  author_name TEXT NOT NULL,
  author_email TEXT,
  author_avatar TEXT,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.comments(id),
  likes_count INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT true,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comment_likes table for like functionality
CREATE TABLE public.comment_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users,
  user_identifier TEXT, -- For anonymous users (IP or session)
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(comment_id, user_id),
  UNIQUE(comment_id, user_identifier)
);

-- Create notification_preferences table
CREATE TABLE public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  email TEXT NOT NULL,
  comment_replies BOOLEAN DEFAULT true,
  comment_mentions BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(email)
);

-- Add RLS policies for comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read approved comments
CREATE POLICY "Anyone can view approved comments" 
  ON public.comments 
  FOR SELECT 
  USING (is_approved = true);

-- Allow users to insert comments (with email for anonymous users)
CREATE POLICY "Users can create comments" 
  ON public.comments 
  FOR INSERT 
  WITH CHECK (true);

-- Allow users to update their own comments
CREATE POLICY "Users can update their own comments" 
  ON public.comments 
  FOR UPDATE 
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Add RLS policies for comment_likes
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view likes
CREATE POLICY "Anyone can view comment likes" 
  ON public.comment_likes 
  FOR SELECT 
  USING (true);

-- Allow users to manage their own likes
CREATE POLICY "Users can manage their own likes" 
  ON public.comment_likes 
  FOR ALL 
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Add RLS policies for notification_preferences
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own preferences
CREATE POLICY "Users can manage their own notification preferences" 
  ON public.notification_preferences 
  FOR ALL 
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Insert some test data for demonstration
INSERT INTO public.comments (article_id, author_name, author_email, author_avatar, content, created_at) VALUES
('1', 'Ajax Fan 1', 'fan1@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=fan1', 'Geweldige analyse! AZ speelt dit seizoen echt fantastisch voetbal. Hun tactische aanpak is veel beter geworden.', now() - interval '2 hours'),
('1', 'Voetbal Expert', 'expert@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=expert', 'Ik ben het helemaal eens. De nieuwe aanvallende strategie werkt perfect tegen dit soort tegenstanders.', now() - interval '1 hour'),
('1', 'AZ Supporter', 'supporter@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=supporter', 'Wie denkt jullie dat de man of the match wordt? Ik denk persoonlijk aan onze spits.', now() - interval '30 minutes'),
-- Add replies
('1', 'Tactiek Kenner', 'tactiek@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=tactiek', 'Goed punt! De manier waarop ze de ruimtes benutten is echt indrukwekkend.', now() - interval '45 minutes');

-- Get the parent comment ID for replies
DO $$
DECLARE
    parent_comment_id UUID;
BEGIN
    -- Get the first comment ID to use as parent
    SELECT id INTO parent_comment_id FROM public.comments WHERE author_name = 'Ajax Fan 1' LIMIT 1;
    
    -- Insert reply to first comment
    INSERT INTO public.comments (article_id, author_name, author_email, author_avatar, content, parent_id, created_at) VALUES
    ('1', 'Voetbal Liefhebber', 'liefhebber@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=liefhebber', 'Helemaal mee eens! Dit is het beste AZ wat ik in jaren heb gezien.', parent_comment_id, now() - interval '90 minutes');
END $$;

-- Add some likes to comments
INSERT INTO public.comment_likes (comment_id, user_identifier) 
SELECT id, 'anonymous_user_1' FROM public.comments WHERE author_name = 'Ajax Fan 1' LIMIT 1;

INSERT INTO public.comment_likes (comment_id, user_identifier) 
SELECT id, 'anonymous_user_2' FROM public.comments WHERE author_name = 'Ajax Fan 1' LIMIT 1;

-- Update likes count
UPDATE public.comments SET likes_count = 2 WHERE author_name = 'Ajax Fan 1';
UPDATE public.comments SET likes_count = 1 WHERE author_name = 'Voetbal Expert';
