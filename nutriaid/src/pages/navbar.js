// src/pages/navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import ConnectWallet from '../components/connectWallet'; // Import the ConnectWallet component
import './navbar.css'; // Import the CSS for Navbar
import Logo from '../graphics/Logo.png'; // Import the Logo image

function Navbar() {
    return (
        <nav className="navbar">
            <div className="logo">
                <img src={Logo} alt="NutriAID Logo" className="navbar-logo" /> {/* Replace text with logo */}
            </div>
            <div className="nav-links">
                <Link to="/" className="nav-link">HOME</Link>
                <Link to="/profile" className="nav-link">PROFILE</Link>
                <Link to="/analysis" className="nav-link">ANALYSIS</Link>
            </div>
            <ConnectWallet /> {/* Use the ConnectWallet component */}
        </nav>
    );
}

export default Navbar;
