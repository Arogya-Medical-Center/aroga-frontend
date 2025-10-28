import React from 'react';

type BMIMeterProps = {
  title: string;
  bmi: number;
  isChild: boolean;
  percentile: number;
};

export default function BMIMeter({ title, bmi, isChild, percentile }: BMIMeterProps) {
  // Convert angle (degrees) to SVG arc path
  const arc = (startAngle: number, endAngle: number) => {
    const radius = 100;
    const cx = 140; // center x
    const cy = 140; // center y
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);
    
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  // Get label position at given angle and radius
  const getLabelPosition = (angle: number, r: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: 140 + r * Math.cos(rad),
      y: 140 + r * Math.sin(rad),
    };
  };

  // Calculate needle angle based on BMI or percentile
  const getNeedleAngle = () => {
    if (isChild && percentile !== null) {
      // Map percentile 0-100 to -90° to +90°
      return -90 + (percentile / 100) * 180;
    }
    if (bmi !== null) {
      // Map BMI range (e.g., 10-40) to -90° to +90°
      const minBMI = 10;
      const maxBMI = 40;
      const clampedBMI = Math.max(minBMI, Math.min(maxBMI, bmi));
      return -90 + ((clampedBMI - minBMI) / (maxBMI - minBMI)) * 180;
    }
    return 0;
  };

  const needleAngle = getNeedleAngle();
  const needlePos = getLabelPosition(needleAngle, 95);

  return (
    <div>
      <h3>{title}</h3>
      <svg width="280" height="280">
        <circle cx="140" cy="140" r="100" fill="none" stroke="gray" strokeWidth="10" />
        <path d={arc(0, 360)} fill="none" stroke="blue" strokeWidth="10" />
        <text x={getLabelPosition(90, 10).x} y={getLabelPosition(90, 10).y} fill="black" fontSize="12">
          {bmi}
        </text>
        <text x={needlePos.x} y={needlePos.y} fill="red" fontSize="12">
          {percentile}
        </text>
      </svg>
    </div>
  );
}