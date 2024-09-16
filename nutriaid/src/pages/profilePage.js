import React, { useState } from 'react';
import Navbar from './navbar';
import './profilePage.css';

function ProfilePage() {
  const [commonDiseases, setCommonDiseases] = useState({
    highBloodPressure: false,
    highCholesterol: false,
    diabetes: false,
  });

  const [foodAllergy, setFoodAllergy] = useState("Lactose Intolerant");
  const [digestiveCondition, setDigestiveCondition] = useState("Celiac Disease");
  const [kidneyDisease, setKidneyDisease] = useState("Celiac Disease");
  const [liverCondition, setLiverCondition] = useState("Fatty liver");
  const [weightGoal, setWeightGoal] = useState("Maintain");

  const handleSaveChanges = () => {
    const profileData = {
      commonDiseases,
      foodAllergy,
      digestiveCondition,
      kidneyDisease,
      liverCondition,
      weightGoal,
    };
    localStorage.setItem("dietaryProfile", JSON.stringify(profileData));
    alert("Preferences saved locally!");
  };

  return (
    <div className="profile-page">
      <Navbar />
      <h2 className="page-title">Set up your Dietary Profile...</h2>

      <div className="profile-container">
        {/* Common Diseases Section */}
        <div className="section common-diseases">
          <h3>Common Diseases</h3>
          <label>
            <input
              type="checkbox"
              checked={commonDiseases.highBloodPressure}
              onChange={() =>
                setCommonDiseases({
                  ...commonDiseases,
                  highBloodPressure: !commonDiseases.highBloodPressure,
                })
              }
            />
            High blood pressure
          </label>
          <label>
            <input
              type="checkbox"
              checked={commonDiseases.highCholesterol}
              onChange={() =>
                setCommonDiseases({
                  ...commonDiseases,
                  highCholesterol: !commonDiseases.highCholesterol,
                })
              }
            />
            High cholesterol
          </label>
          <label>
            <input
              type="checkbox"
              checked={commonDiseases.diabetes}
              onChange={() =>
                setCommonDiseases({
                  ...commonDiseases,
                  diabetes: !commonDiseases.diabetes,
                })
              }
            />
            Diabetes
          </label>

          <div className="dropdown">
            <h4>Food Allergies</h4>
            <select value={foodAllergy} onChange={(e) => setFoodAllergy(e.target.value)}>
              <option value="Lactose Intolerant">Lactose Intolerant</option>
              <option value="Gluten Free">Gluten Free</option>
              <option value="Nut Allergy">Nut Allergy</option>
            </select>
          </div>
        </div>

        {/* Digestive & Other Diseases Section */}
        <div className="section digestive-conditions">
          <h3>Digestive</h3>
          <select value={digestiveCondition} onChange={(e) => setDigestiveCondition(e.target.value)}>
            <option value="Celiac Disease">Celiac Disease</option>
            <option value="Crohn's Disease">Crohn's Disease</option>
          </select>

          <h3>Kidney Diseases</h3>
          <select value={kidneyDisease} onChange={(e) => setKidneyDisease(e.target.value)}>
            <option value="Celiac Disease">Celiac Disease</option>
            <option value="Kidney Stones">Kidney Stones</option>
          </select>

          <h3>Liver Conditions</h3>
          <select value={liverCondition} onChange={(e) => setLiverCondition(e.target.value)}>
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
              value={weightGoal === "Lose" ? 0 : weightGoal === "Maintain" ? 1 : 2}
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

      <button className="save-button" onClick={handleSaveChanges}>
        Save Changes
      </button>
    </div>
  );
}

export default ProfilePage;
