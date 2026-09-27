# Project documentation

## Overview

Focus Path is a browser-based study tracker for planning topics and keeping a record of study time. It is a static front-end project with no build system, backend, or external JavaScript dependencies.

## User workflow

Users create a topic with an estimated duration and deadline, then record study sessions against that topic. The dashboard summarizes total time and time studied today. Each topic card displays completion percentage, time remaining, estimated daily pace, and deadline status.

## Data model

The app stores a JSON array under the browser local-storage key `focus-path-topics-v1`. Each topic contains:

- `id`: generated unique identifier
- `name`: topic name
- `dueDate`: target date in `YYYY-MM-DD` format
- `totalMinutes`: planned study time converted to minutes
- `createdAt`: creation timestamp
- `logs`: study entries, each with a date and duration in minutes

All data belongs to the browser profile in which it was entered. There is no account, remote storage, backup, or cross-device synchronization.

## Progress calculations

- Topic completion is logged minutes divided by planned minutes, capped at 100% in the display.
- Daily pace is remaining planned minutes divided across the current day and days remaining until the deadline.
- The on-track summary compares logged time with a linear target based on elapsed time between topic creation and its due date.

## Development

Edit `index.html`, `styles.css`, and `app.js` directly. Open `index.html` in a modern browser to run the project. A static web server can also serve the project root. No dependency installation is needed.

## Current scope and limitations

- Data is local to one browser profile and can be erased by browser storage cleanup.
- There is no import/export, synchronization, account, or server-side persistence.
- The project has no automated test suite or build pipeline.
- Google Fonts are loaded remotely; the page remains usable with fallback fonts if they are unavailable.
