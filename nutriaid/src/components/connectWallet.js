import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '../components/connectWallet.css';

function ConnectWallet() {
    return (
        <div className="wallet-button-wrapper">
            <WalletMultiButton className="connect-wallet" />
        </div>
    );
}

export default ConnectWallet;