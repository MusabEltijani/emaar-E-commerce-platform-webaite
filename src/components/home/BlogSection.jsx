import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiHeart, FiShare2 } from 'react-icons/fi';

const BlogSection = ({ articles = [] }) => {
  const { t } = useTranslation();

  // Default articles if none provided
  const defaultArticles = [
    {
      id: 1,
      title: "أفضل الطرق لاختيار الهاتف الذكي المناسب",
      description: "دليل شامل لمساعدتك في اختيار الهاتف الذكي الذي يناسب احتياجاتك وميزانيتك",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
      date: "2024-01-15"
    },
    {
      id: 2,
      title: "كيفية الحفاظ على بطارية الهاتف لأطول فترة",
      description: "نصائح عملية لإطالة عمر بطارية هاتفك الذكي والحفاظ على أدائه",
      image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400",
      date: "2024-01-10"
    },
    {
      id: 3,
      title: "أحدث تقنيات الأجهزة الذكية لعام 2024",
      description: "اكتشف أحدث الابتكارات والتقنيات في عالم الأجهزة الذكية والإلكترونيات",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400",
      date: "2024-01-05"
    }
  ];

  const displayArticles = articles.length > 0 ? articles : defaultArticles;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">{t('home.latestArticles') || 'أحدث المقالات'}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayArticles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              <Link to={`/blog/${article.id}`}>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                      <FiHeart className="w-4 h-4 text-gray-700" />
                    </button>
                    <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                      <FiShare2 className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-primary-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {article.description}
                  </p>
                  <span className="text-xs text-gray-400">{article.date}</span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;

