import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false
}) => {
  const baseStyles = 'glass-card rounded-2xl p-5 transition-all';
  const hoverStyles = hover ? 'glass-card-hover cursor-pointer' : '';

  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};
