import React from 'react';
import { Link } from 'react-router-dom';

const FooterSection: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    { title: 'About', href: '/about' },
    { title: 'Terms & Conditions', href: '/terms' },
    { title: 'Privacy', href: '/privacy' },
    { title: 'Community Guidelines', href: '/guidelines' },
    { title: 'Contact Us', href: '/contact' },
  ];
  
  const socialLinks = [
    { icon: 'instagram', href: 'https://www.instagram.com/crit.vid/', label: 'Instagram' },
    { icon: 'facebook', href: 'https://www.facebook.com/profile.php?id=61576588587210', label: 'Facebook' },
  ];

  return (
    <footer className="bg-slate-900 text-white py-12 w-full">
      <div className="container mx-auto px-4 max-w-none">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">CritVid</h3>
            <p className="text-slate-300 mb-4 max-w-md">
              Professional dance feedback platform connecting dancers with adjudicators for detailed video critiques.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a 
                  key={link.icon}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white transition-colors"
                  aria-label={link.label}
                >
                  {link.icon === 'instagram' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  )}
                  {link.icon === 'facebook' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.slice(0, 3).map((link) => (
                <li key={link.title}>
                  <Link to={link.href} className="text-slate-300 hover:text-white transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.slice(3).map((link) => (
                <li key={link.title}>
                  <Link to={link.href} className="text-slate-300 hover:text-white transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-2">Contact</h4>
              <p className="text-slate-300 text-sm">hello@critvidapp.com</p>
              <p className="text-slate-300 text-sm mt-2">2/13 Major Street</p>
              <p className="text-slate-300 text-sm">Davenport WA 6232</p>
              <p className="text-slate-300 text-sm">Australia</p>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-700 text-center text-slate-400">
          <p>&copy; {currentYear} CritVid. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;