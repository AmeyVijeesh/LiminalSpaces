import React from 'react';
import '@/styles/loader.css';

const LoadingScreen = ({ videoFullyLoaded, loadingProgress, loadingPhase }) => (
  <div className={`loading-screen ${videoFullyLoaded ? 'fade-out' : ''}`}>
    <div className="loading-content">
      <div className="loading-spinner">
        <div className="spinner-circle"></div>
      </div>
      <div className="loading-text">
        <h2>{loadingPhase}</h2>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
        <p>{loadingProgress.toFixed(1)}% done.</p>
        <br />
        <br />
        <p>Headphones Recommended.</p>
      </div>
    </div>
  </div>
);
export default LoadingScreen;
