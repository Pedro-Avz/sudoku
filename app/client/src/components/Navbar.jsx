import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/rank">Ranking</Link>
        </li>
        <li>
          <Link to="/sudoku">Jogar</Link>
        </li>
        <li>
          <a href="#" onClick={handleLogout}>Sair</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
