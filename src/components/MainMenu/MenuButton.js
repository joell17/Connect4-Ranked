import React from "react";
import "./MenuButton.css";

const MenuButton = ({ label, setActiveMenuItems, children }) => {
  return (
    <button
      className="menu-button"
      onClick={() => setActiveMenuItems(children)}
      aria-label={label}
    >
      {label}
    </button>
  );
};

export default MenuButton;
