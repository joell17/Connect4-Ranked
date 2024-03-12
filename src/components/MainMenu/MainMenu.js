// MainMenu.js
import { useState } from "react";
import React from "react";
import "./MainMenu.css";
import { useNavigate } from "react-router-dom";
import MenuButton from "./MenuButton";
import SkinMenuContent from "./SkinMenuContent"; // Import your SkinMenuContent component

const MainMenu = () => {
  const navigate = useNavigate();
  const [activeMenuItemContent, setActiveMenuItemContent] = useState(null);

  return (
    <div
      className={`main-menu-top-level ${activeMenuItemContent ? "active" : ""}`}
    >
      <div className="main-menu">
        <MenuButton
          label="Local PvP"
          setActiveMenuItems={() => navigate("/game")}
        />
        <MenuButton
          label="Online Casual"
          setActiveMenuItems={setActiveMenuItemContent}
        >
          {/* Content for Online Casual */}
        </MenuButton>
        <MenuButton
          label="Online Ranked"
          setActiveMenuItems={setActiveMenuItemContent}
        >
          {/* Content for Online Ranked */}
        </MenuButton>
        <MenuButton label="Skins" setActiveMenuItems={setActiveMenuItemContent}>
          <SkinMenuContent />
        </MenuButton>
      </div>

      <div className="side-menu">
        <button
          onClick={() => setActiveMenuItemContent(null)}
          className="close-button"
        >
          Close
        </button>
        {activeMenuItemContent}
      </div>

      <div className="title-section">
        <h1>Align Four</h1>
      </div>
    </div>
  );
};

export default MainMenu;
