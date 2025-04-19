import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "./Main-pages/Signup-page";
import LoginPage from "./Main-pages/Login-page";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignupPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
