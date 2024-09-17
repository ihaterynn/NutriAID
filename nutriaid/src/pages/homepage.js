import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './navbar'; // Import the Navbar component
import './homepage.css'; // Specific styles for Homepage

function Homepage() {
  console.log("Homepage Component Rendering");

  return (
    <div className="homepage">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="hero-section">
        <h1>Made for you Health Freaks</h1>
        <h2>EZ Food Analysis</h2>
        <div className="food-icons">
          {/* Add food icons here */}
          <img src="/path/to/icon1.png" alt="Food Icon" className="food-icon" />
          {/* Add more icons as per design */}
        </div>
      </div>

      <div className="start-analysis">
        <Link to="/profile">
          <button className="start-button">START ANALYSIS</button>
        </Link>
      </div>
    </div>
  );
}

export default Homepage;
