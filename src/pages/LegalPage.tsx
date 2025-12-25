import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ArrowLeft } from 'lucide-react';

interface LegalDoc {
  title: string;
  content: string;
  updated_at: string;
}

export default function LegalPage() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  const [doc, setDoc] = useState<LegalDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true);
      setError(null);

      let titleToFetch = '';
      if (type === 'privacy') {
        titleToFetch = 'Privacy Policy';
      } else if (type === 'terms') {
        titleToFetch = 'Terms and Conditions';
      } else {
        setError('Invalid document type. Please use ?type=privacy or ?type=terms');
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('legal_docs')
        .select('title, content, updated_at')
        .eq('title', titleToFetch)
        .single();

      if (fetchError || !data) {
        setError('Document not found. Please try again later.');
        setLoading(false);
        return;
      }

      setDoc(data);
      setLoading(false);
    };

    fetchDocument();
  }, [type]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <div className="max-w-3xl mx-auto">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading document...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-destructive text-lg">{error}</p>
              <Link 
                to="/dashboard" 
                className="mt-4 inline-block text-primary hover:underline"
              >
                Return to Dashboard
              </Link>
            </div>
          ) : doc ? (
            <div className="animate-fade-in">
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">{doc.title}</h1>
              <p className="text-sm text-muted-foreground mb-8">
                Last updated: {formatDate(doc.updated_at)}
              </p>
              <div 
                className="prose prose-sm md:prose-base max-w-none text-foreground"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {doc.content}
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
