import React, { useEffect, useState } from 'react';
import './GamePiece.css';
import { useGameContext } from './GameProvider';

const GamePiece = ({isGhost, stopPosition }) => {
  // You don't need `isFalling` prop as you can derive it from `stopPosition`
  const [falling, setFalling] = useState(false);
  const {currentPlayer} = useGameContext();

  useEffect(() => {
    if (stopPosition !== null) {
      setFalling(true); // Trigger the falling animation
    }
  }, [stopPosition]);

  const className = `game-piece ${currentPlayer} ${isGhost ? 'ghost' : ''} ${falling ? 'falling' : ''}`;
  
  // Use inline style to dynamically set the `--stopPosition` CSS variable
  const style = {
    '--stopPosition': `${stopPosition}%` // Assuming stopPosition is in percentage
  };

  return <div className={className} style={style}></div>;
};

export default GamePiece;
