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
  localTodos: Todo[];
  onUpdateLocalTodo: (id: number, completed: boolean) => void;
  onDeleteLocalTodo: (id: number) => void;
  isLoggedIn: boolean;
}

export const TodoList = ({ 
  token, 
  localTodos, 
  onUpdateLocalTodo, 
  onDeleteLocalTodo,
  isLoggedIn 
}: TodoListProps) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    if (!isLoggedIn || !token) return;

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
    if (isLoggedIn) {
      fetchTodos();
    }
  }, [token, isLoggedIn]);

  const handleToggleComplete = async (id: number, completed: boolean) => {
    if (!isLoggedIn || !token) {
      onUpdateLocalTodo(id, completed);
      return;
    }

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
    if (!isLoggedIn || !token) {
      onDeleteLocalTodo(id);
      return;
    }

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

  // 表示するTodoの配列を決定
  const displayTodos = isLoggedIn ? todos : localTodos;

  if (isLoading) {
    return <div className="text-center py-8 bg-blue-900/30 rounded-lg shadow-md">
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-300"></div>
      </div>
      <p className="mt-2 text-cyan-100">読み込み中...</p>
    </div>;
  }

  if (error) {
    return (
      <div className="bg-red-500/30 border border-red-500 p-6 rounded-lg text-center shadow-md">
        <p className="text-red-100">{error}</p>
        <button 
          onClick={fetchTodos}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-md text-sm shadow-md transition-colors"
        >
          再試行
        </button>
      </div>
    );
  }

  if (displayTodos.length === 0) {
    return (
      <div className="bg-gradient-to-b from-blue-800/50 to-gray-800/50 p-8 rounded-lg text-center shadow-md">
        <p className="text-cyan-100">Todoがありません。新しいTodoを追加してください。</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-blue-800 to-gray-800 rounded-lg overflow-hidden shadow-xl">
      <h2 className="text-xl font-semibold p-4 bg-blue-900/70 text-cyan-300 border-b border-blue-700">
        Todoリスト
      </h2>
      <ul className="divide-y divide-blue-900/30">
        {displayTodos.map((todo) => (
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