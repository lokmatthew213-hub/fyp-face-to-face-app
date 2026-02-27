// ============================================================
// 百分戰局 Percent Battle — Main Page
// Flow: Setup → Tutorial → Card Draw → Game Board
// ============================================================

import { useGame } from '@/contexts/GameContext';
import SetupScreen from '@/components/SetupScreen';
import GameBoard from '@/components/GameBoard';
import Tutorial from '@/components/Tutorial';
import CardDraw from '@/components/CardDraw';

export default function Home() {
  const { state, skipTutorial, finishCardDraw } = useGame();

  // Setup screen
  if (state.phase === 'setup') {
    return <SetupScreen />;
  }

  // Tutorial overlay (shown on top of blurred game board background)
  if (state.phase === 'tutorial') {
    return (
      <div className="relative w-full h-full">
        {/* Game board in background (blurred) */}
        <div style={{ filter: 'blur(4px)', pointerEvents: 'none', position: 'absolute', inset: 0 }}>
          <GameBoard />
        </div>
        {/* Tutorial overlay */}
        <Tutorial onComplete={skipTutorial} />
      </div>
    );
  }

  // Card draw animation
  if (state.phase === 'card-draw') {
    return (
      <div className="relative w-full h-full">
        {/* Game board in background */}
        <div style={{ filter: 'blur(2px)', pointerEvents: 'none', position: 'absolute', inset: 0 }}>
          <GameBoard />
        </div>
        {/* Card draw animation overlay */}
        {state.currentContextCard && (
          <CardDraw
            card={state.currentContextCard}
            onComplete={finishCardDraw}
          />
        )}
      </div>
    );
  }

  // Main game board (playing, win-declare, fire-*, trap-*, round-end, game-over)
  return <GameBoard />;
}
