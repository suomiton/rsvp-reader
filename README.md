# RSVP Reader

A frontend-only RSVP (Rapid Serial Visual Presentation) speed-reading web app.

## Prerequisites

- Node.js 18+ (recommended: 22 LTS)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
npm run preview
```

## Usage

1. Paste or type text on the editor page
2. Click "Lets read"
3. **Hold spacebar** to advance words at WPM speed
4. **Release spacebar** to pause
5. **Arrow keys** to step forward/back when paused
6. **Escape** to return to the editor
7. Adjust WPM (50-1200) with the input in the bottom-left corner

## Tech Stack

- React 19 + TypeScript (strict)
- Vite
- Tailwind CSS v3
- React Router v7
- Global state via useReducer + Context
