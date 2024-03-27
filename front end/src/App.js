import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainMenu from "./components/MainMenu/MainMenu";
import LocalGame from "./components/LocalGame/LocalGame";
import { GameProvider } from "./utils/GameProvider";

function App() {
  return (
    <GameProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainMenu />} />
            <Route path="/game" element={<LocalGame />} />
          </Routes>
        </BrowserRouter>
      </div>
    </GameProvider>
  );
}

export default App;
