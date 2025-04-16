import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, homeScore, awayScore, isFutureGame } = req.body;

  if (!id || homeScore === undefined || awayScore === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Update the game score
    if (isFutureGame) {
      await sql`
        UPDATE future_games
        SET home_score = ${homeScore}, away_score = ${awayScore}, validated = FALSE
        WHERE id = ${id}
      `;
    } else {
      const game = await sql`SELECT match FROM game_results WHERE id = ${id}`;
      if (game.rows.length === 0) {
        return res.status(404).json({ error: 'Game not found' });
      }
      const match = game.rows[0].match;
      const updatedMatch = match.replace(/\d+-\d+/, `${homeScore}-${awayScore}`);
      await sql`
        UPDATE game_results
        SET match = ${updatedMatch}
        WHERE id = ${id}
      `;
    }

    // Fetch teams involved
    const gameDetails = isFutureGame
      ? await sql`SELECT home_team, away_team FROM future_games WHERE id = ${id}`
      : await sql`SELECT match FROM game_results WHERE id = ${id}`;

    let homeTeam, awayTeam;
    if (isFutureGame) {
      homeTeam = gameDetails.rows[0].home_team;
      awayTeam = gameDetails.rows[0].away_team;
    } else {
      const matchText = gameDetails.rows[0].match;
      const teams = matchText.split(/\d+-\d+/)[0].split(' vs ');
      homeTeam = teams[0].trim();
      awayTeam = teams[1].split(' (')[0].trim();
    }

    // Update standings
    const homeStanding = await sql`SELECT * FROM standings WHERE team = ${homeTeam}`;
    const awayStanding = await sql`SELECT * FROM standings WHERE team = ${awayTeam}`;

    if (homeStanding.rows.length === 0 || awayStanding.rows.length === 0) {
      return res.status(404).json({ error: 'Team standings not found' });
    }

    let home = homeStanding.rows[0];
    let away = awayStanding.rows[0];

    // Revert previous game stats if this is an update (simplified; in a real app, you’d track game history)
    home.mp -= 1;
    away.mp -= 1;
    home.gf -= homeScore;
    away.gf -= awayScore;
    home.ga -= awayScore;
    away.ga -= homeScore;
    home.gd = home.gf - home.ga;
    away.gd = away.gf - away.ga;

    if (homeScore > awayScore) {
      home.w -= 1;
      away.l -= 1;
      home.pts -= 3;
    } else if (awayScore > homeScore) {
      away.w -= 1;
      home.l -= 1;
      away.pts -= 3;
    } else {
      home.d -= 1;
      away.d -= 1;
      home.pts -= 1;
      away.pts -= 1;
    }

    // Apply new scores
    home.mp += 1;
    away.mp += 1;
    home.gf += homeScore;
    away.gf += awayScore;
    home.ga += awayScore;
    away.ga += homeScore;
    home.gd = home.gf - home.ga;
    away.gd = away.gf - away.ga;

    if (homeScore > awayScore) {
      home.w += 1;
      away.l += 1;
      home.pts += 3;
    } else if (awayScore > homeScore) {
      away.w += 1;
      home.l += 1;
      away.pts += 3;
    } else {
      home.d += 1;
      away.d += 1;
      home.pts += 1;
      away.pts += 1;
    }

    home.ppg = (home.pts / home.mp).toFixed(1);
    away.ppg = (away.pts / away.mp).toFixed(1);

    // Update standings in the database
    await sql`
      UPDATE standings
      SET mp = ${home.mp}, w = ${home.w}, l = ${home.l}, d = ${home.d},
          gf = ${home.gf}, ga = ${home.ga}, gd = ${home.gd}, pts = ${home.pts},
          ppg = ${home.ppg}
      WHERE team = ${homeTeam}
    `;
    await sql`
      UPDATE standings
      SET mp = ${away.mp}, w = ${away.w}, l = ${away.l}, d = ${away.d},
          gf = ${away.gf}, ga = ${away.ga}, gd = ${away.gd}, pts = ${away.pts},
          ppg = ${away.ppg}
      WHERE team = ${awayTeam}
    `;

    return res.status(200).json({ message: 'Game updated successfully' });
  } catch (error) {
    console.error('Error updating game:', error);
    return res.status(500).json({ error: 'Failed to update game' });
  }
}
