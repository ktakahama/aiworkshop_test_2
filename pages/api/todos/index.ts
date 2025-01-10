import { NextApiRequest, NextApiResponse } from 'next';
import { getTodos, addTodo, createTodosTable } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // テーブルが存在することを確認
    await createTodosTable();

    switch (req.method) {
      case 'GET':
        const todos = await getTodos();
        return res.status(200).json(todos);

      case 'POST':
        const { task } = req.body;
        if (!task) {
          return res.status(400).json({ error: 'Task is required' });
        }
        const newTodo = await addTodo(task);
        return res.status(201).json(newTodo);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in todos API:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
