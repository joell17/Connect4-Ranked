import React, { useEffect, useState } from "react";
import "./OnlineGame.css";
import OnlineBoard from "./OnlineBoard";
import OnlineGameMenu from "./OnlineGameMenu";
import { useNavigate } from "react-router-dom";

const OnlineGame = ({ ws, gameSession, user_data, isRanked }) => {
    const [isActivePlayer, setIsActivePlayer] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [winner, setWinner] = useState("Joe");
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [player1Elo, setPlayer1Elo] = useState(gameSession ? gameSession.player1_elo : 0);
    const [player2Elo, setPlayer2Elo] = useState(gameSession ? gameSession.player2_elo : 0);
    const navigate = useNavigate();

    useEffect(() => {
        if (!gameSession) {
            navigate("/");
        } else {
            setIsActivePlayer(gameSession.isPlayer1);
        }
    }, [gameSession, navigate]);

    const sendMessage = (type, message) => {
        if (ws.readyState === WebSocket.OPEN) {
            try {
                const jason = {
                    ...message,
                    type: type,
                    player_id: user_data.google_id,
                    game_session_id: gameSession.id,
                };
                ws.send(JSON.stringify(jason));
                return true;
            } catch (error) {
                console.error("Failed to send message:", error);
                return false;
            }
        }
        return false;
    };

    const togglePlayer = () => {
        console.log("Player Being Toggled");
        console.log("Prior IsPlayerActive: " + isActivePlayer);
        setIsActivePlayer((prevState) => {
            const newState = !prevState;
            console.log("After IsPlayerActive: " + newState);
            return newState;
        });
    };

    // Detect messages from backend
    useEffect(() => {
        if (!ws) return;

        const handleMessage = (event) => {
            const message = JSON.parse(event.data);
            switch (message.type) {
                case "gameOver":
                    setWinner(message.winner_username); // Use this to show winner in GameMenu, should be the username
                    setIsGameOver(true);
                    setPlayer1Elo(message.player1_elo);
                    setPlayer2Elo(message.player2_elo);
                    break;
                case "rematchAccepted":
                    // TODO: Going to have to make sure the loser goes first upon rematch
                    setIsGameOver(false);
                    break;
                case "rematchDenied":
                    setOverlayVisible(true);
                    break;
                default:
                    break;
            }
        };

        ws.addEventListener("message", handleMessage);

        return () => {
            ws.removeEventListener("message", handleMessage);
        };
    }, [ws, togglePlayer]);

    window.addEventListener("beforeunload", () => {
        sendMessage("forfeitGame", {});
        sendMessage("rematchRequest", { requested: false });
    });

    return (
        <div className="game">
            {!overlayVisible ? (
                <>
                    <div className="user-stats">
                        <p>Player 1:</p>
                        <p>{gameSession ? gameSession.player1_username : ""}</p>
                        <p>ELO: {player1Elo}</p>
                    </div>
                    <div>
                        <OnlineBoard
                            isActivePlayer={isActivePlayer}
                            togglePlayer={togglePlayer}
                            isGameOver={isGameOver}
                            ws={ws}
                            sendMessage={sendMessage}
                            playerSkins={
                                gameSession
                                    ? [
                                          gameSession.player1_skin,
                                          gameSession.player2_skin,
                                      ]
                                    : []
                            }
                        />
                        <OnlineGameMenu
                            isActivePlayer={isActivePlayer}
                            isGameOver={isGameOver}
                            sendMessage={sendMessage}
                            winner={winner}
                            ws={ws}
                        />
                    </div>
                    <div className="user-stats">
                        <p>Player 2:</p>
                        <p>{gameSession ? gameSession.player2_username : ""}</p>
                        <p>ELO: {player2Elo}</p>
                    </div>
                </>
            ) : (
                <div className="overlay">
                    <div className="overlay-content">
                        <p>Other Player Disconnected</p>
                        <button onClick={() => navigate("/")}>
                            Go to Main Menu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OnlineGame;
