import { NextApiRequest, NextApiResponse } from 'next';
import { createTasksTable, getTasks, createTask, updateTaskStatus, deleteTask } from '../../lib/db';
import { generateTasks } from '../../lib/openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // テーブルが存在することを確認
    await createTasksTable();

    if (req.method === 'GET') {
      const tasks = await getTasks();
      return res.status(200).json(tasks);
    }

    if (req.method === 'POST') {
      const { goal } = req.body;
      if (!goal) {
        return res.status(400).json({ error: '目的を入力してください' });
      }

      // OpenAIを使用してタスクを生成
      const generatedTasks = await generateTasks(goal);

      // 生成された各タスクをデータベースに保存
      const savedTasks = await Promise.all(
        generatedTasks.map((task: any) =>
          createTask(goal, task.task, task.priority, task.details)
        )
      );

      return res.status(201).json(savedTasks);
    }

    if (req.method === 'PUT') {
      const { id, completed } = req.body;
      if (typeof id !== 'number' || typeof completed !== 'boolean') {
        return res.status(400).json({ error: '無効なパラメータです' });
      }

      const updatedTask = await updateTaskStatus(id, completed);
      return res.status(200).json(updatedTask);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id || typeof parseInt(id as string) !== 'number') {
        return res.status(400).json({ error: '無効なIDです' });
      }

      const deletedTask = await deleteTask(parseInt(id as string));
      return res.status(200).json(deletedTask);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 