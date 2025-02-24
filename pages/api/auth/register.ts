import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { pool } from '../../../lib/db';

export default async function register(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
}
