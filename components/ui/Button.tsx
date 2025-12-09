import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon,
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-md";
  
  const variants = {
    // Primary: Brand Orange
    primary: "bg-brand-orange text-white hover:bg-orange-700 focus:ring-orange-500",
    // Secondary: Brand Dark (Slate)
    secondary: "bg-brand-dark text-white hover:bg-slate-900 focus:ring-slate-500",
    // Outline: White with Slate border
    outline: "border border-slate-300 text-slate-700 bg-white hover:bg-orange-50 focus:ring-orange-500 hover:border-brand-orange hover:text-brand-orange",
    // Soft: Light Slate background (Good for groups of actions)
    soft: "bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-400",
    // Danger: Red
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};