// CinematicOverlay.tsx
import React from 'react';

interface CinematicOverlayProps {
  isActive: boolean;
}

const CinematicOverlay: React.FC<CinematicOverlayProps> = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '1920px',
          height: '1080px',
          transform: 'translate(-50%, -50%)',
          zIndex: 9998,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-30px',
            left: '0',
            width: '100%',
            height: 'calc(20% + 10px)',
            borderTop: '5px solid black',
            backgroundColor: '#141414',
            boxSizing: 'border-box',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-30px',
            left: '0',
            width: '100%',
            height: 'calc(20% + 10px)',
            borderBottom: '5px solid black',
            backgroundColor: '#141414',
            boxSizing: 'border-box',
          }}
        />
      </div>
    </div>
  );
};

export default CinematicOverlay;
