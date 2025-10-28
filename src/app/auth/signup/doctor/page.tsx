'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

export default function DoctorSignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [userType, setUserType] = useState<'patient' | 'doctor' | 'admin'>('doctor');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [medicalLicense, setMedicalLicense] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [hospitalAffiliation, setHospitalAffiliation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const specializations = [
    'General Practice',
    'Cardiology',
    'Dermatology',
    'Endocrinology',
    'Gastroenterology',
    'Neurology',
    'Oncology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Radiology',
    'Surgery',
    'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    console.log({ 
      userType, 
      fullName, 
      email, 
      mobile, 
      medicalLicense, 
      specialization, 
      yearsOfExperience,
      hospitalAffiliation,
      password, 
      confirmPassword, 
      agreeToTerms 
    });
    // Redirect to admin dashboard after successful signup
    router.push('/dashboard/admin');
  };

  const googleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log('Google signup success:', tokenResponse);
      
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        
        const userData = await userInfo.json();
        console.log('User data:', userData);
        
        // Use the auth context login with Google user data
        await login(userData.email, 'google-oauth', 'doctor');
        
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    },
    onError: (error) => {
      console.error('Google signup failed:', error);
    },
  });

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
                Join our network<br />
                of trusted<br />
                medical<br />
                professionals.
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

      {/* Right Side - Signup Form */}
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
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Doctor Sign Up</h2>
          <p className="text-gray-600 mb-8">Join our network of healthcare professionals.</p>

          {/* User Type Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              className="flex-1 py-2.5 px-4 rounded-lg font-medium transition-colors bg-brand text-white"
            >
              Doctor
            </button>
            <Link
              href="/auth/login/admin"
              className="flex-1 py-2.5 px-4 rounded-lg font-medium transition-colors bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 text-center"
            >
              Staff
            </Link>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Input */}
            <div>
              <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  type="text"
                  id="full-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., Dr. John Doe"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
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

            {/* Mobile Input */}
            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <input
                  type="tel"
                  id="mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="e.g., +1234567890"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Medical License Input */}
            <div>
              <label htmlFor="medical-license" className="block text-sm font-medium text-gray-700 mb-2">
                Medical License Number <span className="text-red-500">*</span>
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

            {/* Specialization Dropdown */}
            <div>
              <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                Specialization <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </span>
                <select
                  id="specialization"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent appearance-none"
                  required
                >
                  <option value="">Select specialization</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Years of Experience */}
            <div>
              <label htmlFor="years-experience" className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <input
                  type="number"
                  id="years-experience"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                  placeholder="e.g., 10"
                  min="0"
                  max="70"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Hospital Affiliation */}
            <div>
              <label htmlFor="hospital" className="block text-sm font-medium text-gray-700 mb-2">
                Hospital/Clinic Affiliation
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </span>
                <input
                  type="text"
                  id="hospital"
                  value={hospitalAffiliation}
                  onChange={(e) => setHospitalAffiliation(e.target.value)}
                  placeholder="e.g., City General Hospital"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
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

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="agree-terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="w-4 h-4 mt-1 border-gray-300 rounded focus:ring-brand"
                style={{ accentColor: '#10B981' }}
                required
              />
              <label htmlFor="agree-terms" className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <Link href="/terms" className="text-brand hover:text-brand-hover font-medium">
                  Terms and Conditions
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-brand hover:text-brand-hover font-medium">
                  Privacy Policy
                </Link>
                , and I confirm that all provided information is accurate.
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full bg-brand text-white py-3 rounded-lg font-semibold bg-brand-hover transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
            >
              Sign up now
            </button>
          </form>

          
          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login/doctor" className="text-brand hover:text-brand-hover font-medium">
              Sign in
            </Link>
          </p>
          </div>
          {/* End of Rounded Box Container */}
        </div>
      </div>
    </div>
  );
}
