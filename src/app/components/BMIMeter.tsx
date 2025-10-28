import React from 'react';

interface BMIMeterProps {
  bmi: number;
  category: string;
  age?: number;
  percentile?: number | null;
}

export default function BMIMeter({ bmi, category, age, percentile }: BMIMeterProps) {
  const isChild = age !== undefined && !Number.isNaN(age) && age >= 2 && age < 20;

  // Color palette
  const getColors = () => {
    if (category.includes('Severe') || category.includes('Class III')) return { main: '#dc2626', light: '#fee2e2', dark: '#991b1b' };
    if (category.includes('Moderate') || category.includes('Class II')) return { main: '#ea580c', light: '#ffedd5', dark: '#9a3412' };
    if (category.includes('Mild') || category.includes('Class I') || category.includes('At risk')) return { main: '#f59e0b', light: '#fef3c7', dark: '#92400e' };
    if (category.includes('Normal') || category.includes('Healthy')) return { main: '#16a34a', light: '#dcfce7', dark: '#166534' };
    if (category.includes('Overweight') && !category.includes('At risk') && !category.includes('Class')) return { main: '#dc2626', light: '#fee2e2', dark: '#991b1b' };
    if (category.includes('Underweight')) return { main: '#f59e0b', light: '#fef3c7', dark: '#92400e' };
    return { main: '#3b82f6', light: '#dbeafe', dark: '#1e40af' };
  };
  const colors = getColors();

  // Geometry helpers
  const cx = 140;
  const cy = 120;
  const r = 92;

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const arc = (startAngle: number, endAngle: number, radius: number = r) => {
    const start = polarToCartesian(cx, cy, radius, endAngle);
    const end = polarToCartesian(cx, cy, radius, startAngle);
    const large = endAngle - startAngle <= 180 ? 0 : 1;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${large} 0 ${end.x} ${end.y}`;
  };

  // Helper to get label position at specific angle
  const getLabelPosition = (angleInDegrees: number, radiusOffset: number = 110) => {
    return polarToCartesian(cx, cy, radiusOffset, angleInDegrees);
  };

  // Needle angle
  let angle = 0;

  if (isChild && percentile != null) {
    // Corrected mapping based on arc shares (of 180°):
    // 0–5%: 9°, 5–85%: 144°, 85–95%: 18°, 95–100%: 9°
    if (percentile < 5) {
      angle = -90 + (percentile / 5) * 9; // -90 → -81
    } else if (percentile < 85) {
      angle = -81 + ((percentile - 5) / 80) * 144; // -81 → 63
    } else if (percentile < 95) {
      angle = 63 + ((percentile - 85) / 10) * 18; // 63 → 81
    } else {
      angle = 81 + ((percentile - 95) / 5) * 9; // 81 → 90
    }
  } else {
    // Adults piecewise mapping aligned with arc boundaries
    // IMPORTANT: Each range maps exactly to its visual arc
    
    if (bmi < 16) {
      // Severe Thinness: BMI 10-16 → -90° to -72°
      const clampedBMI = Math.max(10, bmi);
      angle = -90 + ((clampedBMI - 10) / 6) * 18;
    } else if (bmi < 17) {
      // Moderate Thinness: BMI 16-17 → -72° to -54°
      angle = -72 + ((bmi - 16) / 1) * 18;
    } else if (bmi < 18.5) {
      // Mild Thinness: BMI 17-18.5 → -54° to -36°
      angle = -54 + ((bmi - 17) / 1.5) * 18;
    } else if (bmi < 25) {
      // Normal: BMI 18.5-25 → -36° to 36° (72° arc)
      angle = -36 + ((bmi - 18.5) / 6.5) * 72;
    } else if (bmi < 30) {
      // Overweight: BMI 25-30 → 36° to 54°
      angle = 36 + ((bmi - 25) / 5) * 18;
    } else if (bmi < 35) {
      // Obese I: BMI 30-35 → 54° to 66°
      angle = 54 + ((bmi - 30) / 5) * 12;
    } else if (bmi < 40) {
      // Obese II: BMI 35-40 → 66° to 78°
      angle = 66 + ((bmi - 35) / 5) * 12;
    } else {
      // Obese III: BMI 40+ → 78° to 90°
      const clampedBMI = Math.min(50, bmi);
      angle = 78 + ((clampedBMI - 40) / 10) * 12;
    }
  }

  const title = category.split('•')[0].trim().split('(')[0].trim();

  // Calculate positions for labels at exact arc boundaries
  const label16 = getLabelPosition(-90, 115);   // Start of gauge
  const label17 = getLabelPosition(-72, 115);   // End of severe/start of moderate thinness
  const label18_5 = getLabelPosition(-54, 115); // End of moderate/start of mild thinness
  const labelStart18_5 = getLabelPosition(-36, 115); // Start of normal range
  const label25 = getLabelPosition(36, 115);    // End of normal/start of overweight
  const label30 = getLabelPosition(54, 115);    // End of overweight/start of obese I
  const label35 = getLabelPosition(66, 115);    // End of obese I/start of obese II
  const label40 = getLabelPosition(90, 115);    // End of gauge

  return (
    <div className="relative w-[320px] max-w-full">
      <div className="relative rounded-3xl border border-gray-200 bg-white shadow-xl p-4">
        {/* Badge */}
        <div className="flex justify-center mb-2">
          <div
            className="px-5 py-2 rounded-full text-sm font-semibold border"
            style={{ background: colors.light, color: colors.dark, borderColor: colors.main }}
          >
            {title}
          </div>
        </div>

        {/* Gauge */}
        <div className="relative" style={{ height: 200 }}>
          <svg viewBox="0 0 280 160" className="w-full h-full">
            {/* Background arc */}
            <path d={arc(-90, 90)} fill="none" stroke="#e5e7eb" strokeWidth="30" strokeLinecap="round" opacity="0.35" />

            {isChild ? (
              <>
                <path d={arc(-90, -81)} fill="none" stroke="#f59e0b" strokeWidth="30" strokeLinecap="round" />
                <path d={arc(-81, 63)} fill="none" stroke="#16a34a" strokeWidth="30" strokeLinecap="round" />
                <path d={arc(63, 81)} fill="none" stroke="#eab308" strokeWidth="30" strokeLinecap="round" />
                <path d={arc(81, 90)} fill="none" stroke="#dc2626" strokeWidth="30" strokeLinecap="round" />
                
                {(() => {
                  const p5 = getLabelPosition(-81, 115);
                  const p95 = getLabelPosition(81, 115);
                  return (
                    <>
                      <text x={p5.x} y={p5.y} fontSize="12" fill="#6b7280" textAnchor="middle" fontWeight="700">5%</text>
                      <text x={p95.x} y={p95.y} fontSize="12" fill="#6b7280" textAnchor="middle" fontWeight="700">95%</text>
                    </>
                  );
                })()}
              </>
            ) : (
              <>
                {/* Gradient definitions for smooth color transitions */}
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#991b1b" />
                    <stop offset="10%" stopColor="#c2410c" />
                    <stop offset="20%" stopColor="#f59e0b" />
                    <stop offset="30%" stopColor="#16a34a" />
                    <stop offset="70%" stopColor="#16a34a" />
                    <stop offset="80%" stopColor="#eab308" />
                    <stop offset="85%" stopColor="#f87171" />
                    <stop offset="90%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#dc2626" />
                  </linearGradient>
                  
                  {/* Shadow filter */}
                  <filter id="arcShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                    <feOffset dx="0" dy="2" result="offsetblur"/>
                    <feComponentTransfer>
                      <feFuncA type="linear" slope="0.3"/>
                    </feComponentTransfer>
                    <feMerge>
                      <feMergeNode/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Adult BMI arcs with rounded ends and shadows */}
                <g filter="url(#arcShadow)">
                  {/* Severe Thinness */}
                  <path d={arc(-90, -72)} fill="none" stroke="#991b1b" strokeWidth="28" strokeLinecap="round" opacity="0.95" />
                  
                  {/* Moderate Thinness */}
                  <path d={arc(-72, -54)} fill="none" stroke="#c2410c" strokeWidth="28" strokeLinecap="round" opacity="0.95" />
                  
                  {/* Mild Thinness */}
                  <path d={arc(-54, -36)} fill="none" stroke="#f59e0b" strokeWidth="28" strokeLinecap="round" opacity="0.95" />
                  
                  {/* Normal Weight - Larger and more prominent */}
                  <path d={arc(-36, 36)} fill="none" stroke="#16a34a" strokeWidth="32" strokeLinecap="round" opacity="1" />
                  
                  {/* Overweight */}
                  <path d={arc(36, 54)} fill="none" stroke="#eab308" strokeWidth="28" strokeLinecap="round" opacity="0.95" />
                  
                  {/* Obese Class I */}
                  <path d={arc(54, 66)} fill="none" stroke="#f87171" strokeWidth="28" strokeLinecap="round" opacity="0.95" />
                  
                  {/* Obese Class II */}
                  <path d={arc(66, 78)} fill="none" stroke="#ef4444" strokeWidth="28" strokeLinecap="round" opacity="0.95" />
                  
                  {/* Obese Class III */}
                  <path d={arc(78, 90)} fill="none" stroke="#dc2626" strokeWidth="28" strokeLinecap="round" opacity="0.95" />
                </g>

                {/* Tick marks at boundaries for better readability */}
                {[-90, -72, -54, -36, 36, 54, 66, 78, 90].map((tickAngle) => {
                  const tickStart = polarToCartesian(cx, cy, r - 18, tickAngle);
                  const tickEnd = polarToCartesian(cx, cy, r - 28, tickAngle);
                  return (
                    <line
                      key={tickAngle}
                      x1={tickStart.x}
                      y1={tickStart.y}
                      x2={tickEnd.x}
                      y2={tickEnd.y}
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      opacity="0.8"
                    />
                  );
                })}

                {/* Labels with better styling */}
                <text x={label16.x} y={label16.y + 8} fontSize="12" fill="#374151" textAnchor="middle" fontWeight="700">16</text>
                <text x={label17.x} y={label17.y + 2} fontSize="11" fill="#6b7280" textAnchor="middle" fontWeight="600">17</text>
                <text x={label18_5.x} y={label18_5.y - 2} fontSize="12" fill="#374151" textAnchor="middle" fontWeight="700">18.5</text>
                <text x={label25.x} y={label25.y - 2} fontSize="13" fill="#16a34a" textAnchor="middle" fontWeight="800">25</text>
                <text x={label30.x} y={label30.y + 2} fontSize="12" fill="#374151" textAnchor="middle" fontWeight="700">30</text>
                <text x={label35.x} y={label35.y + 5} fontSize="11" fill="#6b7280" textAnchor="middle" fontWeight="600">35</text>
                <text x={label40.x} y={label40.y + 8} fontSize="12" fill="#374151" textAnchor="middle" fontWeight="700">40</text>
              </>
            )}

            {/* Enhanced needle base with glow effect */}
            <defs>
              <radialGradient id="baseGlow">
                <stop offset="0%" stopColor="white" />
                <stop offset="70%" stopColor="#f3f4f6" />
                <stop offset="100%" stopColor="#e5e7eb" />
              </radialGradient>
              <filter id="needleShadow">
                <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.3"/>
              </filter>
            </defs>

            {/* Outer ring for base */}
            <circle cx={cx} cy={cy} r="18" fill="url(#baseGlow)" stroke="#d1d5db" strokeWidth="2" opacity="0.8" />
            <circle cx={cx} cy={cy} r="14" fill="white" stroke="#e5e7eb" strokeWidth="3" />
            
            {/* Needle group with enhanced shadow */}
            <g
              filter="url(#needleShadow)"
              style={{
                transformOrigin: `${cx}px ${cy}px`,
                transform: `rotate(${angle}deg)`,
                transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              {/* Needle body with gradient */}
              <defs>
                <linearGradient id="needleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={colors.main} />
                  <stop offset="100%" stopColor={colors.dark} />
                </linearGradient>
              </defs>
              
              {/* Main needle shape */}
              <path 
                d={`M ${cx - 4} ${cy} L ${cx} ${cy - 78} L ${cx + 4} ${cy} Z`} 
                fill="url(#needleGradient)"
                stroke={colors.dark}
                strokeWidth="1.5"
              />
              
              {/* Needle tip highlight */}
              <circle cx={cx} cy={cy - 78} r="3.5" fill={colors.main} stroke="white" strokeWidth="1.5" />
              
              {/* Needle center with metallic effect */}
              <circle cx={cx} cy={cy} r="9" fill={colors.main} stroke="white" strokeWidth="2.5" />
              <circle cx={cx} cy={cy} r="6" fill="white" opacity="0.5" />
              <circle cx={cx} cy={cy} r="3" fill={colors.main} opacity="0.8" />
            </g>
          </svg>
        </div>

        {/* Value card */}
        <div className="mt-3 bg-white rounded-xl border border-gray-200 shadow-md p-4 text-center">
          {isChild && percentile != null ? (
            <>
              <div className="text-xs font-semibold text-gray-500 tracking-wide">Percentile</div>
              <div className="text-4xl font-extrabold" style={{ color: colors.main }}>{percentile.toFixed(1)}%</div>
              <div className="text-sm text-gray-600 mt-1">BMI: <span className="font-semibold" style={{ color: colors.main }}>{bmi}</span> kg/m²</div>
            </>
          ) : (
            <>
              <div className="text-xs font-semibold text-gray-500 tracking-wide">BMI</div>
              <div className="text-5xl font-extrabold" style={{ color: colors.main }}>{bmi}</div>
              <div className="text-sm text-gray-600 mt-1">kg/m²</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}