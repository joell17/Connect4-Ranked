import React from "react";
import "./OnlineColumn.css";
import OnlineGamePiece from "./OnlineGamePiece";

const OnlineColumn = ({
    columnIndex,
    boardData,
    isActivePlayer,
    placePiece,
    playerSkins
}) => {
    const rows = 6;
    const columnPieces = boardData.grid[columnIndex] || [];

    // Handle column click
    const handleClick = () => {
        if (isActivePlayer) {
            placePiece(columnIndex);
        }
    };

    return (
        <div className="column-toplevel">
            <button onClick={handleClick} className="column-button">
                {Array.from({ length: rows }, (_, i) => {
                    const piece = columnPieces[i];
                    return (
                        <div key={`slot-${i}`} className="slot">
                            {piece ? (
                                <OnlineGamePiece player={piece} isGhost={false} playerSkins={playerSkins}/>
                            ) : null}
                        </div>
                    );
                })}
            </button>
        </div>
    );
};

export default OnlineColumn;
