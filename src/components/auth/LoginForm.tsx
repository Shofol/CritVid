import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { signInWithEmail, signUpWithGoogle } from '@/lib/auth';

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Get the return URL from location state
  const from = location.state?.from?.pathname || '/dashboard';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsGoogleLoading(true);

    try {
      // Store the return URL in sessionStorage for OAuth callback
      sessionStorage.setItem('authReturnUrl', from);
      
      // Using the same Google signup function since it handles both signup and login
      const { success, error } = await signUpWithGoogle();

      if (!success || error) {
        throw error || new Error('Failed to sign in with Google');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during Google sign in');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      // Sign in with Supabase
      const { success, error } = await signInWithEmail(
        formData.email,
        formData.password
      );

      if (!success || error) {
        throw error || new Error('Failed to sign in');
      }

      // Navigate to return URL or dashboard
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Google Login Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center py-6"
        onClick={handleGoogleLogin}
        disabled={isGoogleLoading || isLoading}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className="mr-2">
          <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
        </svg>
        {isGoogleLoading ? 'Signing in with Google...' : 'Continue with Google'}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>

      {/* Email Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            disabled={isLoading || isGoogleLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            disabled={isLoading || isGoogleLoading}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-primary hover:underline"
            >
              Forgot your password?
            </button>
          </p>
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-primary hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </form>
    </div>
  );
} 