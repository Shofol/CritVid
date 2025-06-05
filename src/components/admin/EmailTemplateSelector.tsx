import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  description: string;
};

const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to CritVid!',
    description: 'Sent to new users after signup'
  },
  {
    id: 'critique_ready',
    name: 'Critique Ready',
    subject: 'Your Critique is Ready!',
    description: 'Notifies users when their critique is available'
  },
  {
    id: 'critique_submitted',
    name: 'Critique Submitted',
    subject: 'Your Critique Has Been Submitted',
    description: 'Confirmation after a critique is submitted'
  },
  {
    id: 'payment_confirmation',
    name: 'Payment Confirmation',
    subject: 'Payment Confirmation',
    description: 'Receipt after successful payment'
  },
  {
    id: 'password_reset',
    name: 'Password Reset',
    subject: 'Reset Your Password',
    description: 'Instructions for resetting password'
  },
  {
    id: 'test',
    name: 'Test Email',
    subject: 'Test Email from CritVid',
    description: 'Simple test email to verify functionality'
  }
];

type EmailTemplateSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

export const EmailTemplateSelector: React.FC<EmailTemplateSelectorProps> = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select an email template" />
      </SelectTrigger>
      <SelectContent>
        {EMAIL_TEMPLATES.map((template) => (
          <SelectItem key={template.id} value={template.id}>
            {template.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export { EMAIL_TEMPLATES };
