// ============================================================
// 百分戰局 — Context Card Display (Candy Pop Design, Landscape)
// Shows colored blocks for students to COUNT themselves (no numbers shown)
// Optimized for landscape / horizontal tablet display
// ============================================================

import { useEffect, useState } from 'react';
import { ContextCard } from '@/lib/gameData';
import { useGame } from '@/contexts/GameContext';

interface ContextCardDisplayProps {
  card: ContextCard;
  compact?: boolean;
}

// ============================================================
// Color block grid — landscape optimized
// ============================================================
function ColorBlockGrid({ card }: { card: ContextCard }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setRevealed(false);
    const t = setTimeout(() => setRevealed(true), 80);
    return () => clearTimeout(t);
  }, [card.id]);

  // Build block array grouped by color
  const blocks: ('red' | 'yellow' | 'blue')[] = [];
  if (card.colors.red) for (let i = 0; i < card.colors.red; i++) blocks.push('red');
  if (card.colors.yellow) for (let i = 0; i < card.colors.yellow; i++) blocks.push('yellow');
  if (card.colors.blue) for (let i = 0; i < card.colors.blue; i++) blocks.push('blue');

  const total = blocks.length;

  // For landscape: use MORE columns to spread blocks horizontally
  let cols: number;
  if (total <= 10) cols = 5;
  else if (total <= 20) cols = 10;
  else if (total <= 35) cols = 7;
  else if (total <= 50) cols = 10;
  else if (total <= 100) cols = 20;
  else cols = 25;

  // Block size — larger when fewer blocks, smaller when many
  let blockW: number;
  let blockH: number;
  if (total <= 15) { blockW = 38; blockH = 38; }
  else if (total <= 35) { blockW = 32; blockH = 32; }
  else if (total <= 50) { blockW = 28; blockH = 28; }
  else if (total <= 100) { blockW = 22; blockH = 22; }
  else { blockW = 16; blockH = 16; }

  const colorMap = {
    red: 'color-block-red',
    yellow: 'color-block-yellow',
    blue: 'color-block-blue',
  };

  const colorLabel = {
    red: { text: '紅色', textColor: 'oklch(0.55 0.25 28)', dotColor: 'oklch(0.65 0.25 28)' },
    yellow: { text: '黃色', textColor: 'oklch(0.55 0.22 75)', dotColor: 'oklch(0.78 0.22 75)' },
    blue: { text: '藍色', textColor: 'oklch(0.50 0.22 240)', dotColor: 'oklch(0.62 0.22 240)' },
  };

  const presentColors = (['red', 'yellow', 'blue'] as const).filter(
    (c) => (card.colors[c] ?? 0) > 0
  );

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* Color legend — horizontal, no numbers */}
      <div className="flex gap-5 flex-wrap justify-center">
        {presentColors.map((color) => (
          <div key={color} className="flex items-center gap-1.5">
            <div
              className="w-4 h-4 rounded-sm shadow-sm"
              style={{ backgroundColor: colorLabel[color].dotColor, border: '1.5px solid rgba(0,0,0,0.12)' }}
            />
            <span
              className="text-sm font-bold"
              style={{ color: colorLabel[color].textColor, fontFamily: "'Noto Sans TC', sans-serif" }}
            >
              {colorLabel[color].text}
            </span>
          </div>
        ))}
      </div>

      {/* Block grid — wide horizontal layout */}
      <div
        className="grid gap-1 justify-center"
        style={{ gridTemplateColumns: `repeat(${cols}, ${blockW}px)` }}
      >
        {blocks.map((color, i) => (
          <div
            key={i}
            className={`color-block ${colorMap[color]} rounded-sm ${revealed ? 'animate-block-reveal' : 'opacity-0'}`}
            style={{
              width: `${blockW}px`,
              height: `${blockH}px`,
              animationDelay: revealed ? `${Math.min(i * 0.012, 1.2)}s` : '0s',
              border: '1.5px solid rgba(0,0,0,0.15)',
            }}
          />
        ))}
      </div>

      {/* Hint */}
      <p
        className="text-xs text-center italic"
        style={{ color: 'oklch(0.65 0.08 220)' }}
      >
        請自己數一數各顏色有幾格！
      </p>
    </div>
  );
}

// ============================================================
// Main ContextCardDisplay — landscape optimized
// ============================================================
export default function ContextCardDisplay({ card, compact = false }: ContextCardDisplayProps) {
  const { drawNewCard } = useGame();
  const [isFlipping, setIsFlipping] = useState(false);

  const handleNewCard = () => {
    setIsFlipping(true);
    setTimeout(() => {
      drawNewCard();
      setIsFlipping(false);
    }, 300);
  };

  if (compact) {
    return (
      <div className="chalk-card p-3 w-full">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-600 text-xs font-semibold">🗺️ 情境地圖</span>
          <span
            className="text-xs font-bold"
            style={{ color: 'oklch(0.55 0.20 55)' }}
          >
            {card.name}
          </span>
        </div>
        <ColorBlockGrid card={card} />
      </div>
    );
  }

  return (
    <div
      className={`chalk-card w-full h-full flex flex-col transition-all duration-300 ${
        isFlipping ? 'scale-95 opacity-70' : 'scale-100 opacity-100'
      }`}
      style={{ padding: '12px 16px' }}
    >
      {/* Card header — compact horizontal */}
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xl">🗺️</span>
          <div>
            <h3
              className="text-slate-800 font-black text-base leading-tight"
              style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
            >
              情境地圖牌
            </h3>
            <p className="text-slate-400 text-[11px]">{card.name} · {card.description}</p>
          </div>
        </div>
        <button
          onClick={handleNewCard}
          className="chalk-btn text-xs px-3 py-1.5 flex items-center gap-1 flex-shrink-0 border font-semibold transition-all hover:scale-105"
          style={{
            background: 'oklch(0.97 0.04 220)',
            borderColor: 'oklch(0.82 0.10 220)',
            color: 'oklch(0.50 0.12 220)',
          }}
        >
          🔀 換牌
        </button>
      </div>

      {/* Thin divider */}
      <div className="w-full h-px bg-slate-200 mb-2 flex-shrink-0" />

      {/* Block grid — fills remaining space */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <ColorBlockGrid card={card} />
      </div>

      {/* Note if any */}
      {card.note && (
        <div
          className="mt-2 rounded-lg px-3 py-1.5 flex-shrink-0 border"
          style={{
            background: 'oklch(0.97 0.08 75)',
            borderColor: 'oklch(0.85 0.14 75)',
          }}
        >
          <p
            className="text-xs"
            style={{ color: 'oklch(0.55 0.18 75)' }}
          >
            💡 {card.note}
          </p>
        </div>
      )}
    </div>
  );
}
