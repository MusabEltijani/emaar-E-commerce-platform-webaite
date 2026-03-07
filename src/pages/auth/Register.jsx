import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { authAPI } from '../../services/api/auth';
import { setCredentials } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const Register = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = data;
      const response = await authAPI.register({
        ...registerData,
        language: i18n.language,
      });
      
      // Extract tokens from API response: { success, data: { token: { access, refresh }, user, id } }
      const apiData = response.data?.data || response.data;
      const tokens = apiData.token || {};
      const user = apiData.user || { id: apiData.id, ...registerData };
      
      // Dispatch credentials with proper token keys
      dispatch(setCredentials({
        user,
        accessToken: tokens.access,
        refreshToken: tokens.refresh,
      }));
      
      // Clear guest cart after successful registration
      localStorage.removeItem('guest_cart_id');
      
      toast.success(t('auth.registerSuccess') || 'تم التسجيل بنجاح');
      navigate('/');
    } catch (error) {
      console.error('Register error:', error);
      toast.error(error.response?.data?.message || t('auth.registerError') || 'خطأ في التسجيل');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <h2 className="text-2xl font-bold mb-6 text-center">{t('auth.registerTitle')}</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              label={t('auth.name')}
              {...register('name')}
              error={errors.name?.message}
              required
            />
            <Input
              label={t('auth.phone')}
              type="tel"
              {...register('phone')}
              error={errors.phone?.message}
              placeholder="+966501234567"
              required
            />
            <Input
              label={t('auth.email')}
              type="email"
              {...register('email')}
              error={errors.email?.message}
            />
            <Input
              label={t('auth.password')}
              type="password"
              {...register('password')}
              error={errors.password?.message}
              required
            />
            <Input
              label={t('auth.confirmPassword')}
              type="password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
              required
            />
            <Button type="submit" loading={loading} className="w-full mb-4">
              {t('common.register')}
            </Button>
            <div className="text-center">
              <span className="text-gray-600">{t('auth.haveAccount')} </span>
              <Link to="/login" className="text-primary-600 hover:underline">
                {t('common.login')}
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;

