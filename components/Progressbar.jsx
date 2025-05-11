'use client';

import React, { useState, useEffect } from 'react';

const Progressbar = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollY = window.scrollY;

      const scrollPercentage =
        (scrollY / (documentHeight - windowHeight)) * 100;
      setScrollPercentage(scrollPercentage);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div id="progress-bar" className="progress-bar">
      <div
        id="progress-fill"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          width: `${scrollPercentage}%`,
          height: '100%',
        }}
      ></div>
    </div>
  );
};

export default Progressbar;
