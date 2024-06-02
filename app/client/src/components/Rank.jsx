import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Rank = () => {
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('http://localhost:5000/game/rank', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        setGames(data);
      })
      .catch(error => {
        console.error('There was an error fetching the games!', error);
        setError('There was an error fetching the games.');
      });
  }, [navigate]);

  if (error) {
    return <div className="container mt-5"><p>{error}</p></div>;
  }

  return (
    <div className="container mt-5">
      <h2>Ranking</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Position</th>
            <th>Username</th>
            <th>Tempo</th>
          </tr>
        </thead>
        <tbody>
        {games.sort((a, b) => a.time - b.time).map((game, index) => (
          <tr key={game.id_game}>
            <td>{index + 1}°</td>
            <td>{game.player ? game.player.username : 'Unknown'}</td>
            <td>{game.time} seconds</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default Rank;
