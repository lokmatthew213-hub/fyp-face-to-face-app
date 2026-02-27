// ============================================================
// 百分戰局 — Tutorial Component
// Animated multi-page tutorial with prev/next/skip navigation
// Covers: Welcome → Setup → Draw → Tactics A/B/C → Win
// ============================================================

import { useState, useEffect, useRef } from 'react';

interface TutorialProps {
  onComplete: () => void;
}

// ============================================================
// Tutorial page data
// ============================================================
interface TutorialPage {
  id: number;
  emoji: string;
  title: string;
  subtitle: string;
  content: React.ReactNode;
  bgGradient: string;
  accentColor: string;
}

// Animated illustration components for each page
function SetupIllustration() {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Two card decks */}
      <div className="flex gap-8 items-end">
        {/* Number deck */}
        <div className="flex flex-col items-center gap-1">
          <div className="relative w-14 h-20">
            {[3, 2, 1, 0].map((i) => (
              <div
                key={i}
                className="absolute rounded-lg border-2 border-orange-300 animate-float"
                style={{
                  width: '52px',
                  height: '72px',
                  background: `oklch(${0.95 - i * 0.02} 0.08 55)`,
                  top: `${i * 2}px`,
                  left: `${i * 2}px`,
                  animationDelay: `${i * 0.15}s`,
                  zIndex: 4 - i,
                  boxShadow: '0 2px 8px oklch(0.7 0.15 55 / 0.3)',
                }}
              >
                <div className="flex items-center justify-center h-full">
                  <span className="text-xl font-black" style={{ color: 'oklch(0.55 0.20 55)' }}>
                    {['7', '3', '5', 'N'][i]}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <span className="text-xs font-bold" style={{ color: 'oklch(0.55 0.20 55)' }}>
            數字牌 N
          </span>
        </div>

        {/* Hand icon */}
        <div className="text-3xl animate-bounce mb-4">🤝</div>

        {/* Word deck */}
        <div className="flex flex-col items-center gap-1">
          <div className="relative w-14 h-20">
            {[3, 2, 1, 0].map((i) => (
              <div
                key={i}
                className="absolute rounded-lg border-2 border-purple-300 animate-float"
                style={{
                  width: '52px',
                  height: '72px',
                  background: `oklch(${0.95 - i * 0.02} 0.08 290)`,
                  top: `${i * 2}px`,
                  left: `${i * 2}px`,
                  animationDelay: `${i * 0.15 + 0.3}s`,
                  zIndex: 4 - i,
                  boxShadow: '0 2px 8px oklch(0.7 0.15 290 / 0.3)',
                }}
              >
                <div className="flex items-center justify-center h-full">
                  <span className="text-sm font-bold" style={{ color: 'oklch(0.50 0.20 290)' }}>
                    {['是', '%', '的', 'W'][i]}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <span className="text-xs font-bold" style={{ color: 'oklch(0.50 0.20 290)' }}>
            文字牌 W
          </span>
        </div>
      </div>

      {/* Arrow down */}
      <div className="text-2xl animate-bounce">⬇️</div>

      {/* Hand of 12 cards */}
      <div className="flex items-center gap-1">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="rounded-md border-2 border-orange-300 flex items-center justify-center animate-float"
            style={{
              width: '28px',
              height: '40px',
              background: 'oklch(0.96 0.06 55)',
              animationDelay: `${i * 0.1}s`,
              transform: `rotate(${(i - 2.5) * 5}deg)`,
              boxShadow: '0 2px 6px oklch(0.7 0.15 55 / 0.25)',
            }}
          >
            <span className="text-xs font-bold" style={{ color: 'oklch(0.55 0.20 55)' }}>N</span>
          </div>
        ))}
        <div className="mx-1 text-slate-400 font-bold">+</div>
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="rounded-md border-2 border-purple-300 flex items-center justify-center animate-float"
            style={{
              width: '28px',
              height: '40px',
              background: 'oklch(0.96 0.06 290)',
              animationDelay: `${(i + 6) * 0.1}s`,
              transform: `rotate(${(i - 2.5) * 5}deg)`,
              boxShadow: '0 2px 6px oklch(0.7 0.15 290 / 0.25)',
            }}
          >
            <span className="text-xs font-bold" style={{ color: 'oklch(0.50 0.20 290)' }}>W</span>
          </div>
        ))}
      </div>
      <p className="text-sm font-bold text-slate-600">每人 12 張牌</p>
    </div>
  );
}

