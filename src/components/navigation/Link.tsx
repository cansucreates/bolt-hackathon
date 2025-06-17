import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

type LinkProps = {
  to: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

export const Link: React.FC<LinkProps> = ({ to, className = '', children, onClick }) => {
  const handleClick = () => {
    // Scroll to top when navigating
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
    
    // Call any additional onClick handler
    if (onClick) {
      onClick();
    }
  };

  return (
    <RouterLink to={to} className={className} onClick={handleClick}>
      {children}
    </RouterLink>
  );
};