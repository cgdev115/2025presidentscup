export default async function handler(req, res) {
  try {
    console.log('Starting standings handler');

    console.log('Environment variables:', {
      POSTGRES_URL: process.env.POSTGRES_URL ? 'Set' : 'Not set',
    });

    console.log('Attempting to import @vercel/postgres');
    const { sql } = await import('@vercel/postgres');
    console.log('Successfully imported @vercel/postgres');

    if (req.method !== 'GET') {
      console.log('Method not allowed:', req.method);
      return res.status(405).json({ error: 'Method not allowed' });
    }

    console.log('Executing SQL query for standings');
    const { rows } = await sql`SELECT * FROM standings ORDER BY pts DESC, gd DESC`;
    console.log('SQL query completed, rows:', rows);

    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error in standings handler:', error);
    return res.status(500).json({ error: 'Failed to fetch standings', details: error.message, stack: error.stack });
  }
}
