// ============================================================
// 百分戰局 — Context Card Display (Candy Pop Design, Landscape)
// LAYOUT: Each color group shown separately, 5 blocks per column
// Students count using multiples of 5 (e.g. 11 red = 2 cols + 1)
// Block size adjustable via +/- buttons for different devices
// ============================================================

import { useEffect, useState } from 'react';
import { ContextCard } from '@/lib/gameData';
import { useGame } from '@/contexts/GameContext';

interface ContextCardDisplayProps {
  card: ContextCard;
  compact?: boolean;
}

// ============================================================
// Color configuration
// ============================================================
const COLOR_CONFIG = {
  red: {
    label: '紅色',
    blockBg: 'oklch(0.65 0.25 28)',
    blockBorder: 'oklch(0.50 0.25 28)',
    labelColor: 'oklch(0.48 0.22 28)',
    headerBg: 'oklch(0.96 0.05 28)',
    headerBorder: 'oklch(0.88 0.10 28)',
  },
  yellow: {
    label: '黃色',
    blockBg: 'oklch(0.82 0.20 75)',
    blockBorder: 'oklch(0.65 0.20 75)',
    labelColor: 'oklch(0.50 0.18 75)',
    headerBg: 'oklch(0.97 0.05 75)',
    headerBorder: 'oklch(0.88 0.12 75)',
  },
  blue: {
    label: '藍色',
    blockBg: 'oklch(0.62 0.22 240)',
    blockBorder: 'oklch(0.48 0.22 240)',
    labelColor: 'oklch(0.45 0.20 240)',
    headerBg: 'oklch(0.96 0.05 240)',
    headerBorder: 'oklch(0.85 0.12 240)',
  },
};

