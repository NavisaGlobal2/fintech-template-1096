import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSignedUrl = (filePath: string | null, expiresIn = 3600) => {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!filePath) {
      setSignedUrl(null);
      return;
    }

    const getSignedUrl = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Extract the path from the full URL
        const pathMatch = filePath.match(/\/object\/public\/application-documents\/(.+)$/);
        if (!pathMatch) {
          throw new Error('Invalid file path format');
        }
        
        const path = pathMatch[1];
        
        const { data, error } = await supabase.storage
          .from('application-documents')
          .createSignedUrl(path, expiresIn);

        if (error) {
          // If signed URL fails, fallback to public URL for now
          console.warn('Signed URL creation failed, using public URL:', error);
          setSignedUrl(filePath);
        } else {
          setSignedUrl(data.signedUrl);
        }
      } catch (err) {
        console.error('Error creating signed URL:', err);
        // Fallback to original URL
        setSignedUrl(filePath);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    getSignedUrl();
  }, [filePath, expiresIn]);

  return { signedUrl, loading, error };
};