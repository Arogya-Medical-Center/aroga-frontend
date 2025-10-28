'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle forgot password logic here
    console.log({ email });
    setIsSubmitted(true);
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
                Get trusted<br />
                medical<br />
                opinions in<br />
                minutes.
              </h1>
            </div>
            <video 
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/doctor.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

      </div>

      {/* Right Side - Forgot Password Form */}
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
          {!isSubmitted ? (
            <>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
              <p className="text-gray-600 mb-8">
                No worries! Enter your email and we&apos;ll send you reset instructions.
              </p>

              {/* User Type Tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  type="button"
                  className="flex-1 py-2.5 px-4 rounded-lg font-medium transition-colors bg-brand text-white"
                >
                  Patient
                </button>
                <Link
                  href="/auth/forgot-password/doctor"
                  className="flex-1 py-2.5 px-4 rounded-lg font-medium transition-colors bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 text-center"
                >
                  Doctor
                </Link>
                <Link
                  href="/auth/forgot-password/admin"
                  className="flex-1 py-2.5 px-4 rounded-lg font-medium transition-colors bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 text-center"
                >
                  Admin
                </Link>
              </div>

              {/* Forgot Password Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g., patient@example.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-brand text-white py-3 rounded-lg font-semibold bg-brand-hover transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
                >
                  Send reset link
                </button>
              </form>

              {/* Back to Sign In Link */}
              <div className="mt-6 text-center">
                <Link href="/auth/login/patient" className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Sign in
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                {/* Success Icon */}
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-2">Check your email</h2>
                <p className="text-gray-600 mb-6">
                  We&apos;ve sent password reset instructions to:
                </p>
                <p className="text-brand font-semibold mb-8">{email}</p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-700">
                    <strong>Didn&apos;t receive the email?</strong> Check your spam folder or{' '}
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-brand hover:text-brand-hover font-medium underline"
                    >
                      try another email address
                    </button>
                  </p>
                </div>

                {/* Back to Sign In Button */}
                <Link
                  href="/auth/login/patient"
                  className="inline-flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Sign in
                </Link>
              </div>
            </>
          )}
          </div>
          {/* End of Rounded Box Container */}
        </div>
      </div>
    </div>
  );
}
