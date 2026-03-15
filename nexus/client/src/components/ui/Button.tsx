import React, { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outlined' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  icon,
  onClick,
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-primary hover:bg-primary/90 text-navy shadow-lg hover:shadow-primary/30 focus:ring-primary/50',
    secondary: 'bg-accent hover:bg-accent/90 text-white shadow-lg hover:shadow-accent/30 focus:ring-accent/50',
    outlined: 'bg-transparent border-2 border-primary hover:bg-primary/10 text-primary focus:ring-primary/30',
    ghost: 'bg-transparent hover:bg-white/10 text-white focus:ring-white/20'
  };
  
  const sizeStyles = {
    small: 'text-sm px-3 py-1.5 rounded',
    medium: 'text-base px-4 py-2',
    large: 'text-lg px-6 py-3'
  };
  
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  const widthStyles = fullWidth ? 'w-full' : '';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabledStyles}
        ${widthStyles}
        ${className}
      `}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;