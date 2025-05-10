'use client';

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

export const TodoItem = ({ todo, onToggleComplete, onDelete }: TodoItemProps) => {
  return (
    <li className="p-5 flex items-center justify-between hover:bg-blue-900/20 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggleComplete(todo.id, !todo.completed)}
            className="h-5 w-5 rounded border-blue-500 text-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50"
          />
          {todo.completed && (
            <span className="absolute top-1/2 left-0 right-0 border-t border-cyan-400 transform -translate-y-1/2"></span>
          )}
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-cyan-100'}`}>
            {todo.title}
          </h3>
          {todo.description && (
            <p className={`text-sm mt-1 ${todo.completed ? 'text-gray-600' : 'text-gray-300'}`}>
              {todo.description}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        className="text-red-400 hover:text-red-300 focus:outline-none p-2 rounded-full hover:bg-red-900/20 transition-colors"
        aria-label="削除"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </button>
    </li>
  );
}; 