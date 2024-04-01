const GameSession = require("../models/GameSession");

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
    this.wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN && (client.user === player1.google_id || client.user === player2.google_id)) {
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
