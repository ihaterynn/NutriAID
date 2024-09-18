import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import Navbar from './navbar';
import snapPhotoIcon from '../graphics/SnapPhoto Icon.png';
import UploadComponent from '../components/uploadComponent';
import { extractText } from '../utils/imageProcessing';
import { analyzeIngredients, checkCalories } from '../utils/textAnalysis';
import './analysisPage.css';
import {
  SystemProgram,
  LAMPORTS_PER_SOL,
  Connection,
  clusterApiUrl,
  Transaction,
  PublicKey,
} from '@solana/web3.js';

const ANALYSIS_FEE = 0.01 * LAMPORTS_PER_SOL;

function AnalysisPage() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userPreferences, setUserPreferences] = useState(null);
  const [estimatedFee, setEstimatedFee] = useState(0);
  const { publicKey, sendTransaction, connected } = useWallet();
  const navigate = useNavigate();

  // Load user preferences from localStorage
  useEffect(() => {
    const storedPreferences = localStorage.getItem('dietaryProfile');
    if (storedPreferences) {
      setUserPreferences(JSON.parse(storedPreferences));
    } else {
      // If no preferences are found, redirect to the profile page
      navigate('/profile');
    }
  }, [navigate]);

  const handleFileChange = (file) => {
    setSelectedFile(file);
    console.log("File uploaded:", file);
  };

  const connectRecipientPublicKey = (address) => {
    try {
      return new PublicKey(address);
    } catch (error) {
      console.error("Invalid recipient public key:", error);
      alert("Invalid recipient address. Please contact support.");
      return null;
    }
  };

  const handleAnalyze = async () => {
    console.log("Analyze button clicked. Wallet connected:", connected);
    if (!connected) {
      alert("Please connect your wallet before analyzing.");
      return;
    }

    if (!userPreferences) {
      alert("Please complete your dietary profile before analyzing.");
      navigate('/profile');
      return;
    }

    if (!selectedFile) {
      alert("Please select an image first.");
      return;
    }

    // Proceed with fee estimation and transaction only after user clicks "Analyze"
    try {
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      
      // Define recipient public key (use environment variable)
      const RECIPIENT_PUBLIC_KEY = import.meta.env.VITE_RECIPIENT_PUBLIC_KEY;
      if (!RECIPIENT_PUBLIC_KEY) {
        alert("Recipient public key is not set. Please contact support.");
        return;
      }
      const recipientPublicKey = connectRecipientPublicKey(RECIPIENT_PUBLIC_KEY);
      if (!recipientPublicKey) return;

      // Get the latest blockhash
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');

      // Create a transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPublicKey,
          lamports: ANALYSIS_FEE,
        })
      );

      // Set the recent blockhash and fee payer
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Estimate the transaction fee
      const estimatedTransactionFee = await connection.getFeeForMessage(
        transaction.compileMessage(),
        'confirmed'
      );

      if (!estimatedTransactionFee || estimatedTransactionFee.value === undefined) {
        throw new Error('Failed to estimate transaction fee');
      }

      console.log(`Estimated Transaction Fee: ${estimatedTransactionFee.value / LAMPORTS_PER_SOL} SOL`);

      // Check if user has sufficient funds
      const userBalance = await connection.getBalance(publicKey);
      if (userBalance < ANALYSIS_FEE + estimatedTransactionFee.value) {
        alert("Insufficient funds to cover the analysis fee and transaction fee.");
        return;
      }

      // Confirm the transaction with the user
      const confirmed = window.confirm(
        `This analysis will cost ${(ANALYSIS_FEE / LAMPORTS_PER_SOL).toFixed(2)} SOL plus an estimated transaction fee of ${(estimatedTransactionFee.value / LAMPORTS_PER_SOL).toFixed(4)} SOL. Do you want to proceed?`
      );
      if (!confirmed) {
        return;
      }

      setIsAnalyzing(true);

      // Send the transaction
      const signature = await sendTransaction(transaction, connection);

      console.log("Transaction sent, signature:", signature);

      // Confirm the transaction
      const confirmation = await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature
      }, 'confirmed');

      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err.toString()}`);
      }

      console.log("Transaction successful, signature:", signature);

      // Proceed with your analysis logic
      const analysisStartTime = Date.now();

      const extractedText = await extractText(selectedFile);
      console.log("Extracted text:", extractedText);

      const healthConditions = [];
      if (userPreferences.commonDiseases) {
        if (userPreferences.commonDiseases.highBloodPressure) healthConditions.push('high blood pressure');
        if (userPreferences.commonDiseases.highCholesterol) healthConditions.push('high cholesterol');
        if (userPreferences.commonDiseases.diabetes) healthConditions.push('diabetes');
      }
      if (userPreferences.foodAllergy && userPreferences.foodAllergy !== 'None') {
        healthConditions.push(userPreferences.foodAllergy.toLowerCase());
      }
      if (userPreferences.digestiveCondition && userPreferences.digestiveCondition !== 'None') {
        healthConditions.push(userPreferences.digestiveCondition.toLowerCase());
      }
      if (userPreferences.kidneyDisease && userPreferences.kidneyDisease !== 'None') {
        healthConditions.push(userPreferences.kidneyDisease.toLowerCase());
      }
      if (userPreferences.liverCondition && userPreferences.liverCondition !== 'None') {
        healthConditions.push(userPreferences.liverCondition.toLowerCase());
      }

      const analysis = analyzeIngredients(extractedText, healthConditions, userPreferences.weightGoal);
      const calorieWarning = checkCalories(extractedText, userPreferences.weightGoal);

      let recommendation = analysis.result === "Yes" ? "Safe to consume" : "Not recommended";
      let reason = analysis.mainReason || calorieWarning || '';
      if (recommendation === "Not recommended" && reason) {
        reason = `because it ${reason}`;
      }

      const newAnalysisResult = {
        recommendation: recommendation,
        reason: reason,
        concerns: [...(analysis.conditionWarnings || []), calorieWarning].filter(Boolean),
        harmfulIngredients: analysis.potentialHarmWarnings || [],
      };

      const elapsedTime = Date.now() - analysisStartTime;
      if (elapsedTime < 3000) {
        await new Promise(resolve => setTimeout(resolve, 3000 - elapsedTime));
      }

      setAnalysisResult(newAnalysisResult);
    } catch (error) {
      console.error("Detailed error:", error);
      alert(`An error occurred: ${error.message}. Check console for details.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="analysis-page">
      <Navbar />

      {userPreferences ? (
        <div className="analysis-container">
          <div className="left-section">
            <div className="input-container">
              <div className="input-option">
                <h3>SNAP A PHOTO:</h3>
                <img src={snapPhotoIcon} alt="Snap Photo" className="icon" />
              </div>

              <div className="input-option">
                <h3>ATTACH A FILE:</h3>
                <UploadComponent onFileChange={handleFileChange} />
                {selectedFile && <p className="file-name">{selectedFile.name}</p>}
              </div>
            </div>

            <button 
              className={`analyze-button ${isAnalyzing ? 'analyzing' : ''}`}
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? "ANALYZING..." : "ANALYZE"}
            </button>
          </div>

          <div className="right-section">
            <div className="output-box consumption-recommendation">
              <h3>CONSUMPTION RECOMMENDATION:</h3>
              <p className={analysisResult ? '' : 'awaiting-input'}>
                {analysisResult ? `${analysisResult.recommendation} ${analysisResult.reason}` : 'Awaiting input...'}
              </p>
            </div>

            <div className="output-box concerns">
              <h3>CONCERNS:</h3>
              <div className={`scrollable-content ${analysisResult ? '' : 'awaiting-input'}`}>
                {analysisResult && analysisResult.concerns && analysisResult.concerns.length > 0
                  ? analysisResult.concerns.join(', ')
                  : 'None'}
              </div>
            </div>

            <div className="output-box harmful-ingredients">
              <h3>POTENTIALLY HARMFUL/UNHEALTHY INGREDIENTS:</h3>
              <div className={`scrollable-content ${analysisResult ? '' : 'awaiting-input'}`}>
                {analysisResult && analysisResult.harmfulIngredients && analysisResult.harmfulIngredients.length > 0
                  ? analysisResult.harmfulIngredients.join(', ')
                  : 'None'}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="profile-incomplete-message">
          <p>Please complete your dietary profile before analyzing.</p>
          <button onClick={() => navigate('/profile')}>Go to Profile</button>
        </div>
      )}
    </div>
  );
}

export default AnalysisPage;