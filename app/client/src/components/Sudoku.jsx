import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';


//as libs de sudoku que encontrei, nenhuma funcionou... 

const Sudoku = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState(Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => '')));
  const [userInput, setUserInput] = useState(Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => '')));
  const [gameStarted, setGameStarted] = useState(false);
  const [timer, setTimer] = useState(300);
  const [gameOver, setGameOver] = useState(false);
  const intervalIdRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem('token');
   
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const startGame = () => {
    generateBoard();
    setGameStarted(true);
    intervalIdRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          clearInterval(intervalIdRef.current); 
          alert("TEMPO ESGOTADO. VOCÊ PERDEU!");
          setGameStarted(false); 
          setBoard(Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => ''))); 
          setTimer(300); 
          return prevTimer;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const giveUpGame = () => {
    clearInterval(intervalIdRef.current); 
    setGameStarted(false); 
    setBoard(Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => ''))); 
    setTimer(300); 
  };
  

  const generateBoard = () => {
    const newBoard = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => ''));
    fillRandomCells(newBoard);
    setBoard(newBoard);
    setUserInput(Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => '')));
  };

  const fillRandomCells = (board) => {
    const filledCells = Math.floor(Math.random() * 20) + 15;
    for (let i = 0; i < filledCells; i++) {
      let row, col, num;
      do {
        row = Math.floor(Math.random() * 9);
        col = Math.floor(Math.random() * 9);
        num = Math.floor(Math.random() * 9) + 1;
      } while (!isValid(board, row, col, num));
      board[row][col] = num.toString();
    }
  };

  const isValid = (board, row, col, num) => {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num || board[i][col] === num || board[3 * Math.floor(row / 3) + Math.floor(i / 3)][3 * Math.floor(col / 3) + (i % 3)] === num) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    const check = checkSolution();
    console.log(check)
    if (check === true) {
      const playerId = localStorage.getItem('userId');
      const gameTime = 300 - timer;

      const gameData = {
        id_jogador: playerId,
        time: gameTime,
      };

      fetch('http://localhost:5000/game/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(gameData),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro ao salvar o jogo');
          }
          return response.json();
        })
        .then(data => {
          console.log('Jogo salvo:', data);
          alert("Parabéns! Você ganhou o jogo!");
          setGameStarted(false);
          setGameOver(false);
          setBoard(Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => '')));
          setTimer(300);
        })
        .catch(error => {
          console.error('Erro ao salvar o jogo:', error.message);
          alert('Ocorreu um erro ao salvar o jogo. Tente novamente.');
        });
    } else {
      alert("DESCULPE, MAS SEU JOGO ESTÁ ERRADO HAHAHA");
    }
  };
  
  
  const checkSolution = () => {
    const validationBoard = board.map((row, rowIndex) =>
      row.map((cell, colIndex) => (userInput[rowIndex][colIndex] !== '' ? userInput[rowIndex][colIndex] : cell))
    );

    const isUniqueRow = (row) => {
      const seen = new Set();
      for (const cell of row) {
        if (cell === '' || seen.has(cell)) return false;
        seen.add(cell);
      }
      return true;
    };

    const isUniqueColumn = (colIndex) => {
      const seen = new Set();
      for (const row of validationBoard) {
        const cell = row[colIndex];
        if (cell === '' || seen.has(cell)) return false;
        seen.add(cell);
      }
      return true;
    };

    const isUniqueBlock = (blockRow, blockCol) => {
      const seen = new Set();
      for (let i = blockRow; i < blockRow + 3; i++) {
        for (let j = blockCol; j < blockCol + 3; j++) {
          const cell = validationBoard[i][j];
          if (cell === '' || seen.has(cell)) return false;
          seen.add(cell);
        }
      }
      return true;
    };

    for (let i = 0; i < 9; i++) {
      if (!isUniqueRow(validationBoard[i]) || !isUniqueColumn(i)) {
        return false;
      }
    }

    for (let blockRow = 0; blockRow < 9; blockRow += 3) {
      for (let blockCol = 0; blockCol < 9; blockCol += 3) {
        if (!isUniqueBlock(blockRow, blockCol)) {
          return false;
        }
      }
    }

    return true;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${formattedSeconds}`;
  };
  
  const handleInputChange = (rowIndex, colIndex, value) => {
    if (/^[1-9]?$/.test(value)) {
      const newInput = [...userInput];
      newInput[rowIndex][colIndex] = value;
      setUserInput(newInput);
    }
  };
  

  const renderBoard = () => {
    return board.map((row, rowIndex) => (
      <div key={rowIndex}>
        {row.map((cell, cellIndex) => (
          <input
            key={cellIndex}
            type="text"
            value={userInput[rowIndex][cellIndex] === '' ? board[rowIndex][cellIndex] : userInput[rowIndex][cellIndex]}
            onChange={(e) => handleInputChange(rowIndex, cellIndex, e.target.value)}
            className="sudoku-cell"
            disabled={gameOver} 
          />
        ))}
        <br />
      </div>
    ));
  };



  return (
    <div className="sudoku-container">
      <h1>Sudoku</h1>
      {gameStarted ? (
        <div>
          <p>Os números randomicos são apenas para confundir o jogador, eles podem ser editados...</p>
          <div className="time">Tempo restante: {formatTime(timer)}</div>
          <div>{renderBoard()}</div>
          <div className="sudoku-buttons">
            <button onClick={handleSubmit}>Terminar</button>
            <button onClick={giveUpGame}>Desistir</button>
          </div>
        </div>
      ) : (
        <button className="sudoku-start-button" onClick={startGame}>Jogar</button>
      )}
    </div>
  );
};

export default Sudoku;
