import React, { useState, useEffect } from 'react';

// Theme definitions
const themes = {
  light: {
    // Main backgrounds
    pageBg: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 50%, #f5f7fa 100%)',
    cardBg: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    darkCardBg: '#ffffff',
    codeBg: '#f6f8fa',
    headerBg: 'linear-gradient(90deg, transparent, rgba(13, 148, 136, 0.1), transparent)',
    contentBg: 'rgba(0,0,0,0.02)',

    // Text colors
    textPrimary: '#1a1a2a',
    textSecondary: '#4a5568',
    textMuted: '#718096',
    textFaint: '#a0aec0',
    textOnDark: '#1a1a2a',

    // Borders
    border: '#e2e8f0',
    borderLight: '#edf2f7',

    // Accent colors (adjusted for light bg visibility)
    cyan: '#0d9488',
    yellow: '#d97706',
    red: '#dc2626',
    purple: '#7c3aed',
    green: '#059669',

    // Accent with transparency
    cyanBg: 'rgba(13, 148, 136, 0.1)',
    yellowBg: 'rgba(217, 119, 6, 0.1)',
    redBg: 'rgba(220, 38, 38, 0.1)',
    purpleBg: 'rgba(124, 58, 237, 0.1)',
    greenBg: 'rgba(5, 150, 105, 0.1)',

    // SVG/diagram
    svgBg: '#f8fafc',
    gridLine: '#cbd5e1',
    axisLine: '#94a3b8',

    // Wire colors
    wireGradientStart: '#94a3b8',
    wireGradientMid: '#cbd5e1',
    wireGradientEnd: '#e2e8f0',
    signalWire: '#64748b',
    wireTextColor: '#1e293b',

    // Special
    beamDot: '#0d9488',
    legendBg: '#f8fafc',
  },
  dark: {
    // Current dark theme colors
    pageBg: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%)',
    cardBg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    darkCardBg: '#0d1117',
    codeBg: '#0d1117',
    headerBg: 'linear-gradient(90deg, transparent, rgba(78, 205, 196, 0.1), transparent)',
    contentBg: 'rgba(255,255,255,0.02)',

    textPrimary: '#ffffff',
    textSecondary: '#e0e0e0',
    textMuted: '#aaa',
    textFaint: '#888',
    textOnDark: '#0f0f23',

    border: '#333',
    borderLight: '#30363d',

    cyan: '#4ecdc4',
    yellow: '#ffd93d',
    red: '#ff6b6b',
    purple: '#9f7aea',
    green: '#68d391',

    cyanBg: 'rgba(78, 205, 196, 0.1)',
    yellowBg: 'rgba(255, 217, 61, 0.1)',
    redBg: 'rgba(255, 107, 107, 0.15)',
    purpleBg: 'rgba(159, 122, 234, 0.1)',
    greenBg: 'rgba(104, 211, 145, 0.1)',

    svgBg: '#0d1117',
    gridLine: '#1e3a5f',
    axisLine: '#666',

    wireGradientStart: '#4a5568',
    wireGradientMid: '#718096',
    wireGradientEnd: '#a0aec0',
    signalWire: '#e2e8f0',
    wireTextColor: '#2d3748',

    beamDot: '#4ecdc4',
    legendBg: '#0d1117',
  }
};