function DrawIllustration() {
  const [picked, setPicked] = useState<'N' | 'W' | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPicked((prev) => (prev === 'N' ? 'W' : 'N'));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-10 items-center">
        {/* N deck */}
        <div
          className="flex flex-col items-center gap-2 cursor-pointer transition-all duration-300"
          style={{ transform: picked === 'N' ? 'scale(1.15)' : 'scale(1)' }}
        >
          <div
            className="rounded-xl border-3 flex items-center justify-center font-black text-2xl transition-all duration-300"
            style={{
              width: '60px',
              height: '84px',
              background: picked === 'N' ? 'oklch(0.90 0.15 55)' : 'oklch(0.96 0.06 55)',
              borderColor: 'oklch(0.70 0.20 55)',
              borderWidth: '3px',
              color: 'oklch(0.50 0.22 55)',
              boxShadow: picked === 'N' ? '0 8px 24px oklch(0.7 0.20 55 / 0.4)' : '0 2px 8px oklch(0.7 0.15 55 / 0.2)',
            }}
          >
            123
          </div>
          <span className="text-sm font-bold" style={{ color: 'oklch(0.55 0.20 55)' }}>數字牌 N</span>
          {picked === 'N' && (
            <div
              className="rounded-full px-2 py-0.5 text-xs font-black animate-pulse"
              style={{ background: 'oklch(0.90 0.18 55)', color: 'oklch(0.45 0.22 55)' }}
            >
              ✓ 選這個！
            </div>
          )}
        </div>

        <div className="text-2xl font-black text-slate-400">或</div>

        {/* W deck */}
        <div
          className="flex flex-col items-center gap-2 cursor-pointer transition-all duration-300"
          style={{ transform: picked === 'W' ? 'scale(1.15)' : 'scale(1)' }}
        >
          <div
            className="rounded-xl border-3 flex items-center justify-center font-black text-lg transition-all duration-300"
            style={{
              width: '60px',
              height: '84px',
              background: picked === 'W' ? 'oklch(0.88 0.15 290)' : 'oklch(0.96 0.06 290)',
              borderColor: 'oklch(0.68 0.20 290)',
              borderWidth: '3px',
              color: 'oklch(0.48 0.22 290)',
              boxShadow: picked === 'W' ? '0 8px 24px oklch(0.7 0.20 290 / 0.4)' : '0 2px 8px oklch(0.7 0.15 290 / 0.2)',
            }}
          >
            是%
          </div>
          <span className="text-sm font-bold" style={{ color: 'oklch(0.50 0.20 290)' }}>文字牌 W</span>
          {picked === 'W' && (
            <div
              className="rounded-full px-2 py-0.5 text-xs font-black animate-pulse"
              style={{ background: 'oklch(0.88 0.18 290)', color: 'oklch(0.42 0.22 290)' }}
            >
              ✓ 選這個！
            </div>
          )}
        </div>
      </div>
      <p className="text-sm text-slate-500 font-medium">每回合選一疊摸 1 張牌</p>
    </div>
  );
}

