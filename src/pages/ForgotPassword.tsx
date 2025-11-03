import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { AuthLayout } from '@modules/shared/layouts/AuthLayout';
import { Input } from '@modules/shared/components/Input';
import { Button } from '@modules/shared/components/Button';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { resetPassword, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email) {
      setError('Please enter your email');
      return;
    }

    const result = await resetPassword(email);
    if (result.success) {
      setSuccess(true);
      setEmail('');
    } else {
      setError(result.error || 'Failed to send reset link');
    }
  };

  return (
    <AuthLayout title="Reset Password" description="Enter your email to receive a password reset link">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-700 dark:text-red-200 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3 text-green-700 dark:text-green-200 text-sm">
            If an account exists with that email, we've sent a password reset link.
          </div>
        )}

        <Input
          type="email"
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />

        <Button type="submit" className="w-full" loading={isLoading}>
          Send Reset Link
        </Button>

        <div className="flex items-center justify-center gap-2 text-sm">
          <Link to="/auth/login" className="text-blue-600 dark:text-blue-400 hover:underline">
            Back to login
          </Link>
          <span className="text-gray-400">•</span>
          <Link to="/auth/register" className="text-blue-600 dark:text-blue-400 hover:underline">
            Create account
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
