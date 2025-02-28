import React, { useState, useEffect } from 'react';

type WheelProps = {
  segments: string[];
  segColors: string[];
  onFinished: (winner: string) => void;
  primaryColor: string;
  contrastColor: string;
  buttonText: string;
  isOnlyOnce: boolean;
  size: number;
  onSpin?: () => void;
};

export const Wheel: React.FC<WheelProps> = ({
  segments,
  segColors,
  onFinished,
  primaryColor,
  contrastColor,
  buttonText,
  isOnlyOnce,
  size,
  onSpin
}) => {
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [rotation, setRotation] = useState(0);

  const spinWheel = () => {
    if (spinning || (isOnlyOnce && disabled)) return;
    
    if (onSpin) {
      onSpin();
    }
    
    setSpinning(true);
    
    // Calculate a random segment to land on
    const segmentIndex = Math.floor(Math.random() * segments.length);
    const selectedSegment = segments[segmentIndex];
    
    // Calculate degrees to rotate (adding multiple full rotations + the segment position)
    const degreesPerSegment = 360 / segments.length;
    const segmentPosition = 360 - (segmentIndex * degreesPerSegment) - (degreesPerSegment / 2);
    const fullRotations = 5 * 360; // 5 full rotations for effect
    const totalRotation = rotation + fullRotations + segmentPosition;
    
    setRotation(totalRotation);
    
    // Set winner after animation completes
    setTimeout(() => {
      setSpinning(false);
      setWinner(selectedSegment);
      onFinished(selectedSegment);
      
      if (isOnlyOnce) {
        setDisabled(true);
      }
    }, 5000); // Animation time
  };

  useEffect(() => {
    // Reset rotation counter after a complete spin to prevent giant numbers
    if (!spinning && winner) {
      const normalizedRotation = rotation % 360;
      setRotation(normalizedRotation);
    }
  }, [spinning, winner, rotation]);

  // Calculate segment styles
  const calculateSegmentStyle = (index: number) => {
    const degreesPerSegment = 360 / segments.length;
    const startAngle = index * degreesPerSegment;
    // We don't need endAngle for this implementation, so removing it
    
    return {
      position: 'absolute' as const,
      width: '50%',
      height: '50%',
      transformOrigin: 'bottom right',
      transform: `rotate(${startAngle}deg) skewY(${90 - degreesPerSegment}deg)`,
      backgroundColor: segColors[index % segColors.length],
      borderRadius: `${size / 2}px 0 0 0`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    };
  };

  return (
    <div className="relative" style={{ width: `${size}px`, height: `${size}px` }}>
      {/* Wheel */}
      <div 
        className="absolute w-full h-full rounded-full overflow-hidden border-4 border-gray-800"
        style={{ 
          transition: spinning ? 'transform 5s cubic-bezier(0.1, 0.05, 0.05, 1.0)' : 'none',
          transform: `rotate(${rotation}deg)` 
        }}
      >
        {segments.map((_, index) => (
          <div key={index} style={calculateSegmentStyle(index)} />
        ))}
      </div>
      
      {/* Center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
          style={{ 
            width: `${size * 0.3}px`, 
            height: `${size * 0.3}px`, 
            backgroundColor: primaryColor,
            color: contrastColor,
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            zIndex: 10
          }}
          onClick={spinWheel}
          aria-disabled={spinning || (isOnlyOnce && disabled)}
        >
          <span className="font-bold text-center">
            {buttonText}
          </span>
        </div>
      </div>
      
      {/* Winner indicator triangle */}
      <div 
        className="absolute"
        style={{
          top: 0,
          left: '50%',
          width: 0,
          height: 0,
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderTop: `15px solid ${primaryColor}`,
          transform: 'translateX(-50%)',
          zIndex: 5
        }}
      />
    </div>
  );
};