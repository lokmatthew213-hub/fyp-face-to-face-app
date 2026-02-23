// ============================================================
// 百分戰局 — Setup Screen
// Design: Playful Classroom Chalkboard
// Allows students to choose 2-4 players with visual layout preview
// ============================================================

import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { PlayerCount, PLAYER_CONFIGS } from '@/lib/gameData';

const HERO_BG = 'https://private-us-east-1.manuscdn.com/sessionFile/YKZsA5G4m0dseKBDQdO6Uw/sandbox/UfXXk2fX5Z6axyLj7gwYqo-img-1_1771830809000_na1fn_cGItaGVyby1iZw.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvWUtac0E1RzRtMGRzZUtCRFFkTzZVdy9zYW5kYm94L1VmWFhrMmZYNVo2YXh5TGo3Z3dZcW8taW1nLTFfMTc3MTgzMDgwOTAwMF9uYTFmbl9jR0l0YUdWeWJ5MWlady5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=f9XKeV2q7ID4~2r~NuJXF5onpST3BsbiCgRQKZVhp96WUE2lllrME7oo2saotxACIXZME0wyzpuk5S2D3ho9bUDbTeQ1ScK3skFdFvd-Rl8nyOdcLRVBS36q~idIJqoSkBvC-fz412InLkjpTWZet5Hb2gSDV687XqzyTU3iTlJE9hBczWXrn2LCACKPpKa3nC7Uz4CkS5EAIWbhTALvJIPECTeuQDw9IzpRCj7zVgIl2R~zgH5Gl64ePDDBzx9cBiapotp459LenqZcLfMOemJ8vvUK34bJC7PMucOpyTHy-FlcsOfnQFkspg~LGyqqccVOkPtvPoKuuG8ZMjtaxg__';

const PLAYER_SETUP_IMG = 'https://private-us-east-1.manuscdn.com/sessionFile/YKZsA5G4m0dseKBDQdO6Uw/sandbox/UfXXk2fX5Z6axyLj7gwYqo-img-2_1771830821000_na1fn_cGItcGxheWVyLXNldHVw.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvWUtac0E1RzRtMGRzZUtCRFFkTzZVdy9zYW5kYm94L1VmWFhrMmZYNVo2YXh5TGo3Z3dZcW8taW1nLTJfMTc3MTgzMDgyMTAwMF9uYTFmbl9jR0l0Y0d4aGVXVnlMWE5sZEhWdy5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=IbCsQET8PvS4x79q6KMrMBPppd~NNO1ligC6UTtLY-KHr3nS-cqbsLbfmXSDB~d0h0Ok7kvcsStfQBc~FMjMFDScm~F6raV3JIjxPMhtMEk79lC4QY9W4M~GWbA2GOXp7e5fkDoi8tnIcAbkhSzvoJuve2HKvAx~Z5~Rp74ZK4ohWpQAPVenHSWuLIpg7wZcz6FW~tKDlgM0pbJFCWKT3wnjArevo431U5EtpKErB3D7ryBJYV~~AAU4xpsk8cZrLgh4HKgv8uO50LEemPDyF8xkywtyrvJBQpJTla~tlNYNcOmi9x8avCvnoh3Sj3A__';

// Layout preview for each player count
function LayoutPreview({ count }: { count: PlayerCount }) {
  const configs = PLAYER_CONFIGS.slice(0, count);

  if (count === 2) {
    return (
      <div className="flex flex-col items-center gap-2 p-3">
        <PlayerDot config={configs[0]} label="玩家1" />
        <div className="w-16 h-px bg-white/20" />
        <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-xs text-white/50">桌</div>
        <div className="w-16 h-px bg-white/20" />
        <PlayerDot config={configs[1]} label="玩家2" />
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className="flex flex-col items-center gap-1 p-3">
        <PlayerDot config={configs[0]} label="玩家1" />
        <div className="flex items-center gap-4">
          <PlayerDot config={configs[1]} label="玩家2" />
          <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-xs text-white/50">桌</div>
          <PlayerDot config={configs[2]} label="玩家3" />
        </div>
      </div>
    );
  }

  // 4 players
  return (
    <div className="flex flex-col items-center gap-1 p-3">
      <PlayerDot config={configs[0]} label="玩家1" />
      <div className="flex items-center gap-3">
        <PlayerDot config={configs[3]} label="玩家4" />
        <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-xs text-white/50">桌</div>
        <PlayerDot config={configs[1]} label="玩家2" />
      </div>
      <PlayerDot config={configs[2]} label="玩家3" />
    </div>
  );
}

