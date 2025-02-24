import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = verifyToken(req, res);
  if (!userId) return;

  switch (req.method) {
    case 'GET':
      return getTasks(req, res, userId);
    case 'POST':
      return createTask(req, res, userId);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getTasks(req: NextApiRequest, res: NextApiResponse, userId: number) {
  try {
    const result = await pool.query('SELECT * FROM tasks WHERE userId = $1', [userId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tasks' });
  }
}

async function createTask(req: NextApiRequest, res: NextApiResponse, userId: number) {
  const { title, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tasks (title, description, userId) VALUES ($1, $2, $3) RETURNING *',
      [title, description, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error creating task' });
  }
}
