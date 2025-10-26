import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'primary' | 'secondary' | 'default';
  icon?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  icon,
  className = ''
}) => {
  const variants = {
    success: 'bg-success/10 text-success border border-success/30 shadow-[0_0_12px_rgba(34,197,94,0.2)]',
    primary: 'bg-primary/10 text-primary border border-primary/30',
    secondary: 'bg-secondary/10 text-secondary border border-secondary/30',
    default: 'bg-white/5 text-text-secondary-dark border border-white/10',
  };

  return (
    <div className={`flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${variants[variant]} ${className}`}>
      {icon && <span className="material-symbols-outlined text-[14px]">{icon}</span>}
      <span>{children}</span>
    </div>
  );
};
