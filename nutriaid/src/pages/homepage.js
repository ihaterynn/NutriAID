import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './navbar'; 
import './homepage.css'; 
import bunnyImage from '../graphics/homepage bunnis.png';

function Homepage() {
  const freaksRef = useRef(null);

  useEffect(() => {
    const typeDeleteAnimation = () => {
      const text = "Freaks";
      let direction = 'typing';
      let index = 0;
      let animationFrameId;
      
      const animate = () => {
        if (freaksRef.current) {
          if (direction === 'typing') {
            freaksRef.current.textContent = text.slice(0, index);
            index++;
            if (index > text.length) {
              direction = 'deleting';
              animationFrameId = setTimeout(animate, 2000); // Pause for 2 seconds before deleting
            } else {
              animationFrameId = setTimeout(animate, 300); // Typing speed
            }
          } else {
            index--;
            freaksRef.current.textContent = text.slice(0, index);
            if (index === 0) {
              direction = 'typing';
              animationFrameId = setTimeout(animate, 1000); // Pause for 1 second before typing again
            } else {
              animationFrameId = setTimeout(animate, 200); // Deleting speed
            }
          }
        }
      };
      
      animate();

      // Cleanup function
      return () => {
        if (animationFrameId) {
          clearTimeout(animationFrameId);
        }
      };
    };
  
    const cleanup = typeDeleteAnimation();
    return cleanup;
  }, []);

  return (
    <div className="homepage">
      <Navbar />
      <div className="hero-section-wrapper">
        <div className="animated-gradient-border"></div>
        <div className="hero-section">
          <div className="hero-content">
            <h1>Made for you Health <span ref={freaksRef}></span></h1>
            <h2>EZ Food Label Analysis</h2>
          </div>
          <div className="hero-image">
            <img src={bunnyImage} alt="Bunny" className="bunny-image" />
          </div>
        </div>
      </div>
      <div className="start-analysis">
        <Link to="/profile">
          <button className="start-button">START ANALYSIS</button>
        </Link>
      </div>
    </div>
  );
}

export default Homepage;