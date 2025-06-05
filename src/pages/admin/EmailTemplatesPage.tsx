import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import EmailTemplatePreviewDialog from '@/components/admin/EmailTemplatePreviewDialog';
import EditEmailTemplateDialog from '@/components/admin/EditEmailTemplateDialog';
import SendTestEmailDialog from '@/components/admin/SendTestEmailDialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface Template {
  id: string;
  name: string;
  subject: string;
  description: string;
  lastModified: string;
  category: string;
  content?: string;
}

const EmailTemplatesPage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [sendTestDialogOpen, setSendTestDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // State to manage templates (in a real app, this would come from an API)
  const [templates, setTemplates] = useState({
    system: [...systemTemplates],
    custom: [...customTemplates],
    drafts: [...draftTemplates]
  });

  // Load templates from the database if available
  useEffect(() => {
    const loadTemplatesFromDB = async () => {
      try {
        const { data, error } = await supabase
          .from('email_templates')
          .select('*');

        if (error) {
          console.error('Error loading templates:', error);
          return;
        }

        if (data && data.length > 0) {
          // Transform database records to our template format
          const dbTemplates = data.map(record => ({
            id: record.template_id,
            name: record.name,
            subject: record.subject,
            description: record.description,
            category: record.category || 'Uncategorized', // Add default category if undefined
            lastModified: record.last_modified ? new Date(record.last_modified).toLocaleDateString() : 'Unknown date',
            content: record.content
          }));

          // Merge with our static templates, preferring DB versions
          const mergedTemplates = {
            system: [...systemTemplates],
            custom: [...customTemplates],
            drafts: [...draftTemplates]
          };

          // Replace templates with DB versions where available
          dbTemplates.forEach(dbTemplate => {
            // Ensure category exists before using toLowerCase
            const category = dbTemplate.category ? dbTemplate.category.toLowerCase() : 'uncategorized';
            if (category === 'onboarding' || category === 'account') {
              mergedTemplates.system = mergedTemplates.system.map(t => 
                t.id === dbTemplate.id ? dbTemplate : t
              );
            } else if (dbTemplate.lastModified.includes('Draft')) {
              mergedTemplates.drafts = mergedTemplates.drafts.map(t => 
                t.id === dbTemplate.id ? dbTemplate : t
              );
            } else {
              mergedTemplates.custom = mergedTemplates.custom.map(t => 
                t.id === dbTemplate.id ? dbTemplate : t
              );
            }
          });

          setTemplates(mergedTemplates);
        }
      } catch (error) {
        console.error('Error in loadTemplatesFromDB:', error);
      }
    };

    loadTemplatesFromDB();
  }, []);

  const handleSaveTemplate = (updatedTemplate: Template) => {
    // Update the template in the appropriate category
    // Ensure category exists before using toLowerCase
    const category = updatedTemplate.category ? updatedTemplate.category.toLowerCase() : 'uncategorized';
    if (category === 'onboarding' || category === 'account') {
      setTemplates(prev => ({
        ...prev,
        system: prev.system.map(t => 
          t.id === updatedTemplate.id ? updatedTemplate : t
        )
      }));
    } else if (updatedTemplate.lastModified.includes('Draft')) {
      setTemplates(prev => ({
        ...prev,
        drafts: prev.drafts.map(t => 
          t.id === updatedTemplate.id ? updatedTemplate : t
        )
      }));
    } else {
      setTemplates(prev => ({
        ...prev,
        custom: prev.custom.map(t => 
          t.id === updatedTemplate.id ? updatedTemplate : t
        )
      }));
    }
    
    toast({
      title: "Template updated",
      description: `${updatedTemplate.name} has been updated successfully.`
    });
  };

  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Email Templates</h1>
          <Button>Create New Template</Button>
        </div>

        <Tabs defaultValue="system">
          <TabsList className="mb-4">
            <TabsTrigger value="system">System Templates</TabsTrigger>
            <TabsTrigger value="custom">Custom Templates</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>

          <TabsContent value="system">
            <div className="grid gap-4">
              {templates.system.map((template) => (
                <TemplateCard 
                  key={template.id} 
                  template={template} 
                  isSystem 
                  onPreview={() => {
                    setSelectedTemplate(template);
                    setPreviewDialogOpen(true);
                  }}
                  onEdit={() => {
                    setSelectedTemplate(template);
                    setEditDialogOpen(true);
                  }}
                  onSendTest={() => {
                    setSelectedTemplate(template);
                    setSendTestDialogOpen(true);
                  }}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom">
            <div className="grid gap-4">
              {templates.custom.map((template) => (
                <TemplateCard 
                  key={template.id} 
                  template={template}
                  onPreview={() => {
                    setSelectedTemplate(template);
                    setPreviewDialogOpen(true);
                  }}
                  onEdit={() => {
                    setSelectedTemplate(template);
                    setEditDialogOpen(true);
                  }}
                  onSendTest={() => {
                    setSelectedTemplate(template);
                    setSendTestDialogOpen(true);
                  }}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="drafts">
            <div className="grid gap-4">
              {templates.drafts.map((template) => (
                <TemplateCard 
                  key={template.id} 
                  template={template} 
                  isDraft
                  onPreview={() => {
                    setSelectedTemplate(template);
                    setPreviewDialogOpen(true);
                  }}
                  onEdit={() => {
                    setSelectedTemplate(template);
                    setEditDialogOpen(true);
                  }}
                  onSendTest={() => {
                    setSelectedTemplate(template);
                    setSendTestDialogOpen(true);
                  }}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <EmailTemplatePreviewDialog 
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
        template={selectedTemplate}
      />
      
      <EditEmailTemplateDialog 
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        template={selectedTemplate}
        onSave={handleSaveTemplate}
      />
      
      <SendTestEmailDialog 
        open={sendTestDialogOpen}
        onOpenChange={setSendTestDialogOpen}
        template={selectedTemplate}
      />
    </AppLayout>
  );
};

interface TemplateCardProps {
  template: Template;
  isSystem?: boolean;
  isDraft?: boolean;
  onPreview: () => void;
  onEdit: () => void;
  onSendTest: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ 
  template, 
  isSystem, 
  isDraft,
  onPreview,
  onEdit,
  onSendTest
}) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg">{template.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{template.description}</p>
          <div className="flex gap-2 mt-2">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">{template.category || 'Uncategorized'}</span>
            {isSystem && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">System</span>}
            {isDraft && <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">Draft</span>}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onPreview}>Preview</Button>
          <Button variant="outline" size="sm" onClick={onEdit}>Edit</Button>
          <Button variant="outline" size="sm" onClick={onSendTest}>Send Test</Button>
          {!isSystem && <Button variant="outline" size="sm" className="text-red-500">Delete</Button>}
        </div>
      </div>
      <div className="mt-3 text-sm text-gray-500">
        Last modified: {template.lastModified}
      </div>
    </Card>
  );
};

const systemTemplates: Template[] = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to Dance Critique!',
    description: 'Sent to new users after registration',
    lastModified: 'System Template',
    category: 'Onboarding'
  },
  {
    id: 'password_reset',
    name: 'Password Reset',
    subject: 'Reset Your Password',
    description: 'Sent when a user requests a password reset',
    lastModified: 'System Template',
    category: 'Account'
  },
  {
    id: 'email_verification',
    name: 'Email Verification',
    subject: 'Verify Your Email Address',
    description: 'Sent to verify user email addresses',
    lastModified: 'System Template',
    category: 'Account'
  }
];

const customTemplates: Template[] = [
  {
    id: 'newsletter',
    name: 'Monthly Newsletter',
    subject: 'Dance Critique Monthly Update',
    description: 'Monthly newsletter with platform updates',
    lastModified: '2023-11-15',
    category: 'Marketing'
  },
  {
    id: 'critique_ready',
    name: 'New Critique Available',
    subject: 'Your Dance Critique is Ready!',
    description: 'Notification when a new critique is available',
    lastModified: '2023-12-01',
    category: 'Notifications'
  }
];

const draftTemplates: Template[] = [
  {
    id: 'holiday_special',
    name: 'Holiday Special',
    subject: 'Holiday Special Offer',
    description: 'Promotional email for holiday season',
    lastModified: '2023-12-10 (Draft)',
    category: 'Marketing'
  }
];

export default EmailTemplatesPage;
