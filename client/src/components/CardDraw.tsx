// ============================================================
// 百分戰局 — Card Draw Animation Component
// Exciting animated card draw sequence:
// 1. Shuffling cards animation (3 face-down cards spinning)
// 2. One card floats to center
// 3. Card flips to reveal the context card name + colors
// 4. Auto-proceed to game board after reveal
// ============================================================

import { useState, useEffect } from 'react';
import { ContextCard } from '@/lib/gameData';

interface CardDrawProps {
  card: ContextCard;
  onComplete: () => void;
}

type DrawPhase =
  | 'shuffling'   // Cards shuffling on screen
  | 'selecting'   // One card rises to center
  | 'flipping'    // Card flips over
  | 'revealed'    // Card face shown, waiting
  | 'done';       // Fade out

const COLOR_LABELS: Record<string, string> = {
  red: '紅色',
  yellow: '黃色',
  blue: '藍色',
};

const COLOR_STYLES: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  red: {
    bg: 'oklch(0.92 0.10 28)',
    border: 'oklch(0.65 0.22 28)',
    text: 'oklch(0.45 0.22 28)',
    dot: 'oklch(0.60 0.25 28)',
  },
  yellow: {
    bg: 'oklch(0.95 0.12 75)',
    border: 'oklch(0.70 0.20 75)',
    text: 'oklch(0.48 0.20 75)',
    dot: 'oklch(0.72 0.22 75)',
  },
  blue: {
    bg: 'oklch(0.92 0.10 240)',
    border: 'oklch(0.62 0.22 240)',
    text: 'oklch(0.42 0.22 240)',
    dot: 'oklch(0.58 0.24 240)',
  },
};

