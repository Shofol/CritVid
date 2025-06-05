import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { sendEmail } from '@/lib/email';
import { generateEmailTemplate } from '@/lib/emailTemplates';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Template {
  id: string;
  name: string;
  subject: string;
  description: string;
  content?: string;
}

interface SendTestEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: Template | null;
}

const SendTestEmailDialog: React.FC<SendTestEmailDialogProps> = ({
  open,
  onOpenChange,
  template,
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{success: boolean; message: string} | null>(null);
  const { toast } = useToast();

  if (!template) return null;

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
    setStatus(null);

    try {
      // Generate placeholder data for test email
      const testData = {
        name: 'Test User',
        videoTitle: 'Sample Dance Performance',
        amount: '29.99',
        service: 'Dance Critique',
        transactionId: 'TRX' + Math.floor(Math.random() * 1000000),
        date: new Date().toLocaleDateString(),
        resetLink: 'https://critvid.com/reset-password?token=sample'
      };

      // Determine the email content - use custom content if available
      let emailHtml = '';
      let emailSubject = '';
      
      if (template.content) {
        // Replace placeholders in custom content
        emailHtml = template.content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
          return testData[key] || match;
        });
        emailSubject = template.subject;
      } else {
        // Fall back to template generator
        const generated = generateEmailTemplate(template.id, testData);
        emailHtml = generated.html;
        emailSubject = generated.subject;
      }

      const result = await sendEmail({
        to: email,
        subject: emailSubject,
        html: emailHtml,
        emailType: template.id
      });

      if (result.success) {
        setStatus({
          success: true,
          message: `Test email successfully sent to ${email}`
        });
        toast({
          title: 'Success',
          description: `Test email sent to ${email}`,
        });
      } else {
        throw new Error(typeof result.error === 'string' ? result.error : JSON.stringify(result.error));
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      setStatus({
        success: false,
        message: `Failed to send test email: ${errorMessage}`
      });
      
      toast({
        title: 'Error',
        description: `Failed to send test email: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send Test Email</DialogTitle>
          <DialogDescription>
            Send a test email using the "{template.name}" template.
          </DialogDescription>
        </DialogHeader>
        
        {status && (
          <Alert variant={status.success ? "default" : "destructive"}>
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="test-email" className="text-right">
              Email
            </Label>
            <Input
              id="test-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="recipient@example.com"
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-right text-sm text-muted-foreground">
              Template:
            </div>
            <div className="col-span-3 text-sm">
              <span className="font-medium">{template.name}</span>
              <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendTestEmail} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Test Email'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendTestEmailDialog;
