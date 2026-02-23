// ============================================================
// 百分戰局 Percent Battle — Main Page
// Design: Playful Classroom Chalkboard
// Orchestrates: Setup → Game Board
// ============================================================

import { useGame } from '@/contexts/GameContext';
import SetupScreen from '@/components/SetupScreen';
import GameBoard from '@/components/GameBoard';

export default function Home() {
  const { state } = useGame();

  if (state.phase === 'setup') {
    return <SetupScreen />;
  }

  return <GameBoard />;
}
