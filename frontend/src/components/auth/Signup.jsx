import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { useAuth } from "../../Authcontext";

import { PageHeader } from "@primer/react";
import { Box, Button } from "@primer/react";
import "./auth.css";

import logo from "../../assets/github-mark-white.svg";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("https://hubforge.onrender.com/signup", {
        username: username,
        email: email,
        password: password,
      });

      const token = response.data.token;
      const userId = response.data.userId;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      setCurrentUser(userId);
      setLoading(false);
      window.location.href = "/";
    } catch (error) {
      alert("Error during signup. Please try again.");
      console.error("Error during signup:", error);
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-logo-container">
        <img className="logo-login" src={logo} alt="Logo" />
      </div>

      <div className="login-box-wrapper">
        <div className="login-heading">
          <Box sx={{ padding: 1 }}>
            <PageHeader>
              <PageHeader.TitleArea variant="large">
                <PageHeader.Title>Sign Up</PageHeader.Title>
              </PageHeader.TitleArea>
            </PageHeader>
          </Box>
        </div>

        <div className="login-box">
          <div>
            <label className="label">Username</label>
            <input
              autoComplete="off"
              name="Username"
              id="Username"
              className="input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Email address</label>
            <input
              autoComplete="off"
              name="Email"
              id="Email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="div">
            <label className="label">Password</label>
            <input
              autoComplete="off"
              name="Password"
              id="Password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            variant="primary"
            className="login-btn"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
        </div>

        <div className="pass-box">
          <p>
            Already have an account? <Link to="/auth">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
