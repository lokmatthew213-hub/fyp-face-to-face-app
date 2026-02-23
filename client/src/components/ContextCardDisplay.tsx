// ============================================================
// 百分戰局 — Context Card Display
// Design: Playful Classroom Chalkboard
// Shows colored blocks for students to COUNT themselves (no numbers shown)
// ============================================================

import { useEffect, useState } from 'react';
import { ContextCard } from '@/lib/gameData';
import { useGame } from '@/contexts/GameContext';

interface ContextCardDisplayProps {
  card: ContextCard;
  compact?: boolean;
}

// Color block grid - students must count the blocks themselves
function ColorBlockGrid({ card }: { card: ContextCard }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    // Trigger reveal animation after mount
    const t = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(t);
  }, [card.id]);

  // Build the array of colored blocks
  const blocks: ('red' | 'yellow' | 'blue')[] = [];

  // Add blocks grouped by color for easier counting
  if (card.colors.red) {
    for (let i = 0; i < card.colors.red; i++) blocks.push('red');
  }
  if (card.colors.yellow) {
    for (let i = 0; i < card.colors.yellow; i++) blocks.push('yellow');
  }
  if (card.colors.blue) {
    for (let i = 0; i < card.colors.blue; i++) blocks.push('blue');
  }

  // Determine grid columns based on total blocks
  const total = blocks.length;
  let cols = 10;
  if (total <= 20) cols = 5;
  if (total > 100) cols = 10;

  // Determine block size based on total
  let blockSize = 'w-7 h-7';
  if (total > 100) blockSize = 'w-5 h-5';
  if (total <= 20) blockSize = 'w-9 h-9';

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
    <div className="flex flex-col items-center gap-4">
      {/* Color legend - only show color names, no numbers */}
      <div className="flex gap-4 flex-wrap justify-center">
        {presentColors.map((color) => (
          <div key={color} className="flex items-center gap-1.5">
            <div className={`w-4 h-4 rounded-sm ${colorLabel[color].dot}`} />
            <span className={`text-sm font-bold ${colorLabel[color].cls}`}>
              {colorLabel[color].text}
            </span>
          </div>
        ))}
      </div>

      {/* Block grid */}
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {blocks.map((color, i) => (
          <div
            key={i}
            className={`
              color-block ${colorMap[color]} ${blockSize}
              ${revealed ? 'animate-block-reveal' : 'opacity-0'}
            `}
            style={{
              animationDelay: revealed ? `${Math.min(i * 0.015, 1.5)}s` : '0s',
            }}
          />
        ))}
      </div>

      {/* Hint text */}
      <p className="text-white/50 text-xs text-center italic">
        請自己數一數各顏色有幾格！
      </p>
    </div>
  );
}

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
      <div className="chalk-card p-3">
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
      className={`chalk-card p-5 transition-all duration-300 ${isFlipping ? 'scale-95 opacity-70' : 'scale-100 opacity-100'}`}
    >
      {/* Card header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🗺️</span>
          <div>
            <h3
              className="text-white font-black text-lg leading-tight"
              style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
            >
              情境地圖牌
            </h3>
            <p className="text-white/50 text-xs">{card.name} · {card.description}</p>
          </div>
        </div>
        <button
          onClick={handleNewCard}
          className="chalk-btn bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm px-3 py-1.5 flex items-center gap-1"
        >
          🔀 換牌
        </button>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-white/10 mb-4" />

      {/* Color blocks */}
      <ColorBlockGrid card={card} />

      {/* Note if any (teacher hint, hidden from students in production) */}
      {card.note && (
        <div className="mt-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2">
          <p className="text-yellow-400/70 text-xs">💡 {card.note}</p>
        </div>
      )}
    </div>
  );
}
