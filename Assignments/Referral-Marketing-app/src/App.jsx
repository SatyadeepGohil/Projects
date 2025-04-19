// App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "./Main-pages/Signup-page";
import LoginPage from "./Main-pages/Login-page";
import Dashboard from "./Main-pages/Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in by checking token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // You could validate the token with your backend here
      const userData = JSON.parse(localStorage.getItem('user'));
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <SignupPage handleLogin={handleLogin} />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage handleLogin={handleLogin} />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} handleLogout={handleLogout} /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;