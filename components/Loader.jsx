import React from 'react';
import '@/styles/loader.css';

const Loader = () => {
  return (
    <div className="loader">
      <div className="spinner"></div>
      <p className="loader-text">Use headphones for the best experience.</p>
    </div>
  );
};

export default Loader;
