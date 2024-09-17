import React from 'react';
import { NavLink } from 'react-router-dom'; // Using NavLink for active state
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
                <NavLink exact to="/" className="nav-link" activeClassName="active">
                    HOME
                </NavLink>
                <NavLink to="/profile" className="nav-link" activeClassName="active">
                    PROFILE
                </NavLink>
                <NavLink to="/analysis" className="nav-link" activeClassName="active">
                    ANALYSIS
                </NavLink>
            </div>
            <div className="connect-wallet">
                <ConnectWallet />
            </div>
        </nav>
    );
}

export default Navbar;
