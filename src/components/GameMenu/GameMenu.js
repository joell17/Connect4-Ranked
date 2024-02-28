import React from "react";
import "./GameMenu.css"; // Assuming you will create a CSS file for styling

const GameMenu = () => {
    // Use hooks for the timer object

    return (
        <div className="game-menu">
            <button className="game-menu-button" aria-label="Forfeit Game">Forfeit</button>
            <label>0:30</label>
        </div>
    );
}

export default GameMenu;
