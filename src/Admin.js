import React, { useState, useEffect, useMemo } from 'react';
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

  // Define columns at the top level (outside conditionals)
  const columns = useMemo(
    () => [
      { Header: 'Match', accessor: 'match' },
      {
        Header: 'Home Score',
        accessor: 'homeScore',
        Cell: ({ row }) => (
          row.original.isFutureGame
            ? row.original.homeScore || 'Not set'
            : row.original.match.match(/\d+-\d+/)?.[0]?.split('-')[0] || 'N/A'
        ),
      },
      {
        Header: 'Away Score',
        accessor: 'awayScore',
        Cell: ({ row }) => (
          row.original.isFutureGame
            ? row.original.awayScore || 'Not set'
            : row.original.match.match(/\d+-\d+/)?.[0]?.split('-')[1] || 'N/A'
        ),
      },
      {
        Header: 'Validated',
        accessor: 'validated',
        Cell: ({ row }) => (
          row.original.isFutureGame ? (row.original.validated ? 'Yes' : 'No') : 'N/A'
        ),
      },
    ],
    []
  );

  // Initialize tableData and useTable at the top level
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
