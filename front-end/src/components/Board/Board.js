import React, { useEffect, useState } from "react";
import "./Board.css";
import BoardData from "../../utils/BoardData";
import Column from "../Column/Column";

const Board = ({ currentPlayer, togglePlayer, setIsGameOver, isGameOver}) => {
  const [resetCount, setResetCount] = useState(0);
  const columns = 7;

  const winHook = () => {
    setIsGameOver(true);
    // Play cool win animation
  };

  const [boardData, _] = useState(new BoardData(winHook)); // This feels very wrong, but it works

  useEffect(() => {
    if (!isGameOver) {
      console.log('The game has been started.');
      boardData.reset();
      togglePlayer();  // Surprise feature, loser goes first on rematch
      setResetCount((prevCount) => prevCount + 1);
    }
  }, [isGameOver])

  // Called when a column is clicked
  const columnHook = (columnIndex) => {
    if (boardData.placePiece(columnIndex)) {
      if (!boardData.hasWon) togglePlayer();
      return true;
    }
    return false;
  };

  // Create columns with the Column component
  const boardColumns = Array.from({ length: columns }, (_, col) => (
    <Column
      key={`column-${col}-${resetCount}`} // Include resetCount in the key
      currentPlayer={currentPlayer}
      columnIndex={col}
      columnHook={columnHook}
      isGameOver={isGameOver}
    />
  ));
  

  return (
    <div className="board">
      <div className="row">{boardColumns}</div>
    </div>
  );
};

export default Board;
