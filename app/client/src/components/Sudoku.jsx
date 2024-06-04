import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Sudoku = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState(Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0)));
  const [userInput, setUserInput] = useState(Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => '')));
  const [gameStarted, setGameStarted] = useState(false);
  const [timer, setTimer] = useState(420);
  const [gameOver, setGameOver] = useState(false);
  const intervalIdRef = useRef(null);

  const sudokuBoards = [
    [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ],
    [
      [8, 2, 7, 1, 5, 4, 3, 9, 6],
      [9, 6, 5, 3, 2, 7, 1, 4, 8],
      [3, 4, 1, 6, 8, 9, 7, 5, 2],
      [5, 9, 3, 4, 6, 8, 2, 7, 1],
      [4, 7, 2, 5, 1, 3, 6, 8, 9],
      [6, 1, 8, 9, 7, 2, 4, 3, 5],
      [7, 8, 6, 2, 3, 5, 9, 1, 4],
      [1, 5, 4, 7, 9, 6, 8, 2, 3],
      [2, 3, 9, 8, 4, 1, 5, 6, 7]
    ],
    [
      [4, 3, 5, 2, 6, 9, 7, 8, 1],
      [6, 8, 2, 5, 7, 1, 4, 9, 3],
      [1, 9, 7, 8, 3, 4, 5, 6, 2],
      [8, 2, 6, 1, 9, 5, 3, 4, 7],
      [3, 7, 4, 6, 8, 2, 9, 1, 5],
      [9, 5, 1, 7, 4, 3, 6, 2, 8],
      [5, 1, 9, 3, 2, 6, 8, 7, 4],
      [2, 4, 8, 9, 5, 7, 1, 3, 6],
      [7, 6, 3, 4, 1, 8, 2, 5, 9]
    ]
  ]

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
          setBoard(Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0))); 
          setTimer(420); 
          return prevTimer;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const giveUpGame = () => {
    clearInterval(intervalIdRef.current); 
    setGameStarted(false); 
    setBoard(Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0))); 
    setTimer(420); 
  };
  
  const generateBoard = () => {
    const randomIndex = Math.floor(Math.random() * sudokuBoards.length);
    const selectedBoard = sudokuBoards[randomIndex].map(row => [...row]);
    fillRandomCells(selectedBoard);
    setBoard(selectedBoard);
    setUserInput(Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => '')));
  };

  const fillRandomCells = (board) => {
    const cellsToEmpty = 81 - 15; // 
    for (let i = 0; i < cellsToEmpty; i++) {
      let row, col;
      do {
        row = Math.floor(Math.random() * 9);
        col = Math.floor(Math.random() * 9);
      } while (board[row][col] === 0);
      board[row][col] = 0;
    }
  };

  const handleSubmit = () => {
    const check = checkSolution();
    console.log(check);
    if (check === true) {
      const playerId = localStorage.getItem('userId');
      const gameTime = 420 - timer;

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
          setBoard(Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0)));
          setTimer(420);
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
            value={board[rowIndex][cellIndex] === 0 ? userInput[rowIndex][cellIndex] : board[rowIndex][cellIndex]}
            onChange={(e) => handleInputChange(rowIndex, cellIndex, e.target.value)}
            className="sudoku-cell"
            disabled={board[rowIndex][cellIndex] !== 0}
          />
        ))}
        <br />
      </div>
    ));
  };

  return (
    <div className="sudoku-container">
      <h1>Hard Sudoku</h1>
      {gameStarted ? (
        <div>
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
