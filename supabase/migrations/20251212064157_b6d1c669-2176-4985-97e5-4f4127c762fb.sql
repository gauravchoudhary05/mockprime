-- Check if there are any security definer views and fix them
DO $$
DECLARE
    view_record RECORD;
BEGIN
    -- Check for security definer views
    FOR view_record IN 
        SELECT schemaname, viewname 
        FROM pg_views 
        WHERE schemaname = 'public'
    LOOP
        -- Alter each view to use security_invoker
        EXECUTE format('ALTER VIEW %I.%I SET (security_invoker = true)', 
                       view_record.schemaname, view_record.viewname);
    END LOOP;
END $$;