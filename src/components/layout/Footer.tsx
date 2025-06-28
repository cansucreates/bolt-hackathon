import React from 'react';
import { PawPrint as Paw, Mail, Instagram, Twitter, Facebook, Home } from 'lucide-react';
import { Link } from '../navigation/Link';

const Footer: React.FC = () => {
  return (
    <footer className="mt-20 bg-white/80 backdrop-blur-md pt-12 pb-6 border-t-2 border-kawaii-pink">
      <div className="kawaii-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative">
                <Paw 
                  size={32} 
                  className="text-kawaii-pink-dark fill-kawaii-pink-dark" 
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-kawaii-yellow rounded-full flex items-center justify-center">
                  <Home size={10} className="text-gray-700" />
                </div>
              </div>
              <span className="text-2xl font-bold text-gray-700">PawBackHome</span>
            </div>
            <p className="text-gray-600 mb-4 font-quicksand">
              🏡 Send every paw back home. Helping lost pets find their way home and connecting animal lovers worldwide.
            </p>
            <div className="mt-6 flex space-x-4">
              <SocialLink icon={<Facebook size={20} />} href="#" />
              <SocialLink icon={<Twitter size={20} />} href="#" />
              <SocialLink icon={<Instagram size={20} />} href="#" />
              <SocialLink icon={<Mail size={20} />} href="#" />
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-gray-700 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink href="/lost-found">Lost & Found</FooterLink>
              <FooterLink href="/crowdfunding">Crowdfunding</FooterLink>
              <FooterLink href="/adoption">Adoption</FooterLink>
              <FooterLink href="/vets">Find Vets</FooterLink>
              <FooterLink href="/chat">Vet Chat</FooterLink>
              <FooterLink href="/community">Community</FooterLink>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold text-gray-700 mb-4">Resources</h3>
            <ul className="space-y-2">
              <FooterLink href="/guide">Pet Care Guide</FooterLink>
              <FooterLink href="/emergency">Emergency Help</FooterLink>
              <FooterLink href="/blog">Pet Blog</FooterLink>
              <FooterLink href="/events">Events</FooterLink>
              <FooterLink href="/volunteer">Volunteer</FooterLink>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="text-lg font-bold text-gray-700 mb-4">Company</h3>
            <ul className="space-y-2">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
              <FooterLink href="/faq">FAQ</FooterLink>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-kawaii-pink text-center">
          <p className="text-gray-600 flex items-center justify-center gap-2 font-quicksand">
            Made with love to send every paw back home 🏡💕
          </p>
          <p className="mt-2 text-sm text-gray-500">
            © {new Date().getFullYear()} PawBackHome. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

type SocialLinkProps = {
  icon: React.ReactNode;
  href: string;
};

const SocialLink: React.FC<SocialLinkProps> = ({ icon, href }) => {
  return (
    <a 
      href={href} 
      className="w-10 h-10 rounded-full bg-kawaii-pink flex items-center justify-center text-gray-700 hover:bg-kawaii-pink-dark transition-colors duration-300"
    >
      {icon}
    </a>
  );
};

type FooterLinkProps = {
  href: string;
  children: React.ReactNode;
};

const FooterLink: React.FC<FooterLinkProps> = ({ href, children }) => {
  return (
    <li>
      <Link 
        to={href} 
        className="text-gray-600 hover:text-gray-900 hover:underline transition-colors duration-300"
      >
        {children}
      </Link>
    </li>
  );
};

export default Footer;