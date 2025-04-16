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

  console.log('Rendering Admin component, isLoggedIn:', isLoggedIn);

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
      const pastResponse = await fetch('/api/game-results');
      const futureResponse = await fetch('/api/future-games');

      if (!pastResponse.ok || !futureResponse.ok) {
        const pastError = pastResponse.ok ? null : await pastResponse.json();
        const futureError = futureResponse.ok ? null : await futureResponse.json();
        throw new Error(pastError?.error || futureError?.error || 'Failed to fetch games');
      }

      const pastData = await pastResponse.json();
      const futureData = await futureResponse.json();

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
    } catch (err) {
      console.error('fetchGames error:', err);
      setError(err.message);
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
        ) : row.original.match.match(/\d+-\d+/)?.[0]?.split('-')[0]
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
        ) : row.original.match.match(/\d+-\d+/)?.[0]?.split('-')[1]
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
    console.log('Rendering login form, error:', error);
    return (
      <div className="admin-login-container">
        <h2 className="text-center mb-4">Admin Login</h2>
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                console.log('Username input changed, new value:', e.target.value);
                setUsername(e.target.value);
              }}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                console.log('Password input changed, new value:', e.target.value);
                setPassword(e.target.value);
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

  console.log('Rendering dashboard, loading:', loading, 'error:', error);
  return (
    <div className="admin-container">
      <h2 className="text-center mb-4">Admin Dashboard - Manage Games</h2>
      {loading ? (
        <div className="text-center">Loading games...</div>
      ) : error ? (
        <div className="text-center text-danger">{error}</div>
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
