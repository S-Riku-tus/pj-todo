'use client';

import { useState, useEffect } from 'react';
import { TodoItem } from './TodoItem';

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface TodoListProps {
  token: string | null;
}

export const TodoList = ({ token }: TodoListProps) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/v1/todos/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Todoの取得に失敗しました');
      }

      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知のエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [token]);

  const handleToggleComplete = async (id: number, completed: boolean) => {
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:8000/api/v1/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) {
        throw new Error('Todoの更新に失敗しました');
      }

      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed } : todo
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知のエラーが発生しました');
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:8000/api/v1/todos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Todoの削除に失敗しました');
      }

      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知のエラーが発生しました');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">読み込み中...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500 p-4 rounded-lg text-center">
        <p>{error}</p>
        <button 
          onClick={fetchTodos}
          className="mt-2 bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded text-sm"
        >
          再試行
        </button>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg text-center">
        <p className="text-gray-400">Todoがありません。新しいTodoを追加してください。</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <h2 className="text-xl font-semibold p-4 bg-gray-700 text-cyan-400">
        Todoリスト
      </h2>
      <ul className="divide-y divide-gray-700">
        {todos.map((todo) => (
          <TodoItem 
            key={todo.id}
            todo={todo}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
}; 