class BoardData {
    static MAX_STACK_HEIGHT = 6;
  
    constructor(winHook) {
      this.grid = Array.from({ length: 7 }, () => []); // Array of 7 stacks
      this.currentPlayer = 'r'; // 'r' for red, 'b' for blue
      if (!winHook) {
        this.winHook = () => {console.log('Bananas');};
      }
      else {
        this.winHook = winHook;
      }
      this.hasWon = false;
    }

    clone() {
      const clone = new BoardData();
      clone.grid = this.grid;
      clone.currentPlayer = this.currentPlayer;
      clone.winHook = this.winHook;

      return clone;
    }
  
    reset() {
      this.grid = Array.from({ length: 7 }, () => []); // Array of 7 stacks
      //this.currentPlayer = 'r'; // 'r' for red, 'b' for blue
      this.hasWon = false;
    }
  
    inBounds(index, list) {
      return 0 <= index && index < list.length;
    }
  
    placePiece(x) {
      if (this.inBounds(x, this.grid) && this.grid[x].length < BoardData.MAX_STACK_HEIGHT) {
        this.grid[x].push(this.currentPlayer); // Place the piece
  
        if (this.checkWin(x, this.grid[x].length - 1)) {
          this.hasWon = true;
          this.winHook();
        }
  
        this.currentPlayer = this.currentPlayer === 'r' ? 'b' : 'r'; // Switch turns
        return true;
      } else {
        console.error('Column out of bounds or stack was full.');
        return false;
      }
    }
  
    getPieceAtPos(x, y) {
      if (this.inBounds(x, this.grid) && this.inBounds(y, this.grid[x])) {
        return this.grid[x][y];
      }
      return null;
    }
  
    getNextBlankSpot(column) {
      if (this.inBounds(column, this.grid)) {
        const nextBlankSpot = this.grid[column].length;
        return nextBlankSpot < BoardData.MAX_STACK_HEIGHT ? nextBlankSpot : null;
      }
    }
  
    checkWin(startX, startY) {
      const directions = [
        [1, 0],  // horizontal
        [0, 1],  // vertical
        [1, 1],  // diagonal down-right
        [1, -1], // diagonal up-right
      ];
  
      const checkDirection = (dx, dy) => {
        let consecutivePieces = 1;
        let [x, y] = [startX, startY];
  
        // Check in the positive direction
        while (this.inBounds(x + dx, this.grid) && this.inBounds(y + dy, this.grid[x + dx]) &&
               this.getPieceAtPos(x + dx, y + dy) === this.currentPlayer) {
          x += dx;
          y += dy;
          consecutivePieces++;
  
          if (consecutivePieces === 4) {
            return true;
          }
        }
  
        // Check in the negative direction
        [x, y] = [startX, startY]; // Reset to start position
        while (this.inBounds(x - dx, this.grid) && this.inBounds(y - dy, this.grid[x - dx]) &&
               this.getPieceAtPos(x - dx, y - dy) === this.currentPlayer) {
          x -= dx;
          y -= dy;
          consecutivePieces++;
  
          if (consecutivePieces === 4) {
            return true;
          }
        }
  
        return false;
      };
  
      for (const [dx, dy] of directions) {
        if (checkDirection(dx, dy)) {
          return true;
        }
      }
  
      return false;
    }
  }
  
  export default BoardData;
  