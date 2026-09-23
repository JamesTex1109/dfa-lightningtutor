# DFA Lightning Tutor

An interactive web app for practicing **deterministic finite automata (DFAs)**. It shows you a DFA diagram, asks a question about it, and gives instant feedback with sound effects, so you can drill automata theory the way you'd drill flashcards.

<!-- Add a screenshot or GIF of the app here -->
<!-- ![Screenshot](public/images/screenshot.png) -->

**Live demo:** <!-- add your Vercel/Netlify link here -->

## Features
- Practice exercises built on DFA diagrams
- Instant right/wrong feedback with audio cues
- Exercises stored in `src/exercises.json`, so new problems can be added without touching the app code

## Tech Stack
React · TypeScript · Vite

## Run Locally
```bash
npm install
npm run dev
```
Then open the local URL Vite prints (usually `http://localhost:5173`).

## Adding Exercises
Add a new entry to `src/exercises.json` and drop its diagram in `public/images/`.

## Why I Built It
<!-- 1-2 sentences in your own words, e.g. studying for automata/programming languages and wanting faster practice than the textbook -->
