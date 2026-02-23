# 百分戰局 Percent Battle — TODO

## Phase 1: Core Features
- [x] Project scaffold with tRPC + Express + React
- [x] Chalkboard design system (dark green, chalk-white, color blocks)
- [x] Google Fonts integration (Nunito + Noto Sans TC)
- [x] Player count selection screen (2/3/4 players)
- [x] Layout preview for each player count (2=opposite, 3=triangle, 4=four-sides)
- [x] Context card display with color boxes (no numbers shown)
- [x] 10 context cards with correct color/total data
- [x] Color block grid (students count themselves)
- [x] Player zone components with rotation for each side
- [x] Win declaration flow trigger (tap player icon)
- [x] Win type selection: 火力全開 vs 設下陷阱
- [x] Photo capture for AI verification
- [x] Poe API integration (OpenAI SDK format, gemini-3-flash)
- [x] Backend tRPC route for AI verification (server-side API key)
- [x] 火力全開 result display with AI reasoning
- [x] 火力全開 subtype: 自摸 vs 突襲
- [x] 突襲 target player selection
- [x] 設下陷阱 result display with AI reasoning
- [x] Trap answerer selection (which player answered / no one)
- [x] Game state reducer with all phases
- [x] Score display bar
- [x] Game top bar with back + draw new card
- [x] CSS animations (block reveal, bounce-in, fade-in-up)
- [x] Responsive layout for mobile/tablet

## Phase 2: Scoring System & Round Management
- [x] Card count stepper input in 火力全開 flow
- [x] Card count stepper input in 設下陷阱 flow (proposer + answerer)
- [x] 火力全開 自摸 scoring: winner gets marks = card count
- [x] 火力全開 突襲 scoring: 出銃 player pays marks = card count to winner
- [x] 設下陷阱 no-answer scoring: proposer gets marks = card count
- [x] 設下陷阱 answered scoring: answerer gets proposer cards + answer cards, proposer gets 0
- [x] Round end summary screen (RoundEnd component)
- [x] Draw new context card at start of each round
- [x] Persist totalScore across rounds (never resets)
- [x] Win condition: first player to reach 50 total marks wins
- [x] Game-over screen with winner announcement + confetti
- [x] Final leaderboard with progress bars on game-over screen
- [x] Return to home button on game-over screen
- [x] Score bar showing totalScore with progress toward 50
- [x] Round counter in top bar
- [x] 23 unit tests passing (scoring logic, context cards, AI prompts)

## Phase 3: Future Features
- [ ] Player name editing before game start
- [ ] Sound effects for win/lose
- [ ] 15-minute recess timer
- [ ] Game history export
- [ ] Teacher mode (show hints/answers)

## Phase 3: Layout & Camera Fixes
- [x] All player zones text faces same direction (no text rotation)
- [x] Landscape orientation: game board uses horizontal layout
- [x] Context card display area is horizontal rectangular (not vertical)
- [x] 2-player: both players on bottom, context card fills center horizontally
- [x] 4-player: all 4 players on bottom row, context card fills top area
- [x] Enable direct camera capture (not just file upload) in photo step
- [x] Camera button opens device camera directly on mobile/tablet
