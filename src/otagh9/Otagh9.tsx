import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';

const FONT_TITLE = 'Lalezar, sans-serif';
const FONT_BODY = 'Vazirmatn, sans-serif';

/* لایه بافت فیلم و ویگنت سینمایی برای عمق بیشتر */
const FilmAtmosphere: React.FC<{ flashOpacity?: number }> = ({ flashOpacity = 0 }) => {
  const frame = useCurrentFrame();
  const particles = [
    { x: 180, y: 400, r: 3, speed: 1.2 },
    { x: 840, y: 520, r: 4, speed: 0.9 },
    { x: 320, y: 950, r: 2.5, speed: 1.5 },
    { x: 760, y: 1120, r: 3.5, speed: 1.1 },
    { x: 510, y: 680, r: 2, speed: 1.7 },
    { x: 920, y: 830, r: 3, speed: 0.8 },
    { x: 140, y: 1290, r: 3.5, speed: 1.3 },
  ];

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 25 }}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        {particles.map((p, idx) => {
          const dy = ((frame * p.speed + idx * 90) % 500) - 250;
          const dx = Math.sin((frame + idx * 30) / 25) * 18;
          const op = interpolate(Math.sin((frame + idx * 20) / 18), [-1, 1], [0.1, 0.45]);
          return (
            <circle
              key={idx}
              cx={p.x + dx}
              cy={p.y - dy}
              r={p.r}
              fill="#f7d794"
              opacity={op}
            />
          );
        })}
      </svg>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 48%, rgba(4,7,12,0.78) 100%)',
        }}
      />

      {flashOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#ffffff',
            opacity: flashOpacity,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

interface SubtitleProps {
  children: React.ReactNode;
  speaker?: string;
}

const Subtitle: React.FC<SubtitleProps> = ({ children, speaker }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const translateY = interpolate(frame, [0, 10], [14, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 145,
        left: 52,
        right: 52,
        textAlign: 'center',
        direction: 'rtl',
        fontFamily: FONT_BODY,
        fontWeight: 600,
        fontSize: 43,
        lineHeight: 1.65,
        color: '#ffffff',
        backgroundColor: 'rgba(7, 11, 18, 0.65)',
        backdropFilter: 'blur(6px)',
        padding: '22px 32px',
        borderRadius: 22,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 14px 35px rgba(0,0,0,0.65)',
        transform: `translateY(${translateY}px)`,
        opacity,
        zIndex: 30,
      }}
    >
      {speaker && (
        <div
          style={{
            fontSize: 28,
            color: '#ff5722',
            fontWeight: 800,
            marginBottom: 6,
          }}
        >
          {speaker}
        </div>
      )}
      {children}
    </div>
  );
};

const Highlight: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: '#f7b731', fontWeight: 800 }}>{children}</span>
);

