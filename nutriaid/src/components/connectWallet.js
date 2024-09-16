// src/components/connectWallet.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirecting to the wallet selection page
import '../components/connectWallet.css'; // Custom CSS for the button

function ConnectWallet() {
    const [walletAddress, setWalletAddress] = useState(null);
    const navigate = useNavigate();

    // Check if wallet is already connected
    useEffect(() => {
        const storedWalletAddress = localStorage.getItem('walletAddress');
        if (storedWalletAddress) {
            setWalletAddress(storedWalletAddress);
        }
    }, []);

    const handleWalletSelection = () => {
        navigate('/wallet-selection'); // Navigate to the wallet selection page
    };

    return (
        <div className="wallet-button-container">
            <button className="connect-wallet" onClick={handleWalletSelection}>
                {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
            </button>
        </div>
    );
}

export default ConnectWallet;
