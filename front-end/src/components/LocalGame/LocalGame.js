import React, { useState } from "react";
import "./LocalGame.css";
import Board from "../Board/Board";
import GameMenu from "../GameMenu/GameMenu";

const LocalGame = () => {
    const [currentPlayer, setCurrentPlayer] = useState("Player2");
    const [isGameOver, setIsGameOver] = useState(false);

    const togglePlayer = () => {
        setCurrentPlayer(currentPlayer === "Player1" ? "Player2" : "Player1");
    };

    return (
        <div className="local-game">
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
