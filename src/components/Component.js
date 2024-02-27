import React, { useState } from "react";
import './Component.css';
import GamePiece from './GamePiece';

const Column = ({ columnIndex, columnHook }) => {
    const [gamePieces, setGamePieces] = useState([]);
    const [ghostPiece, setGhostPiece] = useState(null);  // The GHOST PIECE, THE GHOST PIECE IS REEAAALL

    const calculateStopPosition = () => {
        // Calculate the stop position based on the number of pieces in the column
        return gamePieces.length;
    };

    // Later these functions should detect whether the currentPlayer is on this computer
    // If not, then don't detect clicks or hovers
    const onClick = () => {
        if (columnHook(columnIndex)) {
            const newGamePiece = (
                <GamePiece key={gamePieces.length} isGhost={false} stopPosition={calculateStopPosition()} />
            );
            setGamePieces([...gamePieces, newGamePiece]);
        }
    };

    const onHover = () => {
        setGhostPiece(<GamePiece key="ghost" isGhost={true} stopPosition={calculateStopPosition()} />);
    };

    const onHoverExit = () => {
        setGhostPiece(null);
    };

    return (
        <div className="column-toplevel" onMouseEnter={onHover} onMouseLeave={onHoverExit}>
            <button onClick={onClick}>
                {ghostPiece}
                {gamePieces}
            </button>
        </div>
    );
};

export default Column;
