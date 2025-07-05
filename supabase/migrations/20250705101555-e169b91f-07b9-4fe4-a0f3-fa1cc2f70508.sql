-- Fix broken cron jobs for notification system
-- Remove all existing problematic cron jobs
DO $$
BEGIN
    -- Unschedule all existing notification-related cron jobs
    BEGIN
        PERFORM cron.unschedule('fetch-social-media-posts');
        RAISE NOTICE 'Unscheduled fetch-social-media-posts';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'No fetch-social-media-posts job to unschedule';
    END;
    
    BEGIN
        PERFORM cron.unschedule('fetch-new-articles-for-notifications');
        RAISE NOTICE 'Unscheduled fetch-new-articles-for-notifications';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'No fetch-new-articles-for-notifications job to unschedule';
    END;
    
    BEGIN
        PERFORM cron.unschedule('notification-scheduler');
        RAISE NOTICE 'Unscheduled notification-scheduler';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'No notification-scheduler job to unschedule';
    END;
END $$;

-- Create new working cron job with CORRECT JSON syntax
SELECT cron.schedule(
    'article-notifications',
    '*/30 * * * *', -- every 30 minutes
    $$
    SELECT net.http_post(
        url := 'https://vweraucnekeucrryqjlo.supabase.co/functions/v1/fetch-articles',
        headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3ZXJhdWNuZWtldWNycnlxamxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMzI3OTMsImV4cCI6MjA2NjcwODc5M30.Cy65kblAI4P6GP1ANUHFNdsLma-Hb1lCp5g6w5hRGHc"}'::jsonb,
        body := '{"mode": "notifications", "perPage": 20}'::jsonb
    ) as request_id;
    $$
);

-- Verify the cron job was created successfully
DO $$
DECLARE
    job_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO job_count 
    FROM cron.job 
    WHERE jobname = 'article-notifications';
    
    RAISE NOTICE 'Article notifications cron job created: % jobs found', job_count;
    
    IF job_count > 0 THEN
        RAISE NOTICE 'SUCCESS: Article notification system is now active';
    ELSE
        RAISE NOTICE 'WARNING: Article notification cron job was not created successfully';
    END IF;
END $$;