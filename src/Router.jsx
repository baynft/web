import React from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import MintPage from "./Pages/Mint/MintPage";
import StartPage from "./Pages/Start/StartPage";

export default function Router() {
  return (
    <BrowserRouter>
      <nav style={{
        textAlign : "right"
        }} >
        <NavLink className={({ isActive }) => "nav-link" + (isActive ? " click" : "")} to='/'>
          Home
        </NavLink>
        
        <NavLink className={({ isActive }) => "nav-link" + (isActive ? " click" : "")} to='/mint'>
          Mint
        </NavLink>
      </nav>

      <Routes>
        <Route exact path='/' element={<StartPage />} />
        <Route path='/mint' element={<MintPage />} />
      </Routes>
    </BrowserRouter>
  );
}