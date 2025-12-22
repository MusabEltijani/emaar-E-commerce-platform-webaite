import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

const CustomerReviews = ({ reviews = [] }) => {
  const { t } = useTranslation();

  // Default reviews if none provided
  const defaultReviews = [
    {
      id: 1,
      name: "أحمد محمد",
      rating: 5,
      comment: "تجربة رائعة! المنتجات عالية الجودة والتوصيل سريع جداً. أنصح الجميع بالتسوق من هنا."
    },
    {
      id: 2,
      name: "فاطمة علي",
      rating: 5,
      comment: "خدمة عملاء ممتازة وأسعار منافسة. سأعود بالتأكيد للتسوق مرة أخرى."
    },
    {
      id: 3,
      name: "خالد سعيد",
      rating: 4,
      comment: "منصة موثوقة ومنتجات أصلية. التوصيل كان في الوقت المحدد تماماً."
    }
  ];

  const displayReviews = reviews.length > 0 ? reviews : defaultReviews;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">{t('home.customerReviews') || 'آراء العملاء'}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg mr-4">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{review.name}</h4>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">{review.comment}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;

