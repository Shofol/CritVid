import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

const TermsAndConditions: React.FC = () => {
  return (
    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Adjudicator Terms and Conditions</h3>
        
        <p className="text-sm">
          By applying to become an adjudicator on our platform, you agree to the following terms and conditions:
        </p>
        
        <h4 className="font-medium">1. Qualifications and Expertise</h4>
        <p className="text-sm">
          You confirm that all credentials, qualifications, and experience provided in your application are accurate and verifiable.
          You possess the necessary expertise to provide professional critiques in the dance styles you have selected.
        </p>
        
        <h4 className="font-medium">2. Quality of Service</h4>
        <p className="text-sm">
          You agree to provide high-quality, constructive feedback that helps dancers improve their technique and performance.
          All critiques must be professional, respectful, and educational in nature.
        </p>
        
        <h4 className="font-medium">3. Turnaround Time</h4>
        <p className="text-sm">
          You commit to completing all critiques within your stated turnaround time. Repeated failures to meet deadlines may result in removal from the platform.
        </p>
        
        <h4 className="font-medium">4. Pricing and Payments</h4>
        <p className="text-sm">
          You agree to the platform's commission structure, where the platform retains 20% of each critique fee. Payments will be processed within 7 business days after a critique is completed and approved.
        </p>
        
        <h4 className="font-medium">5. Intellectual Property</h4>
        <p className="text-sm">
          You retain ownership of your critique content, but grant the platform a non-exclusive license to store and display your critiques to the relevant dancers.
        </p>
        
        <h4 className="font-medium">6. Privacy and Confidentiality</h4>
        <p className="text-sm">
          You agree to maintain the confidentiality of all dancer videos and not share, distribute, or use them for any purpose other than providing critiques on this platform.
        </p>
        
        <h4 className="font-medium">7. ID Verification</h4>
        <p className="text-sm">
          You consent to complete an ID verification process if your application is approved, which may include providing government-issued identification and proof of qualifications.
        </p>
        
        <h4 className="font-medium">8. Platform Standards</h4>
        <p className="text-sm">
          You agree to abide by all platform guidelines and community standards. The platform reserves the right to remove adjudicators who violate these standards or receive consistent negative feedback.
        </p>
        
        <h4 className="font-medium">9. Termination</h4>
        <p className="text-sm">
          Either party may terminate this agreement with 30 days' notice. You will be required to complete any in-progress critiques before termination takes effect.
        </p>
        
        <h4 className="font-medium">10. Amendments</h4>
        <p className="text-sm">
          The platform reserves the right to modify these terms with 14 days' notice. Continued use of the platform after such notice constitutes acceptance of the modified terms.
        </p>
      </div>
    </ScrollArea>
  );
};

export default TermsAndConditions;