const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


const passportConfig = (passport) => {
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
          const username = profile.emails[0].value.split('@')[0];
          user = await prisma.user_data.create({
            data: {
              id: profile.id,
              google_id: profile.id,
              email: profile.emails[0].value,
              date_joined: new Date().toISOString(),
              games_played: 0,
              losses: 0,
              primary_skin: "red",
              rank: "Iron",
              secondary_skin: "yellow",
              settings: {
                music_volume: 50,
                notifications_enabled: true,
                sound_volume: 50,
              },
              skins_unlocked: ["red", "yellow", "green"],
              username: username,
              wins: 0,
              elo: 1000
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
};

module.exports = passportConfig;
