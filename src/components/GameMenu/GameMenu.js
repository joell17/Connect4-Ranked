import React, { useEffect, useState } from "react";
import "./GameMenu.css";

const GameMenu = () => {
    const [timeLeft, setTimeLeft] = useState(15);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        if (timeLeft === 0) {
            clearInterval(timer);
            console.log("Time's up");
        }

        // Clears interval on dismount
        return () => {
            clearInterval(timer);
        }
    }, [timeLeft])

    return (
        <div className="game-menu">
            <button className="game-menu-button" aria-label="Forfeit Game">Forfeit</button>
            <label>0:{(timeLeft < 10 ? '0' : '') + timeLeft.toString()}</label>
        </div>
    );
}

export default GameMenu;
