import { useState, useEffect } from 'react';
import Head from 'next/head';

interface Todo {
  id: number;
  task: string;
  created_at: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos');
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError('Failed to load todos');
      console.error('Error fetching todos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: newTask }),
      });

      if (!response.ok) throw new Error('Failed to add todo');
      const todo = await response.json();
      setTodos(prev => [todo, ...prev]);
      setNewTask('');
    } catch (err) {
      setError('Failed to add todo');
      console.error('Error adding todo:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete todo');
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError('Failed to delete todo');
      console.error('Error deleting todo:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <Head>
        <title>Metallic Todo App</title>
        <meta name="description" content="A modern todo application with metallic design" />
      </Head>

      <main className="container mx-auto max-w-md">
        <div className="todo-container rounded-xl p-8">
          <h1 className="gradient-text text-4xl font-bold mb-8 text-center">
            Metallic Todo List
          </h1>

          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex gap-3">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="新しいタスクを入力..."
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 
                         border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50
                         backdrop-blur-sm transition-all duration-300"
              />
              <button
                type="submit"
                className="metallic-button px-6 py-3 rounded-lg text-gray-800 font-semibold
                         hover:bg-metallic-dark transition-all duration-300"
              >
                追加
              </button>
            </div>
          </form>

          {isLoading ? (
            <div className="text-center text-white/80">Loading...</div>
          ) : error ? (
            <div className="text-red-400 text-center bg-red-500/10 rounded-lg p-3">{error}</div>
          ) : todos.length === 0 ? (
            <div className="text-center text-white/60 bg-white/5 rounded-lg p-8">
              タスクがありません
            </div>
          ) : (
            <ul className="space-y-4">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="task-item flex items-center justify-between p-4 rounded-lg"
                >
                  <span className="text-white/90 flex-1 break-all mr-4">{todo.task}</span>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="metallic-button px-4 py-2 rounded-md text-sm text-gray-800
                             hover:bg-red-100 transition-all duration-300"
                  >
                    削除
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
