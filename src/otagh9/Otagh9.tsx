import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';

const FONT_TITLE = 'Lalezar, sans-serif';
const FONT_BODY = 'Vazirmatn, sans-serif';

interface SubtitleProps {
  children: React.ReactNode;
}

const Subtitle: React.FC<SubtitleProps> = ({ children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 160,
        left: 64,
        right: 64,
        textAlign: 'center',
        direction: 'rtl',
        fontFamily: FONT_BODY,
        fontWeight: 600,
        fontSize: 44,
        lineHeight: 1.65,
        color: '#ffffff',
        textShadow: '0 6px 24px rgba(0,0,0,0.95), 0 2px 6px rgba(0,0,0,0.9)',
        opacity,
        zIndex: 30,
      }}
    >
      {children}
    </div>
  );
};

const Highlight: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: '#f7b731', fontWeight: 800 }}>{children}</span>
);

/* صحنه ۱: نمای بیرونی هتل قدیمی در آستانه تخریب */
const Scene1HotelExterior: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 150], [1.08, 1], {
    extrapolateRight: 'clamp',
  });
  const navidX = interpolate(frame, [0, 150], [440, 510], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0b131e', overflow: 'hidden' }}>
      <div style={{ width: '100%', height: '100%', transform: `scale(${scale})` }}>
        <svg viewBox="0 0 1080 1920" width="1080" height="1920">
          <defs>
            <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#070d16" />
              <stop offset="100%" stopColor="#162336" />
            </linearGradient>
            <linearGradient id="hotelWall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1b2636" />
              <stop offset="100%" stopColor="#101722" />
            </linearGradient>
          </defs>
          <rect width="1080" height="1920" fill="url(#nightSky)" />

          {/* ماه و هاله نور */}
          <circle cx="820" cy="340" r="70" fill="#e6dec8" opacity="0.85" />
          <circle cx="820" cy="340" r="140" fill="#e6dec8" opacity="0.08" />

          {/* جرثقیل تخریب در پس‌زمینه */}
          <g opacity="0.45">
            <rect x="170" y="320" width="18" height="1100" fill="#090f17" />
            <polygon points="100,360 520,250 520,275 100,385" fill="#090f17" />
            <line x1="480" y1="265" x2="480" y2="540" stroke="#090f17" strokeWidth="5" />
            <circle cx="480" cy="560" r="24" fill="#090f17" />
          </g>

          {/* ساختمان هتل قدیمی */}
          <rect x="210" y="460" width="660" height="1040" rx="8" fill="url(#hotelWall)" />
          <polygon points="180,460 540,330 900,460" fill="#131c29" />

          {/* پنجره‌های تاریک و شکسته هتل */}
          {[560, 760, 960].map((y, rowIdx) =>
            [300, 490, 680].map((x, colIdx) => (
              <rect
                key={`${rowIdx}-${colIdx}`}
                x={x}
                y={y}
                width="100"
                height="130"
                rx="6"
                fill={rowIdx === 1 && colIdx === 1 ? '#f5a623' : '#0a1019'}
                opacity={rowIdx === 1 && colIdx === 1 ? 0.35 : 0.9}
              />
            ))
          )}

          {/* ورودی هتل با نور گرم ضعیف */}
          <rect x="440" y="1220" width="200" height="280" rx="12" fill="#f5a623" opacity="0.22" />
          <rect x="460" y="1240" width="160" height="260" rx="8" fill="#1c1512" />

          {/* زمین و حصار تخریب */}
          <rect x="0" y="1500" width="1080" height="420" fill="#080d14" />

          {/* شخصیت نوید با دوربین عکاسی */}
          <g transform={`translate(${navidX}, 1260)`}>
            <ellipse cx="45" cy="35" rx="26" ry="30" fill="#1e1615" />
            <path d="M10,80 Q45,62 80,80 L92,240 L-2,240 Z" fill="#9c4a2f" />
            <rect x="28" y="115" width="36" height="26" rx="5" fill="#1e2733" />
            <circle cx="46" cy="128" r="9" fill="#526a87" />
          </g>
        </svg>
      </div>
      <Subtitle>
        یک هتل قدیمی قرار است <Highlight>تخریب</Highlight> شود. <Highlight>نوید</Highlight>، عکاس جوان، برای تهیه آخرین تصاویر وارد ساختمان می‌شود.
      </Subtitle>
    </AbsoluteFill>
  );
};

