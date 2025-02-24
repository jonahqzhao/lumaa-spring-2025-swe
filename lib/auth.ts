import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'your-secret-key';

export function verifyToken(req: NextApiRequest, res: NextApiResponse): number | null {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ error: 'Authorization header missing' });
        return null;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, secret) as { userId: number };
        return decoded.userId;
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
        return null;
    }
}