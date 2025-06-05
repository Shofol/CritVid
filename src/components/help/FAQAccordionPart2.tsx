import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQAccordionPart2: React.FC = () => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="video-safety">
        <AccordionTrigger>6. Is it safe to upload my child's video?</AccordionTrigger>
        <AccordionContent>
          <p>Yes. All videos are:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Stored securely with encryption</li>
            <li>Only visible to the selected adjudicator and admin staff</li>
            <li>Not shareable or downloadable outside the platform</li>
            <li>Require verified parental consent for dancers under 18</li>
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="multiple-adjudicators">
        <AccordionTrigger>7. Can I choose more than one adjudicator for the same video?</AccordionTrigger>
        <AccordionContent>
          Yes! You can send the same video to multiple adjudicators if you'd like different perspectives. Each one is charged separately.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="refund">
        <AccordionTrigger>8. Can I get a refund if I'm not happy with the critique?</AccordionTrigger>
        <AccordionContent>
          If you're not satisfied, you can request a review. If the feedback is found to be below our standard, we'll either assign a new adjudicator or provide credit toward another critique.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="become-adjudicator">
        <AccordionTrigger>9. How do I become an adjudicator?</AccordionTrigger>
        <AccordionContent>
          <p>Click "Join as Adjudicator" on the home page. All applicants must:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Verify their identity</li>
            <li>Share credentials and background</li>
            <li>Complete a trial critique</li>
          </ul>
          <p className="mt-2">We hand-review every submission to maintain high-quality standards.</p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="music-license">
        <AccordionTrigger>10. Do I need a license for the music in my video?</AccordionTrigger>
        <AccordionContent>
          You should have permission to use the music. CritVid videos are for educational critique only, and we include a music disclaimer on every video to reduce risk.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FAQAccordionPart2;