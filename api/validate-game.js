export default async function handler(req, res) {
  try {
    const { sql } = await import('@vercel/postgres');

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const game = await sql`SELECT * FROM future_games WHERE id = ${id}`;
    if (game.rows.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const { home_score, away_score, home_team, away_team, date, matchup } = game.rows[0];

    if (home_score === null || away_score === null) {
      return res.status(400).json({ error: 'Scores not set' });
    }

    // Mark the game as validated
    await sql`UPDATE future_games SET validated = TRUE WHERE id = ${id}`;

    // Move the game to game_results
    const matchText = `${home_team} ${home_score}-${away_score} ${away_team} (${matchup}, ${date})`;
    await sql`INSERT INTO game_results (match) VALUES (${matchText})`;

    return res.status(200).json({ message: 'Game validated successfully' });
  } catch (error) {
    console.error('Error in validate-game handler:', error);
    return res.status(500).json({ error: 'Failed to validate game', details: error.message });
  }
}
