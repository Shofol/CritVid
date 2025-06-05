import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const ExaminerAgreementPart2: React.FC = () => {
  return (
    <ScrollArea className="h-[500px] w-full rounded-md border p-4 bg-white text-gray-900">
      <div className="space-y-4">
        <Separator />
        
        <h4 className="font-semibold text-lg text-gray-900">3. Delivery Guidelines</h4>
        <ul className="list-disc pl-6 text-sm text-gray-800">
          <li>You must complete each critique within 21 days of assignment.</li>
          <li>Faster turnaround = higher examiner ratings. Completing critiques promptly improves your visibility and standing on the platform.</li>
          <li>All critiques must be:</li>
          <ul className="list-disc pl-6 text-sm text-gray-800">
            <li>Constructive, respectful, and clearly communicated</li>
            <li>Delivered using VidCrit's tools, including drawing features and voiceover</li>
            <li>Recorded in a quiet environment with acceptable audio quality</li>
          </ul>
        </ul>
        <p className="text-sm text-gray-800">Repeated late submissions or low-quality feedback may lead to temporary suspension or removal from the platform.</p>
        
        <Separator />
        
        <h4 className="font-semibold text-lg text-gray-900">4. Intellectual Property</h4>
        <p className="text-sm text-gray-800">
          You retain ownership of your feedback, but grant VidCrit a non-exclusive, royalty-free license to:
        </p>
        <ul className="list-disc pl-6 text-sm text-gray-800">
          <li>Distribute your critique to the original user</li>
          <li>Use short clips, screenshots, or testimonials from your critiques for promotional purposes (with credit where appropriate)</li>
        </ul>
        
        <Separator />
        
        <h4 className="font-semibold text-lg text-gray-900">5. Code of Conduct</h4>
        <p className="text-sm text-gray-800">
          You agree to maintain professional standards at all times. You must not:
        </p>
        <ul className="list-disc pl-6 text-sm text-gray-800">
          <li>Share, download, or redistribute any user content outside of VidCrit</li>
          <li>Submit commentary that is offensive, discriminatory, or inappropriate</li>
          <li>Misrepresent your qualifications, identity, or experience</li>
        </ul>
        
        <Separator />
        
        <h4 className="font-semibold text-lg text-gray-900">6. Account Management</h4>
        <p className="text-sm text-gray-800">
          You are responsible for managing your profile and availability. This includes:
        </p>
        <ul className="list-disc pl-6 text-sm text-gray-800">
          <li>Keeping your availability up to date</li>
          <li>Pausing your profile when unavailable</li>
          <li>Responding promptly to critique assignments</li>
          <li>Upholding a consistent standard of feedback</li>
        </ul>
        <p className="text-sm text-gray-800">Accounts may be paused or removed due to inactivity, low ratings, or breach of policy.</p>
      </div>
    </ScrollArea>
  );
};

export default ExaminerAgreementPart2;