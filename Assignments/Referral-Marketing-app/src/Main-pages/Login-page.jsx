import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = ({ handleLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Login failed");
        return;
      }

      // Use the handleLogin function from App component
      handleLogin(data.user, data.token);
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      setError("Server error, please try again");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Signup/Login_base_container">
      <p className="Signup/Login_top_heading">Login to ReferralHub</p>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <label>
          <p>Email</p>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="abc@gmail.com"
          />
        </label>
        <label>
          <p>Password</p>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter password"
          />
        </label>
        
        <button 
          type="submit" 
          className="login-button"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      
      <p>
        Don't have an account? <Link to="/">Sign Up</Link>
      </p>
    </div>
  );
};

export default LoginPage;