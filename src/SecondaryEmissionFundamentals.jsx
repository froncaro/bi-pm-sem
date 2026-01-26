import React, { useState, useEffect } from 'react';

const SecondaryEmissionFundamentals = () => {
  const [activeTab, setActiveTab] = useState('physics');
  const [animationStep, setAnimationStep] = useState(0);
  const [showTooltip, setShowTooltip] = useState(null);
  const [biasPolarity, setBiasPolarity] = useState('positive');

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
          fill={isInsideWire ? "#ff6b6b" : "#4ecdc4"}
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
              fill="#ffd93d"
              opacity={opacity}
            />
            <line
              x1={surfaceX}
              y1={baseY}
              x2={x}
              y2={y}
              stroke="#ffd93d"
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
    const biasColor = isPositive ? '#4ecdc4' : '#ff6b6b';
    
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
          fill="#ffd93d"
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
            stroke="#e2e8f0"
            strokeWidth="2"
          />
        ))}
        <text x="215" y="220" fill="#9ca3af" fontSize="8" textAnchor="middle">SIGNAL WIRES</text>
        
        {/* Beam indicator (coming toward viewer) */}
        <circle cx="215" cy="115" r="25" fill="rgba(78,205,196,0.2)" stroke="#4ecdc4" strokeWidth="2" strokeDasharray="4,2"/>
        <circle cx="215" cy="115" r="5" fill="#4ecdc4"/>
        <text x="215" y="119" fill="#0f0f23" fontSize="10" textAnchor="middle" fontWeight="bold">⊙</text>
        
        {/* Animated electrons moving to bias */}
        {isPositive && electrons}
        
        {/* Legend */}
        <g transform="translate(10, 55)">
          <rect x="0" y="0" width="100" height="90" fill="#0d1117" stroke="#30363d" rx="4"/>
          <line x1="10" y1="18" x2="35" y2="18" stroke="#e2e8f0" strokeWidth="2"/>
          <text x="42" y="21" fill="#e0e0e0" fontSize="9">Signal wires</text>
          <line x1="10" y1="38" x2="25" y2="28" stroke={biasColor} strokeWidth="2"/>
          <line x1="25" y1="28" x2="35" y2="38" stroke={biasColor} strokeWidth="2"/>
          <text x="42" y="36" fill="#e0e0e0" fontSize="9">Bias wires</text>
          <circle cx="22" cy="55" r="3" fill="#ffd93d"/>
          <text x="42" y="58" fill="#e0e0e0" fontSize="9">SE (2-5 eV)</text>
          <rect x="10" y="68" width="25" height="8" fill={biasColor} opacity="0.5" rx="2"/>
          <text x="42" y="75" fill="#e0e0e0" fontSize="9">Biased frame</text>
        </g>
      </g>
    );
  };

  const tabContent = {
    physics: (
      <div style={{ padding: '20px' }}>
        <h3 style={{ color: '#4ecdc4', marginBottom: '15px', fontFamily: 'Georgia, serif' }}>
          The Physics of Secondary Emission
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #4ecdc4'
          }}>
            <h4 style={{ color: '#ffd93d', marginBottom: '10px' }}>🔬 What is Secondary Emission?</h4>
            <p style={{ lineHeight: '1.6', color: '#e0e0e0', fontSize: '14px' }}>
              When energetic charged particles (protons, ions, electrons) traverse a material, 
              they transfer energy to atomic electrons through electromagnetic interactions. 
              Some electrons near the <span style={{ color: '#ff6b6b', fontWeight: 'bold' }}>surface</span> gain 
              enough energy to escape — these are <span style={{ color: '#ffd93d', fontWeight: 'bold' }}>secondary electrons</span>.
            </p>
            <div style={{ 
              marginTop: '15px', 
              padding: '12px', 
              background: 'rgba(255, 107, 107, 0.15)',
              borderRadius: '8px',
              borderLeft: '4px solid #ff6b6b'
            }}>
              <strong style={{ color: '#ff6b6b' }}>⚠️ Key Insight: Surface Effect!</strong>
              <p style={{ color: '#e0e0e0', fontSize: '13px', margin: '8px 0 0 0' }}>
                Secondary emission is a <strong>surface phenomenon</strong>. Electrons are emitted from:
              </p>
              <ul style={{ margin: '8px 0 0 20px', color: '#e0e0e0', fontSize: '13px' }}>
                <li><span style={{ color: '#4ecdc4' }}>Entry surface</span> — where particles enter the material</li>
                <li><span style={{ color: '#ffd93d' }}>Exit surface</span> — where particles leave (if they pass through)</li>
              </ul>
            </div>
          </div>

          <div style={{ 
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #ff6b6b'
          }}>
            <h4 style={{ color: '#ff6b6b', marginBottom: '10px' }}>📊 Secondary Emission Yield (SEY)</h4>
            <p style={{ lineHeight: '1.6', color: '#e0e0e0', fontSize: '14px' }}>
              The yield is defined as the ratio of emitted secondary electrons to 
              incident primary particles:
            </p>
            <div style={{
              background: '#0d1117',
              padding: '15px',
              borderRadius: '8px',
              margin: '15px 0',
              textAlign: 'center',
              fontFamily: 'Georgia, serif',
              fontSize: '20px',
              color: '#ffd93d',
              border: '1px solid #ffd93d40'
            }}>
              SEY = N<sub>e</sub> / N<sub>p</sub>
            </div>
            <p style={{ color: '#aaa', fontSize: '12px' }}>
              Where:<br/>
              • N<sub>e</sub> = number of secondary electrons emitted<br/>
              • N<sub>p</sub> = number of primary particles (protons/ions)
            </p>
            <div style={{ 
              marginTop: '12px', 
              padding: '10px', 
              background: 'rgba(78, 205, 196, 0.1)',
              borderRadius: '6px',
              fontSize: '12px',
              color: '#4ecdc4'
            }}>
              💡 Typical SEY: 1.2-2.8 e⁻/proton (maximum at 80-350 keV)<br/>
              📏 Escape depth: only 3-7 nm from surface
            </div>
          </div>
        </div>

        {/* Key Properties Box */}
        <div style={{ 
          marginTop: '20px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #9f7aea'
        }}>
          <h4 style={{ color: '#9f7aea', marginBottom: '15px' }}>🎯 Key Properties of Secondary Electrons</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
            {[
              { icon: '⚡', title: 'Low Energy', desc: 'Peak at 2-5 eV, most < 50 eV', color: '#ffd93d' },
              { icon: '🔄', title: 'Isotropic', desc: 'Emitted in all directions from surface', color: '#4ecdc4' },
              { icon: '📏', title: 'Surface Effect', desc: 'Escape depth: 3-7 nm', color: '#ff6b6b' },
              { icon: '📈', title: 'Proportional', desc: 'Signal ∝ beam intensity', color: '#68d391' }
            ].map((item, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '12px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>{item.icon}</div>
                <div style={{ color: item.color, fontWeight: 'bold', fontSize: '12px' }}>{item.title}</div>
                <div style={{ color: '#aaa', fontSize: '11px', marginTop: '4px' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Electron Energy Spectrum Graph */}
        <div style={{ 
          marginTop: '20px',
          background: 'linear-gradient(180deg, #0d1117 0%, #161b22 100%)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #30363d'
        }}>
          <h4 style={{ color: '#fff', marginBottom: '15px', textAlign: 'center' }}>
            📊 Secondary Electron Energy Spectrum
          </h4>
          <svg width="100%" height="200" viewBox="0 0 400 200" style={{ display: 'block', margin: '0 auto' }}>
            {/* Background */}
            <rect width="400" height="200" fill="#0d1117"/>
            
            {/* Grid lines */}
            <g stroke="#1e3a5f" strokeWidth="0.5">
              {[50, 100, 150].map(y => <line key={y} x1="60" y1={y} x2="370" y2={y}/>)}
              {[110, 160, 210, 260, 310].map(x => <line key={x} x1={x} y1="30" x2={x} y2="170"/>)}
            </g>
            
            {/* Axes */}
            <line x1="60" y1="170" x2="370" y2="170" stroke="#666" strokeWidth="1.5"/>
            <line x1="60" y1="170" x2="60" y2="30" stroke="#666" strokeWidth="1.5"/>
            
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
              stroke="#ffd93d" 
              strokeWidth="3"
            />
            
            {/* Peak marker */}
            <circle cx="110" cy="45" r="4" fill="#ff6b6b"/>
            <line x1="110" y1="49" x2="110" y2="170" stroke="#ff6b6b" strokeWidth="1" strokeDasharray="3,3" opacity="0.5"/>
            
            {/* Peak annotation */}
            <text x="115" y="40" fill="#ff6b6b" fontSize="9" fontWeight="bold">Peak: 2-5 eV</text>
            
            {/* 50 eV threshold marker */}
            <line x1="260" y1="30" x2="260" y2="170" stroke="#9f7aea" strokeWidth="1" strokeDasharray="4,2" opacity="0.7"/>
            <text x="265" y="45" fill="#9f7aea" fontSize="8">50 eV threshold</text>
            <text x="265" y="55" fill="#9f7aea" fontSize="7">(SE definition)</text>
            
            {/* Shaded area under curve for SE region */}
            <path 
              d="M 60 170 
                 Q 80 165 90 120 
                 Q 100 60 110 45 
                 Q 120 55 130 75 
                 Q 150 100 180 125 
                 Q 220 145 260 155 
                 L 260 170 Z" 
              fill="#ffd93d" 
              opacity="0.15"
            />
            
            {/* X-axis labels */}
            <text x="60" y="185" fill="#888" fontSize="9" textAnchor="middle">0</text>
            <text x="110" y="185" fill="#888" fontSize="9" textAnchor="middle">10</text>
            <text x="160" y="185" fill="#888" fontSize="9" textAnchor="middle">20</text>
            <text x="210" y="185" fill="#888" fontSize="9" textAnchor="middle">30</text>
            <text x="260" y="185" fill="#888" fontSize="9" textAnchor="middle">50</text>
            <text x="310" y="185" fill="#888" fontSize="9" textAnchor="middle">70</text>
            <text x="360" y="185" fill="#888" fontSize="9" textAnchor="middle">100</text>
            <text x="215" y="198" fill="#aaa" fontSize="10" textAnchor="middle">Electron Energy (eV)</text>
            
            {/* Y-axis label */}
            <text x="25" y="100" fill="#aaa" fontSize="10" textAnchor="middle" transform="rotate(-90 25 100)">dN/dE (a.u.)</text>
            
            {/* Formula */}
            <text x="300" y="85" fill="#ffd93d" fontSize="9" fontFamily="Georgia, serif">dN/dE ∝ E/(E+Φ)⁴</text>
            <text x="300" y="98" fill="#888" fontSize="8">Φ = work function</text>
            <text x="300" y="110" fill="#888" fontSize="8">(~4-5 eV for metals)</text>
          </svg>
          <div style={{ 
            marginTop: '10px', 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '10px',
            fontSize: '11px'
          }}>
            <div style={{ background: 'rgba(255,217,61,0.1)', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
              <span style={{ color: '#ffd93d', fontWeight: 'bold' }}>0-5 eV</span>
              <div style={{ color: '#aaa' }}>Peak emission</div>
            </div>
            <div style={{ background: 'rgba(78,205,196,0.1)', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
              <span style={{ color: '#4ecdc4', fontWeight: 'bold' }}>5-20 eV</span>
              <div style={{ color: '#aaa' }}>Rapid decline</div>
            </div>
            <div style={{ background: 'rgba(159,122,234,0.1)', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
              <span style={{ color: '#9f7aea', fontWeight: 'bold' }}>&gt;50 eV</span>
              <div style={{ color: '#aaa' }}>δ-rays, not SE</div>
            </div>
          </div>
        </div>

        {/* Side View: Surface Emission Animation with Upstream/Downstream Bias and E-field */}
        <div style={{ 
          marginTop: '20px',
          background: 'linear-gradient(180deg, #0d1117 0%, #161b22 100%)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #30363d'
        }}>
          <h4 style={{ color: '#fff', marginBottom: '15px', textAlign: 'center' }}>
            🎬 Side View: Bias Configuration & Electric Field
          </h4>
          <svg width="100%" height="220" viewBox="0 0 480 220" style={{ display: 'block', margin: '0 auto' }}>
            <defs>
              <pattern id="gridSide" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e3a5f" strokeWidth="0.5"/>
              </pattern>
              <linearGradient id="wireGradSide" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4a5568"/>
                <stop offset="20%" stopColor="#718096"/>
                <stop offset="50%" stopColor="#a0aec0"/>
                <stop offset="80%" stopColor="#718096"/>
                <stop offset="100%" stopColor="#4a5568"/>
              </linearGradient>
            </defs>
            <rect width="480" height="220" fill="url(#gridSide)"/>
            
            {/* Biased frame (top and bottom bars connected to bias wires) */}
            <rect x="100" y="25" width="220" height="8" fill={biasPolarity === 'positive' ? '#4ecdc4' : '#ff6b6b'} opacity="0.5" rx="2"/>
            <rect x="100" y="167" width="220" height="8" fill={biasPolarity === 'positive' ? '#4ecdc4' : '#ff6b6b'} opacity="0.5" rx="2"/>
            <text x="210" y="18" fill={biasPolarity === 'positive' ? '#4ecdc4' : '#ff6b6b'} fontSize="8" textAnchor="middle">BIASED FRAME</text>
            
            {/* Upstream bias wire plane (rhombus edge seen from side) */}
            <line x1="130" y1="33" x2="130" y2="167" stroke={biasPolarity === 'positive' ? '#4ecdc4' : '#ff6b6b'} strokeWidth="3"/>
            <text x="130" y="185" fill={biasPolarity === 'positive' ? '#4ecdc4' : '#ff6b6b'} fontSize="8" textAnchor="middle">BIAS</text>
            <text x="130" y="195" fill={biasPolarity === 'positive' ? '#4ecdc4' : '#ff6b6b'} fontSize="7" textAnchor="middle">(upstream)</text>
            
            {/* Signal wire cross-section */}
            <rect x="200" y="55" width="25" height="90" fill="url(#wireGradSide)" stroke="#e2e8f0" strokeWidth="1"/>
            
            {/* Entry surface highlight */}
            <line x1="200" y1="55" x2="200" y2="145" stroke="#4ecdc4" strokeWidth="2"/>
            <text x="200" y="48" fill="#4ecdc4" fontSize="7" textAnchor="middle">ENTRY</text>
            
            {/* Exit surface highlight */}
            <line x1="225" y1="55" x2="225" y2="145" stroke="#ffd93d" strokeWidth="2"/>
            <text x="225" y="48" fill="#ffd93d" fontSize="7" textAnchor="middle">EXIT</text>
            
            {/* Wire label */}
            <text x="212" y="105" fill="#2d3748" fontSize="8" textAnchor="middle" fontWeight="bold">Signal</text>
            <text x="212" y="115" fill="#2d3748" fontSize="8" textAnchor="middle" fontWeight="bold">Wire</text>
            
            {/* Downstream bias wire plane */}
            <line x1="290" y1="33" x2="290" y2="167" stroke={biasPolarity === 'positive' ? '#4ecdc4' : '#ff6b6b'} strokeWidth="3"/>
            <text x="290" y="185" fill={biasPolarity === 'positive' ? '#4ecdc4' : '#ff6b6b'} fontSize="8" textAnchor="middle">BIAS</text>
            <text x="290" y="195" fill={biasPolarity === 'positive' ? '#4ecdc4' : '#ff6b6b'} fontSize="7" textAnchor="middle">(downstream)</text>
            
            {/* Electric field lines from bias to signal wire */}
            {biasPolarity === 'positive' && (
              <g stroke="#4ecdc4" strokeWidth="0.8" opacity="0.6" strokeDasharray="4,2">
                {/* Upstream E-field lines */}
                <path d="M 133 60 Q 165 65 197 70" fill="none"/>
                <path d="M 133 85 Q 165 88 197 90" fill="none"/>
                <path d="M 133 110 Q 165 108 197 105" fill="none"/>
                <path d="M 133 135 Q 165 130 197 125" fill="none"/>
                {/* Downstream E-field lines */}
                <path d="M 228 70 Q 260 65 287 60" fill="none"/>
                <path d="M 228 90 Q 260 88 287 85" fill="none"/>
                <path d="M 228 105 Q 260 108 287 110" fill="none"/>
                <path d="M 228 125 Q 260 130 287 135" fill="none"/>
                {/* E-field to frame (top/bottom) */}
                <path d="M 200 55 Q 180 45 160 33" fill="none"/>
                <path d="M 225 55 Q 245 45 265 33" fill="none"/>
                <path d="M 200 145 Q 180 155 160 167" fill="none"/>
                <path d="M 225 145 Q 245 155 265 167" fill="none"/>
              </g>
            )}
            
            {/* Electric field arrows */}
            {biasPolarity === 'positive' && (
              <g fill="#4ecdc4" opacity="0.8">
                <polygon points="197,70 192,67 192,73"/>
                <polygon points="197,105 192,102 192,108"/>
                <polygon points="228,70 233,67 233,73"/>
                <polygon points="228,105 233,102 233,108"/>
              </g>
            )}
            
            {/* E-field label */}
            {biasPolarity === 'positive' && (
              <text x="165" y="75" fill="#4ecdc4" fontSize="7" opacity="0.8">E-field</text>
            )}
            
            {/* Beam direction arrow */}
            <line x1="30" y1="100" x2="110" y2="100" stroke="#4ecdc4" strokeWidth="2" strokeDasharray="5,3"/>
            <polygon points="110,95 125,100 110,105" fill="#4ecdc4"/>
            <text x="70" y="88" fill="#4ecdc4" fontSize="9" textAnchor="middle">Beam</text>
            
            {/* Beam particles */}
            {renderBeamAnimation()}
            
            {/* Secondary electrons from entry surface going to upstream bias */}
            {[0, 1, 2].map(i => {
              const phase = (animationStep + i * 20) % 50;
              const startX = 197;
              const endX = 135;
              const currentX = startX + (endX - startX) * (phase / 50);
              const y = 70 + i * 30;
              const opacity = biasPolarity === 'positive' ? Math.max(0, 1 - phase / 50) : 0.3;
              return (
                <circle key={`se-up-${i}`} cx={currentX} cy={y} r={2} fill="#ffd93d" opacity={opacity}/>
              );
            })}
            
            {/* Secondary electrons from exit surface going to downstream bias */}
            {[0, 1, 2].map(i => {
              const phase = (animationStep + i * 20 + 10) % 50;
              const startX = 228;
              const endX = 285;
              const currentX = startX + (endX - startX) * (phase / 50);
              const y = 70 + i * 30;
              const opacity = biasPolarity === 'positive' ? Math.max(0, 1 - phase / 50) : 0.3;
              return (
                <circle key={`se-down-${i}`} cx={currentX} cy={y} r={2} fill="#ffd93d" opacity={opacity}/>
              );
            })}
            
            {/* Beam continuation after wire */}
            <line x1="295" y1="100" x2="440" y2="100" stroke="#4ecdc480" strokeWidth="2" strokeDasharray="5,3"/>
            <polygon points="440,95 455,100 440,105" fill="#4ecdc480"/>
            
            {/* Legend */}
            <g transform="translate(370, 30)">
              <rect x="0" y="0" width="100" height="75" fill="#0d1117" stroke="#30363d" rx="4"/>
              <circle cx="15" cy="15" r="3" fill="#4ecdc4"/>
              <text x="25" y="18" fill="#e0e0e0" fontSize="8">Primary particle</text>
              <circle cx="15" cy="32" r="3" fill="#ffd93d"/>
              <text x="25" y="35" fill="#e0e0e0" fontSize="8">SE (2-5 eV peak)</text>
              <line x1="10" y1="47" x2="20" y2="47" stroke={biasPolarity === 'positive' ? '#4ecdc4' : '#ff6b6b'} strokeWidth="2"/>
              <text x="25" y="50" fill="#e0e0e0" fontSize="8">Bias (150-700V)</text>
              <line x1="10" y1="62" x2="20" y2="62" stroke="#4ecdc4" strokeWidth="1" strokeDasharray="3,2"/>
              <text x="25" y="65" fill="#e0e0e0" fontSize="8">E-field lines</text>
            </g>
          </svg>
          <p style={{ textAlign: 'center', color: '#888', fontSize: '12px', marginTop: '10px' }}>
            Electric field from biased frame/wires (150-700V) attracts low-energy secondary electrons (peak 2-5 eV)
          </p>
        </div>

        {/* Interactive Animation with Surface Emission and Bias */}
        <div style={{ 
          marginTop: '25px',
          background: 'linear-gradient(180deg, #0d1117 0%, #161b22 100%)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #30363d'
        }}>
          <h4 style={{ color: '#fff', marginBottom: '15px', textAlign: 'center' }}>
            🎬 SEM Grid Head: Front View with Bias Wires
          </h4>
          
          {/* Bias toggle */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '15px' }}>
            <button
              onClick={() => setBiasPolarity('positive')}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: `2px solid ${biasPolarity === 'positive' ? '#4ecdc4' : '#444'}`,
                background: biasPolarity === 'positive' ? '#4ecdc420' : 'transparent',
                color: biasPolarity === 'positive' ? '#4ecdc4' : '#888',
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
                border: `2px solid ${biasPolarity === 'negative' ? '#ff6b6b' : '#444'}`,
                background: biasPolarity === 'negative' ? '#ff6b6b20' : 'transparent',
                color: biasPolarity === 'negative' ? '#ff6b6b' : '#888',
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
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e3a5f" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="430" height="230" fill="url(#grid)"/>
            
            {/* Front view of SEM grid with rhomboid bias */}
            {renderFrontViewGrid()}
          </svg>
          
          <div style={{ 
            marginTop: '15px', 
            padding: '12px', 
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#e0e0e0', fontSize: '13px', margin: 0 }}>
              {biasPolarity === 'positive' ? (
                <>
                  <strong style={{ color: '#4ecdc4' }}>Positive bias</strong> on rhomboid wires attracts secondary electrons away from profile wires,
                  preventing them from returning → <strong style={{ color: '#68d391' }}>enhanced positive signal</strong>
                </>
              ) : (
                <>
                  <strong style={{ color: '#ff6b6b' }}>Negative bias</strong> pushes secondary electrons back to profile wires,
                  suppressing SE signal → <strong style={{ color: '#ffd93d' }}>stripped electron signal dominates</strong> (for H⁻)
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    ),

    energy: (
      <div style={{ padding: '20px' }}>
        <h3 style={{ color: '#ff6b6b', marginBottom: '15px', fontFamily: 'Georgia, serif' }}>
          Energy Loss in Matter: The Bethe-Bloch Formula
        </h3>
        
        <div style={{ 
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '12px',
          padding: '25px',
          marginBottom: '20px',
          border: '1px solid #ff6b6b'
        }}>
          <h4 style={{ color: '#ffd93d', marginBottom: '15px' }}>⚡ Stopping Power</h4>
          <p style={{ color: '#e0e0e0', lineHeight: '1.6', marginBottom: '15px' }}>
            As charged particles traverse matter, they lose energy primarily through 
            <strong style={{ color: '#4ecdc4' }}> electromagnetic interactions</strong> with atomic electrons. 
            The rate of energy loss is described by the <strong>stopping power</strong>:
          </p>
          
          <div style={{
            background: '#0d1117',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            marginBottom: '15px'
          }}>
            <div style={{ 
              fontFamily: 'Georgia, serif', 
              fontSize: '20px', 
              color: '#ffd93d',
              marginBottom: '10px'
            }}>
              S(E<sub>k</sub>) = -ρ · (dE<sub>k</sub>/dz)
            </div>
            <div style={{ color: '#888', fontSize: '12px' }}>
              Stopping power = density × energy loss per unit path length
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '20px' }}>
            {[
              { name: 'Electronic', icon: '⚛️', desc: 'Ionization & excitation of electrons', color: '#4ecdc4' },
              { name: 'Nuclear', icon: '🔴', desc: 'Elastic scattering on nuclei', color: '#ff6b6b' },
              { name: 'Radiative', icon: '💫', desc: 'Bremsstrahlung (for light particles)', color: '#ffd93d' }
            ].map((item, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '15px',
                borderRadius: '8px',
                textAlign: 'center',
                border: `1px solid ${item.color}40`
              }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.icon}</div>
                <div style={{ color: item.color, fontWeight: 'bold', fontSize: '13px' }}>{item.name}</div>
                <div style={{ color: '#aaa', fontSize: '11px', marginTop: '5px' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Energy Loss vs Deposition */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          border: '1px solid #9f7aea'
        }}>
          <h4 style={{ color: '#9f7aea', marginBottom: '15px' }}>⚠️ Energy Loss ≠ Energy Deposition</h4>
          <p style={{ color: '#e0e0e0', lineHeight: '1.6', fontSize: '14px' }}>
            For <strong>thin targets</strong> like SEM wires, not all lost energy stays in the material:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
            <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <h5 style={{ color: '#ff6b6b', marginBottom: '8px' }}>δ-rays Escape</h5>
              <p style={{ color: '#aaa', fontSize: '12px' }}>
                High-energy secondary electrons (δ-rays) can exit thin wires, carrying energy away
              </p>
            </div>
            <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <h5 style={{ color: '#4ecdc4', marginBottom: '8px' }}>Restricted Energy Loss</h5>
              <p style={{ color: '#aaa', fontSize: '12px' }}>
                Use W<sub>cut</sub> parameter to exclude δ-rays above threshold energy
              </p>
            </div>
          </div>
        </div>

        {/* Bragg Curve Illustration */}
        <div style={{ 
          background: 'linear-gradient(180deg, #0d1117 0%, #161b22 100%)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #30363d'
        }}>
          <h4 style={{ color: '#fff', marginBottom: '15px' }}>📈 Energy Loss vs Depth (Bragg Curve)</h4>
          <svg width="100%" height="180" viewBox="0 0 400 180">
            {/* Axes */}
            <line x1="50" y1="150" x2="380" y2="150" stroke="#666" strokeWidth="1"/>
            <line x1="50" y1="150" x2="50" y2="20" stroke="#666" strokeWidth="1"/>
            
            {/* Bragg curve */}
            <path 
              d="M 50 140 Q 100 138 150 130 Q 200 115 250 85 Q 300 40 320 30 Q 340 50 350 150" 
              fill="none" 
              stroke="#ff6b6b" 
              strokeWidth="3"
            />
            
            {/* Bragg peak annotation */}
            <circle cx="320" cy="30" r="5" fill="#ffd93d"/>
            <text x="325" y="25" fill="#ffd93d" fontSize="10">Bragg Peak</text>
            
            {/* Labels */}
            <text x="215" y="170" fill="#888" fontSize="11" textAnchor="middle">Depth in material (z)</text>
            <text x="20" y="90" fill="#888" fontSize="11" transform="rotate(-90 20 90)">dE/dz</text>
            
            {/* MIP region */}
            <rect x="100" y="125" width="100" height="30" fill="#4ecdc420" stroke="#4ecdc4" strokeDasharray="3,3" rx="4"/>
            <text x="150" y="143" fill="#4ecdc4" fontSize="9" textAnchor="middle">MIP region</text>
          </svg>
          <p style={{ color: '#888', fontSize: '12px', textAlign: 'center', marginTop: '10px' }}>
            For thin targets (like SEM wires), particles typically pass through in the "MIP" (minimum ionizing) region
          </p>
        </div>
      </div>
    ),

    applications: (
      <div style={{ padding: '20px' }}>
        <h3 style={{ color: '#4ecdc4', marginBottom: '15px', fontFamily: 'Georgia, serif' }}>
          Beam Diagnostics Applications
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '25px' }}>
          {[
            { 
              title: 'Beam Intensity',
              icon: '📊',
              desc: 'Total signal proportional to number of particles',
              formula: 'I ∝ Σ signals',
              color: '#4ecdc4'
            },
            { 
              title: 'Beam Position',
              icon: '🎯',
              desc: 'Center of mass of the signal distribution',
              formula: 'μ = Σ(x·signal) / Σ signal',
              color: '#ff6b6b'
            },
            { 
              title: 'Beam Profile',
              icon: '📐',
              desc: 'Transverse distribution (σ)',
              formula: 'σ² = Σ(x-μ)²·signal / Σ signal',
              color: '#ffd93d'
            }
          ].map((item, i) => (
            <div key={i} style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '12px',
              padding: '20px',
              border: `2px solid ${item.color}`,
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>{item.icon}</div>
              <h4 style={{ color: item.color, marginBottom: '8px' }}>{item.title}</h4>
              <p style={{ color: '#e0e0e0', fontSize: '13px', marginBottom: '10px' }}>{item.desc}</p>
              <div style={{
                background: '#0d1117',
                padding: '8px',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '11px',
                color: '#ffd93d'
              }}>
                {item.formula}
              </div>
            </div>
          ))}
        </div>

        {/* SEM Grid Schematic - correct front view with rhombus bias touching frame */}
        <div style={{ 
          background: 'linear-gradient(180deg, #0d1117 0%, #161b22 100%)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #30363d'
        }}>
          <h4 style={{ color: '#fff', marginBottom: '15px', textAlign: 'center' }}>
            🔧 SEM Grid Configuration (Front View)
          </h4>
          <svg width="100%" height="300" viewBox="0 0 500 300">
            {/* Biased metallic frame - bias wires attach at vertices */}
            <circle cx="250" cy="130" r="100" fill="none" stroke="#4ecdc4" strokeWidth="10" opacity="0.5"/>
            <text x="250" y="15" fill="#4ecdc4" fontSize="10" textAnchor="middle">BIASED FRAME (+150-700V)</text>
            
            {/* Complete rhombus bias wires - vertices TOUCH the frame circle */}
            <path d="M 250 30 L 350 130 L 250 230 L 150 130 Z" fill="none" stroke="#4ecdc4" strokeWidth="3"/>
            
            {/* Connection points where bias wires attach to frame */}
            {[[250, 30], [350, 130], [250, 230], [150, 130]].map(([x, y], i) => (
              <circle key={`conn-${i}`} cx={x} cy={y} r="5" fill="#4ecdc4" opacity="0.8"/>
            ))}
            
            <text x="390" y="80" fill="#4ecdc4" fontSize="10" fontWeight="bold">BIAS WIRES</text>
            <text x="390" y="93" fill="#4ecdc4" fontSize="9">(rhombus)</text>
            
            {/* Profile measurement wires (vertical) */}
            {[0,1,2,3,4,5,6,7,8].map((i) => (
              <g key={i}>
                <line 
                  x1={210 + i * 10} 
                  y1="55" 
                  x2={210 + i * 10} 
                  y2="205" 
                  stroke="#c0c0c0" 
                  strokeWidth="1.5"
                />
                <circle cx={210 + i * 10} cy="52" r="2" fill="#ffd93d"/>
                <circle cx={210 + i * 10} cy="208" r="2" fill="#ffd93d"/>
              </g>
            ))}
            <text x="250" y="222" fill="#9ca3af" fontSize="9" textAnchor="middle">SIGNAL WIRES</text>
            
            {/* Beam indication (coming toward viewer) */}
            <circle cx="250" cy="130" r="30" fill="rgba(78,205,196,0.2)" stroke="#4ecdc4" strokeWidth="2" strokeDasharray="5,3"/>
            <circle cx="250" cy="130" r="6" fill="#4ecdc4"/>
            <text x="250" y="134" fill="#0f0f23" fontSize="10" textAnchor="middle" fontWeight="bold">⊙</text>
            <text x="250" y="175" fill="#4ecdc4" fontSize="10" textAnchor="middle" fontWeight="bold">BEAM</text>
            
            {/* Secondary electrons moving to bias wires/frame */}
            {[30, 60, 120, 150, 210, 240, 300, 330].map((angle, i) => (
              <g key={`se-${i}`}>
                <circle 
                  cx={250 + Math.cos(angle * Math.PI / 180) * 55} 
                  cy={130 + Math.sin(angle * Math.PI / 180) * 45} 
                  r="3" 
                  fill="#ffd93d"
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
                fill={`rgba(255, 217, 61, ${0.3 + h/100 * 0.7})`}
                rx="2"
              />
            ))}
            
            {/* Gaussian fit */}
            <path 
              d="M 207 284 Q 230 280 245 260 Q 255 245 265 260 Q 280 280 303 284" 
              fill="none" 
              stroke="#ff6b6b" 
              strokeWidth="2"
              strokeDasharray="5,3"
            />
            <text x="250" y="298" fill="#888" fontSize="9" textAnchor="middle">Profile measurement</text>
          </svg>
          <p style={{ textAlign: 'center', color: '#888', fontSize: '12px', marginTop: '10px' }}>
            Rhombus bias wires (vertices touching frame) + biased frame collect all secondary electrons
          </p>
        </div>
      </div>
    ),

    hminus: (
      <div style={{ padding: '20px' }}>
        <h3 style={{ color: '#ffd93d', marginBottom: '15px', fontFamily: 'Georgia, serif' }}>
          Special Case: H⁻ Beams (LINAC4)
        </h3>
        
        <div style={{ 
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '12px',
          padding: '25px',
          marginBottom: '20px',
          border: '1px solid #ffd93d'
        }}>
          <h4 style={{ color: '#ff6b6b', marginBottom: '15px' }}>⚠️ Multiple Signal Contributions</h4>
          <p style={{ color: '#e0e0e0', lineHeight: '1.6', marginBottom: '15px' }}>
            For H⁻ (hydrogen minus) beams, the signal is a complex balance of multiple effects:
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {[
              { sign: '+', name: 'Secondary Emission', desc: 'Electrons escape surfaces → positive signal', color: '#4ecdc4' },
              { sign: '−', name: 'Stripped Electrons', desc: 'H⁻ electrons stopped in wire', color: '#ff6b6b' },
              { sign: '−', name: 'Gamma Electrons', desc: 'Photoelectric effect', color: '#9f7aea' },
              { sign: '−', name: 'Thermionic Emission', desc: 'High temperature emission', color: '#ffd93d' }
            ].map((item, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.05)',
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
                  background: item.sign === '+' ? '#22543d' : '#742a2a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: item.sign === '+' ? '#68d391' : '#fc8181',
                  fontWeight: 'bold',
                  fontSize: '18px'
                }}>
                  {item.sign}
                </div>
                <div>
                  <div style={{ color: item.color, fontWeight: 'bold', fontSize: '13px' }}>{item.name}</div>
                  <div style={{ color: '#aaa', fontSize: '11px' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '20px',
            padding: '15px',
            background: '#0d1117',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#ffd93d', fontFamily: 'Georgia, serif', fontSize: '16px' }}>
              i<sub>net</sub> = i<sub>SE</sub> + i<sub>stripped</sub> + i<sub>gamma</sub> + i<sub>thermionic</sub>
            </div>
            <div style={{ color: '#888', fontSize: '12px', marginTop: '8px' }}>
              At LINAC4, the net signal is typically <strong style={{ color: '#ff6b6b' }}>negative</strong> due to stripped electron dominance
            </div>
          </div>
        </div>

        {/* Bias explanation with visual */}
        <div style={{ 
          background: 'linear-gradient(180deg, #0d1117 0%, #161b22 100%)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #30363d'
        }}>
          <h4 style={{ color: '#fff', marginBottom: '15px' }}>🔌 Bias Voltage Strategy</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ padding: '15px', background: 'rgba(78, 205, 196, 0.1)', borderRadius: '8px' }}>
              <h5 style={{ color: '#4ecdc4', marginBottom: '8px' }}>Proton Beams (Standard)</h5>
              <p style={{ color: '#e0e0e0', fontSize: '13px', marginBottom: '10px' }}>
                <strong>Positive bias</strong> (+150V to +700V) on frame and rhombus wires attracts secondary electrons
              </p>
              <div style={{ 
                padding: '8px', 
                background: '#0d1117', 
                borderRadius: '4px',
                fontSize: '12px',
                color: '#68d391'
              }}>
                → E-field pulls SE (2-5 eV) to bias<br/>
                → Enhanced positive wire signal
              </div>
            </div>
            <div style={{ padding: '15px', background: 'rgba(255, 107, 107, 0.1)', borderRadius: '8px' }}>
              <h5 style={{ color: '#ff6b6b', marginBottom: '8px' }}>H⁻ Beams (LINAC4)</h5>
              <p style={{ color: '#e0e0e0', fontSize: '13px', marginBottom: '10px' }}>
                <strong>Negative bias</strong> pushes secondary electrons back to wires
              </p>
              <div style={{ 
                padding: '8px', 
                background: '#0d1117', 
                borderRadius: '4px',
                fontSize: '12px',
                color: '#fc8181'
              }}>
                → SE suppressed<br/>
                → Stripped electron signal dominates
              </div>
            </div>
          </div>
          
          <div style={{ 
            marginTop: '15px', 
            padding: '12px', 
            background: 'rgba(159, 122, 234, 0.1)',
            borderRadius: '8px',
            borderLeft: '3px solid #9f7aea'
          }}>
            <strong style={{ color: '#9f7aea' }}>💡 Why bias wires?</strong>
            <p style={{ color: '#e0e0e0', fontSize: '13px', margin: '8px 0 0 0' }}>
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
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%)',
      minHeight: '100vh',
      padding: '30px',
      color: '#ffffff'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '30px',
        padding: '20px',
        background: 'linear-gradient(90deg, transparent, rgba(78, 205, 196, 0.1), transparent)',
        borderRadius: '16px'
      }}>
        <div style={{ 
          fontSize: '12px', 
          color: '#4ecdc4', 
          letterSpacing: '3px',
          marginBottom: '10px'
        }}>
          BEAM INSTRUMENTATION FUNDAMENTALS
        </div>
        <h1 style={{ 
          fontSize: '2.5rem',
          fontWeight: '300',
          background: 'linear-gradient(90deg, #4ecdc4, #ffd93d, #ff6b6b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '10px'
        }}>
          Secondary Emission Monitors
        </h1>
        <p style={{ color: '#888', maxWidth: '600px', margin: '0 auto' }}>
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
          { id: 'physics', label: '🔬 SE Physics', color: '#4ecdc4' },
          { id: 'energy', label: '⚡ Energy Loss', color: '#ff6b6b' },
          { id: 'applications', label: '📊 Applications', color: '#ffd93d' },
          { id: 'hminus', label: '⚛️ H⁻ Special Case', color: '#9f7aea' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 24px',
              borderRadius: '25px',
              border: `2px solid ${activeTab === tab.id ? tab.color : '#333'}`,
              background: activeTab === tab.id ? `${tab.color}20` : 'transparent',
              color: activeTab === tab.id ? tab.color : '#888',
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
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '16px',
        border: '1px solid #333',
        overflow: 'hidden'
      }}>
        {tabContent[activeTab]}
      </div>

      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '30px', 
        color: '#555',
        fontSize: '12px'
      }}>
        CERN Beam Instrumentation • Secondary Emission Monitor Training Material
      </div>
    </div>
  );
};

export default SecondaryEmissionFundamentals;
