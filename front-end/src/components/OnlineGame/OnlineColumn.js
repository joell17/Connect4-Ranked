import React, { useEffect, useState } from "react";
import "./OnlineColumn.css";
import OnlineGamePiece from "./OnlineGamePiece";

const OnlineColumn = ({
    columnIndex,
    boardData,
    isActivePlayer,
    placePiece,
    playerSkins,
}) => {
    const rows = 6;
    const columnPieces = boardData.grid[columnIndex] || [];
    const [hovered, setHovered] = useState(false);
    const [hoverIndex, setHoverIndex] = useState(null);

    useEffect(() => {
        if (!isActivePlayer) {
            setHovered(false);
            setHoverIndex(null);
        }
    }, [isActivePlayer]);

    // Handle column click
    const handleClick = () => {
        if (isActivePlayer) {
            placePiece(columnIndex);
        }
    };

    // Find the next available slot in the column
    const getNextAvailableSlot = () => {
        return columnPieces.length < rows ? columnPieces.length : null;
    };

    return (
        <div className="column-toplevel">
            <button
                onClick={handleClick}
                onMouseEnter={() => {
                    if (isActivePlayer) {
                        setHovered(true);
                        setHoverIndex(getNextAvailableSlot());
                    }
                }}
                onMouseLeave={() => {
                    setHovered(false);
                    setHoverIndex(null);
                }}
                className="column-button"
            >
                {Array.from({ length: rows }, (_, i) => {
                    const piece = columnPieces[i];
                    const isGhost = hovered && i === hoverIndex;
                    return (
                        <div key={`slot-${i}`} className="slot">
                            {piece ? (
                                <OnlineGamePiece
                                    player={piece}
                                    isGhost={false}
                                    playerSkins={playerSkins}
                                />
                            ) : isGhost ? (
                                <OnlineGamePiece
                                    player={boardData.currentPlayer}
                                    isGhost={true}
                                    playerSkins={playerSkins}
                                />
                            ) : null}
                        </div>
                    );
                })}
            </button>
        </div>
    );
};

export default OnlineColumn;
