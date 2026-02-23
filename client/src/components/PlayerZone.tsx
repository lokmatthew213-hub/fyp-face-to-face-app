// ============================================================
// 百分戰局 — Player Zone Component
// Design: Playful Classroom Chalkboard
// All players are at the bottom — text always faces same direction
// No rotation needed — landscape layout
// ============================================================

import { Player, getPlayerConfig } from '@/lib/gameData';
import { useGame } from '@/contexts/GameContext';

interface PlayerZoneProps {
  player: Player;
  position?: 'top' | 'bottom' | 'left' | 'right'; // kept for backward compat, no longer used for rotation
  isActive?: boolean;
}

export default function PlayerZone({ player, isActive }: PlayerZoneProps) {
  const { declareWin } = useGame();
  const config = getPlayerConfig(player.id);

  const handleDeclare = () => {
    declareWin(player.id);
  };

  return (
    <div
      className={`
        player-zone player-zone-${player.id}
        ${isActive ? 'animate-pulse-glow' : ''}
        flex flex-col items-center gap-1.5
        px-3 py-2
      `}
      style={{ color: config.color }}
    >
      {/* Player avatar button — tap to declare win */}
      <button
        onClick={handleDeclare}
        className={`
          w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center gap-0.5
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
        <span className="text-2xl">{config.emoji}</span>
        <span className="text-[9px] font-bold text-white/70 leading-none">百分百!</span>
      </button>

      {/* Player name */}
      <span
        className="text-xs font-bold leading-none"
        style={{ color: config.color, fontFamily: "'Noto Sans TC', sans-serif" }}
      >
        {player.name}
      </span>

      {/* Round score badge */}
      <div
        className="px-2 py-0.5 rounded-full text-xs font-black leading-none"
        style={{
          backgroundColor: `${config.color}22`,
          color: config.color,
          border: `1px solid ${config.color}44`,
        }}
      >
        {player.score} 分
      </div>
    </div>
  );
}
