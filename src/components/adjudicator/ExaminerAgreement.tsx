import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const ExaminerAgreement: React.FC = () => {
  return (
    <ScrollArea className="h-[500px] w-full rounded-md border p-4 bg-white text-gray-900">
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-center text-gray-900">VidCrit Examiner Agreement</h3>
        
        <p className="text-sm text-gray-800">
          Welcome to VidCrit, where your expertise helps dancers grow through professional feedback. 
          This agreement outlines the expectations, payment structure, and guidelines for all adjudicators joining the platform.
        </p>
        
        <Separator />
        
        <h4 className="font-semibold text-lg text-gray-900">1. Engagement</h4>
        <p className="text-sm text-gray-800">
          By joining VidCrit, you agree to provide video critiques using the platform's built-in tools. 
          You remain an independent contractor, not an employee of VidCrit, and are free to manage your own availability and workload.
        </p>
        
        <Separator />
        
        <h4 className="font-semibold text-lg text-gray-900">2. Revenue Split & Payment</h4>
        <p className="text-sm text-gray-800">
          For every critique you complete, you will receive 60% of the total fee paid by the dancer or teacher. 
          VidCrit retains 40% to support:
        </p>
        <ul className="list-disc pl-6 text-sm text-gray-800">
          <li>Platform development and tools</li>
          <li>Video hosting and secure storage</li>
          <li>Admin and customer support</li>
          <li>Marketing and promotions</li>
        </ul>
        
        <p className="text-sm font-medium text-gray-800">Example:</p>
        <p className="text-sm text-gray-800">If a critique is priced at $50 USD, you earn $30 USD, and VidCrit retains $20 USD.</p>
        
        <p className="text-sm font-medium text-gray-800">Payment Timing:</p>
        <ul className="list-disc pl-6 text-sm text-gray-800">
          <li>Payment will be released 7 days after your critique is submitted, allowing time for the client to review the feedback and raise any concerns.</li>
          <li>All critiques must be marked as finalized, with no outstanding disputes, before payment is processed.</li>
        </ul>
        
        <p className="text-sm font-medium text-gray-800">Currency & International Payments:</p>
        <ul className="list-disc pl-6 text-sm text-gray-800">
          <li>VidCrit operates using USD (United States Dollars) as its base currency.</li>
          <li>Customers may see prices in their local currency during checkout via integrated payment processors (e.g., Stripe or PayPal), but adjudicator earnings are calculated and paid in USD.</li>
          <li>You may opt to receive payment in your local currency if supported by your payment method (e.g., Stripe Connect or PayPal). Currency conversion fees are your responsibility.</li>
          <li>You are responsible for any income tax, GST/VAT, or local reporting obligations in your country of residence.</li>
        </ul>
      </div>
    </ScrollArea>
  );
};

export default ExaminerAgreement;