function PlayerDot({ config, label }: { config: typeof PLAYER_CONFIGS[0]; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold"
        style={{ borderColor: config.color, backgroundColor: `${config.color}33` }}
      >
        {config.emoji}
      </div>
      <span className="text-xs text-white/60">{label}</span>
    </div>
  );
}

export default function SetupScreen() {
  const { state, setPlayerCount, startGame } = useGame();
  const [selected, setSelected] = useState<PlayerCount>(2);

  const handleSelect = (count: PlayerCount) => {
    setSelected(count);
    setPlayerCount(count);
  };

  const handleStart = () => {
    setPlayerCount(selected);
    startGame();
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Hero background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Title */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-block bg-black/30 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
            <h1
              className="chalk-title text-4xl md:text-6xl text-white mb-1"
              style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
            >
              百分戰局
            </h1>
            <p className="text-white/70 text-lg md:text-xl font-semibold tracking-widest">
              Percent Battle
            </p>
          </div>
        </div>

        {/* Setup card */}
        <div
          className="chalk-card w-full max-w-lg p-6 animate-fade-in-scale"
          style={{ animationDelay: '0.15s', opacity: 0 }}
        >
          <h2
            className="text-center text-xl font-bold text-white mb-2"
            style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
          >
            🎮 選擇玩家人數
          </h2>
          <p className="text-center text-white/60 text-sm mb-6">
            選擇今天有多少位指揮官參戰！
          </p>

          {/* Player count options */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {([2, 3, 4] as PlayerCount[]).map((count) => (
              <button
                key={count}
                onClick={() => handleSelect(count)}
                className={`
                  chalk-btn flex flex-col items-center gap-2 py-4 border-2 transition-all duration-200
                  ${selected === count
                    ? 'bg-yellow-500/30 border-yellow-400 shadow-lg shadow-yellow-500/30 scale-105'
                    : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/40'
                  }
                `}
              >
                <span className="text-3xl font-black text-white">{count}</span>
                <span className="text-white/70 text-sm font-semibold">
                  {count === 2 ? '對決' : count === 3 ? '三角' : '四方'}
                </span>
                <div className="mt-1">
                  <LayoutPreview count={count} />
                </div>
              </button>
            ))}
          </div>

          {/* Selected layout info */}
          <div className="bg-white/5 rounded-xl p-3 mb-6 border border-white/10">
            <p className="text-center text-white/80 text-sm">
              {selected === 2 && '⚔️ 兩位指揮官面對面對決！'}
              {selected === 3 && '🔺 三位指揮官三角鼎立！'}
              {selected === 4 && '🏟️ 四位指揮官四方混戰！'}
            </p>
          </div>

          {/* Player colors preview */}
          <div className="flex justify-center gap-3 mb-6">
            {PLAYER_CONFIGS.slice(0, selected).map((cfg) => (
              <div key={cfg.id} className="flex flex-col items-center gap-1">
                <div
                  className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg"
                  style={{ borderColor: cfg.color, backgroundColor: `${cfg.color}33` }}
                >
                  {cfg.emoji}
                </div>
                <span className="text-xs text-white/60">{cfg.name}</span>
              </div>
            ))}
          </div>

          {/* Start button */}
          <button
            onClick={handleStart}
            className="w-full chalk-btn py-4 text-xl font-black text-slate-900 rounded-xl
              bg-gradient-to-r from-yellow-400 to-yellow-500
              hover:from-yellow-300 hover:to-yellow-400
              shadow-lg shadow-yellow-500/40
              transition-all duration-200 hover:scale-[1.02] active:scale-95"
            style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
          >
            🚀 開始戰局！
          </button>
        </div>

        {/* Decorative player setup image */}
        <div
          className="mt-6 w-48 h-48 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl animate-fade-in-up opacity-0"
          style={{ animationDelay: '0.3s' }}
        >
          <img
            src={PLAYER_SETUP_IMG}
            alt="玩家配置示意"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
