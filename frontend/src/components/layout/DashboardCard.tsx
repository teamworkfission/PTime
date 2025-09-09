import React from 'react';

interface DashboardCardProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
  isActive?: boolean;
  badge?: {
    text: string;
    color: 'red' | 'orange' | 'green' | 'blue' | 'purple';
  };
  stats?: {
    primary: { value: string | number; label: string };
    secondary?: { value: string | number; label: string };
  };
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  icon,
  title,
  description,
  onClick,
  isActive = false,
  badge,
  stats,
}) => {
  const getBadgeColors = (color: string) => {
    const colorMap = {
      red: 'bg-red-100 text-red-800 border-red-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div
      onClick={onClick}
      className={`
        relative group cursor-pointer transition-all duration-200 
        bg-white rounded-xl shadow-sm border-2 p-6
        hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
        ${isActive 
          ? 'border-primary-500 ring-2 ring-primary-200 shadow-md' 
          : 'border-gray-200 hover:border-gray-300'
        }
      `}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute top-4 right-4">
          <span className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
            ${getBadgeColors(badge.color)}
          `}>
            {badge.text}
          </span>
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-4">
        {/* Icon and Title */}
        <div className="flex items-center space-x-3">
          <div className="text-3xl sm:text-4xl flex-shrink-0" role="img" aria-label={title}>
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
              {title}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mt-1 line-clamp-2">
              {description}
            </p>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <div className="text-xl sm:text-2xl font-bold text-primary-600">
                  {stats.primary.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">
                  {stats.primary.label}
                </div>
              </div>
              {stats.secondary && (
                <>
                  <div className="w-px h-8 bg-gray-200 mx-4"></div>
                  <div className="text-center flex-1">
                    <div className="text-xl sm:text-2xl font-bold text-gray-700">
                      {stats.secondary.value}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-1">
                      {stats.secondary.label}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Active Indicator */}
      {isActive && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {/* Hover Effect Arrow */}
      <div className={`
        absolute bottom-4 right-4 transition-all duration-200
        ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
      `}>
        <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};
