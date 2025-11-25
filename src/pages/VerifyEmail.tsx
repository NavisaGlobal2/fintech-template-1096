import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const type = searchParams.get('type');

    if (token && type === 'email') {
      verifyEmail(token);
    } else {
      setStatus('error');
      setMessage('Invalid verification link.');
    }
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email',
      });

      if (error) {
        setStatus('error');
        setMessage(error.message);
      } else {
        setStatus('success');
        setMessage('Your email has been verified successfully!');
        
        // Redirect to account page after 2 seconds
        setTimeout(() => {
          navigate('/my-account');
        }, 2000);
      }
    } catch (err) {
      setStatus('error');
      setMessage('An unexpected error occurred.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-6">
        {status === 'verifying' && (
          <>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sageLight animate-pulse">
              <Mail className="w-10 h-10 text-sageDark" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Verifying Email</h1>
            <p className="text-muted-foreground">Please wait while we verify your email address...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Email Verified!</h1>
            <p className="text-muted-foreground">{message}</p>
            <p className="text-sm text-muted-foreground">Redirecting to your account...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10">
              <XCircle className="w-10 h-10 text-destructive" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Verification Failed</h1>
            <p className="text-muted-foreground">{message}</p>
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/')}
                className="w-full rounded-full"
              >
                Go to Home
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  toast({
                    title: "Resend Email",
                    description: "Please sign in again to receive a new verification email.",
                  });
                  navigate('/');
                }}
                className="w-full rounded-full"
              >
                Resend Verification Email
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
