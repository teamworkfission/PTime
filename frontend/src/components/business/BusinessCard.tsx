import React from 'react';
import { Business } from '../../types/business';

interface BusinessCardProps {
  business: Business;
  onEdit?: (business: Business) => void;
  onDelete?: (businessId: string) => void;
  onSelect?: (business: Business) => void;
  isSelected?: boolean;
  showActions?: boolean;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  onEdit,
  onDelete,
  onSelect,
  isSelected = false,
  showActions = true,
}) => {
  const getBusinessIcon = (type: string): string => {
    const iconMap: Record<string, string> = {
      'Restaurant': '🍽️',
      'Retail': '🏪',
      'Warehouse': '🏭',
      'Office': '🏢',
      'Healthcare': '🏥',
      'Construction': '🏗️',
      'Manufacturing': '🏭',
      'Hospitality': '🏨',
      'Other': '🏪',
    };
    return iconMap[type] || '🏪';
  };

  const formatEmployeeCount = (count: number): string => {
    if (count === 1) return '1 employee';
    if (count < 100) return `${count} employees`;
    if (count < 1000) return `${Math.floor(count / 100) * 100}+ employees`;
    return `${Math.floor(count / 1000)}k+ employees`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div 
      className={`
        bg-white rounded-lg shadow border transition-all duration-200 cursor-pointer
        ${isSelected 
          ? 'border-primary-500 ring-2 ring-primary-200' 
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
        }
      `}
      onClick={() => onSelect?.(business)}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl" role="img" aria-label="Business type">
              {getBusinessIcon(business.type)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {business.name}
              </h3>
              <p className="text-sm text-gray-600">{business.type}</p>
            </div>
          </div>
          {isSelected && (
            <div className="flex items-center justify-center w-6 h-6 bg-primary-500 rounded-full">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <span className="mr-2">📍</span>
          <span className="truncate">{business.address_city}, {business.address_state}</span>
        </div>

        {/* Employee Count */}
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <span className="mr-2">👥</span>
          <span>{formatEmployeeCount(0)}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            Created {formatDate(business.created_at)}
          </span>
          
          {showActions && (
            <div className="flex space-x-2">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(business);
                  }}
                  className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                  title="Edit business"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Are you sure you want to delete this business?')) {
                      onDelete(business.id);
                    }
                  }}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete business"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