function TacticAIllustration() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 600);
    return () => clearTimeout(t);
  }, []);

  const cards = [
    { text: '紅色', bg: 'oklch(0.92 0.08 28)', border: 'oklch(0.70 0.20 28)', color: 'oklch(0.48 0.22 28)' },
    { text: '是', bg: 'oklch(0.92 0.06 290)', border: 'oklch(0.68 0.18 290)', color: 'oklch(0.45 0.20 290)' },
    { text: '藍色', bg: 'oklch(0.92 0.08 240)', border: 'oklch(0.68 0.20 240)', color: 'oklch(0.45 0.20 240)' },
    { text: '的', bg: 'oklch(0.92 0.06 290)', border: 'oklch(0.68 0.18 290)', color: 'oklch(0.45 0.20 290)' },
    { text: '2', bg: 'oklch(0.92 0.08 55)', border: 'oklch(0.70 0.20 55)', color: 'oklch(0.50 0.22 55)' },
    { text: '0', bg: 'oklch(0.92 0.08 55)', border: 'oklch(0.70 0.20 55)', color: 'oklch(0.50 0.22 55)' },
    { text: '0', bg: 'oklch(0.92 0.08 55)', border: 'oklch(0.70 0.20 55)', color: 'oklch(0.50 0.22 55)' },
    { text: '%', bg: 'oklch(0.92 0.06 290)', border: 'oklch(0.68 0.18 290)', color: 'oklch(0.45 0.20 290)' },
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Cards laid out */}
      <div className="flex flex-wrap justify-center gap-1.5 max-w-xs">
        {cards.map((card, i) => (
          <div
            key={i}
            className="rounded-lg border-2 flex items-center justify-center font-black text-sm transition-all duration-500"
            style={{
              width: '42px',
              height: '56px',
              background: card.bg,
              borderColor: card.border,
              color: card.color,
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
              transitionDelay: `${i * 0.08}s`,
              boxShadow: `0 3px 10px ${card.border}50`,
            }}
          >
            {card.text}
          </div>
        ))}
      </div>

      {/* Win announcement */}
      {revealed && (
        <div
          className="rounded-2xl px-6 py-3 font-black text-xl animate-bounce"
          style={{
            background: 'linear-gradient(135deg, oklch(0.85 0.20 55), oklch(0.80 0.22 28))',
            color: 'white',
            boxShadow: '0 4px 20px oklch(0.7 0.20 55 / 0.4)',
            textShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        >
          🎉 百分百！
        </div>
      )}
      <p className="text-xs text-slate-500 text-center">組成完整算式，大喊「百分百！」</p>
    </div>
  );
}

