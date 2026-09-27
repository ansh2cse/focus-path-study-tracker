# Focus Path

Focus Path is a simple, responsive study tracker that helps you plan learning topics, set target dates, record study sessions, and follow your progress.

## Features

- Add topics with a due date and estimated study time.
- Record study sessions by date, in minutes or hours.
- View total focused time, today's study time, and topics on track.
- See completion progress, remaining time, daily pace, and deadline status for each topic.
- Save your data automatically in the browser using `localStorage`.
- Use the dashboard on desktop or mobile screens.

## Run locally

No build step, package manager, or server is required. Clone or download the repository, then open `index.html` in a modern browser.

For a local web server, you can use any static file server. For example, with Python installed:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>.

## How to use

1. Add a topic, its due date, and the estimated amount of study time.
2. Record each study session and select its date.
3. Review the dashboard and topic cards to see progress and suggested daily pace.
4. Delete a topic with its × button, or use **Clear all data** to remove every topic and session from this browser.

## Data and privacy

Focus Path has no server or account system. Topics and study logs are stored in the current browser's local storage on the device. They are not synced between browsers or devices. Clearing the browser's site data removes them. **Clear all data** permanently removes the app's saved topics and logs from that browser after confirmation.

## Project files

- `index.html` — page structure and forms
- `styles.css` — layout, responsive behavior, and visual styling
- `app.js` — topic and session logic, progress calculations, and local storage

## Built with

HTML, CSS, and vanilla JavaScript. The interface loads DM Sans and Playfair Display from Google Fonts when an internet connection is available; system fallback fonts are used otherwise.

## License

No license has been selected yet. Add a license before allowing others to reuse or distribute this project.
