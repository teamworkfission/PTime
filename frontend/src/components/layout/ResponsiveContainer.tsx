import React from 'react';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`
      w-full mx-auto px-4 sm:px-6 lg:px-8
      max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl
      ${className}
    `}>
      {children}
    </div>
  );
};

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`
      grid gap-4 sm:gap-6 lg:gap-8
      grid-cols-1 md:grid-cols-2 lg:grid-cols-3
      ${className}
    `}>
      {children}
    </div>
  );
};
