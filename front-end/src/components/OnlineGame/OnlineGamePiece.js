import React from 'react';
import './OnlineGamePiece.css';

const OnlineGamePiece = ({ player, isGhost, playerSkins }) => {
  const skin = playerSkins[player === 'r' ? 0 : 1];
  const skinPath = require(`../../images/${skin}.png`);

  const style = {
    backgroundImage: `url(${skinPath})`
  }

  const className = 'game-piece';

  return <div className={className} style={style}></div>;
};

export default OnlineGamePiece;
