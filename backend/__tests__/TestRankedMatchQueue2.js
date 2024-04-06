const RankedMatchQueue = require("../src/models/RankedMatchQueue");
const PlayerData = require("../src/models/PlayerData");
const GameSession = require("../src/models/GameSession");
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

describe("RankedMatchQueue", () => {
    let queue;
    let mockGameSessions;
    let playerData1;
    let playerData2;

    beforeEach(() => {
        mockGameSessions = {};
        queue = new RankedMatchQueue(
            mockGameSessions,
            new WebSocket.Server({ noServer: true })
        );
        playerData1 = new PlayerData(
            { id: "1", elo: 1000 },
            new WebSocket("ws://localhost")
        );
        playerData2 = new PlayerData(
            { id: "2", elo: 1050 },
            new WebSocket("ws://localhost")
        );
    });

    afterEach(() => {
        queue.stopMatching();
        Object.values(mockGameSessions).forEach((gameSession) => {
            gameSession.endSession();
        });
    });

    test("startMatching and stopMatching should control matching state", async () => {
        expect(queue.matching).toBeFalsy();
        queue.startMatching();
        expect(queue.matching).toBeTruthy();
        queue.stopMatching();
        expect(queue.matching).toBeFalsy();
    });

    test("makeGameSessionsFromPairs should create game sessions and notify players", () => {
        queue.addPlayer(playerData1.user_data, playerData1.client_ws);
        queue.addPlayer(playerData2.user_data, playerData2.client_ws);
        const pairs = [[playerData1, playerData2]];

        queue.makeGameSessionsFromPairs(pairs);

        expect(Object.keys(mockGameSessions).length).toBe(1);
        expect(
            mockGameSessions[Object.keys(mockGameSessions)[0]]
        ).toBeInstanceOf(GameSession);
        expect(playerData1.client_ws.send).toHaveBeenCalled();
        expect(playerData2.client_ws.send).toHaveBeenCalled();
    });

    test("notifyPlayers should return true if both players are notified", () => {
        const success = queue.notifyPlayers(
            playerData1,
            playerData2,
            new GameSession(playerData1.user_data, playerData2.user_data, true)
        );
        expect(success).toBeTruthy();
        expect(playerData1.client_ws.send).toHaveBeenCalled();
        expect(playerData2.client_ws.send).toHaveBeenCalled();
    });

    test("notifyPlayers should return false if one player's WebSocket is not open", () => {
        playerData2.client_ws.readyState = WebSocket.CLOSED;
        const success = queue.notifyPlayers(
            playerData1,
            playerData2,
            new GameSession(playerData1.user_data, playerData2.user_data, true)
        );
        expect(success).toBeFalsy();
        expect(playerData1.client_ws.send).not.toHaveBeenCalled();
        expect(playerData2.client_ws.send).not.toHaveBeenCalled();
    });

    // Add more tests as needed
});
