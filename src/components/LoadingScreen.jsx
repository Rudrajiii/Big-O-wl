import React from 'react';
import BigOwlLogo from '../assets/Big(O)wl.png';
import '../styles/loading.scss';

const LoadingScreen = ({ isAnalyzing = false, message = "Check Your Code Complexity" }) => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="logo-container">
          <img src={BigOwlLogo} alt="Big(O)wl Logo" className="main-logo" />
        </div>
        <h1 className="app-name">Big<span className="animated-o">(O)</span>wl</h1>
        <div className="loading-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
        <p className="loading-text">{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
