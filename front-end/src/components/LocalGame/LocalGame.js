import React, { useState } from "react";
import "./LocalGame.css";
import Board from "../Board/Board";
import GameMenu from "../GameMenu/GameMenu";

const LocalGame = () => {
  // I want this component to keep track of whose turn it is
  // It should tell Board whether or not a click on this computer
  // should be used for the current turn
  // This is to make it so that the Board component can be used
  // for every game mode (local pvp, local AI, online casual, online ranked)
  const [currentPlayer, setCurrentPlayer] = useState("Player2");
  const [isGameOver, setIsGameOver] = useState(false);

  const togglePlayer = () => {
    setCurrentPlayer(currentPlayer === "Player1" ? "Player2" : "Player1");
  };

  return (
    <div className="game">
      <Board
        currentPlayer={currentPlayer}
        togglePlayer={togglePlayer}
        setIsGameOver={setIsGameOver}
        isGameOver={isGameOver}
      />
      <GameMenu
        currentPlayer={currentPlayer}
        togglePlayer={togglePlayer}
        setIsGameOver={setIsGameOver}
        isGameOver={isGameOver}
      />
    </div>
  );
};

export default LocalGame;
