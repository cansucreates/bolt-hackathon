import React from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
};

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  hover = false
}) => {
  return (
    <div 
      className={`
        kawaii-card
        ${hover ? 'transition-transform duration-300 hover:scale-105' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;