// MainMenu.js
import { useState, useEffect } from "react";
import React from "react";
import "./MainMenu.css";
import { useNavigate } from "react-router-dom";
import MenuButton from "./MenuButton";
import SkinMenuContent from "./SkinMenuContent"; // Import your SkinMenuContent component
import config from "../../config";

const MainMenu = () => {
  const navigate = useNavigate();
  const [activeMenuItemContent, setActiveMenuItemContent] = useState(null);
  const [userData, setUserData] = useState(null); // State to store user data

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

  return (
    <div
      className={`main-menu-top-level ${activeMenuItemContent ? "active" : ""}`}
    >
      <div className="main-menu">
        <MenuButton
          label="Local PvP"
          setActiveMenuItems={() => navigate("/game")}
        />
        <MenuButton
          label="Online Casual"
          setActiveMenuItems={setActiveMenuItemContent}
        >
          {/* Content for Online Casual */}
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
