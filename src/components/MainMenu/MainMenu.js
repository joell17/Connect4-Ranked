import { useState } from "react";
import React from "react";
import "./MainMenu.css";
import { useNavigate } from "react-router-dom";

const MainMenu = () => {
  const navigate = useNavigate();
  const [activeMenuItem, setActiveMenuItem] = useState(null);
  const [selectedSkinButton, setSelectedSkinButton] = useState('primary');

  return (
    <div className={`main-menu-top-level ${activeMenuItem ? "active" : ""}`}>
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
        <button
          onClick={() => setActiveMenuItem(null)}
          className="close-button"
        >
          Close
        </button>

        {activeMenuItem === "skins" && (
          <div className="skins-menu">
            <div className="selector-buttons">
              {/* Two circle buttons for changing primary and secondary skins, active/selected one has highlighted border*/}
              <button
                onClick={() => setSelectedSkinButton("primary")}
                className={`skin-button ${
                  selectedSkinButton === "primary" ? "selected" : ""
                }`}
              ></button>
              <button
                onClick={() => setSelectedSkinButton("secondary")}
                className={`skin-button ${
                  selectedSkinButton === "secondary" ? "selected" : ""
                }`}
              ></button>
            </div>
            <div className="skin-selection">
              {/* A menu of square selectable buttons, navigable with arrows */}
            </div>
          </div>
        )}
      </div>

      <div className="title-section">
        <h1>Align Four</h1>
      </div>
    </div>
  );
};

export default MainMenu;
