import React, { createContext, useContext, useState } from 'react';

// Create a context for the game state
const GameContext = createContext();

// Custom hook to use the game context
export const useGameContext = () => useContext(GameContext);

// Context provider component
export const GameProvider = ({ children }) => {
  const [primarySkin, setPrimarySkin] = useState('/images/red.png');
  const [secondarySkin, setSecondarySkin] = useState('/images/yellow.png');

  const changePrimarySkin = (imageName) => {
    // imageName should be just the image file, not path
    setPrimarySkin('/images/' + imageName);
  }

  const changeSecondarySkin = (imageName) => {
    // imageName should be just the image file, not path
    setSecondarySkin('/images/' + imageName);
  }

  // The value that will be supplied to any descendants of this provider
  const contextValue = {
    primarySkin, 
    changePrimarySkin,
    secondarySkin, 
    changeSecondarySkin
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};