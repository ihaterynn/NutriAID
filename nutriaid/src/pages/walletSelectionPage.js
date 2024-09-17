import React from 'react';
import { useNavigate } from 'react-router-dom';  
import phantomIcon from '../graphics/Phantom-Icon_Transparent.png';
import metamaskIcon from '../graphics/MetaMask Logo.png'; 
import exodusIcon from '../graphics/Exodus Icon.png';  
import okxIcon from '../graphics/OKX Icon.jpeg';  
import './walletSelectionPage.css'; 

function WalletSelectionPage() {
    const navigate = useNavigate();  // Initialize useNavigate for programmatic navigation

    const handleWalletConnect = (walletType) => {
        switch (walletType) {
            case 'phantom':
                connectPhantomWallet();
                break;
            case 'metamask':
                connectMetaMask();
                break;
            case 'exodus':
                connectExodusWallet();
                break;
            case 'okx':
                connectOKXWallet();
                break;
            default:
                break;
        }
    };

    const connectPhantomWallet = async () => {
        if (window.solana && window.solana.isPhantom) {
            try {
                const response = await window.solana.connect();
                console.log('Connected to Phantom wallet:', response.publicKey.toString());
                localStorage.setItem('walletAddress', response.publicKey.toString());
                navigate('/');  // Redirect to homepage after connection
            } catch (error) {
                console.error('Failed to connect to Phantom wallet:', error);
            }
        } else {
            alert('Phantom wallet not found. Please install it from https://phantom.app/');
        }
    };

    const connectMetaMask = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                console.log('Connected to MetaMask:', accounts[0]);
                localStorage.setItem('walletAddress', accounts[0]);
                navigate('/');  
            } catch (error) {
                console.error('Failed to connect to MetaMask:', error);
            }
        } else {
            alert('MetaMask not found. Please install it from https://metamask.io/');
        }
    };

    const connectExodusWallet = async () => {
        // Placeholder function, integrate Exodus wallet connection here
        console.log('Connecting to Exodus wallet...');
        // Placeholder Logic for Exodus wallet connection

        // navigate('/');  // Redirect to homepage after connection
    };

    const connectOKXWallet = async () => {
        // Placeholder function, integrate OKX wallet connection here
        console.log('Connecting to OKX wallet...');
        // Placeholder Logic for OKX wallet connection

        // navigate('/');  // Redirect to homepage after connection
    };

    return (
        <div className="wallet-selection-page">
            <div id="particles-js"></div> {/* Particle background */}
            <div className="wallet-container">
                <h2>SELECT WALLET</h2>
                <div className="wallet-options">
                    <div className="wallet-option" onClick={() => handleWalletConnect('phantom')}>
                        <img src={phantomIcon} alt="Phantom" />
                        <span>Phantom</span>
                    </div>
                    <div className="wallet-option" onClick={() => handleWalletConnect('metamask')}>
                        <img src={metamaskIcon} alt="MetaMask" />
                        <span>MetaMask</span>
                    </div>
                    <div className="wallet-option" onClick={() => handleWalletConnect('exodus')}>
                        <img src={exodusIcon} alt="Exodus" />
                        <span>Exodus</span>
                    </div>
                    <div className="wallet-option" onClick={() => handleWalletConnect('okx')}>
                        <img src={okxIcon} alt="OKX Wallet" />
                        <span>OKX Wallet</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WalletSelectionPage;
