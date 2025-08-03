import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { FaUserCircle } from "react-icons/fa";

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav>
      <Link to="/">
        <div className="nav-logo">
          <img
            src="https://www.github.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub Logo"
          />
          <h3>HubForge</h3>
        </div>
      </Link>

      <div className="nav-links">
        <Link to="/create">
          <p>Create a Repository</p>
        </Link>

        <div className="profile-dropdown" ref={dropdownRef}>
          <FaUserCircle
            size={24}
            color="white"
            className="profile-icon"
            onClick={() => setDropdownOpen((prev) => !prev)}
          />
          {dropdownOpen && (
            <div className="dropdown-menu">
              <Link to="/profile">Your Profile</Link>
              <Link to="/starred">Starred Repositories</Link>
              <button onClick={() => {
                localStorage.clear();
                window.location.href = "/auth";
              }}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
