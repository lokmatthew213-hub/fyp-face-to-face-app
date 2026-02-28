// ============================================================
// 百分戰局 — Setup Screen (Candy Pop Design)
// Bright, cheerful colors for primary school students
// Includes player name input fields (optional, defaults to "玩家 N")
// ============================================================

import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { PlayerCount, PLAYER_CONFIGS } from '@/lib/gameData';

// Layout preview for each player count
function LayoutPreview({ count }: { count: PlayerCount }) {
  const configs = PLAYER_CONFIGS.slice(0, count);

  if (count === 2) {
    return (
      <div className="flex flex-col items-center gap-2 p-2">
        <PlayerDot config={configs[0]} label="玩家1" />
        <div className="w-12 h-px bg-slate-200" />
        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs text-slate-400">桌</div>
        <div className="w-12 h-px bg-slate-200" />
        <PlayerDot config={configs[1]} label="玩家2" />
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className="flex flex-col items-center gap-1 p-2">
        <PlayerDot config={configs[0]} label="玩家1" />
        <div className="flex items-center gap-3">
          <PlayerDot config={configs[1]} label="玩家2" />
          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs text-slate-400">桌</div>
          <PlayerDot config={configs[2]} label="玩家3" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1 p-2">
      <PlayerDot config={configs[0]} label="玩家1" />
      <div className="flex items-center gap-2">
        <PlayerDot config={configs[3]} label="玩家4" />
        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs text-slate-400">桌</div>
        <PlayerDot config={configs[1]} label="玩家2" />
      </div>
      <PlayerDot config={configs[2]} label="玩家3" />
    </div>
  );
}

function PlayerDot({ config, label }: { config: typeof PLAYER_CONFIGS[0]; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm"
        style={{ borderColor: config.color, backgroundColor: `${config.color}25` }}
      >
        {config.emoji}
      </div>
      <span className="text-[10px] text-slate-400 font-semibold">{label}</span>
    </div>
  );
}

export default function SetupScreen() {
  const { state, setPlayerCount, setPlayerNames, startGame } = useGame();
  const [selected, setSelected] = useState<PlayerCount>(2);
  const [names, setNames] = useState<string[]>(['', '', '', '']);

  const handleSelect = (count: PlayerCount) => {
    setSelected(count);
    setPlayerCount(count);
  };

  const handleNameChange = (idx: number, value: string) => {
    const updated = [...names];
    updated[idx] = value;
    setNames(updated);
  };

  const handleStart = () => {
    setPlayerCount(selected);
    setPlayerNames(names.slice(0, selected));
    startGame();
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, oklch(0.96 0.07 220) 0%, oklch(0.93 0.09 250) 40%, oklch(0.95 0.07 280) 70%, oklch(0.96 0.06 200) 100%)',
      }}
    >
      {/* Decorative bubbles */}
      <div className="absolute top-8 left-8 w-20 h-20 rounded-full opacity-30 animate-float"
        style={{ background: 'radial-gradient(circle, oklch(0.72 0.22 28), transparent)', animationDelay: '0s' }} />
      <div className="absolute top-16 right-12 w-14 h-14 rounded-full opacity-25 animate-float"
        style={{ background: 'radial-gradient(circle, oklch(0.75 0.22 55), transparent)', animationDelay: '1s' }} />
      <div className="absolute bottom-12 left-16 w-16 h-16 rounded-full opacity-25 animate-float"
        style={{ background: 'radial-gradient(circle, oklch(0.58 0.24 255), transparent)', animationDelay: '2s' }} />
      <div className="absolute bottom-8 right-8 w-12 h-12 rounded-full opacity-30 animate-float"
        style={{ background: 'radial-gradient(circle, oklch(0.68 0.22 145), transparent)', animationDelay: '0.5s' }} />

      {/* Title */}
      <div className="text-center mb-6 animate-fade-in-up">
        <h1
          className="font-black text-5xl md:text-7xl mb-1 leading-none"
          style={{
            fontFamily: "'Nunito', 'Noto Sans TC', sans-serif",
            background: 'linear-gradient(135deg, oklch(0.68 0.24 28) 0%, oklch(0.75 0.22 55) 40%, oklch(0.58 0.24 255) 80%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 2px 8px oklch(0.68 0.24 28 / 0.25))',
          }}
        >
          百分戰局
        </h1>
        <p
          className="text-slate-500 text-lg font-bold tracking-widest"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          Percent Battle
        </p>
      </div>

      {/* Setup card */}
      <div
        className="chalk-card w-full max-w-lg p-6 animate-fade-in-scale"
        style={{ animationDelay: '0.15s', opacity: 0 }}
      >
        <h2
          className="text-center text-xl font-black text-slate-700 mb-1"
          style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
        >
          🎮 選擇玩家人數
        </h2>
        <p className="text-center text-slate-400 text-sm mb-5">
          選擇今天有多少位指揮官參戰！
        </p>

        {/* Player count options */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {([2, 3, 4] as PlayerCount[]).map((count) => (
            <button
              key={count}
              onClick={() => handleSelect(count)}
              className={`
                chalk-btn flex flex-col items-center gap-1 py-3 border-2 transition-all duration-200
                ${selected === count
                  ? 'border-transparent scale-105 shadow-lg'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                }
              `}
              style={selected === count ? {
                background: 'linear-gradient(135deg, oklch(0.96 0.10 220), oklch(0.93 0.12 250))',
                borderColor: 'oklch(0.70 0.18 240)',
                boxShadow: '0 4px 20px oklch(0.60 0.18 240 / 0.25)',
              } : {}}
            >
              <span
                className="text-3xl font-black leading-none"
                style={{ color: selected === count ? 'oklch(0.45 0.20 250)' : 'oklch(0.35 0.05 250)' }}
              >
                {count}
              </span>
              <span
                className="text-sm font-bold"
                style={{ color: selected === count ? 'oklch(0.50 0.18 250)' : 'oklch(0.55 0.05 250)' }}
              >
                {count === 2 ? '對決' : count === 3 ? '三角' : '四方'}
              </span>
              <div className="mt-1">
                <LayoutPreview count={count} />
              </div>
            </button>
          ))}
        </div>

        {/* Selected layout info */}
        <div
          className="rounded-xl p-3 mb-5 text-center"
          style={{
            background: 'linear-gradient(135deg, oklch(0.96 0.08 220), oklch(0.94 0.10 250))',
            border: '1.5px solid oklch(0.82 0.10 230)',
          }}
        >
          <p className="text-slate-600 text-sm font-semibold">
            {selected === 2 && '⚔️ 兩位指揮官面對面對決！'}
            {selected === 3 && '🔺 三位指揮官三角鼎立！'}
            {selected === 4 && '🏟️ 四位指揮官四方混戰！'}
          </p>
        </div>

        {/* Player name inputs */}
        <div className="mb-5">
          <p
            className="text-slate-600 text-sm font-bold mb-3 text-center"
            style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
          >
            ✏️ 輸入玩家名字（可選，留空則用預設名字）
          </p>
          <div className="grid grid-cols-2 gap-3">
            {PLAYER_CONFIGS.slice(0, selected).map((cfg, idx) => (
              <div key={cfg.id} className="flex items-center gap-2">
                <div
                  className="w-9 h-9 rounded-xl border-2 flex items-center justify-center text-lg flex-shrink-0"
                  style={{
                    borderColor: cfg.color,
                    backgroundColor: `${cfg.color}18`,
                  }}
                >
                  {cfg.emoji}
                </div>
                <input
                  type="text"
                  value={names[idx]}
                  onChange={(e) => handleNameChange(idx, e.target.value)}
                  placeholder={cfg.name}
                  maxLength={8}
                  className="flex-1 min-w-0 rounded-xl border-2 px-3 py-2 text-sm font-semibold outline-none transition-all"
                  style={{
                    borderColor: names[idx].trim() ? cfg.color : 'oklch(0.88 0.04 220)',
                    backgroundColor: names[idx].trim() ? `${cfg.color}08` : 'oklch(0.98 0.02 220)',
                    color: 'oklch(0.30 0.05 220)',
                    fontFamily: "'Noto Sans TC', sans-serif",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = cfg.color;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${cfg.color}20`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = names[idx].trim() ? cfg.color : 'oklch(0.88 0.04 220)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          className="w-full py-4 text-xl font-black text-white rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-95"
          style={{
            fontFamily: "'Noto Sans TC', sans-serif",
            background: 'linear-gradient(135deg, oklch(0.68 0.24 28), oklch(0.72 0.22 15))',
            boxShadow: '0 6px 24px oklch(0.68 0.24 28 / 0.45), 0 2px 8px oklch(0.68 0.24 28 / 0.25)',
          }}
        >
          🚀 開始戰局！
        </button>
      </div>

      {/* Footer */}
      <p className="mt-4 text-slate-400 text-xs animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
        達到 50 分者勝利 · 約 15 分鐘
      </p>
    </div>
  );
}
