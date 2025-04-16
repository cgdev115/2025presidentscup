export default async function handler(req, res) {
  try {
    const { sql } = await import('@vercel/postgres');

    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { rows } = await sql`SELECT * FROM standings ORDER BY pts DESC, gd DESC`;
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error in standings handler:', error);
    return res.status(500).json({ error: 'Failed to fetch standings', details: error.message });
  }
}
