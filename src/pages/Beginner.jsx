import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Beginner = () => {
  const navigate = useNavigate();

  const handleCreateAccount = (e) => {
    e.preventDefault(); // Prevent form submission (for now)
    navigate('/interests'); // Redirect to interests page
  };

  return (
    <div
      style={{
        backgroundImage: "url('/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Arial', sans-serif",
        color: "white",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          padding: "40px",
          borderRadius: "10px",
          width: "400px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "5px" }}>Smart Cents</h1>
        <p style={{ fontSize: "1.5rem", marginTop: "0", marginBottom: "30px" }}>
          Sign Up and Save Money
        </p>

        <div style={{ color: "#aaa", marginBottom: "30px" }}>
          12,200+ users saving now
        </div>

        <form>
          <div style={{ marginBottom: "20px", textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "white",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px", textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Phone Number</label>
            <input
              type="tel"
              placeholder="+1 (123) 456-7890"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "white",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px", textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "white",
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
            <input
              type="checkbox"
              id="privacy"
              style={{ marginRight: "10px" }}
            />
            <label htmlFor="privacy">I Accept the Privacy Policy</label>
          </div>

          <button
            onClick={handleCreateAccount}
            style={{
              width: "100%",
              padding: "15px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "1rem",
              fontWeight: "bold",
              marginBottom: "15px",
              cursor: "pointer",
            }}
          >
            CREATE AN ACCOUNT
          </button>

          <button
            style={{
              width: "100%",
              padding: "15px",
              backgroundColor: "#5865F2",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "1rem",
              fontWeight: "bold",
              marginBottom: "20px",
              cursor: "pointer",
            }}
          >
            CONTINUE WITH DISCORD
          </button>

          <div>
            Already Have An Account?{" "}
            <Link to="/login" style={{ color: "#4CAF50", textDecoration: "none" }}>
              Log In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Beginner;