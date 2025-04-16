import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import './Admin.css';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [pastGames, setPastGames] = useState([]);
  const [futureGames, setFutureGames] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const fetchGames = async () => {
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

      console.log('Fetched games, past:', pastData.length, 'future:', futureData.length);
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
      setError(null);
    } catch (err) {
      console.error('fetchGames error:', err);
      setError(err.message);
      setPastGames([]);
      setFutureGames([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useEffect triggered, isLoggedIn:', isLoggedIn);
    if (isLoggedIn) {
      fetchGames();
    }
  }, [isLoggedIn]);

  const handleUpdateScore = async (gameId, isFutureGame, homeScore, awayScore) => {
    console.log('handleUpdateScore called, gameId:', gameId, 'isFutureGame:', isFutureGame, 'homeScore:', homeScore, 'awayScore:', awayScore);
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
  };

  const handleValidateGame = async (gameId) => {
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
  };

  const columns = [
    { Header: 'Match', accessor: 'match' },
    {
      Header: 'Home Score',
      accessor: 'homeScore',
      Cell: ({ row }) => (
        row.original.isFutureGame ? (
          <input
            type="number"
            value={row.original.homeScore || ''}
            onChange={(e) => handleUpdateScore(row.original.id, true, e.target.value, row.original.awayScore || 0)}
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
            value={row.original.awayScore || ''}
            onChange={(e) => handleUpdateScore(row.original.id, true, row.original.homeScore || 0, e.target.value)}
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
            disabled={row.original.validated || row.original.homeScore === null || row.original.awayScore === null}
            className="validate-button"
          >
            {row.original.validated ? 'Validated' : 'Validate'}
          </button>
        )
      ),
    },
  ];

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: [...pastGames, ...futureGames],
  });

  if (!isLoggedIn) {
    console.log('Rendering login form, error:', error, 'username:', username);
    try {
      return (
        <div className="admin-login-container">
          <h2 className="text-center mb-4">Admin Login</h2>
          <form
            onSubmit={handleLogin}
            className="admin-login-form"
            onKeyPress={(e) => {
              if (e.key === 'Enter') e.preventDefault();
            }}
          >
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username || ''}
                onChange={(e) => {
                  try {
                    console.log('Username input changed, new value:', e.target.value);
                    setUsername(e.target.value);
                  } catch (err) {
                    console.error('Error in username onChange:', err);
                  }
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
                  try {
                    console.log('Password input changed, new value:', e.target.value);
                    setPassword(e.target.value);
                  } catch (err) {
                    console.error('Error in password onChange:', err);
                  }
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
    } catch (renderError) {
      console.error('Error rendering login form:', renderError);
      return <div className="text-center text-danger">Error rendering login form: {renderError.message}</div>;
    }
  }

  console.log('Rendering dashboard, loading:', loading, 'error:', error, 'pastGames:', pastGames.length, 'futureGames:', futureGames.length);
  try {
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
  } catch (renderError) {
    console.error('Error rendering dashboard:', renderError);
    return <div className="text-center text-danger">Error rendering dashboard: {renderError.message}</div>;
  }
};

export default Admin;
