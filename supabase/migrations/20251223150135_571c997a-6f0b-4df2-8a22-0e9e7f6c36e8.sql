-- Enable RLS on legal_docs table
ALTER TABLE public.legal_docs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to legal documents
CREATE POLICY "Legal docs are publicly readable"
ON public.legal_docs
FOR SELECT
USING (true);

-- Only admins can insert legal documents
CREATE POLICY "Only admins can insert legal docs"
ON public.legal_docs
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update legal documents
CREATE POLICY "Only admins can update legal docs"
ON public.legal_docs
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete legal documents
CREATE POLICY "Only admins can delete legal docs"
ON public.legal_docs
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));