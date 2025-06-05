import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const ExaminerAgreementPart3: React.FC = () => {
  return (
    <ScrollArea className="h-[500px] w-full rounded-md border p-4 bg-white text-gray-900">
      <div className="space-y-4">
        <Separator />
        
        <h4 className="font-semibold text-lg text-gray-900">7. Confidentiality</h4>
        <p className="text-sm text-gray-800">
          All videos, images, and materials submitted by users are private. You agree to:
        </p>
        <ul className="list-disc pl-6 text-sm text-gray-800">
          <li>Maintain confidentiality at all times</li>
          <li>Never share, store, or download content for any purpose outside of VidCrit</li>
        </ul>
        
        <Separator />
        
        <h4 className="font-semibold text-lg text-gray-900">8. Platform Changes</h4>
        <p className="text-sm text-gray-800">
          VidCrit reserves the right to update platform features, pricing, or payout structures. If changes affect the revenue split or your rights materially:
        </p>
        <ul className="list-disc pl-6 text-sm text-gray-800">
          <li>You will be given 30 days' notice in writing</li>
          <li>Continued use of the platform after this notice period will be considered acceptance</li>
        </ul>
        
        <Separator />
        
        <h4 className="font-semibold text-lg text-gray-900">9. Termination</h4>
        <p className="text-sm text-gray-800">
          Either party may terminate this agreement at any time with written notice. Upon termination:
        </p>
        <ul className="list-disc pl-6 text-sm text-gray-800">
          <li>Any outstanding payouts for completed critiques will be processed after the 7-day dispute period</li>
          <li>Your profile will be deactivated, but VidCrit may retain your critiques for the benefit of clients who purchased them</li>
        </ul>
        
        <Separator />
        
        <h4 className="font-semibold text-lg text-gray-900">10. Governing Law</h4>
        <p className="text-sm text-gray-800">
          This agreement is governed by the laws of Western Australia, unless otherwise required by local law. All disputes will be handled in accordance with these laws.
        </p>
        
        <Separator />
        
        <p className="text-sm text-gray-800">
          By registering as an adjudicator on VidCrit, you agree to these terms and confirm that you understand the expectations, payment structure, and platform policies.
        </p>
      </div>
    </ScrollArea>
  );
};

export default ExaminerAgreementPart3;