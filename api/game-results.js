export default async function handler(req, res) {
  try {
    const { sql } = await import('@vercel/postgres');

    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { rows } = await sql`SELECT * FROM game_results ORDER BY id`;
    return res.status(200).json(rows.map(row => ({ Match: row.match })));
  } catch (error) {
    console.error('Error in game-results handler:', error);
    return res.status(500).json({ error: 'Failed to fetch game results', details: error.message });
  }
}
