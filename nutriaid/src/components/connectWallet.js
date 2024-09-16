import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../components/connectWallet.css'; 

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
        navigate('/wallet-selection'); 
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
