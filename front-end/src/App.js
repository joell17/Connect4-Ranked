import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainMenu from "./components/MainMenu/MainMenu";
import LocalGame from "./components/LocalGame/LocalGame";
import config from "./config"; // Assuming you have a config file for backend URL

function App() {
  const [userData, setUserData] = useState(null);
  const [gameSession, setGameSession] = useState(null);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch(`${config.backendURL}/auth/user`, {
        credentials: "include",
      });
      if (response.ok) {
        const userData = await response.json();
        setUserData(userData); // Set user data state
      } else {
        console.error("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Initialize WebSocket connection
    const websocket = new WebSocket(config.websocketURL);

    websocket.onopen = () => {
      console.log("WebSocket connection established");
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "gameSessionCreated") {
        setGameSession(message.gameSession);
      }
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    websocket.onclose = () => {
      console.log("WebSocket connection closed");
      setWs(null);
    };

    return () => {
      websocket.close();
    };
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainMenu userData={userData} setUserData={setUserData} ws={ws} />} />
          <Route path="/local-pvp" element={<LocalGame />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
