// ============================================================
// 百分戰局 — Player Zone Component
// Design: Playful Classroom Chalkboard
// Each player has a zone on their side of the screen
// Tapping the zone triggers win declaration
// ============================================================

import { Player, getPlayerConfig } from '@/lib/gameData';
import { useGame } from '@/contexts/GameContext';

interface PlayerZoneProps {
  player: Player;
  position: 'top' | 'bottom' | 'left' | 'right';
  isActive?: boolean;
}

export default function PlayerZone({ player, position, isActive }: PlayerZoneProps) {
  const { declareWin } = useGame();
  const config = getPlayerConfig(player.id);

  const handleDeclare = () => {
    declareWin(player.id);
  };

  // Rotation for side players
  const rotationClass = {
    top: 'rotate-180',
    bottom: '',
    left: 'rotate-90',
    right: '-rotate-90',
  }[position];

  // Layout direction
  const isVertical = position === 'left' || position === 'right';

  return (
    <div
      className={`
        player-zone player-zone-${player.id}
        ${isActive ? 'animate-pulse-glow' : ''}
        flex flex-col items-center gap-2
        ${isVertical ? 'py-4 px-2' : 'px-4 py-2'}
      `}
      style={{ color: config.color }}
    >
      {/* Player info - rotated for side positions */}
      <div className={`flex flex-col items-center gap-1 ${rotationClass}`}>
        {/* Player avatar / icon */}
        <button
          onClick={handleDeclare}
          className={`
            w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center gap-0.5
            transition-all duration-200 hover:scale-110 active:scale-95
            shadow-lg
          `}
          style={{
            borderColor: config.color,
            backgroundColor: `${config.color}22`,
            boxShadow: isActive ? `0 0 20px ${config.color}80` : `0 4px 12px ${config.color}40`,
          }}
          title={`${player.name} — 點擊宣告勝利！`}
        >
          <span className="text-2xl">{player.emoji}</span>
          <span className="text-xs font-bold text-white/80 leading-none">百分百!</span>
        </button>

        {/* Player name */}
        <span
          className="text-xs font-bold"
          style={{ color: config.color, fontFamily: "'Noto Sans TC', sans-serif" }}
        >
          {player.name}
        </span>

        {/* Score */}
        <div
          className="px-2 py-0.5 rounded-full text-xs font-black"
          style={{
            backgroundColor: `${config.color}22`,
            color: config.color,
            border: `1px solid ${config.color}44`,
          }}
        >
          {player.score} 分
        </div>
      </div>
    </div>
  );
}
