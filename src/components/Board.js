import React from 'react';
import './Board.css';
import BoardData from './BoardData'
import { useState } from 'react';

const Board = () => {
  const rows = 6;
  const columns = 7;
  const board = [];

  const winFunc = () => {
    console.log("You win");
    // Add additional win logic here
  };
  const [boardData, setBoardData] = useState(new BoardData(winFunc));

  // Called when a column is clicked
  const columnHook = (columnIndex) => {
    const newBoardData = { ...boardData };
    if (newBoardData.placePiece(columnIndex)) {
      // If the move was valid and the piece was placed
      setBoardData(newBoardData); // Update the state to trigger a re-render
      return true;
    }

    return false;
  };

  for (let row = 0; row < rows; row++) {
    const currentRow = [];
    for (let col = 0; col < columns; col++) {
      currentRow.push(<div className="circle" key={`cell-${row}-${col}`}></div>);
    }
    board.push(
      <div className="row" key={`row-${row}`}>
        {currentRow}
      </div>
    );
  }

  return (
    <div className="board">
      {board}
    </div>
  );
};

export default Board;
