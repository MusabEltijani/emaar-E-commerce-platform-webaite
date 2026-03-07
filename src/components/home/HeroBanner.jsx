import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Button from '../common/Button';

const HeroBanner = ({ 
  title = "أفضل التخفيضات 2022",
  subtitle = "اكتشف أفضل العروض والخصومات الحصرية",
  buttonText = "تسوق الآن",
  buttonLink = "/products",
  image,
  video, // Video URL or path
  isGif = false, // Set to true if using GIF
  bgColor = "bg-gray-900",
  textColor = "text-white",
  className = ""
}) => {
  const { t } = useTranslation();

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative ${className} overflow-hidden`}
      style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}
    >
      {/* Full Width Video/Image Background */}
      <div className="absolute inset-0 w-full h-full">
        {video || isGif ? (
          <>
            {isGif ? (
              <img
                src={video || image}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src={video} type="video/mp4" />
                {/* Fallback image */}
                {image && <img src={image} alt={title} className="w-full h-full object-cover" />}
              </video>
            )}
          </>
        ) : (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      </div>

      {/* Content Container - Full Width with text at bottom */}
      <div className="relative z-10 w-full min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex items-end">
        <div className="w-full px-4 md:px-8 lg:px-16 pb-12 md:pb-16 lg:pb-20">
          {/* Text Content - Bottom Positioned */}
          <div className={`max-w-4xl ${textColor}`}>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight drop-shadow-2xl"
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-gray-100 drop-shadow-lg max-w-2xl"
            >
              {subtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link to={buttonLink}>
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-teal-400 hover:bg-teal-500 text-gray-900 font-bold px-8 py-4 text-lg shadow-2xl hover:scale-105 transition-transform"
                >
                  {buttonText}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default HeroBanner;

