import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = verifyToken(req, res);
  if (!userId) return;

  const { id } = req.query;

  switch (req.method) {
    case 'PUT':
      return updateTask(req, res, userId, Number(id));
    case 'DELETE':
      return deleteTask(req, res, userId, Number(id));
    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function updateTask(req: NextApiRequest, res: NextApiResponse, userId: number, taskId: number) {
  const { title, description, isComplete } = req.body;
  try {
    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, "isComplete" = $3 WHERE id = $4 AND userId = $5 RETURNING *',
      [title, description, isComplete, taskId, userId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error updating task' });
  }
}

async function deleteTask(req: NextApiRequest, res: NextApiResponse, userId: number, taskId: number) {
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1 AND userId = $2', [taskId, userId]);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting task' });
  }
}
