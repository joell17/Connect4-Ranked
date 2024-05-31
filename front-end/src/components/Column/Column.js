import React, { useState } from "react";
import "./Column.css";
import GamePiece from "../GamePiece/GamePiece";
import Slot from "../Slot/Slot";

const Column = ({ currentPlayer, columnIndex, columnHook, isGameOver }) => {
    const [gamePieces, setGamePieces] = useState([]);
    const [ghostPiece, setGhostPiece] = useState(null);

    const rows = 6; // Number of rows in the column
    const pieceHeightPercentage = (100 / rows).toFixed(2); // Calculate the height of each game piece as a percentage of the column height

    const calculateStopPosition = () => {
        // Calculate the stop position based on the number of pieces in the column
        // The position is calculated from the bottom of the column, so we subtract the number of pieces from the total number of rows
        const stopPosition = gamePieces.length * pieceHeightPercentage;

        return stopPosition;
    };

    const onClick = () => {
        if (!isGameOver && columnHook(columnIndex)) {
            const newGamePiece = (
                <GamePiece
                    key={gamePieces.length}
                    player={currentPlayer}
                    isGhost={false}
                    stopPosition={calculateStopPosition()}
                />
            );
            setGamePieces([...gamePieces, newGamePiece]);
        }
    };

    const onHover = () => {
        if (isGameOver) {
            setGhostPiece(null);
            return;
        }

        setGhostPiece(
            <GamePiece
                key="ghost"
                player={currentPlayer}
                isGhost={true}
                stopPosition={calculateStopPosition()}
            />
        );
    };

    const onHoverExit = () => {
        setGhostPiece(null);
    };

    // Create an array of Slot components to represent the empty slots
    // TODO: Figure out a way to delete these later
    const emptySlots = [];
    for (let i = 0; i < rows; i++) {
        emptySlots.push(<Slot key={`slot-${i}`} />);
    }

    return (
        <div
            className="column-toplevel"
            onMouseEnter={onHover}
            onMouseLeave={onHoverExit}
        >
            <button onClick={onClick}>
                {emptySlots}
                {ghostPiece}
                {gamePieces}
            </button>
        </div>
    );
};

export default Column;
