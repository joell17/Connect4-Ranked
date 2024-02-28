import React from "react";
import "./App.css"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainMenu from './components/MainMenu/MainMenu';
import LocalGame from './components/LocalGame/LocalGame';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/game" element={<LocalGame />} />
        </Routes>
      
      </BrowserRouter>
    </div>
  );
}

export default App;
