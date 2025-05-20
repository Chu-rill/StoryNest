import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Facebook, Instagram, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Socialink
            </Link>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Connect, share, and discover amazing content with our global community.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Company
            </h3>
            <div className="mt-4 space-y-2">
              <Link to="/about" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                About Us
              </Link>
              <Link to="/privacy" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                Privacy Policy
              </Link>
              <Link to="/terms" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                Terms of Service
              </Link>
              <Link to="/contact" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                Contact
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Resources
            </h3>
            <div className="mt-4 space-y-2">
              <Link to="/help" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                Help Center
              </Link>
              <Link to="/community" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                Community Guidelines
              </Link>
              <Link to="/blog" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                Blog
              </Link>
              <Link to="/faq" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                FAQ
              </Link>
            </div>
          </div>

          {/* Social Media */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Connect With Us
            </h3>
            <div className="mt-4 flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-300">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-300">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-300">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {currentYear} Socialink. All rights reserved.
          </p>
          <p className="mt-4 md:mt-0 text-sm text-gray-500 dark:text-gray-400 flex items-center">
            Made with <Heart size={14} className="mx-1 text-red-500" /> by Socialink Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;