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
import Layout from '../../components/layout/Layout';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';

const loginSchema = z.object({
  phone: z.string().min(1, 'Phone is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await authAPI.login(data);
      dispatch(setCredentials(response.data));
      toast.success(t('auth.loginSuccess'));
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <h2 className="text-2xl font-bold mb-6 text-center">{t('auth.loginTitle')}</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                label={t('auth.phone')}
                type="tel"
                {...register('phone')}
                error={errors.phone?.message}
                placeholder="+966501234567"
                required
              />
              <Input
                label={t('auth.password')}
                type="password"
                {...register('password')}
                error={errors.password?.message}
                required
              />
              <div className="mb-4">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">{t('auth.rememberMe')}</span>
                </label>
              </div>
              <Button type="submit" loading={loading} className="w-full mb-4">
                {t('common.login')}
              </Button>
              <div className="text-center">
                <Link to="/forgot-password" className="text-primary-600 hover:underline">
                  {t('auth.forgotPassword')}
                </Link>
              </div>
              <div className="mt-4 text-center">
                <span className="text-gray-600">{t('auth.dontHaveAccount')} </span>
                <Link to="/register" className="text-primary-600 hover:underline">
                  {t('common.register')}
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Login;

