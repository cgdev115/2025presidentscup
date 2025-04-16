import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { rows } = await sql`SELECT * FROM standings ORDER BY pts DESC, gd DESC`;
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching standings:', error);
    return res.status(500).json({ error: 'Failed to fetch standings' });
  }
}
