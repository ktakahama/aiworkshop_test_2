import { NextApiRequest, NextApiResponse } from 'next';
import { deleteTodo } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const deletedTodo = await deleteTodo(Number(id));
    if (!deletedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    return res.status(200).json(deletedTodo);
  } catch (error) {
    console.error('Error in delete todo API:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
