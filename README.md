# Pomodoro Timer

A simple, responsive Pomodoro Timer built with React, TypeScript, and Vite.

## Features
- **Presets**: 5, 10, 20 minutes.
- **Custom Timer**: Enter any integer (1-180 minutes).
- **Accurate Timing**: Uses `Date.now()` delta to prevent drift.
- **Sound**: Plays a bell sound when the timer finishes (using Web Audio API, no external files).
- **Responsive Design**: Works well on Desktop and Mobile.
- **Persistence**: Remembers your last used custom duration.

## How to Run

1.  Navigate to the project directory:
    ```bash
    cd pomodoro-timer
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

4.  Open the link shown in the terminal (usually `http://localhost:5173`).

## Tech Stack
- React
- TypeScript
- Vite
- CSS (custom styled)
