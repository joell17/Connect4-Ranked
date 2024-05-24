# Connect 4 Online Game Platform

The project is hosted here: https://super-kitsune-9a88a7.netlify.app/

This repository contains the full source code for the Connect 4 Online Game Platform, a real-time multiplayer game built using React, Node.js, and WebSocket. The game supports both casual and ranked matchmaking modes, enabling players to compete against each other in a classic Connect 4 setup.

## Features

- **Real-Time Multiplayer Gameplay:** Utilize WebSockets for live, bi-directional communication between clients and server.
- **Matchmaking System:** Both casual and ranked matchmaking systems allow players to find opponents with similar skills.
- **User Authentication:** Google OAuth for secure login.
- **Player Ranking:** Elo-based ranking system to ensure competitive integrity in ranked matches.
- **Customizable Skins:** Players can customize their game pieces with skins they've unlocked.
- **Responsive Design:** Compatible with both desktop and mobile browsers.

## Technologies Used

- **Frontend:** React
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose for data management
- **Authentication:** Passport.js with Google OAuth
- **Real-Time Communication:** WebSocket
- **Security:** HTTPS setup with Nginx as a reverse proxy
- **Session Management:** express-session with MongoStore
- **Environment Management:** dotenv for environment variable management

## Setup and Installation

### Prerequisites

- Node.js
- MongoDB
- Nginx
- An HTTPS certificate for secure communication

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourgithubusername/connect4-online.git
   cd connect4-online
   ```


# Installation and Setup Instructions

## Install dependencies

```bash
cd backend
npm install
npx prisma generate

cd ../frontend
yarn install
```

## Configure environment variables

Create a `.env` file in the `backend` directory and add the following variables:

```
PORT=3000
DATABASE_URL=your_database_url
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_secret
KEY_PATH=path_to_your_private.key
CERT_PATH=path_to_your_certificate.crt
```

## Configure Nginx

Set up Nginx as a reverse proxy to direct traffic to your application and handle HTTPS.

## Start the backend server

```bash
cd backend
npm start
```

## Start the frontend application

```bash
cd ../frontend
yarn start
HTTPS=true yarn start
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or create an issue for any bugs or improvements.
