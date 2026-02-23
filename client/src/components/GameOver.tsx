// ============================================================
// 百分戰局 — Game Over Screen
// Shows winner and final scores, allows returning to home
// ============================================================

import { useGame } from '@/contexts/GameContext';
import { getPlayerConfig, WIN_SCORE } from '@/lib/gameData';
import { useEffect, useState } from 'react';

function Confetti() {
  const [particles, setParticles] = useState<Array<{
    id: number; x: number; color: string; delay: number; duration: number; size: number;
  }>>([]);

  useEffect(() => {
    const colors = ['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#f97316'];
    const newParticles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      size: 6 + Math.random() * 8,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: '-20px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            animation: `confettiFall ${p.duration}s ease-in ${p.delay}s infinite`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export default function GameOver() {
  const { state, resetGame } = useGame();
  const winnerId = state.winnerId;
  const winner = state.players.find((p) => p.id === winnerId);
  const winnerCfg = winnerId ? getPlayerConfig(winnerId) : null;

  // Sort players by total score descending
  const sortedPlayers = [...state.players].sort((a, b) => b.totalScore - a.totalScore);

  const rankEmojis = ['🥇', '🥈', '🥉', '4️⃣'];

  return (
    <>
      <Confetti />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 win-overlay overflow-y-auto">
        <div className="relative w-full max-w-sm my-4 animate-bounce-in">
          <div className="chalk-card p-6">
            {/* Winner announcement */}
            {winner && winnerCfg && (
              <div className="text-center mb-6">
                <div className="text-6xl mb-3 animate-bounce">🏆</div>
                <h2
                  className="font-black text-2xl mb-1"
                  style={{ color: winnerCfg.color, fontFamily: "'Noto Sans TC', sans-serif" }}
                >
                  {winner.name} 獲勝！
                </h2>
                <p className="text-white/60 text-sm">
                  達到 <span className="text-yellow-400 font-black">{winner.totalScore}</span> 分！
                </p>
                <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full border"
                  style={{
                    backgroundColor: `${winnerCfg.color}20`,
                    borderColor: `${winnerCfg.color}60`,
                  }}
                >
                  <span className="text-2xl">{winnerCfg.emoji}</span>
                  <span className="font-black text-white">{winner.name}</span>
                  <span className="font-black" style={{ color: winnerCfg.color }}>
                    {winner.totalScore} 分
                  </span>
                </div>
              </div>
            )}

            <div className="w-full h-px bg-white/10 mb-5" />

            {/* Final leaderboard */}
            <h3
              className="text-white/70 text-sm font-semibold text-center mb-4"
              style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
            >
              最終排名
            </h3>
            <div className="flex flex-col gap-2 mb-6">
              {sortedPlayers.map((p, idx) => {
                const cfg = getPlayerConfig(p.id);
                const pct = Math.min(100, (p.totalScore / WIN_SCORE) * 100);
                const isWinner = p.id === winnerId;
                return (
                  <div
                    key={p.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      isWinner ? 'scale-[1.02]' : ''
                    }`}
                    style={{
                      backgroundColor: `${cfg.color}${isWinner ? '25' : '10'}`,
                      borderColor: `${cfg.color}${isWinner ? '70' : '30'}`,
                      boxShadow: isWinner ? `0 0 16px ${cfg.color}40` : 'none',
                    }}
                  >
                    <span className="text-xl w-7 text-center">{rankEmojis[idx]}</span>
                    <span className="text-xl">{cfg.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm">{p.name}</p>
                      {/* Progress bar */}
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, backgroundColor: cfg.color }}
                        />
                      </div>
                    </div>
                    <span
                      className="font-black text-xl flex-shrink-0"
                      style={{ color: cfg.color, fontFamily: "'Nunito', sans-serif" }}
                    >
                      {p.totalScore}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Game stats */}
            <div className="bg-white/5 rounded-xl p-3 mb-5 border border-white/10 text-center">
              <p className="text-white/50 text-xs">
                共進行了 <span className="text-yellow-400 font-black">{state.round}</span> 個回合
              </p>
            </div>

            {/* Return to home button */}
            <button
              onClick={resetGame}
              className="w-full chalk-btn py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black text-base shadow-lg shadow-yellow-500/30 transition-all"
              style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
            >
              🏠 返回主頁，再玩一次！
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