/* صحنه ۱: نمای بیرونی هتل متروکه */
const Scene1HotelExterior: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 210], [1.1, 1], {
    extrapolateRight: 'clamp',
  });
  const navidX = interpolate(frame, [0, 210], [410, 505], {
    extrapolateRight: 'clamp',
  });
  const walkBob = Math.sin(frame / 4) * 5;
  const cameraFlash =
    frame >= 85 && frame <= 93
      ? interpolate(frame, [85, 87, 93], [0, 0.75, 0])
      : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#080e17', overflow: 'hidden' }}>
      <Audio src={staticFile('voice/otagh9/scene1_narrator.mp3')} />
      <div style={{ width: '100%', height: '100%', transform: `scale(${scale})` }}>
        <svg viewBox="0 0 1080 1920" width="1080" height="1920">
          <defs>
            <linearGradient id="nightSky1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#050911" />
              <stop offset="55%" stopColor="#0f1b2b" />
              <stop offset="100%" stopColor="#19283b" />
            </linearGradient>
            <linearGradient id="hotelFacade" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1e2a3b" />
              <stop offset="100%" stopColor="#0f1621" />
            </linearGradient>
            <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f5a623" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#f5a623" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="1080" height="1920" fill="url(#nightSky1)" />
          <ellipse cx="260" cy="310" rx="280" ry="45" fill="#182638" opacity="0.45" />
          <ellipse cx="780" cy="410" rx="320" ry="50" fill="#182638" opacity="0.35" />
          <circle cx="840" cy="290" r="64" fill="#efe6cf" opacity="0.9" />
          <circle cx="840" cy="290" r="145" fill="#efe6cf" opacity="0.07" />

          <g opacity="0.55">
            <rect x="135" y="290" width="22" height="1210" fill="#070c14" />
            <line x1="135" y1="350" x2="157" y2="410" stroke="#182436" strokeWidth="4" />
            <line x1="157" y1="410" x2="135" y2="470" stroke="#182436" strokeWidth="4" />
            <polygon points="80,330 560,210 560,238 80,360" fill="#070c14" />
            <line x1="510" y1="226" x2="510" y2="540" stroke="#0b121e" strokeWidth="5" />
            <circle cx="510" cy="565" r="28" fill="#070c14" />
          </g>

          <rect x="190" y="440" width="700" height="1060" rx="6" fill="url(#hotelFacade)" />
          <rect x="215" y="440" width="24" height="1060" fill="#141d2b" />
          <rect x="841" y="440" width="24" height="1060" fill="#141d2b" />
          <polygon points="160,440 540,300 920,440" fill="#111926" />
          <rect x="175" y="435" width="730" height="18" fill="#27364a" />

          <rect x="370" y="385" width="340" height="58" rx="8" fill="#0a0f17" stroke="#36485e" strokeWidth="4" />
          <text
            x="540"
            y="426"
            textAnchor="middle"
            fill="#ff5722"
            fontFamily={FONT_TITLE}
            fontSize="36"
            opacity="0.85"
          >
            GRAND HOTEL
          </text>

          {[540, 740, 940].map((y, rowIdx) =>
            [285, 485, 685].map((x, colIdx) => {
              const isLit = rowIdx === 1 && colIdx === 2;
              return (
                <g key={`${rowIdx}-${colIdx}`}>
                  <rect x={x - 6} y={y - 6} width="122" height="148" rx="8" fill="#101824" />
                  <rect
                    x={x}
                    y={y}
                    width="110"
                    height="136"
                    rx="5"
                    fill={isLit ? '#f5a623' : '#080d14'}
                    opacity={isLit ? 0.35 : 0.95}
                  />
                  <line x1={x + 55} y1={y} x2={x + 55} y2={y + 136} stroke="#1d293a" strokeWidth="5" />
                  <line x1={x} y1={y + 68} x2={x + 110} y2={y + 68} stroke="#1d293a" strokeWidth="5" />
                  {rowIdx === 2 && colIdx === 0 && (
                    <rect
                      x={x - 10}
                      y={y + 50}
                      width="130"
                      height="18"
                      transform={`rotate(-14, ${x + 55}, ${y + 59})`}
                      fill="#3d2b1f"
                    />
                  )}
                </g>
              );
            })
          )}

          <polygon points="390,1200 690,1200 720,1245 360,1245" fill="#233042" />
          <rect x="425" y="1245" width="230" height="255" fill="#f5a623" opacity="0.2" />
          <rect x="445" y="1255" width="190" height="245" fill="#17110e" />

          <circle cx="395" cy="1290" r="95" fill="url(#lampGlow)" />
          <circle cx="395" cy="1290" r="10" fill="#ffd166" />

          <rect x="0" y="1500" width="1080" height="420" fill="#070b12" />
          <rect x="80" y="1430" width="14" height="80" fill="#4b5563" />
          <rect x="330" y="1430" width="14" height="80" fill="#4b5563" />
          <rect x="740" y="1430" width="14" height="80" fill="#4b5563" />
          <rect x="980" y="1430" width="14" height="80" fill="#4b5563" />
          <line x1="80" y1="1445" x2="340" y2="1445" stroke="#f7b731" strokeWidth="8" strokeDasharray="24 16" />
          <line x1="740" y1="1445" x2="990" y2="1445" stroke="#f7b731" strokeWidth="8" strokeDasharray="24 16" />

          <g transform={`translate(${navidX}, ${1255 + walkBob})`}>
            <rect x="24" y="185" width="18" height="65" rx="6" fill="#161d26" />
            <rect x="52" y="185" width="18" height="65" rx="6" fill="#1e2733" />
            <rect x="-6" y="88" width="26" height="85" rx="10" fill="#2c3a4d" />
            <path d="M12,78 Q46,60 80,78 L90,195 L4,195 Z" fill="#9c4a2f" />
            <path d="M36,75 L56,75 L46,145 Z" fill="#1f2733" />
            <ellipse cx="46" cy="36" rx="25" ry="29" fill="#d9a077" />
            <path d="M20,34 C18,2 76,2 72,34 C65,20 30,20 20,34 Z" fill="#1b1615" />
            <rect x="34" y="108" width="38" height="26" rx="5" fill="#18202b" stroke="#475569" strokeWidth="2" />
            <circle cx="55" cy="121" r="10" fill="#0f172a" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="55" cy="121" r="4" fill="#38bdf8" opacity="0.7" />
          </g>
        </svg>
      </div>
      <FilmAtmosphere flashOpacity={cameraFlash} />
      <Subtitle>
        یک هتل قدیمی قرار است <Highlight>تخریب</Highlight> شود. <Highlight>نوید</Highlight>، عکاس جوان، برای تهیه آخرین تصاویر وارد ساختمان می‌شود.
      </Subtitle>
    </AbsoluteFill>
  );
};

