import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Terms & Conditions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
              <p className="text-slate-700">
                Welcome to CritVid. These Terms and Conditions govern your use of our website and services. 
                By accessing or using CritVid, you agree to be bound by these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Definitions</h2>
              <p className="text-slate-700">
                "Service" refers to the CritVid platform, including all content, features, and functionality.
                "User" refers to any individual who accesses or uses the Service.
                "Content" refers to all videos, critiques, text, graphics, and other material uploaded to or available on the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Account Registration</h2>
              <p className="text-slate-700">
                To use certain features of the Service, you must register for an account. You agree to provide accurate information
                and to keep this information updated. You are responsible for maintaining the confidentiality of your account credentials.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. User Content</h2>
              <p className="text-slate-700">
                You retain all rights to content you upload to CritVid. By uploading content, you grant CritVid a non-exclusive,
                worldwide license to use, store, and display your content for the purpose of providing the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Prohibited Conduct</h2>
              <p className="text-slate-700">
                You agree not to use the Service to upload, transmit, or distribute content that is illegal, harmful,
                threatening, abusive, harassing, defamatory, or otherwise objectionable.
              </p>
            </section>

            <div className="mt-8 text-center">
              <Link to="/">
                <Button>Return to Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;
