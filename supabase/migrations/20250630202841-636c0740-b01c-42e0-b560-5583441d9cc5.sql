
-- Create table for supporter media uploads
CREATE TABLE public.supporter_media (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  filename text NOT NULL,
  original_filename text NOT NULL,
  file_url text NOT NULL,
  thumbnail_url text,
  file_type text NOT NULL CHECK (file_type IN ('image', 'video')),
  file_size integer NOT NULL,
  hashtags text[] DEFAULT '{}',
  caption text,
  votes_count integer DEFAULT 0,
  reports_count integer DEFAULT 0,
  is_approved boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create table for votes on media
CREATE TABLE public.media_votes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  media_id uuid REFERENCES public.supporter_media(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users,
  user_identifier text, -- for anonymous voting
  vote_type text NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(media_id, user_id),
  UNIQUE(media_id, user_identifier)
);

-- Create table for media reports
CREATE TABLE public.media_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  media_id uuid REFERENCES public.supporter_media(id) ON DELETE CASCADE NOT NULL,
  reporter_user_id uuid REFERENCES auth.users,
  reporter_identifier text,
  reason text NOT NULL,
  description text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.supporter_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for supporter_media
CREATE POLICY "Anyone can view approved media" 
  ON public.supporter_media 
  FOR SELECT 
  USING (is_approved = true);

CREATE POLICY "Users can create their own media" 
  ON public.supporter_media 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own media" 
  ON public.supporter_media 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for media_votes  
CREATE POLICY "Anyone can view votes" 
  ON public.media_votes 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can vote" 
  ON public.media_votes 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update their votes" 
  ON public.media_votes 
  FOR UPDATE 
  USING (auth.uid() = user_id OR user_identifier IS NOT NULL);

CREATE POLICY "Users can delete their votes" 
  ON public.media_votes 
  FOR DELETE 
  USING (auth.uid() = user_id OR user_identifier IS NOT NULL);

-- RLS Policies for media_reports
CREATE POLICY "Anyone can report media" 
  ON public.media_reports 
  FOR INSERT 
  WITH CHECK (true);

-- Function to update vote counts
CREATE OR REPLACE FUNCTION update_media_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.supporter_media 
    SET votes_count = votes_count + CASE WHEN NEW.vote_type = 'up' THEN 1 ELSE -1 END
    WHERE id = NEW.media_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.supporter_media 
    SET votes_count = votes_count - CASE WHEN OLD.vote_type = 'up' THEN 1 ELSE -1 END
    WHERE id = OLD.media_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE public.supporter_media 
    SET votes_count = votes_count + 
      CASE WHEN NEW.vote_type = 'up' THEN 1 ELSE -1 END -
      CASE WHEN OLD.vote_type = 'up' THEN 1 ELSE -1 END
    WHERE id = NEW.media_id;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers for vote counting
CREATE TRIGGER media_vote_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.media_votes
  FOR EACH ROW EXECUTE FUNCTION update_media_vote_count();

-- Function to update report counts
CREATE OR REPLACE FUNCTION update_media_report_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.supporter_media 
    SET reports_count = reports_count + 1
    WHERE id = NEW.media_id;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for report counting
CREATE TRIGGER media_report_count_trigger
  AFTER INSERT ON public.media_reports
  FOR EACH ROW EXECUTE FUNCTION update_media_report_count();
