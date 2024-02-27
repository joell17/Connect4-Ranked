import React, { createContext, useContext, useState } from 'react';

// Create a context for the game state
const GameContext = createContext();

// Custom hook to use the game context
export const useGameContext = () => useContext(GameContext);

// Context provider component
export const GameProvider = ({ children }) => {
  const [currentPlayer, setCurrentPlayer] = useState('Player1');

  const togglePlayer = () => {
    setCurrentPlayer(currentPlayer === 'Player1' ? 'Player2' : 'Player1');
  };

  // The value that will be supplied to any descendants of this provider
  const contextValue = {
    currentPlayer,
    togglePlayer,
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};