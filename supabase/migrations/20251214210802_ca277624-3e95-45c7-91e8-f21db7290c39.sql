-- Drop the overly permissive SELECT policy that exposes author_email
DROP POLICY IF EXISTS "Anyone can view approved comments" ON public.secure_comments;

-- Create a more restrictive policy - only authenticated users can view approved comments
-- This still exposes author_email to authenticated users viewing the table directly
CREATE POLICY "Authenticated users can view approved comments" 
ON public.secure_comments 
FOR SELECT 
TO authenticated
USING ((is_approved = true) AND (NOT is_hidden));

-- Create a security definer function for public comment access that excludes author_email
CREATE OR REPLACE FUNCTION public.get_article_comments(p_article_id text)
RETURNS TABLE(
  id uuid,
  article_id text,
  user_id uuid,
  parent_id uuid,
  content text,
  content_html text,
  author_name text,
  author_avatar_url text,
  wordpress_user_id integer,
  likes_count integer,
  dislikes_count integer,
  reply_count integer,
  depth integer,
  is_edited boolean,
  is_pinned boolean,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    sc.id,
    sc.article_id,
    sc.user_id,
    sc.parent_id,
    sc.content,
    sc.content_html,
    sc.author_name,
    sc.author_avatar_url,
    sc.wordpress_user_id,
    sc.likes_count,
    sc.dislikes_count,
    sc.reply_count,
    sc.depth,
    sc.is_edited,
    sc.is_pinned,
    sc.created_at,
    sc.updated_at
  FROM public.secure_comments sc
  WHERE sc.article_id = p_article_id
    AND sc.is_approved = true
    AND sc.is_hidden = false
  ORDER BY sc.is_pinned DESC, sc.created_at ASC;
$$;

-- Grant execute permission to everyone (including anonymous)
GRANT EXECUTE ON FUNCTION public.get_article_comments(text) TO anon;
GRANT EXECUTE ON FUNCTION public.get_article_comments(text) TO authenticated;