
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UnderwritingData {
  applications: any[];
  assessments: any[];
  offers: any[];
  loading: boolean;
  error: string | null;
}

export const useUnderwriting = () => {
  const { user } = useAuth();
  const [data, setData] = useState<UnderwritingData>({
    applications: [],
    assessments: [],
    offers: [],
    loading: true,
    error: null
  });

  const loadData = async () => {
    if (!user?.id) return;

    setData(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Load all data in parallel
      const [appsResult, assessmentsResult, offersResult] = await Promise.all([
        supabase
          .from('loan_applications')
          .select('*')
          .eq('user_id', user.id)
          .in('status', ['submitted', 'under-review']),
        
        supabase
          .from('underwriting_assessments')
          .select('*')
          .eq('user_id', user.id),
        
        supabase
          .from('loan_offers')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
      ]);

      const errors = [appsResult.error, assessmentsResult.error, offersResult.error].filter(Boolean);
      
      if (errors.length > 0) {
        throw new Error(`Failed to load data: ${errors.map(e => e?.message).join(', ')}`);
      }

      setData({
        applications: appsResult.data || [],
        assessments: assessmentsResult.data || [],
        offers: offersResult.data || [],
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error loading underwriting data:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }));
    }
  };

  const updateOfferStatus = async (offerId: string, status: 'accepted' | 'declined') => {
    try {
      const updateData = {
        status,
        ...(status === 'accepted' ? { accepted_at: new Date().toISOString() } : {}),
        ...(status === 'declined' ? { declined_at: new Date().toISOString() } : {})
      };

      const { error } = await supabase
        .from('loan_offers')
        .update(updateData)
        .eq('id', offerId)
        .eq('user_id', user?.id);

      if (error) throw error;
      
      // Reload data to reflect changes
      await loadData();
      return true;
    } catch (error) {
      console.error('Error updating offer status:', error);
      return false;
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  return {
    ...data,
    refetch: loadData,
    updateOfferStatus
  };
};
