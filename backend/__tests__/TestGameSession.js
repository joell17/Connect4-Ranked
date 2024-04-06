const GameSession = require("../src/models/GameSession");
const PlayerData = require("../src/models/PlayerData");
const WebSocket = require("ws");

jest.mock("ws", () => {
    const WebSocketMock = jest.fn().mockImplementation(() => ({
        readyState: 1, // Use the numeric value for WebSocket.OPEN, which is 1
        send: jest.fn(),
    }));
    WebSocketMock.OPEN = 1; // Set the OPEN property on the mock
    WebSocketMock.Server = jest.fn().mockImplementation(() => ({})); // Mock the Server constructor
    return WebSocketMock;
});

describe("GameSession", () => {
    let player1;
    let player2;
    let gameSession;

    beforeEach(() => {
        player1 = {
            id: "1",
            username: "Player1",
            primary_skin: "Skin1",
            secondary_skin: "Skin2",
            elo: 1000,
            rank: 'Iron'
        };
        player2 = {
            id: "2",
            username: "Player2",
            primary_skin: "Skin2",
            secondary_skin: "Skin1",
            elo: 1050,
            rank: 'Iron'
        };
        gameSession = new GameSession(player1, player2);
        // Mock the updatePlayerRecords method
        gameSession.updatePlayerRecords = jest.fn();
        gameSession.updatePlayerRanks = jest.fn();
    });

    afterEach(() => {
        gameSession.endSession();
    });

    test("constructor should initialize properties correctly", () => {
        expect(gameSession.players[0].username).toBe("Player1");
        expect(gameSession.players[1].username).toBe("Player2");
        expect(gameSession.status).toBe("ongoing");
        expect(gameSession.timer).toBe(30);
    });

    test("endSession should stop the timer", () => {
        gameSession.endSession();
        expect(gameSession.timerInterval).toBeNull();
    });

    test("resetTimer should set the timer to 30 seconds", () => {
        gameSession.resetTimer();
        expect(gameSession.timer).toBe(30);
    });

    test("timeUp should switch the player and end the game", () => {
        gameSession.timeUp();
        expect(gameSession.currentPlayerIndex).toBe(1);
        expect(gameSession.status).toBe("completed");
    });

    test("switchPlayer should switch the current player and reset the timer", () => {
        gameSession.switchPlayer();
        expect(gameSession.currentPlayerIndex).toBe(1);
        expect(gameSession.timer).toBe(30);
    });

    test("placePiece should place a piece and switch players if the game is ongoing", () => {
        const result = gameSession.placePiece(0);
        expect(result).toBeTruthy();
        expect(gameSession.currentPlayerIndex).toBe(1);
    });

    // Add more tests as needed
});
