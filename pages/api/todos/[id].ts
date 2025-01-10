import { NextApiRequest, NextApiResponse } from 'next';
import { deleteTask } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  if (!id || typeof parseInt(id as string) !== 'number') {
    return res.status(400).json({ error: '無効なIDです' });
  }

  try {
    const deletedTask = await deleteTask(parseInt(id as string));
    return res.status(200).json(deletedTask);
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
