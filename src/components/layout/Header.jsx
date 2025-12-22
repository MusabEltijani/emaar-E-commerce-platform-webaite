import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiHeart } from 'react-icons/fi';
import { logout } from '../../store/slices/authSlice';
import { setLanguage } from '../../store/slices/uiSlice';
import { authAPI } from '../../services/api/auth';
import toast from 'react-hot-toast';
import MiniCart from '../cart/MiniCart';

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartItemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      dispatch(logout());
      toast.success(t('auth.logoutSuccess'));
      navigate('/');
    } catch (error) {
      dispatch(logout());
      navigate('/');
    }
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    dispatch(setLanguage(lang));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-100">
      {/* Top Bar - About Us, Contact Us, Cart */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="flex items-center space-x-6 space-x-reverse">
              <Link to="/about" className="text-gray-600 hover:text-primary-600 transition-colors">
                {t('common.aboutUs') || 'من نحن'}
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-primary-600 transition-colors">
                {t('common.contact')}
              </Link>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link to="/cart" className="relative flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors">
                <FiShoppingCart className="w-5 h-5" />
                <span className="font-medium">{cartItemCount > 0 ? cartItemCount : '0'}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Logo, Search, User */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img 
              src="/assets/logo.png" 
              alt="Emaar Logo"
              className="h-12 w-12 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </Link>

          {/* Search Bar - Center */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('common.search') || 'ابحث عن منتج...'}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors"
                aria-label={t('common.search')}
              >
                <FiSearch className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Right Side Actions - User, Heart, Language */}
          <div className="flex items-center space-x-3 space-x-reverse flex-shrink-0">
            {/* User Icon */}
            {isAuthenticated ? (
              <div className="relative group">
                <Link to="/profile" className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                  <FiUser className="w-6 h-6 text-gray-700" />
                </Link>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-gray-100">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    {t('common.profile')}
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    {t('common.orders')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {t('common.logout')}
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                <FiUser className="w-6 h-6 text-gray-700" />
              </Link>
            )}

            {/* Heart Icon (Wishlist) */}
            <Link to="/wishlist" className="p-2 hover:bg-gray-100 rounded-md transition-colors relative">
              <FiHeart className="w-6 h-6 text-gray-700" />
            </Link>

            {/* Language Switcher */}
            <button
              onClick={() => handleLanguageChange(i18n.language === 'ar' ? 'en' : 'ar')}
              className="px-3 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {i18n.language === 'ar' ? 'EN' : 'عربي'}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={mobileMenuOpen ? t('common.closeMenu') : t('common.openMenu')}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="hidden lg:block border-t border-gray-100 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-8 space-x-reverse h-14">
            <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium transition-colors py-4 border-b-2 border-transparent hover:border-primary-600">
              {t('common.home')}
            </Link>
            <Link to="/categories" className="text-gray-700 hover:text-primary-600 font-medium transition-colors py-4 border-b-2 border-transparent hover:border-primary-600">
              {t('home.categories')}
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-primary-600 font-medium transition-colors py-4 border-b-2 border-transparent hover:border-primary-600">
              {t('common.products')}
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-primary-600 font-medium transition-colors py-4 border-b-2 border-transparent hover:border-primary-600">
              {t('home.deals') || 'العروض'}
            </Link>
          </div>
        </div>
      </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t animate-slideDown">
            <nav className="flex flex-col space-y-1">
              <Link 
                to="/" 
                className="px-4 py-3 hover:bg-gray-50 rounded-md font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('common.home')}
              </Link>
              <Link 
                to="/products" 
                className="px-4 py-3 hover:bg-gray-50 rounded-md font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('common.products')}
              </Link>
              <Link 
                to="/categories" 
                className="px-4 py-3 hover:bg-gray-50 rounded-md font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('home.categories')}
              </Link>
              <Link 
                to="/products" 
                className="px-4 py-3 hover:bg-gray-50 rounded-md font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('home.brands')}
              </Link>
              {!isAuthenticated && (
                <>
                  <Link 
                    to="/login" 
                    className="px-4 py-3 hover:bg-gray-50 rounded-md font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('common.login')}
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-4 py-3 hover:bg-gray-50 rounded-md font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('common.register')}
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
    </header>
  );
};

export default Header;

