// ============================================================
// 百分戰局 — Context Card Display (Landscape Layout)
// Design: Playful Classroom Chalkboard
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
  if (total <= 15) { blockW = 36; blockH = 36; }
  else if (total <= 35) { blockW = 30; blockH = 30; }
  else if (total <= 50) { blockW = 26; blockH = 26; }
  else if (total <= 100) { blockW = 20; blockH = 20; }
  else { blockW = 16; blockH = 16; }

  const colorMap = {
    red: 'color-block-red',
    yellow: 'color-block-yellow',
    blue: 'color-block-blue',
  };

  const colorLabel = {
    red: { text: '紅色', cls: 'text-red-400', dot: 'bg-red-500' },
    yellow: { text: '黃色', cls: 'text-yellow-400', dot: 'bg-yellow-400' },
    blue: { text: '藍色', cls: 'text-blue-400', dot: 'bg-blue-500' },
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
            <div className={`w-4 h-4 rounded-sm ${colorLabel[color].dot}`} />
            <span className={`text-sm font-bold ${colorLabel[color].cls}`} style={{ fontFamily: "'Noto Sans TC', sans-serif" }}>
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
            className={`color-block ${colorMap[color]} rounded-sm border ${revealed ? 'animate-block-reveal' : 'opacity-0'}`}
            style={{
              width: `${blockW}px`,
              height: `${blockH}px`,
              animationDelay: revealed ? `${Math.min(i * 0.012, 1.2)}s` : '0s',
              borderColor: 'rgba(0,0,0,0.2)',
            }}
          />
        ))}
      </div>

      {/* Hint */}
      <p className="text-white/40 text-xs text-center italic">
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
          <span className="text-white/70 text-xs font-semibold">🗺️ 情境地圖</span>
          <span className="text-yellow-400 text-xs font-bold">{card.name}</span>
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
              className="text-white font-black text-base leading-tight"
              style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
            >
              情境地圖牌
            </h3>
            <p className="text-white/50 text-[11px]">{card.name} · {card.description}</p>
          </div>
        </div>
        <button
          onClick={handleNewCard}
          className="chalk-btn bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs px-3 py-1.5 flex items-center gap-1 flex-shrink-0"
        >
          🔀 換牌
        </button>
      </div>

      {/* Thin divider */}
      <div className="w-full h-px bg-white/10 mb-2 flex-shrink-0" />

      {/* Block grid — fills remaining space */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <ColorBlockGrid card={card} />
      </div>

      {/* Note if any */}
      {card.note && (
        <div className="mt-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-1.5 flex-shrink-0">
          <p className="text-yellow-400/70 text-xs">💡 {card.note}</p>
        </div>
      )}
    </div>
  );
}
