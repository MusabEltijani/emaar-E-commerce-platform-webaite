import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CURRENCY_SYMBOL } from '../../utils/constants';

const PriceRangeSlider = ({ value, onChange, min = 0, max = 10000, className = '' }) => {
  const { t } = useTranslation();
  const [localMin, setLocalMin] = useState(value.min);
  const [localMax, setLocalMax] = useState(value.max);

  useEffect(() => {
    setLocalMin(value.min);
    setLocalMax(value.max);
  }, [value]);

  const handleMinChange = (e) => {
    const newMin = parseInt(e.target.value, 10) || 0;
    setLocalMin(newMin);
    if (newMin <= localMax) {
      onChange({ min: newMin, max: localMax });
    }
  };

  const handleMaxChange = (e) => {
    const newMax = parseInt(e.target.value, 10) || max;
    setLocalMax(newMax);
    if (newMax >= localMin) {
      onChange({ min: localMin, max: newMax });
    }
  };

  const handleMinSliderChange = (e) => {
    const newMin = parseInt(e.target.value, 10);
    setLocalMin(newMin);
    if (newMin <= localMax) {
      onChange({ min: newMin, max: localMax });
    }
  };

  const handleMaxSliderChange = (e) => {
    const newMax = parseInt(e.target.value, 10);
    setLocalMax(newMax);
    if (newMax >= localMin) {
      onChange({ min: localMin, max: newMax });
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-semibold mb-3 text-gray-900">
        {t('products.priceRange')}
      </label>
      
      {/* Price Inputs */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1">
          <label className="text-xs text-gray-500 mb-1 block">{t('products.minPrice')}</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              {CURRENCY_SYMBOL}
            </span>
            <input
              type="number"
              value={localMin}
              onChange={handleMinChange}
              min={min}
              max={max}
              className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
          </div>
        </div>
        <span className="text-gray-400 mt-5">-</span>
        <div className="flex-1">
          <label className="text-xs text-gray-500 mb-1 block">{t('products.maxPrice')}</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              {CURRENCY_SYMBOL}
            </span>
            <input
              type="number"
              value={localMax}
              onChange={handleMaxChange}
              min={min}
              max={max}
              className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Range Sliders */}
      <div className="relative pt-2 pb-4">
        <div className="relative h-2 bg-gray-200 rounded-full">
          <div
            className="absolute h-2 bg-primary-600 rounded-full"
            style={{
              left: `${(localMin / max) * 100}%`,
              right: `${100 - (localMax / max) * 100}%`,
            }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={localMin}
          onChange={handleMinSliderChange}
          className="absolute w-full h-2 top-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
          style={{ zIndex: localMin > max - 100 ? 5 : 3 }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={localMax}
          onChange={handleMaxSliderChange}
          className="absolute w-full h-2 top-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
          style={{ zIndex: 4 }}
        />
      </div>
    </div>
  );
};

export default PriceRangeSlider;
