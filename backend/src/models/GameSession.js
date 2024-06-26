const BoardData = require("./BoardData");
const WebSocket = require("ws");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const RankingService = require("../services/rankingService");

class GameSession {
    constructor(player1, player2, isRanked = false) {
        this.id = this.generateUniqueId();
        this.players = [
            {
                id: player1.id,
                username: player1.username,
                skin: player1.primary_skin,
                client: null,
                rematchRequested: false,
                elo: player1.elo,
                rank: player1.rank,
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
                elo: player2.elo,
                rank: player2.rank,
            },
        ];
        this.boardData = new BoardData(this.winHook.bind(this));
        this.currentPlayerIndex = 0; // Index of the current player in the players array
        this.status = "ongoing";
        this.winner = null;

        this.timer = 30; // 30 seconds for each turn
        this.timerInterval = null;
        this.startTimer();
        this.isRanked = isRanked;
    }

    endSession() {
        this.stopTimer();
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

        if (this.status !== "ongoing") return;

        // Consider it a forfeit when the timer runs out
        this.switchPlayer();
        this.winHook();
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
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
        this.stopTimer();
        this.status = "completed";
        this.winner = this.players[this.currentPlayerIndex].username;

        // Update database stats
        const winner_id = this.players[this.currentPlayerIndex].id;
        const loser_id = this.players[this.currentPlayerIndex === 0 ? 1 : 0].id;

        this.updatePlayerRecords(winner_id, loser_id); // Should there be an await here?

        if (this.isRanked) {
            this.updatePlayerRanks(this.currentPlayerIndex);
        }

        this.sendPlayersMessage("gameOver", {
            winner_username: this.winner,
            player1_elo: this.players[0].elo,
            player2_elo: this.players[1].elo,
        });
    }

    async updatePlayerRanks(winner_index) {
        try {
            let winnerInfo = this.players[winner_index];
            let loserInfo = this.players[winner_index === 0 ? 1 : 0];

            let oldWinnerElo = winnerInfo.elo;
            winnerInfo.elo = RankingService.CalculateNewRating(
                winnerInfo.elo,
                loserInfo.elo,
                "win"
            );
            loserInfo.elo = RankingService.CalculateNewRating(
                loserInfo.elo,
                oldWinnerElo,
                "lose"
            );
            winnerInfo.client.elo = winnerInfo.elo;
            loserInfo.client.elo = loserInfo.elo;

            winnerInfo.rank = RankingService.DetermineDivision(winnerInfo.elo);
            loserInfo.rank = RankingService.DetermineDivision(loserInfo.elo);
            winnerInfo.client.rank = winnerInfo.rank;
            loserInfo.client.rank = loserInfo.rank;

            await prisma.user_data.update({
                where: {
                    id: winnerInfo.id,
                },
                data: {
                    elo: winnerInfo.elo, // Corrected syntax
                    rank: winnerInfo.rank,
                },
            });

            await prisma.user_data.update({
                where: {
                    id: loserInfo.id,
                },
                data: {
                    elo: loserInfo.elo, // Corrected syntax
                    rank: loserInfo.rank,
                },
            });
        } catch (error) {
            console.error("Failed to update player rankings:", error);
        }
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
