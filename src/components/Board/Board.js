import React, { useState } from "react";
import "./Board.css";
import BoardData from "../../utils/BoardData";
import Column from "../Column/Column";

const Board = ({ currentPlayer, togglePlayer, gameOverHook}) => {
  const columns = 7;

  const winHook = () => {
    gameOverHook();
    // Play cool win animation
  };

  const [boardData, _] = useState(new BoardData(winHook)); // This feels very wrong, but it works

  // Called when a column is clicked
  const columnHook = (columnIndex) => {
    if (boardData.placePiece(columnIndex)) {
      if (!boardData.hasWon) togglePlayer();
      return true;
    }
    return false;
  };

  // Create columns with the Column component
  const boardColumns = [];
  for (let col = 0; col < columns; col++) {
    boardColumns.push(
      <Column
        key={`column-${col}`}
        currentPlayer={currentPlayer}
        columnIndex={col}
        columnHook={columnHook}
      />
    );
  }

  return (
    <div className="board">
      <div className="row">{boardColumns}</div>
    </div>
  );
};

export default Board;
