import React from 'react';
import '@/styles/loader.css';

const Loader = ({ loadingProgress }) => {
  return (
    <div className="custom-loader">
      <div className="loader-content">
        <div className="loader-spinner"></div>
        <div className="loader-progress">Loading Video: {loadingProgress}%</div>
        <div
          className="loader-progress-bar"
          style={{
            width: `${loadingProgress}%`,
            height: '4px',
            backgroundColor: 'white',
            transition: 'width 0.3s ease-in-out',
          }}
        ></div>
      </div>
    </div>
  );
};

export default Loader;
