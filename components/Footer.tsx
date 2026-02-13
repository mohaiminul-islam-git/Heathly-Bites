import React from 'react';
import { Facebook, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-stone-200 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <a 
            href="https://www.facebook.com/healthybitesai" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-stone-400 hover:text-emerald-600 transition-colors"
          >
            <span className="sr-only">Facebook</span>
            <Facebook className="h-6 w-6" />
          </a>
          <a 
            href="mailto:hellodoctor344@gmail.com"
            className="text-stone-400 hover:text-emerald-600 transition-colors"
          >
            <span className="sr-only">Contact</span>
            <Mail className="h-6 w-6" />
          </a>
        </div>
        <div className="mt-8 md:mt-0 md:order-1">
          <p className="text-center text-base text-stone-400">
            &copy; {new Date().getFullYear()} Healthy Bites AI. All rights reserved.
          </p>
          <p className="text-center text-xs text-stone-300 mt-2">
            AI generated content may be inaccurate. Please consult a professional nutritionist for medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;