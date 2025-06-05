import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import FAQSection from './FAQSection';

const HelpContent: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Help Center</h1>
      
      <div className="grid gap-6">
        <FAQSection />
        
        <Card>
          <CardHeader>
            <CardTitle>Using CritVid</CardTitle>
            <CardDescription>Quick help for common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I upload a video?</AccordionTrigger>
                <AccordionContent>
                  Navigate to the Upload Video page from the sidebar menu. You can drag and drop your video file 
                  or click to browse your files. Add a title and description, then click Submit.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How does the video critique process work?</AccordionTrigger>
                <AccordionContent>
                  After uploading a video, it will be assigned to an adjudicator who will review it and provide 
                  feedback. You'll receive a notification when your critique is ready to view.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>How do I use the Video Editor?</AccordionTrigger>
                <AccordionContent>
                  The Video Editor allows you to add annotations, timestamps, and notes to videos. Access it from 
                  the sidebar menu, then use the drawing tools to mark specific movements or techniques.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Need More Help?</CardTitle>
            <CardDescription>Contact our support team</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">If you couldn't find the answer to your question, please contact our support team:</p>
            <p className="font-medium">Email: support@critvid.com</p>
            <p className="font-medium">Phone: (555) 123-4567</p>
            <p className="mt-4">Our support hours are Monday-Friday, 9am-5pm EST.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpContent;