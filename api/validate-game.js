export default async function handler(req, res) {
  try {
    console.log('Starting validate-game handler, request body:', req.body);

    console.log('Environment variables:', {
      POSTGRES_URL: process.env.POSTGRES_URL ? 'Set' : 'Not set',
    });

    console.log('Attempting to import @vercel/postgres');
    const { sql } = await import('@vercel/postgres');
    console.log('Successfully imported @vercel/postgres');

    if (req.method !== 'POST') {
      console.log('Method not allowed:', req.method);
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.body;

    if (!id) {
      console.log('Missing required field: id');
      return res.status(400).json({ error: 'Missing required field: id' });
    }

    console.log('Executing SQL query to update future_games');
    const { rows: gameRows } = await sql`
      UPDATE future_games
      SET validated = TRUE
      WHERE id = ${id}
      RETURNING *
    `;
    console.log('SQL query completed, updated rows:', gameRows);

    if (gameRows.length === 0) {
      console.log('Game not found for id:', id);
      return res.status(404).json({ error: 'Game not found' });
    }

    const game = gameRows[0];

    console.log('Inserting into game_results');
    const match = `${game.home_team} ${game.home_score}-${game.away_score} ${game.away_team} (${game.matchup}, ${game.date})`;
    await sql`
      INSERT INTO game_results (Match)
      VALUES (${match})
    `;

    // Update standings
    console.log('Updating standings for teams:', game.home_team, game.away_team);
    const homeScore = parseInt(game.home_score) || 0;
    const awayScore = parseInt(game.away_score) || 0;

    // Fetch current standings for both teams
    const { rows: homeStandings } = await sql`
      SELECT * FROM standings WHERE team = ${game.home_team}
    `;
    const { rows: awayStandings } = await sql`
      SELECT * FROM standings WHERE team = ${game.away_team}
    `;

    console.log('Current home standings:', homeStandings);
    console.log('Current away standings:', awayStandings);

    const homeTeamStats = homeStandings[0] || {
      team: game.home_team,
      mp: 0,
      w: 0,
      l: 0,
      d: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      pts: 0,
      ppg: 0,
    };

    const awayTeamStats = awayStandings[0] || {
      team: game.away_team,
      mp: 0,
      w: 0,
      l: 0,
      d: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      pts: 0,
      ppg: 0,
    };

    // Update match played (MP)
    homeTeamStats.mp += 1;
    awayTeamStats.mp += 1;

    // Update goals for (GF) and goals against (GA)
    homeTeamStats.gf += homeScore;
    homeTeamStats.ga += awayScore;
    awayTeamStats.gf += awayScore;
    awayTeamStats.ga += homeScore;

    // Update goal difference (GD)
    homeTeamStats.gd = homeTeamStats.gf - homeTeamStats.ga;
    awayTeamStats.gd = awayTeamStats.gf - awayTeamStats.ga;

    // Determine match outcome and update W, L, D, and PTS
    if (homeScore > awayScore) {
      homeTeamStats.w += 1;
      awayTeamStats.l += 1;
      homeTeamStats.pts += 3;
    } else if (homeScore < awayScore) {
      awayTeamStats.w += 1;
      homeTeamStats.l += 1;
      awayTeamStats.pts += 3;
    } else {
      homeTeamStats.d += 1;
      awayTeamStats.d += 1;
      homeTeamStats.pts += 1;
      awayTeamStats.pts += 1;
    }

    // Update points per game (PPG)
    homeTeamStats.ppg = homeTeamStats.pts / homeTeamStats.mp;
    awayTeamStats.ppg = awayTeamStats.pts / awayTeamStats.mp;

    console.log('Updated home team stats:', homeTeamStats);
    console.log('Updated away team stats:', awayTeamStats);

    // Update or insert standings for home team
    if (homeStandings.length > 0) {
      await sql`
        UPDATE standings
        SET mp = ${homeTeamStats.mp},
            w = ${homeTeamStats.w},
            l = ${homeTeamStats.l},
            d = ${homeTeamStats.d},
            gf = ${homeTeamStats.gf},
            ga = ${homeTeamStats.ga},
            gd = ${homeTeamStats.gd},
            pts = ${homeTeamStats.pts},
            ppg = ${homeTeamStats.ppg}
        WHERE team = ${homeTeamStats.team}
      `;
    } else {
      await sql`
        INSERT INTO standings (team, mp, w, l, d, gf, ga, gd, pts, ppg)
        VALUES (${homeTeamStats.team}, ${homeTeamStats.mp}, ${homeTeamStats.w}, ${homeTeamStats.l}, ${homeTeamStats.d}, ${homeTeamStats.gf}, ${homeTeamStats.ga}, ${homeTeamStats.gd}, ${homeTeamStats.pts}, ${homeTeamStats.ppg})
      `;
    }

    // Update or insert standings for away team
    if (awayStandings.length > 0) {
      await sql`
        UPDATE standings
        SET mp = ${awayTeamStats.mp},
            w = ${awayTeamStats.w},
            l = ${awayTeamStats.l},
            d = ${awayTeamStats.d},
            gf = ${awayTeamStats.gf},
            ga = ${awayTeamStats.ga},
            gd = ${awayTeamStats.gd},
            pts = ${awayTeamStats.pts},
            ppg = ${awayTeamStats.ppg}
        WHERE team = ${awayTeamStats.team}
      `;
    } else {
      await sql`
        INSERT INTO standings (team, mp, w, l, d, gf, ga, gd, pts, ppg)
        VALUES (${awayTeamStats.team}, ${awayTeamStats.mp}, ${awayTeamStats.w}, ${awayTeamStats.l}, ${awayTeamStats.d}, ${awayTeamStats.gf}, ${awayTeamStats.ga}, ${awayTeamStats.gd}, ${awayTeamStats.pts}, ${awayTeamStats.ppg})
      `;
    }

    console.log('Game validated and standings updated');
    return res.status(200).json({ message: 'Game validated successfully' });
  } catch (error) {
    console.error('Error in validate-game handler:', error);
    return res.status(500).json({ error: 'Failed to validate game', details: error.message, stack: error.stack });
  }
}
