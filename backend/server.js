require("dotenv").config();
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const MongoStore = require("connect-mongo");

const prisma = new PrismaClient();
const app = express();

app.use(
  session({
    secret: "your-secret-key",
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
          googleId: profile.id,
        },
      });

      if (!user) {
        user = await prisma.user_data.create({
          data: {
            googleId: profile.id,
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
    res.redirect("/");
  }
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
