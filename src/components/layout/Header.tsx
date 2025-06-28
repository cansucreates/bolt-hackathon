import React, { useState, useEffect } from 'react';
import { Menu, X, PawPrint as Paw, Search, MessageCircle, Map, Users, Heart, User, LogIn, UserPlus, DollarSign, Home } from 'lucide-react';
import { Link } from '../navigation/Link';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../auth/AuthModal';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authMessage, setAuthMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const { user, profile, signOut } = useAuth();
  
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

  // Check for auth messages from URL state
  useEffect(() => {
    const checkAuthMessages = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const authSuccess = urlParams.get('auth_success');
      const authError = urlParams.get('auth_error');
      
      if (authSuccess) {
        setAuthMessage({ type: 'success', text: decodeURIComponent(authSuccess) });
        // Clean up URL
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('auth_success');
        window.history.replaceState({}, '', newUrl.toString());
        
        // Clear message after 5 seconds
        setTimeout(() => setAuthMessage(null), 5000);
      } else if (authError) {
        setAuthMessage({ type: 'error', text: decodeURIComponent(authError) });
        // Clean up URL
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('auth_error');
        window.history.replaceState({}, '', newUrl.toString());
        
        // Clear message after 5 seconds
        setTimeout(() => setAuthMessage(null), 5000);
      }
    };

    checkAuthMessages();
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

  const handleSignOut = async () => {
    await signOut();
    closeMenu();
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
  
  return (
    <>
      {/* Auth Message Banner */}
      {authMessage && (
        <div className={`fixed top-0 left-0 right-0 z-[60] p-4 text-center font-quicksand ${
          authMessage.type === 'success' 
            ? 'bg-green-100 border-b border-green-200 text-green-800' 
            : 'bg-red-100 border-b border-red-200 text-red-800'
        }`}>
          <div className="flex items-center justify-center gap-2">
            <span>{authMessage.text}</span>
            <button 
              onClick={() => setAuthMessage(null)}
              className="ml-2 text-lg font-bold hover:opacity-70"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          authMessage ? 'mt-16' : ''
        } ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : 'bg-transparent'}`}
      >
        <div className="kawaii-container py-3 sm:py-4">
          <div className="flex items-center justify-between min-h-[60px] sm:min-h-[64px]">
            {/* Logo - Enhanced with home icon */}
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0 mr-8 lg:mr-12" onClick={closeMenu}>
              <div className="relative">
                <Paw 
                  size={28} 
                  className="text-kawaii-pink-dark fill-kawaii-pink-dark animate-pulse sm:w-8 sm:h-8" 
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-kawaii-lavender rounded-full flex items-center justify-center">
                  <Home size={10} className="text-kawaii-lavender-dark" />
                </div>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-700 whitespace-nowrap">PawBackHome</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2 xl:space-x-3">
              <NavItem to="/lost-found" icon={<Search size={16} />} onClick={closeMenu}>Lost & Found</NavItem>
              <NavItem to="/crowdfunding" icon={<DollarSign size={16} />} onClick={closeMenu}>Crowdfunding</NavItem>
              <NavItem to="/adoption" icon={<Heart size={16} />} onClick={closeMenu}>Adoption</NavItem>
              <NavItem to="/vets" icon={<Map size={16} />} onClick={closeMenu}>Find Vets</NavItem>
              <NavItem to="/chat" icon={<MessageCircle size={16} />} onClick={closeMenu}>Vet Chat</NavItem>
              <NavItem to="/community" icon={<Users size={16} />} onClick={closeMenu}>Community</NavItem>
              
              {/* Auth Section */}
              <div className="flex items-center space-x-2 ml-4 xl:ml-6 pl-4 xl:pl-6 border-l border-gray-200">
                {user ? (
                  <div className="flex items-center space-x-2">
                    <Link to="/profile" onClick={closeMenu}>
                      <div className="flex items-center gap-2 px-3 xl:px-4 py-2 hover:bg-kawaii-pink/30 rounded-kawaii transition-colors duration-300">
                        {profile?.avatar_url ? (
                          <img 
                            src={profile.avatar_url} 
                            alt="Profile"
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <User size={16} />
                        )}
                        <span className="text-sm xl:text-base font-semibold text-gray-700">
                          {profile?.user_name || 'Profile'}
                        </span>
                      </div>
                    </Link>
                    <button 
                      onClick={handleSignOut}
                      className="px-3 xl:px-4 py-2 text-gray-700 hover:text-kawaii-pink-dark font-semibold transition-colors duration-300 text-sm xl:text-base"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
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
              <span className="text-base sm:text-lg font-bold text-gray-700">PawBackHome</span>
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
            {user ? (
              <>
                <Link to="/profile" onClick={handleMobileNavigation}>
                  <div className="w-full py-3 px-4 bg-kawaii-blue/20 border-2 border-kawaii-blue text-kawaii-blue-dark font-bold rounded-kawaii transition-all duration-300 hover:bg-kawaii-blue/30 flex items-center justify-center gap-2 min-h-[48px]">
                    {profile?.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt="Profile"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <User size={16} />
                    )}
                    {profile?.user_name || 'My Profile'}
                  </div>
                </Link>
                <button 
                  className="w-full py-3 px-4 border-2 border-gray-300 text-gray-700 font-bold rounded-kawaii transition-all duration-300 hover:bg-gray-50 flex items-center justify-center gap-2 min-h-[48px]" 
                  onClick={() => {
                    handleMobileNavigation();
                    handleSignOut();
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
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
      <AuthModal 
        isOpen={showAuthModal}
        onClose={closeAuthModal}
        initialMode={authMode}
      />
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