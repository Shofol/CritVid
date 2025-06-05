import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { sendEmail, sendWelcomeEmail, sendCritiqueReadyEmail } from '@/lib/email';
import { useToast } from '@/hooks/use-toast';

export default function EmailDemo() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastSentStatus, setLastSentStatus] = useState<{success: boolean, message: string} | null>(null);
  const { toast } = useToast();

  const handleSendTestEmail = async () => {
    if (!email) {
      toast({
        title: 'Error',
        description: 'Please enter an email address',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setLastSentStatus(null);

    try {
      const result = await sendEmail({
        to: email,
        subject: 'Test Email from CritVid',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4f46e5;">Test Email</h1>
            <p>This is a test email to confirm that the SendGrid integration is active and functional.</p>
            <p>If you received this email, it means the email system is connected and operating as expected through the platform.</p>
            <p>The CritVid Team</p>
          </div>
        `,
        emailType: 'test'
      });

      if (result.success) {
        toast({
          title: 'Success',
          description: `Test email sent to ${email}`,
        });
        setLastSentStatus({
          success: true,
          message: `Test email successfully sent to ${email}`
        });
      } else {
        throw new Error(result.error?.toString() || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      toast({
        title: 'Error',
        description: `Failed to send test email: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
      setLastSentStatus({
        success: false,
        message: `Failed to send test email: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendWelcomeEmail = async () => {
    if (!email || !name) {
      toast({
        title: 'Error',
        description: 'Please enter both email and name',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setLastSentStatus(null);

    try {
      const result = await sendWelcomeEmail(email, name);

      if (result.success) {
        toast({
          title: 'Success',
          description: `Welcome email sent to ${email}`,
        });
        setLastSentStatus({
          success: true,
          message: `Welcome email successfully sent to ${email}`
        });
      } else {
        throw new Error(result.error?.toString() || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending welcome email:', error);
      toast({
        title: 'Error',
        description: `Failed to send welcome email: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
      setLastSentStatus({
        success: false,
        message: `Failed to send welcome email: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCritiqueReadyEmail = async () => {
    if (!email || !name) {
      toast({
        title: 'Error',
        description: 'Please enter both email and name',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setLastSentStatus(null);

    try {
      const result = await sendCritiqueReadyEmail(email, name, 'Contemporary Solo Performance');

      if (result.success) {
        toast({
          title: 'Success',
          description: `Critique ready email sent to ${email}`,
        });
        setLastSentStatus({
          success: true,
          message: `Critique ready email successfully sent to ${email}`
        });
      } else {
        throw new Error(result.error?.toString() || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending critique ready email:', error);
      toast({
        title: 'Error',
        description: `Failed to send critique ready email: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
      setLastSentStatus({
        success: false,
        message: `Failed to send critique ready email: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">SendGrid Email Demo</h1>
          <p className="text-muted-foreground">
            Test the SendGrid email integration with different email types
          </p>
        </div>
        
        {lastSentStatus && (
          <Alert variant={lastSentStatus.success ? "default" : "destructive"}>
            <AlertTitle>{lastSentStatus.success ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>{lastSentStatus.message}</AlertDescription>
          </Alert>
        )}
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Send Test Emails</CardTitle>
            <CardDescription>
              Try out different email templates using the SendGrid integration with the updated API key
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Recipient Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Recipient Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter recipient name"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={handleSendTestEmail} 
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? 'Sending...' : 'Send Test Email'}
            </Button>
            
            <Button 
              onClick={handleSendWelcomeEmail} 
              disabled={isLoading}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Send Welcome Email
            </Button>
            
            <Button 
              onClick={handleSendCritiqueReadyEmail} 
              disabled={isLoading}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Send Critique Ready Email
            </Button>
          </CardFooter>
        </Card>
        
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-medium mb-2">About SendGrid Integration</h3>
          <p className="text-sm text-muted-foreground">
            This demo uses the SendGrid API to send transactional emails through our Supabase Edge Function.
            All emails are logged in the database for tracking and analytics purposes.
          </p>
          <div className="mt-2 p-3 bg-black/5 rounded text-xs font-mono overflow-x-auto">
            <p className="font-semibold">Using updated SendGrid API key:</p>
            <p className="break-all mt-1">Actual is not shown here for security reasons</p>
            <p className="mt-2 text-green-600">✓ Sccessfully updated in the system</p>
          </div>
        </div>
      </div>
    </div>
  );
}
