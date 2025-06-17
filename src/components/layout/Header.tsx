import React, { useState, useEffect } from 'react';
import { Menu, X, PawPrint as Paw, Search, MessageCircle, Map, Users, Heart, User, LogIn, UserPlus, DollarSign } from 'lucide-react';
import { Link } from '../navigation/Link';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Enhanced mobile navigation handler with background overlay control
  const handleMobileNavigation = () => {
    // Only handle mobile navigation if viewport is mobile (<768px)
    if (window.innerWidth >= 768) return;
    
    // Get both menu and background overlay elements
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuBackground = document.getElementById('mobile-menu-background');
    
    // Immediately hide background overlay
    if (mobileMenuBackground) {
      mobileMenuBackground.style.transition = 'none';
      mobileMenuBackground.style.opacity = '0';
      mobileMenuBackground.style.visibility = 'hidden';
      mobileMenuBackground.style.pointerEvents = 'none';
      
      // Force reflow to ensure immediate application
      mobileMenuBackground.offsetHeight;
    }
    
    // Stop all menu animations and immediately close menu
    if (mobileMenu) {
      // Remove any existing transition classes
      mobileMenu.style.transition = 'none';
      mobileMenu.style.opacity = '0';
      mobileMenu.style.transform = 'translateY(-4px)';
      mobileMenu.style.pointerEvents = 'none';
      
      // Force reflow to ensure immediate style application
      mobileMenu.offsetHeight;
      
      // Re-enable transitions for smooth collapse after a brief delay
      setTimeout(() => {
        if (mobileMenu) {
          mobileMenu.style.transition = 'all 300ms ease-in-out';
        }
        if (mobileMenuBackground) {
          mobileMenuBackground.style.transition = 'all 300ms ease-in-out';
        }
      }, 10);
    }
    
    // Update menu state immediately
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside or on navigation
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Enhanced menu toggle with proper state reset
  const toggleMenu = () => {
    // Force close any existing modal states that might interfere
    if (showAuthModal) {
      setShowAuthModal(false);
    }
    
    // Reset any potential style overrides from previous interactions
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuBackground = document.getElementById('mobile-menu-background');
    
    if (mobileMenu) {
      mobileMenu.style.transition = '';
      mobileMenu.style.opacity = '';
      mobileMenu.style.transform = '';
      mobileMenu.style.pointerEvents = '';
    }
    
    if (mobileMenuBackground) {
      mobileMenuBackground.style.transition = '';
      mobileMenuBackground.style.opacity = '';
      mobileMenuBackground.style.visibility = '';
      mobileMenuBackground.style.pointerEvents = '';
    }
    
    // Toggle menu state
    setIsMenuOpen(!isMenuOpen);
  };

  // Auth modal handlers with proper navigation state management
  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
    
    // If mobile menu is open, close it first
    if (isMenuOpen && window.innerWidth < 768) {
      handleMobileNavigation();
    }
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
    
    // Reset navigation menu state to ensure it works properly after modal close
    setTimeout(() => {
      const mobileMenu = document.getElementById('mobile-menu');
      const mobileMenuBackground = document.getElementById('mobile-menu-background');
      
      if (mobileMenu) {
        mobileMenu.style.transition = '';
        mobileMenu.style.opacity = '';
        mobileMenu.style.transform = '';
        mobileMenu.style.pointerEvents = '';
      }
      
      if (mobileMenuBackground) {
        mobileMenuBackground.style.transition = '';
        mobileMenuBackground.style.opacity = '';
        mobileMenuBackground.style.visibility = '';
        mobileMenuBackground.style.pointerEvents = '';
      }
      
      // Ensure menu state is properly reset
      setIsMenuOpen(false);
    }, 100);
  };

  // Close menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Enhanced click outside handler for both menu and background
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const mobileMenu = document.getElementById('mobile-menu');
      const mobileMenuBackground = document.getElementById('mobile-menu-background');
      const menuButton = document.getElementById('mobile-menu-button');
      
      if (isMenuOpen && mobileMenu && menuButton && 
          !mobileMenu.contains(target) && 
          !menuButton.contains(target)) {
        
        // If clicking on background overlay, close immediately
        if (mobileMenuBackground && mobileMenuBackground.contains(target)) {
          handleMobileNavigation();
        } else {
          closeMenu();
        }
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable body scroll when menu is closed
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Cleanup effect to handle modal state changes
  useEffect(() => {
    // When auth modal state changes, ensure navigation is properly reset
    if (!showAuthModal) {
      // Small delay to ensure modal close animation completes
      setTimeout(() => {
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuBackground = document.getElementById('mobile-menu-background');
        
        if (mobileMenu) {
          mobileMenu.style.transition = '';
          mobileMenu.style.opacity = '';
          mobileMenu.style.transform = '';
          mobileMenu.style.pointerEvents = '';
        }
        
        if (mobileMenuBackground) {
          mobileMenuBackground.style.transition = '';
          mobileMenuBackground.style.opacity = '';
          mobileMenuBackground.style.visibility = '';
          mobileMenuBackground.style.pointerEvents = '';
        }
      }, 150);
    }
  }, [showAuthModal]);

  // Auth Modal Component
  const AuthModal: React.FC = () => {
    if (!showAuthModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white rounded-kawaii shadow-kawaii w-full max-w-sm sm:max-w-md mx-auto p-4 sm:p-6 md:p-8 relative animate-slide-in max-h-[95vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 pr-8">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <Paw size={28} className="text-kawaii-pink-dark fill-kawaii-pink-dark sm:w-8 sm:h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              {authMode === 'signin' ? 'Welcome Back!' : 'Join PawConnect'}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 font-quicksand px-2">
              {authMode === 'signin' 
                ? 'Sign in to help pets find their way home' 
                : 'Create an account to start helping pets'
              }
            </p>
          </div>

          {/* Google Sign In Button */}
          <button className="w-full mb-4 p-3 sm:p-4 border-2 border-gray-200 rounded-kawaii hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-3 group min-h-[48px] sm:min-h-[52px]">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-semibold text-gray-700 group-hover:text-gray-800 text-sm sm:text-base">
              {authMode === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}
            </span>
          </button>

          {/* Divider */}
          <div className="relative mb-4 sm:mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-3 sm:px-4 bg-white text-gray-500 font-quicksand">or continue with email</span>
            </div>
          </div>

          {/* Email Form */}
          <form className="space-y-3 sm:space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-kawaii-pink rounded-kawaii bg-white/70 focus:outline-none focus:ring-2 focus:ring-kawaii-purple focus:border-transparent transition-all duration-300 text-sm sm:text-base min-h-[48px]"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-kawaii-pink rounded-kawaii bg-white/70 focus:outline-none focus:ring-2 focus:ring-kawaii-purple focus:border-transparent transition-all duration-300 text-sm sm:text-base min-h-[48px]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-kawaii-pink rounded-kawaii bg-white/70 focus:outline-none focus:ring-2 focus:ring-kawaii-purple focus:border-transparent transition-all duration-300 text-sm sm:text-base min-h-[48px]"
              />
            </div>

            {authMode === 'signup' && (
              <div className="flex items-start gap-3 py-2">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="mt-1 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" 
                />
                <label htmlFor="terms" className="text-xs sm:text-sm text-gray-600 font-quicksand leading-relaxed">
                  I agree to the <Link to="/terms" className="text-kawaii-pink-dark hover:underline font-semibold">Terms of Service</Link> and <Link to="/privacy" className='text-kawaii-pink-dark hover:underline font-semibold'>Privacy Policy</Link>
                </label>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-kawaii-pink hover:bg-kawaii-pink-dark text-gray-700 font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-kawaii transition-all duration-300 hover:scale-105 shadow-md text-sm sm:text-base min-h-[48px] sm:min-h-[52px]"
            >
              {authMode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-sm sm:text-base text-gray-600 font-quicksand">
              {authMode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                className="text-kawaii-pink-dark hover:underline font-semibold"
              >
                {authMode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {authMode === 'signin' && (
            <div className="mt-3 sm:mt-4 text-center">
              <a href="#" className="text-xs sm:text-sm text-gray-500 hover:text-kawaii-pink-dark transition-colors duration-200">
                Forgot your password?
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out
                  ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : 'bg-transparent'}`}
      >
        <div className="kawaii-container py-3 sm:py-4">
          <div className="flex items-center justify-between min-h-[60px] sm:min-h-[64px]">
            {/* Logo - Increased left margin to distinguish from nav items */}
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0 mr-8 lg:mr-12" onClick={closeMenu}>
              <div className="relative">
                <Paw 
                  size={28} 
                  className="text-kawaii-pink-dark fill-kawaii-pink-dark animate-pulse sm:w-8 sm:h-8" 
                />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-700 whitespace-nowrap">PawConnect</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2 xl:space-x-3">
              <NavItem to="/lost-found" icon={<Search size={16} />} onClick={closeMenu}>Lost & Found</NavItem>
              <NavItem to="/crowdfunding" icon={<DollarSign size={16} />} onClick={closeMenu}>Crowdfunding</NavItem>
              <NavItem to="/adoption" icon={<Heart size={16} />} onClick={closeMenu}>Adoption</NavItem>
              <NavItem to="/vets" icon={<Map size={16} />} onClick={closeMenu}>Find Vets</NavItem>
              <NavItem to="/chat" icon={<MessageCircle size={16} />} onClick={closeMenu}>Vet Chat</NavItem>
              <NavItem to="/community" icon={<Users size={16} />} onClick={closeMenu}>Community</NavItem>
              
              {/* Auth Buttons */}
              <div className="flex items-center space-x-2 ml-4 xl:ml-6 pl-4 xl:pl-6 border-l border-gray-200">
                <button 
                  onClick={() => openAuthModal('signin')}
                  className="px-3 xl:px-4 py-2 text-gray-700 hover:text-kawaii-pink-dark font-semibold transition-colors duration-300 flex items-center gap-1 xl:gap-2 text-sm xl:text-base whitespace-nowrap"
                >
                  <LogIn size={16} />
                  Sign In
                </button>
                <button 
                  onClick={() => openAuthModal('signup')}
                  className="kawaii-button flex items-center gap-1 xl:gap-2 text-sm xl:text-base px-3 xl:px-4 py-2 whitespace-nowrap"
                >
                  <UserPlus size={16} />
                  Sign Up
                </button>
              </div>
            </nav>
            
            {/* Mobile Menu Button */}
            <button 
              id="mobile-menu-button"
              className="lg:hidden p-2 rounded-full bg-kawaii-pink text-gray-700 transition-all duration-300 relative z-[60] min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <div className={`transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}>
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Background Overlay */}
      <div 
        id="mobile-menu-background"
        className={`lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 ease-in-out z-[45] ${
          isMenuOpen 
            ? 'opacity-100 visible pointer-events-auto' 
            : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={handleMobileNavigation}
      />
      
      {/* Mobile Navigation Menu */}
      <div 
        id="mobile-menu"
        className={`lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white/95 backdrop-blur-md shadow-2xl transition-all duration-300 ease-in-out z-[55] ${
          isMenuOpen 
            ? 'opacity-100 translate-x-0 pointer-events-auto' 
            : 'opacity-0 translate-x-full pointer-events-none'
        }`}
      >
        {/* Menu Header */}
        <div className="p-4 sm:p-6 border-b border-kawaii-pink/30 bg-kawaii-pink/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Paw size={20} className="text-kawaii-pink-dark fill-kawaii-pink-dark sm:w-6 sm:h-6" />
              <span className="text-base sm:text-lg font-bold text-gray-700">Menu</span>
            </div>
            <button 
              onClick={closeMenu}
              className="p-2 rounded-full bg-white/60 text-gray-700 hover:bg-white transition-colors duration-200 min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Menu Content */}
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto h-full pb-24">
          <MobileNavItem to="/lost-found" icon={<Search size={18} />} onClick={handleMobileNavigation}>
            Lost & Found
          </MobileNavItem>
          <MobileNavItem to="/crowdfunding" icon={<DollarSign size={18} />} onClick={handleMobileNavigation}>
            Crowdfunding
          </MobileNavItem>
          <MobileNavItem to="/adoption" icon={<Heart size={18} />} onClick={handleMobileNavigation}>
            Adoption
          </MobileNavItem>
          <MobileNavItem to="/vets" icon={<Map size={18} />} onClick={handleMobileNavigation}>
            Find Vets
          </MobileNavItem>
          <MobileNavItem to="/chat" icon={<MessageCircle size={18} />} onClick={handleMobileNavigation}>
            Vet Chat
          </MobileNavItem>
          <MobileNavItem to="/community" icon={<Users size={18} />} onClick={handleMobileNavigation}>
            Community
          </MobileNavItem>
          
          {/* Auth Buttons */}
          <div className="pt-4 sm:pt-6 border-t border-kawaii-pink/30 space-y-3">
            <button 
              className="w-full py-3 px-4 border-2 border-kawaii-pink text-kawaii-pink-dark font-bold rounded-kawaii transition-all duration-300 hover:bg-kawaii-pink/20 flex items-center justify-center gap-2 min-h-[48px]" 
              onClick={() => {
                handleMobileNavigation();
                openAuthModal('signin');
              }}
            >
              <LogIn size={16} />
              Sign In
            </button>
            <button 
              className="kawaii-button w-full justify-center text-base sm:text-lg py-3 flex items-center gap-2 min-h-[48px]" 
              onClick={() => {
                handleMobileNavigation();
                openAuthModal('signup');
              }}
            >
              <UserPlus size={16} />
              Sign Up
            </button>
          </div>

          {/* Additional Menu Items */}
          <div className="pt-3 sm:pt-4 space-y-2 sm:space-y-3">
            <div className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Quick Links</div>
            <MobileNavItem to="/emergency" icon={<Heart size={16} />} onClick={handleMobileNavigation} className="text-red-600">
              Emergency Help
            </MobileNavItem>
            <MobileNavItem to="/about" icon={<Users size={16} />} onClick={handleMobileNavigation}>
              About Us
            </MobileNavItem>
            <MobileNavItem to="/contact" icon={<MessageCircle size={16} />} onClick={handleMobileNavigation}>
              Contact
            </MobileNavItem>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal />
    </>
  );
};

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
};

const NavItem: React.FC<NavItemProps> = ({ to, icon, children, onClick }) => {
  return (
    <Link 
      to={to} 
      className="px-2 xl:px-3 py-2 rounded-full text-gray-700 hover:bg-kawaii-pink/50 transition-all duration-300 flex items-center space-x-1 text-sm xl:text-base font-medium whitespace-nowrap"
      onClick={onClick}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
};

type MobileNavItemProps = {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

const MobileNavItem: React.FC<MobileNavItemProps> = ({ to, icon, children, onClick, className = "" }) => {
  return (
    <Link 
      to={to} 
      className={`flex items-center space-x-3 p-3 sm:p-4 rounded-kawaii text-gray-700 hover:bg-kawaii-pink/30 transition-all duration-300 border border-transparent hover:border-kawaii-pink/50 min-h-[48px] ${className}`}
      onClick={onClick}
    >
      <div className="flex-shrink-0">
        {icon}
      </div>
      <span className="font-quicksand font-semibold text-sm sm:text-base">{children}</span>
    </Link>
  );
};

export default Header;