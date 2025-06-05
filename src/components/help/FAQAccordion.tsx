import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQAccordion: React.FC = () => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="what-is-critvid">
        <AccordionTrigger>1. What is CritVid?</AccordionTrigger>
        <AccordionContent>
          CritVid is an online platform where dancers upload videos of their routines and receive personalized critiques from professional adjudicators. It includes voice-over feedback, video annotations, and even AI-generated training suggestions.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="who-is-this-for">
        <AccordionTrigger>2. Who is this for?</AccordionTrigger>
        <AccordionContent>
          <p>CritVid is for:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Competitive dancers wanting elite-level feedback</li>
            <li>Dance parents supporting their child's growth</li>
            <li>Studios looking for professional insight</li>
            <li>Adjudicators who want to offer their services remotely</li>
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="critique-include">
        <AccordionTrigger>3. What does a critique include?</AccordionTrigger>
        <AccordionContent>
          <p>Every critique includes:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>A video playback with the adjudicator speaking over your performance</li>
            <li>On-screen annotations (circles, arrows, etc.) to highlight key moments</li>
            <li>Optional AI-recommended exercises to help improve specific skills</li>
            <li>A written transcription of the critique</li>
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="cost">
        <AccordionTrigger>4. How much does it cost?</AccordionTrigger>
        <AccordionContent>
          Prices are set by each adjudicator and range from around $50 to $200 per critique. You can see their rates and average turnaround times before booking.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="turnaround-time">
        <AccordionTrigger>5. How long does it take to get my critique back?</AccordionTrigger>
        <AccordionContent>
          Turnaround time varies by adjudicator, but it's usually between 3–14 days. Each adjudicator's average delivery time is listed on their profile.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FAQAccordion;