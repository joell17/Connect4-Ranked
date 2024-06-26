const GameSession = require("../models/GameSession");
const RankedMatchQueue = require("../models/RankedMatchQueue");
const WebSocket = require("ws");

class MatchmakingService {
    constructor(wss) {
        this.nonActiveForfeit = false;
        this.queue = [];
        this.gameSessions = {}; // Store active game sessions
        this.wss = wss;
        this.rankedMatchQueue = new RankedMatchQueue(this.gameSessions, wss);

        this.wss.on("connection", (ws) => {
            ws.on("message", (message) => {
                this.handleMessage(message);
            });
        });
    }

    handleMessage(message) {
        const data = JSON.parse(message);

        switch (data.type) {
            case "attemptMove":
                console.log("Move Attempt Received");
                this.handleMoveAttempt(data);
                break;
            case "rematchRequest":
                this.handleRematchRequest(data);
                break;
            case "forfeitGame":
                this.handleForfeitGame(data);
                break;
            default:
                console.error("Unknown message type:", data.type);
        }
    }

    handleForfeitGame(data) {
        // Find the game session
        const game_session_id = data.game_session_id;
        const player_id = data.player_id;
        const gameSession = this.gameSessions[game_session_id];

        if (!gameSession) {
            // Maybe add connection lost functionality later
            console.log("Invalid Game Session: " + game_session_id);
            return;
        }

        if (gameSession.getCurrentPlayer().id !== player_id) {
            // Not the active player
            gameSession.winHook();
            this.nonActiveForfeit = true;
        } else {
            gameSession.switchPlayer();
            gameSession.winHook();
        }
    }

    handleMoveAttempt(data) {
        // Find the game session
        const game_session_id = data.game_session_id;
        const player_id = data.player_id;
        const gameSession = this.gameSessions[game_session_id];

        if (!gameSession) {
            // Maybe add connection lost functionality later
            console.log("Invalid Game Session: " + game_session_id);
            return;
        }

        // Verify game is ongoing
        if (gameSession.status !== "ongoing") return;

        // Verify that this is the correct player
        if (gameSession.getCurrentPlayer().id !== player_id) return;

        // Try to place piece
        const column = data.column;
        const success = gameSession.placePiece(column);

        if (success) {
            // Send message to both players
            if (
                !gameSession.sendPlayersMessage("moveMade", { column: column })
            ) {
                console.error("Failed to send moveMade message");
            } else {
                console.log("Piece placed successfully");
            }
        } else {
            console.log("Invalid move was attempted. Column: " + column);
        }
    }

    handleRematchRequest(data) {
        // Find the game session
        const game_session_id = data.game_session_id;
        const player_id = data.player_id;
        const gameSession = this.gameSessions[game_session_id];

        if (!gameSession) {
            // Maybe add connection lost functionality later
            console.log("Invalid Game Session: " + game_session_id);
            return;
        }

        // Check if game is actually over
        if (gameSession.status !== "completed") {
            console.log("Game is not over. Rematch request denied.");
            return;
        }

        // Check if rematch denied by player
        if (data.requested === false) {
            console.log("Player denied rematch.");
            // Notify other player
            if (!gameSession.sendPlayersMessage("rematchDenied", {})) {
                console.error("Failed to notify players of rematch");
            }
            gameSession.endSession(); // Clears the timer interval and sets to null
            delete this.gameSessions[game_session_id];
            console.log(
                "Game session " + game_session_id + " ended and removed."
            );
            return;
        }

        // Check which player and update status
        if (gameSession.players[0].id === player_id)
            gameSession.players[0].rematchRequested = true;
        if (gameSession.players[1].id === player_id)
            gameSession.players[1].rematchRequested = true;

        // Check if both players accepted
        if (
            gameSession.players[1].rematchRequested &&
            gameSession.players[0].rematchRequested
        ) {
            console.log("Players accepted rematch.");
            // Reset the game in game session
            gameSession.rematch();
            const obj = {
                nonActiveForfeit: this.nonActiveForfeit
            };

            // Notify players
            if (!gameSession.sendPlayersMessage("rematchAccepted", obj)) {
                console.error("Failed to notify players of rematch");
            }

            this.nonActiveForfeit = false;
        }
    }

    addToQueue(user) {
        this.queue.push(user); // Enqueue the entire user_data object
        this.tryMatchmaking();
    }

    removeFromQueue(user) {
        // Find the index of the user in the queue
        const index = this.queue.findIndex(
            (queueUser) => queueUser.id === user.id
        );

        // If the user is found, remove them from the queue
        if (index !== -1) {
            this.queue.splice(index, 1);
        }
    }

    tryMatchmaking() {
        while (this.queue.length >= 2) {
            const player1 = this.queue.shift();
            const player2 = this.queue.shift();
            const gameSession = new GameSession(player1, player2);
            this.gameSessions[gameSession.id] = gameSession;
            this.notifyPlayers(player1, player2, gameSession);
        }
    }

    notifyPlayers(player1, player2, gameSession) {
        console.log("Trying to notify players");

        this.wss.clients.forEach(function each(client) {
            if (
                client.readyState === WebSocket.OPEN &&
                (client.user.google_id === player1.google_id ||
                    client.user.google_id === player2.google_id)
            ) {
                console.log("Found a player: " + client.user.google_id);
                let isPlayer1 = client.user.google_id === player1.google_id;

                // Save clients in game session
                gameSession.players[isPlayer1 ? 0 : 1].client = client;

                client.send(
                    JSON.stringify({
                        type: "gameSessionCreated",
                        gameSession: {
                            id: gameSession.id,
                            player1_skin: gameSession.players[0].skin,
                            player2_skin: gameSession.players[1].skin,
                            player1_username: gameSession.players[0].username,
                            player2_username: gameSession.players[1].username,
                            player1_elo: gameSession.players[0].elo,
                            player2_elo: gameSession.players[1].elo,
                            isPlayer1: isPlayer1,
                        },
                    })
                );
            }
        });
    }
}

module.exports = MatchmakingService;
