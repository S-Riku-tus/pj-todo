'use client';

import { useState, useEffect } from 'react';
import { TodoList } from '../components/TodoList';
import { TodoForm } from '../components/TodoForm';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsLoggedIn(false);
  };

  const toggleRegister = () => {
    setShowRegister(!showRegister);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-cyan-400">Todo App</h1>
            {isLoggedIn && (
              <button 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors"
              >
                ログアウト
              </button>
            )}
          </div>
        </header>

        {!isLoggedIn ? (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-cyan-400">
              {showRegister ? '新規登録' : 'ログイン'}
            </h2>
            
            {showRegister ? (
              <RegisterForm onRegisterSuccess={toggleRegister} />
            ) : (
              <LoginForm onLoginSuccess={handleLogin} />
            )}
            
            <div className="mt-4 text-center">
              <button 
                onClick={toggleRegister} 
                className="text-cyan-400 hover:underline"
              >
                {showRegister ? 'ログイン画面に戻る' : '新規登録はこちら'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <TodoForm token={token} />
            <TodoList token={token} />
          </div>
        )}
      </div>
    </main>
  );
}