export default function CardDraw({ card, onComplete }: CardDrawProps) {
  const [phase, setPhase] = useState<DrawPhase>('shuffling');
  const [visible, setVisible] = useState(false);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    // Entrance
    const t0 = setTimeout(() => setVisible(true), 50);

    // Phase timeline
    const t1 = setTimeout(() => setPhase('selecting'), 1800);
    const t2 = setTimeout(() => setPhase('flipping'), 2800);
    const t3 = setTimeout(() => {
      setFlipped(true);
      setPhase('revealed');
    }, 3400);
    const t4 = setTimeout(() => setPhase('done'), 5800);
    const t5 = setTimeout(() => onComplete(), 6200);

    return () => [t0, t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [onComplete]);

  const presentColors = (['red', 'yellow', 'blue'] as const).filter(
    (c) => (card.colors[c] ?? 0) > 0
  );

  // Shuffling card positions (3 face-down cards)
  const shufflePositions = [
    { x: -80, y: 0, rotate: -15 },
    { x: 0, y: -20, rotate: 5 },
    { x: 80, y: 0, rotate: 20 },
  ];

  const isShuffling = phase === 'shuffling';
  const isSelecting = phase === 'selecting';
  const isFlipping = phase === 'flipping';
  const isRevealed = phase === 'revealed';
  const isDone = phase === 'done';

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 transition-all duration-500"
      style={{
        background: 'oklch(0.12 0.06 240 / 0.90)',
        backdropFilter: 'blur(12px)',
        opacity: visible && !isDone ? 1 : 0,
      }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Title */}
        <div
          className="text-center transition-all duration-500"
          style={{
            opacity: isShuffling || isSelecting ? 1 : 0,
            transform: isShuffling || isSelecting ? 'translateY(0)' : 'translateY(-20px)',
          }}
        >
          <p
            className="text-2xl font-black"
            style={{
              color: 'oklch(0.95 0.05 55)',
              fontFamily: "'Noto Sans TC', sans-serif",
              textShadow: '0 2px 12px oklch(0.7 0.20 55 / 0.5)',
            }}
          >
            🗺️ 抽取情境地圖牌
          </p>
          <p className="text-sm mt-1" style={{ color: 'oklch(0.75 0.05 220)' }}>
            {isShuffling ? '洗牌中...' : '選擇一張...'}
          </p>
        </div>

        {/* Card area */}
        <div className="relative flex items-center justify-center" style={{ width: '280px', height: '200px' }}>
          {/* Shuffling cards (3 face-down) */}
          {shufflePositions.map((pos, i) => (
            <div
              key={i}
              className="absolute transition-all"
              style={{
                transitionDuration: isSelecting ? '600ms' : '400ms',
                transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: isSelecting
                  ? i === 1
                    ? 'translateX(0px) translateY(-30px) rotate(0deg) scale(1.1)'
                    : `translateX(${pos.x * 1.5}px) translateY(40px) rotate(${pos.rotate * 1.5}deg) scale(0.85)`
                  : `translateX(${pos.x}px) translateY(${pos.y}px) rotate(${
                      isShuffling
                        ? pos.rotate + Math.sin(Date.now() / 300 + i) * 5
                        : pos.rotate
                    }deg)`,
                opacity: isSelecting && i !== 1 ? 0.4 : 1,
                zIndex: i === 1 ? 10 : 5 - i,
              }}
            >
              {/* Face-down card */}
              <div
                className="rounded-2xl border-3 flex items-center justify-center"
                style={{
                  width: '90px',
                  height: '126px',
                  background: `linear-gradient(135deg, oklch(0.45 0.18 240), oklch(0.35 0.20 260))`,
                  borderColor: 'oklch(0.60 0.15 240)',
                  borderWidth: '3px',
                  boxShadow: '0 8px 32px oklch(0.3 0.15 240 / 0.6)',
                  // Hide when flipping starts (only for center card)
                  opacity: isFlipping && i === 1 ? 0 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                {/* Card back pattern */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-3xl">⚔️</span>
                  <span
                    className="text-xs font-black"
                    style={{ color: 'oklch(0.80 0.10 220)' }}
                  >
                    百分戰局
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Revealed card (flips in when phase = flipping/revealed) */}
          {(isFlipping || isRevealed) && (
            <div
              className="absolute z-20 transition-all duration-600"
              style={{
                transform: flipped
                  ? 'translateY(-30px) scale(1.05) rotateY(0deg)'
                  : 'translateY(-30px) scale(1.05) rotateY(90deg)',
                transitionDuration: '500ms',
                transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <div
                className="rounded-2xl border-3 flex flex-col items-center justify-center gap-2 p-4"
                style={{
                  width: '200px',
                  height: '140px',
                  background: 'linear-gradient(135deg, oklch(0.99 0.04 55), oklch(0.97 0.06 30))',
                  borderColor: 'oklch(0.75 0.20 55)',
                  borderWidth: '3px',
                  boxShadow: '0 12px 40px oklch(0.6 0.20 55 / 0.5)',
                }}
              >
                <p
                  className="font-black text-center leading-tight"
                  style={{
                    color: 'oklch(0.45 0.22 55)',
                    fontFamily: "'Noto Sans TC', sans-serif",
                    fontSize: '15px',
                  }}
                >
                  🗺️ {card.name}
                </p>
                <p
                  className="text-xs text-center"
                  style={{ color: 'oklch(0.60 0.08 220)' }}
                >
                  {card.description}
                </p>

                {/* Color chips */}
                <div className="flex gap-1.5 flex-wrap justify-center">
                  {presentColors.map((c) => {
                    const s = COLOR_STYLES[c];
                    return (
                      <div
                        key={c}
                        className="flex items-center gap-1 rounded-full px-2 py-0.5 border"
                        style={{
                          background: s.bg,
                          borderColor: s.border,
                        }}
                      >
                        <div
                          className="rounded-full"
                          style={{ width: '8px', height: '8px', background: s.dot }}
                        />
                        <span
                          className="text-xs font-bold"
                          style={{ color: s.text }}
                        >
                          {COLOR_LABELS[c]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Revealed message */}
        <div
          className="text-center transition-all duration-500"
          style={{
            opacity: isRevealed ? 1 : 0,
            transform: isRevealed ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
          }}
        >
          <p
            className="text-xl font-black animate-pulse"
            style={{
              color: 'oklch(0.92 0.12 55)',
              textShadow: '0 2px 12px oklch(0.7 0.20 55 / 0.5)',
              fontFamily: "'Noto Sans TC', sans-serif",
            }}
          >
            🎯 戰場已確定！
          </p>
          <p className="text-sm mt-1" style={{ color: 'oklch(0.75 0.05 220)' }}>
            準備戰鬥...
          </p>
        </div>

        {/* Skip button */}
        <button
          onClick={onComplete}
          className="rounded-full px-4 py-1.5 text-xs font-bold border transition-all hover:scale-105"
          style={{
            background: 'oklch(0.25 0.05 220 / 0.6)',
            borderColor: 'oklch(0.50 0.08 220)',
            color: 'oklch(0.80 0.05 220)',
          }}
        >
          跳過動畫
        </button>
      </div>
    </div>
  );
}
