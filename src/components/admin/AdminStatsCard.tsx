import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface AdminStatsCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const AdminStatsCard: React.FC<AdminStatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend 
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-sm text-muted-foreground">{title}</p>
            
            {trend && (
              <div className={`text-xs flex items-center mt-1 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}%
                <span className="text-muted-foreground ml-1">
                  from last month
                </span>
              </div>
            )}
          </div>
          {icon && (
            <div className="text-muted-foreground">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminStatsCard;
