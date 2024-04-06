require("dotenv").config();
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const http = require("http");
const WebSocket = require("ws");
const corsConfig = require("./config/corsConfig");
const passportConfig = require("./config/passportConfig");

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app); // Create an HTTP server for the express app
const wss = new WebSocket.Server({ server }); // Attach the WebSocket server to the HTTP server

// Session configuration
const sessionParser = session({
    secret: "TY5x8JnSd0",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
});

app.use(express.json());
app.use(sessionParser);
app.use(corsConfig);
passportConfig(passport); // Configure passport

app.use(passport.initialize());
app.use(passport.session());

const MatchmakingService = require("./services/matchmaking");
const matchmakingService = new MatchmakingService(wss); // Pass the WebSocket server to the matchmaking service

const authRoutes = require("./routes/authRoutes");
const gameRoutes = require("./routes/gameRoutes")(matchmakingService);

app.use("/auth", authRoutes);
app.use("/game", gameRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    // Use the HTTP server to listen
    console.log(`Server is running on port ${PORT}`);
});

// WebSocket connection handling
wss.on("connection", (ws, req) => {
    // Parse session from the request
    sessionParser(req, {}, () => {
        if (req.session.user) {
            // Attach the user to the WebSocket object for later reference
            ws.user = req.session.user;
        }
    });

    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message);
            if (data.action === "joinMatchmaking" && ws.user) {
                // Add the user to the matchmaking queue
                matchmakingService.addToQueue(ws.user);
            } else if (data.action === "joinRankedMatchmaking" && ws.user) {
                matchmakingService.rankedMatchQueue.addPlayer(ws.user, ws);
            }
        } catch (error) {
            console.error("Failed to parse message:", error);
            // Optionally, send an error message back to the client
        }
    });

    ws.on("close", () => {
        // Remove the user from the matchmaking queue if they disconnect
        matchmakingService.removeFromQueue(ws.user);
        matchmakingService.rankedMatchQueue.removePlayer(ws.user);
    });

    ws.send(JSON.stringify({ message: "Welcome to the WebSocket server!" }));
});
