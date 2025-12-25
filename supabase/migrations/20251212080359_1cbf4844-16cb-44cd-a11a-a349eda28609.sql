-- Enable RLS on legal_docs if not already enabled
ALTER TABLE public.legal_docs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to legal documents
CREATE POLICY "Allow public read access to legal documents"
ON public.legal_docs
FOR SELECT
USING (true);