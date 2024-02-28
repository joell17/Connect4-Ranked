import React from "react";
import "./LocalGame.css";
import Board from '../Board/Board'
import GameMenu from '../GameMenu/GameMenu'
import { GameProvider } from "../../utils/GameProvider";

const LocalGame = () => {
    // I want this component to keep track of whose turn it is
    // It should tell Board whether or not a click on this computer
    // should be used for the current turn
    // This is to make it so that the Board component can be used
    // for every game mode (local pvp, local AI, online casual, online ranked)

    return (
        <div className="game">
            <GameProvider>
                <Board />
                <GameMenu />
            </GameProvider>
        </div>
    )
}

export default LocalGame;