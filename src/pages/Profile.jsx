import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { userAPI } from '../services/api/user';
import { setUser } from '../store/slices/authSlice';
import { setLanguage } from '../store/slices/uiSlice';
import toast from 'react-hot-toast';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const Profile = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileImage, setProfileImage] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => userAPI.getProfile(),
  });

  const profileData = data?.data || user;

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: errorsProfile },
    reset: resetProfile,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profileData?.name || '',
      email: profileData?.email || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
    reset: resetPassword,
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  React.useEffect(() => {
    if (profileData) {
      resetProfile({
        name: profileData.name || '',
        email: profileData.email || '',
      });
    }
  }, [profileData, resetProfile]);

  const updateProfileMutation = useMutation({
    mutationFn: (formData) => userAPI.updateProfile(formData),
    onSuccess: (response) => {
      dispatch(setUser(response.data.user));
      if (response.data.user.language) {
        i18n.changeLanguage(response.data.user.language);
        dispatch(setLanguage(response.data.user.language));
      }
      toast.success(t('profile.profileUpdated'));
      queryClient.invalidateQueries(['user-profile']);
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data) => userAPI.changePassword(data),
    onSuccess: () => {
      toast.success(t('profile.passwordChanged'));
      resetPassword();
    },
  });

  const onUpdateProfile = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.email) formData.append('email', data.email);
    if (profileImage) formData.append('profileImage', profileImage);
    formData.append('language', i18n.language);

    updateProfileMutation.mutate(formData);
  };

  const onChangePassword = (data) => {
    const { confirmPassword, ...passwordData } = data;
    changePasswordMutation.mutate(passwordData);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('profile.title')}</h1>

      <div className="max-w-2xl mx-auto">
        {/* Tabs */}
        <div className="flex space-x-4 space-x-reverse mb-6 border-b">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'profile'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600'
            }`}
          >
            {t('profile.editProfile')}
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'password'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600'
            }`}
          >
            {t('profile.changePassword')}
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <Card>
            <h2 className="text-xl font-bold mb-4">{t('profile.editProfile')}</h2>
            <form onSubmit={handleSubmitProfile(onUpdateProfile)}>
              <div className="mb-4">
                {profileData?.profileImage && (
                  <img
                    src={profileData.profileImage}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover mb-4"
                  />
                )}
                <label className="block text-sm font-medium mb-2">
                  {t('profile.profileImage')}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfileImage(e.target.files[0])}
                  className="mb-4"
                />
              </div>
              <Input
                label={t('auth.name')}
                {...registerProfile('name')}
                error={errorsProfile.name?.message}
                required
              />
              <Input
                label={t('auth.email')}
                type="email"
                {...registerProfile('email')}
                error={errorsProfile.email?.message}
              />
              <Button
                type="submit"
                loading={updateProfileMutation.isLoading}
                className="w-full"
              >
                {t('common.save')}
              </Button>
            </form>
          </Card>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <Card>
            <h2 className="text-xl font-bold mb-4">{t('profile.changePassword')}</h2>
            <form onSubmit={handleSubmitPassword(onChangePassword)}>
              <Input
                label={t('auth.currentPassword')}
                type="password"
                {...registerPassword('currentPassword')}
                error={errorsPassword.currentPassword?.message}
                required
              />
              <Input
                label={t('auth.newPassword')}
                type="password"
                {...registerPassword('newPassword')}
                error={errorsPassword.newPassword?.message}
                required
              />
              <Input
                label={t('auth.confirmPassword')}
                type="password"
                {...registerPassword('confirmPassword')}
                error={errorsPassword.confirmPassword?.message}
                required
              />
              <Button
                type="submit"
                loading={changePasswordMutation.isLoading}
                className="w-full"
              >
                {t('common.save')}
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;

