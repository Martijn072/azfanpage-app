
import React from 'react';
import { User } from 'lucide-react';

interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  src?: string;
  alt?: string;
  className?: string;
}

export const UserAvatar = ({ 
  size = 'md', 
  src, 
  alt = 'User Avatar',
  className = '' 
}: UserAvatarProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-premium-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}>
      <User className={`${iconSizes[size]} text-premium-gray-500 dark:text-gray-400`} />
    </div>
  );
};
