require("dotenv").config();
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const MongoStore = require("connect-mongo");

const prisma = new PrismaClient();
const app = express();

const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3001", // Your frontend origin
    credentials: true, // Allow credentials (cookies) to be sent
  })
);


app.use(
  session({
    secret: "TY5x8JnSd0",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
  })
);

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
            id: profile.id,
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
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user_data.findUnique({ where: { id } });
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
    req.session.user = { google_id: req.user.id }; // Store google_id in session
    res.redirect("http://localhost:3001/"); // Change this for production
  }
);


app.get("/auth/user", async (req, res) => {
  if (req.session.user) {
    try {
      const user = await prisma.user_data.findUnique({
        where: {
          google_id: req.session.user.google_id, // Assuming google_id is stored in the session
        },
      });

      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
