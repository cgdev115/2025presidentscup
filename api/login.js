import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { rows } = await sql`SELECT * FROM admins WHERE username = ${username} AND password = ${password}`;
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return res.status(200).json({ message: 'Login successful', user: { username } });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Failed to login' });
  }
}
