import React, { useState } from 'react';  // Only import React once
import { useWallet } from '@solana/wallet-adapter-react';
import Navbar from './navbar'; 
import snapPhotoIcon from '../graphics/SnapPhoto Icon.png'; 
import UploadComponent from '../components/uploadComponent'; 
import './analysisPage.css'; 

function AnalysisPage() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const { connected } = useWallet();

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    console.log("Analysis result:", result);
  };

  const handleFileChange = (file) => {
    console.log("File uploaded:", file);
  };

  return (
    <div className="analysis-page">
      <Navbar />
      
      <div className="analysis-container">
        <div className="left-section">
          <div className="input-container">
            <h3>SNAP A PHOTO:</h3>
            <img src={snapPhotoIcon} alt="Snap Photo" className="icon" />
          </div>

          <div className="input-container">
            <h3>ATTACH A FILE:</h3>
            <UploadComponent onFileChange={handleFileChange} />
          </div>

          <button className="analyze-button">ANALYZE</button>
        </div>

        <div className="right-section">
          <div className="output-box consumption-recommendation">
            <h3>CONSUMPTION RECOMMENDATION:</h3>
            <p>{analysisResult ? analysisResult.recommendation : 'Awaiting input...'}</p>
          </div>

          <div className="output-box concerns">
            <h3>CONCERNS:</h3>
            {analysisResult && analysisResult.concerns.length > 0 ? (
              <ul>
                {analysisResult.concerns.map((concern, index) => (
                  <li key={index}>{concern}</li>
                ))}
              </ul>
            ) : (
              <p>Awaiting input...</p>
            )}
          </div>

          <div className="output-box harmful-ingredients">
            <h3>POTENTIALLY HARMFUL/UNHEALTHY INGREDIENTS:</h3>
            {analysisResult && analysisResult.harmfulIngredients.length > 0 ? (
              <ul>
                {analysisResult.harmfulIngredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            ) : (
              <p>Awaiting input...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalysisPage;
