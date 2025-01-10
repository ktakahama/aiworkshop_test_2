import { NextApiRequest, NextApiResponse } from 'next';
import { getTasks, createTask, createTasksTable } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await createTasksTable();

    if (req.method === 'GET') {
      const tasks = await getTasks();
      return res.status(200).json(tasks);
    }

    if (req.method === 'POST') {
      const { task } = req.body;
      if (!task) {
        return res.status(400).json({ error: 'タスクを入力してください' });
      }

      const newTask = await createTask('デフォルト', task, 'medium', '');
      return res.status(201).json(newTask);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