/* صحنه ۲: راهروی متروکه و درِ اتاق ۹ */
const Scene2CorridorDoor9: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 165], [1, 1.18], {
    easing: Easing.inOut(Easing.ease),
    extrapolateRight: 'clamp',
  });
  const glowPulse = interpolate(Math.sin(frame / 8), [-1, 1], [0.25, 0.55]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#09101a', overflow: 'hidden' }}>
      <Audio src={staticFile('voice/otagh9/scene2_narrator.mp3')} />
      <div style={{ width: '100%', height: '100%', transform: `scale(${zoom})` }}>
        <svg viewBox="0 0 1080 1920" width="1080" height="1920">
          <defs>
            <linearGradient id="corridorWall2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#080e17" />
              <stop offset="100%" stopColor="#142233" />
            </linearGradient>
            <linearGradient id="door9Wood" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#33231d" />
              <stop offset="50%" stopColor="#241814" />
              <stop offset="100%" stopColor="#140d0b" />
            </linearGradient>
          </defs>

          <rect width="1080" height="1920" fill="url(#corridorWall2)" />

          <polygon points="0,0 280,350 280,1480 0,1920" fill="#0f1a28" />
          <polygon points="1080,0 800,350 800,1480 1080,1920" fill="#0f1a28" />
          <line x1="120" y1="150" x2="120" y2="1730" stroke="#18283d" strokeWidth="4" />
          <line x1="960" y1="150" x2="960" y2="1730" stroke="#18283d" strokeWidth="4" />

          <line x1="540" y1="0" x2="540" y2="190" stroke="#263345" strokeWidth="6" />
          <path d="M470,220 Q540,170 610,220 Z" fill="#1e293b" />
          <circle cx="540" cy="226" r="14" fill="#f5a623" opacity="0.25" />

          <rect x="310" y="395" width="460" height="1085" rx="10" fill="#160f0c" />
          <rect x="330" y="415" width="420" height="1050" rx="6" fill="url(#door9Wood)" stroke="#4a342b" strokeWidth="8" />

          <rect x="375" y="475" width="330" height="360" rx="4" fill="none" stroke="#1a110e" strokeWidth="8" />
          <rect x="383" y="483" width="314" height="344" rx="2" fill="none" stroke="#3d2b24" strokeWidth="3" />
          <rect x="375" y="900" width="330" height="480" rx="4" fill="none" stroke="#1a110e" strokeWidth="8" />
          <rect x="383" y="908" width="314" height="464" rx="2" fill="none" stroke="#3d2b24" strokeWidth="3" />

          <circle cx="695" cy="960" r="16" fill="#c7923e" />
          <rect x="655" y="954" width="42" height="12" rx="6" fill="#e0a94f" />

          <polygon points="330,1465 750,1465 920,1780 160,1780" fill="#f5a623" opacity={glowPulse} />
          <rect x="330" y="1461" width="420" height="7" fill="#ffd166" opacity="0.85" />

          <rect x="472" y="585" width="136" height="84" rx="12" fill="#1a120b" opacity="0.5" />
          <rect x="476" y="580" width="128" height="80" rx="10" fill="#c7923e" stroke="#f7d794" strokeWidth="3" />
          <circle cx="492" cy="620" r="4" fill="#5c4014" />
          <circle cx="588" cy="620" r="4" fill="#5c4014" />
          <text
            x="540"
            y="642"
            textAnchor="middle"
            fill="#1a120b"
            fontFamily={FONT_TITLE}
            fontSize="58"
          >
            ۹
          </text>
        </svg>
      </div>
      <FilmAtmosphere />
      <Subtitle>
        در راهرو، متوجه دری می‌شود که روی آن نوشته شده: <Highlight>اتاق ۹</Highlight>.
      </Subtitle>
    </AbsoluteFill>
  );
};

