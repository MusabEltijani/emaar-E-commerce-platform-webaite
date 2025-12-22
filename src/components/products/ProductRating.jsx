import React from 'react';
import { FiStar } from 'react-icons/fi';

const ProductRating = ({ rating = 0, reviewCount = 0, showCount = true }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {Array.from({ length: fullStars }).map((_, i) => (
          <FiStar key={`full-${i}`} className="w-5 h-5 text-yellow-400 fill-current" />
        ))}
        {hasHalfStar && (
          <div className="relative w-5 h-5">
            <FiStar className="w-5 h-5 text-gray-300 absolute" />
            <div className="overflow-hidden w-1/2">
              <FiStar className="w-5 h-5 text-yellow-400 fill-current" />
            </div>
          </div>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <FiStar key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
        ))}
      </div>
      {showCount && (
        <span className="text-sm text-gray-600">
          ({rating.toFixed(1)}) {reviewCount > 0 && `(${reviewCount} ${reviewCount === 1 ? 'review' : 'reviews'})`}
        </span>
      )}
    </div>
  );
};

export default ProductRating;

