import React from "react";
import "./MainMenu.css";
import { useNavigate } from 'react-router-dom';

const MainMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="main-menu">
      <div className="side-menu">
        {/* Buttons for the side menu */}
        <button onClick={() => navigate('/game')} className="clear-button">Local PvP</button>
        <button className="clear-button">Online Casual</button>
        <button className="clear-button">Online Ranked</button>
        <button className="clear-button">Skins</button>
      </div>
      <div className="title-section">
        {/* Title of the game */}
        <h1>Align Four</h1>
      </div>
    </div>
  );
};

export default MainMenu;