function TacticBIllustration() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p + 1) % 3);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Question cards */}
      <div className="flex gap-1.5 justify-center">
        {['紅色', '是', '藍色', '的', '百分之幾？'].map((text, i) => (
          <div
            key={i}
            className="rounded-lg border-2 flex items-center justify-center font-bold text-xs"
            style={{
              width: text === '百分之幾？' ? '56px' : '38px',
              height: '52px',
              background: i === 4 ? 'oklch(0.88 0.15 160)' : 'oklch(0.94 0.06 290)',
              borderColor: i === 4 ? 'oklch(0.65 0.20 160)' : 'oklch(0.70 0.15 290)',
              color: i === 4 ? 'oklch(0.42 0.22 160)' : 'oklch(0.45 0.18 290)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            {text}
          </div>
        ))}
      </div>

      {/* Phase indicator */}
      <div className="flex gap-2 items-center">
        {['出題中...', '搶答！', phase === 2 ? '✓ 搶答成功！' : '搶答！'].map((label, i) => (
          <div
            key={i}
            className="rounded-full px-3 py-1 text-xs font-bold transition-all duration-500"
            style={{
              background: phase === i ? 'oklch(0.85 0.18 160)' : 'oklch(0.95 0.03 220)',
              color: phase === i ? 'oklch(0.40 0.22 160)' : 'oklch(0.65 0.05 220)',
              transform: phase === i ? 'scale(1.1)' : 'scale(1)',
              boxShadow: phase === i ? '0 3px 12px oklch(0.7 0.18 160 / 0.3)' : 'none',
            }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Score result */}
      <div
        className="rounded-xl p-3 text-xs text-center border transition-all duration-500"
        style={{
          background: 'oklch(0.97 0.04 55)',
          borderColor: 'oklch(0.85 0.12 55)',
          opacity: phase === 2 ? 1 : 0.4,
        }}
      >
        <p className="font-bold" style={{ color: 'oklch(0.50 0.18 55)' }}>
          搶答者得：題目分 + 答案分
        </p>
        <p className="text-slate-500 mt-0.5">出題者得：0 分！</p>
      </div>
    </div>
  );
}

function TacticCIllustration() {
  const [robbing, setRobbing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRobbing((r) => !r);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Discard action */}
      <div className="flex items-center gap-4">
        {/* Player discarding */}
        <div className="flex flex-col items-center gap-1">
          <div className="text-3xl">😔</div>
          <div
            className="rounded-lg border-2 flex items-center justify-center font-bold text-sm transition-all duration-500"
            style={{
              width: '44px',
              height: '60px',
              background: 'oklch(0.94 0.06 55)',
              borderColor: 'oklch(0.72 0.18 55)',
              color: 'oklch(0.52 0.20 55)',
              transform: robbing ? 'translateX(40px) rotate(15deg) scale(0.9)' : 'translateX(0) rotate(0) scale(1)',
              opacity: robbing ? 0.5 : 1,
              boxShadow: '0 2px 8px oklch(0.7 0.15 55 / 0.2)',
            }}
          >
            5
          </div>
          <span className="text-xs text-slate-500">棄牌</span>
        </div>

        {/* Arrow */}
        <div
          className="text-2xl transition-all duration-500"
          style={{ transform: robbing ? 'scale(1.3)' : 'scale(1)' }}
        >
          →
        </div>

        {/* Other player grabbing */}
        <div className="flex flex-col items-center gap-1">
          <div className="text-3xl">{robbing ? '😄' : '🤔'}</div>
          <div
            className="rounded-lg border-2 flex items-center justify-center font-bold text-sm transition-all duration-500"
            style={{
              width: '44px',
              height: '60px',
              background: robbing ? 'oklch(0.88 0.15 160)' : 'oklch(0.96 0.04 220)',
              borderColor: robbing ? 'oklch(0.65 0.20 160)' : 'oklch(0.82 0.08 220)',
              color: robbing ? 'oklch(0.42 0.22 160)' : 'oklch(0.60 0.06 220)',
              transform: robbing ? 'scale(1.15)' : 'scale(1)',
              boxShadow: robbing ? '0 6px 20px oklch(0.65 0.20 160 / 0.35)' : 'none',
            }}
          >
            {robbing ? '5✓' : '?'}
          </div>
          <span className="text-xs font-bold" style={{ color: robbing ? 'oklch(0.42 0.22 160)' : 'oklch(0.60 0.06 220)' }}>
            {robbing ? '突襲！' : '等待中'}
          </span>
        </div>
      </div>

      {/* Robbing announcement */}
      {robbing && (
        <div
          className="rounded-2xl px-5 py-2 font-black text-base animate-pulse"
          style={{
            background: 'linear-gradient(135deg, oklch(0.82 0.20 160), oklch(0.75 0.22 200))',
            color: 'white',
            boxShadow: '0 4px 16px oklch(0.65 0.20 160 / 0.4)',
          }}
        >
          ⚡ 百分百！突襲！
        </div>
      )}
      <p className="text-xs text-slate-500 text-center">
        對手棄牌時，若是你需要的最後一張，立刻搶！
      </p>
    </div>
  );
}

function WinIllustration() {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Score progress */}
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {[
          { name: '你', score: 50, color: 'oklch(0.65 0.22 28)', bg: 'oklch(0.92 0.08 28)', winner: true },
          { name: '對手', score: 32, color: 'oklch(0.62 0.22 240)', bg: 'oklch(0.92 0.08 240)', winner: false },
        ].map((player) => (
          <div key={player.name} className="flex items-center gap-2">
            <span className="text-xs font-bold w-8 text-slate-600">{player.name}</span>
            <div className="flex-1 rounded-full overflow-hidden" style={{ height: '18px', background: 'oklch(0.94 0.03 220)' }}>
              <div
                className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-1000"
                style={{
                  width: `${player.score * 2}%`,
                  background: player.bg,
                  border: `2px solid ${player.color}`,
                }}
              >
                <span className="text-xs font-black" style={{ color: player.color }}>
                  {player.score}
                </span>
              </div>
            </div>
            {player.winner && (
              <span className="text-lg animate-bounce">🏆</span>
            )}
          </div>
        ))}
      </div>

      {/* 50 mark threshold */}
      <div
        className="rounded-xl px-4 py-2 border text-center"
        style={{
          background: 'oklch(0.95 0.08 55)',
          borderColor: 'oklch(0.82 0.18 55)',
        }}
      >
        <p className="font-black text-lg" style={{ color: 'oklch(0.50 0.22 55)' }}>
          🎯 先達到 50 分者勝！
        </p>
        <p className="text-xs text-slate-500 mt-0.5">1 張牌 = 1 分</p>
      </div>

      {/* Confetti */}
      <div className="flex gap-2 text-2xl">
        {['🎉', '🎊', '🏆', '🎊', '🎉'].map((e, i) => (
          <span
            key={i}
            className="animate-float"
            style={{ animationDelay: `${i * 0.2}s` }}
          >
            {e}
          </span>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Tutorial pages definition
// ============================================================
const TUTORIAL_PAGES: TutorialPage[] = [
  {
    id: 0,
    emoji: '⚔️',
    title: '歡迎來到百分戰局！',
    subtitle: 'Percent Battle',
    content: (
      <div className="flex flex-col items-center gap-4">
        <div className="text-6xl animate-bounce">🎮</div>
        <div
          className="rounded-2xl p-4 text-center border max-w-sm"
          style={{ background: 'oklch(0.97 0.04 220)', borderColor: 'oklch(0.85 0.10 220)' }}
        >
          <p className="font-bold text-slate-700 text-sm leading-relaxed">
            這是一個用卡牌學習<strong>百分比</strong>的策略遊戲！
            <br /><br />
            用你的牌組成完整的百分比算式，
            <br />
            比對手更快得到 <strong>50 分</strong>就贏了！
          </p>
        </div>
        <div className="flex gap-3 text-3xl">
          {['🃏', '📊', '🧮', '🏆'].map((e, i) => (
            <span key={i} className="animate-float" style={{ animationDelay: `${i * 0.25}s` }}>
              {e}
            </span>
          ))}
        </div>
      </div>
    ),
    bgGradient: 'linear-gradient(135deg, oklch(0.96 0.06 220), oklch(0.98 0.04 260))',
    accentColor: 'oklch(0.55 0.20 220)',
  },
  {
    id: 1,
    emoji: '🛠️',
    title: '戰前佈置',
    subtitle: 'Setup — 開始前的準備',
    content: <SetupIllustration />,
    bgGradient: 'linear-gradient(135deg, oklch(0.97 0.05 55), oklch(0.98 0.04 30))',
    accentColor: 'oklch(0.55 0.22 55)',
  },
  {
    id: 2,
    emoji: '✋',
    title: '每回合：補給',
    subtitle: 'Draw — 摸 1 張牌',
    content: <DrawIllustration />,
    bgGradient: 'linear-gradient(135deg, oklch(0.97 0.05 290), oklch(0.98 0.04 260))',
    accentColor: 'oklch(0.50 0.20 290)',
  },
  {
    id: 3,
    emoji: '🅰️',
    title: '戰術 A：火力全開',
    subtitle: '自摸食糊 — 組成完整算式',
    content: <TacticAIllustration />,
    bgGradient: 'linear-gradient(135deg, oklch(0.97 0.05 28), oklch(0.98 0.04 55))',
    accentColor: 'oklch(0.52 0.22 28)',
  },
  {
    id: 4,
    emoji: '🅱️',
    title: '戰術 B：設下陷阱',
    subtitle: '出題 — 讓對手來答！',
    content: <TacticBIllustration />,
    bgGradient: 'linear-gradient(135deg, oklch(0.97 0.05 160), oklch(0.98 0.04 200))',
    accentColor: 'oklch(0.45 0.20 160)',
  },
  {
    id: 5,
    emoji: '⚡',
    title: '戰術 C + 突襲',
    subtitle: '棄牌 & 搶別人的牌！',
    content: <TacticCIllustration />,
    bgGradient: 'linear-gradient(135deg, oklch(0.97 0.05 200), oklch(0.98 0.04 240))',
    accentColor: 'oklch(0.48 0.20 200)',
  },
  {
    id: 6,
    emoji: '🏆',
    title: '勝利條件',
    subtitle: '先達到 50 分者勝！',
    content: <WinIllustration />,
    bgGradient: 'linear-gradient(135deg, oklch(0.97 0.06 55), oklch(0.98 0.05 28))',
    accentColor: 'oklch(0.52 0.22 55)',
  },
];

// ============================================================
// Main Tutorial Component
// ============================================================
export default function Tutorial({ onComplete }: TutorialProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState(false);
  const totalPages = TUTORIAL_PAGES.length;

  // Entrance animation
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const goTo = (index: number, dir: 'forward' | 'backward') => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrentPage(index);
      setAnimating(false);
    }, 280);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      goTo(currentPage + 1, 'forward');
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      goTo(currentPage - 1, 'backward');
    }
  };

  const page = TUTORIAL_PAGES[currentPage];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 transition-all duration-500"
      style={{
        background: 'oklch(0.15 0.05 220 / 0.85)',
        opacity: visible ? 1 : 0,
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        className="relative w-full max-w-lg mx-4 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500"
        style={{
          background: page.bgGradient,
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
          maxHeight: '90vh',
        }}
      >
        {/* Skip button */}
        <button
          onClick={onComplete}
          className="absolute top-4 right-4 z-10 rounded-full px-3 py-1 text-xs font-bold border transition-all hover:scale-105"
          style={{
            background: 'oklch(0.98 0.02 220 / 0.8)',
            borderColor: 'oklch(0.82 0.06 220)',
            color: 'oklch(0.55 0.08 220)',
          }}
        >
          跳過 ✕
        </button>

        {/* Page content */}
        <div
          className="flex flex-col items-center px-6 pt-8 pb-4 transition-all duration-280"
          style={{
            opacity: animating ? 0 : 1,
            transform: animating
              ? direction === 'forward'
                ? 'translateX(-30px)'
                : 'translateX(30px)'
              : 'translateX(0)',
          }}
        >
          {/* Page emoji + title */}
          <div className="text-4xl mb-2">{page.emoji}</div>
          <h2
            className="text-2xl font-black text-center mb-1"
            style={{ color: page.accentColor, fontFamily: "'Noto Sans TC', sans-serif" }}
          >
            {page.title}
          </h2>
          <p className="text-sm text-slate-500 text-center mb-5 font-medium">
            {page.subtitle}
          </p>

          {/* Illustration / content */}
          <div className="w-full flex justify-center mb-6 min-h-[200px] items-center">
            {page.content}
          </div>
        </div>

        {/* Navigation */}
        <div
          className="flex items-center justify-between px-6 pb-6 border-t pt-4"
          style={{ borderColor: 'oklch(0.88 0.05 220)' }}
        >
          {/* Prev button */}
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className="rounded-xl px-4 py-2 text-sm font-bold border transition-all hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: 'oklch(0.98 0.02 220)',
              borderColor: 'oklch(0.82 0.06 220)',
              color: 'oklch(0.50 0.08 220)',
            }}
          >
            ← 上一頁
          </button>

          {/* Page dots */}
          <div className="flex gap-1.5 items-center">
            {TUTORIAL_PAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > currentPage ? 'forward' : 'backward')}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === currentPage ? '20px' : '8px',
                  height: '8px',
                  background: i === currentPage ? page.accentColor : 'oklch(0.82 0.05 220)',
                }}
              />
            ))}
          </div>

          {/* Next / Start button */}
          <button
            onClick={handleNext}
            className="rounded-xl px-4 py-2 text-sm font-black border-2 transition-all hover:scale-105 active:scale-95"
            style={{
              background: page.accentColor,
              borderColor: page.accentColor,
              color: 'white',
              boxShadow: `0 4px 16px ${page.accentColor}50`,
            }}
          >
            {currentPage === totalPages - 1 ? '開始遊戲！🎮' : '下一頁 →'}
          </button>
        </div>
      </div>
    </div>
  );
}
