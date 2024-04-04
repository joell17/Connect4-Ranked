const BoardData = require("./BoardData");
const WebSocket = require("ws");

class GameSession {
    constructor(player1, player2) {
        this.id = this.generateUniqueId();
        this.players = [
            {
                id: player1.id,
                username: player1.username,
                skin: player1.primary_skin,
                client: null,
                rematchRequested: false
            },
            {
                id: player2.id,
                username: player2.username,
                skin:
                    player1.primary_skin === player2.primary_skin
                        ? player2.secondary_skin
                        : player2.primary_skin,
                client: null,
                rematchRequested: false
            },
        ];
        this.boardData = new BoardData(this.winHook.bind(this));
        this.currentPlayerIndex = 0; // Index of the current player in the players array
        this.timer = 15; // 15 seconds for each turn
        this.status = "ongoing";
        this.winner = null;
    }

    sendPlayersMessage(type, message) {
        // Get clients from players
        const player1Client = this.players[0].client;
        const player2Client = this.players[1].client;

        // Make sure both clients exist
        if (!(player1Client && player2Client)) return false;

        // Form the message
        const jason = {
            type : type,
            ...message
        }

        // Send the message
        if (player1Client.readyState === WebSocket.OPEN && player2Client.readyState === WebSocket.OPEN) {
            // Only send both or send none
            player1Client.send(JSON.stringify(jason));
            player2Client.send(JSON.stringify(jason));
            return true;
        }

        return false;
    }

    generateUniqueId() {
        // Generate a unique ID for the game session
        return (
            Date.now().toString(36) + Math.random().toString(36).substring(2)
        );
    }

    rematch() {
        this.switchPlayer()
        this.boardData.reset();
        this.winner = null;
        this.status = 'ongoing'
        this.players[0].rematchRequested = false;
        this.players[1].rematchRequested = false;
    }

    winHook() {
        this.status = "completed";
        this.winner = this.players[this.currentPlayerIndex].username;

        // Update database stats

        this.sendPlayersMessage('gameOver', {winner_username: this.winner});        
    }

    switchPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 2;
        this.resetTimer();
    }

    resetTimer() {
        this.timer = 15;
    }

    placePiece(column) {
        if (this.boardData.placePiece(column)) {
            if (!this.boardData.hasWon) {
                this.switchPlayer();
            }
            return true;
        }
        return false;
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }
}

module.exports = GameSession;
