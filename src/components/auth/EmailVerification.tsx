import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';

interface EmailVerificationProps {
  email: string;
  onSuccess?: () => void;
}

export function EmailVerification({ email, onSuccess }: EmailVerificationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleResendVerification = async () => {
    try {
      setIsLoading(true);
      setStatus('idle');
      setErrorMessage('');

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        throw error;
      }

      setStatus('success');
      
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Failed to resend verification email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>
          We've sent a verification link to <strong>{email}</strong>. Please check your inbox and click the link to verify your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'success' && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle>Email Sent</AlertTitle>
            <AlertDescription>
              Verification email has been resent successfully. Please check your inbox.
            </AlertDescription>
          </Alert>
        )}

        {status === 'error' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className="mt-4 text-sm text-gray-600">
          <p>Didn't receive the email? Check your spam folder or request a new verification email.</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.location.href = '/login'}>
          Back to Login
        </Button>
        <Button onClick={handleResendVerification} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Resend Verification'}
        </Button>
      </CardFooter>
    </Card>
  );
}
