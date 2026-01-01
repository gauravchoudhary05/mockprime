// src/hooks/useProfile.tsx - 100% PRODUCTION READY + .maybeSingle() + REFERRAL + PREMIUM!
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';  // ✅ FIXED IMPORT!

export interface UserProfile {
  id: number;
  user_id: string;
  email: string | null;
  full_name: string | null;
  referral_code: string | null;  // 🔥 REFERRAL SUPPORT
  is_pro: boolean;
  is_premium: boolean;           // ✅ BOTH PREMIUM FIELDS
  plan_name: string;
  pro_until: string | null;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // 🔥 STEP 1: Get referral from user_metadata FIRST
      const referralCode = user.user_metadata?.referral_code ||
                          localStorage.getItem('referral_code') || null;
      console.log('🔍 Profile referral code:', referralCode);

      // STEP 2: Fetch profile - .maybeSingle() = NO 406 CRASH!
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();  // ✅ FIXED! Handles 0 or 1 row

      let finalProfile: UserProfile;

      if (data && !error) {
        // Profile exists ✅ - Sync BOTH premium fields
        const isPremiumUser = data.is_pro === true || data.is_premium === true;
        finalProfile = {
          ...data,
          referral_code: referralCode || data.referral_code || null,
          is_pro: isPremiumUser,
          is_premium: isPremiumUser,
        } as UserProfile;
        console.log('✅ Profile loaded from DB:', finalProfile.user_id, 'Premium:', isPremiumUser);
      } else {
        // No profile → Create default + referral
        console.log('🔄 Creating default profile (no row found)');
        finalProfile = {
          id: 0,
          user_id: user.id,
          email: user.email || null,
          full_name: user.user_metadata?.full_name || null,
          referral_code: referralCode,
          is_pro: false,
          is_premium: false,
          plan_name: 'Free',
          pro_until: null,
        };

        // Upsert to DB
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert(finalProfile);

        if (upsertError) {
          console.warn('⚠️ Upsert failed:', upsertError.message);
        } else {
          console.log('✅ Profile created + referral saved');
        }
      }

      setProfile(finalProfile);

    } catch (error) {
      console.error('💥 Profile error:', error);
      // FAILSAFE profile
      const fallbackProfile: UserProfile = {
        id: 0,
        user_id: user.id || '',
        email: user.email || null,
        full_name: user.user_metadata?.full_name || null,
        referral_code: null,
        is_pro: false,
        is_premium: false,
        plan_name: 'Free',
        pro_until: null,
      };
      setProfile(fallbackProfile);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const refreshProfile = useCallback(() => {
    setLoading(true);
    fetchProfile();
  }, [fetchProfile]);

  // ✅ CHECKS BOTH PREMIUM FIELDS
  const isPremium = profile?.is_pro === true || profile?.is_premium === true;

  return {
    profile,
    loading,
    isPremium,
    refreshProfile
  };
}
