import React, { useState, useEffect } from 'react';
import { useTable, useSortBy } from 'react-table';
import { Analytics } from '@vercel/analytics/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Admin from './Admin';

// Columns for standings table (with sorting)
const standingsColumns = [
  { Header: 'Team', accessor: 'team', className: 'sticky-column' },
  { Header: 'MP', accessor: 'mp' },
  { Header: 'W', accessor: 'w' },
  { Header: 'L', accessor: 'l' },
  { Header: 'D', accessor: 'd' },
  { Header: 'GF', accessor: 'gf' },
  { Header: 'GA', accessor: 'ga' },
  { Header: 'GD', accessor: 'gd' },
  { Header: 'PTS', accessor: 'pts' },
  { Header: 'PPG', accessor: 'ppg' },
  { Header: 'Semifinal Position', accessor: 'semifinal_position' },
];

// Columns for game results list
const gameResultsColumns = [
  { Header: 'Match', accessor: 'Match', className: 'sticky-column' },
];

// Columns for odds table
const oddsColumns = [
  { Header: 'Team', accessor: 'Team', className: 'sticky-column' },
  { Header: 'Pre-Tournament Odds to Advance (American)', accessor: 'PreTournamentOddsToAdvance' },
  { Header: 'Pre-Tournament Odds to Advance (%)', accessor: 'PreTournamentOddsToAdvancePercent' },
  { Header: 'Current Odds to Advance (American)', accessor: 'CurrentOddsToAdvance' },
  { Header: 'Current Odds to Advance (%)', accessor: 'CurrentOddsToAdvancePercent' },
  { Header: 'Chance to Win Semifinal and Advance to State (%)', accessor: 'ChanceToWinSemifinalAndAdvanceToState' },
  { Header: 'Semifinal Position', accessor: 'SemifinalPosition' },
];

// Columns for projected points table
const pointsColumns = [
  { Header: 'Team', accessor: 'Team', className: 'sticky-column' },
  { Header: 'Projected Points', accessor: 'ProjectedPoints' },
];

// Columns for projected playoffs table
const playoffColumns = [
  { Header: 'Matchup', accessor: 'Matchup', className: 'sticky-column' },
  { Header: 'Team 1', accessor: 'Team1' },
  { Header: 'Team 1 Chance to Win (%)', accessor: 'Team1Chance' },
  { Header: 'Team 2', accessor: 'Team2' },
  { Header: 'Team 2 Chance to Win (%)', accessor: 'Team2Chance' },
];

// Columns for team records table
const teamRecordsColumns = [
  { Header: 'Team', accessor: 'Team', className: 'sticky-column' },
  { Header: 'Total Games', accessor: 'TotalGames' },
  { Header: 'Wins', accessor: 'Wins' },
  { Header: 'Losses', accessor: 'Losses' },
  { Header: 'Draws', accessor: 'Draws' },
  { Header: 'Goals For', accessor: 'GoalsFor' },
  { Header: 'Goals Against', accessor: 'GoalsAgainst' },
  { Header: 'GD', accessor: 'GD' },
];