/* صحنه ۳: فلاش‌بک هشدار مدیر هتل (با دو صدا: راوی + مدیر پیر هتل) */
const Scene3ManagerWarning: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 225], [1.06, 1], { extrapolateRight: 'clamp' });
  const isManagerSpeaking = frame >= 75;
  const handShake = isManagerSpeaking ? Math.sin(frame / 2.5) * 4 : 0;
  const mouthOpen = isManagerSpeaking ? Math.abs(Math.sin(frame / 3)) * 10 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#0d1520', overflow: 'hidden' }}>
      {/* صدای راوی در ابتدا */}
      <Sequence from={0} durationInFrames={80}>
        <Audio src={staticFile('voice/otagh9/scene3_narrator.mp3')} />
      </Sequence>
      {/* صدای مدیر پیر هتل از فریم ۷۵ */}
      <Sequence from={75} durationInFrames={150}>
        <Audio src={staticFile('voice/otagh9/scene3_manager.mp3')} />
      </Sequence>

      <div style={{ width: '100%', height: '100%', transform: `scale(${scale})` }}>
        <svg viewBox="0 0 1080 1920" width="1080" height="1920">
          <defs>
            <radialGradient id="lobbyLamp" cx="50%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#f5a623" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#0b121c" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1080" height="1920" fill="#0b121c" />
          <rect width="1080" height="1920" fill="url(#lobbyLamp)" />

          <rect x="120" y="340" width="240" height="360" rx="8" fill="#151f2e" stroke="#26354a" strokeWidth="4" />
          {[400, 480, 560, 640].map((ky, i) => (
            <g key={i}>
              <circle cx="175" cy={ky} r="6" fill="#c7923e" />
              <circle cx="240" cy={ky} r="6" fill="#c7923e" />
              <circle cx="305" cy={ky} r="6" fill="#c7923e" />
            </g>
          ))}

          <g transform="translate(260, 440)">
            <path d="M85,215 C75,55 475,55 465,215 C485,255 470,330 440,350 L110,350 C80,330 65,255 85,215 Z" fill="#64748b" />
            <ellipse cx="115" cy="305" rx="18" ry="32" fill="#c4906c" />
            <ellipse cx="435" cy="305" rx="18" ry="32" fill="#c4906c" />
            <path d="M120,185 L430,185 L412,425 C395,505 155,505 138,425 Z" fill="#d4a381" />
            <path d="M195,215 Q275,205 355,215" stroke="#b07d5b" strokeWidth="4" fill="none" />
            <path d="M210,232 Q275,224 340,232" stroke="#b07d5b" strokeWidth="3" fill="none" />
            <circle cx="205" cy="295" r="25" fill="#ffffff" />
            <circle cx="205" cy="295" r="12" fill="#1e293b" />
            <circle cx="209" cy="291" r="4" fill="#ffffff" />
            <circle cx="345" cy="295" r="25" fill="#ffffff" />
            <circle cx="345" cy="295" r="12" fill="#1e293b" />
            <circle cx="349" cy="291" r="4" fill="#ffffff" />
            <circle cx="205" cy="295" r="42" fill="none" stroke="#94a3b8" strokeWidth="5" />
            <circle cx="345" cy="295" r="42" fill="none" stroke="#94a3b8" strokeWidth="5" />
            <line x1="247" y1="295" x2="303" y2="295" stroke="#94a3b8" strokeWidth="5" />

            <path d="M160,248 Q205,268 242,244" stroke="#475569" strokeWidth="11" fill="none" strokeLinecap="round" />
            <path d="M308,244 Q345,268 390,248" stroke="#475569" strokeWidth="11" fill="none" strokeLinecap="round" />

            <path d="M275,295 L263,355 L287,355" fill="none" stroke="#b07d5b" strokeWidth="5" strokeLinecap="round" />
            {/* دهان متحرک هنگام صحبت کردن مدیر هتل */}
            <ellipse cx="275" cy="402" rx="18" ry={3 + mouthOpen} fill="#5c2b21" />
            <path d="M195,382 Q275,352 355,382 Q335,412 275,398 Q215,412 195,382 Z" fill="#94a3b8" />

            <path d="M30,565 Q275,490 520,565 L560,1080 L-10,1080 Z" fill="#1e293b" />
            <polygon points="215,525 335,525 275,730" fill="#f1f5f9" />
            <polygon points="258,540 292,540 304,720 246,720" fill="#991b1b" />
            <polygon points="215,525 165,670 255,730" fill="#0f172a" />
            <polygon points="335,525 385,670 295,730" fill="#0f172a" />

            <g transform={`translate(${430 + handShake}, 610)`}>
              <rect x="0" y="60" width="56" height="110" rx="24" fill="#d4a381" />
              <rect x="18" y="0" width="18" height="75" rx="9" fill="#d4a381" />
            </g>
          </g>
        </svg>
      </div>
      <FilmAtmosphere />
      {!isManagerSpeaking ? (
        <Subtitle>مدیر هتل قبلاً به او هشدار داده بود:</Subtitle>
      ) : (
        <Subtitle speaker="مدیر هتل:">
          «هر اتاقی خواستی برو، فقط <Highlight>درِ شماره ۹</Highlight> رو باز نکن.»
        </Subtitle>
      )}
    </AbsoluteFill>
  );
};

