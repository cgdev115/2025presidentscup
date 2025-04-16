import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTable } from 'react-table';
import './Admin.css';

const Admin = ({ onGameScoresUpdate }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [pastGames, setPastGames] = useState([]);
  const [futureGames, setFutureGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gameScores, setGameScores] = useState({}); // New state to store user-input scores

  console.log('Rendering Admin component, isLoggedIn:', isLoggedIn, 'username:', username, 'error:', error);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('handleLogin called, username:', username, 'password:', password);
    setError(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      console.log('Login successful, setting isLoggedIn to true');
      setIsLoggedIn(true);
      setUsername('');
      setPassword('');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    }
  };

  const fetchGames = useCallback(async () => {
    console.log('fetchGames called');
    setLoading(true);
    try {
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

      const pastData = await fetchWithErrorHandling('/api/game-results', 'Failed to fetch past games');
      const futureData = await fetchWithErrorHandling('/api/future-games', 'Failed to fetch future games');

      console.log('Fetched games, past:', pastData.length, 'future:', pastData.length);
      setPastGames(pastData.map((game, index) => ({
        id: game.id,
        match: game.Match,
        isFutureGame: false,
        index,
      })));
      setFutureGames(futureData.map((game, index) => ({
        id: game.id,
        match: `${game.home_team} vs ${game.away_team} (${game.matchup}, ${game.date})`,
        homeScore: game.home_score,
        awayScore: game.away_score,
        validated: game.validated,
        isFutureGame: true,
        index: pastData.length + index,
      })));

      // Initialize gameScores with fetched scores
      const initialScores = futureData.reduce((acc, game) => {
        acc[game.id] = { homeScore: game.home_score || '', awayScore: game.away_score || '' };
        return acc;
      }, {});
      setGameScores(initialScores);
      onGameScoresUpdate(initialScores); // Pass initial scores to parent

      setError(null);
    } catch (err) {
      console.error('fetchGames error:', err);
      setError(err.message);
      setPastGames([]);
      setFutureGames([]);
    } finally {
      setLoading(false);
    }
  }, [onGameScoresUpdate]);

  useEffect(() => {
    console.log('useEffect triggered, isLoggedIn:', isLoggedIn);
    if (isLoggedIn) {
      fetchGames();
    }
  }, [isLoggedIn, fetchGames]);

  const handleUpdateScore = useCallback(async (gameId, isFutureGame, homeScore, awayScore) => {
    console.log('handleUpdateScore called, gameId:', gameId, 'isFutureGame:', isFutureGame, 'homeScore:', homeScore, 'awayScore:', awayScore);
    
    // Update local gameScores state
    setGameScores(prevScores => {
      const updatedScores = {
        ...prevScores,
        [gameId]: { homeScore, awayScore }
      };
      onGameScoresUpdate(updatedScores); // Pass updated scores to parent
      return updatedScores;
    });

    try {
      const response = await fetch('/api/update-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: gameId, homeScore: parseInt(homeScore), awayScore: parseInt(awayScore), isFutureGame }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update game');
      }

      console.log('Score updated successfully, refreshing games');
      await fetchGames();
    } catch (err) {
      console.error('handleUpdateScore error:', err);
      setError(err.message);
    }
  }, [fetchGames, onGameScoresUpdate]);

  const handleValidateGame = useCallback(async (gameId) => {
    console.log('handleValidateGame called, gameId:', gameId);
    try {
      const response = await fetch('/api/validate-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: gameId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to validate game');
      }

      console.log('Game validated successfully, refreshing games');
      await fetchGames();
    } catch (err) {
      console.error('handleValidateGame error:', err);
      setError(err.message);
    }
  }, [fetchGames]);

  const columns = useMemo(
    () => [
      { Header: 'Match', accessor: 'match' },
      {
        Header: 'Home Score',
        accessor: 'homeScore',
        Cell: ({ row }) => (
          row.original.isFutureGame ? (
            <input
              type="number"
              value={gameScores[row.original.id]?.homeScore || ''}
              onChange={(e) => handleUpdateScore(row.original.id, true, e.target.value, gameScores[row.original.id]?.awayScore || 0)}
              min="0"
              className="score-field"
            />
          ) : row.original.match.match(/\d+-\d+/)?.[0]?.split('-')[0] || 'N/A'
        ),
      },
      {
        Header: 'Away Score',
        accessor: 'awayScore',
        Cell: ({ row }) => (
          row.original.isFutureGame ? (
            <input
              type="number"
              value={gameScores[row.original.id]?.awayScore || ''}
              onChange={(e) => handleUpdateScore(row.original.id, true, gameScores[row.original.id]?.homeScore || 0, e.target.value)}
              min="0"
              className="score-field"
            />
          ) : row.original.match.match(/\d+-\d+/)?.[0]?.split('-')[1] || 'N/A'
        ),
      },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          row.original.isFutureGame && (
            <button
              onClick={() => handleValidateGame(row.original.id)}
              disabled={row.original.validated || gameScores[row.original.id]?.homeScore === '' || gameScores[row.original.id]?.awayScore === ''}
              className="validate-button"
            >
              {row.original.validated ? 'Validated' : 'Validate'}
            </button>
          )
        ),
      },
    ],
    [gameScores, handleUpdateScore, handleValidateGame]
  );

  const tableData = useMemo(() => [...pastGames, ...futureGames], [pastGames, futureGames]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: tableData,
  });

  if (!isLoggedIn) {
    console.log('Rendering login form, error:', error, 'username:', username);
    return (
      <div className="admin-login-container">
        <h2 className="text-center mb-4">Admin Login</h2>
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username || ''}
              onChange={(e) => {
                const newValue = e?.target?.value ?? '';
                console.log('Username input changed, new value:', newValue);
                setUsername(newValue);
              }}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password || ''}
              onChange={(e) => {
                const newValue = e?.target?.value ?? '';
                console.log('Password input changed, new value:', newValue);
                setPassword(newValue);
              }}
              className="form-control"
              required
            />
          </div>
          {error && <p className="text-danger text-center">{error}</p>}
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    );
  }

  console.log('Rendering dashboard, loading:', loading, 'error:', error, 'pastGames:', pastGames.length, 'futureGames:', futureGames.length);
  return (
    <div className="admin-container">
      <h2 className="text-center mb-4">Admin Dashboard - Manage Games</h2>
      {loading ? (
        <div className="text-center">Loading games...</div>
      ) : error ? (
        <div className="text-center text-danger">{error}</div>
      ) : pastGames.length === 0 && futureGames.length === 0 ? (
        <div className="text-center">No games available to display.</div>
      ) : (
        <div className="table-responsive">
          <table {...getTableProps()} className="table table-striped table-bordered">
            <thead className="thead-dark">
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map(row => {
                prepareRow(row);
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
        </div>
      )}
    </div>
  );
};

export default Admin;
