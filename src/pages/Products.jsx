import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '../services/api/products';
import { categoriesAPI } from '../services/api/categories';
import { brandsAPI } from '../services/api/brands';
import ProductCard from '../components/products/ProductCard';
import Loader from '../components/common/Loader';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { SkeletonProductCard } from '../components/common/Skeleton';

const Products = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category_id: searchParams.get('category_id') || '',
    brand_id: searchParams.get('brand_id') || '',
    sort: searchParams.get('sort') || '',
    page: parseInt(searchParams.get('page')) || 1,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsAPI.getProducts({ ...filters, limit: 20 }),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAPI.getCategories(),
  });

  const { data: brands } = useQuery({
    queryKey: ['brands'],
    queryFn: () => brandsAPI.getBrands(),
  });

  // Helper function to safely extract data array from API response
  const getDataArray = (response) => {
    if (!response?.data) return [];
    // Handle different response structures
    // Structure: { status, message, data: { items: [...], pagination: {...} } }
    if (response.data.data?.items && Array.isArray(response.data.data.items)) {
      return response.data.data.items;
    }
    // Fallback for other structures
    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response.data.data)) return response.data.data;
    if (response.data.data?.data && Array.isArray(response.data.data.data)) return response.data.data.data;
    return [];
  };

  // Helper function to get pagination info
  const getPagination = (response) => {
    if (!response?.data) return null;
    // Structure: { status, message, data: { items: [...], pagination: {...} } }
    if (response.data.data?.pagination) {
      return response.data.data.pagination;
    }
    // Fallback
    return response.data.pagination || null;
  };

  const productsList = getDataArray(data);
  const categoriesList = getDataArray(categories);
  const brandsList = getDataArray(brands);
  const pagination = getPagination(data);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    // Only set search params for non-empty values
    const paramsToSet = {};
    Object.keys(newFilters).forEach((k) => {
      if (newFilters[k] !== '' && newFilters[k] !== null && newFilters[k] !== undefined) {
        paramsToSet[k] = newFilters[k];
      }
    });
    setSearchParams(paramsToSet);
  };

  const handlePageChange = (newPage) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    // Only set search params for non-empty values
    const paramsToSet = {};
    Object.keys(newFilters).forEach((k) => {
      if (newFilters[k] !== '' && newFilters[k] !== null && newFilters[k] !== undefined) {
        paramsToSet[k] = newFilters[k];
      }
    });
    setSearchParams(paramsToSet);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{t('products.title')}</h1>
        <p className="text-gray-600">{t('products.filter')} {productsList.length} {t('common.products')}</p>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24 border border-gray-100">
            <h3 className="text-xl font-bold mb-4">{t('products.filter')}</h3>
            
            <div className="mb-4">
              <Input
                label={t('common.search')}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder={t('common.search')}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">{t('products.category')}</label>
              <select
                value={filters.category_id}
                onChange={(e) => handleFilterChange('category_id', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">{t('products.category')}</option>
                {categoriesList.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">{t('products.brand')}</label>
              <select
                value={filters.brand_id}
                onChange={(e) => handleFilterChange('brand_id', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">{t('products.brand')}</option>
                {brandsList.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">{t('products.sortBy')}</label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">{t('products.sortBy')}</option>
                <option value="price_asc">{t('products.priceAsc')}</option>
                <option value="price_desc">{t('products.priceDesc')}</option>
                <option value="name_asc">{t('products.nameAsc')}</option>
                <option value="name_desc">{t('products.nameDesc')}</option>
              </select>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                const resetFilters = { search: '', category_id: '', brand_id: '', sort: '', page: 1 };
                setFilters(resetFilters);
                setSearchParams({});
              }}
            >
              {t('common.clear')}
            </Button>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonProductCard key={i} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {productsList.length > 0 ? (
                  productsList.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-16">
                    <p className="text-gray-500 text-xl mb-4">{t('products.noProducts')}</p>
                    <Link to="/" className="text-primary-600 hover:text-primary-700 font-semibold">
                      {t('common.back')} {t('common.home')}
                    </Link>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {pagination && (pagination.totalPages || pagination.pages) > 1 && (
                <div className="flex justify-center items-center space-x-2 space-x-reverse mt-8">
                  <Button
                    variant="outline"
                    disabled={filters.page === 1}
                    onClick={() => handlePageChange(filters.page - 1)}
                  >
                    {t('common.previous')}
                  </Button>
                  <span className="px-4">
                    {t('common.page')} {filters.page} {t('common.of')} {pagination.totalPages || pagination.pages || 1}
                  </span>
                  <Button
                    variant="outline"
                    disabled={filters.page === (pagination.totalPages || pagination.pages || 1)}
                    onClick={() => handlePageChange(filters.page + 1)}
                  >
                    {t('common.next')}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;

