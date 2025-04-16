import React, { useState, useEffect, useMemo } from 'react';
import { useTable } from 'react-table';
import './App.css';
import Admin from './Admin';

function App() {
  const [standings, setStandings] = useState([]);
  const [playoffData] = useState([]);
  const [gameScores, setGameScores] = useState({});
  const [gameResultsData, setGameResultsData] = useState([]);
  const [remainingTournamentGames, setRemainingTournamentGames] = useState([]);
  const [loading, setLoading] = useState(true); // Ensure loading is true initially
  const [error, setError] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showTheoreticalStandings, setShowTheoreticalStandings] = useState(false);

  console.log('Rendering App component, showAdmin:', showAdmin);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        const fetchWithErrorHandling = async (url, errorMessage) => {
          const response = await fetch(url);
          if (!response.ok) {
            let errorData;
            try {
              errorData = await response.json();
              throw new Error(`${errorMessage}: ${errorData.error || 'Unknown error'}`);
            } catch (jsonError) {
              const text = await response.text();
              throw new Error(`${errorMessage}: ${text}`);
            }
          }
          return response.json();
        };

        const gameResults = await fetchWithErrorHandling('/api/game-results', 'Failed to fetch game results');
        setGameResultsData(gameResults);

        const futureGames = await fetchWithErrorHandling('/api/future-games', 'Failed to fetch future games');
        const validFutureGames = futureGames
          .filter(game => game && game.id && game.home_team && game.away_team && game.matchup && game.date)
          .map(game => ({
            id: game.id,
            match: `${game.home_team} vs ${game.away_team} (${game.matchup}, ${game.date})`,
            home_team: game.home_team,
            away_team: game.away_team,
            matchup: game.matchup,
            date: game.date,
            home_score: game.home_score,
            away_score: game.away_score,
            validated: game.validated,
          }));
        setRemainingTournamentGames(validFutureGames);

        const standingsData = await fetchWithErrorHandling('/api/standings', 'Failed to fetch standings');
        const validStandings = standingsData.filter(team => team && team.team && typeof team.team === 'string');
        setStandings(validStandings);

        const initialScores = validFutureGames.reduce((acc, game) => {
          acc[game.id] = { homeScore: game.home_score || '', awayScore: game.away_score || '' };
          return acc;
        }, {});
        setGameScores(initialScores);

        setError(null);
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError(`Failed to load data: ${err.message}. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const calculateTheoreticalStandings = useMemo(() => {
    if (loading || !standings || !remainingTournamentGames) {
      return []; // Return empty array if data is not ready
    }

    // Start with a deep copy of the official standings
    const theoreticalStandings = standings.map(team => ({
      ...team,
      MP: team.MP || 0,
      W: team.W || 0,
      L: team.L || 0,
      D: team.D || 0,
      GF: team.GF || 0,
      GA: team.GA || 0,
      GD: team.GD || 0,
      PTS: team.PTS || 0,
      PPG: team.PPG || 0,
    }));

    // Process each future game with user-input scores
    remainingTournamentGames.forEach(game => {
      if (!game || !game.match) {
        return; // Skip invalid entries
      }

      const gameId = game.id;
      const homeScore = parseInt(gameScores[gameId]?.homeScore) || 0;
      const awayScore = parseInt(gameScores[gameId]?.awayScore) || 0;

      // Skip if scores are not fully provided or game is already validated
      if (game.validated || gameScores[gameId]?.homeScore === '' || gameScores[gameId]?.awayScore === '') {
        return;
      }

      // Extract team names from the match string (e.g., "Team A vs Team B (Matchup, Date)")
      const matchParts = game.match.match(/^(.*?)\svs\s(.*?)\s\(/);
      if (!matchParts) {
        return; // Skip if match format is invalid
      }
      const homeTeam = matchParts[1].trim();
      const awayTeam = matchParts[2].trim();

      // Find the teams in the standings
      const homeTeamData = theoreticalStandings.find(team => team.team === homeTeam);
      const awayTeamData = theoreticalStandings.find(team => team.team === awayTeam);

      if (!homeTeamData || !awayTeamData) return;

      // Update match played (MP)
      homeTeamData.MP += 1;
      awayTeamData.MP += 1;

      // Update goals for (GF) and goals against (GA)
      homeTeamData.GF += homeScore;
      homeTeamData.GA += awayScore;
      awayTeamData.GF += awayScore;
      awayTeamData.GA += homeScore;

      // Update goal difference (GD)
      homeTeamData.GD = homeTeamData.GF - homeTeamData.GA;
      awayTeamData.GD = awayTeamData.GF - awayTeamData.GA;

      // Determine match outcome and update W, L, D, and PTS
      if (homeScore > awayScore) {
        homeTeamData.W += 1;
        awayTeamData.L += 1;
        homeTeamData.PTS += 3;
      } else if (homeScore < awayScore) {
        awayTeamData.W += 1;
        homeTeamData.L += 1;
        awayTeamData.PTS += 3;
      } else {
        homeTeamData.D += 1;
        awayTeamData.D += 1;
        homeTeamData.PTS += 1;
        awayTeamData.PTS += 1;
      }

      // Update points per game (PPG)
      homeTeamData.PPG = homeTeamData.PTS / homeTeamData.MP;
      awayTeamData.PPG = awayTeamData.PTS / awayTeamData.MP;
    });

    // Sort by PTS, GD, and GF
    return theoreticalStandings.sort((a, b) => {
      if (b.PTS !== a.PTS) return b.PTS - a.PTS;
      if (b.GD !== a.GD) return b.GD - a.GD;
      return b.GF - a.GF;
    });
  }, [standings, remainingTournamentGames, gameScores, loading]);

  // Assign semifinal positions separately to avoid minification issues
  const theoreticalStandingsWithPositions = useMemo(() => {
    if (!calculateTheoreticalStandings || calculateTheoreticalStandings.length === 0) {
      return [];
    }
    return calculateTheoreticalStandings.map((team, index) => {
      if (!team || !team.team) {
        return team; // Skip invalid entries
      }
      return {
        ...team,
        'Semifinal Position': assignSemifinalPosition(index, team.team)
      };
    });
  }, [calculateTheoreticalStandings]);

  const assignSemifinalPosition = (index, teamName) => {
    if (!teamName || typeof teamName !== 'string') {
      return ''; // Return empty string if teamName is invalid
    }
    if (index === 0) return 'W1';
    if (index === 1) return 'W2';
    if (index === 2) return 'W3';
    if (teamName.includes('Bracket A')) return 'A1';
    if (teamName.includes('Bracket B')) return 'A2';
    return '';
  };

  const columns = useMemo(
    () => [
      { Header: 'Team', accessor: 'team' },
      { Header: 'MP', accessor: 'MP' },
      { Header: 'W', accessor: 'W' },
      { Header: 'L', accessor: 'L' },
      { Header: 'D', accessor: 'D' },
      { Header: 'GF', accessor: 'GF' },
      { Header: 'GA', accessor: 'GA' },
      { Header: 'GD', accessor: 'GD', Cell: ({ value }) => (value >= 0 ? `+${value}` : value) },
      { Header: 'PTS', accessor: 'PTS' },
      { Header: 'PPG', accessor: 'PPG' },
      { Header: 'Semifinal Position', accessor: 'Semifinal Position' },
    ],
    []
  );

  const officialTableData = useMemo(() => standings, [standings]);
  const theoreticalTableData = useMemo(() => theoreticalStandingsWithPositions, [theoreticalStandingsWithPositions]);

  const { getTableProps: getOfficialTableProps, getTableBodyProps: getOfficialTableBodyProps, headerGroups: officialHeaderGroups, rows: officialRows, prepareRow: prepareOfficialRow } = useTable({
    columns,
    data: officialTableData,
  });

  const { getTableProps: getTheoreticalTableProps, getTableBodyProps: getTheoreticalTableBodyProps, headerGroups: theoreticalHeaderGroups, rows: theoreticalRows, prepareRow: prepareTheoreticalRow } = useTable({
    columns,
    data: theoreticalTableData,
  });

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-danger">{error}</div>;
  }

  return (
    <div className="App container">
      <h1 className="text-center my-4">2025 President's Cup</h1>
      <div className="text-center mb-4">
        <button
          onClick={() => {
            console.log('Toggling showAdmin, current value:', showAdmin);
            setShowAdmin(!showAdmin);
          }}
          className="btn btn-secondary"
        >
          {showAdmin ? 'Back to Main Page' : 'Admin Dashboard'}
        </button>
      </div>

      {showAdmin ? (
        <Admin onGameScoresUpdate={setGameScores} />
      ) : (
        <>
          <div className="text-center mb-4">
            <button
              onClick={() => setShowTheoreticalStandings(!showTheoreticalStandings)}
              className="btn btn-info"
            >
              {showTheoreticalStandings ? 'Show Official Standings' : 'Show Theoretical Standings'}
            </button>
          </div>

          <h2 className="text-center mb-4">{showTheoreticalStandings ? 'Theoretical Standings' : 'Current Standings'}</h2>
          <div className="table-responsive">
            {showTheoreticalStandings ? (
              <table {...getTheoreticalTableProps()} className="table table-striped table-bordered">
                <thead className="thead-dark">
                  {theoreticalHeaderGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTheoreticalTableBodyProps()}>
                  {theoreticalRows.map(row => {
                    prepareTheoreticalRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map(cell => (
                          <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <table {...getOfficialTableProps()} className="table table-striped table-bordered">
                <thead className="thead-dark">
                  {officialHeaderGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getOfficialTableBodyProps()}>
                  {officialRows.map(row => {
                    prepareOfficialRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map(cell => (
                          <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <h2 className="text-center mb-4">Game Results</h2>
          <div className="game-results mb-4">
            {gameResultsData.map((game, index) => (
              <div key={index} className="game-result-card">
                <p>{game.Match}</p>
              </div>
            ))}
          </div>

          <h2 className="text-center mb-4">Remaining Tournament Games</h2>
          <div className="remaining-games">
            {remainingTournamentGames.map((game, index) => (
              <div key={index} className="game-card">
                <p>{game.match}</p>
                <div className="score-inputs">
                  <span>Home</span>
                  <span>{gameScores[game.id]?.homeScore || '-'}</span>
                  <span>-</span>
                  <span>{gameScores[game.id]?.awayScore || '-'}</span>
                  <span>Away</span>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-center mb-4">Playoff Bracket</h2>
          <div className="playoff-bracket">
            {playoffData.map((match, index) => (
              <div key={index} className="playoff-match">
                <p>{match}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
