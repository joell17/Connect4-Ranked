import { useState, useEffect } from "react";
import React from "react";
import "./MainMenu.css";
import { useNavigate } from "react-router-dom";
import MenuButton from "./MenuButton";
import SkinMenuContent from "./SkinMenuContent"; // Import your SkinMenuContent component
import config from "../../config";

const MainMenu = ({ userData, setUserData, ws, setGameSession }) => {
  const navigate = useNavigate();
  const [activeMenuItemContent, setActiveMenuItemContent] = useState(null);
  const [isMatchmaking, setIsMatchmaking] = useState(false);

  useEffect(() => {
    if (ws) {
      console.log("You've got mail (websocket stuff)");
      const handleMessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === "gameSessionCreated") {
            console.log("Game was found!!!");
            setIsMatchmaking(false); // Matchmaking finished
            setActiveMenuItemContent(activeMenuItemContent);
            setGameSession(message.gameSession);
            navigate('/online-casual');
            // Navigate to the game page or update the UI as needed
          }
        } catch (error) {
          console.error("Received non-JSON message:", event.data);
        }
      };

      ws.addEventListener("message", handleMessage);

      return () => {
        ws.removeEventListener("message", handleMessage);
      };
    }
  }, [ws]);

  const joinMatchmaking = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      // Send a message to the server to join matchmaking
      ws.send(JSON.stringify({ action: "joinMatchmaking" }));
      setIsMatchmaking(true); // Set matchmaking status to true
      setActiveMenuItemContent(activeMenuItemContent);
    } else {
      console.error("WebSocket is not connected");
    }
  };

  const handleLogout = async () => {
    const response = await fetch(`${config.backendURL}/auth/logout`, {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      // Handle successful logout
      setUserData(null);
      // Redirect or perform other actions after logout
      window.location.href = "/"; // Redirect to the home page or any other page
    } else {
      // Handle logout error
      console.error("Failed to logout");
    }
  };

  return (
    <div
      className={`main-menu-top-level ${activeMenuItemContent ? "active" : ""}`}
    >
      <div className="main-menu">
        <MenuButton
          label="Local PvP"
          setActiveMenuItems={() => navigate("/local-pvp")}
        />
        <MenuButton
          label="Online Casual"
          setActiveMenuItems={setActiveMenuItemContent}
        >
          {userData ? ( // Check if user is logged in
            isMatchmaking ? (
              <p>Matchmaking in progress...</p>
            ) : (
              <div className="mm-button-div">
                <button
                  onClick={() => {
                    joinMatchmaking();
                    setActiveMenuItemContent(<p>Matchmaking in progress...</p>);
                  }}
                  className="matchmaking-button"
                >
                  Start Matchmaking
                </button>
              </div>
            )
          ) : (
            <p>Please log in to start matchmaking.</p> // Message to prompt user to log in
          )}
        </MenuButton>
        <MenuButton
          label="Online Ranked"
          setActiveMenuItems={setActiveMenuItemContent}
        >
          {/* Content for Online Ranked */}
        </MenuButton>
        <MenuButton label="Skins" setActiveMenuItems={setActiveMenuItemContent}>
          <SkinMenuContent />
        </MenuButton>
        {userData ? (
          <MenuButton
            label="Profile"
            setActiveMenuItems={setActiveMenuItemContent}
          >
            {/* Content for Profile, e.g., displaying user's email */}
            <div>
              <p>Email: {userData.email}</p>
              <p>Rank: {userData.rank}</p>
              <p>Wins: {userData.wins}</p>
              <p>Losses: {userData.losses}</p>
              <p>Games Played: {userData.games_played}</p>
              <button onClick={handleLogout} className="logout-button">
                Log out
              </button>
            </div>
          </MenuButton>
        ) : (
          <MenuButton
            label="Log In"
            setActiveMenuItems={setActiveMenuItemContent}
          >
            <div>
              <p>Log in to your account:</p>
              <a
                href={`${config.backendURL}/auth/google`}
                className="google-login-button"
              >
                Sign in with Google
              </a>
            </div>
          </MenuButton>
        )}
      </div>

      <div className="side-menu">
        <button
          onClick={() => setActiveMenuItemContent(null)}
          className="close-button"
        >
          Close
        </button>
        {activeMenuItemContent}
      </div>

      <div className="title-section">
        <h1>Align Four</h1>
      </div>
    </div>
  );
};

export default MainMenu;
