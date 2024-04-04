import React from 'react';
import './OnlineGamePiece.css';

const OnlineGamePiece = ({ player, isGhost }) => {
  const className = `game-piece ${player} ${isGhost ? 'ghost' : ''}`;

  return <div className={className}></div>;
};

export default OnlineGamePiece;
