import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Check, X } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

interface ChangePasswordProps {
  onPasswordChanged: () => void;
  token: string;
}

export const ChangePassword: React.FC<ChangePasswordProps> = ({ onPasswordChanged, token }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const passwordRequirements = [
    { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
    { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
    { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
    { label: 'One number', test: (p: string) => /\d/.test(p) },
  ];

  const isPasswordValid = passwordRequirements.every(req => req.test(newPassword));
  const doPasswordsMatch = newPassword === confirmPassword && newPassword.length > 0;

  const validatePassword = (password: string): string | null => {
    if (!isPasswordValid) {
      return 'Password does not meet all requirements';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!isPasswordValid) {
      setError('Password does not meet all requirements');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
      }

      // Success!
      onPasswordChanged();
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-text-primary mb-2">Change Password Required</h1>
          <p className="text-text-muted">For your security, please change your temporary password</p>
        </div>

        {/* Form Card */}
        <motion.div
          className="bg-bg-card/95 backdrop-blur-xl rounded-3xl shadow-xl border border-border-subtle p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full pl-12 pr-12 py-3 bg-bg-inset border border-border-medium rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-all duration-300"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {newPassword && (
                <div className="mt-3 space-y-2">
                  {passwordRequirements.map((req, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      {req.test(newPassword) ? (
                        <Check className="w-4 h-4 text-status-running" />
                      ) : (
                        <X className="w-4 h-4 text-text-muted" />
                      )}
                      <span
                        className={
                          req.test(newPassword)
                            ? 'text-status-running'
                            : 'text-text-muted'
                        }
                      >
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className={`w-full pl-12 pr-16 py-3 bg-bg-inset border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-all duration-300 ${
                    confirmPassword && !doPasswordsMatch
                      ? 'border-status-error'
                      : 'border-border-medium'
                  }`}
                  disabled={isLoading}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-text-muted hover:text-text-secondary transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  {confirmPassword && (
                    <div>
                      {doPasswordsMatch ? (
                        <Check className="w-5 h-5 text-status-running" />
                      ) : (
                        <X className="w-5 h-5 text-status-error" />
                      )}
                    </div>
                  )}
                </div>
              </div>
              {confirmPassword && !doPasswordsMatch && (
                <p className="mt-2 text-sm text-status-error">
                  Passwords do not match
                </p>
              )}
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
                  <span className="text-white font-semibold">Changing Password...</span>
                </>
              ) : (
                <>
                  <Lock size={18} />
                  <span className="text-white font-semibold">Change Password</span>
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-text-muted text-sm mt-6">
          You must change your temporary password to continue
        </p>
      </motion.div>
    </div>
  );
};
