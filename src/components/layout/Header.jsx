import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiLogOut, FiPackage, FiSettings } from 'react-icons/fi';
import { logout } from '../../store/slices/authSlice';
import { setLanguage } from '../../store/slices/uiSlice';
import { authAPI } from '../../services/api/auth';
import toast from 'react-hot-toast';

// Returns 1-2 initials from a name string
const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const UserDropdown = ({ user, onLogout, t }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = getInitials(user?.name);
  const displayName = user?.name || user?.phone || t('common.account');

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-gray-50 transition-colors"
        aria-expanded={open}
      >
        {/* Avatar circle */}
        <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0 ring-2 ring-primary-100">
          {user?.avatar || user?.profileImage ? (
            <img
              src={user.avatar || user.profileImage}
              alt={displayName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <span className="text-xs font-bold text-white leading-none">{initials}</span>
          )}
        </div>
        {/* Name — hidden on small screens */}
        <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
          {displayName}
        </span>
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-fadeIn">
          {/* User info header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                {user?.avatar || user?.profileImage ? (
                  <img
                    src={user.avatar || user.profileImage}
                    alt={displayName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold text-white">{initials}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || t('common.account')}</p>
                {user?.phone && <p className="text-xs text-gray-500 truncate">{user.phone}</p>}
                {user?.email && <p className="text-xs text-gray-500 truncate">{user.email}</p>}
              </div>
            </div>
          </div>

          {/* Menu items */}
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FiSettings className="w-4 h-4 text-gray-400" />
            {t('common.profile')}
          </Link>
          <Link
            to="/orders"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FiPackage className="w-4 h-4 text-gray-400" />
            {t('common.orders')}
          </Link>

          <div className="border-t border-gray-100 mt-1 pt-1">
            <button
              onClick={() => { setOpen(false); onLogout(); }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <FiLogOut className="w-4 h-4" />
              {t('common.logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartItemCount = items.reduce((sum, item) => sum + (item.qty || 1), 0);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (_) {
      // ignore logout API errors
    } finally {
      dispatch(logout());
      toast.success(t('auth.logoutSuccess'));
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
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-100">
      {/* Top Bar */}
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

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img src="/assets/logo.svg" alt="Emaar Logo" className="h-20 w-auto object-contain" />
          </Link>

          {/* Search Bar */}
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
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors"
                aria-label={t('common.search')}
              >
                <FiSearch className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* User */}
            {isAuthenticated ? (
              <UserDropdown user={user} onLogout={handleLogout} t={t} />
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FiUser className="w-4 h-4" />
                <span className="hidden sm:inline">{t('common.login')}</span>
              </Link>
            )}

            <button
              onClick={() => handleLanguageChange(i18n.language === 'ar' ? 'en' : 'ar')}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {i18n.language === 'ar' ? 'EN' : 'عربي'}
            </button>

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

      {/* Navigation */}
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
        <div className="lg:hidden py-4 border-t">
          <nav className="flex flex-col space-y-1">
            <Link to="/" className="px-4 py-3 hover:bg-gray-50 rounded-md font-medium" onClick={() => setMobileMenuOpen(false)}>
              {t('common.home')}
            </Link>
            <Link to="/products" className="px-4 py-3 hover:bg-gray-50 rounded-md font-medium" onClick={() => setMobileMenuOpen(false)}>
              {t('common.products')}
            </Link>
            <Link to="/categories" className="px-4 py-3 hover:bg-gray-50 rounded-md font-medium" onClick={() => setMobileMenuOpen(false)}>
              {t('home.categories')}
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="px-4 py-3 hover:bg-gray-50 rounded-md font-medium flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <FiSettings className="w-4 h-4" /> {t('common.profile')}
                </Link>
                <Link to="/orders" className="px-4 py-3 hover:bg-gray-50 rounded-md font-medium flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <FiPackage className="w-4 h-4" /> {t('common.orders')}
                </Link>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="px-4 py-3 hover:bg-red-50 rounded-md font-medium text-red-600 flex items-center gap-2 w-full text-start"
                >
                  <FiLogOut className="w-4 h-4" /> {t('common.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-3 hover:bg-gray-50 rounded-md font-medium" onClick={() => setMobileMenuOpen(false)}>
                  {t('common.login')}
                </Link>
                <Link to="/register" className="px-4 py-3 hover:bg-gray-50 rounded-md font-medium" onClick={() => setMobileMenuOpen(false)}>
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
