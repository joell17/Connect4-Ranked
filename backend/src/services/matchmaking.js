const GameSession = require("../models/GameSession");
const WebSocket = require('ws');

class MatchmakingService {
  constructor(wss) {
    this.queue = [];
    this.gameSessions = {}; // Store active game sessions
    this.wss = wss;
  }

  addToQueue(user) {
    this.queue.push(user); // Enqueue the entire user_data object
    this.tryMatchmaking();
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
    console.log('Trying to notify players');
  
    this.wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN && (client.user.google_id === player1.google_id || client.user.google_id === player2.google_id)) {
        console.log('Found a player: ' + client.user.google_id);
        client.send(
          JSON.stringify({
            type: "gameSessionCreated",
            gameSession: gameSession,
          })
        );
      }
    });
  }  
}

module.exports = MatchmakingService;
