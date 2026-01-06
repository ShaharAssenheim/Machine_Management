import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send, Check } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!email.endsWith('@rigaku.com')) {
      setError('Please use your Rigaku email address');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Sending forgot password request to:', `${API_BASE_URL}/auth/forgot-password`);
      console.log('Email:', email);
      
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          throw new Error('Failed to send reset email');
        }
        throw new Error(errorData.message || 'Failed to send reset email');
      }

      const result = await response.json();
      console.log('Success response:', result);
      setSuccess(true);
    } catch (err: any) {
      console.error('Forgot password error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-main via-bg-elevated to-bg-main flex items-center justify-center p-4">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-bg-card/95 backdrop-blur-xl rounded-3xl shadow-xl border border-border-subtle p-8">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-status-running/10 flex items-center justify-center"
              >
                <Check size={40} className="text-status-running" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-text-primary mb-3">Check Your Email</h2>
              <p className="text-text-muted mb-8">
                If an account with this email exists, we've sent password reset instructions to <strong>{email}</strong>
              </p>

              <motion.button
                onClick={onBackToLogin}
                className="w-full py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                style={{ 
                  background: 'linear-gradient(to right, #2596be, #1d7a9e)',
                  color: '#ffffff'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft size={18} style={{ color: '#ffffff' }} />
                <span style={{ color: '#ffffff' }}>Back to Login</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-main via-bg-elevated to-bg-main flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="inline-block"
          >
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <div className="absolute inset-0 rounded-xl bg-accent-primary/20 blur-xl opacity-60 animate-pulse-slow"></div>
              <img src="/src/assets/rigaku_logo.png" alt="Rigaku" className="relative w-full h-full object-contain drop-shadow-lg" />
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Reset Password</h1>
          <p className="text-text-muted">Enter your email to receive reset instructions</p>
        </div>

        {/* Form Card */}
        <motion.div 
          className="bg-bg-card/95 backdrop-blur-xl rounded-3xl shadow-xl border border-border-subtle p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.name@rigaku.com"
                  className="w-full pl-12 pr-4 py-3 bg-bg-inset border border-border-medium rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-all duration-300"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div 
                className="p-4 bg-status-error/10 border border-status-error/30 rounded-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <p className="text-status-error text-sm">{error}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ backgroundColor: '#2596be', color: '#ffffff' }}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-white font-semibold">Sending...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span className="text-white font-semibold">Send Reset Instructions</span>
                </>
              )}
            </button>

            {/* Back to Login */}
            <button
              type="button"
              onClick={onBackToLogin}
              className="w-full py-3.5 bg-bg-inset border border-border-medium text-text-secondary rounded-xl font-semibold hover:bg-bg-elevated hover:border-border-highlight transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} />
              Back to Login
            </button>
          </form>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-text-muted text-sm mt-6">
          Need help? Contact your system administrator
        </p>
      </motion.div>
    </div>
  );
};
