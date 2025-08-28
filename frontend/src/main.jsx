import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "./index.css";

import { AuthProvider, useAuth } from "./Authcontext.jsx";

import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import StaredRepo from "./components/user/StaredRepo.jsx"; // Importing StaredRepo component
import Navbar from "./components/Navbar.jsx";
import CreateRepo from "./components/repo/CreateRepo.jsx"; // Importing CreateRepo component

// 🧠 Merged ProjectRoutes into here
const AppRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      setCurrentUser(userId);
    }

    if (!userId && !["/auth", "/signup"].includes(window.location.pathname)) {
      navigate("/auth");
    }

    if (userId && window.location.pathname === "/auth") {
      navigate("/");
    }
  }, [currentUser, setCurrentUser, navigate]);

  return (
    <>
      {!["/auth", "/signup"].includes(window.location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/auth" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/starred" element={<StaredRepo />} />
        <Route path="/create" element={<CreateRepo />} /> // Adding new route for CreateRepo component
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

// Final root render
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  </React.StrictMode>
);
