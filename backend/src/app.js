require("dotenv").config();
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const WebSocket = require("ws");
const corsConfig = require("./config/corsConfig");
const passportConfig = require("./config/passportConfig");
const https = require("https");
const fs = require("fs");

const options = {
    key: fs.readFileSync(process.env.KEY_PATH),
    cert: fs.readFileSync(process.env.CERT_PATH),
};

const app = express();
const server = https.createServer(options, app);
const wss = new WebSocket.Server({ server }); // Attach the WebSocket server to the HTTP server

// Session configuration
const sessionParser = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
    cookie: {
        secure: true, // Add this line
        httpOnly: true, // You can also add this for extra security
        sameSite: "None",
    },
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
                if (data.newUserData) {
                    ws.user = data.newUserData;
                    console.log("New user data set!");
                }

                // Add the user to the matchmaking queue
                matchmakingService.addToQueue(ws.user);
            } else if (data.action === "joinRankedMatchmaking" && ws.user) {
                if (data.newUserData) {
                    ws.user = data.newUserData;
                    console.log("New user data set!");
                }
                matchmakingService.rankedMatchQueue.addPlayer(ws.user, ws);
            }
        } catch (error) {
            console.error("Failed to parse message:", error);
        }
    });

    ws.on("close", () => {
        // Remove the user from the matchmaking queue if they disconnect
        if (!ws.user) return;
        matchmakingService.removeFromQueue(ws.user);
        matchmakingService.rankedMatchQueue.removePlayer(ws.user);
    });

    ws.send(JSON.stringify({ message: "Welcome to the WebSocket server!" }));
});
