import { useState, useEffect, useRef } from 'react';
import './App.css';
import GameContainer from './components/gameContainer'
import Title from './components/title';
import ScoreContainer from './components/scoreContainer';
import Score from './components/score';
import BoardContainer from './components/boardContainer';
import Board from './components/board';
import Square from './components/square';
import Button from './components/button';

const defaultSquares = () => new Array(9).fill(null);

function App() {
  
  const [lock,setLock] = useState(false);
  const [squares, setSquares] = useState(defaultSquares());
  const [lastPlayer, setLastPlayer] = useState(0);
  const [easyComp, setEasyComp] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  // const [hardCompTurn, setHardCompTurn] = useState(false);
  
  let [count, setCount] = useState(0);
  let [player1Score, setPlayer1Score] = useState(0);
  let [player2score, setPlayer2Score] = useState(0);
  let [drawScore, setDrawScore] = useState(0);
  
  const titleRef = useRef(null);


  const toggleSquare = (num) => {
    if (lock) {
    return;
    }
    if (squares[num] !== null) {
      return;
    } else if (count%2===0) {
      squares[num] = 'x';
      setSquares([...squares]);
      setCount(++count);
      setLastPlayer('x') 
      checkWin();
    } else if (count%2===1 && easyComp===false) {
      squares[num] = 'o';
      setSquares([...squares]);
      setCount(++count);
      setLastPlayer('o')
    }
    checkWin();
  }

  useEffect(() => {
    const isComputerTurn = count % 2 === 1;
    if (easyComp && isComputerTurn && !gameOver) {
      const emptyIndexes = squares
        .map((square, index) => (square === null ? index : null))
        .filter((val) => val !== null);
      if (emptyIndexes.length > 0) {
        const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
        squares[randomIndex] = 'o';
        setSquares(squares);
        setCount(count + 1);
        checkWin()
      }
    }
    // eslint-disable-next-line
  }, [count, easyComp, gameOver, squares]);

  const won = (winner) => {
    setLock(true);
    setGameOver(true);
    if (easyComp) {
      if (winner === "x") {
        titleRef.current.innerHTML = `Nice you beat Easy, why not try Hardmode?`;
        setPlayer1Score(player1Score + 1); 
      } else if (winner === "o") {
        titleRef.current.innerHTML = `Oh no, you lost to Easy computer, try again?`;
        setPlayer2Score(player2score + 1); 
      } else {
        titleRef.current.innerHTML = `A tie? Try again!`;
        setDrawScore(drawScore + 1); 
      }
    } else if (winner === "x") {
      titleRef.current.innerHTML = `Player X Won, Well Played!`;
      setPlayer1Score(player1Score + 1); 
      setLastPlayer(winner);
    } else if (winner === "o") {
      titleRef.current.innerHTML = `Player O Won, Well Played!`;
      setPlayer2Score(player2score + 1); 
      setLastPlayer(winner);
    } else {
      titleRef.current.innerHTML = `Draw? Never End On A Draw!`;
      setDrawScore(drawScore + 1); 
    }
  }

  const checkWin = () => {
    const winCondition = [
      [0,1,2],[3,4,5],[6,7,8], //win by rows
      [0,3,6],[1,4,7],[2,5,8], //win by columns
      [0,4,8],[2,4,6] //win by diagonal
    ]

    for (const combination of winCondition) {
      const [a,b,c] = combination;
      if (squares[a]===squares[b] && squares[b]===squares[c] && squares[c] !== null) {
        won(squares[c]);
        return
      }
    } 
    if (squares.every(index => index !== null)) {
      won();
    }
  }

  const reset = () => {
    setLock(false);
    setGameOver(false);
    setSquares(defaultSquares());

    if (easyComp===false && lastPlayer === "x") {
      titleRef.current.innerHTML = `"Player "O" goes first`;
    } else {
      titleRef.current.innerHTML = `"Player "X" goes first`;
    }
    if (easyComp) {
      setCount(0);
      titleRef.current.innerHTML = `Player goes first`;   
    }
  } 

  const turnEasyComputerOn = () => {
    setLock(false);
    setSquares(defaultSquares()); 
    setCount(0);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setDrawScore(0);
    setGameOver(false)
    setEasyComp(true);
    titleRef.current.innerHTML = `Computer ON! Player goes first`;   
  }

  const turnComputerOff = () => {
    setGameOver(false);
    setLock(false);
    setSquares(defaultSquares());
    setCount(0);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setDrawScore(0);
    setEasyComp(false);
    titleRef.current.innerHTML = `Player "X" goes first`;
  }

  return (
    <GameContainer>
      <Button onClick={(e) => {turnEasyComputerOn()}}> Easy Computer </Button>
      <Button> Hard Computer </Button>
      <Button onClick={(e) => {turnComputerOff()}}> Player vs Player </Button>
      <Title ref={titleRef}/>
      <ScoreContainer>
        <Score>{easyComp? 'Player': `Player "X"`}: {player1Score}</Score>
        <Score>{easyComp? 'Computer': `Player "O"` }: {player2score}</Score>
        <Score>Draws: {drawScore}</Score>
      </ScoreContainer>
      <BoardContainer>
        <Board>
          {squares.map((square,index) =>
            <Square 
              key={index}
              x={square==='x'? 1:0}
              o={square==='o'? 1:0}
              onClick={(e) => toggleSquare(index)}/>
          )}
        </Board>
        </BoardContainer>      
      <Button onClick={(e) => {reset()}}> Reset </Button>
    </GameContainer>
  );
}

export default App;
