import { useState } from "react";
import React from "react";
import "./MainMenu.css";
import { useNavigate } from "react-router-dom";

const MainMenu = () => {
  const navigate = useNavigate();
  const [activeMenuItem, setActiveMenuItem] = useState(null);

  return (
    <div className={`main-menu-top-level ${activeMenuItem ? 'active' : ''}`}>
      <div className="main-menu">
        {/* Buttons for the side menu */}
        <button onClick={() => navigate("/game")} className="clear-button">
          Local PvP
        </button>
        <button className="clear-button">Online Casual</button>
        <button className="clear-button">Online Ranked</button>
        <button
          onClick={() => setActiveMenuItem("skins")}
          className="clear-button"
        >
          Skins
        </button>
      </div>

    
      <div className="side-menu">
        <button onClick={() => setActiveMenuItem(null)} className="close-button">Close</button>

        {activeMenuItem === 'skins' && <div>Skins Content</div>}
      </div>

      <div className="title-section">
        <h1>Align Four</h1>
      </div>
    </div>
  );
};

export default MainMenu;
