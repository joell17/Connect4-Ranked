require("dotenv").config();
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");
const cookieParser = require("cookie-parser");
const cookie = require("cookie");

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app); // Create an HTTP server for the express app
const wss = new WebSocket.Server({ server }); // Attach the WebSocket server to the HTTP server
const MatchmakingService = require('./services/matchmaking');

const matchmakingService = new MatchmakingService(wss); // Pass the WebSocket server to the matchmaking service

// Session configuration
const sessionParser = session({
  secret: "TY5x8JnSd0",
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
});

app.use(sessionParser);
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3001", // Your frontend origin
    credentials: true, // Allow credentials (cookies) to be sent
  })
);

// Passport configuration for Google OAuth
// Passport configuration for Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {
      let user = await prisma.user_data.findUnique({
        where: {
          google_id: profile.id,
        },
      });

      if (!user) {
        user = await prisma.user_data.create({
          data: {
            id: profile.id, // Include the id field
            google_id: profile.id,
            email: profile.emails[0].value,
            date_joined: new Date().toISOString(),
            games_played: 0,
            losses: 0,
            primary_skin: "red",
            rank: "Unranked",
            secondary_skin: "yellow",
            settings: {
              music_volume: 50,
              notifications_enabled: true,
              sound_volume: 50,
            },
            skins_unlocked: ["red", "yellow"],
            wins: 0,
          },
        });
      }

      return cb(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.google_id); // Use google_id for session identification
});

passport.deserializeUser(async (google_id, done) => {
  try {
    const user = await prisma.user_data.findUnique({ where: { google_id } });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Store entire user_data in session
    req.session.user = req.user;
    res.redirect("http://localhost:3001/"); // Change this for production
  }
);

app.get("/auth/user", (req, res) => {
  if (req.session.user) {
    res.json(req.session.user); // Send user data from session
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

app.get("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy(); // Destroy session after logging out
    res.redirect("http://localhost:3001/"); // Redirect to the frontend after logging out
  });
});


const gameRoutes = require("./routes/gameRoutes");
app.use("/game", gameRoutes(matchmakingService));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => { // Use the HTTP server to listen
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
    console.log("Received message:", message);
  });

  ws.send("Welcome to the WebSocket server!");
});
