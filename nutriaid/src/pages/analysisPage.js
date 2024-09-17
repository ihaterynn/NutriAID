import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import Navbar from './navbar';
import snapPhotoIcon from '../graphics/SnapPhoto Icon.png';
import UploadComponent from '../components/uploadComponent';
import { extractText } from '../utils/imageProcessing';
import { analyzeIngredients, checkCalories } from '../utils/textAnalysis';
import './analysisPage.css';
import { SystemProgram, LAMPORTS_PER_SOL, Connection, clusterApiUrl, Transaction } from '@solana/web3.js';

const ANALYSIS_FEE = 0.1 * LAMPORTS_PER_SOL; // 0.1 SOL fee for analysis

function AnalysisPage() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userPreferences, setUserPreferences] = useState(null);
  const { publicKey, sendTransaction, connected } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    const storedPreferences = localStorage.getItem('dietaryProfile');
    if (storedPreferences) {
      setUserPreferences(JSON.parse(storedPreferences));
    } else {
      // If no preferences are found, redirect to the profile page
      navigate('/profile');
    }
  }, [navigate]);

  useEffect(() => {
    console.log("Wallet connected state:", connected);
  }, [connected]);

  const handleFileChange = (file) => {
    setSelectedFile(file);
    console.log("File uploaded:", file);
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

    // Confirm the transaction with the user
    const confirmed = window.confirm(`This analysis will cost ${ANALYSIS_FEE / LAMPORTS_PER_SOL} SOL. Do you want to proceed?`);
    if (!confirmed) {
      return;
    }

    setIsAnalyzing(true);

    try {
      // Solana transaction logic
      const connection = new Connection(clusterApiUrl('devnet'));
      
      const recipientPublicKey = "59YtDKG5tKoUayr8vEtTzw47Et7CQAHbXKUKPCWkobar"; 

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPublicKey,
          lamports: ANALYSIS_FEE,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'processed');
      console.log("Transaction successful, signature:", signature);

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
      console.error("Error during analysis or transaction:", error);
      alert("An error occurred during analysis or Solana transaction. Please try again.");
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