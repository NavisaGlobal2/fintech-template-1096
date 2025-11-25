import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const InlineSignUp = () => {
  const [step, setStep] = useState<'email' | 'password' | 'verify'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const isPasswordValid = password.length >= 8 && passwordStrength >= 2;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    setStep('password');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters with letters and numbers.",
        variant: "destructive",
      });
      return;
    }

    if (!acceptTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUp(email, password);
      
      if (error) {
        if (error.message.includes('already registered')) {
          toast({
            title: "Account Exists",
            description: "This email is already registered. Try signing in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign Up Failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        setEmailSent(true);
        setStep('verify');
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verify' || emailSent) {
    return (
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sageLight mb-2">
          <Mail className="w-8 h-8 text-sageDark" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">Check Your Email</h3>
        <p className="text-sm text-muted-foreground">
          We've sent a verification link to <strong>{email}</strong>. 
          Click the link in the email to verify your account and start tracking your application.
        </p>
        <p className="text-xs text-muted-foreground">
          Didn't receive it? Check your spam folder or{' '}
          <button 
            onClick={() => setStep('email')}
            className="text-foreground underline hover:no-underline"
          >
            try again
          </button>
        </p>
      </div>
    );
  }

  if (step === 'email') {
    return (
      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-email" className="text-sm font-medium">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="signup-email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12 rounded-full"
              required
            />
          </div>
        </div>
        <Button
          type="submit"
          size="lg"
          className="w-full rounded-full"
        >
          Continue
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          Step 1 of 2
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={handlePasswordSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-password" className="text-sm font-medium">
          Create Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="signup-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 h-12 rounded-full"
            required
          />
        </div>
        {password && (
          <div className="space-y-2">
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i < passwordStrength 
                      ? passwordStrength <= 1 
                        ? 'bg-destructive' 
                        : passwordStrength === 2 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <div className="space-y-1 text-xs">
              <div className={`flex items-center gap-2 ${password.length >= 8 ? 'text-green-600' : 'text-muted-foreground'}`}>
                {password.length >= 8 ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                At least 8 characters
              </div>
              <div className={`flex items-center gap-2 ${/[a-zA-Z]/.test(password) && /[0-9]/.test(password) ? 'text-green-600' : 'text-muted-foreground'}`}>
                {/[a-zA-Z]/.test(password) && /[0-9]/.test(password) ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                Letters and numbers
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-start gap-2">
        <Checkbox
          id="terms"
          checked={acceptTerms}
          onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
          className="mt-1"
        />
        <Label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
          I agree to the{' '}
          <a href="#" className="text-foreground underline hover:no-underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-foreground underline hover:no-underline">
            Privacy Policy
          </a>
        </Label>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full rounded-full"
        disabled={loading || !isPasswordValid || !acceptTerms}
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <button
          type="button"
          onClick={() => setStep('email')}
          className="text-foreground underline hover:no-underline"
        >
          Back
        </button>
        <span>Step 2 of 2</span>
      </div>
    </form>
  );
};

export default InlineSignUp;
