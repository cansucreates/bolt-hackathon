import React, { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    userName: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { signUp, signIn, signInWithGoogle, resetPassword } = useAuth();

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (mode !== 'forgot') {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      if (mode === 'signup') {
        if (!formData.userName) {
          newErrors.userName = 'Name is required';
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage(null);

    try {
      if (mode === 'signup') {
        const { error } = await signUp(formData.email, formData.password, {
          user_name: formData.userName
        });
        
        if (error) {
          setMessage({ type: 'error', text: error.message });
        } else {
          setMessage({ 
            type: 'success', 
            text: 'Account created successfully! Please check your email to verify your account.' 
          });
        }
      } else if (mode === 'signin') {
        const { error } = await signIn(formData.email, formData.password);
        
        if (error) {
          setMessage({ type: 'error', text: error.message });
        } else {
          onClose();
        }
      } else if (mode === 'forgot') {
        const { error } = await resetPassword(formData.email);
        
        if (error) {
          setMessage({ type: 'error', text: error.message });
        } else {
          setMessage({ 
            type: 'success', 
            text: 'Password reset email sent! Please check your inbox.' 
          });
        }
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'An unexpected error occurred. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        setMessage({ type: 'error', text: error.message });
      }
      // Note: Google OAuth will redirect, so we don't close the modal here
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to sign in with Google. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', confirmPassword: '', userName: '' });
    setErrors({});
    setMessage(null);
  };

  const switchMode = (newMode: 'signin' | 'signup' | 'forgot') => {
    setMode(newMode);
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-kawaii shadow-kawaii w-full max-w-sm sm:max-w-md mx-auto p-4 sm:p-6 md:p-8 relative animate-slide-in max-h-[95vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 pr-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            {mode === 'signin' && 'Welcome Back!'}
            {mode === 'signup' && 'Join PawConnect'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-quicksand px-2">
            {mode === 'signin' && 'Sign in to help pets find their way home'}
            {mode === 'signup' && 'Create an account to start helping pets'}
            {mode === 'forgot' && 'Enter your email to reset your password'}
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-4 p-3 rounded-kawaii flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle size={16} className="flex-shrink-0" />
            ) : (
              <AlertCircle size={16} className="flex-shrink-0" />
            )}
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        {/* Google Sign In Button (not shown for forgot password) */}
        {mode !== 'forgot' && (
          <>
            <button 
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full mb-4 p-3 sm:p-4 border-2 border-gray-200 rounded-kawaii hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-3 group min-h-[48px] sm:min-h-[52px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-semibold text-gray-700 group-hover:text-gray-800 text-sm sm:text-base">
                {mode === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}
              </span>
            </button>

            {/* Divider */}
            <div className="relative mb-4 sm:mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-3 sm:px-4 bg-white text-gray-500 font-quicksand">or continue with email</span>
              </div>
            </div>
          </>
        )}

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.userName}
                  onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
                  className={`w-full pl-12 pr-4 py-3 sm:py-4 border-2 rounded-kawaii bg-white/70 focus:outline-none focus:ring-2 focus:ring-kawaii-purple focus:border-transparent transition-all duration-300 text-sm sm:text-base min-h-[48px] ${
                    errors.userName ? 'border-red-300' : 'border-kawaii-pink'
                  }`}
                />
              </div>
              {errors.userName && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.userName}
                </p>
              )}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={`w-full pl-12 pr-4 py-3 sm:py-4 border-2 rounded-kawaii bg-white/70 focus:outline-none focus:ring-2 focus:ring-kawaii-purple focus:border-transparent transition-all duration-300 text-sm sm:text-base min-h-[48px] ${
                  errors.email ? 'border-red-300' : 'border-kawaii-pink'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.email}
              </p>
            )}
          </div>
          
          {mode !== 'forgot' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className={`w-full pl-12 pr-12 py-3 sm:py-4 border-2 rounded-kawaii bg-white/70 focus:outline-none focus:ring-2 focus:ring-kawaii-purple focus:border-transparent transition-all duration-300 text-sm sm:text-base min-h-[48px] ${
                      errors.password ? 'border-red-300' : 'border-kawaii-pink'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.password}
                  </p>
                )}
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className={`w-full pl-12 pr-4 py-3 sm:py-4 border-2 rounded-kawaii bg-white/70 focus:outline-none focus:ring-2 focus:ring-kawaii-purple focus:border-transparent transition-all duration-300 text-sm sm:text-base min-h-[48px] ${
                        errors.confirmPassword ? 'border-red-300' : 'border-kawaii-pink'
                      }`}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-kawaii-pink hover:bg-kawaii-pink-dark disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-kawaii transition-all duration-300 hover:scale-105 shadow-md text-sm sm:text-base min-h-[48px] sm:min-h-[52px]"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </div>
            ) : (
              <>
                {mode === 'signin' && 'Sign In'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'forgot' && 'Send Reset Email'}
              </>
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-4 sm:mt-6 text-center space-y-2">
          {mode === 'signin' && (
            <>
              <p className="text-sm sm:text-base text-gray-600 font-quicksand">
                Don't have an account?{' '}
                <button
                  onClick={() => switchMode('signup')}
                  className="text-kawaii-pink-dark hover:underline font-semibold"
                >
                  Sign up
                </button>
              </p>
              <button
                onClick={() => switchMode('forgot')}
                className="text-xs sm:text-sm text-gray-500 hover:text-kawaii-pink-dark transition-colors duration-200"
              >
                Forgot your password?
              </button>
            </>
          )}
          
          {mode === 'signup' && (
            <p className="text-sm sm:text-base text-gray-600 font-quicksand">
              Already have an account?{' '}
              <button
                onClick={() => switchMode('signin')}
                className="text-kawaii-pink-dark hover:underline font-semibold"
              >
                Sign in
              </button>
            </p>
          )}
          
          {mode === 'forgot' && (
            <p className="text-sm sm:text-base text-gray-600 font-quicksand">
              Remember your password?{' '}
              <button
                onClick={() => switchMode('signin')}
                className="text-kawaii-pink-dark hover:underline font-semibold"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;