'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<'patient' | 'doctor' | 'admin'>('admin');
  const [email, setEmail] = useState('');
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'adminId'>('email');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log({ userType, email, adminId, password, rememberMe, loginMethod });
    
    // Route to admin dashboard after login
    router.push('/dashboard/admin');
  };

  return (
    <div className="flex h-screen overflow-hidden" data-auth-page>
      {/* Left Side - Image Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-100 relative">
        <div className="absolute top-8 left-8 flex items-center gap-2 z-20">
        </div>
        
        <div className="relative w-full h-full p-8">
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <h1 className="text-5xl font-bold text-white text-center leading-tight drop-shadow-2xl px-8" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
                Manage and<br />
                oversee<br />
                healthcare<br />
                excellence.
              </h1>
            </div>
            <video 
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/admin2.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex px-8 py-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <span className="text-2xl font-bold text-brand">Second Opinion</span>
          </div>

          {/* Rounded Box Container */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Staff Sign In</h2>
          <p className="text-gray-600 mb-8">Secure access to system management.</p>

          {/* User Type Tabs */}
          <div className="flex gap-2 mb-6">
            <Link
              href="/auth/login/doctor"
              className="flex-1 py-2.5 px-4 rounded-lg font-medium transition-colors bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 text-center"
            >
              Doctor
            </Link>
            <button
              type="button"
              className="flex-1 py-2.5 px-4 rounded-lg font-medium transition-colors bg-brand text-white"
            >
              Staff
            </button>
          </div>

          {/* Login Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Login Method
            </label>
            <div className="flex gap-4">
              <label className="flex items-center flex-1 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="loginMethod"
                  value="email"
                  checked={loginMethod === 'email'}
                  onChange={(e) => setLoginMethod(e.target.value as 'email')}
                  className="w-4 h-4 border-gray-300"
                  style={{ accentColor: '#10B981' }}
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Email</span>
              </label>
              <label className="flex items-center flex-1 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="loginMethod"
                  value="adminId"
                  checked={loginMethod === 'adminId'}
                  onChange={(e) => setLoginMethod(e.target.value as 'adminId')}
                  className="w-4 h-4 border-gray-300"
                  style={{ accentColor: '#10B981' }}
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Staff ID</span>
              </label>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email or Admin ID Input */}
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
                {loginMethod === 'email' ? 'Email Address' : 'Admin ID'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {loginMethod === 'email' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                  )}
                </span>
                <input
                  type={loginMethod === 'email' ? 'email' : 'text'}
                  id="identifier"
                  value={loginMethod === 'email' ? email : adminId}
                  onChange={(e) => loginMethod === 'email' ? setEmail(e.target.value) : setAdminId(e.target.value)}
                  placeholder={loginMethod === 'email' ? 'e.g., admin@example.com' : 'e.g., ADM-12345'}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Two-Factor Authentication Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-sm text-amber-900">
                  <strong>Enhanced Security:</strong> Two-factor authentication will be required after login.
                </p>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 border-gray-300 rounded focus:ring-brand"
                  style={{ accentColor: '#3E7FA6' }}
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link href="/auth/forgot-password/admin" className="text-sm text-brand hover:text-brand-hover font-medium">
                Forgot Password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-brand text-white py-3 rounded-lg font-semibold bg-brand-hover transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
            >
              Sign in now
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-gray-700">
                All admin activities are logged and monitored for security purposes.
              </p>
            </div>
          </div>

          {/* Contact Support Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Need help?{' '}
            <Link href="/support" className="text-brand hover:text-brand-hover font-medium">
              Contact Support
            </Link>
          </p>
          </div>
          {/* End of Rounded Box Container */}
        </div>
      </div>
    </div>
  );
}
