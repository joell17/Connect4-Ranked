import React, { useEffect, useState } from 'react';
import './GamePiece.css';

const GamePiece = ({player, isGhost, stopPosition }) => {
  // You don't need `isFalling` prop as you can derive it from `stopPosition`
  const [falling, setFalling] = useState(false);

  useEffect(() => {
    if (stopPosition !== null) {
      setFalling(true); // Trigger the falling animation
    }
  }, [stopPosition]);

  const className = `game-piece ${player} ${isGhost ? 'ghost' : ''} ${falling && !isGhost? 'falling' : ''}`;
  
  // Use inline style to dynamically set the `--stopPosition` CSS variable
  const style = {
    '--stopPosition': `${stopPosition}%` // Assuming stopPosition is in percentage
  };

  return <div className={className} style={style}></div>;
};

export default GamePiece;
