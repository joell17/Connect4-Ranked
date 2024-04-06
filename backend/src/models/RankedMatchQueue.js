const AVLTree = require("./AVLTree");
const PlayerData = require("./PlayerData");
const GameSession = require("./GameSession");
const WebSocket = require("ws");

class RankedMatchQueue {
    constructor(gameSessions, wss) {
        this.tree = new AVLTree();
        this.matching = false;
        this.gameSessions = gameSessions;  // Reference to where gameSessions are stored
        this.wss = wss;  // Web Socket Server
        // this.notifyPlayers = notifyPlayers; Should have it's own notify players so we don't have to look for sockets
    }

    // Add a player to the queue
    addPlayer(user_data, client_ws) {
        const playerData = new PlayerData(user_data, client_ws);
        this.tree.insertNode(playerData);
        // if (!matching) startMatching();
    }

    // Remove a player from the queue
    removePlayer(playerData) {
        this.tree.deleteNode(playerData);
    }

    async startMatching() {
        this.matching = true;
        while (this.matching && this.tree.getRoot()) {
            let pairs = await this.matchPlayers();
            this.makeGameSessionsFromPairs(pairs);

            // Wait a bit before trying to match again
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }

    makeGameSessionsFromPairs(pairs) {
        pairs.forEach(pair => {
            const gameSession = new GameSession(pair[0].user_data, pair[1].user_data, true);
            this.gameSessions[gameSession.id] = gameSession;
            let success = this.notifyPlayers(pair[0], pair[1], gameSession);
            if (!success) console.log('failed matchmaking');  // Maybe notify players of failed matchmaking
            this.removePlayer(pair[0]);
            this.removePlayer(pair[1]);
        });
    }

    notifyPlayers(player1Data, player2Data, gameSession) {
        // Make sure both or no players are messaged
        if (player1Data.client_ws.readyState !== WebSocket.OPEN || player2Data.client_ws.readyState !== WebSocket.OPEN) return false;

        // Notify player 1
        if (player1Data.client_ws.readyState === WebSocket.OPEN) {
            gameSession.players[0].client = player1Data.client_ws;
            player1Data.client_ws.send(
                JSON.stringify({
                    type: "gameSessionCreated",
                    gameSession: {
                        id: gameSession.id,
                        player1_skin: gameSession.players[0].skin,
                        player2_skin: gameSession.players[1].skin,
                        isPlayer1: true,
                    },
                })
            );
        }

        // Notify player 2
        if (player2Data.client_ws.readyState === WebSocket.OPEN) {
            gameSession.players[1].client = player2Data.client_ws;
            player2Data.client_ws.send(
                JSON.stringify({
                    type: "gameSessionCreated",
                    gameSession: {
                        id: gameSession.id,
                        player1_skin: gameSession.players[0].skin,
                        player2_skin: gameSession.players[1].skin,
                        isPlayer1: false,
                    },
                })
            );
        }

        console.log('Players notified of ranked match');
        return true;
    }

    stopMatching() {
        this.matching = false;
    }

    // Match players within their acceptable rating range
    async matchPlayers() {
        const players = [];
        this.tree.inOrder((playerData) => players.push(playerData));

        const pairs = [];
        const matchedIndices = new Set();

        for (let i = 0; i < players.length; i++) {
            if (matchedIndices.has(i)) continue;

            const player1 = players[i];
            for (let j = i + 1; j < players.length; j++) {
                if (matchedIndices.has(j)) continue;

                const player2 = players[j];
                if (player2.elo > player1.elo + player1.rating_range) {
                    // Player2 and all subsequent players are out of range for player1
                    break;
                }
                if (
                    this.isInRange(player1, player2) &&
                    this.isInRange(player2, player1)
                ) {
                    pairs.push([player1, player2]);
                    matchedIndices.add(i);
                    matchedIndices.add(j);
                    break;
                }
            }
        }

        return pairs;
    }

    isInRange(player1, player2) {
        return (
            player1.elo >= player2.elo - player2.rating_range &&
            player1.elo <= player2.elo + player2.rating_range
        );
    }

    // Optional: method to print the queue for debugging
    printQueue() {
        this.tree.preOrder((playerData) => {
            console.log(
                `Player: ${playerData.user_data.username}, Elo: ${playerData.elo}`
            );
        });
    }
}

module.exports = RankedMatchQueue;
