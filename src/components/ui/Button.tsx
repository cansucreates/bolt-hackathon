import React from 'react';

type ButtonVariant = 'primary' | 'blue' | 'green' | 'yellow';

type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '',
  icon,
  onClick,
  ...props 
}) => {
  const baseClass = 'kawaii-button';
  
  const variantClass = {
    primary: '',
    blue: 'bg-kawaii-blue hover:bg-kawaii-blue-dark focus:ring-kawaii-blue-dark',
    green: 'bg-kawaii-green hover:bg-kawaii-green-dark focus:ring-kawaii-green-dark',
    yellow: 'bg-kawaii-yellow hover:bg-kawaii-yellow-dark focus:ring-kawaii-yellow-dark'
  };
  
  return (
    <button 
      className={`${baseClass} ${variantClass[variant]} ${className} ${icon ? 'flex items-center' : ''}`} 
      onClick={onClick}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;