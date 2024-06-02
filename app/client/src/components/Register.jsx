import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
    
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token); 
        localStorage.setItem('userId', data._id);
        alert('Usuário registrado com sucesso!');
        navigate('/sudoku');
      } else {
        if (data.message === 'User already exists') {
          alert('Usuário já existe!'); 
        } else {
          alert('Erro ao registrar usuário');
        }
      }
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
    }
    
  };

  return (
    <div className="register-container">
      <h1>Cadastre-se</h1>
      <form onSubmit={handleRegister} className="register-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default Register;
