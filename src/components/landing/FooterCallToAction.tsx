import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// CallToActionSection with dark mode styling
export const CallToActionSection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-800">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          Ready to Level Up Your Performance?
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
          Submit your first routine and get actionable feedback from industry pros.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/upload-video">
            <Button size="lg" className="px-8">
              Get Started Now
            </Button>
          </Link>
          <Link to="/help">
            <Button size="lg" variant="outline" className="px-8 border-white text-white hover:bg-gray-700">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

// FooterSection with dark mode styling
export const FooterSection: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    { title: 'About', href: '/about' },
    { title: 'Terms & Conditions', href: '/terms' },
    { title: 'Privacy', href: '/privacy' },
    { title: 'Contact Us', href: '/contact' },
  ];
  
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold mb-4">VidCrit</h3>
            <p className="text-gray-300 mb-4 max-w-md">
              Professional dance feedback platform connecting dancers with adjudicators.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.slice(0, 2).map((link) => (
                <li key={link.title}>
                  <Link to={link.href} className="text-gray-300 hover:text-white transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.slice(2).map((link) => (
                <li key={link.title}>
                  <Link to={link.href} className="text-gray-300 hover:text-white transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {currentYear} VidCrit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default { CallToActionSection, FooterSection };