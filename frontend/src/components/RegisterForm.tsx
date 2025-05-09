'use client';

import { useState } from 'react';

interface RegisterFormProps {
  onRegisterSuccess: () => void;
}

export const RegisterForm = ({ onRegisterSuccess }: RegisterFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      setError('すべての項目を入力してください');
      return;
    }

    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || '登録に失敗しました');
      }

      onRegisterSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知のエラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-200">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="register-email" className="block text-sm font-medium text-gray-300 mb-1">
          メールアドレス
        </label>
        <input
          type="email"
          id="register-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="your@email.com"
          disabled={isSubmitting}
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="register-password" className="block text-sm font-medium text-gray-300 mb-1">
          パスワード
        </label>
        <input
          type="password"
          id="register-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          disabled={isSubmitting}
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-1">
          パスワード (確認)
        </label>
        <input
          type="password"
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          disabled={isSubmitting}
        />
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
          isSubmitting 
            ? 'bg-gray-600 cursor-not-allowed' 
            : 'bg-cyan-600 hover:bg-cyan-700 text-white'
        }`}
      >
        {isSubmitting ? '登録中...' : '登録する'}
      </button>
    </form>
  );
}; 