'use client';

import { useState } from 'react';

interface LoginFormProps {
  onLoginSuccess: (token: string) => void;
}

export const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/login/access-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'ログインに失敗しました');
      }

      onLoginSuccess(data.access_token);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知のエラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-4 bg-red-500/30 border border-red-500 rounded-md text-red-100 shadow-inner">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-cyan-100">
          メールアドレス
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-cyan-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-700/70 border border-blue-600/50 rounded-md py-2 pl-10 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-inner"
            placeholder="your@email.com"
            disabled={isSubmitting}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-cyan-100">
          パスワード
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-cyan-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-700/70 border border-blue-600/50 rounded-md py-2 pl-10 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-inner"
            disabled={isSubmitting}
          />
        </div>
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 px-4 rounded-md font-medium transition-all ${
          isSubmitting 
            ? 'bg-gray-600 cursor-not-allowed' 
            : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-md transform hover:translate-y-[-1px]'
        }`}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ログイン中...
          </div>
        ) : 'ログイン'}
      </button>
    </form>
  );
}; 