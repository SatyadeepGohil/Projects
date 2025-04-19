import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignupPage = ({ handleLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
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
   
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
   
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/auth/signup", {
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
        setError(data.message || "Registration failed");
        return;
      }
      
      // Use the handleLogin function passed from App component
      handleLogin(data.user, data.token);
      
      // Redirect to dashboard
      navigate('/dashboard');
     
    } catch (error) {
      setError("Server error, please try again");
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Signup/Login_base_container">
      <p className="Signup/Login_top_heading">Register for ReferralHub</p>
     
      {error && <div className="error-message">{error}</div>}
     
      <form onSubmit={handleSubmit}>
        <label>
          <p>Email id</p>
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
          <p>Create Password</p>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter password"
          />
        </label>
        <label>
          <p>Confirm Password</p>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Re-enter password"
          />
        </label>
       
        <button
          type="submit"
          className="signup-button"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>
     
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default SignupPage;