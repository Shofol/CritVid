import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FAQAccordion from './FAQAccordion';
import FAQAccordionPart2 from './FAQAccordionPart2';

const FAQSection: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>🧠 Frequently Asked Questions (FAQ)</CardTitle>
        <CardDescription>Find answers to common questions about CritVid</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <FAQAccordion />
          <FAQAccordionPart2 />
        </div>
      </CardContent>
    </Card>
  );
};

export default FAQSection;