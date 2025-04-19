import React from "react";

const Dashboard = ({ user, handleLogout }) => {
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <header>
        <h1>ReferralHub Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user.name}!</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>
      
      <div className="dashboard-content">
        <h2>Your Dashboard</h2>
        <p>This is where your main application content will go.</p>
        <p>Your email: {user.email}</p>
      </div>
    </div>
  );
};

export default Dashboard;