import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import './profilePage.css';

function ProfilePage() {
  const [commonDiseases, setCommonDiseases] = useState({
    highBloodPressure: false,
    highCholesterol: false,
    diabetes: false,
  });

  const [foodAllergy, setFoodAllergy] = useState("");
  const [digestiveCondition, setDigestiveCondition] = useState("");
  const [kidneyDisease, setKidneyDisease] = useState("");
  const [liverCondition, setLiverCondition] = useState("");
  const [weightGoal, setWeightGoal] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedPreferences = localStorage.getItem('dietaryProfile');
    if (storedPreferences) {
      const parsedPreferences = JSON.parse(storedPreferences);
      setCommonDiseases(parsedPreferences.commonDiseases);
      setFoodAllergy(parsedPreferences.foodAllergy);
      setDigestiveCondition(parsedPreferences.digestiveCondition);
      setKidneyDisease(parsedPreferences.kidneyDisease);
      setLiverCondition(parsedPreferences.liverCondition);
      setWeightGoal(parsedPreferences.weightGoal);
    }
  }, []);

  const handleSaveChanges = () => {
    if (!foodAllergy || !digestiveCondition || !kidneyDisease || !liverCondition || !weightGoal) {
      alert("Please fill in all fields before saving.");
      return;
    }

    const profileData = {
      commonDiseases,
      foodAllergy,
      digestiveCondition,
      kidneyDisease,
      liverCondition,
      weightGoal,
    };
    localStorage.setItem("dietaryProfile", JSON.stringify(profileData));
    alert("Preferences saved successfully!");
    navigate('/analysis');
  };

  return (
    <div className="profile-page">
      <Navbar />
      <h2 className="page-title">Set up your Dietary Profile</h2>

      <div className="profile-container">
        {/* Common Diseases Section */}
        <div className="section common-diseases">
          <h3>Common Diseases</h3>
          {Object.entries(commonDiseases).map(([disease, checked]) => (
            <label key={disease} className="checkbox-label">
              <input
                type="checkbox"
                checked={checked}
                onChange={() =>
                  setCommonDiseases(prev => ({
                    ...prev,
                    [disease]: !prev[disease],
                  }))
                }
              />
              <span className="checkbox-text">
                {disease.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
            </label>
          ))}

          <h4>Food Allergies</h4>
          <select value={foodAllergy} onChange={(e) => setFoodAllergy(e.target.value)}>
            <option value="">Select an option</option>
            <option value="None">None</option>
            <option value="Lactose Intolerant">Lactose Intolerant</option>
            <option value="Gluten Free">Gluten Free</option>
            <option value="Nut Allergy">Nut Allergy</option>
          </select>
        </div>

        {/* Digestive & Other Diseases Section */}
        <div className="section digestive-conditions">
          <h3>Digestive Conditions</h3>
          <select value={digestiveCondition} onChange={(e) => setDigestiveCondition(e.target.value)}>
            <option value="">Select an option</option>
            <option value="None">None</option>
            <option value="Celiac Disease">Celiac Disease</option>
            <option value="Crohn's Disease">Crohn's Disease</option>
          </select>

          <h3>Kidney Diseases</h3>
          <select value={kidneyDisease} onChange={(e) => setKidneyDisease(e.target.value)}>
            <option value="">Select an option</option>
            <option value="None">None</option>
            <option value="Chronic Kidney Disease">Chronic Kidney Disease</option>
            <option value="Kidney Stones">Kidney Stones</option>
          </select>

          <h3>Liver Conditions</h3>
          <select value={liverCondition} onChange={(e) => setLiverCondition(e.target.value)}>
            <option value="">Select an option</option>
            <option value="None">None</option>
            <option value="Fatty liver">Fatty liver</option>
            <option value="Hepatitis">Hepatitis</option>
          </select>
        </div>

        {/* Weight Goals Section */}
        <div className="section weight-goals">
          <h3>Weight Goals</h3>
          <div className="slider-container">
            <input
              type="range"
              min="0"
              max="2"
              value={weightGoal === "Lose" ? 0 : weightGoal === "Maintain" ? 1 : weightGoal === "Gain" ? 2 : 1}
              onChange={(e) => {
                const value = e.target.value;
                setWeightGoal(value === "0" ? "Lose" : value === "1" ? "Maintain" : "Gain");
              }}
            />
            <div className="weight-labels">
              <span>Lose</span>
              <span>Maintain</span>
              <span>Gain</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-footer">
        <button className="save-button" onClick={handleSaveChanges}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;