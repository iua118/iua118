'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    department: '',
  });
  const [localError, setLocalError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError('');

    // Validation
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      setLocalError('Vui lòng điền tất cả các trường bắt buộc');
      return;
    }

    if (formData.password.length < 8) {
      setLocalError('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      await register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
      );
      router.push('/dashboard');
    } catch (err: any) {
      setLocalError(err.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">CRM System</h1>
            <p className="text-gray-600">Tạo tài khoản mới</p>
          </div>

          {/* Error Message */}
          {(error || localError) && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error || localError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  Họ
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Nguyễn"
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50 text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Tên
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Văn A"
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50 text-sm"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                disabled={isLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại (tùy chọn)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0912345678"
                disabled={isLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
              />
            </div>

            {/* Department */}
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                Phòng ban (tùy chọn)
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
              >
                <option value="">-- Chọn phòng ban --</option>
                <option value="Sales">Bán hàng</option>
                <option value="Marketing">Marketing</option>
                <option value="Support">Hỗ trợ khách hàng</option>
                <option value="Management">Quản lý</option>
                <option value="Other">Khác</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              {isLoading ? 'Đang đăng ký...' : 'Đăng Ký'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-6">
            Đã có tài khoản?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Đăng nhập
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-4">
          © 2024 CRM System. All rights reserved.
        </p>
      </div>
    </div>
  );
}
