import React from 'react';
import { Link } from 'react-router-dom';
import ConnectWallet from '../components/connectWallet'; 
import './navbar.css'; 
import Logo from '../graphics/Logo.png'; 

function Navbar() {
    return (
        <nav className="navbar">
            <div className="logo">
                <img src={Logo} alt="NutriAID Logo" className="navbar-logo" /> 
            </div>
            <div className="nav-links">
                <Link to="/" className="nav-link">HOME</Link>
                <Link to="/profile" className="nav-link">PROFILE</Link>
                <Link to="/analysis" className="nav-link">ANALYSIS</Link>
            </div>
            <ConnectWallet /> 
        </nav>
    );
}

export default Navbar;
