export default async function handler(req, res) {
  try {
    const { sql } = await import('@vercel/postgres');

    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { rows } = await sql`SELECT * FROM future_games ORDER BY id`;
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error in future-games handler:', error);
    return res.status(500).json({ error: 'Failed to fetch future games', details: error.message });
  }
}
