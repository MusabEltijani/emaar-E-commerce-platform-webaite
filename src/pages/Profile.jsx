import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import {
  FiUser, FiPhone, FiMail, FiLock,
  FiEdit2, FiSave, FiX, FiCamera, FiTrash2,
} from 'react-icons/fi';
import { userAPI } from '../services/api/user';
import { setUser } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader';

/* ── Validation schemas ─────────────────────────────────────── */
const profileSchema = z.object({
  name: z.string().min(1, 'الاسم مطلوب'),
  email: z.string().email('بريد إلكتروني غير صالح').optional().or(z.literal('')),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'كلمة المرور الحالية مطلوبة'),
    newPassword: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
    confirmPassword: z.string().min(1, 'تأكيد كلمة المرور مطلوب'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'كلمتا المرور غير متطابقتين',
    path: ['confirmPassword'],
  });

/* ── Helpers ─────────────────────────────────────────────────── */
const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return parts.length === 1
    ? parts[0][0].toUpperCase()
    : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/* ── Sub-components ──────────────────────────────────────────── */
const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
      <Icon className="w-4 h-4 text-gray-500" />
    </div>
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value || '—'}</p>
    </div>
  </div>
);

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
    {children}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

/* ── Main component ──────────────────────────────────────────── */
const Profile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { user: storeUser } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [imageFile, setImageFile] = useState(null);       // new file selected
  const [imagePreview, setImagePreview] = useState(null); // local preview URL
  const [removeImage, setRemoveImage] = useState(false);  // send removeImage:"true"
  const fileInputRef = useRef(null);

  /* ── Fetch profile ── */
  const { data, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => userAPI.getProfile(),
  });

  // Response: { success, message, data: { ...user } }
  const profileData = data?.data?.data || storeUser;

  /* ── Forms ── */
  const {
    register: regProfile,
    handleSubmit: submitProfile,
    formState: { errors: pErr },
    reset: resetProfileForm,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', email: '' },
  });

  const {
    register: regPwd,
    handleSubmit: submitPwd,
    formState: { errors: wErr },
    reset: resetPwdForm,
  } = useForm({ resolver: zodResolver(passwordSchema) });

  // Sync form when profile data loads
  React.useEffect(() => {
    if (profileData) {
      resetProfileForm({
        name: profileData.name || '',
        email: profileData.email || '',
      });
    }
  }, [profileData, resetProfileForm]);

  /* ── Mutations ── */
  const updateMutation = useMutation({
    mutationFn: (payload) => userAPI.updateProfile(payload),
    onSuccess: (res) => {
      // Response: { success, message, data: { ...updated user } }
      const updated = res?.data?.data;
      if (updated) dispatch(setUser(updated));
      toast.success(t('profile.profileUpdated') || 'تم تحديث الملف الشخصي');
      queryClient.invalidateQueries(['user-profile']);
      setEditMode(false);
      setImageFile(null);
      setImagePreview(null);
      setRemoveImage(false);
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || t('common.error');
      toast.error(msg);
    },
  });

  const pwdMutation = useMutation({
    mutationFn: (payload) => userAPI.changePassword(payload),
    onSuccess: () => {
      toast.success(t('profile.passwordChanged') || 'تم تغيير كلمة المرور');
      resetPwdForm();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || t('common.error'));
    },
  });

  /* ── Handlers ── */
  const onSaveProfile = (formValues) => {
    if (imageFile || removeImage) {
      // Use multipart/form-data when image is involved
      const fd = new FormData();
      if (formValues.name) fd.append('name', formValues.name);
      if (formValues.email) fd.append('email', formValues.email);
      if (imageFile) fd.append('profileImage', imageFile);
      if (removeImage) fd.append('removeImage', 'true');
      updateMutation.mutate(fd);
    } else {
      // Plain JSON when no image change
      const payload = { name: formValues.name };
      if (formValues.email) payload.email = formValues.email;
      updateMutation.mutate(payload);
    }
  };

  const onChangePassword = (d) => {
    pwdMutation.mutate({ currentPassword: d.currentPassword, newPassword: d.newPassword });
  };

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setRemoveImage(false);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const cancelEdit = () => {
    resetProfileForm({ name: profileData?.name || '', email: profileData?.email || '' });
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(false);
    setEditMode(false);
  };

  /* ── Derived values ── */
  const initials = getInitials(profileData?.name);
  const currentImageUrl = removeImage
    ? null
    : imagePreview || profileData?.profileImage || null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">

        {/* ── Profile header card ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5 flex items-center gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center ring-4 ring-primary-100 overflow-hidden">
              {currentImageUrl ? (
                <img src={currentImageUrl} alt={profileData?.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-bold text-white">{initials}</span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900 truncate">
              {profileData?.name || t('common.account')}
            </h1>
            {profileData?.role && (
              <span className="inline-block text-[10px] font-semibold uppercase tracking-wide bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full mb-1">
                {profileData.role}
              </span>
            )}
            {profileData?.phone && (
              <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                <FiPhone className="w-3.5 h-3.5" /> {profileData.phone}
              </p>
            )}
            {profileData?.email && (
              <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                <FiMail className="w-3.5 h-3.5" /> {profileData.email}
              </p>
            )}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5">
          {[
            { id: 'profile', label: t('profile.editProfile') || 'الملف الشخصي', icon: FiUser },
            { id: 'password', label: t('profile.changePassword') || 'كلمة المرور', icon: FiLock },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); cancelEdit(); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === id ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* ── Profile tab ── */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-gray-900">
                {t('profile.editProfile') || 'معلومات الحساب'}
              </h2>
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  <FiEdit2 className="w-3.5 h-3.5" />
                  {t('common.edit') || 'تعديل'}
                </button>
              )}
            </div>

            {/* View mode */}
            {!editMode && (
              <div>
                <InfoRow icon={FiUser} label={t('auth.name') || 'الاسم'} value={profileData?.name} />
                <InfoRow icon={FiPhone} label={t('auth.phone') || 'الهاتف'} value={profileData?.phone} />
                <InfoRow icon={FiMail} label={t('auth.email') || 'البريد الإلكتروني'} value={profileData?.email} />
              </div>
            )}

            {/* Edit mode */}
            {editMode && (
              <form onSubmit={submitProfile(onSaveProfile)} className="space-y-4">

                {/* Image picker */}
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-2">
                    {t('profile.profileImage') || 'صورة الملف الشخصي'}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center ring-4 ring-primary-100 overflow-hidden flex-shrink-0">
                      {currentImageUrl ? (
                        <img src={currentImageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl font-bold text-white">{initials}</span>
                      )}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1.5 text-xs font-medium text-gray-700 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
                      >
                        <FiCamera className="w-3.5 h-3.5" />
                        {imageFile ? 'تغيير' : 'رفع صورة'}
                      </button>
                      {(currentImageUrl || profileData?.profileImage) && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="flex items-center gap-1.5 text-xs font-medium text-red-600 border border-red-100 rounded-lg px-3 py-2 hover:bg-red-50 transition-colors"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                          حذف
                        </button>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImagePick}
                    />
                  </div>
                </div>

                {/* Name */}
                <Field label={t('auth.name') || 'الاسم'} error={pErr.name?.message}>
                  <input
                    {...regProfile('name')}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={t('auth.name') || 'أدخل اسمك'}
                  />
                </Field>

                {/* Email */}
                <Field label={t('auth.email') || 'البريد الإلكتروني'} error={pErr.email?.message}>
                  <input
                    {...regProfile('email')}
                    type="email"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={t('auth.email') || 'أدخل بريدك الإلكتروني'}
                  />
                </Field>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={updateMutation.isLoading}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    {updateMutation.isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FiSave className="w-4 h-4" />
                    )}
                    {t('common.save') || 'حفظ'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                    {t('common.cancel') || 'إلغاء'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ── Password tab ── */}
        {activeTab === 'password' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-5">
              {t('profile.changePassword') || 'تغيير كلمة المرور'}
            </h2>
            <form onSubmit={submitPwd(onChangePassword)} className="space-y-4">
              <Field label={t('auth.currentPassword') || 'كلمة المرور الحالية'} error={wErr.currentPassword?.message}>
                <input
                  {...regPwd('currentPassword')}
                  type="password"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </Field>
              <Field label={t('auth.newPassword') || 'كلمة المرور الجديدة'} error={wErr.newPassword?.message}>
                <input
                  {...regPwd('newPassword')}
                  type="password"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </Field>
              <Field label={t('auth.confirmPassword') || 'تأكيد كلمة المرور'} error={wErr.confirmPassword?.message}>
                <input
                  {...regPwd('confirmPassword')}
                  type="password"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </Field>
              <button
                type="submit"
                disabled={pwdMutation.isLoading}
                className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 mt-2"
              >
                {pwdMutation.isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FiSave className="w-4 h-4" />
                )}
                {t('common.save') || 'حفظ'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
