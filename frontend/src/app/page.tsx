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
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [localTodos, setLocalTodos] = useState<any[]>([]);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedTodos = localStorage.getItem('localTodos');
    
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
    
    if (storedTodos) {
      setLocalTodos(JSON.parse(storedTodos));
    }
  }, []);

  const handleLogin = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setIsLoggedIn(true);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsLoggedIn(false);
  };

  const toggleRegister = () => {
    setShowRegister(!showRegister);
  };
  
  const addLocalTodo = (todo: any) => {
    const newTodo = {
      id: Date.now(),
      ...todo,
      completed: false
    };
    const updatedTodos = [...localTodos, newTodo];
    setLocalTodos(updatedTodos);
    localStorage.setItem('localTodos', JSON.stringify(updatedTodos));
  };
  
  const updateLocalTodo = (id: number, completed: boolean) => {
    const updatedTodos = localTodos.map(todo => 
      todo.id === id ? { ...todo, completed } : todo
    );
    setLocalTodos(updatedTodos);
    localStorage.setItem('localTodos', JSON.stringify(updatedTodos));
  };
  
  const deleteLocalTodo = (id: number) => {
    const updatedTodos = localTodos.filter(todo => todo.id !== id);
    setLocalTodos(updatedTodos);
    localStorage.setItem('localTodos', JSON.stringify(updatedTodos));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 bg-blue-800/50 p-4 rounded-lg shadow-lg">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-cyan-300 drop-shadow-md">Todo App</h1>
            <div className="flex gap-3">
              {!isLoggedIn ? (
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-md transition-colors shadow-md"
                >
                  ログイン / 登録
                </button>
              ) : (
                <button 
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors shadow-md"
                >
                  ログアウト
                </button>
              )}
            </div>
          </div>
        </header>

        {showAuthModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-b from-blue-800 to-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md relative">
              <button 
                onClick={() => setShowAuthModal(false)} 
                className="absolute top-3 right-3 text-gray-300 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <h2 className="text-2xl font-semibold mb-6 text-cyan-300 text-center">
                {showRegister ? '新規登録' : 'ログイン'}
              </h2>
              
              {showRegister ? (
                <RegisterForm onRegisterSuccess={toggleRegister} />
              ) : (
                <LoginForm onLoginSuccess={handleLogin} />
              )}
              
              <div className="mt-6 text-center">
                <button 
                  onClick={toggleRegister} 
                  className="text-cyan-300 hover:text-cyan-100 hover:underline transition-colors"
                >
                  {showRegister ? 'ログイン画面に戻る' : '新規登録はこちら'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <TodoForm 
            token={token} 
            onAddLocalTodo={addLocalTodo} 
            isLoggedIn={isLoggedIn}
          />
          <TodoList 
            token={token} 
            localTodos={localTodos}
            onUpdateLocalTodo={updateLocalTodo}
            onDeleteLocalTodo={deleteLocalTodo}
            isLoggedIn={isLoggedIn}
          />
        </div>
      </div>
    </main>
  );
}
