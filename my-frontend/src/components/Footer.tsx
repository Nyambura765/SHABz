import React from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';

export const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = React.useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
        duration: 3000
      });
      return;
    }

    // TODO: Implement actual newsletter signup logic
    toast({
      title: "Newsletter Signup",
      description: `You've subscribed with ${email}`,
      variant: "default",
      duration: 5000
    });

    // Reset email input
    setEmail('');
  };

  return (
    <footer className="bg-teal-700 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">SHABz</h2>
            <p className="max-w-xs">
              Revolutionizing creator-fan relationships through blockchain technology.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link to="/features" className="hover:text-teal-200 transition">Features</Link></li>
              <li><Link to="/marketplace" className="hover:text-teal-200 transition">Marketplace</Link></li>
              <li><Link to="/tokenomics" className="hover:text-teal-200 transition">Token Economics</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/docs" className="hover:text-teal-200 transition">Documentation</Link></li>
              <li><Link to="/help" className="hover:text-teal-200 transition">Help Center</Link></li>
              <li><Link to="/blog" className="hover:text-teal-200 transition">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
            <div className="space-y-3">
              <a 
                href="https://twitter.com/SHABzOfficial" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block hover:text-teal-200 transition"
              >
                Twitter
              </a>
              <a 
                href="https://discord.gg/SHABz" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block hover:text-teal-200 transition"
              >
                Discord
              </a>
              <a 
                href="https://t.me/SHABzOfficial" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block hover:text-teal-200 transition"
              >
                Telegram
              </a>
            </div>

            {/* Newsletter Signup */}
            <form onSubmit={handleNewsletterSubmit} className="mt-4">
              <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Subscribe to newsletter"
                  className="bg-transparent w-full text-white placeholder-teal-200 focus:outline-none"
                  required
                />
                <button 
                  type="submit" 
                  className="ml-2 text-white hover:text-teal-200 transition"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>
              © 2025 SHABz. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 space-x-4">
              <Link to="/privacy" className="hover:text-teal-200 transition">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-teal-200 transition">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};