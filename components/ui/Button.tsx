import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'flex items-center justify-center font-bold transition-all cursor-pointer';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover rounded-lg',
    secondary: 'bg-primary/20 text-primary hover:bg-primary/30 rounded-lg',
    outline: 'bg-transparent border border-border-dark text-text-secondary-dark hover:bg-white/5 hover:text-text-primary-dark rounded-lg',
    ghost: 'bg-white/10 hover:bg-white/20 text-white rounded-lg',
    pill: 'bg-white text-black font-semibold hover:bg-white/90 hover:shadow-xl rounded-full shadow-[0_4px_12px_rgba(255,255,255,0.1)]',
  };

  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-10 px-5 text-sm',
    lg: 'h-12 px-7 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
