import React, { useEffect, useState } from "react";
import "./GameMenu.css";
import { useNavigate } from "react-router-dom";

const GameMenu = ({
  currentPlayer,
  togglePlayer,
  setIsGameOver,
  isGameOver,
}) => {
  const timerMax = 15;
  const [timeLeft, setTimeLeft] = useState(timerMax);
  const navigate = useNavigate();

  const makeCurrentPlayerLose = () => {
    togglePlayer();
    setIsGameOver(true);
  };

  // Handle countdown
  useEffect(() => {
    if (isGameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft === 1) {
          // Check if timeLeft is about to reach 0
          makeCurrentPlayerLose();
          clearInterval(timer);
          return 0; // Set timeLeft to 0
        }
        return prevTimeLeft - 1;
      });
    }, 1000);

    // Clears interval on dismount
    return () => {
      clearInterval(timer);
    };
  }, [timeLeft, isGameOver]);

  // Handle reset countdown
  useEffect(() => {
    // Reset timer on new turn
    setTimeLeft(timerMax);
  }, [currentPlayer]);

  return (
    <div className="local-game-menu">
      {isGameOver ? (
        <>
          <button
            onClick={() => {setIsGameOver(false);}}
            className="game-menu-button"
            aria-label="Rematch Game"
          >
            Rematch
          </button>
          <button
            onClick={() => navigate('/')}
            className="game-menu-button"
            aria-label="Main Menu"
          >
            Menu
          </button>
          <label>{currentPlayer + " Wins!!!"}</label>
        </>
      ) : (
        <>
          <button
            onClick={() => makeCurrentPlayerLose()}
            className="game-menu-button"
            aria-label="Forfeit Game"
          >
            Forfeit
          </button>
          <label>0:{(timeLeft < 10 ? "0" : "") + timeLeft.toString()}</label>
        </>
      )}
    </div>
  );
};

export default GameMenu;
