import { useState } from "react";
import React from "react";
import "./MainMenu.css";
import { useNavigate } from "react-router-dom";
import MenuButton from "./MenuButton";
import SkinMenuContent from "./SkinMenuContent"; // Import your SkinMenuContent component
import config from "../../config";

const MainMenu = ({ userData, setUserData, ws }) => {
  const navigate = useNavigate();
  const [activeMenuItemContent, setActiveMenuItemContent] = useState(null);

  const joinMatchmaking = async () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      // Send a message to the server to join matchmaking
      ws.send(JSON.stringify({ action: "joinMatchmaking" }));
    } else {
      console.error("WebSocket is not connected");
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
          setActiveMenuItems={() => {
            setActiveMenuItemContent(null); // I want to display a button that starts matchmaking, then UI to show matchmaking in progress
            joinMatchmaking(); // Join matchmaking
          }}
        >
          {/* Content for Online Casual. // I want to display a button that starts matchmaking, then UI to show matchmaking in progress */}
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
          <MenuButton label="Profile" setActiveMenuItems={setActiveMenuItemContent}>
            {/* Content for Profile, e.g., displaying user's email */}
            <div>
              <p>Email: {userData.email}</p>
              <p>Rank: {userData.rank}</p>
              <p>Wins: {userData.wins}</p>
              <p>Losses: {userData.losses}</p>
              <p>Games Played: {userData.games_played}</p>
              <a href={`${config.backendURL}/logout`} className="logout-button">
                Log out
              </a>
            </div>
          </MenuButton>
        ) : (
          <MenuButton label="Log In" setActiveMenuItems={setActiveMenuItemContent}>
            <div>
              <p>Log in to your account:</p>
              <a href={`${config.backendURL}/auth/google`} className="google-login-button">
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
