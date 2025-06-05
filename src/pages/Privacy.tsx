import React from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';

const Privacy: React.FC = () => {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-lg mb-4">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Introduction</h2>
          <p>
            At VidCrit, we respect your privacy and are committed to protecting your personal data. 
            This privacy policy will inform you about how we look after your personal data when you 
            visit our website and tell you about your privacy rights and how the law protects you.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">The Data We Collect</h2>
          <p>
            We may collect, use, store and transfer different kinds of personal data about you which 
            we have grouped together as follows:
          </p>
          <ul className="list-disc pl-6 my-4">
            <li>Identity Data: includes first name, last name, username</li>
            <li>Contact Data: includes email address and telephone numbers</li>
            <li>Technical Data: includes internet protocol (IP) address, browser type and version</li>
            <li>Profile Data: includes your interests, preferences, feedback and survey responses</li>
            <li>Usage Data: includes information about how you use our website and services</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Data</h2>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your 
            personal data in the following circumstances:
          </p>
          <ul className="list-disc pl-6 my-4">
            <li>Where we need to perform the contract we are about to enter into or have entered into with you</li>
            <li>Where it is necessary for our legitimate interests and your interests and rights do not override those interests</li>
            <li>Where we need to comply with a legal or regulatory obligation</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us at:
          </p>
          <p className="my-4">
            Email: privacy@vidcrit.com<br />
            Or visit our <Link to="/contact" className="text-blue-600 hover:underline">contact page</Link>
          </p>
          
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link to="/" className="text-blue-600 hover:underline">&larr; Back to home</Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Privacy;
