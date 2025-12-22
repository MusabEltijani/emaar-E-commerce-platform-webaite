import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    setEmail('');
  };

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/assets/logo.png" 
                alt="Emaar Logo" 
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {t('footer.tagline') || 'منصة تسوق إلكتروني موثوقة تقدم أفضل المنتجات بأفضل الأسعار'}
            </p>
            <div className="flex items-center space-x-4 space-x-reverse flex-wrap">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-400 transition-colors p-2">
                <FiFacebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-400 transition-colors p-2">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-400 transition-colors p-2">
                <FiInstagram className="w-5 h-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-400 transition-colors p-2">
                <FiYoutube className="w-5 h-5" />
              </a>
              <a href="https://snapchat.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-400 transition-colors p-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.166 1c-5.488 0-9.83 4.35-9.83 9.83 0 5.48 4.35 9.83 9.83 9.83 5.48 0 9.83-4.35 9.83-9.83 0-5.48-4.35-9.83-9.83-9.83zm0 17.9c-4.45 0-8.07-3.62-8.07-8.07 0-4.45 3.62-8.07 8.07-8.07 4.45 0 8.07 3.62 8.07 8.07 0 4.45-3.62 8.07-8.07 8.07zm-1.58-8.07c0 .87.71 1.58 1.58 1.58s1.58-.71 1.58-1.58-.71-1.58-1.58-1.58-1.58.71-1.58 1.58zm4.73 0c0 .87.71 1.58 1.58 1.58s1.58-.71 1.58-1.58-.71-1.58-1.58-1.58-1.58.71-1.58 1.58z"/>
                </svg>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-400 transition-colors p-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* About Us Column */}
          <div>
            <h4 className="font-semibold mb-4 text-white text-lg">{t('common.aboutUs') || 'من نحن'}</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link to="/about" className="hover:text-primary-400 transition-colors text-sm">
                  {t('footer.aboutEmaar') || 'عن إيمار'}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary-400 transition-colors text-sm">
                  {t('common.privacy')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary-400 transition-colors text-sm">
                  {t('common.terms')}
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-primary-400 transition-colors text-sm">
                  {t('footer.careers') || 'الوظائف'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service Column */}
          <div>
            <h4 className="font-semibold mb-4 text-white text-lg">{t('footer.customerService') || 'خدمة العملاء'}</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link to="/contact" className="hover:text-primary-400 transition-colors text-sm">
                  {t('common.contact')}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary-400 transition-colors text-sm">
                  {t('footer.faq') || 'الأسئلة الشائعة'}
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-primary-400 transition-colors text-sm">
                  {t('footer.shipping') || 'الشحن والتوصيل'}
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-primary-400 transition-colors text-sm">
                  {t('footer.returns') || 'الإرجاع والاستبدال'}
                </Link>
              </li>
            </ul>
          </div>

          {/* My Account Column */}
          <div>
            <h4 className="font-semibold mb-4 text-white text-lg">{t('common.account') || 'حسابي'}</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link to="/profile" className="hover:text-primary-400 transition-colors text-sm">
                  {t('common.profile')}
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-primary-400 transition-colors text-sm">
                  {t('common.orders')}
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-primary-400 transition-colors text-sm">
                  {t('footer.wishlist') || 'قائمة الأمنيات'}
                </Link>
              </li>
              <li>
                <Link to="/addresses" className="hover:text-primary-400 transition-colors text-sm">
                  {t('footer.addresses') || 'العناوين'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter & Mobile App Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 pt-8 border-t border-gray-800">
          {/* Newsletter */}
          <div>
            <h5 className="font-semibold mb-4 text-white text-lg">{t('footer.stayUpdated') || 'اشترك في النشرة الإخبارية'}</h5>
            <p className="text-gray-400 text-sm mb-4">
              {t('footer.newsletterText') || 'احصل على آخر الأخبار والعروض الحصرية'}
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.emailPlaceholder') || 'أدخل بريدك الإلكتروني'}
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
              />
              <button
                type="submit"
                className="bg-teal-400 hover:bg-teal-500 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {t('footer.subscribe') || 'اشترك'}
              </button>
            </form>
          </div>

          {/* Mobile App */}
          <div>
            <h5 className="font-semibold mb-4 text-white text-lg">{t('footer.downloadApp') || 'حمل تطبيقنا'}</h5>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://play.google.com/store/apps"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block hover:opacity-80 transition-opacity"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                  className="h-14"
                />
              </a>
              <a
                href="https://apps.apple.com/app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block hover:opacity-80 transition-opacity"
              >
                <img
                  src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&releaseDate=1289433600"
                  alt="Download on the App Store"
                  className="h-14"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <h5 className="font-semibold mb-4 text-white text-lg">{t('footer.paymentMethods') || 'طرق الدفع'}</h5>
          <div className="flex flex-wrap items-center gap-4">
            <img src="https://www.visa.com/dam/VCOM/regional/me/arabic/images/visa-logo.png" alt="Visa" className="h-8 object-contain opacity-80" />
            <img src="https://www.mastercard.com/content/dam/mccom/global/logos/logo-mastercard.svg" alt="Mastercard" className="h-8 object-contain opacity-80" />
            <img src="https://www.mada.com.sa/images/logo.png" alt="Mada" className="h-8 object-contain opacity-80" />
            <img src="https://www.apple.com/v/apple-pay/a/images/overview/apple_pay_logo_large_2x.png" alt="Apple Pay" className="h-8 object-contain opacity-80" />
            <img src="https://www.stcpay.com.sa/images/logo.png" alt="STC Pay" className="h-8 object-contain opacity-80" />
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8">
          <p className="text-gray-400 text-sm text-center">
            &copy; 2024 {t('common.allRightsReserved') || 'جميع الحقوق محفوظة'} - Emaar E-commerce
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

