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

## Phase 4: Four-Side Layout & Color Redesign
- [x] Player icons on four sides (top/bottom/left/right) — no text rotation
- [x] 2-player: top and bottom
- [x] 3-player: top, bottom-left, bottom-right
- [x] 4-player: top, bottom, left, right
- [x] All player text/labels face same direction (no rotation)
- [x] Vibrant cheerful color palette for primary students
- [x] Bright gradient background (not dark chalkboard)
- [x] Player colors updated to vivid fun palette
- [x] UI components use light, playful colors

## Phase 5: Context Card Block Layout Fix
- [x] Fix color legend text cut-off in 4-player mode (overflow visible)
- [x] Change block layout: each color group in separate column set, 5 blocks per column
- [x] Students can count using multiples of 5 (e.g. 11 red = 2 full columns + 1)
- [x] Color groups displayed side by side with clear separator
- [x] Block size appropriate for iPad landscape view

## Phase 6: Tutorial & Card Draw Animation
- [x] Multi-page animated tutorial after player selection
- [x] Tutorial pages: setup, gameplay, tactics A/B/C, winning
- [x] Prev/Next/Skip navigation buttons in tutorial
- [x] Slide-in/out page transition animations
- [x] Animated context card draw sequence (flip card animation)
- [x] Card draw shows suspense before revealing the context card
- [x] Wire tutorial → card draw → game board flow in GameContext

## Phase 7: Bug Fixes (Feb 28)
- [x] Fix AI response: parse JSON and show only friendly message (no raw JSON code)
- [x] Refine AI prompt: accept both 算式 form (A/B×100%) and final answer form (X%)
- [x] Show explanation when AI says correct (not just "pass")
- [x] Add +/- zoom buttons in context card area for device scaling
- [x] Fix player zone score sync: show totalScore not round score
- [x] Add player name input fields in setup screen
