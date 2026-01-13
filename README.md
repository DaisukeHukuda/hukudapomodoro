# Pomodoro Timer

A premium, aesthetic Pomodoro timer application built with React, TypeScript, and Tailwind CSS.

## Features

- **Timer Logic**: Robust timestamp-based tracking independent of render cycles.
- **Aesthetics**: Clean, spacious UI with smooth animations and "Glassmorphism" touches.
- **Controls**: Preset durations (5, 10, 20 min) and custom inputs.
- **Feedback**: Dynamic progress ring, detailed title updates, and audio notification.
- **States**: Clear distinction between Idle, Running, Paused, and Finished states.

## Setup & Running

This project uses [Vite](https://vitejs.dev/).

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Architecture

- **`useTimer` Hook**: Encapsulates all timer logic. It calculates remaining time based on an absolute `endTime` timestamp rather than decrementing a counter. This ensures accuracy even if the browser tab sleeps or freezes.
- **Components**:
  - `TimerDisplay`: Handles the large text and document title side-effects.
  - `ProgressRing`: SVG-based visualization using `stroke-dashoffset` for smooth updates.
  - `Controls`: State-aware buttons.
- **Styling**: Utility-first CSS with Tailwind, extending the theme with custom `navy` and `primary` blues.

## Technology Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Lucide React (Icons)
