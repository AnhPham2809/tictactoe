import {useState} from 'react';

function Square({value, onSquareClick, winningSquare}) {

  //EXTRA IV: When someone wins, highlight the three squares that caused the win (and when no one wins, display a message about the result being a draw).
const className = "square" + ( winningSquare ? " winning" : "");

const winnerStyle = winningSquare ? { backgroundColor: "#00FF06" } : null;

return (
<button className={className}
 onClick={onSquareClick}
 style = {winnerStyle}>
  {value}
</button>
);
}

function Board( { xIsNext, squares, onPlay, currentMove}) { //Set up board
  const gameResult = calculateWinner(squares);
  const winningPlayer = gameResult?.winner;
  const winningLine = gameResult?.line;

function handleClick(i){
  if(calculateWinner(squares) || squares[i] ){
    return; //Prevent filling in a filled spot
  }

const nextSquares = squares.slice();
if (xIsNext){ // Decide turns
  nextSquares[i] = 'X';
} else {
  nextSquares[i] = 'O';
}
 onPlay(nextSquares,i);
}

let status;
if (winningPlayer){
  status = "Congrats " + winningPlayer + " is the winner";
} 
else if(currentMove === 9){
  status = "The game is a Draw!";
}
else {
  status = "Next player: " + (xIsNext ? "X" : "O");
}

//EXTRA II: Rewrite Board to use two loops to make the squares instead of hardcoding them.
const sizeOfBoard = Math.sqrt(squares.length);
let board = [];

for(let i=0; i < sizeOfBoard; i++){
  let row = [];
  for (let j = 0; j <sizeOfBoard; j++){
    const index = i *sizeOfBoard + j; //Row i + position j, will never overlap cuz its a square 
    const winningSquare = winningLine?.includes(index); //Check if the current square is in the winning condition.
    row.push( //// Put new elements to end of array, then return the size of the new array
      <Square key={index} 
      value={squares[index]} 
      onSquareClick ={() => handleClick(index)}
      winningSquare ={winningSquare}      
      />
    ) ;
  }

board.push(
  <div key={i} className ="board-row">
    {row}
  </div>
);
}
return (
    <>
<div className="status"> {status} </div>
{board}
</> 
);
}

export default function Game()
{
  const [history, setHistory] = useState([{squares :Array(9).fill(null)}]);
  const [currentMove, setCurrentMove] = useState(0);
  const [checkAscending, setAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;

  const current = history[currentMove];
  const currentSquares = current.squares;


  function handlePlay(nextSquares, i){
    const nextHistory = [...history.slice(0, currentMove + 1), 
      {squares: nextSquares, lastMove: i}
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

function jumpTo(nextMove){
  setCurrentMove(nextMove);
}

const moves = history.map((step, move) => {
let description;
//EXTRA I: For the current move only, show “You are at move #…” instead of a button.


if(move === currentMove){
  if(move === 0){ //Start of game, tell player to make a move
    description = "Make a Move!";
  }
  else{
  description = "You are already at turn # " + move;}
  return <li key={move}>{description}</li>
}
else{
  //EXTRA V: Display the location for each move in the format (row, col) in the move history list.
if (move > 0){
  const rowValue = Math.floor(step.lastMove / 3) +1;
  const colValue = (step.lastMove % 3) +1;
  description = `Set to move (${rowValue}, ${colValue})`;
} 
else {
  description = 'Go to game start';
}

return (
  <li key={move}>
    <button onClick={() => jumpTo(move)}> {description} </button>
  </li>
);
}
});

//EXTRA III: Add a toggle button that lets you sort the moves in either ascending or descending order.
if (!checkAscending) {
  moves.reverse(); //Reverse all the elements in the moves array. Toggle back and front in ascending and descending
}

return (
  <div className="game">
    <div className="game-board">
      <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
    </div>
    <div className="game-info">

{/* This is for ascending descending */}
      <button onClick={() => setAscending(!checkAscending)}>
        {checkAscending ? "Currently Descending" : "Currently Ascending"}
      </button>
      <ol>{moves}</ol>
    </div>
  </div>
);
}

function calculateWinner(squares){
  const inALine = [ //Manually all possible combination in a line
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];

  for (let i=0; i < inALine.length; i++){
    const [a,b,c]=inALine[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return {winner: squares[a], line:inALine[i]};
    }
  }
return null;
}

