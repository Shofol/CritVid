import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import RichTextEditor from './RichTextEditor';

interface EmailTemplateEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
}

const EmailTemplateEditor: React.FC<EmailTemplateEditorProps> = ({
  content,
  onChange,
  className,
}) => {
  const [activeTab, setActiveTab] = useState<string>('rich-text');
  const [htmlContent, setHtmlContent] = useState<string>(content || '');
  const [richTextContent, setRichTextContent] = useState<string>(content || '');
  
  // Update both content states when the prop changes
  useEffect(() => {
    setHtmlContent(content || '');
    setRichTextContent(content || '');
  }, [content]);

  // Handle changes from the rich text editor
  const handleRichTextChange = (newContent: string) => {
    setRichTextContent(newContent);
    setHtmlContent(newContent); // Sync with HTML tab
    onChange(newContent);
  };

  // Handle changes from the HTML editor
  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setHtmlContent(newContent);
    setRichTextContent(newContent); // Sync with Rich Text tab
    onChange(newContent);
  };

  return (
    <Tabs
      defaultValue="rich-text"
      value={activeTab}
      onValueChange={setActiveTab}
      className={className}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="rich-text">Rich Text</TabsTrigger>
        <TabsTrigger value="html">HTML</TabsTrigger>
      </TabsList>
      
      <TabsContent value="rich-text" className="mt-4">
        <RichTextEditor 
          value={richTextContent} 
          onChange={handleRichTextChange}
        />
      </TabsContent>
      
      <TabsContent value="html" className="mt-4">
        <Textarea
          value={htmlContent}
          onChange={handleHtmlChange}
          className="min-h-[300px] font-mono text-sm"
          placeholder="Enter HTML content here"
        />
      </TabsContent>
    </Tabs>
  );
};

export default EmailTemplateEditor;
