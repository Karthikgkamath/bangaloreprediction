import React, { useEffect, useState } from 'react';
import './animation.css';

const LandingAnimation: React.FC = () => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="landing-wrapper">
      {!showContent ? (
        <div className="magnifier-container">
          <div className="magnifier" />
          <h1 className="animated-text">Welcome to My Website</h1>
        </div>
      ) : (
        <div className="main-content">
          {/* Your actual site goes here */}
          <h2>Site Content Here</h2>
        </div>
      )}
    </div>
  );
};

export default LandingAnimation;
