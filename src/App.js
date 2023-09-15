import React, { useEffect } from 'react';
import { useState } from 'react';
import rach from  './rach.gif';
import rosso from './rosso.png'; 
import musicFile from './Smelly Cat.mp3'; 
import playIcon from './play.png'; 
import pauseIcon from './pause.png'; 
import catGif from './cat.gif';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      <img src={value} alt="" className="square-image"/>
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = rach;
    } else {
      nextSquares[i] = rosso;
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = (
      <div>
        And the winner is <img src={winner} alt="" className="square-image" />
      </div>
    );
  } else {
    status = 'Next player: ' + (xIsNext ? 'Rachel' : 'Ross');
  }

  return (
    <div > 
      <div className='board-frame'>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>

      <div className="status"> {status}</div>
      </div>
     
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [audio] = useState(new Audio(musicFile));
  const [catPosition, setCatPosition] = React.useState(0);


  useEffect(() => {
    const moveCat = () => {
      // Calculate the new position of the cat
      const newPosition = catPosition + 1;

      // Reset the position 
      if (newPosition >= window.innerWidth) {
        setCatPosition(-100); // Move the cat off the screen to the left
      } else {
        setCatPosition(newPosition);
      }
    };

    // Set an interval to move the cat
    const catInterval = setInterval(moveCat, 50);

    // Clean up the interval when the component unmounts
    return () => clearInterval(catInterval);
  }, [catPosition]);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  function toggleMusic() {
    // const audio = new Audio(musicFile);
  
    if (isMusicPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsMusicPlaying(!isMusicPlaying);
  }

  return (
    <div className="game">
      <div className="game-board">
        <div className='title'> </div>
        <div className='game-area'>
            <img
            src={catGif}
            alt="Walking Cat"
            className="cat"
            style={{ left: catPosition + 'px' }}
          /> 
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} /> 
          <div className="frame"></div>
          <div className="game-info">
        <div className='moves-heading'>Moves</div>
        <ol>{moves}</ol>
        </div>
        </div>
      </div>

      <div className="music-button" onClick={toggleMusic}>
      <img
        src={isMusicPlaying ? pauseIcon : playIcon}
        alt={isMusicPlaying ? 'Pause' : 'Play'}
      />
    </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
