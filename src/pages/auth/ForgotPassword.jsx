import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { authAPI } from '../../services/api/auth';
import toast from 'react-hot-toast';
import Layout from '../../components/layout/Layout';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';

const requestOTPSchema = z.object({
  phone: z.string().min(1, 'Phone is required'),
});

const resetPasswordSchema = z.object({
  phone: z.string().min(1, 'Phone is required'),
  otp: z.string().min(6, 'OTP must be 6 digits'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1); // 1: request OTP, 2: reset password
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [phone, setPhone] = useState('');

  const {
    register: registerRequest,
    handleSubmit: handleSubmitRequest,
    formState: { errors: errorsRequest },
  } = useForm({
    resolver: zodResolver(requestOTPSchema),
  });

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: errorsReset },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onRequestOTP = async (data) => {
    setLoading(true);
    try {
      await authAPI.requestReset(data.phone);
      setPhone(data.phone);
      setOtpSent(true);
      toast.success(t('auth.otpSent'));
      setStep(2);
    } catch (error) {
      console.error('Request OTP error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async (data) => {
    setLoading(true);
    try {
      await authAPI.resetPassword({
        phone: data.phone,
        otp: data.otp,
        newPassword: data.newPassword,
      });
      toast.success(t('auth.resetSuccess'));
      window.location.href = '/login';
    } catch (error) {
      console.error('Reset password error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <h2 className="text-2xl font-bold mb-6 text-center">{t('auth.resetPassword')}</h2>
            {step === 1 ? (
              <form onSubmit={handleSubmitRequest(onRequestOTP)}>
                <Input
                  label={t('auth.phone')}
                  type="tel"
                  {...registerRequest('phone')}
                  error={errorsRequest.phone?.message}
                  placeholder="+966501234567"
                  required
                />
                <Button type="submit" loading={loading} className="w-full">
                  {t('auth.requestOTP')}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmitReset(onResetPassword)}>
                <Input
                  label={t('auth.phone')}
                  type="tel"
                  value={phone}
                  {...registerReset('phone')}
                  error={errorsReset.phone?.message}
                  disabled
                />
                <Input
                  label={t('auth.enterOTP')}
                  type="text"
                  {...registerReset('otp')}
                  error={errorsReset.otp?.message}
                  placeholder="123456"
                  required
                />
                <Input
                  label={t('auth.newPassword')}
                  type="password"
                  {...registerReset('newPassword')}
                  error={errorsReset.newPassword?.message}
                  required
                />
                <Input
                  label={t('auth.confirmPassword')}
                  type="password"
                  {...registerReset('confirmPassword')}
                  error={errorsReset.confirmPassword?.message}
                  required
                />
                <Button type="submit" loading={loading} className="w-full">
                  {t('auth.resetPassword')}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;

