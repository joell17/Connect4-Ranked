const BoardData = require("./BoardData");
const WebSocket = require("ws");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class GameSession {
    constructor(player1, player2) {
        this.id = this.generateUniqueId();
        this.players = [
            {
                id: player1.id,
                username: player1.username,
                skin: player1.primary_skin,
                client: null,
                rematchRequested: false,
            },
            {
                id: player2.id,
                username: player2.username,
                skin:
                    player1.primary_skin === player2.primary_skin
                        ? player2.secondary_skin
                        : player2.primary_skin,
                client: null,
                rematchRequested: false,
            },
        ];
        this.boardData = new BoardData(this.winHook.bind(this));
        this.currentPlayerIndex = 0; // Index of the current player in the players array
        this.status = "ongoing";
        this.winner = null;

        this.timer = 30; // 30 seconds for each turn
        this.timerInterval = null;
        this.startTimer();
    }

    endSession() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer--;

            if (this.timer <= 0) {
                // Make the current player lose
                this.timeUp();
            }

            // Notify players to update timer
            if (this.status === "ongoing")
                this.sendPlayersMessage("updateTimer", { timer: this.timer });
        }, 1000);
    }

    timeUp() {
        clearInterval(this.timerInterval);
        this.timerInterval = null;

        // Consider it a forfeit when the timer runs out
        this.switchPlayer();
        this.winHook();
    }

    resetTimer() {
        this.timer = 30;

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        // Notify players to update timer
        this.sendPlayersMessage("updateTimer", { timer: this.timer });
        this.startTimer();
    }

    sendPlayersMessage(type, message) {
        // Get clients from players
        const player1Client = this.players[0].client;
        const player2Client = this.players[1].client;

        // Make sure both clients exist
        if (!(player1Client && player2Client)) return false;

        // Form the message
        const jason = {
            type: type,
            ...message,
        };

        // Send the message
        if (player1Client.readyState === WebSocket.OPEN)
            player1Client.send(JSON.stringify(jason));
        if (player2Client.readyState === WebSocket.OPEN)
            player2Client.send(JSON.stringify(jason));

        return true;
    }

    generateUniqueId() {
        // Generate a unique ID for the game session
        return (
            Date.now().toString(36) + Math.random().toString(36).substring(2)
        );
    }

    rematch() {
        this.switchPlayer();
        this.boardData.reset();
        this.winner = null;
        this.status = "ongoing";
        this.players[0].rematchRequested = false;
        this.players[1].rematchRequested = false;
    }

    winHook() {
        this.status = "completed";
        this.winner = this.players[this.currentPlayerIndex].username;

        // Update database stats
        const winner_id = this.players[this.currentPlayerIndex].id;
        const loser_id = this.players[this.currentPlayerIndex === 0 ? 1 : 0].id;

        this.updatePlayerRecords(winner_id, loser_id);

        this.sendPlayersMessage("gameOver", { winner_username: this.winner });
    }

    async updatePlayerRecords(winner_id, loser_id) {
        try {
            // Update the winner's record
            await prisma.user_data.update({
                where: {
                    id: winner_id,
                },
                data: {
                    wins: {
                        increment: 1, // Increment the wins by 1
                    },
                },
            });

            // Update the loser's record
            await prisma.user_data.update({
                where: {
                    id: loser_id,
                },
                data: {
                    losses: {
                        increment: 1, // Increment the losses by 1
                    },
                },
            });
        } catch (error) {
            console.error("Failed to update player records:", error);
        }
    }

    switchPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 2;
        this.resetTimer();
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
