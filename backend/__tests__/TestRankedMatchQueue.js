const RankedMatchQueue = require("../src/models/RankedMatchQueue");
const PlayerData = require("../src/models/PlayerData");
const WebSocket = require("ws");

// Mock WebSocket
jest.mock("ws", () => {
    const WebSocketMock = jest.fn().mockImplementation(() => ({
        readyState: 1, // Use the numeric value for WebSocket.OPEN, which is 1
        send: jest.fn(),
    }));
    WebSocketMock.OPEN = 1; // Set the OPEN property on the mock
    return WebSocketMock;
});


describe("RankedMatchQueue", () => {
    let queue;
    let mockWebSocketServer;
    let mockGameSessions;

    beforeEach(() => {
        mockWebSocketServer = { clients: new Set() }; // Simplified mock WebSocket server
        mockGameSessions = {};
        queue = new RankedMatchQueue(mockGameSessions, mockWebSocketServer);
    });

    test("should add players correctly", () => {
        const playerData = new PlayerData({ id: "1", elo: 1000 }, new WebSocket("ws://localhost"));
        queue.addPlayer(playerData.user_data, playerData.client_ws);

        const players = [];
        queue.tree.inOrder((item) => players.push(item));
        expect(players).toContainEqual(playerData);
    });

    test("should remove players correctly", () => {
        const playerData = new PlayerData({ id: "1", elo: 1000 }, new WebSocket("ws://localhost"));
        queue.addPlayer(playerData.user_data, playerData.client_ws);
        queue.removePlayer(playerData);

        const players = [];
        queue.tree.inOrder((item) => players.push(item));
        expect(players).not.toContainEqual(playerData);
    });

    test("should match players within their rating range", async () => {
        const playerData1 = new PlayerData({ id: "1", elo: 1000 }, new WebSocket("ws://localhost"));
        const playerData2 = new PlayerData({ id: "2", elo: 1050 }, new WebSocket("ws://localhost"));
        queue.addPlayer(playerData1.user_data, playerData1.client_ws);
        queue.addPlayer(playerData2.user_data, playerData2.client_ws);

        const pairs = await queue.matchPlayers();
        expect(pairs).toEqual([[playerData1, playerData2]]);
    });

    test("should not match players outside their rating range", async () => {
        const playerData1 = new PlayerData({ id: "1", elo: 1000 }, new WebSocket("ws://localhost"));
        const playerData2 = new PlayerData({ id: "2", elo: 1100 }, new WebSocket("ws://localhost"));
        queue.addPlayer(playerData1.user_data, playerData1.client_ws);
        queue.addPlayer(playerData2.user_data, playerData2.client_ws);

        const pairs = await queue.matchPlayers();
        expect(pairs).toEqual([]);
    });

    // Add more tests as needed
});
