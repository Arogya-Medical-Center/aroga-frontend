'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function DoctorForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [medicalLicense, setMedicalLicense] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<'email' | 'license'>('email');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle forgot password logic here
    console.log({ email, medicalLicense, verificationMethod });
    setIsSubmitted(true);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-100 relative">
        <div className="absolute top-8 left-8 flex items-center gap-2 z-20">
        </div>
        
        <div className="relative w-full h-full p-8">
          <div className="relative w-full h-full border-8 rounded-lg overflow-hidden" style={{ borderColor: '#E8EAED' }}>
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/20">
              <h1 className="text-5xl font-bold text-white text-center leading-tight drop-shadow-lg px-8">
                Provide trusted<br />
                medical<br />
                opinions<br />
                anywhere.
              </h1>
            </div>
            <Image 
              src="/doctor.jpg" 
              alt="Doctor consultation" 
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

      </div>

      {/* Right Side - Forgot Password Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-white">
        <div className="w-full max-w-md">
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
                Enter your details and we&apos;ll send you reset instructions.
              </p>

              {/* Verification Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Verification Method
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center flex-1 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="verification"
                      value="email"
                      checked={verificationMethod === 'email'}
                      onChange={(e) => setVerificationMethod(e.target.value as 'email')}
                      className="w-4 h-4 border-gray-300"
                      style={{ accentColor: '#3E7FA6' }}
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Email</span>
                  </label>
                  <label className="flex items-center flex-1 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="verification"
                      value="license"
                      checked={verificationMethod === 'license'}
                      onChange={(e) => setVerificationMethod(e.target.value as 'license')}
                      className="w-4 h-4 border-gray-300"
                      style={{ accentColor: '#3E7FA6' }}
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">License</span>
                  </label>
                </div>
              </div>

              {/* Forgot Password Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {verificationMethod === 'email' ? (
                  /* Email Input */
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
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
                        placeholder="e.g., doctor@hospital.com"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  /* Medical License Input */
                  <>
                    <div>
                      <label htmlFor="medical-license" className="block text-sm font-medium text-gray-700 mb-2">
                        Medical License Number
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </span>
                        <input
                          type="text"
                          id="medical-license"
                          value={medicalLicense}
                          onChange={(e) => setMedicalLicense(e.target.value)}
                          placeholder="e.g., ML123456789"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email-backup" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address (for verification)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </span>
                        <input
                          type="email"
                          id="email-backup"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g., doctor@hospital.com"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-gray-700">
                      {verificationMethod === 'email' 
                        ? 'We\'ll send a password reset link to your registered email address.'
                        : 'We\'ll verify your medical license number and send a reset link to your registered email.'}
                    </p>
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
                <Link href="/auth/login/doctor" className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-2">
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
                <p className="text-brand font-semibold mb-4">{email}</p>
                
                {verificationMethod === 'license' && medicalLicense && (
                  <p className="text-sm text-gray-600 mb-8">
                    Medical License: <span className="font-semibold">{medicalLicense}</span>
                  </p>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-700">
                    <strong>Didn&apos;t receive the email?</strong> Check your spam folder or{' '}
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-brand hover:text-brand-hover font-medium underline"
                    >
                      try again
                    </button>
                  </p>
                </div>

                {/* Security Notice */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-sm text-amber-900">
                      For security, if you did not request this reset, please contact support immediately.
                    </p>
                  </div>
                </div>

                {/* Back to Sign In Button */}
                <Link
                  href="/auth/login/doctor"
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
