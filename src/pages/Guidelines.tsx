import React from 'react';
import { Helmet } from 'react-helmet';
import { AppLayout } from '@/components/AppLayout';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Guidelines = () => {
  return (
    <AppLayout>
      <Helmet>
        <title>Community Guidelines | CritVid Dance Feedback Platform</title>
      </Helmet>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Community Guidelines</h1>
        
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">🎭 VidCrit Community Guidelines</h2>
          <p className="mb-6">At VidCrit, we're committed to fostering a respectful, inclusive, and inspiring space where dancers and adjudicators from around the world can connect through feedback and creativity. These guidelines help ensure our community stays positive, safe, and professional for everyone.</p>
          
          <Separator className="my-4" />
          
          <h3 className="text-xl font-semibold mb-3">🔒 Respect & Safety</h3>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>Treat all users—dancers, adjudicators, and teachers—with kindness and professionalism.</li>
            <li>Discrimination, harassment, bullying, or hate speech of any kind will not be tolerated.</li>
            <li>Do not share private information (yours or others') without consent.</li>
          </ul>
          
          <Separator className="my-4" />
          
          <h3 className="text-xl font-semibold mb-3">💬 Feedback Culture</h3>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>Feedback should be constructive, specific, and focused on growth—not criticism for criticism's sake.</li>
            <li>Dancers are vulnerable when sharing work. Adjudicators should offer encouragement alongside critique.</li>
            <li>Dancers and teachers are expected to receive feedback with an open mind and professional attitude.</li>
          </ul>
          
          <Separator className="my-4" />
          
          <h3 className="text-xl font-semibold mb-3">🎥 Content Standards</h3>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>Uploads must be performance-related and suitable for all ages.</li>
            <li>No explicit or inappropriate material will be accepted.</li>
            <li>Ensure you have permission to upload performances, especially if other people are visible in the video.</li>
          </ul>
          
          <Separator className="my-4" />
          
          <h3 className="text-xl font-semibold mb-3">💼 Professional Conduct</h3>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>Adjudicators must meet eligibility standards set by VidCrit and maintain a high level of integrity.</li>
            <li>Reviews must be submitted on time and meet quality expectations.</li>
            <li>Dancers or teachers attempting to pressure or bribe adjudicators will be removed from the platform.</li>
          </ul>
          
          <Separator className="my-4" />
          
          <h3 className="text-xl font-semibold mb-3">🌍 Platform Use</h3>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>One account per user unless otherwise approved (e.g., a shared teacher account).</li>
            <li>Do not impersonate other users or misrepresent credentials.</li>
            <li>Payment disputes must go through the official support channels—not through public comment or review spaces.</li>
          </ul>
          
          <Separator className="my-4" />
          
          <h3 className="text-xl font-semibold mb-3">⚖️ Violations</h3>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>Repeated or serious breaches of these guidelines may result in warnings, suspensions, or permanent removal from the platform.</li>
            <li>VidCrit reserves the right to take immediate action in cases of misconduct.</li>
          </ul>
          
          <Separator className="my-4" />
          
          <p className="mt-6 italic">If you're unsure about anything, just ask! We're here to support a safe and empowering space for dancers and educators alike.</p>
        </Card>
        
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Video Submission Guidelines</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Videos should be clear and well-lit</li>
            <li>Ensure the entire dancer is visible in the frame</li>
            <li>Maximum file size: 500MB</li>
            <li>Supported formats: MP4, MOV, AVI</li>
            <li>Maximum length: 10 minutes</li>
          </ul>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Feedback Guidelines</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Critiques should be constructive and respectful</li>
            <li>Focus on specific technical elements and performance quality</li>
            <li>Provide actionable feedback that dancers can implement</li>
            <li>Balance positive observations with areas for improvement</li>
            <li>Use appropriate terminology for the dance style</li>
          </ul>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Guidelines;