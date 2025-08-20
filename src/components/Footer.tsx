import React from 'react';
import { Linkedin, Github } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 dark:bg-gray-950 text-white py-8 mt-12 transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> {/* Adjusted grid columns to 2 */}
          {/* Chatbot Description */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-xl font-bold mb-2">Chef Byte</h3>
            <p className="text-gray-300 text-sm max-w-sm">
              Your personal AI cooking assistant — recipes, tips, and more!
            </p>
          </div>

          {/* Social Media Icons */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right"> {/* Adjusted alignment */}
            <h4 className="font-semibold text-lg mb-3">Connect With Us</h4>
            <div className="flex justify-center md:justify-end space-x-4"> {/* Adjusted alignment */}
              {/* LinkedIn Icon */}
              <a href="https://www.linkedin.com/in/aryanmokashi49" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue-500 transition-colors duration-200">
                <Linkedin size={24} />
              </a>
              {/* GitHub Icon */}
              <a href="https://github.com/aryanmoka" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-gray-400 transition-colors duration-200">
                <Github size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          © {currentYear} Chef Byte. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
