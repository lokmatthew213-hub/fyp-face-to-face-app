// ============================================================
// 百分戰局 — Game Board (Landscape Layout)
// Device is held horizontally (landscape)
// ALL players are at the BOTTOM — text always faces the same way
// Context card fills the TOP area as a wide horizontal rectangle
// ============================================================

import { useGame } from '@/contexts/GameContext';
import { getPlayerConfig, WIN_SCORE } from '@/lib/gameData';
import ContextCardDisplay from './ContextCardDisplay';
import PlayerZone from './PlayerZone';
import WinDeclaration from './WinDeclaration';
import RoundEnd from './RoundEnd';
import GameOver from './GameOver';

// ============================================================
// Top bar with game info
// ============================================================
function GameTopBar() {
  const { state, resetGame } = useGame();

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-black/30 backdrop-blur-sm border-b border-white/10 flex-shrink-0">
      <button
        onClick={resetGame}
        className="text-white/50 hover:text-white text-xs flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-white/10"
      >
        ← 返回
      </button>
      <div className="flex items-center gap-2">
        <span className="text-yellow-400 text-sm font-black" style={{ fontFamily: "'Noto Sans TC', sans-serif" }}>
          百分戰局
        </span>
        <span className="text-white/40 text-xs">
          {state.playerCount}人 · 第{state.round}回合
        </span>
      </div>
      {/* Spacer to balance the back button */}
      <div className="w-12" />
    </div>
  );
}

// ============================================================
// Context card area — fills the top section horizontally
// ============================================================
function ContextCardArea() {
  const { state } = useGame();
  if (!state.currentContextCard) return null;

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-2 overflow-hidden min-h-0">
      <div className="w-full h-full max-h-full">
        <ContextCardDisplay card={state.currentContextCard} />
      </div>
    </div>
  );
}

// ============================================================
// Players row — ALL players at the bottom, same direction
// ============================================================
function PlayersRow() {
  const { state } = useGame();

  return (
    <div className="flex-shrink-0 flex items-end justify-around px-3 pb-2 pt-1 border-t border-white/10 bg-black/15">
      {state.players.map((player) => (
        <PlayerZone key={player.id} player={player} />
      ))}
    </div>
  );
}

// ============================================================
// Score bar — compact horizontal bar showing all players
// ============================================================
function ScoreBar() {
  const { state } = useGame();

  return (
    <div className="flex-shrink-0 flex items-center justify-center gap-3 px-4 py-1.5 bg-black/20 border-t border-white/10">
      {state.players.map((p) => {
        const cfg = getPlayerConfig(p.id);
        const pct = Math.min(100, (p.totalScore / WIN_SCORE) * 100);
        return (
          <div key={p.id} className="flex items-center gap-2 flex-1 max-w-[120px]">
            <span className="text-sm flex-shrink-0">{cfg.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-white/60 text-[10px] truncate">{p.name}</span>
                <span
                  className="font-black text-xs flex-shrink-0 ml-1"
                  style={{ color: cfg.color, fontFamily: "'Nunito', sans-serif" }}
                >
                  {p.totalScore}
                </span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: cfg.color }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// Main GameBoard — landscape layout
// ============================================================
export default function GameBoard() {
  const { state } = useGame();

  const isModalOpen = [
    'win-declare', 'fire-photo', 'fire-verify',
    'fire-result', 'fire-subtype', 'trap-result',
  ].includes(state.phase);

  // Game over screen
  if (state.phase === 'game-over') {
    return <GameOver />;
  }

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      {/* Top bar */}
      <GameTopBar />

      {/* Context card — fills available space horizontally */}
      <ContextCardArea />

      {/* Score bar */}
      <ScoreBar />

      {/* Players row — all at bottom, all text same direction */}
      <PlayersRow />

      {/* Win declaration modal */}
      {isModalOpen && <WinDeclaration />}

      {/* Round end summary */}
      {state.phase === 'round-end' && <RoundEnd />}
    </div>
  );
}
