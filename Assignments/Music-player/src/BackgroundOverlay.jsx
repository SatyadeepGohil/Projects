import { useState, useEffect } from "react";

function BackgroundOverlay({ gradient, onTransitionEnd }) {
  const [visible, setVisible] = useState(true);
  const [currentGradient, setCurrentGradient] = useState('');

  useEffect(() => {
    if (!gradient || gradient === currentGradient) return;
    
    setVisible(false);

    setTimeout(() => {
      setCurrentGradient(gradient)
      setVisible(true);

      const timer = setTimeout(() => {
        onTransitionEnd?.();
        setVisible(false);
      }, 1000);

      return () => clearTimeout(timer);
    }, 50);
  }, [gradient, onTransitionEnd]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: currentGradient,
        opacity: visible ? 1 : 0,
        transition: 'opacity 1s ease-in-out',
        pointerEvents: 'none',
        zIndex: -1,
      }}
    />
  );
}

export default BackgroundOverlay;