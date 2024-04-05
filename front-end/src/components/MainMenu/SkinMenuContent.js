import React, { useState } from "react";
import "./SkinMenuContent.css";
import config from "../../config";

const SkinMenuContent = ({ user_data, fetchUserData }) => {
    const [selectedSkinButton, setSelectedSkinButton] = useState("primary");
    const [primarySkinButtonSkin, setPrimarySkinButtonSkin] = useState(
        user_data.primary_skin
    );
    const [secondarySkinButtonSkin, setSecondarySkinButtonSkin] = useState(
        user_data.secondary_skin
    );

    const setSelectedSkinButtonSkin = (skin) => {
        if (selectedSkinButton === "primary") {
            setPrimarySkinButtonSkin(skin);
        } else {
            setSecondarySkinButtonSkin(skin);
        }
    };

    const applySkinChanges = async () => {
        if (primarySkinButtonSkin === secondarySkinButtonSkin) return;

        const response = await fetch(`${config.backendURL}/auth/user/change-skins`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({
                primary_skin: primarySkinButtonSkin,
                secondary_skin: secondarySkinButtonSkin,
            }),
        });

        if (response.ok) {
            // Handle success
            fetchUserData();
            console.log("Skins updated successfully");
        } else {
            // Handle error
            console.error("Failed to update skins");
            console.log(response);
        }
    };

    return (
        <div className="skins-menu">
            <p>Current Skins:</p>
            <div className="selector-buttons">
                <button
                    onClick={() => setSelectedSkinButton("primary")}
                    className={`skin-button ${
                        selectedSkinButton === "primary" ? "selected" : ""
                    }`}
                    aria-label="Select Primary Skin"
                    style={{
                        backgroundImage: `url(${require(`../../images/${primarySkinButtonSkin}.png`)})`,
                    }}
                ></button>
                <button
                    onClick={() => setSelectedSkinButton("secondary")}
                    className={`skin-button ${
                        selectedSkinButton === "secondary" ? "selected" : ""
                    }`}
                    aria-label="Select Secondary Skin"
                    style={{
                        backgroundImage: `url(${require(`../../images/${secondarySkinButtonSkin}.png`)})`,
                    }}
                ></button>
            </div>

            <p>All Skins:</p>
            <div className="skin-selection">
                {user_data.skins_unlocked.map((skin, i) => {
                    const skinPath = require(`../../images/${skin}.png`);

                    return (
                        <div
                            key={i}
                            className="skin-selection-button"
                            style={{ backgroundImage: `url(${skinPath})` }}
                            onClick={() => setSelectedSkinButtonSkin(skin)}
                        ></div>
                    );
                })}
            </div>

            <button className="apply-button" onClick={applySkinChanges}>Apply</button>
        </div>
    );
};

export default SkinMenuContent;
