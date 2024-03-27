import { React, useState } from "react";
import "./SkinMenuContent.css";

const SkinMenuContent = () => {
  const [selectedSkinButton, setSelectedSkinButton] = useState("primary");

  return (
    <div className="skins-menu">
      <div className="selector-buttons">
        {/* Two circle buttons for changing primary and secondary skins, active/selected one has highlighted border*/}
        <button
          onClick={() => setSelectedSkinButton("primary")}
          className={`skin-button ${
            selectedSkinButton === "primary" ? "selected" : ""
          }`}
          aria-label="Select Primary Skin"
          style={{ backgroundImage: `url(${undefined})` }}
        ></button>
        <button
          onClick={() => setSelectedSkinButton("secondary")}
          className={`skin-button ${
            selectedSkinButton === "secondary" ? "selected" : ""
          }`}
          aria-label="Select Secondary Skin"
          style={{ backgroundImage: `url(${undefined})` }}
        ></button>
      </div>
      <div className="skin-selection">
        {/* A menu of square selectable buttons, navigable with arrows */}
      </div>
    </div>
  );
};

export default SkinMenuContent;
