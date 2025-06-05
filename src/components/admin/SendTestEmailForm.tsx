import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { sendEmail } from '@/lib/email';
import { useToast } from '@/hooks/use-toast';
import { EmailTemplateSelector, EMAIL_TEMPLATES } from './EmailTemplateSelector';
import { generateEmailTemplate } from '@/lib/emailTemplates';
import { Textarea } from '@/components/ui/textarea';

export const SendTestEmailForm = () => {
  const [email, setEmail] = useState('ashley@topjazzballet.com');
  const [templateId, setTemplateId] = useState('test');
  const [isLoading, setIsLoading] = useState(false);
  const [lastSentStatus, setLastSentStatus] = useState<{success: boolean, message: string} | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  // Get the selected template details
  const selectedTemplate = EMAIL_TEMPLATES.find(t => t.id === templateId);
  const emailContent = generateEmailTemplate(templateId);

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
      // Generate the email content based on the selected template
      const { subject, html } = generateEmailTemplate(templateId, {
        name: 'Test User',
        videoTitle: 'Sample Dance Performance',
        amount: '29.99',
        service: 'Dance Critique',
        transactionId: 'TRX' + Math.floor(Math.random() * 1000000),
        date: new Date().toLocaleDateString(),
        resetLink: 'https://critvid.com/reset-password?token=sample'
      });

      console.log('Sending test email to:', email);
      
      const result = await sendEmail({
        to: email,
        subject,
        html,
        emailType: templateId
      });

      console.log('Email send result:', result);
      
      if (result.success) {
        toast({
          title: 'Success',
          description: `Test email sent to ${email}`,
        });
        setLastSentStatus({
          success: true,
          message: `${selectedTemplate?.name || 'Test email'} successfully sent to ${email}`
        });
      } else {
        throw new Error(typeof result.error === 'string' ? result.error : JSON.stringify(result.error));
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      toast({
        title: 'Error',
        description: `Failed to send test email: ${errorMessage}`,
        variant: 'destructive',
      });
      
      setLastSentStatus({
        success: false,
        message: `Failed to send test email: ${errorMessage}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Send Test Email</CardTitle>
        <CardDescription>
          Select a template and send a test email to verify the email system functionality.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {lastSentStatus && (
          <Alert variant={lastSentStatus.success ? "default" : "destructive"}>
            <AlertTitle>{lastSentStatus.success ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>{lastSentStatus.message}</AlertDescription>
          </Alert>
        )}
        
        <Alert className="bg-blue-50 border-blue-200">
          <AlertTitle className="text-blue-800">SendGrid Integration</AlertTitle>
          <AlertDescription className="text-blue-700">
            <p className="mb-2">This form uses the SendGrid API via the Supabase Edge Function.</p>
            <p>Using environment variables for secure API key storage.</p>
          </AlertDescription>
        </Alert>
        
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
          <label htmlFor="template" className="text-sm font-medium">
            Email Template
          </label>
          <EmailTemplateSelector 
            value={templateId} 
            onChange={(value) => {
              setTemplateId(value);
              setShowPreview(false);
            }} 
          />
          {selectedTemplate && (
            <p className="text-xs text-muted-foreground mt-1">
              {selectedTemplate.description}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
        </div>

        {showPreview && (
          <div className="border rounded-md p-4 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Email Preview</h3>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Subject: {emailContent.subject}
              </span>
            </div>
            <Textarea 
              readOnly 
              value={emailContent.html}
              className="font-mono text-xs h-40"
            />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSendTestEmail} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Sending...' : 'Send Test Email'}
        </Button>
      </CardFooter>
    </Card>
  );
};
