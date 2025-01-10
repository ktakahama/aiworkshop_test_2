import { useState, useEffect } from 'react';
import { Task } from '../types/database';

export default function Home() {
  const [goal, setGoal] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) throw new Error('タスクの取得に失敗しました');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      setError('タスクの取得中にエラーが発生しました');
      console.error('Error fetching tasks:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal }),
      });

      if (!response.ok) throw new Error('タスクの生成に失敗しました');

      const newTasks = await response.json();
      setTasks([...newTasks, ...tasks]);
      setGoal('');
    } catch (error) {
      setError('タスクの生成中にエラーが発生しました');
      console.error('Error creating tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskStatus = async (id: number, completed: boolean) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, completed }),
      });

      if (!response.ok) throw new Error('タスクの更新に失敗しました');

      const updatedTask = await response.json();
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, completed } : task
      ));
    } catch (error) {
      setError('タスクの更新中にエラーが発生しました');
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
                  タスク自動生成
                </h1>

                <form onSubmit={handleSubmit} className="mb-8">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      placeholder="目的を入力してください"
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {loading ? '生成中...' : '生成'}
                    </button>
                  </div>
                </form>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={(e) => toggleTaskStatus(task.id, e.target.checked)}
                          className="h-5 w-5 text-blue-500"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{task.task}</h3>
                          <p className="text-sm text-gray-600">{task.details}</p>
                          <div className="mt-2 flex gap-2">
                            <span className="text-xs px-2 py-1 rounded bg-gray-100">
                              {task.goal}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
