
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state');
    
    // Get initial session
    const getSession = async () => {
      try {
        console.log('AuthProvider: Getting initial session');
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('AuthProvider: Error getting session:', error);
        } else {
          console.log('AuthProvider: Initial session:', session);
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('AuthProvider: Session fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider: Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      console.log('AuthProvider: Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      console.log('AuthProvider: Attempting sign up for:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });
      
      console.log('AuthProvider: Sign up result:', { data, error });
      return { error };
    } catch (error) {
      console.error('AuthProvider: Sign up error:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('AuthProvider: Attempting sign in for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('AuthProvider: Sign in result:', { data, error });
      return { error };
    } catch (error) {
      console.error('AuthProvider: Sign in error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('AuthProvider: Attempting sign out');
      const { error } = await supabase.auth.signOut();
      console.log('AuthProvider: Sign out result:', { error });
      return { error };
    } catch (error) {
      console.error('AuthProvider: Sign out error:', error);
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  console.log('AuthProvider: Rendering with value:', { user: !!user, session: !!session, loading });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