// Odds data
const oddsData = [
  { Team: "HTX Kingwood 14G Gold (Bracket A)", PreTournamentOddsToAdvance: "+300", PreTournamentOddsToAdvancePercent: "25%", CurrentOddsToAdvance: "-1900", CurrentOddsToAdvancePercent: "95%", ChanceToWinSemifinalAndAdvanceToState: "71.25%", SemifinalPosition: "A1" },
  { Team: "HTX West 14G Gold (Bracket C)", PreTournamentOddsToAdvance: "-233", PreTournamentOddsToAdvancePercent: "70%", CurrentOddsToAdvance: "-1900", CurrentOddsToAdvancePercent: "95%", ChanceToWinSemifinalAndAdvanceToState: "61.75%", SemifinalPosition: "W2" },
  { Team: "HTX City 15 W (Bracket B)", PreTournamentOddsToAdvance: "-900", PreTournamentOddsToAdvancePercent: "90%", CurrentOddsToAdvance: "+150", CurrentOddsToAdvancePercent: "40%", ChanceToWinSemifinalAndAdvanceToState: "5%", SemifinalPosition: "" },
  { Team: "HTX Woodlands 14G Black (Bracket A)", PreTournamentOddsToAdvance: "-3233", PreTournamentOddsToAdvancePercent: "97%", CurrentOddsToAdvance: "-1900", CurrentOddsToAdvancePercent: "95%", ChanceToWinSemifinalAndAdvanceToState: "10%", SemifinalPosition: "W3" },
  { Team: "Legacy Soccer Legacy 2015 Girls Green (Bracket A)", PreTournamentOddsToAdvance: "+300", PreTournamentOddsToAdvancePercent: "25%", CurrentOddsToAdvance: "+233", CurrentOddsToAdvancePercent: "30%", ChanceToWinSemifinalAndAdvanceToState: "10%", SemifinalPosition: "" },
  { Team: "Inwood SC ID PSG Academy Houston South 14G Blue EDPL (Bracket A)", PreTournamentOddsToAdvance: "+1900", PreTournamentOddsToAdvancePercent: "5%", CurrentOddsToAdvance: "+400", CurrentOddsToAdvancePercent: "20%", ChanceToWinSemifinalAndAdvanceToState: "5%", SemifinalPosition: "" },
  { Team: "HTX Tomball 14G Gold (Bracket C)", PreTournamentOddsToAdvance: "-567", PreTournamentOddsToAdvancePercent: "85%", CurrentOddsToAdvance: "+900", CurrentOddsToAdvancePercent: "10%", ChanceToWinSemifinalAndAdvanceToState: "3%", SemifinalPosition: "" },
  { Team: "GFI Academy GFI 2014 Girls DPL Next (Bracket B)", PreTournamentOddsToAdvance: "+300", PreTournamentOddsToAdvancePercent: "25%", CurrentOddsToAdvance: "+1900", CurrentOddsToAdvancePercent: "5%", ChanceToWinSemifinalAndAdvanceToState: "1%", SemifinalPosition: "" },
  { Team: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL (Bracket C)", PreTournamentOddsToAdvance: "+1900", PreTournamentOddsToAdvancePercent: "5%", CurrentOddsToAdvance: "-9900", CurrentOddsToAdvancePercent: "99%", ChanceToWinSemifinalAndAdvanceToState: "34.65%", SemifinalPosition: "W1" },
  { Team: "Legacy Soccer Legacy 2014 Girls White (Bracket B)", PreTournamentOddsToAdvance: "+900", PreTournamentOddsToAdvancePercent: "10%", CurrentOddsToAdvance: "+19900", CurrentOddsToAdvancePercent: "0.5%", ChanceToWinSemifinalAndAdvanceToState: "0.075%", SemifinalPosition: "" },
];

// Projected points data
const pointsData = [
  { Team: "HTX West 14G Gold (Bracket C)", ProjectedPoints: "9.0" },
  { Team: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL (Bracket C)", ProjectedPoints: "6.0" },
  { Team: "HTX Woodlands 14G Black (Bracket A)", ProjectedPoints: "4.5" },
  { Team: "HTX City 15 W (Bracket B)", ProjectedPoints: "4.5" },
  { Team: "HTX Kingwood 14G Gold (Bracket A)", ProjectedPoints: "4.5" },
  { Team: "Inwood SC ID PSG Academy Houston South 14G Blue EDPL (Bracket A)", ProjectedPoints: "4.5" },
  { Team: "Legacy Soccer Legacy 2015 Girls Green (Bracket A)", ProjectedPoints: "4.5" },
  { Team: "GFI Academy GFI 2014 Girls DPL Next (Bracket B)", ProjectedPoints: "3.0" },
  { Team: "HTX Tomball 14G Gold (Bracket C)", ProjectedPoints: "1.5" },
  { Team: "Legacy Soccer Legacy 2014 Girls White (Bracket B)", ProjectedPoints: "0.0" },
];

// Team records data
const teamRecordsData = [
  { Team: "HTX Kingwood 14G Gold (Bracket A)", TotalGames: 15, Wins: 5, Losses: 8, Draws: 2, GoalsFor: 29, GoalsAgainst: 22, GD: 7 },
  { Team: "HTX West 14G Gold (Bracket C)", TotalGames: 16, Wins: 9, Losses: 4, Draws: 3, GoalsFor: 37, GoalsAgainst: 16, GD: 21 },
  { Team: "HTX Woodlands 14G Black (Bracket A)", TotalGames: 16, Wins: 9, Losses: 4, Draws: 3, GoalsFor: 31, GoalsAgainst: 23, GD: 8 },
  { Team: "HTX City 15 W (Bracket B)", TotalGames: 15, Wins: 12, Losses: 2, Draws: 1, GoalsFor: 54, GoalsAgainst: 19, GD: 35 },
  { Team: "Inwood SC ID PSG Academy Houston South 14G Blue EDPL (Bracket A)", TotalGames: 15, Wins: 4, Losses: 8, Draws: 3, GoalsFor: 18, GoalsAgainst: 23, GD: -5 },
  { Team: "GFI Academy GFI 2014 Girls DPL Next (Bracket B)", TotalGames: 13, Wins: 4, Losses: 8, Draws: 1, GoalsFor: 19, GoalsAgainst: 37, GD: -18 },
  { Team: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL (Bracket C)", TotalGames: 14, Wins: 1, Losses: 12, Draws: 1, GoalsFor: 12, GoalsAgainst: 47, GD: -35 },
  { Team: "HTX Tomball 14G Gold (Bracket C)", TotalGames: 14, Wins: 9, Losses: 2, Draws: 3, GoalsFor: 35, GoalsAgainst: 14, GD: 21 },
  { Team: "Legacy Soccer Legacy 2015 Girls Green (Bracket A)", TotalGames: 16, Wins: 7, Losses: 4, Draws: 5, GoalsFor: 24, GoalsAgainst: 18, GD: 6 },
  { Team: "Legacy Soccer Legacy 2014 Girls White (Bracket B)", TotalGames: 15, Wins: 3, Losses: 9, Draws: 3, GoalsFor: 15, GoalsAgainst: 34, GD: -19 },
];

// Initial playoff data (updated probabilities for A1 vs. W3)
const initialPlayoffData = [
  {
    Matchup: "A1 vs. Wildcard #3 (Saturday, May 03, 2025 at Meyer Park - Meyer Park #24W)",
    Team1: "HTX Kingwood 14G Gold (Bracket A)",
    Team1Chance: "30%",
    Team2: "HTX Woodlands 14G Black (Bracket A)",
    Team2Chance: "70%",
  },
  {
    Matchup: "Wildcard #1 vs. Wildcard #2 (Saturday, May 03, 2025 at Bear Creek Park - Field 23S)",
    Team1: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL (Bracket C)",
    Team1Chance: "34.65%",
    Team2: "HTX West 14G Gold (Bracket C)",
    Team2Chance: "61.75%",
  },
];

function App() {
  // State for standings (fetched from API)
  const [standings, setStandings] = useState([]);
  // State for playoff data (dynamic)
  const [playoffData] = useState(initialPlayoffData);
  // State for user-entered scores
  const [gameScores, setGameScores] = useState({});
  // State for game results data (fetched from API)
  const [gameResultsData, setGameResultsData] = useState([]);
  // State for remaining games (fetched from API)
  const [remainingTournamentGames, setRemainingTournamentGames] = useState([]);
  // State for loading and error handling
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State for showing admin page
  const [showAdmin, setShowAdmin] = useState(false);

  // Fetch initial data from API
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
        setRemainingTournamentGames(futureGames);

        const standingsData = await fetchWithErrorHandling('/api/standings', 'Failed to fetch standings');
        setStandings(standingsData);

        const initialScores = futureGames.reduce((acc, game) => {
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

  // Function to handle score input changes
  const handleScoreChange = async (gameId, field, value) => {
    // Ensure only non-negative integers
    if (value === '' || (Number.isInteger(Number(value)) && Number(value) >= 0)) {
      setGameScores(prev => ({
        ...prev,
        [gameId]: {
          ...prev[gameId],
          [field]: value,
        },
      }));

      const homeScore = field === 'homeScore' ? value : gameScores[gameId].homeScore;
      const awayScore = field === 'awayScore' ? value : gameScores[gameId].awayScore;

      if (homeScore !== '' && awayScore !== '') {
        try {
          const response = await fetch('/api/update-game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: gameId,
              homeScore: parseInt(homeScore),
              awayScore: parseInt(awayScore),
              isFutureGame: true,
            }),
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to update game');
          }

          const standingsResponse = await fetch('/api/standings');
          if (!standingsResponse.ok) throw new Error('Failed to fetch updated standings');
          const updatedStandings = await standingsResponse.json();
          setStandings(updatedStandings);
        } catch (err) {
          setError(err.message);
        }
      }
    }
  };

  // Table instances
  const standingsTableInstance = useTable(
    {
      columns: standingsColumns,
      data: standings,
      initialState: { sortBy: [{ id: 'pts', desc: true }, { id: 'gd', desc: true }] },
    },
    useSortBy
  );

  const gameResultsTableInstance = useTable({
    columns: gameResultsColumns,
    data: gameResultsData,
  });

  const oddsTableInstance = useTable(
    {
      columns: oddsColumns,
      data: oddsData,
    },
    useSortBy
  );

  const pointsTableInstance = useTable({
    columns: pointsColumns,
    data: pointsData,
  });

  const playoffTableInstance = useTable({
    columns: playoffColumns,
    data: playoffData,
  });

  const teamRecordsTableInstance = useTable({
    columns: teamRecordsColumns,
    data: teamRecordsData,
  });

  const {
    getTableProps: getStandingsTableProps,
    getTableBodyProps: getStandingsTableBodyProps,
    headerGroups: standingsHeaderGroups,
    rows: standingsRows,
    prepareRow: prepareStandingsRow,
  } = standingsTableInstance;

  const {
    getTableProps: getGameResultsTableProps,
    getTableBodyProps: getGameResultsTableBodyProps,
    headerGroups: gameResultsHeaderGroups,
    rows: gameResultsRows,
    prepareRow: prepareGameResultsRow,
  } = gameResultsTableInstance;

  const {
    getTableProps: getOddsTableProps,
    getTableBodyProps: getOddsTableBodyProps,
    headerGroups: oddsHeaderGroups,
    rows: oddsRows,
    prepareRow: prepareOddsRow,
  } = oddsTableInstance;

  const {
    getTableProps: getPointsTableProps,
    getTableBodyProps: getPointsTableBodyProps,
    headerGroups: pointsHeaderGroups,
    rows: pointsRows,
    prepareRow: preparePointsRow,
  } = pointsTableInstance;

  const {
    getTableProps: getPlayoffTableProps,
    getTableBodyProps: getPlayoffTableBodyProps,
    headerGroups: playoffHeaderGroups,
    rows: playoffRows,
    prepareRow: preparePlayoffRow,
  } = playoffTableInstance;

  const {
    getTableProps: getTeamRecordsTableProps,
    getTableBodyProps: getTeamRecordsTableBodyProps,
    headerGroups: teamRecordsHeaderGroups,
    rows: teamRecordsRows,
    prepareRow: prepareTeamRecordsRow,
  } = teamRecordsTableInstance;

  if (loading) {
    return <div className="text-center mt-5">Loading data...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <div className="header-image">
        <img src="/presidents-cup-2025.png" alt="2025 President's Cup Logo" />
      </div>
      <h1 className="text-center mb-2">2025 President's Cup Tournament Odds</h1>
      <h3 className="text-center subtitle mb-4">Female U11 - Eastern District Playoffs</h3>

      <div className="text-center mb-4">
        <button
          onClick={() => setShowAdmin(!showAdmin)}
          className="btn btn-secondary"
        >
          {showAdmin ? 'Back to Main Page' : 'Admin Dashboard'}
        </button>
      </div>

      {showAdmin ? (
        <Admin />
      ) : (
        <>
          {/* Standings Table with Input Form for Remaining Tournament Games */}
          <h2 className="text-center mb-4">Enter Scores for Remaining Group Play Games</h2>
          <div className="game-entry-container">
            {remainingTournamentGames.map(game => (
              <div key={game.id} className="game-entry-card">
                <div className="game-entry-header">
                  <span className="game-date">{game.date}</span>
                  <span className="game-matchup">{game.matchup}</span>
                </div>
                <div className="game-teams">
                  <span className="team-name">{game.home_team}</span>
                  <span className="vs-label">vs</span>
                  <span className="team-name">{game.away_team}</span>
                </div>
                <div className="score-input-group">
                  <div className="score-input">
                    <label className="score-label">Home</label>
                    <input
                      type="number"
                      className="form-control score-field"
                      placeholder="0"
                      value={gameScores[game.id]?.homeScore || ''}
                      onChange={(e) => handleScoreChange(game.id, 'homeScore', e.target.value)}
                      min="0"
                      step="1"
                    />
                  </div>
                  <span className="score-divider">-</span>
                  <div className="score-input">
                    <label className="score-label">Away</label>
                    <input
                      type="number"
                      className="form-control score-field"
                      placeholder="0"
                      value={gameScores[game.id]?.awayScore || ''}
                      onChange={(e) => handleScoreChange(game.id, 'awayScore', e.target.value)}
                      min="0"
                      step="1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-center mb-3 mt-5">Current Standings</h2>
          <div className="table-responsive">
            <table {...getStandingsTableProps()} className="table table-striped table-bordered">
              <thead className="thead-dark">
                {standingsHeaderGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th {...column.getHeaderProps(column.getSortByToggleProps())} className={column.className}>
                        {column.render('Header')}
                        <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getStandingsTableBodyProps()}>
                {standingsRows.map(row => {
                  prepareStandingsRow(row);
                  const isSemifinalist = row.original.semifinal_position !== "";
                  return (
                    <tr {...row.getRowProps()} className={isSemifinalist ? 'semifinalist-row' : ''}>
                      {row.cells.map(cell => (
                        <td {...cell.getCellProps()} className={cell.column.className}>
                          {cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Game Results Table */}
          <h2 className="text-center mb-3 mt-5">Game Results</h2>
          <div className="table-responsive">
            <table {...getGameResultsTableProps()} className="table table-striped table-bordered">
              <thead className="thead-dark">
                {gameResultsHeaderGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th {...column.getHeaderProps()} className={column.className}>
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getGameResultsTableBodyProps()}>
                {gameResultsRows.map(row => {
                  prepareGameResultsRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map(cell => (
                        <td {...cell.getCellProps()} className={cell.column.className}>
                          {cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Odds Table */}
          <h2 className="text-center mb-3 mt-5">Tournament Odds</h2>
          <div className="table-responsive">
            <table {...getOddsTableProps()} className="table table-striped table-bordered">
              <thead className="thead-dark">
                {oddsHeaderGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th {...column.getHeaderProps(column.getSortByToggleProps())} className={column.className}>
                        {column.render('Header')}
                        <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getOddsTableBodyProps()}>
                {oddsRows.map(row => {
                  prepareOddsRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map(cell => (
                        <td {...cell.getCellProps()} className={cell.column.className}>
                          {cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Projected Points Table */}
          <h2 className="text-center mb-3 mt-5">Projected Points</h2>
          <div className="table-responsive">
            <table {...getPointsTableProps()} className="table table-striped table-bordered">
              <thead className="thead-dark">
                {pointsHeaderGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th {...column.getHeaderProps()} className={column.className}>
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getPointsTableBodyProps()}>
                {pointsRows.map(row => {
                  preparePointsRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map(cell => (
                        <td {...cell.getCellProps()} className={cell.column.className}>
                          {cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Projected District Playoffs Table */}
          <h2 className="text-center mb-3 mt-5">Projected District Playoffs</h2>
          <div className="table-responsive">
            <table {...getPlayoffTableProps()} className="table table-striped table-bordered">
              <thead className="thead-dark">
                {playoffHeaderGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th {...column.getHeaderProps()} className={column.className}>
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getPlayoffTableBodyProps()}>
                {playoffRows.map(row => {
                  preparePlayoffRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map(cell => (
                        <td {...cell.getCellProps()} className={cell.column.className}>
                          {cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Team Records Table (Summary Only) */}
          <h2 className="text-center mb-3 mt-5">Team Records</h2>
          <div className="table-responsive">
            <table {...getTeamRecordsTableProps()} className="table table-striped table-bordered">
              <thead className="thead-dark">
                {teamRecordsHeaderGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th {...column.getHeaderProps()} className={column.className}>
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTeamRecordsTableBodyProps()}>
                {teamRecordsRows.map(row => {
                  prepareTeamRecordsRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map(cell => (
                        <td {...cell.getCellProps()} className={cell.column.className}>
                          {cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <footer className="text-center mt-5 mb-3 disclaimer">
            <p>
              Disclaimer: These predictions are based on past performance and do not guarantee future outcomes. Think of it like predicting the weather—sometimes it’s sunny, sometimes it rains soccer balls! ⚽🌦️
            </p>
          </footer>
          <Analytics />
        </>
      )}
    </div>
  );
}

export default App;
