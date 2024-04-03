const cors = require('cors');

const corsConfig = cors({
  origin: ["http://localhost:3001", "http://localhost:3002"], // Your frontend origin
  credentials: true, // Allow credentials (cookies) to be sent
});

module.exports = corsConfig;
