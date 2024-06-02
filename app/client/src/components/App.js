import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Sudoku from './Sudoku';
import Register from './Register';
import Rank from './Rank';
import Navbar from './Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/sudoku" element={<Sudoku />} />
        <Route path="/register" element={<Register />} />
        <Route path="/rank" element={<Rank />} />
      </Routes>
    </Router>
  );
}

export default App;
