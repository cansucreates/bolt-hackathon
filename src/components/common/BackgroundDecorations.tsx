import React, { useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';

const BackgroundDecorations: React.FC = () => {
  const backgroundRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!backgroundRef.current) return;
    
    const createDecorations = () => {
      const background = backgroundRef.current;
      if (!background) return;
      
      // Clear previous decorations
      const existingDecorations = background.querySelectorAll('.decoration');
      existingDecorations.forEach(el => el.remove());
      
      // Reduced count of decorations - only hearts
      const count = window.innerWidth < 768 ? 6 : 8;
      
      // Create new decorations
      for (let i = 0; i < count; i++) {
        createDecoration(background);
      }
    };
    
    const createDecoration = (container: HTMLDivElement) => {
      const decoration = document.createElement('div');
      decoration.classList.add(
        'decoration',
        'absolute',
        'pointer-events-none',
        'transition-all',
        'duration-1000'
      );
      
      // Random position
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      decoration.style.left = `${x}%`;
      decoration.style.top = `${y}%`;
      
      // Random size
      const size = 30 + Math.random() * 40;
      decoration.style.width = `${size}px`;
      decoration.style.height = `${size}px`;
      
      // Random rotation
      const rotation = Math.random() * 360;
      decoration.style.transform = `rotate(${rotation}deg)`;
      
      // Random animation delay
      const delay = Math.random() * 10;
      decoration.style.animationDelay = `${delay}s`;
      
      // Create heart decoration
      const heart = document.createElement('div');
      heart.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="#FFB6D9" stroke="#FFB6D9" stroke-width="1" style="opacity: 0.3"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';
      decoration.appendChild(heart);
      
      // Add animation class
      decoration.classList.add('animate-float');
      
      // Add hover effect
      decoration.addEventListener('mouseenter', () => {
        decoration.style.transform = `rotate(${rotation}deg) scale(1.2)`;
        decoration.style.opacity = '0.6';
      });
      
      decoration.addEventListener('mouseleave', () => {
        decoration.style.transform = `rotate(${rotation}deg) scale(1)`;
        decoration.style.opacity = '0.3';
      });
      
      container.appendChild(decoration);
    };
    
    // Create initial decorations
    createDecorations();
    
    // Update on window resize
    window.addEventListener('resize', createDecorations);
    
    return () => {
      window.removeEventListener('resize', createDecorations);
    };
  }, []);
  
  return (
    <div 
      ref={backgroundRef} 
      className="fixed inset-0 bg-gradient-to-br from-kawaii-pink via-kawaii-blue to-kawaii-purple -z-10 overflow-hidden"
    />
  );
};

export default BackgroundDecorations;