import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  hasSelectedStyle: boolean | null;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error: any }>;
  checkUserStyle: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSelectedStyle, setHasSelectedStyle] = useState<boolean | null>(null);

  const checkUserStyle = async (userId?: string): Promise<boolean> => {
    const id = userId || user?.id;
    if (!id) {
      console.log('No user ID available for style check');
      return false;
    }

    try {
      console.log('Checking style for user:', id);
      const { data, error } = await supabase
        .from('user_styles')
        .select('selected_style')
        .eq('user_id', id)
        .single();

      console.log('Style check result:', { data, error });
      const styleExists = !error && !!data?.selected_style;
      setHasSelectedStyle(styleExists);
      console.log('Style exists:', styleExists);
      return styleExists;
    } catch (error) {
      console.error('Error checking user style:', error);
      setHasSelectedStyle(false);
      return false;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check if user has selected a style after state update
          setTimeout(() => {
            checkUserStyle(session.user.id);
          }, 0);
        } else {
          setHasSelectedStyle(null);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          checkUserStyle(session.user.id);
        }, 0);
      } else {
        setHasSelectedStyle(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    const redirectUrl = `${window.location.origin}/plans`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: userData
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/plans`
      }
    });
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    hasSelectedStyle,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    checkUserStyle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};