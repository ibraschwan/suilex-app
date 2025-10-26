import React from 'react';
import { Card } from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendPositive?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendPositive = true,
}) => {
  return (
    <Card className="flex min-w-[158px] flex-1 flex-col gap-3 p-7">
      <p className="text-sm font-semibold text-text-secondary-dark/60">{title}</p>
      <p className="text-4xl font-black text-white">
        {value}
      </p>
      {(subtitle || trend) && (
        <p
          className={`text-sm font-medium ${
            trend && trendPositive ? 'text-success' : 'text-text-secondary-dark/70'
          }`}
        >
          {trend || subtitle}
        </p>
      )}
    </Card>
  );
};
