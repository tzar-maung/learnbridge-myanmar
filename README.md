# LearnBridge Myanmar

LearnBridge Myanmar is a free, offline-first teacher-guided learning kit for
volunteers and teachers supporting displaced Myanmar and Arakanese learners age
12+. It is designed for shared phones, tablets, and computers where internet
access may be unstable or unavailable.

## Purpose

Many displaced learners experience interrupted schooling, shared-device access,
and privacy risks. This prototype explores how a small browser-based learning
kit can support catch-up lessons, textbook access, and volunteer-led class
activities while avoiding accounts, real names, or cloud data collection.

## Core Users

- Volunteers and teachers guiding shared-device learning sessions.
- Learners age 12+ who need respectful catch-up learning activities.
- Community helpers who need tools that work without reliable internet.

## Current Features

- Learner nickname saved locally on the device.
- Language selector.
- Progress tracking with a visual progress bar.
- Continue learning panel that opens the next incomplete lesson.
- Class View with activity cards only.
- Facilitator View with setup, downloads, resource categories, textbook links,
  notes, reports, and reset tools.
- Lesson library generated from `lessons.json`.
- Subject filter for finding lessons by topic.
- Focused lesson reader view.
- Mark lesson complete flow.
- Facilitator View with lesson summary and guidance notes.
- Reset progress action for shared-device use.
- Export pilot report action that avoids private child data.
- Kiwix reference section explaining how offline library content could connect.
- Offline setup checklist for preparing a device before a class.
- Content review status labels for draft and locally reviewed lesson material.
- Teacher resource links powered by `resources.json`.
- Grade 1 textbook download links and local PDF opener for teachers.
- Simple privacy quiz.
- Service worker cache for offline-first behavior.

## Lesson Content

Lessons are stored in `lessons.json` so content is separate from app behavior.
Each lesson includes:

```json
{
  "id": "safety",
  "icon": "1",
  "title": "Learning safely",
  "subject": "Digital safety",
  "level": "Starter",
  "description": "Short lesson summary.",
  "content": "Full learner-facing lesson text.",
  "goal": "What the learner should understand.",
  "steps": ["Short guided activity step."],
  "practice": "Small learner activity.",
  "checkQuestion": "Simple comprehension question.",
  "references": [
    {
      "title": "Trusted source title",
      "url": "https://example.org"
    }
  ],
  "reviewStatus": "Draft",
  "teacherNote": "Guidance for teachers or volunteers."
}
```

Trusted resource links are stored in `resources.json`. Facilitator View shows the
resources that match each lesson subject:

```json
{
  "subject": "Math",
  "items": [
    {
      "title": "Khan Academy offline options",
      "source": "Khan Academy",
      "type": "Math and science practice",
      "access": "App download or Kolibri for offline use",
      "url": "https://www.khanacademy.org/downloads",
      "note": "Useful for structured math practice."
    }
  ]
}
```

## Tech Stack

- HTML for structure.
- CSS for layout and visual design.
- JavaScript for app behavior.
- JSON for lesson content.
- `localStorage` for local progress.
- Service worker for offline caching.
- Python `http.server` for local development only.

## How To Run Locally

Open a terminal in the project folder:

```powershell
cd learnbridge
python -m http.server 4173 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:4173/?fresh=43
```

The local server is needed because the app loads lesson data from
`lessons.json`.

## Privacy And Safety Choices

- No account is required.
- No real child name is required.
- No phone number, email, document number, or location is collected.
- Progress stays in browser storage on the device.
- Reset progress is placed in Facilitator View for shared-device privacy.

## Offline-First Design

The service worker caches the app files and lesson data. When online, the app
tries to load fresh files first. If the network is unavailable, it falls back to
cached files.

For a pilot, open the app once while the local server is running, open at least
one lesson, then test with internet or Wi-Fi turned off. This confirms the
browser has cached the app for offline use on that device.

External teacher resource links are not automatically available offline. A
teacher or volunteer needs to download those materials separately in tools such
as Kiwix Reader, Kiwix Server, or Kolibri before using them without internet.

Official textbook PDFs are linked for teacher access but are not bundled in
LearnBridge. Teachers can download PDFs separately, then use the Facilitator View
file picker to open a saved PDF during offline sessions.

For development on this laptop, LearnBridge only needs Python's local server.
For real offline reading, install Kiwix Reader and download selected ZIM files
before leaving internet access. Kolibri is optional and better suited for a
larger course library.

## Kiwix Integration Plan

Kiwix is a separate offline knowledge tool. It can open downloaded ZIM files,
such as offline encyclopedias, books, and other educational collections.

For this MVP, LearnBridge does not bundle Kiwix content. The app only explains
where Kiwix fits. A realistic deployment could use:

- Kiwix Reader on one teacher laptop, tablet, or phone.
- Downloaded ZIM files chosen by language, age level, and topic.
- Kiwix Server on a local laptop or small server, so nearby learners can open
  the library through a browser on the same local network.

Useful official links:

- Kiwix: https://kiwix.org/en/
- Kiwix Reader: https://get.kiwix.org/en/solutions/applications/kiwix-reader/
- Kiwix Server: https://get.kiwix.org/en/solutions/applications/kiwix-server/
- Kiwix catalog: https://get.kiwix.org/en/solutions/catalog/

## Current MVP Scope

This is a frontend-only prototype. It does not include:

- user accounts
- backend database
- cloud sync
- analytics
- admin content management
- real Kiwix server integration

Those features are intentionally left out to keep the first version simple,
privacy-friendly, and realistic for a one-month portfolio project.

## Future Improvements

- Add more lesson packs by subject and age level.
- Add printable worksheet files.
- Add audio support for early readers.
- Add import/export for progress.
- Add local Wi-Fi sharing for classrooms or community centers.
- Add deeper Kiwix integration.
- Redesign the UI after the core feature set is stable.

## Portfolio Focus

This project demonstrates:

- frontend fundamentals
- offline-first thinking
- local data storage
- data-driven UI rendering
- learner and teacher mode switching
- privacy-aware product design
- humanitarian technology constraints
