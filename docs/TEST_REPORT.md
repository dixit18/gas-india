# TEST REPORT — gas-india P3 MVP (2026-09-14, test agent)

## API (live, memory mode)
- [x] GET /health → {ok, app}
- [x] GET /api/schools → 1 demo college
- [x] GET /api/schools/demo-college/polls → 4 seed polls
- [x] POST /api/polls/poll0/vote → flame sent
- [x] Double vote same voterKey → 409
- [x] GET /api/flames?user=Aarav → 1 flame
- Note: first test run used 2-char voterKey (min 3) → 400 correctly; validation working as designed.

## UI static
- [x] 360/768/1440, 44px targets, pastel theme, framer home, Hindi toggle

## Pending P4
- [ ] client `vite build`, moderation queue, school onboarding, Lighthouse >85, Atlas gas_prod
