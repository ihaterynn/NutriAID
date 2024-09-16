// src/pages/WalletSelectionPage.js
import React from 'react';
import './walletSelectionPage.css'; // Ensure you create this CSS file

function WalletSelectionPage() {
    const handlePhantomConnect = async () => {
        if (window.solana && window.solana.isPhantom) {
            try {
                const response = await window.solana.connect();
                console.log('Connected to wallet:', response.publicKey.toString());
                const walletAddress = response.publicKey.toString();
                localStorage.setItem('walletAddress', walletAddress);

                // Redirect to homepage after connection
                window.location.href = '/';
            } catch (error) {
                console.error('Failed to connect to Phantom wallet:', error);
            }
        } else {
            alert('Phantom wallet not found. Please install it from https://phantom.app/');
        }
    };

    return (
        <div className="wallet-selection-container">
            <h2>Select a Wallet</h2>
            <div className="wallet-option" onClick={handlePhantomConnect}>
                <img src="/path/to/phantom-logo.png" alt="Phantom Wallet" />
                <span>Phantom</span>
            </div>
            {/* Add other wallets here if needed */}
        </div>
    );
}

export default WalletSelectionPage;
