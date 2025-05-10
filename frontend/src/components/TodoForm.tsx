'use client';

import { useState } from 'react';

interface TodoFormProps {
  token: string | null;
  onAddLocalTodo: (todo: { title: string; description: string }) => void;
  isLoggedIn: boolean;
}

export const TodoForm = ({ token, onAddLocalTodo, isLoggedIn }: TodoFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('タイトルを入力してください');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    // ログインしていない場合はローカルにTodoを保存
    if (!isLoggedIn) {
      onAddLocalTodo({
        title: title.trim(),
        description: description.trim()
      });
      setTitle('');
      setDescription('');
      setSuccessMessage('Todoを作成しました');
      
      // 3秒後に成功メッセージを消す
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
      setIsSubmitting(false);
      return;
    }

    // ログイン済みの場合はAPIにTodoを送信
    try {
      const response = await fetch('http://localhost:8000/api/v1/todos/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description: description.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Todoの作成に失敗しました');
      }

      setTitle('');
      setDescription('');
      setSuccessMessage('Todoを作成しました');

      // 3秒後に成功メッセージを消す
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知のエラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-800 to-gray-800 p-6 rounded-lg shadow-xl">
      <h2 className="text-xl font-semibold mb-4 text-cyan-300">新しいTodoを追加</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/30 border border-red-500 rounded-md text-red-200">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-500/30 border border-green-500 rounded-md text-green-200">
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-cyan-100 mb-1">
            タイトル *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-700/70 border border-blue-600/50 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-inner"
            placeholder="Todoのタイトル"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-cyan-100 mb-1">
            説明 (任意)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-gray-700/70 border border-blue-600/50 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-inner"
            placeholder="詳細な説明"
            rows={3}
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            isSubmitting 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-md'
          }`}
        >
          {isSubmitting ? '追加中...' : '追加する'}
        </button>
      </form>
    </div>
  );
}; 