/* صحنه ۲: راهروی تاریک و درِ اتاق ۹ */
const Scene2CorridorDoor9: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 150], [1, 1.14], {
    extrapolateRight: 'clamp',
  });
  const glowPulse = interpolate(Math.sin(frame / 10), [-1, 1], [0.22, 0.45]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0b131e', overflow: 'hidden' }}>
      <div style={{ width: '100%', height: '100%', transform: `scale(${zoom})` }}>
        <svg viewBox="0 0 1080 1920" width="1080" height="1920">
          <defs>
            <linearGradient id="corridorBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#09101a" />
              <stop offset="100%" stopColor="#162334" />
            </linearGradient>
            <linearGradient id="woodDoor" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2e201b" />
              <stop offset="100%" stopColor="#170f0d" />
            </linearGradient>
          </defs>
          <rect width="1080" height="1920" fill="url(#corridorBg)" />

          {/* دیوارهای پرسپکتیو راهرو */}
          <polygon points="0,0 290,360 290,1480 0,1920" fill="#101b29" />
          <polygon points="1080,0 790,360 790,1480 1080,1920" fill="#101b29" />

          {/* چارچوب و درِ اتاق ۹ */}
          <rect x="330" y="420" width="420" height="1040" rx="8" fill="url(#woodDoor)" stroke="#422e26" strokeWidth="10" />
          <rect x="375" y="480" width="330" height="380" rx="4" fill="none" stroke="#1f1512" strokeWidth="6" />
          <rect x="375" y="920" width="330" height="460" rx="4" fill="none" stroke="#1f1512" strokeWidth="6" />

          {/* نور طلایی از زیر در */}
          <polygon points="330,1460 750,1460 880,1720 200,1720" fill="#f5a623" opacity={glowPulse} />

          {/* پلاک فلزی اتاق ۹ */}
          <rect x="480" y="590" width="120" height="76" rx="10" fill="#c7923e" />
          <text
            x="540"
            y="648"
            textAnchor="middle"
            fill="#1a120b"
            fontFamily={FONT_TITLE}
            fontSize="56"
          >
            ۹
          </text>
        </svg>
      </div>
      <Subtitle>
        در راهرو، متوجه دری می‌شود که روی آن نوشته شده: <Highlight>اتاق ۹</Highlight>.
      </Subtitle>
    </AbsoluteFill>
  );
};

/* صحنه ۳: هشدار مدیر هتل */
const Scene3ManagerWarning: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 165], [1.05, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0d1520', overflow: 'hidden' }}>
      <div style={{ width: '100%', height: '100%', transform: `scale(${scale})` }}>
        <svg viewBox="0 0 1080 1920" width="1080" height="1920">
          <rect width="1080" height="1920" fill="#0e1622" />
          <circle cx="540" cy="760" r="360" fill="#f5a623" opacity="0.08" />

          {/* مدیر پیر هتل */}
          <g transform="translate(270, 460)">
            {/* موهای جوگندمی */}
            <path d="M90,210 C80,60 460,60 450,210 C470,250 455,320 430,340 L110,340 C85,320 70,250 90,210 Z" fill="#6b7280" />
            {/* صورت */}
            <path d="M120,190 L420,190 L405,410 C390,490 150,490 135,410 Z" fill="#d4a381" />
            {/* چشمان نگران */}
            <circle cx="205" cy="295" r="24" fill="#ffffff" />
            <circle cx="205" cy="295" r="12" fill="#1f2937" />
            <circle cx="335" cy="295" r="24" fill="#ffffff" />
            <circle cx="335" cy="295" r="12" fill="#1f2937" />
            {/* ابروهای اخمو و نگران */}
            <path d="M165,255 Q205,270 240,250" stroke="#4b5563" strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M300,250 Q335,270 375,255" stroke="#4b5563" strokeWidth="10" fill="none" strokeLinecap="round" />
            {/* سبیل جوگندمی */}
            <path d="M200,375 Q270,350 340,375 Q320,400 270,390 Q220,400 200,375 Z" fill="#9ca3af" />
            {/* کت و شلوار تیره */}
            <path d="M40,560 Q270,490 500,560 L540,1040 L0,1040 Z" fill="#26303d" />
            <polygon points="215,525 325,525 270,710" fill="#e5e7eb" />
            <polygon points="255,540 285,540 295,700 245,700" fill="#7f1d1d" />
          </g>
        </svg>
      </div>
      <Subtitle>
        مدیر هتل قبلاً به او هشدار داده بود: «هر اتاقی خواستی برو، فقط <Highlight>درِ شماره ۹</Highlight> رو باز نکن.»
      </Subtitle>
    </AbsoluteFill>
  );
};

