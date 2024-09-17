// WalletSelectionPage.js
import React, { useEffect } from 'react';
import { useWallet} from '@solana/wallet-adapter-react';
import {WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useNavigate } from 'react-router-dom';  
import '../pages/walletSelectionPage.css'; 

function WalletSelectionPage() {
    const { connected } = useWallet();
    const navigate = useNavigate();

    useEffect(() => {
        if (connected) {
            navigate('/'); // Redirect to homepage after successful connection
        }
    }, [connected, navigate]);

    return (
        <div className="wallet-selection-page">
            <div id="particles-js"></div> {/* Particle background */}
            <div className="wallet-container">
                <h2>SELECT WALLET</h2>
                <div className="wallet-options">
                    <WalletMultiButton className="wallet-option">
                        Connect Wallet
                    </WalletMultiButton>
                </div>
            </div>
        </div>
    );
}

export default WalletSelectionPage;
