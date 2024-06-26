import React, { useEffect, useState } from "react";
import "../Board/Board.css";
import OnlineColumn from "./OnlineColumn";

const OnlineBoard = ({
    isActivePlayer,
    togglePlayer,
    isGameOver,
    ws,
    sendMessage,
    playerSkins,
    boardData,
    setBoardData
}) => {
    const [resetCount, setResetCount] = useState(0);
    const columns = 7;


    useEffect(() => {
        if (!isGameOver) {
            console.log("The game has been started.");
            boardData.reset();
            setBoardData(boardData);
            setResetCount((prevCount) => prevCount + 1);
        }
    }, [isGameOver]);

    useEffect(() => {
        if (!ws) return;

        const handleMessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === "moveMade") {
                // Update the board state based on the message
                if (boardData.placePiece(message.column)) {
                    console.log('Received a move that was made and placed in board');
                }
                setBoardData(boardData);
                togglePlayer();
            }
        };

        ws.addEventListener("message", handleMessage);
        return () => {
            ws.removeEventListener("message", handleMessage);
        };
    }, [ws, boardData]);

    const columnHook = (columnIndex) => {
        if (isActivePlayer) {
            console.log('Move was attempted by me');
            return sendMessage("attemptMove", { column: columnIndex });
        }
        return false;
    };

    const boardColumns = Array.from({ length: columns }, (_, col) => (
        <OnlineColumn
            key={`column-${col}-${resetCount}`}
            columnIndex={col}
            boardData={boardData}
            isActivePlayer={isActivePlayer}
            placePiece={columnHook}
            playerSkins={playerSkins}
        />
    ));

    return (
        <div className="board">
            <div className="row">{boardColumns}</div>
        </div>
    );
};

export default OnlineBoard;
