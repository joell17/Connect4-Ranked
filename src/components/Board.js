import React, { useState } from 'react';
import './Board.css';
import BoardData from './BoardData';
import Column from './Column';
import { useGameContext } from './GameProvider';

const Board = () => {
  const {togglePlayer} = useGameContext();
  const columns = 7;

  const winHook = () => {
    console.log("You win");
    // Add additional win logic here
  };

  const [boardData, _] = useState(new BoardData(winHook));  // This feels very wrong, but it works

  // Called when a column is clicked
  const columnHook = (columnIndex) => {
    if (boardData.placePiece(columnIndex)) {
      console.log(boardData.grid[columnIndex].length);
      togglePlayer();
      return true;
    }
    return false;
  };

  // Create columns with the Column component
  const boardColumns = [];
  for (let col = 0; col < columns; col++) {
    boardColumns.push(
      <Column key={`column-${col}`} columnIndex={col} columnHook={columnHook} />
    );
  }

  return (
    <div className="board">
      <div className="row">
        {boardColumns}
      </div>
    </div>
  );
};

export default Board;