/* صحنه ۴: صدای مادر از پشت در و بهت نوید */
const Scene4MotherVoice: React.FC = () => {
  const frame = useCurrentFrame();
  const waveOffset = (frame * 3) % 60;

  return (
    <AbsoluteFill style={{ backgroundColor: '#0b121c', overflow: 'hidden' }}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <rect width="1080" height="1920" fill="#0b121c" />
        {/* لبه در اتاق در سمت راست */}
        <rect x="860" y="0" width="220" height="1920" fill="#241814" />
        <rect x="848" y="0" width="12" height="1920" fill="#f5a623" opacity="0.5" />

        {/* چهره بسته نوید در شوک */}
        <g transform="translate(180, 440)">
          <path d="M90,210 C80,50 450,50 440,210 C465,250 450,330 425,350 L105,350 C80,330 65,250 90,210 Z" fill="#1b1615" />
          <path d="M120,195 L410,195 L395,415 C380,495 150,495 135,415 Z" fill="#d9a077" />
          {/* چشمان درشت بهت‌زده */}
          <circle cx="205" cy="295" r="28" fill="#ffffff" />
          <circle cx="205" cy="295" r="13" fill="#2b1b12" />
          <circle cx="330" cy="295" r="28" fill="#ffffff" />
          <circle cx="330" cy="295" r="13" fill="#2b1b12" />
          {/* ابروهای بالا رفته */}
          <path d="M165,245 Q205,222 240,245" stroke="#1b1615" strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M295,245 Q330,222 370,245" stroke="#1b1615" strokeWidth="10" fill="none" strokeLinecap="round" />
          {/* کت آجری */}
          <path d="M40,560 Q265,495 490,560 L530,1040 L0,1040 Z" fill="#9c4a2f" />
          <polygon points="210,520 320,520 265,690" fill="#242c37" />
        </g>

        {/* امواج صوتی از شکاف در */}
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M ${810 - i * 55 - waveOffset},650 Q ${740 - i * 55 - waveOffset},760 ${810 - i * 55 - waveOffset},870`}
            stroke="#f7b731"
            strokeWidth="7"
            fill="none"
            opacity={0.75 - i * 0.2}
            strokeLinecap="round"
          />
        ))}
      </svg>
      <Subtitle>
        صدای زنی از داخل می‌گوید: <Highlight>«نوید... بالاخره برگشتی.»</Highlight> این دقیقاً <Highlight>صدای مادرش</Highlight> است؛ مادری که ۱۵ سال پیش فوت کرده.
      </Subtitle>
    </AbsoluteFill>
  );
};

/* صحنه ۵: عکس قدیمی از زیر در بیرون می‌خزد */
const Scene5OldPhoto: React.FC = () => {
  const frame = useCurrentFrame();
  const slideY = interpolate(frame, [0, 110], [-140, 140], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: 'clamp',
  });
  const rotate = interpolate(frame, [0, 110], [-4, 5], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#111924', overflow: 'hidden' }}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <rect width="1080" height="1920" fill="#111924" />
        {/* خطوط کف چوبی */}
        <line x1="0" y1="960" x2="1080" y2="960" stroke="#080c12" strokeWidth="6" />
        <line x1="0" y1="1280" x2="1080" y2="1280" stroke="#080c12" strokeWidth="6" />
        <line x1="0" y1="1600" x2="1080" y2="1600" stroke="#080c12" strokeWidth="6" />

        {/* نور طلایی شدید زیر در */}
        <polygon points="100,680 980,680 1080,1260 0,1260" fill="#f5a623" opacity="0.34" />

        {/* عکس قدیمی که از زیر در بیرون می‌لغزد */}
        <g transform={`translate(360, ${660 + slideY}) rotate(${rotate})`}>
          <rect x="0" y="0" width="360" height="440" rx="8" fill="#e8dcc5" stroke="#bfa982" strokeWidth="8" />
          <rect x="26" y="26" width="308" height="330" fill="#7a6855" />
          {/* مادر و کودک در عکس */}
          <circle cx="135" cy="135" r="42" fill="#3d3126" />
          <path d="M70,356 Q135,190 200,356 Z" fill="#3d3126" />
          <circle cx="235" cy="195" r="32" fill="#4f4032" />
          <path d="M185,356 Q235,240 285,356 Z" fill="#4f4032" />
        </g>

        {/* بدنه پایینی در */}
        <rect x="0" y="0" width="1080" height="680" fill="#1f1512" />
        <rect x="0" y="660" width="1080" height="20" fill="#3a2822" />
      </svg>
      <Subtitle>
        از زیر در، یک <Highlight>عکس قدیمی</Highlight> بیرون می‌خزد. عکس کودکی خودش است؛ کنار زنی که <Highlight>نباید زنده باشد</Highlight>.
      </Subtitle>
    </AbsoluteFill>
  );
};

/* صحنه ۶: چرخش دستگیره در */
const Scene6DoorknobTurn: React.FC = () => {
  const frame = useCurrentFrame();
  const angle = interpolate(frame, [10, 120], [0, -34], {
    easing: Easing.inOut(Easing.ease),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const keyholeGlow = interpolate(Math.sin(frame / 6), [-1, 1], [0.4, 0.95]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#1c1310', overflow: 'hidden' }}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <rect width="1080" height="1920" fill="#1c1310" />
        <line x1="240" y1="0" x2="240" y2="1920" stroke="#120b09" strokeWidth="14" />
        <line x1="840" y1="0" x2="840" y2="1920" stroke="#120b09" strokeWidth="14" />

        {/* صفحه برنجی دستگیره */}
        <rect x="570" y="740" width="160" height="480" rx="80" fill="#b88435" stroke="#6e4d1b" strokeWidth="10" />

        {/* سوراخ کلید درخشان */}
        <circle cx="650" cy="1100" r="22" fill="#f7b731" opacity={keyholeGlow} />
        <polygon points="638,1100 662,1100 672,1160 628,1160" fill="#f7b731" opacity={keyholeGlow} />

        {/* دستگیره در حال چرخش */}
        <g transform={`rotate(${angle}, 650, 920)`}>
          <rect x="350" y="888" width="320" height="64" rx="32" fill="#e0a94f" />
          <circle cx="650" cy="920" r="48" fill="#c79038" />
        </g>
      </svg>
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

  const cardAScale = spring({ frame: frame - 10, fps, config: { damping: 14 } });
  const cardBScale = spring({ frame: frame - 22, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#090e16',
        direction: 'rtl',
        padding: '180px 64px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <div
          style={{
            fontFamily: FONT_BODY,
            fontSize: 34,
            fontWeight: 700,
            color: '#ff5722',
            marginBottom: 16,
          }}
        >
          پایان قسمت اول • مخاطب تصمیم می‌گیرد
        </div>
        <div
          style={{
            fontFamily: FONT_TITLE,
            fontSize: 74,
            color: '#ffffff',
          }}
        >
          نوید باید چه کار کند؟
        </div>
      </div>

      {/* گزینه A */}
      <div
        style={{
          transform: `scale(${cardAScale})`,
          background: 'linear-gradient(145deg, #162232, #101926)',
          border: '3px solid rgba(247, 183, 49, 0.5)',
          borderRadius: 28,
          padding: 44,
          marginBottom: 40,
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
            marginBottom: 20,
          }}
        >
          A
        </div>
        <div
          style={{
            fontFamily: FONT_TITLE,
            fontSize: 54,
            color: '#f7b731',
            marginBottom: 12,
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
          background: 'linear-gradient(145deg, #162232, #101926)',
          border: '3px solid rgba(247, 183, 49, 0.5)',
          borderRadius: 28,
          padding: 44,
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
            marginBottom: 20,
          }}
        >
          B
        </div>
        <div
          style={{
            fontFamily: FONT_TITLE,
            fontSize: 54,
            color: '#f7b731',
            marginBottom: 12,
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
    <AbsoluteFill style={{ backgroundColor: '#090e16' }}>
      {/* تیتر ثابت بالای تصویر */}
      <div
        style={{
          position: 'absolute',
          top: 72,
          width: '100%',
          textAlign: 'center',
          fontFamily: FONT_TITLE,
          fontSize: 52,
          color: '#ffffff',
          textShadow: '0 6px 20px rgba(0,0,0,0.85)',
          zIndex: 40,
          direction: 'rtl',
        }}
      >
        پرونده مرموز: <span style={{ color: '#ff5722' }}>اتاق ۹</span>
      </div>

      {/* تایم‌لاین صحنه‌ها (۳۰ فریم بر ثانیه - مجموع ۳۶ ثانیه = ۱۰۸۰ فریم) */}
      <Sequence from={0} durationInFrames={150}>
        <Scene1HotelExterior />
      </Sequence>
      <Sequence from={150} durationInFrames={150}>
        <Scene2CorridorDoor9 />
      </Sequence>
      <Sequence from={300} durationInFrames={165}>
        <Scene3ManagerWarning />
      </Sequence>
      <Sequence from={465} durationInFrames={180}>
        <Scene4MotherVoice />
      </Sequence>
      <Sequence from={645} durationInFrames={165}>
        <Scene5OldPhoto />
      </Sequence>
      <Sequence from={810} durationInFrames={120}>
        <Scene6DoorknobTurn />
      </Sequence>
      <Sequence from={930} durationInFrames={150}>
        <Scene7ChoiceScreen />
      </Sequence>
    </AbsoluteFill>
  );
};
