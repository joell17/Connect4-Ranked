const cors = require('cors');

org = process.env.NODE_ENV == "Development" ? ["https://localhost:3001", "https://localhost:3000"] : ["https://super-kitsune-9a88a7.netlify.app"];

const corsConfig = cors({
  origin: org,
  credentials: true, // Allow credentials (cookies) to be sent
});

module.exports = corsConfig;
