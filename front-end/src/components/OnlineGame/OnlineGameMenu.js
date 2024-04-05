import React, { useEffect, useState } from "react";
import "./OnlineGameMenu.css";
import { useNavigate } from "react-router-dom";

const OnlineGameMenu = ({
    isActivePlayer,
    isGameOver,
    sendMessage,
    winner,
    ws
}) => {
    const [rematchRequested, setRematchRequested] = useState(false);
    const [timer, setTimer] = useState(30);
    const navigate = useNavigate();

    const handleRematch = () => {
        sendMessage("rematchRequest", { requested: true });
        setRematchRequested(true);
    };

    useEffect(() => {
        if (!isGameOver) {
            setRematchRequested(false);
        }
    }, [isGameOver])

    useEffect(() => {
        if (!ws) return;

        const handleMessage = (event) => {
            const message = JSON.parse(event.data);
            switch (message.type) {
                case "updateTimer":
                    setTimer(message.timer);
                    break;
                default:
                    break;
            }
        };

        ws.addEventListener("message", handleMessage);

        return () => {
            ws.removeEventListener("message", handleMessage);
        };
    }, [ws, setTimer]);

    return (
        <div className="game-menu">
            {isGameOver ? (
                <>
                    <button
                        onClick={handleRematch}
                        className="game-menu-button"
                        aria-label="Request Rematch"
                    >
                        {rematchRequested ? "Waiting..." : "Rematch"}
                    </button>
                    <button
                        onClick={() => {
                            sendMessage("rematchRequest", { requested: false });
                            navigate("/");
                        }}
                        className="game-menu-button"
                        aria-label="Return to Main Menu"
                    >
                        Menu
                    </button>
                    <label>
                        {winner + " Wins!!!"}
                    </label>
                </>
            ) : (
                <>
                    <button
                        onClick={() => sendMessage("forfeitGame", {})}
                        className="game-menu-button"
                        aria-label="Forfeit Game"
                    >
                        Forfeit
                    </button>
                    <label>{"Time Left: " + timer}</label>
                    <label>
                        {isActivePlayer ? "Your Turn" : "Opponent's Turn"}
                    </label>
                </>
            )}
        </div>
    );
};

export default OnlineGameMenu;
