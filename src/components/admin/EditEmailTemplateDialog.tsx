import React, { useState, useEffect } from 'react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/lib/supabase';
import EmailTemplateEditor from './EmailTemplateEditor';

interface Template {
  id: string;
  name: string;
  subject: string;
  description: string;
  lastModified: string;
  category: string;
  content?: string;
}

interface EditEmailTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: Template | null;
  onSave: (template: Template) => void;
}

const EditEmailTemplateDialog: React.FC<EditEmailTemplateDialogProps> = ({
  open,
  onOpenChange,
  template,
  onSave,
}) => {
  const [editedTemplate, setEditedTemplate] = useState<Template | null>(template);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Update local state when the template prop changes
  useEffect(() => {
    if (template) {
      // If template doesn't have content, add a default one
      const templateWithContent = {
        ...template,
        content: template.content || generateDefaultContent(template)
      };
      setEditedTemplate(templateWithContent);
    } else {
      setEditedTemplate(null);
    }
  }, [template]);

  if (!editedTemplate) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedTemplate(prev => {
      if (!prev) return null;
      return { ...prev, [name]: value };
    });
  };

  const handleContentChange = (content: string) => {
    setEditedTemplate(prev => {
      if (!prev) return null;
      return { ...prev, content };
    });
  };

  const handleSave = async () => {
    if (!editedTemplate) return;
    
    setIsLoading(true);
    try {
      // Update the last modified date
      const updatedTemplate = {
        ...editedTemplate,
        lastModified: new Date().toISOString().split('T')[0]
      };
      
      // Save to database if we have email_templates table
      try {
        const { error } = await supabase
          .from('email_templates')
          .upsert({
            template_id: updatedTemplate.id,
            name: updatedTemplate.name,
            subject: updatedTemplate.subject,
            description: updatedTemplate.description,
            category: updatedTemplate.category,
            content: updatedTemplate.content,
            last_modified: new Date().toISOString()
          });
          
        if (error) {
          console.error('Error saving template to database:', error);
          // Continue with in-memory update even if DB update fails
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue with in-memory update
      }
      
      onSave(updatedTemplate);
      onOpenChange(false);
      
      toast({
        title: "Template updated",
        description: `${updatedTemplate.name} has been successfully updated.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  function generateDefaultContent(template: Template) {
    return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #4f46e5;">${template.name}</h1>
  <p>Hello {{name}},</p>
  <p>This is a sample template for ${template.name.toLowerCase()}.</p>
  <p>You can edit this content to customize your email template.</p>
  <p>The CritVid Team</p>
</div>`;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Email Template</DialogTitle>
          <DialogDescription>
            Make changes to the email template. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={editedTemplate.name}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Subject
              </Label>
              <Input
                id="subject"
                name="subject"
                value={editedTemplate.subject}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                value={editedTemplate.description}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Input
                id="category"
                name="category"
                value={editedTemplate.category}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <Label htmlFor="content" className="text-right self-start pt-2">
                Content
              </Label>
              <div className="col-span-3">
                <EmailTemplateEditor
                  content={editedTemplate.content || ''}
                  onChange={handleContentChange}
                />
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditEmailTemplateDialog;
