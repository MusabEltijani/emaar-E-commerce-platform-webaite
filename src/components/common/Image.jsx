import React, { useState, useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

// Inline SVG placeholder — neutral image/product icon, no person silhouette
const PLACEHOLDER_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f9fafb'/%3E%3Crect x='140' y='90' width='120' height='90' rx='8' fill='%23e5e7eb'/%3E%3Ccircle cx='168' cy='114' r='10' fill='%23d1d5db'/%3E%3Cpolygon points='140,180 185,135 215,162 240,142 260,180' fill='%23d1d5db'/%3E%3C/svg%3E";

const Image = ({
  src,
  alt,
  className = '',
  wrapperClassName = '',
  placeholder = PLACEHOLDER_SVG,
  fallback = PLACEHOLDER_SVG,
  lazy = true,
  onLoad,
  onError,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(lazy ? null : src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (lazy && inView && !imageSrc) {
      setImageSrc(src);
    } else if (!lazy && !imageSrc) {
      setImageSrc(src);
    }
  }, [inView, lazy, src, imageSrc]);

  const handleLoad = (e) => {
    setIsLoading(false);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setIsLoading(false);
    setHasError(true);
    if (imageSrc !== fallback) {
      setImageSrc(fallback);
    }
    if (onError) onError(e);
  };

  const displaySrc = hasError ? fallback : (imageSrc || placeholder);

  return (
    <div
      ref={lazy ? ref : null}
      className={`relative overflow-hidden ${wrapperClassName}`}
    >
      {/* Shimmer while loading */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <svg
            className="w-10 h-10 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}

      {displaySrc && (
        <img
          ref={imgRef}
          src={displaySrc}
          alt={alt || ''}
          className={`transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${className}`}
          onLoad={handleLoad}
          onError={handleError}
          loading={lazy ? 'lazy' : 'eager'}
          {...props}
        />
      )}
    </div>
  );
};

export default Image;
