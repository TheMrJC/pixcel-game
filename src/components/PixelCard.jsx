import React from 'react';

const PixelCard = ({ children, className = '', title }) => {
  return (
    <div className={`pixel-card ${className}`} style={{
      border: '4px solid #fff',
      padding: '24px',
      background: '#2a2a35',
      boxShadow: '8px 8px 0px 0px rgba(0,0,0,0.5)',
      position: 'relative',
      maxWidth: '600px',
      width: '100%',
      margin: '0 auto'
    }}>
      {title && (
        <div style={{
          position: 'absolute',
          top: '-16px',
          left: '20px',
          background: '#d32f2f',
          padding: '4px 12px',
          border: '2px solid white',
          color: 'white',
          textTransform: 'uppercase',
          fontSize: '12px',
          letterSpacing: '1px'
        }}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
};

export default PixelCard;
