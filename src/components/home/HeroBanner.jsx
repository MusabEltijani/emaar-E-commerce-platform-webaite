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
      className={`relative ${bgColor} ${className} overflow-hidden`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-teal-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div className={`text-center lg:text-right ${textColor}`}>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              {title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl mb-8 text-gray-300"
            >
              {subtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link to={buttonLink}>
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-teal-400 hover:bg-teal-500 text-gray-900 font-bold px-8 py-4 text-lg"
                >
                  {buttonText}
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Image */}
          {image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <img
                src={image}
                alt={title}
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default HeroBanner;

