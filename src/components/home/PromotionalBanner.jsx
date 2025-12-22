import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const PromotionalBanner = ({
  title = "أفضل صوت نقي",
  image,
  bgColor = "bg-white",
  textColor = "text-gray-900",
  link = "/products",
  className = ""
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`${bgColor} rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
    >
      <Link to={link} className="block">
        <div className="relative h-48 overflow-hidden">
          {image && (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-4 right-4 left-4">
            <h3 className={`${textColor} font-bold text-xl`}>
              {title}
            </h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PromotionalBanner;