const SecondaryEmissionFundamentals = () => {
  const [activeTab, setActiveTab] = useState('physics');
  const [animationStep, setAnimationStep] = useState(0);
  const [showTooltip, setShowTooltip] = useState(null);
  const [biasPolarity, setBiasPolarity] = useState('positive');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = isDarkMode ? themes.dark : themes.light;

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 120);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Animated particle beam with particles going through the wire
  const renderBeamAnimation = () => {
    const particles = [];
    for (let i = 0; i < 6; i++) {
      const xPos = ((animationStep * 3 + i * 50) % 350);
      const isAtEntrySurface = xPos > 185 && xPos < 195;
      const isInsideWire = xPos >= 195 && xPos <= 225;
      const isAtExitSurface = xPos > 225 && xPos < 235;

      particles.push(
        <circle
          key={i}
          cx={xPos + 30}
          cy={90}
          r={isAtEntrySurface || isAtExitSurface ? 5 : 4}
          fill={isInsideWire ? theme.red : theme.cyan}
          opacity={0.9}
        >
          {(isAtEntrySurface || isAtExitSurface) && (
            <animate
              attributeName="r"
              values="4;6;4"
              dur="0.2s"
              repeatCount="indefinite"
            />
          )}
        </circle>
      );
    }
    return particles;
  };

  // Isotropic secondary electrons emission from BOTH surfaces
  const renderSurfaceEmission = (surfaceX, surfaceLabel) => {
    const electrons = [];
    const baseY = 90;
    // Create isotropic emission (multiple angles)
    for (let i = 0; i < 8; i++) {
      // Angles from -90 to +90 degrees (hemisphere)
      const baseAngle = surfaceLabel === 'entry' ? 180 : 0;
      const angle = (baseAngle - 80 + i * 20 + (animationStep * 2) % 360) * (Math.PI / 180);
      const phase = (animationStep + i * 15) % 60;
      const radius = 5 + phase * 0.8;
      const x = surfaceX + Math.cos(angle) * radius;
      const y = baseY + Math.sin(angle) * radius * 0.5;
      const opacity = Math.max(0, 1 - phase / 60);

      if (opacity > 0.1) {
        electrons.push(
          <g key={`${surfaceLabel}-${i}`}>
            <circle
              cx={x}
              cy={y}
              r={2}
              fill={theme.yellow}
              opacity={opacity}
            />
            <line
              x1={surfaceX}
              y1={baseY}
              x2={x}
              y2={y}
              stroke={theme.yellow}
              strokeWidth={0.5}
              opacity={opacity * 0.4}
            />
          </g>
        );
      }
    }
    return electrons;
  };

  // Render front view of SEM grid with complete rhombus bias wires touching frame
  const renderFrontViewGrid = () => {
    const isPositive = biasPolarity === 'positive';
    const biasColor = isPositive ? theme.cyan : theme.red;

    // Animated electrons moving toward bias wires/frame
    const electrons = [];
    for (let i = 0; i < 8; i++) {
      const phase = (animationStep + i * 15) % 60;
      const angle = (i * 45) * (Math.PI / 180);
      const startR = 30;
      const endR = 75;
      const currentR = startR + (endR - startR) * (phase / 60);
      const opacity = isPositive ? Math.max(0, 1 - phase / 60) : 0.3;

      electrons.push(
        <circle
          key={`e-${i}`}
          cx={215 + Math.cos(angle) * currentR}
          cy={115 + Math.sin(angle) * currentR * 0.8}
          r={2}
          fill={theme.yellow}
          opacity={opacity}
        />
      );
    }

    return (
      <g>
        {/* Biased metallic frame (outer ring) - bias wires attach here */}
        <circle cx="215" cy="115" r="85" fill="none" stroke={biasColor} strokeWidth="10" opacity="0.5"/>
        <text x="215" y="18" fill={biasColor} fontSize="9" textAnchor="middle">BIASED FRAME ({isPositive ? '+150-700V' : '−V'})</text>

        {/* Complete rhombus bias wires - vertices TOUCH the frame */}
        <g stroke={biasColor} strokeWidth="2.5" fill="none">
          {/* Diamond with vertices touching the circular frame (radius 85) */}
          <path d="M 215 30 L 300 115 L 215 200 L 130 115 Z" />
        </g>

        {/* Connection points where bias wires attach to frame */}
        {[[215, 30], [300, 115], [215, 200], [130, 115]].map(([x, y], i) => (
          <circle key={`conn-${i}`} cx={x} cy={y} r="4" fill={biasColor} opacity="0.8"/>
        ))}

        {/* Bias label */}
        <text x="330" y="85" fill={biasColor} fontSize="10" fontWeight="bold">
          BIAS WIRES
        </text>
        <text x="330" y="98" fill={biasColor} fontSize="9">
          (rhombus)
        </text>
        <text x="330" y="111" fill={biasColor} fontSize="8">
          {isPositive ? '150-700V' : 'negative'}
        </text>

        {/* Profile measurement wires (vertical) - inside the rhombus */}
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={`wire-${i}`}
            x1={190 + i * 12}
            y1="55"
            x2={190 + i * 12}
            y2="175"
            stroke={theme.signalWire}
            strokeWidth="2"
          />
        ))}
        <text x="215" y="220" fill={theme.textMuted} fontSize="8" textAnchor="middle">SIGNAL WIRES</text>

        {/* Beam indicator (coming toward viewer) */}
        <circle cx="215" cy="115" r="25" fill={theme.cyanBg} stroke={theme.cyan} strokeWidth="2" strokeDasharray="4,2"/>
        <circle cx="215" cy="115" r="5" fill={theme.cyan}/>
        <text x="215" y="119" fill={theme.textOnDark} fontSize="10" textAnchor="middle" fontWeight="bold">&#x2299;</text>

        {/* Animated electrons moving to bias */}
        {isPositive && electrons}

        {/* Legend */}
        <g transform="translate(10, 55)">
          <rect x="0" y="0" width="100" height="90" fill={theme.legendBg} stroke={theme.borderLight} rx="4"/>
          <line x1="10" y1="18" x2="35" y2="18" stroke={theme.signalWire} strokeWidth="2"/>
          <text x="42" y="21" fill={theme.textSecondary} fontSize="9">Signal wires</text>
          <line x1="10" y1="38" x2="25" y2="28" stroke={biasColor} strokeWidth="2"/>
          <line x1="25" y1="28" x2="35" y2="38" stroke={biasColor} strokeWidth="2"/>
          <text x="42" y="36" fill={theme.textSecondary} fontSize="9">Bias wires</text>
          <circle cx="22" cy="55" r="3" fill={theme.yellow}/>
          <text x="42" y="58" fill={theme.textSecondary} fontSize="9">SE (2-5 eV)</text>
          <rect x="10" y="68" width="25" height="8" fill={biasColor} opacity="0.5" rx="2"/>
          <text x="42" y="75" fill={theme.textSecondary} fontSize="9">Biased frame</text>
        </g>
      </g>
    );
  };

  const tabContent = {
    physics: (
      <div style={{ padding: '20px' }}>
        <h3 style={{ color: theme.cyan, marginBottom: '15px', fontFamily: 'Georgia, serif' }}>
          The Physics of Secondary Emission
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{
            background: theme.cardBg,
            borderRadius: '12px',
            padding: '20px',
            border: `1px solid ${theme.cyan}`
          }}>
            <h4 style={{ color: theme.yellow, marginBottom: '10px' }}>What is Secondary Emission?</h4>
            <p style={{ lineHeight: '1.6', color: theme.textSecondary, fontSize: '14px' }}>
              When energetic charged particles (protons, ions, electrons) traverse a material,
              they transfer energy to atomic electrons through electromagnetic interactions.
              Some electrons near the <span style={{ color: theme.red, fontWeight: 'bold' }}>surface</span> gain
              enough energy to escape — these are <span style={{ color: theme.yellow, fontWeight: 'bold' }}>secondary electrons</span>.
            </p>
            <div style={{
              marginTop: '15px',
              padding: '12px',
              background: theme.redBg,
              borderRadius: '8px',
              borderLeft: `4px solid ${theme.red}`
            }}>
              <strong style={{ color: theme.red }}>Key Insight: Surface Effect!</strong>
              <p style={{ color: theme.textSecondary, fontSize: '13px', margin: '8px 0 0 0' }}>
                Secondary emission is a <strong>surface phenomenon</strong>. Electrons are emitted from:
              </p>
              <ul style={{ margin: '8px 0 0 20px', color: theme.textSecondary, fontSize: '13px' }}>
                <li><span style={{ color: theme.cyan }}>Entry surface</span> — where particles enter the material</li>
                <li><span style={{ color: theme.yellow }}>Exit surface</span> — where particles leave (if they pass through)</li>
              </ul>
            </div>
          </div>

          <div style={{
            background: theme.cardBg,
            borderRadius: '12px',
            padding: '20px',
            border: `1px solid ${theme.red}`
          }}>
            <h4 style={{ color: theme.red, marginBottom: '10px' }}>Secondary Emission Yield (SEY)</h4>
            <p style={{ lineHeight: '1.6', color: theme.textSecondary, fontSize: '14px' }}>
              The yield is defined as the ratio of emitted secondary electrons to
              incident primary particles:
            </p>
            <div style={{
              background: theme.codeBg,
              padding: '15px',
              borderRadius: '8px',
              margin: '15px 0',
              textAlign: 'center',
              fontFamily: 'Georgia, serif',
              fontSize: '20px',
              color: theme.yellow,
              border: `1px solid ${theme.borderLight}`
            }}>
              SEY = N<sub>e</sub> / N<sub>p</sub>
            </div>
            <p style={{ color: theme.textMuted, fontSize: '12px' }}>
              Where:<br/>
              • N<sub>e</sub> = number of secondary electrons emitted<br/>
              • N<sub>p</sub> = number of primary particles (protons/ions)
            </p>
            <div style={{
              marginTop: '12px',
              padding: '10px',
              background: theme.cyanBg,
              borderRadius: '6px',
              fontSize: '12px',
              color: theme.cyan
            }}>
              Typical SEY: 1.2-2.8 e⁻/proton (maximum at 80-350 keV)<br/>
              Escape depth: only 3-7 nm from surface
            </div>
          </div>
        </div>

        {/* Key Properties Box */}
        <div style={{
          marginTop: '20px',
          background: theme.cardBg,
          borderRadius: '12px',
          padding: '20px',
          border: `1px solid ${theme.purple}`
        }}>
          <h4 style={{ color: theme.purple, marginBottom: '15px' }}>Key Properties of Secondary Electrons</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
            {[
              { icon: '⚡', title: 'Low Energy', desc: 'Peak at 2-5 eV, most < 50 eV', color: theme.yellow },
              { icon: '🔄', title: 'Isotropic', desc: 'Emitted in all directions from surface', color: theme.cyan },
              { icon: '📏', title: 'Surface Effect', desc: 'Escape depth: 3-7 nm', color: theme.red },
              { icon: '📈', title: 'Proportional', desc: 'Signal ∝ beam intensity', color: theme.green }
            ].map((item, i) => (
              <div key={i} style={{
                background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                padding: '12px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>{item.icon}</div>
                <div style={{ color: item.color, fontWeight: 'bold', fontSize: '12px' }}>{item.title}</div>
                <div style={{ color: theme.textMuted, fontSize: '11px', marginTop: '4px' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Electron Energy Spectrum Graph */}
        <div style={{
          marginTop: '20px',
          background: `linear-gradient(180deg, ${theme.darkCardBg} 0%, ${isDarkMode ? '#161b22' : '#f1f5f9'} 100%)`,
          borderRadius: '12px',
          padding: '20px',
          border: `1px solid ${theme.borderLight}`
        }}>
          <h4 style={{ color: theme.textPrimary, marginBottom: '15px', textAlign: 'center' }}>
            Secondary Electron Energy Spectrum
          </h4>
          <svg width="100%" height="200" viewBox="0 0 400 200" style={{ display: 'block', margin: '0 auto' }}>
            {/* Background */}
            <rect width="400" height="200" fill={theme.svgBg}/>

            {/* Grid lines */}
            <g stroke={theme.gridLine} strokeWidth="0.5">
              {[50, 100, 150].map(y => <line key={y} x1="60" y1={y} x2="370" y2={y}/>)}
              {[110, 160, 210, 260, 310].map(x => <line key={x} x1={x} y1="30" x2={x} y2="170"/>)}
            </g>

            {/* Axes */}
            <line x1="60" y1="170" x2="370" y2="170" stroke={theme.axisLine} strokeWidth="1.5"/>
            <line x1="60" y1="170" x2="60" y2="30" stroke={theme.axisLine} strokeWidth="1.5"/>

            {/* Energy spectrum curve: dN/dE ∝ E / (E + Φ)^4, Φ ≈ 4eV */}
            <path
              d="M 60 170
                 Q 80 165 90 120
                 Q 100 60 110 45
                 Q 120 55 130 75
                 Q 150 100 180 125
                 Q 220 145 260 155
                 Q 300 162 340 167
                 L 370 168"
              fill="none"
              stroke={theme.yellow}
              strokeWidth="3"
            />

            {/* Peak marker */}
            <circle cx="110" cy="45" r="4" fill={theme.red}/>
            <line x1="110" y1="49" x2="110" y2="170" stroke={theme.red} strokeWidth="1" strokeDasharray="3,3" opacity="0.5"/>

            {/* Peak annotation */}
            <text x="115" y="40" fill={theme.red} fontSize="9" fontWeight="bold">Peak: 2-5 eV</text>

            {/* 50 eV threshold marker */}
            <line x1="260" y1="30" x2="260" y2="170" stroke={theme.purple} strokeWidth="1" strokeDasharray="4,2" opacity="0.7"/>
            <text x="265" y="45" fill={theme.purple} fontSize="8">50 eV threshold</text>
            <text x="265" y="55" fill={theme.purple} fontSize="7">(SE definition)</text>

            {/* Shaded area under curve for SE region */}
            <path
              d="M 60 170
                 Q 80 165 90 120
                 Q 100 60 110 45
                 Q 120 55 130 75
                 Q 150 100 180 125
                 Q 220 145 260 155
                 L 260 170 Z"
              fill={theme.yellow}
              opacity="0.15"
            />

            {/* X-axis labels */}
            <text x="60" y="185" fill={theme.textFaint} fontSize="9" textAnchor="middle">0</text>
            <text x="110" y="185" fill={theme.textFaint} fontSize="9" textAnchor="middle">10</text>
            <text x="160" y="185" fill={theme.textFaint} fontSize="9" textAnchor="middle">20</text>
            <text x="210" y="185" fill={theme.textFaint} fontSize="9" textAnchor="middle">30</text>
            <text x="260" y="185" fill={theme.textFaint} fontSize="9" textAnchor="middle">50</text>
            <text x="310" y="185" fill={theme.textFaint} fontSize="9" textAnchor="middle">70</text>
            <text x="360" y="185" fill={theme.textFaint} fontSize="9" textAnchor="middle">100</text>
            <text x="215" y="198" fill={theme.textMuted} fontSize="10" textAnchor="middle">Electron Energy (eV)</text>

            {/* Y-axis label */}
            <text x="25" y="100" fill={theme.textMuted} fontSize="10" textAnchor="middle" transform="rotate(-90 25 100)">dN/dE (a.u.)</text>

            {/* Formula */}
            <text x="300" y="85" fill={theme.yellow} fontSize="9" fontFamily="Georgia, serif">dN/dE ∝ E/(E+Φ)⁴</text>
            <text x="300" y="98" fill={theme.textFaint} fontSize="8">Φ = work function</text>
            <text x="300" y="110" fill={theme.textFaint} fontSize="8">(~4-5 eV for metals)</text>
          </svg>
          <div style={{
            marginTop: '10px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            fontSize: '11px'
          }}>
            <div style={{ background: theme.yellowBg, padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
              <span style={{ color: theme.yellow, fontWeight: 'bold' }}>0-5 eV</span>
              <div style={{ color: theme.textMuted }}>Peak emission</div>
            </div>
            <div style={{ background: theme.cyanBg, padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
              <span style={{ color: theme.cyan, fontWeight: 'bold' }}>5-20 eV</span>
              <div style={{ color: theme.textMuted }}>Rapid decline</div>
            </div>
            <div style={{ background: theme.purpleBg, padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
              <span style={{ color: theme.purple, fontWeight: 'bold' }}>&gt;50 eV</span>
              <div style={{ color: theme.textMuted }}>δ-rays, not SE</div>
            </div>
          </div>
        </div>

        {/* Side View: Surface Emission Animation with Upstream/Downstream Bias and E-field */}
        <div style={{
          marginTop: '20px',
          background: `linear-gradient(180deg, ${theme.darkCardBg} 0%, ${isDarkMode ? '#161b22' : '#f1f5f9'} 100%)`,
          borderRadius: '12px',
          padding: '20px',
          border: `1px solid ${theme.borderLight}`
        }}>
          <h4 style={{ color: theme.textPrimary, marginBottom: '15px', textAlign: 'center' }}>
            Side View: Bias Configuration & Electric Field
          </h4>
          <svg width="100%" height="200" viewBox="0 0 480 200" style={{ display: 'block', margin: '0 auto' }}>
            <defs>
              <pattern id="gridSide" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke={theme.gridLine} strokeWidth="0.5"/>
              </pattern>
              <linearGradient id="wireGradSide" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={theme.wireGradientStart}/>
                <stop offset="20%" stopColor={theme.wireGradientMid}/>
                <stop offset="50%" stopColor={theme.wireGradientEnd}/>
                <stop offset="80%" stopColor={theme.wireGradientMid}/>
                <stop offset="100%" stopColor={theme.wireGradientStart}/>
              </linearGradient>
            </defs>
            <rect width="480" height="200" fill="url(#gridSide)"/>

            {/* Upstream bias wire/frame plane (coplanar - same height as signal wire) */}
            <line x1="120" y1="55" x2="120" y2="145" stroke={biasPolarity === 'positive' ? theme.cyan : theme.red} strokeWidth="4"/>
            <text x="120" y="160" fill={biasPolarity === 'positive' ? theme.cyan : theme.red} fontSize="9" textAnchor="middle">BIAS</text>
            <text x="120" y="172" fill={biasPolarity === 'positive' ? theme.cyan : theme.red} fontSize="8" textAnchor="middle">(upstream)</text>
            <text x="120" y="184" fill={biasPolarity === 'positive' ? theme.cyan : theme.red} fontSize="7" textAnchor="middle">+150-700V</text>

            {/* Signal wire cross-section (same height as bias) */}
            <rect x="200" y="55" width="25" height="90" fill="url(#wireGradSide)" stroke={theme.signalWire} strokeWidth="1"/>

            {/* Entry surface highlight */}
            <line x1="200" y1="55" x2="200" y2="145" stroke={theme.cyan} strokeWidth="2"/>
            <text x="200" y="48" fill={theme.cyan} fontSize="7" textAnchor="middle">ENTRY</text>

            {/* Exit surface highlight */}
            <line x1="225" y1="55" x2="225" y2="145" stroke={theme.yellow} strokeWidth="2"/>
            <text x="225" y="48" fill={theme.yellow} fontSize="7" textAnchor="middle">EXIT</text>

            {/* Wire label */}
            <text x="212" y="97" fill={theme.wireTextColor} fontSize="8" textAnchor="middle" fontWeight="bold">Signal</text>
            <text x="212" y="108" fill={theme.wireTextColor} fontSize="8" textAnchor="middle" fontWeight="bold">Wire</text>

            {/* Downstream bias wire/frame plane (coplanar - same height as signal wire) */}
            <line x1="305" y1="55" x2="305" y2="145" stroke={biasPolarity === 'positive' ? theme.cyan : theme.red} strokeWidth="4"/>
            <text x="305" y="160" fill={biasPolarity === 'positive' ? theme.cyan : theme.red} fontSize="9" textAnchor="middle">BIAS</text>
            <text x="305" y="172" fill={biasPolarity === 'positive' ? theme.cyan : theme.red} fontSize="8" textAnchor="middle">(downstream)</text>
            <text x="305" y="184" fill={biasPolarity === 'positive' ? theme.cyan : theme.red} fontSize="7" textAnchor="middle">+150-700V</text>

            {/* Electric field lines from signal wire to bias wires ONLY (horizontal) */}
            {biasPolarity === 'positive' && (
              <g stroke={theme.cyan} strokeWidth="0.8" opacity="0.6" strokeDasharray="4,2">
                {/* Upstream E-field lines (entry surface → upstream bias) */}
                <line x1="197" y1="70" x2="125" y2="70"/>
                <line x1="197" y1="100" x2="125" y2="100"/>
                <line x1="197" y1="130" x2="125" y2="130"/>
                {/* Downstream E-field lines (exit surface → downstream bias) */}
                <line x1="228" y1="70" x2="300" y2="70"/>
                <line x1="228" y1="100" x2="300" y2="100"/>
                <line x1="228" y1="130" x2="300" y2="130"/>
              </g>
            )}

            {/* Electric field arrows pointing toward bias */}
            {biasPolarity === 'positive' && (
              <g fill={theme.cyan} opacity="0.8">
                {/* Arrows on upstream side (pointing left toward bias) */}
                <polygon points="130,70 135,67 135,73"/>
                <polygon points="130,100 135,97 135,103"/>
                <polygon points="130,130 135,127 135,133"/>
                {/* Arrows on downstream side (pointing right toward bias) */}
                <polygon points="295,70 290,67 290,73"/>
                <polygon points="295,100 290,97 290,103"/>
                <polygon points="295,130 290,127 290,133"/>
              </g>
            )}

            {/* E-field label */}
            {biasPolarity === 'positive' && (
              <g>
                <text x="160" y="88" fill={theme.cyan} fontSize="8" opacity="0.9">E-field</text>
                <text x="255" y="88" fill={theme.cyan} fontSize="8" opacity="0.9">E-field</text>
              </g>
            )}

            {/* Beam direction arrow */}
            <line x1="30" y1="100" x2="100" y2="100" stroke={theme.cyan} strokeWidth="2" strokeDasharray="5,3"/>
            <polygon points="100,95 115,100 100,105" fill={theme.cyan}/>
            <text x="65" y="88" fill={theme.cyan} fontSize="9" textAnchor="middle">Beam</text>

            {/* Beam particles */}
            {renderBeamAnimation()}

            {/* Secondary electrons from entry surface going to upstream bias */}
            {[0, 1, 2].map(i => {
              const phase = (animationStep + i * 20) % 50;
              const startX = 197;
              const endX = 125;
              const currentX = startX + (endX - startX) * (phase / 50);
              const y = 70 + i * 30;
              const opacity = biasPolarity === 'positive' ? Math.max(0, 1 - phase / 50) : 0.3;
              return (
                <circle key={`se-up-${i}`} cx={currentX} cy={y} r={2.5} fill={theme.yellow} opacity={opacity}/>
              );
            })}

            {/* Secondary electrons from exit surface going to downstream bias */}
            {[0, 1, 2].map(i => {
              const phase = (animationStep + i * 20 + 10) % 50;
              const startX = 228;
              const endX = 300;
              const currentX = startX + (endX - startX) * (phase / 50);
              const y = 70 + i * 30;
              const opacity = biasPolarity === 'positive' ? Math.max(0, 1 - phase / 50) : 0.3;
              return (
                <circle key={`se-down-${i}`} cx={currentX} cy={y} r={2.5} fill={theme.yellow} opacity={opacity}/>
              );
            })}

            {/* Beam continuation after downstream bias */}
            <line x1="310" y1="100" x2="440" y2="100" stroke={theme.cyan} strokeWidth="2" strokeDasharray="5,3" opacity="0.5"/>
            <polygon points="440,95 455,100 440,105" fill={theme.cyan} opacity="0.5"/>

            {/* Legend */}
            <g transform="translate(370, 25)">
              <rect x="0" y="0" width="100" height="70" fill={theme.legendBg} stroke={theme.borderLight} rx="4"/>
              <circle cx="15" cy="15" r="3" fill={theme.cyan}/>
              <text x="25" y="18" fill={theme.textSecondary} fontSize="8">Primary particle</text>
              <circle cx="15" cy="32" r="3" fill={theme.yellow}/>
              <text x="25" y="35" fill={theme.textSecondary} fontSize="8">SE (2-5 eV peak)</text>
              <line x1="10" y1="47" x2="20" y2="47" stroke={biasPolarity === 'positive' ? theme.cyan : theme.red} strokeWidth="3"/>
              <text x="25" y="50" fill={theme.textSecondary} fontSize="8">Bias (coplanar)</text>
              <line x1="10" y1="62" x2="20" y2="62" stroke={theme.cyan} strokeWidth="1" strokeDasharray="3,2"/>
              <text x="25" y="65" fill={theme.textSecondary} fontSize="8">E-field lines</text>
            </g>
          </svg>
          <p style={{ textAlign: 'center', color: theme.textFaint, fontSize: '12px', marginTop: '10px' }}>
            Bias wires/frame are coplanar • E-field attracts SE (few eV) horizontally to bias planes
          </p>
        </div>

        {/* Interactive Animation with Surface Emission and Bias */}
        <div style={{
          marginTop: '25px',
          background: `linear-gradient(180deg, ${theme.darkCardBg} 0%, ${isDarkMode ? '#161b22' : '#f1f5f9'} 100%)`,
          borderRadius: '12px',
          padding: '20px',
          border: `1px solid ${theme.borderLight}`
        }}>
          <h4 style={{ color: theme.textPrimary, marginBottom: '15px', textAlign: 'center' }}>
            SEM Grid Head: Front View with Bias Wires
          </h4>

          {/* Bias toggle */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '15px' }}>
            <button
              onClick={() => setBiasPolarity('positive')}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: `2px solid ${biasPolarity === 'positive' ? theme.cyan : theme.border}`,
                background: biasPolarity === 'positive' ? theme.cyanBg : 'transparent',
                color: biasPolarity === 'positive' ? theme.cyan : theme.textFaint,
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              +V Bias (Protons)
            </button>
            <button
              onClick={() => setBiasPolarity('negative')}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: `2px solid ${biasPolarity === 'negative' ? theme.red : theme.border}`,
                background: biasPolarity === 'negative' ? theme.redBg : 'transparent',
                color: biasPolarity === 'negative' ? theme.red : theme.textFaint,
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              −V Bias (H⁻)
            </button>
          </div>

          <svg width="100%" height="230" viewBox="0 0 430 230" style={{ display: 'block', margin: '0 auto' }}>
            {/* Background grid */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke={theme.gridLine} strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="430" height="230" fill="url(#grid)"/>

            {/* Front view of SEM grid with rhomboid bias */}
            {renderFrontViewGrid()}
          </svg>

          <div style={{
            marginTop: '15px',
            padding: '12px',
            background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ color: theme.textSecondary, fontSize: '13px', margin: 0 }}>
              {biasPolarity === 'positive' ? (
                <>
                  <strong style={{ color: theme.cyan }}>Positive bias</strong> on rhomboid wires attracts secondary electrons away from profile wires,
                  preventing them from returning → <strong style={{ color: theme.green }}>enhanced positive signal</strong>
                </>
              ) : (
                <>
                  <strong style={{ color: theme.red }}>Negative bias</strong> pushes secondary electrons back to profile wires,
                  suppressing SE signal → <strong style={{ color: theme.yellow }}>stripped electron signal dominates</strong> (for H⁻)
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    ),

    energy: (
      <div style={{ padding: '20px' }}>
        <h3 style={{ color: theme.red, marginBottom: '15px', fontFamily: 'Georgia, serif' }}>
          Energy Loss in Matter: The Bethe-Bloch Formula
        </h3>

        <div style={{
          background: theme.cardBg,
          borderRadius: '12px',
          padding: '25px',
          marginBottom: '20px',
          border: `1px solid ${theme.red}`
        }}>
          <h4 style={{ color: theme.yellow, marginBottom: '15px' }}>Stopping Power</h4>
          <p style={{ color: theme.textSecondary, lineHeight: '1.6', marginBottom: '15px' }}>
            As charged particles traverse matter, they lose energy primarily through
            <strong style={{ color: theme.cyan }}> electromagnetic interactions</strong> with atomic electrons.
            The rate of energy loss is described by the <strong>stopping power</strong>:
          </p>

          <div style={{
            background: theme.codeBg,
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            marginBottom: '15px'
          }}>
            <div style={{
              fontFamily: 'Georgia, serif',
              fontSize: '20px',
              color: theme.yellow,
              marginBottom: '10px'
            }}>
              S(E<sub>k</sub>) = -ρ · (dE<sub>k</sub>/dz)
            </div>
            <div style={{ color: theme.textFaint, fontSize: '12px' }}>
              Stopping power = density × energy loss per unit path length
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '20px' }}>
            {[
              { name: 'Electronic', icon: '⚛️', desc: 'Ionization & excitation of electrons', color: theme.cyan },
              { name: 'Nuclear', icon: '🔴', desc: 'Elastic scattering on nuclei', color: theme.red },
              { name: 'Radiative', icon: '💫', desc: 'Bremsstrahlung (for light particles)', color: theme.yellow }
            ].map((item, i) => (
              <div key={i} style={{
                background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                padding: '15px',
                borderRadius: '8px',
                textAlign: 'center',
                border: `1px solid ${item.color}40`
              }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.icon}</div>
                <div style={{ color: item.color, fontWeight: 'bold', fontSize: '13px' }}>{item.name}</div>
                <div style={{ color: theme.textMuted, fontSize: '11px', marginTop: '5px' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Energy Loss vs Deposition */}
        <div style={{
          background: theme.cardBg,
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          border: `1px solid ${theme.purple}`
        }}>
          <h4 style={{ color: theme.purple, marginBottom: '15px' }}>Energy Loss ≠ Energy Deposition</h4>
          <p style={{ color: theme.textSecondary, lineHeight: '1.6', fontSize: '14px' }}>
            For <strong>thin targets</strong> like SEM wires, not all lost energy stays in the material:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
            <div style={{ padding: '15px', background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderRadius: '8px' }}>
              <h5 style={{ color: theme.red, marginBottom: '8px' }}>δ-rays Escape</h5>
              <p style={{ color: theme.textMuted, fontSize: '12px' }}>
                High-energy secondary electrons (δ-rays) can exit thin wires, carrying energy away
              </p>
            </div>
            <div style={{ padding: '15px', background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderRadius: '8px' }}>
              <h5 style={{ color: theme.cyan, marginBottom: '8px' }}>Restricted Energy Loss</h5>
              <p style={{ color: theme.textMuted, fontSize: '12px' }}>
                Use W<sub>cut</sub> parameter to exclude δ-rays above threshold energy
              </p>
            </div>
          </div>
        </div>

        {/* Bragg Curve Illustration */}
        <div style={{
          background: `linear-gradient(180deg, ${theme.darkCardBg} 0%, ${isDarkMode ? '#161b22' : '#f1f5f9'} 100%)`,
          borderRadius: '12px',
          padding: '20px',
          border: `1px solid ${theme.borderLight}`
        }}>
          <h4 style={{ color: theme.textPrimary, marginBottom: '15px' }}>Energy Loss vs Depth (Bragg Curve)</h4>
          <svg width="100%" height="180" viewBox="0 0 400 180">
            <rect width="400" height="180" fill={theme.svgBg}/>
            {/* Axes */}
            <line x1="50" y1="150" x2="380" y2="150" stroke={theme.axisLine} strokeWidth="1"/>
            <line x1="50" y1="150" x2="50" y2="20" stroke={theme.axisLine} strokeWidth="1"/>

            {/* Bragg curve */}
            <path
              d="M 50 140 Q 100 138 150 130 Q 200 115 250 85 Q 300 40 320 30 Q 340 50 350 150"
              fill="none"
              stroke={theme.red}
              strokeWidth="3"
            />

            {/* Bragg peak annotation */}
            <circle cx="320" cy="30" r="5" fill={theme.yellow}/>
            <text x="325" y="25" fill={theme.yellow} fontSize="10">Bragg Peak</text>

            {/* Labels */}
            <text x="215" y="170" fill={theme.textFaint} fontSize="11" textAnchor="middle">Depth in material (z)</text>
            <text x="20" y="90" fill={theme.textFaint} fontSize="11" transform="rotate(-90 20 90)">dE/dz</text>

            {/* MIP region */}
            <rect x="100" y="125" width="100" height="30" fill={theme.cyanBg} stroke={theme.cyan} strokeDasharray="3,3" rx="4"/>
            <text x="150" y="143" fill={theme.cyan} fontSize="9" textAnchor="middle">MIP region</text>
          </svg>
          <p style={{ color: theme.textFaint, fontSize: '12px', textAlign: 'center', marginTop: '10px' }}>
            For thin targets (like SEM wires), particles typically pass through in the "MIP" (minimum ionizing) region
          </p>
        </div>
      </div>
    ),

    applications: (
      <div style={{ padding: '20px' }}>
        <h3 style={{ color: theme.cyan, marginBottom: '15px', fontFamily: 'Georgia, serif' }}>
          Beam Diagnostics Applications
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '25px' }}>
          {[
            {
              title: 'Beam Intensity',
              icon: '📊',
              desc: 'Total signal proportional to number of particles',
              formula: 'I ∝ Σ signals',
              color: theme.cyan
            },
            {
              title: 'Beam Position',
              icon: '🎯',
              desc: 'Center of mass of the signal distribution',
              formula: 'μ = Σ(x·signal) / Σ signal',
              color: theme.red
            },
            {
              title: 'Beam Profile',
              icon: '📐',
              desc: 'Transverse distribution (σ)',
              formula: 'σ² = Σ(x-μ)²·signal / Σ signal',
              color: theme.yellow
            }
          ].map((item, i) => (
            <div key={i} style={{
              background: theme.cardBg,
              borderRadius: '12px',
              padding: '20px',
              border: `2px solid ${item.color}`,
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>{item.icon}</div>
              <h4 style={{ color: item.color, marginBottom: '8px' }}>{item.title}</h4>
              <p style={{ color: theme.textSecondary, fontSize: '13px', marginBottom: '10px' }}>{item.desc}</p>
              <div style={{
                background: theme.codeBg,
                padding: '8px',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '11px',
                color: theme.yellow
              }}>
                {item.formula}
              </div>
            </div>
          ))}
        </div>

        {/* SEM Grid Schematic - correct front view with rhombus bias touching frame */}
        <div style={{
          background: `linear-gradient(180deg, ${theme.darkCardBg} 0%, ${isDarkMode ? '#161b22' : '#f1f5f9'} 100%)`,
          borderRadius: '12px',
          padding: '20px',
          border: `1px solid ${theme.borderLight}`
        }}>
          <h4 style={{ color: theme.textPrimary, marginBottom: '15px', textAlign: 'center' }}>
            SEM Grid Configuration (Front View)
          </h4>
          <svg width="100%" height="300" viewBox="0 0 500 300">
            <rect width="500" height="300" fill={theme.svgBg}/>
            {/* Biased metallic frame - bias wires attach at vertices */}
            <circle cx="250" cy="130" r="100" fill="none" stroke={theme.cyan} strokeWidth="10" opacity="0.5"/>
            <text x="250" y="15" fill={theme.cyan} fontSize="10" textAnchor="middle">BIASED FRAME (+150-700V)</text>

            {/* Complete rhombus bias wires - vertices TOUCH the frame circle */}
            <path d="M 250 30 L 350 130 L 250 230 L 150 130 Z" fill="none" stroke={theme.cyan} strokeWidth="3"/>

            {/* Connection points where bias wires attach to frame */}
            {[[250, 30], [350, 130], [250, 230], [150, 130]].map(([x, y], i) => (
              <circle key={`conn-${i}`} cx={x} cy={y} r="5" fill={theme.cyan} opacity="0.8"/>
            ))}

            <text x="390" y="80" fill={theme.cyan} fontSize="10" fontWeight="bold">BIAS WIRES</text>
            <text x="390" y="93" fill={theme.cyan} fontSize="9">(rhombus)</text>

            {/* Profile measurement wires (vertical) */}
            {[0,1,2,3,4,5,6,7,8].map((i) => (
              <g key={i}>
                <line
                  x1={210 + i * 10}
                  y1="55"
                  x2={210 + i * 10}
                  y2="205"
                  stroke={theme.signalWire}
                  strokeWidth="1.5"
                />
                <circle cx={210 + i * 10} cy="52" r="2" fill={theme.yellow}/>
                <circle cx={210 + i * 10} cy="208" r="2" fill={theme.yellow}/>
              </g>
            ))}
            <text x="250" y="222" fill={theme.textMuted} fontSize="9" textAnchor="middle">SIGNAL WIRES</text>

            {/* Beam indication (coming toward viewer) */}
            <circle cx="250" cy="130" r="30" fill={theme.cyanBg} stroke={theme.cyan} strokeWidth="2" strokeDasharray="5,3"/>
            <circle cx="250" cy="130" r="6" fill={theme.cyan}/>
            <text x="250" y="134" fill={theme.textOnDark} fontSize="10" textAnchor="middle" fontWeight="bold">&#x2299;</text>
            <text x="250" y="175" fill={theme.cyan} fontSize="10" textAnchor="middle" fontWeight="bold">BEAM</text>

            {/* Secondary electrons moving to bias wires/frame */}
            {[30, 60, 120, 150, 210, 240, 300, 330].map((angle, i) => (
              <g key={`se-${i}`}>
                <circle
                  cx={250 + Math.cos(angle * Math.PI / 180) * 55}
                  cy={130 + Math.sin(angle * Math.PI / 180) * 45}
                  r="3"
                  fill={theme.yellow}
                  opacity="0.7"
                />
              </g>
            ))}

            {/* Signal bars below */}
            {[8, 25, 55, 80, 100, 80, 55, 25, 8].map((h, i) => (
              <rect
                key={i}
                x={207 + i * 10}
                y={285 - h * 0.45}
                width="6"
                height={h * 0.45}
                fill={theme.yellow}
                opacity={0.3 + h/100 * 0.7}
                rx="2"
              />
            ))}

            {/* Gaussian fit */}
            <path
              d="M 207 284 Q 230 280 245 260 Q 255 245 265 260 Q 280 280 303 284"
              fill="none"
              stroke={theme.red}
              strokeWidth="2"
              strokeDasharray="5,3"
            />
            <text x="250" y="298" fill={theme.textFaint} fontSize="9" textAnchor="middle">Profile measurement</text>
          </svg>
          <p style={{ textAlign: 'center', color: theme.textFaint, fontSize: '12px', marginTop: '10px' }}>
            Rhombus bias wires (vertices touching frame) + biased frame collect all secondary electrons
          </p>
        </div>
      </div>
    ),

    hminus: (
      <div style={{ padding: '20px' }}>
        <h3 style={{ color: theme.yellow, marginBottom: '15px', fontFamily: 'Georgia, serif' }}>
          Special Case: H⁻ Beams (LINAC4)
        </h3>

        <div style={{
          background: theme.cardBg,
          borderRadius: '12px',
          padding: '25px',
          marginBottom: '20px',
          border: `1px solid ${theme.yellow}`
        }}>
          <h4 style={{ color: theme.red, marginBottom: '15px' }}>Multiple Signal Contributions</h4>
          <p style={{ color: theme.textSecondary, lineHeight: '1.6', marginBottom: '15px' }}>
            For H⁻ (hydrogen minus) beams, the signal is a complex balance of multiple effects:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {[
              { sign: '+', name: 'Secondary Emission', desc: 'Electrons escape surfaces → positive signal', color: theme.cyan },
              { sign: '−', name: 'Stripped Electrons', desc: 'H⁻ electrons stopped in wire', color: theme.red },
              { sign: '−', name: 'Gamma Electrons', desc: 'Photoelectric effect', color: theme.purple },
              { sign: '−', name: 'Thermionic Emission', desc: 'High temperature emission', color: theme.yellow }
            ].map((item, i) => (
              <div key={i} style={{
                background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                padding: '15px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: item.sign === '+' ? (isDarkMode ? '#22543d' : '#d1fae5') : (isDarkMode ? '#742a2a' : '#fee2e2'),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: item.sign === '+' ? theme.green : theme.red,
                  fontWeight: 'bold',
                  fontSize: '18px'
                }}>
                  {item.sign}
                </div>
                <div>
                  <div style={{ color: item.color, fontWeight: 'bold', fontSize: '13px' }}>{item.name}</div>
                  <div style={{ color: theme.textMuted, fontSize: '11px' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '20px',
            padding: '15px',
            background: theme.codeBg,
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ color: theme.yellow, fontFamily: 'Georgia, serif', fontSize: '16px' }}>
              i<sub>net</sub> = i<sub>SE</sub> + i<sub>stripped</sub> + i<sub>gamma</sub> + i<sub>thermionic</sub>
            </div>
            <div style={{ color: theme.textFaint, fontSize: '12px', marginTop: '8px' }}>
              At LINAC4, the net signal is typically <strong style={{ color: theme.red }}>negative</strong> due to stripped electron dominance
            </div>
          </div>
        </div>

        {/* Bias explanation with visual */}
        <div style={{
          background: `linear-gradient(180deg, ${theme.darkCardBg} 0%, ${isDarkMode ? '#161b22' : '#f1f5f9'} 100%)`,
          borderRadius: '12px',
          padding: '20px',
          border: `1px solid ${theme.borderLight}`
        }}>
          <h4 style={{ color: theme.textPrimary, marginBottom: '15px' }}>Bias Voltage Strategy</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ padding: '15px', background: theme.cyanBg, borderRadius: '8px' }}>
              <h5 style={{ color: theme.cyan, marginBottom: '8px' }}>Proton Beams (Standard)</h5>
              <p style={{ color: theme.textSecondary, fontSize: '13px', marginBottom: '10px' }}>
                <strong>Positive bias</strong> (+150V to +700V) on frame and rhombus wires attracts secondary electrons
              </p>
              <div style={{
                padding: '8px',
                background: theme.codeBg,
                borderRadius: '4px',
                fontSize: '12px',
                color: theme.green
              }}>
                → E-field pulls SE (2-5 eV) to bias<br/>
                → Enhanced positive wire signal
              </div>
            </div>
            <div style={{ padding: '15px', background: theme.redBg, borderRadius: '8px' }}>
              <h5 style={{ color: theme.red, marginBottom: '8px' }}>H⁻ Beams (LINAC4)</h5>
              <p style={{ color: theme.textSecondary, fontSize: '13px', marginBottom: '10px' }}>
                <strong>Negative bias</strong> pushes secondary electrons back to wires
              </p>
              <div style={{
                padding: '8px',
                background: theme.codeBg,
                borderRadius: '4px',
                fontSize: '12px',
                color: theme.red
              }}>
                → SE suppressed<br/>
                → Stripped electron signal dominates
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '15px',
            padding: '12px',
            background: theme.purpleBg,
            borderRadius: '8px',
            borderLeft: `3px solid ${theme.purple}`
          }}>
            <strong style={{ color: theme.purple }}>Why bias wires?</strong>
            <p style={{ color: theme.textSecondary, fontSize: '13px', margin: '8px 0 0 0' }}>
              Bias is applied to thin wires forming a <strong>complete rhombus</strong> (diamond shape) around the beam aperture,
              plus the metallic frame itself is biased. The bias wire planes are positioned <strong>upstream</strong> (before the entry surface)
              and <strong>downstream</strong> (after the exit surface) of the profile wires. This ensures isotropically emitted secondary
              electrons are collected by the bias field, improving signal quality and preventing crosstalk between profile wires.
            </p>
          </div>
        </div>
      </div>
    )
  };

  return (
    <div style={{
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      background: theme.pageBg,
      minHeight: '100vh',
      padding: '30px',
      color: theme.textPrimary,
      position: 'relative'
    }}>
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '10px 18px',
          borderRadius: '25px',
          border: `1px solid ${theme.border}`,
          background: theme.darkCardBg,
          color: theme.textSecondary,
          cursor: 'pointer',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s ease',
          boxShadow: isDarkMode ? 'none' : '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        {isDarkMode ? '☀️ Light' : '🌙 Dark'}
      </button>

      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '30px',
        padding: '20px',
        background: theme.headerBg,
        borderRadius: '16px'
      }}>
        <div style={{
          fontSize: '12px',
          color: theme.cyan,
          letterSpacing: '3px',
          marginBottom: '10px'
        }}>
          BEAM INSTRUMENTATION FUNDAMENTALS
        </div>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '300',
          background: `linear-gradient(90deg, ${theme.cyan}, ${theme.yellow}, ${theme.red})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '10px'
        }}>
          Secondary Emission Monitors
        </h1>
        <p style={{ color: theme.textFaint, maxWidth: '600px', margin: '0 auto' }}>
          Understanding the physics of secondary electron emission for particle accelerator beam diagnostics
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '25px',
        flexWrap: 'wrap'
      }}>
        {[
          { id: 'physics', label: 'SE Physics', color: theme.cyan },
          { id: 'energy', label: 'Energy Loss', color: theme.red },
          { id: 'applications', label: 'Applications', color: theme.yellow },
          { id: 'hminus', label: 'H⁻ Special Case', color: theme.purple }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 24px',
              borderRadius: '25px',
              border: `2px solid ${activeTab === tab.id ? tab.color : theme.border}`,
              background: activeTab === tab.id ? `${tab.color}20` : 'transparent',
              color: activeTab === tab.id ? tab.color : theme.textFaint,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              fontSize: '14px'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        background: theme.contentBg,
        borderRadius: '16px',
        border: `1px solid ${theme.border}`,
        overflow: 'hidden'
      }}>
        {tabContent[activeTab]}
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        marginTop: '30px',
        color: theme.textFaint,
        fontSize: '12px'
      }}>
        CERN Beam Instrumentation • Secondary Emission Monitor Training Material
      </div>
    </div>
  );
};

export default SecondaryEmissionFundamentals;
