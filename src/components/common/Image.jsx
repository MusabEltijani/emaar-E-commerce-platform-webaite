import React, { useState, useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const Image = ({
  src,
  alt,
  className = '',
  placeholder = '/placeholder.png',
  fallback = '/placeholder.png',
  lazy = true,
  onLoad,
  onError,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(lazy ? null : src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // Intersection Observer for lazy loading
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

  // Determine the actual image source
  const displaySrc = hasError ? fallback : (imageSrc || placeholder);

  return (
    <div
      ref={lazy ? ref : null}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Loading placeholder */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}

      {/* Actual image */}
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

