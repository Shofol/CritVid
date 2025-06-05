import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { generateEmailTemplate } from '@/lib/emailTemplates';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Template {
  id: string;
  name: string;
  subject: string;
  description: string;
  content?: string;
}

interface EmailTemplatePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: Template | null;
}

const EmailTemplatePreviewDialog: React.FC<EmailTemplatePreviewDialogProps> = ({
  open,
  onOpenChange,
  template,
}) => {
  if (!template) return null;

  // Generate preview data with placeholder values
  const previewData = {
    name: 'Jane Doe',
    videoTitle: 'Ballet Performance - Swan Lake',
    amount: '49.99',
    service: 'Professional Dance Critique',
    transactionId: 'TRX' + Math.floor(Math.random() * 1000000),
    date: new Date().toLocaleDateString(),
    resetLink: 'https://critvid.com/reset-password?token=sample'
  };

  // If the template has custom content, use it; otherwise fall back to the template generator
  let previewHtml = '';
  let subject = '';
  
  if (template.content) {
    // Replace placeholders in custom content
    previewHtml = template.content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return previewData[key] || match;
    });
    subject = template.subject;
  } else {
    // Use the template generator as fallback
    const generated = generateEmailTemplate(template.id, previewData);
    previewHtml = generated.html;
    subject = generated.subject;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{template.name} Preview</DialogTitle>
          <DialogDescription>
            Subject: <span className="font-medium">{subject}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="border rounded-md p-4 mt-4 bg-white">
          <ScrollArea className="h-[50vh]">
            <div 
              className="email-preview" 
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailTemplatePreviewDialog;
