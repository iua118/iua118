'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [localError, setLocalError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.email || !formData.password) {
      setLocalError('Vui lòng nhập email và mật khẩu');
      return;
    }

    try {
      await login(formData.email, formData.password);
      router.push('/dashboard');
    } catch (err: any) {
      setLocalError(err.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">CRM System</h1>
            <p className="text-gray-600">Đăng nhập vào tài khoản của bạn</p>
          </div>

          {/* Error Message */}
          {(error || localError) && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error || localError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">hoặc</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Register Link */}
          <p className="text-center text-gray-600">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Đăng ký ngay
            </Link>
          </p>

          {/* Demo Account */}
          <div className="mt-6 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-2">
              <span className="font-semibold">Demo Account:</span>
            </p>
            <p className="text-xs text-gray-600">Email: demo@example.com</p>
            <p className="text-xs text-gray-600">Password: Demo@123456</p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-4">
          © 2024 CRM System. All rights reserved.
        </p>
      </div>
    </div>
  );
}
