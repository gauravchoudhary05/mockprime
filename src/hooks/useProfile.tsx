import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './useAuth';

export interface UserProfile {
  id: number;
  user_id: string;
  email: string | null;
  full_name: string | null;
  is_pro: boolean;
  plan_name: string;
  pro_until: string | null;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        // Profile might not exist yet
        setProfile({
          id: 0,
          user_id: user.id,
          email: user.email || null,
          full_name: user.user_metadata?.full_name || null,
          is_pro: false,
          plan_name: 'Free',
          pro_until: null,
        });
      } else {
        setProfile(data as UserProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const refreshProfile = () => {
    setLoading(true);
    fetchProfile();
  };

  const isPremium = profile?.is_pro === true;

  return { profile, loading, isPremium, refreshProfile };
}
