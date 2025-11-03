import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { AuthLayout } from '@modules/shared/layouts/AuthLayout';
import { Input } from '@modules/shared/components/Input';
import { Button } from '@modules/shared/components/Button';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <AuthLayout title="Sign In" description="Welcome back to PropertyHub">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-700 dark:text-red-200 text-sm">
            {error}
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

        <Input
          type="password"
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />

        <Button type="submit" className="w-full" loading={isLoading}>
          Sign In
        </Button>

        <div className="flex items-center gap-2">
          <Link
            to="/auth/forgot-password"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Forgot password?
          </Link>
          <span className="text-gray-400">•</span>
          <Link
            to="/auth/register"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Create account
          </Link>
        </div>
      </form>

      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-800">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Demo credentials: demo@example.com / password123
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
