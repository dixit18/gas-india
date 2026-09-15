# CONTRACT — gas-india

## Stack
Vite React + Tailwind + tweakcn pastel theme + framer-motion. Express API in `src/`. Atlas `gas_prod/dev`.

## Safety (non-negotiable)
Pre-written polls only, no free text, no DMs. Colleges 18+ first. No pay-to-reveal identity (grade-band hint max). One vote per poll per voterKey (409 on double).

## API
- GET /health, GET /api/schools, POST /api/schools
- GET /api/schools/:id/polls, POST /api/polls/:id/vote {optionIdx,voterKey,grade}
- GET /api/flames?user=NAME

## Collections
schools, polls(question,options[4],category), votes(pollId+voterKey unique), flames(toUser,fromHint,question).
Seed: demo college + 4 Hinglish polls.

## US check
Gas loop imitated (school graph, flames, hourly), dating polls removed, Android-first, Hindi packs.
