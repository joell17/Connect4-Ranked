const BoardData = require('./BoardData');


class GameSession {
  constructor(player1, player2) {
    this.id = this.generateUniqueId();
    this.players = [
      { id: player1.id, username: player1.username, skin: player1.primary_skin },
      {
        id: player2.id,
        username: player2.username,
        skin: player1.primary_skin === player2.primary_skin ? player2.secondary_skin : player2.primary_skin
      }
    ];
    this.boardData = new BoardData(this.winHook.bind(this));
    this.currentPlayerIndex = 0; // Index of the current player in the players array
    this.timer = 15; // 15 seconds for each turn
    this.status = 'ongoing';
    this.winner = null;
  }

  generateUniqueId() {
    // Generate a unique ID for the game session
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  winHook() {
    this.status = 'completed';
    this.winner = this.players[this.currentPlayerIndex].username;
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
