import React, { useEffect, useState } from "react";
import "./GameMenu.css";
import { useGameContext } from "../../utils/GameProvider";

const GameMenu = () => {
    const {currentPlayer} = useGameContext();
    const [timeLeft, setTimeLeft] = useState(30);

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
    }, [timeLeft]);

    useEffect(() => {
        // Reset timer on new turn
        setTimeLeft(30);
    }, [currentPlayer])

    return (
        <div className="game-menu">
            <button className="game-menu-button" aria-label="Forfeit Game">Forfeit</button>
            <label>0:{(timeLeft < 10 ? '0' : '') + timeLeft.toString()}</label>
        </div>
    );
}

export default GameMenu;