// ============================================================
// ColorBlockGrid — main block rendering component
// Each color group is shown as columns of 5 blocks
// blockSize is passed in from parent (adjustable via +/- buttons)
// ============================================================
function ColorBlockGrid({ card, blockSize }: { card: ContextCard; blockSize: number }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setRevealed(false);
    const t = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(t);
  }, [card.id]);

  const ROWS_PER_COL = 5;
  const GAP = 4; // px gap between blocks within a group
  const GROUP_GAP = 16; // px gap between color groups

  const presentColors = (['red', 'yellow', 'blue'] as const).filter(
    (c) => (card.colors[c] ?? 0) > 0
  );

  // Cumulative animation offset for staggered reveal
  let animOffset = 0;

  return (
    <div className="flex flex-col items-center gap-3 w-full h-full overflow-hidden">
      {/* All color groups side by side */}
      <div
        className="flex items-start justify-center flex-nowrap overflow-x-auto px-2 pb-1"
        style={{ gap: `${GROUP_GAP}px` }}
      >
        {presentColors.map((colorKey) => {
          const cfg = COLOR_CONFIG[colorKey];
          const count = card.colors[colorKey] ?? 0;
          const totalCols = Math.ceil(count / ROWS_PER_COL);
          const startOffset = animOffset;
          animOffset += count;

          return (
            <div
              key={colorKey}
              className="flex flex-col items-center flex-shrink-0"
              style={{ gap: '8px' }}
            >
              {/* Color label — always visible, never truncated */}
              <div
                className="rounded-full border font-black"
                style={{
                  background: cfg.headerBg,
                  borderColor: cfg.headerBorder,
                  color: cfg.labelColor,
                  fontFamily: "'Noto Sans TC', sans-serif",
                  fontSize: `${Math.max(11, Math.min(15, blockSize * 0.5))}px`,
                  padding: '3px 10px',
                  whiteSpace: 'nowrap',
                  lineHeight: '1.4',
                }}
              >
                {cfg.label}
              </div>

              {/* Block columns — 5 rows per column */}
              <div
                className="flex items-start"
                style={{ gap: `${GAP}px` }}
              >
                {Array.from({ length: totalCols }, (_, colIdx) => (
                  <div
                    key={colIdx}
                    className="flex flex-col"
                    style={{ gap: `${GAP}px` }}
                  >
                    {Array.from({ length: ROWS_PER_COL }, (_, rowIdx) => {
                      const blockIndex = colIdx * ROWS_PER_COL + rowIdx;
                      const filled = blockIndex < count;
                      const animDelay =
                        revealed && filled
                          ? `${Math.min((startOffset + blockIndex) * 0.022, 2.0)}s`
                          : '0s';

                      return (
                        <div
                          key={rowIdx}
                          className={`rounded-md ${
                            filled
                              ? revealed
                                ? 'animate-block-reveal'
                                : 'opacity-0'
                              : 'invisible'
                          }`}
                          style={{
                            width: `${blockSize}px`,
                            height: `${blockSize}px`,
                            backgroundColor: filled ? cfg.blockBg : 'transparent',
                            border: filled ? `2px solid ${cfg.blockBorder}` : 'none',
                            animationDelay: animDelay,
                            boxShadow: filled
                              ? `0 2px 5px ${cfg.blockBg}45`
                              : 'none',
                          }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Counting hint */}
      <p
        className="text-xs text-center italic flex-shrink-0"
        style={{
          color: 'oklch(0.60 0.08 220)',
          fontFamily: "'Noto Sans TC', sans-serif",
        }}
      >
        每直行有 5 格，請自己數一數各顏色有幾格！
      </p>
    </div>
  );
}

// ============================================================
// Zoom control button
// ============================================================
function ZoomBtn({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-8 h-8 rounded-full font-black text-lg flex items-center justify-center transition-all select-none"
      style={{
        background: disabled ? 'oklch(0.93 0.02 220)' : 'oklch(0.96 0.06 220)',
        border: '2px solid oklch(0.82 0.10 220)',
        color: disabled ? 'oklch(0.75 0.05 220)' : 'oklch(0.45 0.15 220)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        lineHeight: 1,
      }}
    >
      {label}
    </button>
  );
}

// ============================================================
// Main ContextCardDisplay — landscape optimized
// ============================================================
const BLOCK_SIZE_MIN = 14;
const BLOCK_SIZE_MAX = 48;
const BLOCK_SIZE_STEP = 4;

export default function ContextCardDisplay({ card, compact = false }: ContextCardDisplayProps) {
  const { drawNewCard } = useGame();
  const [isFlipping, setIsFlipping] = useState(false);
  const [blockSize, setBlockSize] = useState(26); // default size

  const handleNewCard = () => {
    setIsFlipping(true);
    setTimeout(() => {
      drawNewCard();
      setIsFlipping(false);
    }, 300);
  };

  const zoomIn = () => setBlockSize(s => Math.min(BLOCK_SIZE_MAX, s + BLOCK_SIZE_STEP));
  const zoomOut = () => setBlockSize(s => Math.max(BLOCK_SIZE_MIN, s - BLOCK_SIZE_STEP));

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
        <ColorBlockGrid card={card} blockSize={blockSize} />
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
      {/* Card header */}
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
            <p className="text-slate-400 text-[11px]">
              {card.name} · {card.description}
            </p>
          </div>
        </div>

        {/* Right side: zoom controls + change card button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Zoom controls */}
          <div className="flex items-center gap-1">
            <ZoomBtn label="−" onClick={zoomOut} disabled={blockSize <= BLOCK_SIZE_MIN} />
            <span
              className="text-xs font-semibold w-8 text-center"
              style={{ color: 'oklch(0.55 0.10 220)' }}
            >
              {blockSize}
            </span>
            <ZoomBtn label="+" onClick={zoomIn} disabled={blockSize >= BLOCK_SIZE_MAX} />
          </div>

          {/* Change card button */}
          <button
            onClick={handleNewCard}
            className="chalk-btn text-xs px-3 py-1.5 flex items-center gap-1 border font-semibold transition-all hover:scale-105"
            style={{
              background: 'oklch(0.97 0.04 220)',
              borderColor: 'oklch(0.82 0.10 220)',
              color: 'oklch(0.50 0.12 220)',
            }}
          >
            🔀 換牌
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-slate-200 mb-2 flex-shrink-0" />

      {/* Block grid — fills remaining space */}
      <div className="flex-1 flex items-center justify-center overflow-hidden min-h-0">
        <ColorBlockGrid card={card} blockSize={blockSize} />
      </div>

      {/* Note */}
      {card.note && (
        <div
          className="mt-2 rounded-lg px-3 py-1.5 flex-shrink-0 border"
          style={{
            background: 'oklch(0.97 0.08 75)',
            borderColor: 'oklch(0.85 0.14 75)',
          }}
        >
          <p className="text-xs" style={{ color: 'oklch(0.55 0.18 75)' }}>
            💡 {card.note}
          </p>
        </div>
      )}
    </div>
  );
}
