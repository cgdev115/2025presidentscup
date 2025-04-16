import React, { useState, useEffect } from 'react';
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
        <div>
          <h3>Past Games</h3>
          <ul>
            {pastGames.map(game => (
              <li key={game.id}>{game.match}</li>
            ))}
          </ul>
          <h3>Future Games</h3>
          <ul>
            {futureGames.map(game => (
              <li key={game.id}>{game.match}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Admin;
