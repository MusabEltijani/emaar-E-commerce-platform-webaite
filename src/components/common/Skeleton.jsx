import React from 'react';

const Skeleton = ({ 
  className = '', 
  variant = 'rectangular', 
  width, 
  height,
  animation = 'pulse',
  ...props 
}) => {
  const baseClasses = 'bg-gray-200';
  const animationClasses = animation === 'pulse' ? 'animate-pulse' : 'animate-shimmer';
  
  const variantClasses = {
    rectangular: 'rounded',
    circular: 'rounded-full',
    text: 'rounded h-4',
    card: 'rounded-lg',
  };

  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      className={`${baseClasses} ${animationClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      {...props}
    />
  );
};

// Predefined skeleton components
export const SkeletonText = ({ lines = 1, className = '' }) => (
  <div className={className}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        className={`mb-2 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
      />
    ))}
  </div>
);

export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
    <Skeleton variant="rectangular" className="w-full h-48" />
    <div className="p-4">
      <SkeletonText lines={2} />
      <Skeleton variant="text" className="w-1/2 mt-4" />
    </div>
  </div>
);

export const SkeletonProductCard = ({ className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
    <Skeleton variant="rectangular" className="w-full h-48" />
    <div className="p-4">
      <Skeleton variant="text" className="w-full mb-2" />
      <Skeleton variant="text" className="w-3/4 mb-4" />
      <div className="flex items-center justify-between">
        <Skeleton variant="text" className="w-24 h-6" />
        <Skeleton variant="text" className="w-16 h-4" />
      </div>
    </div>
  </div>
);

export default Skeleton;