/* صحنه ۴: صدای مادر از پشت در (راوی + صدای زنانه مادر + راوی) */
const Scene4MotherVoice: React.FC = () => {
  const frame = useCurrentFrame();
  const isMotherSpeaking = frame >= 65 && frame < 165;
  const waveOffset = (frame * 3.5) % 65;
  const microTremor = frame >= 65 && frame < 190 ? Math.sin(frame * 1.8) * 3 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#090f18', overflow: 'hidden' }}>
      {/* بخش ۱: راوی */}
      <Sequence from={0} durationInFrames={70}>
        <Audio src={staticFile('voice/otagh9/scene4_narrator1.mp3')} />
      </Sequence>
      {/* بخش ۲: صدای مادر نوید */}
      <Sequence from={65} durationInFrames={105}>
        <Audio src={staticFile('voice/otagh9/scene4_mother.mp3')} />
      </Sequence>
      {/* بخش ۳: ادامه توضیح راوی */}
      <Sequence from={165} durationInFrames={135}>
        <Audio src={staticFile('voice/otagh9/scene4_narrator2.mp3')} />
      </Sequence>

      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <rect width="1080" height="1920" fill="#090f18" />

        <rect x="850" y="0" width="230" height="1920" fill="#241814" />
        <rect x="836" y="0" width="14" height="1920" fill="#f7b731" opacity={isMotherSpeaking ? 0.9 : 0.55} />
        <rect x="760" y="0" width="80" height="1920" fill="#f7b731" opacity="0.08" />

        <g transform={`translate(${145 + microTremor}, 420)`}>
          <path d="M85,215 C75,45 465,45 455,215 C480,255 465,340 435,360 L105,360 C75,340 60,255 85,215 Z" fill="#181312" />
          <path d="M135,120 Q270,85 405,135" stroke="#2d2422" strokeWidth="14" fill="none" strokeLinecap="round" />
          <ellipse cx="110" cy="305" rx="20" ry="34" fill="#c78e65" />
          <path d="M115,190 L420,190 L402,425 C385,505 145,505 128,425 Z" fill="#d9a077" />
          <path d="M360,190 L420,190 L402,425 L355,455 Z" fill="#e6b38c" opacity="0.55" />

          <circle cx="205" cy="295" r="30" fill="#ffffff" />
          <circle cx="212" cy="295" r="13" fill="#24160e" />
          <circle cx="216" cy="290" r="4.5" fill="#ffffff" />

          <circle cx="335" cy="295" r="30" fill="#ffffff" />
          <circle cx="342" cy="295" r="13" fill="#24160e" />
          <circle cx="346" cy="290" r="4.5" fill="#ffffff" />

          <path d="M162,242 Q205,216 242,242" stroke="#181312" strokeWidth="11" fill="none" strokeLinecap="round" />
          <path d="M298,242 Q335,216 378,242" stroke="#181312" strokeWidth="11" fill="none" strokeLinecap="round" />

          <ellipse cx="270" cy="415" rx="22" ry="14" fill="#7a3b2e" />

          <path d="M30,565 Q270,490 510,565 L550,1080 L-10,1080 Z" fill="#9c4a2f" />
          <polygon points="210,520 330,520 270,710" fill="#1e2631" />
          <polygon points="120,540 165,530 240,1080 185,1080" fill="#141921" />
        </g>

        {/* امواج صوتی هنگام صحبت مادر پررنگ‌تر می‌شوند */}
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M ${800 - i * 58 - waveOffset},620 Q ${720 - i * 58 - waveOffset},750 ${800 - i * 58 - waveOffset},880`}
            stroke="#f7b731"
            strokeWidth={isMotherSpeaking ? 11 - i * 1.5 : 6 - i}
            fill="none"
            opacity={isMotherSpeaking ? 0.95 - i * 0.18 : 0.45 - i * 0.1}
            strokeLinecap="round"
          />
        ))}
      </svg>
      <FilmAtmosphere />
      {frame < 65 && <Subtitle>صدای زنی از داخل می‌گوید:</Subtitle>}
      {isMotherSpeaking && (
        <Subtitle speaker="صدای زن (پشت در):">
          <Highlight>«نوید... بالاخره برگشتی.»</Highlight>
        </Subtitle>
      )}
      {frame >= 165 && (
        <Subtitle>
          این دقیقاً <Highlight>صدای مادرش</Highlight> است؛ مادری که ۱۵ سال پیش فوت کرده.
        </Subtitle>
      )}
    </AbsoluteFill>
  );
};

/* صحنه ۵: عکس قدیمی از زیر در بیرون می‌خزد */
const Scene5OldPhoto: React.FC = () => {
  const frame = useCurrentFrame();
  const slideY = interpolate(frame, [0, 140], [-170, 155], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: 'clamp',
  });
  const rotate = interpolate(frame, [0, 140], [-5, 6], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#101822', overflow: 'hidden' }}>
      <Audio src={staticFile('voice/otagh9/scene5_narrator.mp3')} />
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <rect width="1080" height="1920" fill="#101822" />

        {[880, 1120, 1360, 1600].map((ly, idx) => (
          <line key={idx} x1="0" y1={ly} x2="1080" y2={ly} stroke="#070b10" strokeWidth="6" />
        ))}
        <line x1="360" y1="680" x2="360" y2="1120" stroke="#070b10" strokeWidth="5" />
        <line x1="720" y1="1120" x2="720" y2="1600" stroke="#070b10" strokeWidth="5" />

        <polygon points="80,670 1000,670 1080,1360 0,1360" fill="#f5a623" opacity="0.36" />

        <g transform={`translate(340, ${640 + slideY}) rotate(${rotate})`}>
          <rect x="12" y="16" width="400" height="480" rx="8" fill="#000000" opacity="0.45" />
          <rect x="0" y="0" width="400" height="480" rx="8" fill="#ebe0c9" stroke="#c4ae86" strokeWidth="8" />
          <rect x="28" y="28" width="344" height="360" fill="#826f5b" />
          <rect x="28" y="28" width="344" height="180" fill="#96816b" opacity="0.5" />

          <g transform="translate(85, 85)">
            <path d="M20,75 C15,10 125,10 120,75 L130,175 L10,175 Z" fill="#3a2e23" />
            <ellipse cx="70" cy="68" rx="34" ry="40" fill="#cbb59d" />
            <circle cx="58" cy="64" r="4.5" fill="#2b2118" />
            <circle cx="82" cy="64" r="4.5" fill="#2b2118" />
            <path d="M58,84 Q70,94 82,84" stroke="#4a392b" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M15,135 Q70,115 125,135 L140,303 L0,303 Z" fill="#4d3d2f" />
          </g>

          <g transform="translate(215, 145)">
            <ellipse cx="52" cy="52" rx="27" ry="31" fill="#cbb59d" />
            <path d="M25,46 C25,15 80,15 80,46 Z" fill="#2e241b" />
            <circle cx="43" cy="50" r="3.8" fill="#2b2118" />
            <circle cx="61" cy="50" r="3.8" fill="#2b2118" />
            <path d="M44,66 Q52,74 60,66" stroke="#4a392b" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M12,102 Q52,88 92,102 L102,243 L2,243 Z" fill="#634f3d" />
          </g>

          <circle cx="345" cy="55" r="22" fill="#b89f78" opacity="0.4" />
        </g>

        <rect x="0" y="0" width="1080" height="670" fill="#1d1310" />
        <rect x="0" y="648" width="1080" height="22" fill="#3b2821" />
        <rect x="0" y="667" width="1080" height="6" fill="#ffd166" opacity="0.7" />
      </svg>
      <FilmAtmosphere />
      <Subtitle>
        از زیر در، یک <Highlight>عکس قدیمی</Highlight> بیرون می‌خزد. عکس کودکی خودش است؛ کنار زنی که <Highlight>نباید زنده باشد</Highlight>.
      </Subtitle>
    </AbsoluteFill>
  );
};

/* صحنه ۶: چرخش دستگیره برنجی */
const Scene6DoorknobTurn: React.FC = () => {
  const frame = useCurrentFrame();
  const angle = interpolate(frame, [8, 110], [0, -36], {
    easing: Easing.inOut(Easing.ease),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const keyholeGlow = interpolate(Math.sin(frame / 5), [-1, 1], [0.45, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#18100d', overflow: 'hidden' }}>
      <Audio src={staticFile('voice/otagh9/scene6_narrator.mp3')} />
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <defs>
          <linearGradient id="brassPlate" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d9a44e" />
            <stop offset="50%" stopColor="#9e7029" />
            <stop offset="100%" stopColor="#634314" />
          </linearGradient>
          <linearGradient id="brassHandle" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5c973" />
            <stop offset="100%" stopColor="#a67426" />
          </linearGradient>
        </defs>

        <rect width="1080" height="1920" fill="#18100d" />
        <line x1="210" y1="0" x2="210" y2="1920" stroke="#0f0907" strokeWidth="14" />
        <line x1="870" y1="0" x2="870" y2="1920" stroke="#0f0907" strokeWidth="14" />

        <rect x="582" y="752" width="168" height="490" rx="84" fill="#090504" opacity="0.65" />

        <rect
          x="566"
          y="736"
          width="168"
          height="490"
          rx="84"
          fill="url(#brassPlate)"
          stroke="#4f350f"
          strokeWidth="8"
        />
        <circle cx="650" cy="785" r="10" fill="#4f350f" />
        <circle cx="650" cy="1175" r="10" fill="#4f350f" />

        <circle cx="650" cy="1095" r="24" fill="#1a1108" />
        <polygon points="636,1095 664,1095 676,1160 624,1160" fill="#1a1108" />
        <circle cx="650" cy="1095" r="18" fill="#f7b731" opacity={keyholeGlow} />
        <polygon points="639,1095 661,1095 671,1155 629,1155" fill="#f7b731" opacity={keyholeGlow} />

        <g transform={`rotate(${angle}, 650, 920)`}>
          <rect x="345" y="902" width="330" height="68" rx="34" fill="#090504" opacity="0.5" />
          <rect x="335" y="886" width="335" height="68" rx="34" fill="url(#brassHandle)" />
          <circle cx="650" cy="920" r="52" fill="#b88435" stroke="#5e4012" strokeWidth="6" />
          <circle cx="650" cy="920" r="28" fill="#e6b45c" />
        </g>
      </svg>
      <FilmAtmosphere />
      <Subtitle>
        دستگیره در شروع به <Highlight>چرخیدن</Highlight> می‌کند...
      </Subtitle>
    </AbsoluteFill>
  );
};

/* صحنه ۷: پایان قسمت اول و انتخاب مخاطب (A یا B) */
const Scene7ChoiceScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardAScale = spring({ frame: frame - 8, fps, config: { damping: 14 } });
  const cardBScale = spring({ frame: frame - 20, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#080d14',
        direction: 'rtl',
        padding: '180px 64px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Audio src={staticFile('voice/otagh9/scene7_narrator.mp3')} />
      <FilmAtmosphere />
      <div style={{ textAlign: 'center', marginBottom: 56, zIndex: 30 }}>
        <div
          style={{
            fontFamily: FONT_BODY,
            fontSize: 34,
            fontWeight: 700,
            color: '#ff5722',
            marginBottom: 14,
          }}
        >
          پایان قسمت اول • مخاطب تصمیم می‌گیرد
        </div>
        <div
          style={{
            fontFamily: FONT_TITLE,
            fontSize: 76,
            color: '#ffffff',
            textShadow: '0 6px 24px rgba(0,0,0,0.8)',
          }}
        >
          نوید باید چه کار کند؟
        </div>
      </div>

      {/* گزینه A */}
      <div
        style={{
          transform: `scale(${cardAScale})`,
          background: 'linear-gradient(145deg, #162232, #0f1724)',
          border: '3px solid rgba(247, 183, 49, 0.55)',
          borderRadius: 28,
          padding: 44,
          marginBottom: 38,
          boxShadow: '0 18px 40px rgba(0,0,0,0.5)',
          zIndex: 30,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            backgroundColor: '#ff5722',
            color: '#ffffff',
            fontFamily: FONT_TITLE,
            fontSize: 40,
            width: 68,
            height: 68,
            lineHeight: '68px',
            textAlign: 'center',
            borderRadius: 16,
            marginBottom: 18,
          }}
        >
          A
        </div>
        <div
          style={{
            fontFamily: FONT_TITLE,
            fontSize: 54,
            color: '#f7b731',
            marginBottom: 10,
          }}
        >
          در را باز کند.
        </div>
        <div
          style={{
            fontFamily: FONT_BODY,
            fontSize: 36,
            color: '#cfd8e3',
            lineHeight: 1.5,
          }}
        >
          شاید مادرش واقعاً پشت آن در باشد.
        </div>
      </div>

      {/* گزینه B */}
      <div
        style={{
          transform: `scale(${cardBScale})`,
          background: 'linear-gradient(145deg, #162232, #0f1724)',
          border: '3px solid rgba(247, 183, 49, 0.55)',
          borderRadius: 28,
          padding: 44,
          boxShadow: '0 18px 40px rgba(0,0,0,0.5)',
          zIndex: 30,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            backgroundColor: '#ff5722',
            color: '#ffffff',
            fontFamily: FONT_TITLE,
            fontSize: 40,
            width: 68,
            height: 68,
            lineHeight: '68px',
            textAlign: 'center',
            borderRadius: 16,
            marginBottom: 18,
          }}
        >
          B
        </div>
        <div
          style={{
            fontFamily: FONT_TITLE,
            fontSize: 54,
            color: '#f7b731',
            marginBottom: 10,
          }}
        >
          عکس را بردارد و از هتل فرار کند.
        </div>
        <div
          style={{
            fontFamily: FONT_BODY,
            fontSize: 36,
            color: '#cfd8e3',
            lineHeight: 1.5,
          }}
        >
          شاید کسی عمداً او را به اینجا کشانده باشد.
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Otagh9: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#080d14' }}>
      <div
        style={{
          position: 'absolute',
          top: 68,
          width: '100%',
          textAlign: 'center',
          fontFamily: FONT_TITLE,
          fontSize: 52,
          color: '#ffffff',
          textShadow: '0 6px 20px rgba(0,0,0,0.9)',
          zIndex: 40,
          direction: 'rtl',
        }}
      >
        پرونده مرموز: <span style={{ color: '#ff5722' }}>اتاق ۹</span>
      </div>

      {/* تایم‌لاین چندصدایی هماهنگ شده (مجموع ۵۰.۵ ثانیه = ۱۵۱۵ فریم) */}
      <Sequence from={0} durationInFrames={210}>
        <Scene1HotelExterior />
      </Sequence>
      <Sequence from={210} durationInFrames={165}>
        <Scene2CorridorDoor9 />
      </Sequence>
      <Sequence from={375} durationInFrames={225}>
        <Scene3ManagerWarning />
      </Sequence>
      <Sequence from={600} durationInFrames={300}>
        <Scene4MotherVoice />
      </Sequence>
      <Sequence from={900} durationInFrames={210}>
        <Scene5OldPhoto />
      </Sequence>
      <Sequence from={1110} durationInFrames={135}>
        <Scene6DoorknobTurn />
      </Sequence>
      <Sequence from={1245} durationInFrames={270}>
        <Scene7ChoiceScreen />
      </Sequence>
    </AbsoluteFill>
  );
};
